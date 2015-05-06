# Explosive

A flexible library for stateful server-side rendering.
Everything here is experimental, unstable, buggy and full of dragons. Please do **not* use in production.

Due to the use of [jsdom](https://github.com/tmpvar/jsdom), io.js is required.

## Installation

```
npm install explosive
```

## How it works

Explosive aims to be as unobtrusive as possible. It provides facilities to render your front-end application on the server.

It consists of two parts:

- server middleware — Explosive provides an Express-compatible middleware that takes care of all rendering on the server.
- store - You have to put your data inside an Explosive-managed store to have it synced with the server.

Because the code is very much a proof of concept, only frameworks that support server-side rendering out of the box, like [React](https://github.com/facebook/react), are supported. Other ones that do not have the facilities to attach to pre-existing markup will not work at the moment.

This document will be updated with examples and a more thorough explanation as the design stabilizes.

## License

This project is licensed under the MIT license.
© [Rafał Hirsz](https://hirsz.co).
