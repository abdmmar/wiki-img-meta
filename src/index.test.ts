import { getImageMetadata } from '.'

/**
 * Current wikipedia page that is not perfectly handled:
 * - China, example: 'https://zh.wikipedia.org/wiki/File:Ida_2021-08-29_1400Z.png'
 * - Japan, example: 'https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB:Sagami_Temple_2600px.jpg'
 */

describe('getImageMetadata', () => {
  it.each([
    { url: 'https://id.wikipedia.org/wiki/Berkas:Rinjani_Caldera.jpg' },
    { url: 'https://commons.wikimedia.org/wiki/File:Val%C3%A8re_et_Haut_de_Cry.jpg' },
    {
      url: 'https://commons.wikimedia.org/wiki/File:American_cover_of_%C2%ABThe_Mysterious_Affair_at_Styles%C2%BB.png?uselang=ru',
    },
  ])('should return metadata from ($url)', async ({ url }) => {
    const metadata = await getImageMetadata(url)

    expect(typeof metadata).toBe('object')
    expect(metadata.link).not.toBeNull()
    expect(metadata.title).not.toBeNull()
    expect(metadata.width).not.toBeNull()
    expect(metadata.height).not.toBeNull()
    expect(metadata.size).not.toBeNull()
    expect(metadata.type).not.toBeNull()
    expect(metadata.src).not.toBeNull()
  })

  it('should return null if url is null', async () => {
    const url = ''

    const metadata = await getImageMetadata(url)

    expect(metadata).toBeNull()
  })

  it('should return object with null value if url is not from wikipedia', async () => {
    const url = 'https://www.google.com'

    const metadata = await getImageMetadata(url)

    expect(metadata).toMatchInlineSnapshot(`
Object {
  "author": null,
  "date": null,
  "height": null,
  "license": null,
  "link": "https://www.google.com",
  "original_source": null,
  "size": null,
  "src": null,
  "title": null,
  "type": null,
  "width": null,
}
`)
  })
})
