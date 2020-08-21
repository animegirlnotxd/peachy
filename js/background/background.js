const openedTabs = {};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "load") {
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'menuItemClicked', tabTitle: tab.title.toLowerCase() },
            response => {
                sendImages(response, tab.title.toLowerCase());
            });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status == 'complete') {
        if (openedTabs[tabId] != undefined) {
            openedTabs[tabId]();
        }
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    delete openedTabs[tabId];
});

function sendImages(response, tabTitle) {
    const urls = response.urls;
    if (urls[0].length == 0) {
        alert("No Images Found");
    }
    else {
        chrome.tabs.create({ url: chrome.runtime.getURL('html/images.html') }, tab => {
            openedTabs[tab.id] = () => {
                chrome.tabs.sendMessage(tab.id, { urls: urls, tabTitle: tabTitle });
            }
        });
    }
}