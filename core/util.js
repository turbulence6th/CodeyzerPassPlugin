import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import tr from '/i18n/tr.js';
import en from '/i18n/en.js';
import AygitYonetici from '/core/AygitYonetici.js';
import CodeyzerDogrula from '/core/bilesenler/CodeyzerDogrula.js';

const heroku = 'https://codeyzer-pass.herokuapp.com';
const local = 'http://192.168.1.100:9090';
const serverPath = local;

/**
 * 
 * @param {string} hex 
 * @returns {string}
 */
function hex2a(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    return str;
};

/**
 * 
 * @param {string} hamMetin 
 * @param {string} sifre 
 * @returns {string}
 */
function sifrele(hamMetin, sifre) {
    return CryptoJS.AES.encrypt(hamMetin, sifre).toString();
};

/**
 * 
 * @param {Blob} hamDosya 
 * @param {string} sifre 
 * @returns {Promise<[Blob, number[]]>}
 */
export async function dosyaSifrele(hamDosya, sifre) {
    let arrBuff = await hamDosya.arrayBuffer();

    let uint32Arr = new Int32Array(arrBuff, 0, Math.floor(arrBuff.byteLength / 4));
    let uint8Arr = new Int8Array(arrBuff, arrBuff.byteLength - (arrBuff.byteLength % 4), arrBuff.byteLength % 4);
    let arr = [...uint32Arr];

    let artikByte = 0;
    for (let i = 0; i < uint8Arr.length; i++) {
        let num = uint8Arr[i];
        artikByte += num << 8 * (3 - i);
    }
    
    arr.push(artikByte);

    let wa = CryptoJS.lib.WordArray.create(arr, arrBuff.byteLength);
    let encCp = CryptoJS.AES.encrypt(wa, sifre);
    let encWa = encCp.ciphertext;
    encWa.clamp();
    return [new Blob([new Int32Array(encWa.words)]), encCp.salt.words];
}

/**
 * 
 * @param {string} hamMetin 
 * @returns {string}
 */
export function hashle(hamMetin) {
    return CryptoJS.SHA512(hamMetin).toString();
};

/**
 * 
 * @param {string} sifreliMetin 
 * @param {string} sifre 
 * @returns {string}
 */
function desifreEt(sifreliMetin, sifre) {
    return hex2a(CryptoJS.AES.decrypt(sifreliMetin, sifre).toString());
};

/**
 * 
 * @param {Blob} sifreliDosya 
 * @param {string} sifre 
 * @param {number[]} salt
 * @returns {Promise<Blob>}
 */
export async function dosyaDesifreEt(sifreliDosya, sifre, salt) {
    let arrBuff = await sifreliDosya.arrayBuffer();
    let uint32Arr = new Int32Array(arrBuff);
    let arr = [...uint32Arr];
    
    let encWa = CryptoJS.lib.WordArray.create(arr);
    let cp = CryptoJS.lib.CipherParams.create({
        ciphertext: encWa,
        salt: CryptoJS.lib.WordArray.create(salt)
    });

    let wa = CryptoJS.AES.decrypt(cp, sifre);
    wa.clamp();

    let words = wa.words;

    let x = [];
    for (let i = 0; i < words.length - 1; i++) {
        let word = words[i];
        x.push((word >> 0) & 0xFF);
        x.push((word >> 8) & 0xFF);
        x.push((word >> 16) & 0xFF);
        x.push((word >> 24) & 0xFF);
    }

    let baslangic = 4 - (wa.sigBytes % 4);
    let word = words[words.length - 1];
    for (let j = 3; j >= baslangic; j--) {
        x.push((word >> j * 8) & 0xFF);
    }

    return new Blob([new Int8Array(x)]);
};

/**
 * 
 * @param {string} url 
 * @returns {string}
 */
export function alanAdiGetir(url) {
    if (!url) {
        return url;
    }

    if (url.startsWith("www.")) {
        url = url.substring(4);
    }

    let slashIndis = url.indexOf('/');
    if (slashIndis != -1) {
        url = url.substring(0, slashIndis);
    }

    return url;
}

/**
 * 
 * @template T
 * @param {PatikaEnum} patika 
 * @param {*} istek 
 * @returns {Promise<Response>}
 */
export async function post(patika, istek) {
    return await fetch(serverPath + patika, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(istek),
    });
};

/**
 * 
 * @template T
 * @param {PatikaEnum} patika 
 * @param {FormData} istek 
 * @returns {Promise<Response>}
 */
export async function filePost(patika, istek) {
    return await fetch(serverPath + patika, {
        method: 'POST',
        body: istek,
    });
}

/**
 * 
 * @param {HariciSifreIcerik | MetaVeriIcerik} nesne 
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
    window.open(pluginUrlGetir(sayfa), '_blank');
}

export /** @type {HTMLDivElement} */ const $anaPanel = document.querySelector('#anaPanel');

/**
 * @param {CodeyzerBilesen} bilesen
 */
export function bilesenYukle(bilesen) {
    $anaPanel.innerHTML = '';
    $anaPanel.append(bilesen);
}

/**
 * @param {HTMLFormElement} $form
 * @returns {boolean}
 */
export function formDogrula($form) {
    let gecerli = true;
    $form.querySelectorAll('input[dogrula]').forEach(function(/** @type {HTMLInputElement} */input) {
  
        input.parentElement.closest('div').removeAttribute('uyari-mesaji');
  
        let dogrulaId = input.getAttribute('dogrula');
        /** @type {CodeyzerDogrula} */ let dogrula = $form.querySelector(`[ref='${dogrulaId}']`);
  
        let inputGecerli = true;

        for (let dogrulaSatiri of dogrula.dogrulaSatirlari()) {
            if (inputGecerli) {
                if (!dogrulaSatiri.dogrula(input)) {
                    gecerli = inputGecerli = false;
                    let mesaj = dogrulaSatiri.mesaj;
                    input.parentElement.closest('div').setAttribute('uyari-mesaji', mesaj);
                }
            }
        }
    });
  
    if (!gecerli) {
        mesajYaz(i18n('util.formDogrula.gecerliDegil'), 'hata');
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
        let response;
        if (istek instanceof FormData) {
            response = await filePost(patika, istek);
        } else {
            response = await post(patika, istek);
        }

        /** @type {Cevap<T>} */ let cevap = await response.json();
         
        $('#yukleme').hide();
        $('#anaPanel').removeClass('engelli');
        if (cevap.basarili) {
            
        } else {
            mesajYaz(i18n(cevap.mesaj), 'hata');
        }
        return cevap;
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
 * @returns {Promise<void>} 
 */
export async function setAygitYonetici(val) {
    aygitYonetici = val;
    mevcutDil = await aygitYonetici.mevcutDil();
}

/** @type {string} */ let mevcutDil;

/**
 * 
 * @param {string} anahtar 
 * @returns {string}
 */
export function i18n(anahtar) {
    switch (mevcutDil) {
        case 'tr': return tr[anahtar];
        case 'en': return en[anahtar];
        default: return en[anahtar];
    }
}

HTMLFormElement.prototype.addEnterEvent = function(/** @type {() => void} */ enterEvent) {
    this.addEventListener('keypress', keyPressEvent => {
        var keyPressed = keyPressEvent.keyCode || keyPressEvent.which;
        if (keyPressed === 13) {
            enterEvent();
            keyPressEvent.preventDefault();
            return false;
        }
    })
};

export function oturumVerileriniSifirla() {
    getAygitYonetici().beniHatirla(null);
    getAygitYonetici().arayuzKontrolAyarla(false);
    getAygitYonetici().hariciSifreDTOListesiAyarla(null);
    getAygitYonetici().rehberAyarla(null);

    setDepo({
        kullaniciAdi: null,
        kullaniciKimlik: null
    });
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
 *
 * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
 * @returns {Promise<HariciSifreDesifre[]>}
 */
export async function hariciSifreListeDesifreEt(hariciSifreDTOListesi) {
    let sifre = await getAygitYonetici().sifreAl();
    return hariciSifreDTOListesi
        .map((/** @type {HariciSifreDTO} */ x) => {
            /** @type {HariciSifreIcerik} */ let icerik = icerikDesifreEt(x.icerik, sifre);
            return {
                kimlik: x.kimlik,
                icerik: icerik,
                alanAdi: alanAdiGetir(icerik.platform)
            };
        })
        .sort((x, y) => x.alanAdi.localeCompare(y.alanAdi));
}