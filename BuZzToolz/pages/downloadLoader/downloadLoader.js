addEventListener("DOMContentLoaded", init);

async function init() {
    const params = new URLSearchParams(window.location.search);
    const videoUrl = params.get('videoUrl');
    const filename = params.get('filename');

    if (videoUrl) {
        try {
            // file deepcode ignore Ssrf: <please specify a reason of ignoring this>
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            // file deepcode ignore DOMXSS: <please specify a reason of ignoring this>
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log("Download started");
        } catch (error) {
            console.error("Error downloading video:", error);
            document.getElementById('loading').innerText = "Failed to download video.";
        }
    } else {
        document.getElementById('loading').innerText = "No video URL provided.";
    }
} // only 29 lines of code,
// thats a releif.



