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
    mesajYaz("Lütfen bekleyiniz.", 'uyarı');
    return fetch(heroku + patika, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(istek),
    })
    .then(response => response.json())
    .then(data => {
        if (data.basarili) {
            mesajYaz(data.mesaj, 'bilgi');
        } else {
            mesajYaz(data.mesaj, 'hata');
        }
        
        return data;
    })
    .catch((error) => {
      mesajYaz('Sunucuda beklenmedik bir hata oluştu.')
    });
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