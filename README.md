[![npm version](https://badge.fury.io/js/angular2-expandable-list.svg)](https://badge.fury.io/js/angular2-expandable-list)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# polyline-decode

> Encode and decode geo mapping polyline geometry compressed strings, use typescript validation

## Install

```sh
$ npm i polyline-decode
```

## Use


```ts
import PolylineConvert from 'polyline-decode';

const polylineConvert = new PolylineConvert();

polylineConvert.decode('gflbEcsdtEUXa@f@QZc@`@m@bCYzDOfIEjCEpDMnBCn@E^yBxRGl@Ef@Q`D@hDZ~GZxIp@fPj@`P');
// tuple<number>[]

polylineConvert.encode([35.123456,31.654321]);
// string
```

## Credits

Typescript transpile from of https://github.com/jieter/Leaflet.encoded