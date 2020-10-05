const openedTabs = {};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "load") {
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'menuItemClicked', tabTitle: tab.title.toLowerCase() },
            response => {
                sendcollection(response, tab.title.toLowerCase());
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

function sendcollection(response, tabTitle) {
    if ((response.collection._images.length === 0) && (response.collection._videos.length === 0)) {
        alert("No images or videos found.");
    }
    else {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/html/images.html') }, tab => {
            openedTabs[tab.id] = () => {
                chrome.tabs.sendMessage(tab.id, { collection: response.collection, tabTitle: tabTitle });
            }
        });
    }
}