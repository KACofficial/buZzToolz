//document.addEventListener("DOMContentLoaded", init);



async function init() {
  var enabled = await isEnabled();
  if(enabled) {
    applyTheme();
  }
}

function applyTheme() {
  // apply general body themes
  var bodyElement = document.querySelector('body');
  var sidebarElement = document.querySelector('.position-fixed.d-flex.h-100.head_sidebar');
  var topBar = document.querySelector('nav.tag_header');
  var commentTextAreas = document.querySelectorAll('.tag_vid_comment');
  if(isVideo()) {
    var videoElement = document.querySelector('.mejs__overlay.mejs__layer.mejs__overlay-play');
    videoElement.style.borderRadius = "10px";
    videoElement.style.border = "1px solid #373737";
  }

  sidebarElementGradient = document.querySelector('div.head_sidebar_menu'); // the sidebar elements gradient
  sidebarElement.style.backgroundColor = "#000";
  sidebarElementGradient.style.background = "linear-gradient(to right, #000, rgba(255, 255, 255, 0))"; // uncomment to enable the sidebar being black
  bodyElement.style.backgroundColor = "#000";
  topBar.style.backgroundColor = "#000";
  

  commentTextAreas.forEach(function(commentTextArea) {
    commentTextArea.style.cssText = ''; // Clear all inline styles
    commentTextArea.style.position = "sticky";
    commentTextArea.style.background = "#000"; // Apply new background color
  });


  var videoThumbs = document.querySelectorAll('.position-relative.d-block.thumb');
  videoThumbs.forEach(function(videoThumb) {
    videoThumb.style.border = "1px solid #373737";
  });
  

  var shortsThumbs = document.querySelectorAll('div.tag_short_home_list');
  shortsThumbs.forEach(function(shortsThumb) {
    shortsThumb.style.borderRadius = "10px";
    shortsThumb.style.border = "1px solid #373737";
  });
}

async function isEnabled() {
  var result = await browser.storage.sync.get();
  return result.midnightThemeSet;
}

function isVideo() {
  const url = document.location.href;
  if(url.includes('https://bsocial.buzz/watch')) {
    return true;
  } else {
    return false;
  }
}

init();
