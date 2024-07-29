/*
 * content_scripts/addKeyBinds.js
 * Author: Vance Perry (Epicman212)
 * Copyright (C) 2024 KillAllChickens
 * Licensed under the GPL-3.0 License
 * DESCRIPTION:
 * This code adds some keybinds to bSocial.
 */

function init() {
  console.log("INIT, content_scripts/addKeyBinds.js");
  document.addEventListener("keydown", (event) => {
    console.log(event.code);
    if (event.code) {
        if (event.code === "KeyD") {
            event.preventDefault();
            var downloadButton = document.getElementsByClassName("download-button");
            downloadButton.click();
        }
    }
  });
}

init(); // 24 lines,
// press D to download
