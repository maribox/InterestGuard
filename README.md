InterestGuard: A Chrome extension that enhances your YouTube browsing experience by automatically marking videos as "Not Interested" if they fall below your personalized interest threshold. Say goodbye to clutter and hello to a cleaner, more relevant video feed. Perfect for anyone tired of wading through irrelevant content. 

## Features
- Auto-press "Not Interested" for videos below your specified rating.
- Customize your interest threshold with a simple, intuitive UI.
- Intelligent algorithm learns your preferences over time for even better filtering.

## Installation
Follow the standard Chrome Extension installation process. More details in the README.

## How it works
The extension utilizes GPT4 to determine the likelihood of a video being of interest to you, then marks those below your set threshold as "Not Interested."

## Contributing
Feel free to submit PRs, bug reports, and feature requests.

## License
MIT License. See LICENSE file for details.


## Project Setup

```sh
npm install
```

## Commands
### Build
#### Development, HMR

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads
Currently only works in Chromium based browsers.
```sh
npm run dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts)
```sh
npm run watch
```

#### Production

Minifies and optimizes extension build
```sh
npm run build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser
```sh
npm run serve:chrome
```

```sh
npm run serve:firefox
```
## References
Based on [this template](https://github.com/samrum/create-vite-plugin-web-extension)