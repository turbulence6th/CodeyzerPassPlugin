depo = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.mesajTipi === "depoGetir") {
    sendResponse(depo);
  } else if (request.mesajTipi === "beniHatirla") {
    depo = request.depo;
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

