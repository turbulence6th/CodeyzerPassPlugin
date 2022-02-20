import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html*/ `
<template>
    <div>
        <div class="row">
            <div class="col-3">
            </div>
            <div class="col-6">
                <input ref="ara" type="text" placeholder="Ara" class="mt-2"/>
            </div>
            <div class="col-3">
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-4" title="Platform">
                <img src="/images/website_icon.png"/>
            </div>

            <div class="col-3" title="Kullanıcı adı">
                <img src="/images/kullanici_icon.png"/>
            </div>
 
            <div class="col-3" title="Şifre">
                <img src="/images/sifre_icon.png"/>
            </div>
            
            <div class="col-2">
                <img src="/images/website_icon.png"/>
            </div>
        </div>
        <div ref="tabloBeden" class="mt-3">
        </div>
    <div>
</template>
`;

export default class SifreTablo extends CodeyzerBilesen {

    /** @type {HTMLInputElement} */ $ara;
    /** @type {HTMLDivElement} */ $tabloBeden;

    /** @type {HariciSifreDesifre[]} */ hariciSifreDesifreListesi;

    constructor() {
        super(template);
    }

    init() {
        this.$ara = this.bilesen('ara');
        this.$tabloBeden = this.bilesen('tabloBeden');

        this.$ara.addEventListener('keyup', () => {
            let deger = this.$ara.value;
            this.$tabloBeden.querySelectorAll('sifre-tablo-satir').forEach(x => {
                if (x.getAttribute('platform').includes(deger) || x.getAttribute('kullaniciAdi').includes(deger)) {
                    x.classList.remove('gizle');
                } else {
                    x.classList.add('gizle');
                }
            })
        });
    }

    /**
     * 
     * @param {HariciSifreDesifre[]} hariciSifreDesifreListesi
     */
    yukle(hariciSifreDesifreListesi) {
        this.hariciSifreDesifreListesi = hariciSifreDesifreListesi;
        this.$tabloBeden.innerHTML = '';
        for (let hariciSifreDesifre of hariciSifreDesifreListesi) {
            this.$tabloBeden.innerHTML += /* html */ `
                <sifre-tablo-satir 
                    platform="${hariciSifreDesifre.icerik.platform}" 
                    kullaniciAdi="${hariciSifreDesifre.icerik.kullaniciAdi}" 
                    sifre="${hariciSifreDesifre.icerik.sifre}">
                </sifre-tablo-satir>
            `;
        }
    }
}