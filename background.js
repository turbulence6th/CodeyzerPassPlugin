chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.mesajTipi === "depoGetir") {
    sendResponse(depoGetir());
  } else if (request.mesajTipi === "beniHatirla") {
    localStorage['depo'] = JSON.stringify(request.depo);
  } else if (request.mesajTipi === "sifreGetir") {
    let sifreler = await sifreGetir();
    console.log(sifreler);
    sendResponse(sifreler);
  } else if (request.mesajTipi === "arayuzKontrolAyarla") {
    localStorage['arayuzKontrol'] = request.arayuzKontrol;
  } else if (request.mesajTipi === "arayuzKontrolGetir") {
    sendResponse(localStorage['arayuzKontrol']);
  }
});
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          
        })
        ],
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
