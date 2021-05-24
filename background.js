chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.mesajTipi === "depoGetir") {
    let depoStr = localStorage['depo'];
    let depo = null;
    if (depoStr) {
      depo = JSON.parse(depoStr);
    }
    sendResponse(depo);
  } else if (request.mesajTipi === "beniHatirla") {
    localStorage['depo'] = JSON.stringify(request.depo);
  }
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {schemes: ['http', 'https']},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

