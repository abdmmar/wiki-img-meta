import * as cheerio from 'cheerio'
import { getLicense } from './lib'

describe('getLicense', () => {
  it('should return `null` if license is not found', () => {
    const $ = cheerio.load('<div>Get Wikipedia Image Metadata</div>')
    const license = getLicense($)

    expect(license).toBeNull()
  })
})
