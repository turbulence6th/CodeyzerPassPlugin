// @ts-ignore
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.mesajTipi === "depoGetir") {
    sendResponse(depoGetir());
  } else if (request.mesajTipi === "beniHatirla") {
    localStorage['depo'] = JSON.stringify(request.depo);
  } else if (request.mesajTipi === "arayuzKontrolAyarla") {
    localStorage['arayuzKontrol'] = request.arayuzKontrol;
  } else if (request.mesajTipi === "arayuzKontrolGetir") {
    sendResponse(localStorage['arayuzKontrol']);
  }
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

let depoGetir = () => {
  let depoStr = localStorage['depo'];
  let depo = null;
  if (depoStr) {
    depo = JSON.parse(depoStr);
  }
  return depo;
}
