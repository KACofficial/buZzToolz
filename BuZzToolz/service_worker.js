chrome.runtime.onInstalled.addListener(init);

function init() {console.log("service_worker.js loaded");} // 3 lines,
// this actually does nothing
