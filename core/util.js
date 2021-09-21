import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import tr from '/kaynak/i18n/tr.js';
import en from '/kaynak/i18n/en.js';
import AygitYonetici from '/core/AygitYonetici.js';

const heroku = 'https://codeyzer-pass.herokuapp.com';
const local = 'http://192.168.1.100:9090';
const serverPath = heroku;

/**
 * 
 * @param {string} hex 
 * @returns {string}
 */
function hex2a(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};

/**
 * 
 * @param {string} hamMetin 
 * @param {string} sifre 
 * @returns {string}
 */
function sifrele(hamMetin, sifre) {
    // @ts-ignore
    return CryptoJS.AES.encrypt(hamMetin, sifre).toString();
};

/**
 * 
 * @param {string} hamMetin 
 * @returns {string}
 */
export function hashle(hamMetin) {
    // @ts-ignore
    return CryptoJS.SHA512(hamMetin).toString();
};

/**
 * 
 * @param {string} sifreliMetin 
 * @param {string} sifre 
 * @returns {string}
 */
function desifreEt(sifreliMetin, sifre) {
    // @ts-ignore
    return hex2a(CryptoJS.AES.decrypt(sifreliMetin, sifre).toString());
};

/**
 * 
 * @param {string} url 
 * @returns {string}
 */
export function alanAdiGetir(url) {
    if (url.startsWith("www.")) {
        url = url.substr(4);
    }

    let slashIndis = url.indexOf('/');
    if (slashIndis != -1) {
        url = url.substr(0, slashIndis);
    }

    return url;
}

/**
 * 
 * @template T
 * @param {PatikaEnum} patika 
 * @param {*} istek 
 * @returns {Promise<Cevap<T>>}
 */
export async function post(patika, istek) {
    const response = await fetch(serverPath + patika, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(istek),
    });
    return await response.json();
};

/**
 * 
 * @param {HariciSifreIcerik} nesne 
 * @param {string} sifre 
 * @returns {string}
 */
export function icerikSifrele(nesne, sifre) {
    return sifrele(JSON.stringify(nesne), sifre);
};

/**
 * 
 * @param {string} sifreliIcerik 
 * @param {string} sifre 
 * @returns {HariciSifreIcerik}
 */
export function icerikDesifreEt(sifreliIcerik, sifre) {
    return JSON.parse(desifreEt(sifreliIcerik, sifre));
};

/**
 * 
 * @param {string} kullaniciAdi 
 * @param {string} sifre 
 * @returns {string}
 */
export function kimlikHesapla(kullaniciAdi, sifre) {
    return hashle(kullaniciAdi + ":" + sifre);
};

/**
 * 
 * @param {string} mesaj 
 * @param {'bilgi'|'uyari'|'hata'} tip 
 */
 export function mesajYaz(mesaj, tip = 'bilgi') {
    getAygitYonetici().toastGoster(mesaj);
};

/**
 * 
 * @param {string} sayfa 
 */
export function pluginSayfasiAc(sayfa) {
    // @ts-ignore
    window.open(chrome.runtime.getURL(sayfa), '_blank');
}

/**
 * 
 * @param {string} url 
 * @returns {string}
 */
export function pluginUrlGetir(url) {
    // @ts-ignore
    return chrome.runtime.getURL(url);
}

/**
 * @param {JQuery} panel 
 * @param {CodeyzerBilesen} bilesen
 */
export function bilesenYukle(panel, bilesen) {
    panel.empty();
    $(bilesen).appendTo(panel);
    bilesen.init();
}

/**
 * @param {JQuery<HTMLFormElement>} $form
 * @returns {boolean}
 */
export function formDogrula($form) {
    let gecerli = true;
    $form.find('input[dogrula]').each(function() {
  
        let input = $(this);
        input.parent().closest('div').removeAttr('uyari-mesaji');
  
        let dogrulaId = input.attr('dogrula');
        let dogrula = $form.find(`[ref='${dogrulaId}']`);
  
        let inputGecerli = true;
  
        dogrula.children().each(function() {
            let dogrulaSatiri = $(this);
            if (inputGecerli) {
              if (dogrulaSatiri.is('gerekli')) {
                if (!input.val()) {
                    gecerli = inputGecerli = false;
                    let mesaj = dogrulaSatiri.attr('mesaj');
                    input.parent().closest('div').attr('uyari-mesaji', mesaj);
                }
              } else if (dogrulaSatiri.is('regex')) {
                let regex = new RegExp(dogrulaSatiri.attr('ifade'));
                if (!regex.test(/** @type {string} */ (input.val()))) {
                    gecerli = inputGecerli = false;
                    let mesaj = dogrulaSatiri.attr('mesaj');
                    input.parent().closest('div').attr('uyari-mesaji', mesaj);
                }
              }
            }
        });
    });
  
    if (!gecerli) {
        mesajYaz('Form geçerli değildir', 'hata');
    }
  
    return gecerli;
}

/** @type {Depo} */ var depo = {
    kullaniciAdi: null,
    kullaniciKimlik: null,
};
  
/**
 * 
 * @param {Depo} pDepo 
 */
export function setDepo(pDepo) {
    depo = pDepo;
}
  
/**
 * 
 * @returns {Depo}
 */
export function getDepo() {
    return depo;
}
  
/**
 * 
 * @template T
 * @param {PatikaEnum} patika 
 * @param {*} istek 
 * @returns {Promise<Cevap<T>>}
 */
export async function popupPost(patika, istek) {
    $('#yukleme').show();
    $('#anaPanel').addClass('engelli');
    try {
      const data = await post(patika, istek);
      $('#yukleme').hide();
      $('#anaPanel').removeClass('engelli');
      if (data.basarili) {
          
      } else {
        mesajYaz(i18n(data.mesaj), 'hata');
      }
      return data;
    } catch (e) {
      $('#yukleme').hide();
      $('#anaPanel').removeClass('engelli');
      mesajYaz(i18n('util.popuppost.beklemedikHata'), 'hata');
      throw i18n('util.popuppost.beklemedikHata');
    }
};

/** @type {AygitYonetici} */ let aygitYonetici;

/**
 * 
 * @returns {AygitYonetici}
 */
export function getAygitYonetici() {
    return aygitYonetici;
}

/**
 * 
 * @param {AygitYonetici} val
 * @returns {Promise} 
 */
export function setAygitYonetici(val) {
    aygitYonetici = val;
    return aygitYonetici.mevcutDil().then(x => mevcutDil = x);
}

/** @type {string} */ let mevcutDil;

/**
 * 
 * @param {string} anahtar 
 * @returns 
 */
export function i18n(anahtar) {
    switch (mevcutDil) {
        case 'tr': return tr[anahtar];
        default: return en[anahtar];
    }

    return en[anahtar];
}