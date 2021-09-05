# wiki-img-meta

[![TypeScript](https://img.shields.io/npm/types/scrub-js.svg)](https://www.typescriptlang.org/)
[![Code style: ESLint](https://img.shields.io/badge/code%20style-ESLint-blueviolet)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Get Wikipedia image metadata

## Installation

```bash
npm install wiki-img-meta
```

## Usage

```js
import { getImageMetadata } from 'wiki-img-meta'

const url = 'https://id.wikipedia.org/wiki/Berkas:Rinjani_Caldera.jpg'

getImageMetadata(url)
  .then((metadata) => console.log(metadata))
  .catch((err) => console.error(err))
```

## API

### getImageMetadata(url: string): Promise

#### Parameters

- url: string

  URL of the image

  For example:

  - https://commons.wikimedia.org/wiki/File:Val%C3%A8re_et_Haut_de_Cry.jpg
  - https://de.wikipedia.org/wiki/Datei:Cornelia_Froboess.jpg
  - https://pt.wikipedia.org/wiki/Ficheiro:Fran%C3%A7ois-Ren%C3%A9_de_Chateaubriand_by_Anne-Louis_Girodet_de_Roucy_Trioson.jpg

#### Returns

- Promise with Metadata object

  ```
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

  type License = {
    type: string | null
    link: string | null
  }
  ```

## Contributing

Feel free to [submit an issues](https://github.com/abdmmar/wiki-img-meta/issues) and create
[pull requests](https://github.com/abdmmar/wiki-img-meta/pulls).

### Learn more

- [Commitizen](https://www.npmjs.com/package/commitizen)

## License

[MIT License](LICENSE)
