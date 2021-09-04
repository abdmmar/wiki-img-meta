import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { getFileInfo, getLicense, License } from './lib'

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
})
