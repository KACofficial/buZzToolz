document.addEventListener("DOMContentLoaded", init);

function init() {
    console.log("default_popup.js loaded");
    // Load the state from storage when the popup is opened
    loadSettings();
    // start event listeners for the checkboxes
    document
        .getElementById("enable-download")
        .addEventListener("change", processOptions);
    document
        .getElementById("midnight-theme")
        .addEventListener("change", processOptions);
}

function processOptions() {
    const downloadOption = document.getElementById("enable-download").checked;
    const midnightTheme = document.getElementById("midnight-theme").checked;

    // Save the state to storage
    saveSettings({ downloadOptionSet: downloadOption, midnightThemeSet: midnightTheme });  
}

async function saveSettings(settings) {
    await browser.storage.sync.set(settings).then(() => {
        console.log("Settings saved: ", settings);
    });
}

async function loadSettings() {
    await browser.storage.sync.get(["downloadOptionSet", "midnightThemeSet"]).then((result) => {
        const downloadOption = document.getElementById("enable-download");
        const midnightTheme = document.getElementById("midnight-theme");
        
        if (result.downloadOptionSet !== undefined) {
            downloadOption.checked = result.downloadOptionSet;
        }
        
        if (result.midnightThemeSet !== undefined) {
            midnightTheme.checked = result.midnightThemeSet;
        }
        
        console.log("Settings loaded: ", result);
    });
}
