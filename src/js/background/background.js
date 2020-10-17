import VisualCollection from "../models/media/VisualCollection.js";

const openedTabs = {};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "load") {
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'menuItemClicked', tabTitle: tab.title.toLowerCase() },
            response => {
                sendCollection(response, tab.title.toLowerCase());
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

function sendCollection(response, tabTitle) {
    const images = response.collection._images;
    const videos = response.collection._videos;

    const visualCollection = new VisualCollection(images, videos);

    if ((visualCollection.getImages().length === 0) && (visualCollection.getVideos().length === 0)) {
        alert("No images or videos found.");
    }
    else {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/html/images.html'), active: false }, tab => {
            openedTabs[tab.id] = () => {
                chrome.tabs.sendMessage(tab.id, { collection: visualCollection, tabTitle: tabTitle });
            }
        });
    }
}