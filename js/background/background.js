const openedTabs = {};

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if(info.menuItemId == "load") {
        chrome.tabs.sendMessage(
            tab.id,
            {action: 'menuItemClicked', tabTitle: tab.title.toLowerCase()},
            function(response) {
                sendImages(tab.id, response, tab.title.toLowerCase());
        });
	}
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        if(openedTabs[tab.id] != undefined) {
            openedTabs[tab.id](tab.id);
        }
    }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    delete openedTabs[tabId];
});

function sendImages(tabId, response, tabTitle) {
    const urls = response.urls;
	if (urls[0].length == 0) {
		alert("No Images Found");
    }
	else {
        chrome.tabs.create({url: chrome.runtime.getURL('html/images.html')}, function(tab) {
            openedTabs[tab.id] = tabId => {
                chrome.tabs.sendMessage(tab.id, {urls: urls, tabTitle: tabTitle});
            }
        });
    }
}