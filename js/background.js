let contextMenuSites = [
    "https://danbooru.donmai.us/*",
    "https://yande.re/*",
    "https://konachan.com/*"
];
chrome.contextMenus.create({"title": "Open", "documentUrlPatterns": contextMenuSites, "contexts": ["all"], "onclick": menuItemClick});

function menuItemClick(changeInfo, tab) {
	
	chrome.tabs.sendMessage(
        tab.id,
        {action: 'menuItemClicked', tabTitle: tab.title.toLowerCase()},
        function(response) {
            sendImages(tab.id, response, tab.title.toLowerCase());
    });
}

function sendImages(tabId, response, tabTitle) {
    const urls = response.urls;
	if (urls[0].length == 0) {
		alert("No Images Found");
    }
	else {
        chrome.tabs.create({url: chrome.runtime.getURL('html/images.html')}, function(tab) {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status == 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tab.id, {urls: urls, tabTitle: tabTitle});
                }
            });
        });
    }
}