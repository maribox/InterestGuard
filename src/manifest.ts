import pkg from "../package.json";

const manifest = {
  action: {
    default_icon: {
      16: "icons/Icon-16.png",
      20: "icons/Icon-20.png",
      32: "icons/Icon-32.png",
      48: "icons/Icon-48.png",
    },
    default_popup: "src/entries/popup/index.html",
  },
  background: {
    service_worker: "src/entries/background/main.ts",
  },
  content_scripts: [
    {
      js: ["src/entries/contentScript/main.ts"],
      matches: ["*://*.youtube.com/*"],
    },
  ],
  host_permissions: ["*://*.youtube.com/*"],
  icons: {
    16: "icons/Icon-16.png",
    20: "icons/Icon-20.png",
    32: "icons/Icon-32.png",
    48: "icons/Icon-48.png",
    64: "icons/Icon-64.png",
    96: "icons/Icon-96.png",
    128: "icons/Icon-128.png",
    256: "icons/Icon-256.png",
    512: "icons/Icon-512.png",
  },
  options_ui: {
    page: "src/entries/options/index.html",
    open_in_tab: true,
  },
};

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: 3,
    ...manifest,
  };
}
