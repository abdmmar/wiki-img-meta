import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

type CheerioRoot = ReturnType<typeof cheerio.load>

type License = {
  type: string | null
  link: string | null
}

type Metadata = {
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

export function getImage($: CheerioRoot) {
  return $('.fullMedia p a.internal')['0'] as any
}

export function getSrc($: CheerioRoot): string | null {
  const image = getImage($)

  if (image == null) return null
  if (image.attribs == null) return null

  const src = 'https:' + image.attribs.href
  return src
}

export function getTitle($: CheerioRoot): string | null {
  const image = getImage($)

  return image?.attribs?.title ?? null
}

export function getDate($: CheerioRoot): Date | null {
  const date = $('#fileinfotpl_date ~ td time')?.attr('datetime')?.split(' ')[0]

  return date != null ? new Date(date) : null
}

export function getOriginalSource($: CheerioRoot) {
  return $('#fileinfotpl_src ~ td a')?.attr('href') ?? null
}

export function getAuthor($: CheerioRoot) {
  return $('#fileinfotpl_aut ~ td')?.text()?.trim() ?? null
}

export function getFileInfo($: CheerioRoot) {
  const fileInfoText = $('.fullMedia p .fileInfo').text()

  const [dimensionsText, sizeText, typeText] = fileInfoText.slice(1, fileInfoText.length - 1).split(', ')
  const [width, , height] = dimensionsText?.split(' ')
  const size = sizeText?.split(': ')[1] ?? null
  const type = typeText?.split(': ')[1] ?? null

  return { width: width ?? null, height: height ?? null, size, type }
}

export function getLicense($: CheerioRoot): License | License[] | null {
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
