import { GPTVersion, type YoutubeVideo } from "../types";
import { promptChatGPT } from "./api/openAI";
const THRESHOLD = 0.5
export async function findVideosToBlock(videolist: YoutubeVideo[], filterCondition = "Filter out all videos that are not useful to me, like memes or other useless stuff. Keep music and bildungsorientiertes das mir wirklich nachhaltig was bringt. Alles andere soll weg.") {
    // Based on multiple tests, we do not need to pass anything else, the order of scores is correct in the answer. An Array is enough.
    // GPT3 is not recommended. It blocks very arbitrarily.
    let videoLabels = videolist.map(video => video.label).join("\n")
    let chatGPTResponse = await promptChatGPT(`You get a list of videos to recommend to a user. Based on the filter condition "${filterCondition}", give a percentage score of how probable it is that the user wants to see this video. Return nothing but a JSON in the form { "filterValues": [0.xx, ...] }`,
        `The videos are:\n${videoLabels}`, GPTVersion.GPT_4)
    console.log(chatGPTResponse);
    let parsedResponse = JSON.parse(chatGPTResponse)
    console.log(parsedResponse);
    for (let video in videolist) {
        if (parsedResponse["filterValues"][video] <= THRESHOLD) {
            videolist[video].block = true
        } else {
            videolist[video].block = false
        }
    }
    console.log(videolist);
    return parsedResponse
}

