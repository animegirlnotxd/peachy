import MediumCollection from "../models/media/MediumCollection.js";

// import User from '../models/User.js';

// const user = User.new({ name: 'symonxd' });
// // const user = new User({ name: 'symonxd' });
// console.log(user.greet());

const openedTabs = {};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "load") {
        chrome.tabs.sendMessage(
            tab.id,
            { action: 'menuItemClicked', tabTitle: tab.title.toLowerCase() },
            response => {
                // const mediumCollection = new MediumCollection();
                sendCollections(response, tab.title.toLowerCase());
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

function sendCollections(response, tabTitle) {
    // console.log(response.collections.imageCollection);
    if ((response.collections.imageCollection._ids === 0) || (response.collections.videoCollection._ids === 0)) {
        alert("No images or videos found.");
    }
    else {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/html/images.html') }, tab => {
            openedTabs[tab.id] = () => {
                chrome.tabs.sendMessage(tab.id, { collections: response, tabTitle: tabTitle });
            }
        });
    }
}