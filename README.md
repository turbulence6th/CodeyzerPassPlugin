# Codeyzer Pass Plugin

Kripto şifre saklama eklentisidir.

## Kurulum
### Gereksinimler;
-   Node.js
-   npm (Node.js paket yöneticisi)

```bash
npm install
```

### Tarayıcı için;
```bash
npm run buildChrome
```
Chrome tabanlı bir tarayıcıdan /chrome dizini seçilerek plugin eklenir.

### Mobil için;
```bash
npm run buildMobil
npm run openAndroid
```
Android studio açıldıktan sonra uygulama doğrudan sanal veya gerçek cihaza yüklenir.

### Node.js server için;
```bash
npm run webDev
```
Uygulama http://localhost:8080 üzerinden hizmete başlar.

## Veriler nasıl saklanır?
- Kullanıcı adı ve şifre bilgileri KULLANICI_ADI:SIFRE formatına getirilir ve sha512 hash değeri alınır. Bu değer veri tabanındaki kullanıcı kimlik alanına karşılık gelir.
- Her eklenen şifre aşağıdaki formatta bir stringe dönüştürülür. İlgili string ana şifre kullanılarak aes metoduyla şifrelenir. 
   
    ```json
    {
        "platform" : "string",
        "androidPaket" : "string",
        "kullaniciAdi" : "string",
        "sifre" : "string"
    }
    ```

## Mağaza bağlantıları
[Chrome Web Mağazası](https://chrome.google.com/webstore/detail/codeyzer-pass/dbbjgbbdbfjpckknlppoalklnmkohhln) 
