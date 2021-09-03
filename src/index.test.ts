import { getImageMetadata } from '.'

describe('getImageMetadata', () => {
  test('should return Metadata', async () => {
    const url = 'https://id.wikipedia.org/wiki/Berkas:Rinjani_Caldera.jpg'

    const metadata = await getImageMetadata(url)

    expect(typeof metadata).toBe('object')
  })
})
