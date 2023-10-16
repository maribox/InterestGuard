import { handleHomePage } from "./pageHandlers/home";

const RESULTS_REGEX = /.*:\/\/.*youtube\.com\/results.*/i;
const HOME_REGEX = /.*:\/\/(?:www|m)\.youtube\.com\/?$/i;
const SHORTS_REGEX = /.*:\/\/.*youtube\.com\/shorts.*/i;
const VIDEO_REGEX = /.*:\/\/.*youtube\.com\/watch\?v=.*/i;
const SUBSCRIPTIONS_REGEX = /\/feed\/subscriptions$/i;

export function handlePageLoad() {
    const url = window.location.href
    if (HOME_REGEX.test(url)) {
        handleHomePage();
    } else if (RESULTS_REGEX.test(url)) {
        console.log("do something for results page");
    } else if (SHORTS_REGEX.test(url)) {
        console.log("do something for shorts");
    } else if (VIDEO_REGEX.test(url)) {
        console.log("do something for video page");
    } else if (SUBSCRIPTIONS_REGEX.test(url)) {
        console.log("do something for subscriptions feed");
    } else {
        console.log("unknown page, handle accordingly.");
    }
}
