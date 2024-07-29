/*
 * content_scripts/longVideoDownloadLoader.js
 * Author: Vance Perry (Epicman212)
 * Copyright (C) 2024 KillAllChickens
 * Licensed under the GPL-3.0 License
 * DESCRIPTION:
 * This code adds a download button to all videos on bSocial.buzz.
 */
//console.log("Loaded download button loader");

async function checkDownloadEnabled() {
  const result = await browser.storage.sync.get("downloadOptionSet");
  return result.downloadOptionSet;
}

async function initialize() {
  const isDownloadEnabled = await checkDownloadEnabled();
  if (isDownloadEnabled) {
    checkUrl(); // initial check
    //console.log("init checkurl ran");
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  }
}

function checkUrl() {
  const currentUrl = window.location.href;
  if (currentUrl.includes("https://bsocial.buzz/watch")) {
    //console.log("This is a long video");
    addLongDownloadButton();
  } else if (currentUrl.includes("https://bsocial.buzz/shorts")) {
    //console.log("This is a short video");
    addShortsDownloadButton();
  } else {
    //console.log("this is not a video");
    removeDownloadButton(); // Clean up button if not on the target page
  }
}

function addLongDownloadButton() {
  if (document.querySelector(".download-button")) {
    //console.log("Long Video button already exists");
    return; // Button already exists, exit early
  }
  //console.log("Adding Love Video Button");
  const button = document.createElement("button");
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
    </svg> Download
  `;
  button.className = "btn border-0 btn-share download-button";
  // button.setAttribute("data-toggle", "modal");

  button.addEventListener("click", () => {
    const videoPlayer = document.getElementById("my-video");
    const videoPlayerSource = videoPlayer.querySelector("source");

    if (videoPlayerSource && videoPlayerSource.type === "video/mp4") {
      const videoUrl = videoPlayerSource.src;
      const downloadPageUrl = chrome.runtime.getURL(
        `pages/downloadLoader/downloadLoader.html?videoUrl=${encodeURIComponent(
          videoUrl,
        )}&filename=${encodeURIComponent(
          generateFileName(window.location.href),
        )}`,
      );

      window.open(downloadPageUrl, "_blank"); // Opens download page in a new tab
    } else {
      console.error("No video source found or not in MP4 format.");
    }
  });

  const targetElement = document.querySelector(
    ".d-inline-flex.align-items-center.flex-0.gap-10.video-options",
  );
  if (targetElement) {
    const firstButton = targetElement.querySelector("button");
    targetElement.insertBefore(button, firstButton);
  } else {
    document.body.appendChild(button);
  }
}

function addShortsDownloadButton() {
  // Check if the button already exists
  if (document.querySelector(".download-button")) {
    //console.log("Shorts button exists, quitting");
    return; // Button already exists, exit early
  } 
  //console.log("adding shorts button");
  const viewCountDivs = document.querySelectorAll(
    'p[id^="video-views-count-"]',
  );

  viewCountDivs.forEach((viewCountDiv) => {
    const button = document.createElement("div");
    button.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-center",
      "main",
      "position-relative",
      "icon",
      "mb-1",
      "download-button",
    );
    button.style.cursor = "pointer";
    button.style.marginBottom = "1em";

    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
      </svg>
    `;

    // Register event listener for video playing
    // document.querySelectorAll("#my-video").forEach((vid) => {
    //   console.log("Video(s) Found: " + vid);
    //   vid.addEventListener("playing", (event) => {
    //     console.log("Video(s) Playing: ", event);
    //     currentVideo = event.target; // Set current video when it starts playing
    //   });
    // });

    // Add an event listener to handle clicks
    button.addEventListener("click", async () => {
      // if (currentVideo && currentVideo.querySelector("source")) {
      // const videoUrl = currentVideo.querySelector("source").src;
      // const downloadPageUrl = browser.runtime.getURL(
      //   `pages/downloadLoader/downloadLoader.html?videoUrl=${encodeURIComponent(
      //     videoUrl
      //   )}&filename=${encodeURIComponent(
      //     generateFileName(window.location.href)
      //   )}`
      // );
      // window.open(downloadPageUrl, "_blank"); // Opens download page in a new tab
      // } else {
      //   console.error("No video source found or not in MP4 format.");
      // }

      try {
        const doc = await fetchAndParseHTML(window.location.href);
        const video = doc.querySelector("#my-video");
        if (video) {
          const videoSource = video.querySelector("source");
          if (videoSource) {
            const videoUrl = videoSource.src;
            const downloadPageUrl = browser.runtime.getURL(
              `pages/downloadLoader/downloadLoader.html?videoUrl=${encodeURIComponent(
                videoUrl,
              )}&filename=${encodeURIComponent(
                generateFileName(window.location.href),
              )}`,
            );
            window.open(downloadPageUrl, "_blank"); // Opens download page in a new tab
          } else {
            console.error("No video source found.");
          }
        } else {
          console.error("No video element found.");
        }
      } catch (error) {
        console.error("Failed to fetch and parse HTML:", error);
      }
    });

    // Insert button into the DOM
    const parentDiv = viewCountDiv.closest(".mb-3");
    if (parentDiv) {
      parentDiv.parentNode.insertBefore(button, parentDiv);
    }
  });
}

async function fetchAndParseHTML(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  return doc;
}

function removeDownloadButton() {
  const existingButton = document.querySelector(".download-button");
  if (existingButton) {
    existingButton.remove();
  }
}

function generateFileName(url) {
  const filenameWithExtension = url.split("/").pop();
  return filenameWithExtension.replace(/\.html$/, ".mp4"); // Regex to replace .html extension with .mp4
}

function handleMutations(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" || mutation.type === "attributes") {
      //console.log("Cheking url");
      checkUrl();
    }
  }
}

// function handleMutations(mutationsList) {
//   for (const mutation of mutationsList) {]
//       checkUrl();
//   }
// }

initialize(); // 213 lines of code,
// for this stupid thing
// it works though.
