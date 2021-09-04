import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import {
  getAuthor,
  getDate,
  getFileInfo,
  getImage,
  getLicense,
  getOriginalSource,
  getSrc,
  getTitle,
  License,
} from './lib'

describe('lib', () => {
  let $: cheerio.Root
  let $empty: cheerio.Root

  beforeAll(async () => {
    const url = 'https://id.wikipedia.org/wiki/Berkas:Rinjani_Caldera.jpg'
    const response = await fetch(url)
    const html = await response.text()

    $ = cheerio.load(html)
    $empty = cheerio.load('<div>Get Wikipedia Image Metadata</div>')
  })

  describe('getLicense', () => {
    it('should return `null` if license is not found', () => {
      const license = getLicense($empty)

      expect(license).toBeNull()
    })

    it('should return License[] | License if license is found', () => {
      const license = getLicense($)

      expect(license).toMatchObject<License | License[]>(license)
    })
  })

  describe('getFileInfo', () => {
    type FileInfo = {
      width: string | null
      height: string | null
      size: string | null
      type: string | null
    }

    it('should return object with `null` value if fileInfo is not found', () => {
      const fileInfo = getFileInfo($empty)

      expect(typeof fileInfo).toBe('object')
      expect(fileInfo).toMatchObject<FileInfo>(fileInfo)
      expect(fileInfo.width).toBeNull()
      expect(fileInfo.height).toBeNull()
      expect(fileInfo.size).toBeNull()
      expect(fileInfo.type).toBeNull()
    })

    it('should return object with FileInfo type if fileInfo is found', () => {
      const fileInfo = getFileInfo($)

      expect(typeof fileInfo).toBe('object')
      expect(fileInfo).toMatchObject<FileInfo>(fileInfo)
    })
  })

  describe('getImage', () => {
    it('should return null if page is empty', () => {
      const image = getImage($empty)

      expect(image).toBeUndefined()
    })

    it('should return image if image is found', () => {
      const image = getImage($)

      expect(image).not.toBeUndefined()
      expect(image.attribs).not.toBeNull()
      expect(image.attribs.href).not.toBeNull()
      expect(image.attribs.title).not.toBeNull()
      expect(typeof image.attribs.href).toBe('string')
      expect(typeof image.attribs.title).toBe('string')
    })
  })

  describe('getAuthor', () => {
    it('should return null if page is empty', () => {
      const author = getAuthor($empty)

      expect(author).toBeNull()
    })

    it('should return author if author is found', () => {
      const author = getAuthor($)

      expect(author).not.toBeNull()
      expect(author).not.toBe('')
      expect(typeof author).toBe('string')
    })
  })

  describe('getSrc', () => {
    it('should return null if page is empty', () => {
      const src = getSrc($empty)

      expect(src).toBeNull()
    })

    it('should return src if src is found', () => {
      const src = getSrc($)

      expect(src).not.toBeNull()
      expect(src).not.toBe('')
      expect(typeof src).toBe('string')
      expect(src.startsWith('https:')).toBe(true)
    })
  })

  describe('getTitle', () => {
    it('should return null if page is empty', () => {
      const title = getTitle($empty)

      expect(title).toBeNull()
    })

    it('should return title if title is found', () => {
      const title = getTitle($)

      expect(title).not.toBeNull()
      expect(title).not.toBe('')
      expect(typeof title).toBe('string')
    })
  })

  describe('getDate', () => {
    it('should return null if page is empty', () => {
      const date = getDate($empty)

      expect(date).toBeNull()
    })

    it('should return date in Date format if date is found', () => {
      const date = getDate($)

      expect(date).not.toBeNull()
      expect(date).not.toBe('')
      expect(typeof date).toBe('object')
      expect(date instanceof Date).toBe(true)
    })
  })

  describe('getOriginalSource', () => {
    it('should return null if page is empty', () => {
      const originalSource = getOriginalSource($empty)

      expect(originalSource).toBeNull()
    })

    it('should return originalSource if originalSource is found', () => {
      const originalSource = getOriginalSource($)

      expect(originalSource).not.toBeNull()
      expect(originalSource).not.toBe('')
      expect(typeof originalSource).toBe('string')
    })
  })
})
