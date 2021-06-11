hex2a = hex => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};

sifrele = (hamMetin, sifre) => {
    return CryptoJS.AES.encrypt(hamMetin, sifre).toString();
};

hashle = hamMetin => {
    return CryptoJS.SHA512(hamMetin).toString();
};

desifreEt = (sifreliMetin, sifre) => {
    return hex2a(CryptoJS.AES.decrypt(sifreliMetin, sifre).toString());
};

oturumAcmaSayfasiMi = url => {
    return url in secici;
};

kullaniciAdiSecici = url => {
    return secici[url][kullaniciAdi];
};

sifreSecici = url => {
    return secici[url][sifre];
};

alanAdiGetir = url => {
    if (url.startsWith("www.")) {
        url = url.substr(4);
    }

    let slashIndis = url.indexOf('/');
    if (slashIndis != -1) {
        url = url.substr(0, slashIndis);
    }

    return url;
}

let heroku = 'https://codeyzer-pass.herokuapp.com';
let local = 'http://localhost:8080';
post = (patika, istek) => {
    return fetch(heroku + patika, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(istek),
    })
    .then(response => response.json());
};

icerikSifrele = (nesne, sifre) => {
    return sifrele(JSON.stringify(nesne), sifre);
};

icerikDesifreEt = (sifreliIcerik, sifre) => {
    return JSON.parse(desifreEt(sifreliIcerik, sifre));
};

kimlikHesapla = (kullaniciAdi, sifre) => {
    return hashle(kullaniciAdi + ":" + sifre);
};

seciciListesi = [
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

seciciListesi = seciciListesi.map(x => ({
    "platform": x[0],
    "platformRegex": new RegExp(x[1]),
    "kullaniciAdiSecici": x[2],
    "sifreSecici": x[3]
}))

seciciGetir = platform => {
    return seciciListesi.filter(x => x.platformRegex.test(platform))[0];
}

mesajGonder = (icerik, geriCagirma) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, icerik, geriCagirma);
    });
};