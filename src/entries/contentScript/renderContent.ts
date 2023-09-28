import browser from "webextension-polyfill";

export default async function renderContent(
  cssPaths: string[],
  render: (appRoot: HTMLElement) => void
) {
  const appContainer = document.createElement("div");
  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.MODE === "development" ? "open" : "closed",
  });
  const appRoot = document.createElement("div");

  if (import.meta.hot) {
    const { addViteStyleTarget } = await import(
      "@samrum/vite-plugin-web-extension/client"
    );

    await addViteStyleTarget(shadowRoot);
  } else {
    cssPaths.forEach((cssPath: string) => {
      const styleEl = document.createElement("link");
      styleEl.setAttribute("rel", "stylesheet");
      styleEl.setAttribute("href", browser.runtime.getURL(cssPath));
      shadowRoot.appendChild(styleEl);
    });
  }

  shadowRoot.appendChild(appRoot);
  document.body.appendChild(appContainer);

  render(appRoot);
}


// first code concept (working in chrome devtools)
let contents = document.querySelectorAll("#content");
let counter = 0;
for (let content of contents) {
  try {
    if (Array.from(content.children[0].children).some((child) => child.id === "dismissible") && content.querySelectorAll("#dismissible").length == 1) {
      let dismissible = content.querySelectorAll("#dismissible")[0];
      let menu = dismissible.querySelectorAll("#menu")[0];
      console.log(dismissible.querySelectorAll("#video-title")[0].innerText);
      console.log(menu.querySelectorAll('button[id="button"]')[0].querySelectorAll("div")[0].click());
      counter++;
      break;
    }
  } catch {
    continue;
  }
}
let popupoptions = document.getElementsByTagName("ytd-popup-container")[0].getElementsByTagName("tp-yt-paper-listbox")[0].children;
popupoptions[popupoptions.length - 3].click();