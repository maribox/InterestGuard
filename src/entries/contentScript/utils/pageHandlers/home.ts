import { findVideosToBlock } from "../../data/repository";
import type { YoutubeVideo } from "../../types";
import { handlePageLoad } from "../handling";

let videolist: YoutubeVideo[] = [];
let lastvideolistlength = 0;

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
                let menu = dismissible.querySelector("#menu");
                let title = (dismissible.querySelector("#video-title") as HTMLElement).innerText;
                let labelElement = dismissible.querySelector("#video-title-link")
                let label = labelElement.getAttribute("aria-label")
                let id = labelElement.getAttribute("href").match(/\/watch\?v=(.{11})/)[1]
                //menu.queryselectorall('button[id="button"]')[0].queryselectorall("div")[0].click();
                videolist.push({
                    label: label,
                    id: id,
                    title: title,
                    element: content,
                    block: false
                });
            } catch (err) { continue }
        }
    } finally {
        if (videolist.length > 10) {
            if (lastvideolistlength != videolist.length) {
                lastvideolistlength = videolist.length
                console.log(videolist);
            }
            findVideosToBlock(videolist);
//                blockVideos(videolist).then(setTimeout(() => {
//                handlePageLoad();
//            }, 5000));
        } else {
            setTimeout(() => {
                handlePageLoad();
            }, 2000);
        }
    }
}


function blockVideos(videolist: YoutubeVideo[]) {
    throw new Error("Function not implemented.");
}

