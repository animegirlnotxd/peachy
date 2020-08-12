chrome.runtime.onInstalled.addListener(function() {
    const contextMenuOptions = {
        "id": "load",
        "title": "Load",
        "documentUrlPatterns": [
            "https://danbooru.donmai.us/*",
            "https://yande.re/*",
            "https://konachan.com/*"
        ],
        "contexts": ["all"]
    };
    
    chrome.contextMenus.create(contextMenuOptions);
});