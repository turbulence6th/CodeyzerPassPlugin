const heroku = 'https://codeyzer-pass.herokuapp.com';
const local = 'http://localhost:8080';

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
function hashle(hamMetin) {
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
    const response = await fetch(heroku + patika, {
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

let seciciListesi = [
    ["n11", "^(www\.)?n11.com/giris-yap$", "#email", "#password"],
    ["Quora", "^(www\.)?quora.com/$", "#email", "#password"],
    ["steinberg", "^id.steinberg.net/auth/XUI$", "#idToken2", "#idToken4"],
    ["Amazon", "^(www\.)?amazon..*/ap/signin$", "#ap_email", "#ap_password"],
    ["Adore Mobilya", "^(www\.)?adoremobilya.com/.*$", "#pop-email", "#pop-password"],
    ["Stackoverflow", "^(www\.)?stackoverflow.com/users/login$", "#email", "#password"],
    ["Spotify", "^accounts.spotify.com/.*/login$", "#login-username", "#login-password"],
    ["Trendyol", "^(www\.)?trendyol.com/giris$", "#login-email", "#login-password-input"],
    ["reddit", "^(www\.)?reddit.com/$", "#loginUsername", "#loginPassword"],
    ["Kariyer.net", "^(www\.)?kariyer.net/aday/giris$", "#username", "#pass"],
    ["Google", "^(www\.)?accounts.google.com/.*/(identifier|pwd)$", "input[name='identifier']", "input[name='password']"],
    ["Ikea", "^(www\.)?ikea.com.tr/uyelik/uye-girisi.aspx$", "#txtEmail", "#txtPassword"],
    ["Linkedin", "^(www\.)?linkedin.com/(checkpoint/rm/sign-in-another-account)?$", "#session_key", "#session_password"],
    ["Heroku", "^(www\.)?id.heroku.com/login$", "#email", "#password"],
    ["Presonus", "^my.presonus.com/login$", "input[type='email']", "input[type='password']"],
    ["Yemek Sepeti", "^(www\.)?yemeksepeti.com/.*$", "#UserName", "#password"],
    ["eba", "^giris.eba.gov.tr/EBA_GIRIS/student.jsp$", "#tckn", "#password"],
    ["AliExpress", "^(|.*\.)aliexpress.com/.*$", "#fm-login-id", "#fm-login-password"],
    ["Twitter", "^(www\.)?twitter.com/(login)?$", "input[name='session[username_or_email]']", "input[name='session[password]']"],
    ["Github", "^(www\.)?github.com/login$", "#login_field", "#password"],
    ["D&R", "^(www\.)?dr.com.tr/login$", "#EmailField", "#PasswordField"],
    ["ekşisözlük", "^(www\.)eksisozluk.com/giris$", "#username", "#password"],
    ["mynet", "^(www\.)mynet.com/$", "#loginuser", "#loginpassword"],
    ["Udemy", "^(www\.)?udemy.com/join/login-popup$", "#email--1", "#id_password"],
    ["hepsiburada", "^giris.hepsiburada.com/$", "#txtUserName", "#txtPassword"],
    ["e-Devlet", "^giris.turkiye.gov.tr/Giris$", "#tridField", "#egpField"],
    ["VULTR", "^my.vultr.com/$", "input[name='username']", "input[name='password']"],
    ["DigitalOcean", "^cloud.digitalocean.com/login$", "#email", "#password"],
    ["Oracle", "^login.oracle.com/mysso/signon.jsp$", "#sso_username", "#ssopassword"],
    ["Pinterest", "^(|.*\.)pinterest.com/$", "#email", "#password"],
    ["Instagram", "^(www\.)?instagram.com/$", "input[name='username']", "input[name='password']"],
    ["Codeyzer", "^(www\.)?codeyzer.com/wp-login.php$", "#user_login", "#user_pass"],
    ["Discord", "^(www\.)?discord.com/login$", "input[name='email']", "input[name='password']"],
    ["sahibinden.com", "^secure.sahibinden.com/giris$", "#username", "#password"],
    ["Facebook", "^(|.*\.)facebook.com/$", "#email", "#pass"],
    ["Microsoft", "^login.microsoftonline.com/common/oauth2/authorize$", "input[name='loginfmt']", "input[name='passwd']"],
    ["JetBrains", "^account.jetbrains.com/login$", "input[name='username']", "input[name='password']"],
    ["Ubisoft", "^account.ubisoft.com/[a-z]{2}-[A-Z]{2}/login$", "#AuthEmail", "#AuthPassword"]
];

/** @type Secici[]} */ let seciciListesiObj = seciciListesi.map(x => ({
    "platform": x[0],
    "regex": new RegExp(x[1]),
    "kullaniciAdiSecici": x[2],
    "sifreSecici": x[3]
}))

/**
 * 
 * @param {string} platform 
 * @returns {Secici}
 */
export function seciciGetir(platform) {
    return seciciListesiObj.filter(x => x.regex.test(platform))[0];
}

/**
 * 
 * @param {*} icerik 
 * @param {function} geriCagirma 
 */
 export function sekmeMesajGonder(icerik, geriCagirma = () => {}) {
    // @ts-ignore
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, icerik, geriCagirma);
    });
};

/**
 * 
 * @param {BackgroundMesaj} mesaj 
 * @returns {Promise<any>}
 */
 export function backgroundMesajGonder(mesaj) {
    return new Promise((resolve, _reject) => {
      // @ts-ignore
      chrome.runtime.sendMessage(mesaj, response => resolve(response));
    });
  }

/**
 * 
 * @param {string} mesaj 
 * @param {'bilgi'|'uyari'|'hata'} tip 
 */
 export function mesajYaz(mesaj, tip = 'bilgi') {
    if (tip === 'hata') {
      $('#mesaj').html(/* html */`<a style='color: ##FF3333'>${mesaj}</a>`);
    } else if (tip === 'uyari') {
      $('#mesaj').html(/* html */`<a style='color: ##FFFF33'> ${mesaj}</a>`);
    } else {
      $('#mesaj').html(/* html */`<a style='color: #33FF33'>${mesaj}</a>`);
    }
};

/**
 * 
 * @param {function} callback 
 * @returns {Promise<string>}
 */
export function sifreAl(callback = mesajYaz) {
    callback("Şifre girilmesi bekleniyor.");

    let panel = 
    $(/* html */`
        <div id="sifreKontroluPanel" class="panel">
            <form autocomplete="off" class="mt-3">
                <div class="baslik">
                    Şifre kontrolü
                </div>
                <div class="form-group mt-4">
                    <input type="password" id="sifreDogrulaKutu" placeholder="Şifrenizi giriniz(*)"/>
                </div>
                <div class="row d-flex justify-content-end">
                    <button class="mr-3" id="sifreOnaylaButon" type="button">Onayla</button>
                    <button class="mr-3" id="sifreIptalButon" type="button">İptal</button>
                </div>
            </form>
        </div>
    `).appendTo($('body'));

    $('#anaPanel').addClass('engelli');

    return new Promise((resolve, reject) => {
        // @ts-ignore
        chrome.runtime.sendMessage({
            mesajTipi: "depoGetir"
        }, (/** @type {Depo} */ depo) => {
            $(document).on("click", "#sifreOnaylaButon", () => {
                let sifre = /** @type {string} */ ($('#sifreDogrulaKutu').val());
                if (hashle(depo.kullaniciAdi + ":" + sifre) === depo.kullaniciKimlik) {
                    $('#anaPanel').removeClass('engelli');
                    panel.remove();
                    callback?.("Şifre doğrulandı.")
                    resolve(sifre);
                } else {
                    callback?.("Hatalı şifre girdiniz.");
                }
            });

            $(document).on("click", "#sifreIptalButon", () => {
                $('#anaPanel').removeClass('engelli');
                panel.remove();
                callback?.("Şifre doğrulama iptal edildi.")
                reject();
            });
        });
    });
}

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
 * @param {*} bilesen 
 * @param {object} params 
 * @returns {Promise}
 */
export function bilesenYukle(panel, bilesen, params = {}) {
    return new Promise((resolve, _reject) => {
        panel.load(bilesen.html(), () => {
        let nesne = new bilesen();
        nesne.init(params);
        resolve(nesne);
        });
    });
}

/**
 * @param {string} formSecici
 * @returns {boolean}
 */
 export function formDogrula(formSecici) {
    let gecerli = true;
    $(formSecici + ' input[dogrula]').each(function() {
  
        let input = $(this);
        input.parent().closest('div').removeAttr('uyari-mesaji');
  
        let dogrulaId = input.attr('dogrula');
        let dogrula = $('#' + dogrulaId);
  
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