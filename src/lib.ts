import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export type License = {
  type: string | null
  link: string | null
}

export type Metadata = {
  link: string
  title: string
  width: string
  height: string
  size: string
  type: string
  date: Date | null
  original_source: string | null
  author: string | null
  src: string
  license: License | License[] | null
}

/**
 * Get Wikipedia Image Metadata by URL
 */

export async function getImageMetadata(url: string): Promise<Metadata> | null {
  if (!url) return null

  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  const metadata: Metadata = {
    link: url,
    title: getTitle($),
    date: getDate($),
    original_source: getOriginalSource($),
    author: getAuthor($),
    src: getSrc($),
    license: getLicense($),
    ...getFileInfo($),
  }

  return metadata
}

export function getImage($: cheerio.Root) {
  return $('.fullMedia p a.internal')['0'] as any
}

export function getSrc($: cheerio.Root): string | null {
  const image = getImage($)

  if (image == null) return null
  if (image.attribs == null) return null

  const src = 'https:' + image.attribs.href
  return src
}

export function getTitle($: cheerio.Root): string | null {
  const image = getImage($)

  return image?.attribs?.title ?? null
}

export function getDate($: cheerio.Root): Date | null {
  const date = $('#fileinfotpl_date ~ td time')?.attr('datetime')?.split(' ')[0]

  return date != null ? new Date(date) : null
}

export function getOriginalSource($: cheerio.Root) {
  return $('#fileinfotpl_src ~ td a')?.attr('href') ?? null
}

export function getAuthor($: cheerio.Root) {
  const author = $('#fileinfotpl_aut ~ td')?.text()?.trim()

  return author != '' && author != null ? author : null
}

export function getFileInfo($: cheerio.Root) {
  const fileInfoText = $('.fullMedia p .fileInfo').text()

  const [dimensionsText, sizeText, typeText] = fileInfoText?.slice(1, fileInfoText?.length - 1)?.split(', ')
  const [width, , height] = dimensionsText?.split(' ')
  const size = sizeText?.split(': ')[1] ?? null
  const type = typeText?.split(': ')[1] ?? null

  const fileInfo = { width: width != '' && width != null ? width : null, height: height ?? null, size, type }

  return fileInfo
}

export function getLicense($: cheerio.Root): License | License[] | null {
  const licenseTypeList = $('.licensetpl_short')
  const licenseLinkList = $('.licensetpl_link')

  if (licenseTypeList.length === 0 && licenseLinkList.length === 0) {
    return null
  }

  if (licenseTypeList.length === 1 && licenseLinkList.length === 1) {
    const license: License = {
      type: licenseTypeList?.text()?.trim(),
      link: licenseLinkList?.text()?.trim(),
    }

    return license
  }

  const licenseList: License[] = []

  licenseTypeList.each((i, elem) => {
    const item = elem as any

    const license: License = {
      type: $(item)?.text(),
      link: licenseLinkList[`${i}`]?.children[0].data,
    }

    licenseList.push(license)
  })

  return licenseList
}
