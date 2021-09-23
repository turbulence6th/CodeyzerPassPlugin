// @ts-ignore
chrome.runtime.onMessage.addListener(async (/** @type {BackgroundMesaj} */ request, _sender, /** @type function */ sendResponse) => {
 
});

// @ts-ignore
chrome.runtime.onInstalled.addListener(function() {
  // @ts-ignore
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // @ts-ignore
      chrome.declarativeContent.onPageChanged.addRules([{
        // @ts-ignore
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        // @ts-ignore
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});