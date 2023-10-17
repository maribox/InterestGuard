import { findVideosToBlock } from "../../data/repository";
import type { YoutubeVideo } from "../../types";
import { handlePageLoad } from "../handling";

let videolist: YoutubeVideo[] = [];
let lastvideolistlength = 0;
let maxVideoLengthToBlock = 10
export function handleHomePage() {
    /*
    * put all the videos in a list with objects that include: title, channel, clicks, age, htmlelement
    * 
    **/
    console.log("handling home page")
    try {
        let primarycontainer = document.getElementById("primary");
        let contents = primarycontainer.querySelectorAll("#content") as NodeListOf<HTMLElement>;
        videolist.length = 0;
        for (let content of contents) {
            try {
                let dismissible = content.querySelector("#dismissible");
                let title = (dismissible.querySelector("#video-title") as HTMLElement).innerText;
                let labelElement = dismissible.querySelector("#video-title-link")
                let label = labelElement.getAttribute("aria-label")
                let id = labelElement.getAttribute("href").match(/\/watch\?v=(.{11})/)[1]
                videolist.push({
                    label: label,
                    id: id,
                    title: title,
                    element: content,
                    block: false,
                    done: false
                });
            } catch (err) { continue }
        }
    } finally {
        if (videolist.length > 10) {
            if (lastvideolistlength != videolist.length) {
                lastvideolistlength = videolist.length
                console.log(videolist);
            }
            findVideosToBlock(videolist)
                .then(() => {
                    blockVideos(videolist)
                }).then(() => {
                    /*setTimeout(() => {
                        handlePageLoad();
                    }, 5000)*/
                });
        } else {
            setTimeout(() => {
                handlePageLoad();
            }, 2000);
        }
    }
}


async function blockVideos(videolist: YoutubeVideo[]) {
    for (let video of videolist) {
        if (video.block) {
            const x = window.scrollX;
            const y = window.scrollY;
            await blockVideo(video)
            //hide Video completely from feed
            // TODO: Reorganize rows so that no gaps get created
            // TODO: Make OpenAI Connection into stream so we don't have to wait so long 
            // TODO: Add optional short reason in OpenAI Response to better debug and for higher accuracy 
            // TODO Maybe then even GPT3 answers more correct
            // TODO It could also include "short summary of video" to better debug/higher accuracy
            video.element.parentElement.hidden = true;
            video.done = true;
            window.scrollTo(x, y);
            console.log(`Blocked Video "${video.label}"`); 
            
        }
    }
}

async function blockVideo(video: YoutubeVideo) {
    try {
        let menuButton = await waitForElement(video.element, `div[id='menu'] yt-icon-button[id='button'] button[id='button']`, 10000); 
        menuButton.click();
        let feedbackList = await waitForElement(document.documentElement, "tp-yt-paper-listbox[id=items]", 5000, (element) => element.children.length == 8);
        (feedbackList.children[5] as HTMLElement).click()
        return true;
    } catch (error) {
        console.log('Error:', error);
        console.log(video.element);
        return false;
    }
}

async function waitForElement(contextElement: HTMLElement, query: string, timeoutMs?: number, condition?: (element: HTMLElement | null) => boolean): Promise<HTMLElement> {
    return Promise.race([
        observeOrFetchElement(contextElement, query, condition),
        new Promise<HTMLElement>((_, reject) => setTimeout(() => reject(new Error('Timed out')), timeoutMs))
    ]);
}

function observeOrFetchElement(contextElement: HTMLElement, query: string, condition?: (element: HTMLElement | null) => boolean): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve) => {
        const existingElement = contextElement.querySelector(query) as HTMLElement;
        if (existingElement) {
            return resolve(existingElement);
        }
        const observer = new MutationObserver(() => {
            const targetElement = contextElement.querySelector(query) as HTMLElement;
            if (targetElement && (condition == null || condition(targetElement))) {
                observer.disconnect();
                resolve(targetElement);
            }
        });
        observer.observe(contextElement, {
            childList: true,
            subtree: true
        });
    });
}

