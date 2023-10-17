import { GPTVersion, type YoutubeVideo } from "../types";
import { promptChatGPT } from "./api/openAI";
const THRESHOLD = 0.5
const MAX_RETRIES = 3
const DEFAULT_FILTER = "Recommend videos that are either educational and relevant to science, technology, or IT, video essays included, or that are music podcasts and stand-up comedy. Block all videos that are memes, pure entertainment, or offer no valuable information."
/*
alternative filters:
1) Recommend videos that are either educational and relevant to science, technology, or IT, video essays included, or that are music podcasts and stand-up comedy. Block all videos that are memes, pure entertainment, or offer no valuable information.

2) Recommend if:

The video title or description includes educational keywords such as "Physics," "Artificial Intelligence," "Tutorial," "Lecture," or "Talk."
The content is from a whitelisted channel known for educational or quality content.
The video duration exceeds 5 minutes, signifying depth.
Sub-topic flags relevant to my interests like "Quantum Computing" or "Climate Science" are present.
Genre specifications for comedy or music like "Stand-Up," "Podcast," or "Music" are met.
Block if:

Keywords indicative of non-educational content such as "Meme," "Reaction," "Gossip" appear in the title or description.
The video is under 5 minutes, likely lacking substantive content.
*/

export async function findVideosToBlock(videolist: YoutubeVideo[], filterCondition = DEFAULT_FILTER) {
    // Based on multiple tests, we do not need to pass anything else, the order of scores is correct in the answer. An Array is enough.
    // GPT3 is fine for most stuff. 
    // Recommendation to find the perfect filterCondition: 
    // ask chatGPT for videos that got blocked but you didn't want to block them (or the other way around) to improve it!

    let videoLabels = videolist.map(video => `{id: ${video.id}, label: ${video.label}}`).join("\n")
    let chatGPTSystemPrompt = `You get a list of videos to recommend to a user.Based on the filter condition "${filterCondition}", give a percentage score of how probable it is that the user wants to see this video. A low score means the video will be blocked. Return a JSON object containing an array of objects, each with the fields supershortSummary, supershortReasonForScore, and score. The score should be represented as a percentage. Format: { "<id>": { "shortSummary": string, "shortReasonForScore": string, "score": 0.xx },...}`
    for (let retry = 0; retry <= MAX_RETRIES; retry++) {
        try {
            let chatGPTResponse = await promptChatGPT(chatGPTSystemPrompt,
                `The videos are:\n${videoLabels}`, GPTVersion.GPT_3)
            let parsedResponse = JSON.parse(chatGPTResponse)
            console.log(parsedResponse);
           for (let video of videolist) {
                try {
                    if (parsedResponse[video.id]["score"] <= THRESHOLD) {
                        video.block = true
                    } else {
                        video.block = false
                    }
                } catch {
                    console.error(`Failed for video with id: ${video.id}`);
                    console.error(video.label);                    
                }
            }
            console.log(videolist);
            return true
        } catch (error) {
            console.error('Error:', error);
            if (retry < MAX_RETRIES) {
                console.log(`Retrying request - attempt ${retry + 1}/${MAX_RETRIES}`);
            } else {
                console.error(`Retried ${MAX_RETRIES} times. Stopping.`);
                throw error
                return false
            }
        }
    }
}

/*
export async function findVideosToBlock(videolist: YoutubeVideo[], filterCondition = "Filter out all videos that are not useful to me, like memes or other useless stuff. Keep music and bildungsorientiertes das mir wirklich nachhaltig was bringt. Alles andere soll weg.") {
    for (let video in videolist) {
        if (Math.random()>=0.5) {
            videolist[video].block = true
        } else {
            videolist[video].block = false
        }
    }
    return true 
}
*/