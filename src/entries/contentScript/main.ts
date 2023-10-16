import browser from "webextension-polyfill";
import { handlePageLoad } from "./utils/handling";

console.log("hello from content script");
window.addEventListener('domcontentloaded', () => {
  handlePageLoad();
});
window.onload = handlePageLoad