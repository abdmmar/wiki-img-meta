import { getImageMetadata } from '.'

describe('getImageMetadata', () => {
  test('should return the given url', () => {
    const url = 'https://abdmmar.tech'
    expect(getImageMetadata(url)).toEqual(url)
  })
})
