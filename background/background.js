// @ts-ignore
chrome.runtime.onMessage.addListener(async (/** @type {BackgroundMesaj} */ request, _sender, /** @type function */ sendResponse) => {
  switch (request.mesajTipi) {
    case "depoGetir": 
      sendResponse(depoGetir());
      break;
    case "beniHatirla":
      localStorage['depo'] = JSON.stringify(request.params.depo);
      break;
    case "arayuzKontrolAyarla":
      localStorage['arayuzKontrol'] = request.params.arayuzKontrol;
      break;
    case "arayuzKontrolGetir":
      sendResponse(localStorage['arayuzKontrol']);
      break;
    case "hariciSifreDTOListesiAyarla":
      localStorage['hariciSifreDTOListesi'] = JSON.stringify(request.params.hariciSifreDTOListesi);
      break;
    case "hariciSifreDTOListesiGetir":
      let str = localStorage['hariciSifreDTOListesi'];
      if (str === null || str === undefined) {
        sendResponse(null)
      } else {
        sendResponse(JSON.parse(str));
      }
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
