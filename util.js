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

post = (patika, istek) => {
    return fetch('http://localhost:8080' + patika, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(istek),
    })
    .then(response => response.json())
    .then(data => {
        mesajYaz(data.mesaj);
        return data;
    })
    .catch((error) => {
      mesajYaz('Sunucuda beklenmedik bir hata oluştu.')
    });
};