import browser from "webextension-polyfill";

console.log("Hello from content script");

let lastCount = 0;
let currentlyFired = false;
let videoList: YouTubeVideo[] = [];
let lastVideoListLength = 0;
window.onload = handlePageLoad;
//TODO: Trigger on window.location.href change

interface YouTubeVideo {
  title: string;
  channel: string;
  clicks: number;
  age: string;
  element: HTMLElement;
}


function handlePageLoad() {
  switch (identifyYouTubePage(window.location.href)) {
    case "Home Page":
      handleHomePage();
      break;
    case "Results Page":
      console.log("Do something for Results Page");
      break;
    case "Shorts":
      console.log("Do something for Shorts");
      break;
    case "Video Page":
      console.log("Do something for Video Page");
      break;
    case "Subscriptions Feed":
      console.log("Do something for Subscriptions Feed");
      break;
    default:
      console.log("Unknown page, handle accordingly.");
  }
}

function handleHomePage() {
  /*
  * Put all the videos in a List with objects that include: title, channel, clicks, age, HTMLElement
  * 
  **/
  try {
    let primaryContainer = document.getElementById("primary");
    let contents = primaryContainer.querySelectorAll("#content") as NodeListOf<HTMLElement>;
    videoList.length = 0;
    for (let content of contents) {
      try {
        let dismissible = content.querySelector("#dismissible");
        let menu = dismissible.querySelector("#menu");
        let title = (dismissible.querySelector("#video-title") as HTMLElement).innerText;
        //menu.querySelectorAll('button[id="button"]')[0].querySelectorAll("div")[0].click();
        videoList.push({
          title: title,
          channel: "",
          clicks: 1,
          age: "",
          element: content,
        });

      } catch (err) { continue }
    }
  } finally {
    if (videoList.length > 10) {
      if (lastVideoListLength != videoList.length) {
        lastVideoListLength = videoList.length
        console.log(videoList);
      }
      setTimeout(() => {
        handlePageLoad();
      }, 5000);
    } else {
      setTimeout(() => {
        handlePageLoad();
      }, 2000);
    }
  }
}

function identifyYouTubePage(url) {
  const ytResultsPattern = /.*:\/\/.*youtube\.com\/results.*/i;
  const ytHomePattern = /.*:\/\/(?:www|m)\.youtube\.com\/?$/i;
  const ytShortsPattern = /.*:\/\/.*youtube\.com\/shorts.*/i;
  const ytVideoPattern = /.*:\/\/.*youtube\.com\/watch\?v=.*/i;
  const ytSubsPattern = /\/feed\/subscriptions$/i;

  if (ytResultsPattern.test(url)) return "Results Page";
  if (ytHomePattern.test(url)) return "Home Page";
  if (ytShortsPattern.test(url)) return "Shorts";
  if (ytVideoPattern.test(url)) return "Video Page";
  if (ytSubsPattern.test(url)) return "Subscriptions Feed";

  return "Unknown";
}


function waitForCondition(selector: string, conditionFunc: (element: Element) => boolean): Promise<Element> {
  return new Promise((resolve, reject) => {
    const target = document.querySelector(selector);
    if (!target) {
      reject(new Error(`No element found for selector: ${selector}`));
      return;
    }

    const observer = new MutationObserver((mutations, observer) => {
      const element = document.querySelector(selector);
      if (element && conditionFunc(element)) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  });
}


