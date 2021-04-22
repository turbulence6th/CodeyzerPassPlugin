chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.mesajTipi === "beniHatirla") {
    
  }
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

