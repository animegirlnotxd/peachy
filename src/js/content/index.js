(async () => {
    const src = chrome.extension.getURL('src/js/content/content.js');
    const contentScript = await import(src);
    contentScript.main();
})();
