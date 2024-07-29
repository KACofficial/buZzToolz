// This function sets default settings when the extension is installed
function onInstalled() {
    browser.storage.sync.set({
        downloadOptionSet: true, // Set default value for "enable-download"
        midnightThemeSet: false  // Set default value for "midnight-theme"
    }).then(() => {
        console.log("Default settings have been set.");
    }).catch((error) => {
        console.error("Error setting default settings: ", error);
    });
}

// Listen for the installation event
browser.runtime.onInstalled.addListener(onInstalled);

