let contextMenuSites = [
    "https://danbooru.donmai.us/*",
    "https://yande.re/*",
    "https://konachan.com/*"
];
chrome.contextMenus.create({"title": "Open", "documentUrlPatterns": contextMenuSites, "contexts": ["all"], "onclick": menuItemClick});

function menuItemClick(changeInfo, tab) {
	
	chrome.tabs.sendMessage(tab.id, {action: 'menuItemClicked', tabTitle: tab.title.toLowerCase()}, function(response) {
		sendImages(tab.id, response, tab.title.toLowerCase());
	});
}

function sendImages(tabId, response, tabTitle) {
    
    let urls = response.urls;
	if (urls.length == 0) {
		alert("No Images Found");
    }
	else {
        chrome.tabs.create({url: chrome.extension.getURL('html/images.html')}, function(tab) {
            chrome.tabs.executeScript(tab.id, {file:"js/images.js"}, function() {
                chrome.tabs.sendMessage(tab.id, {urls: urls, tabTitle: tabTitle}, function() {});
            });
        });
    }
}