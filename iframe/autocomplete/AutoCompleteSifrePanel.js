import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { alanAdiGetir, getAygitYonetici, i18n, icerikDesifreEt, post, setDepo } from "/core/util.js";

const template = () => /* html */`
<template>
    <table id="sifrePanel">
        <col style="width:29%">
        <col style="width:29%">
        <col style="width:29%">
        <col style="width:13%">
        <tr>
        <th><img src="/images/website_icon.png" title="${i18n('autoCompleteSifrePanel.platform.title')}"></th>
        <th><img src="/images/kullanici_icon.png" title="${i18n('autoCompleteSifrePanel.kullaniciAdi.title')}"></th>
        <th><img src="/images/sifre_icon.png" title="${i18n('autoCompleteSifrePanel.sifre.title')}"></th>
        <th></th>
        </tr>
    </table>
</template>
`;

export default class AutoCompleteSifrePanel extends CodeyzerBilesen {

    /** @type {string} */ platform
    /** @type {QRCode} */ qrcode
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []

    /** @type {JQuery<HTMLDivElement>} */ $qrPanel

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$qrPanel = $('#qrPanel');
    }
    
    init() {
        this.$qrPanel.hide();

        this.sifreGetir();
        this.qrcode = new QRCode("qrcode", {
            width: 220,
            height: 220,
            colorDark : "#000000",
            colorLight : "#ff7f2a",
            correctLevel : QRCode.CorrectLevel.H
        });

        $('#qrKapatButton').on("click", function() {
            $('#anaPanel').removeClass('engelli');
            $('#qrPanel').hide();
        });

        $(document).on("click", ".goster-button", function() {
            let button = $(this);
            let sifreTd = button.parent().prev();
            if (sifreTd.data('maskeli')) {
                sifreTd.text(sifreTd.data('sifre'));
                sifreTd.data('maskeli', false);
                button.attr('title', i18n('autoCompleteSifrePanel.gizle.title'));
                button.html(/* html */`<img src="/images/goster_icon.png">`);
            } else {
                sifreTd.text('**********');
                sifreTd.data('maskeli', true);
                button.attr('title', i18n('autoCompleteSifrePanel.goster.title'));
                button.html(/* html */`<img src="/images/gizle_icon.png">`);
            }
        })
        
        let that = this;
        $(document).on("click", ".qr-button", function() {
            let button = $(this);
            let sifreTd = button.parent().prev();
            let sifre = sifreTd.data('sifre');
            
            // @ts-ignore
            that.qrcode.clear();
            // @ts-ignore
            that.qrcode.makeCode(sifre);
        
            $('#qrPanel').fadeIn(500);
            $('#anaPanel').addClass('engelli');
        });
    }

    sifreGetir() {
        getAygitYonetici().depoGetir()
        .then(async (depo) => {
            setDepo(depo);
            let sifre;
    
            try {
                sifre = await getAygitYonetici().sifreAl();
            } catch(error) {
                window.close();
            }
    
            $('#yukleme').show();
            $('#anaPanel').addClass('engelli');

            getAygitYonetici().hariciSifreDTOListesiGetir()
            .then((response) => {
                if (response === null) {
                    post("/hariciSifre/getir", {
                        kullaniciKimlik: depo.kullaniciKimlik
                    })
                    .then((/** @type {Cevap<HariciSifreDTO[]>} */ data) => {
                        if (data.basarili) {
                            getAygitYonetici().hariciSifreDTOListesiAyarla(data.sonuc);
                            this.sifreTabloDoldur(data.sonuc, sifre);
                        }
                    });    
                } else {
                    this.sifreTabloDoldur(response, sifre);
                }
            });
        });
    }

    /**
     * 
     * @param {HariciSifreDTO[]} hariciSifreDTOListesi 
     * @param {string} sifre
     */
    sifreTabloDoldur(hariciSifreDTOListesi, sifre) {
        $('#yukleme').hide();
        $('#anaPanel').removeClass('engelli');
        
        this.hariciSifreListesi.length = 0;
        hariciSifreDTOListesi
        .map((/** @type {HariciSifreDTO} */ x) => {
            /** @type {HariciSifreIcerik} */ let icerik = icerikDesifreEt(x.icerik, sifre);
            return {
                kimlik: x.kimlik,
                icerik: icerik,
                alanAdi: alanAdiGetir(icerik.platform)
            };
        })
        .sort((x, y) => x.alanAdi.localeCompare(y.alanAdi))
        .forEach(x => this.hariciSifreListesi.push(x));

        let sifrePanel = $('#sifrePanel');

        if (this.hariciSifreListesi.length === 0) {
            let tr = /* html */`
                <tr class="sifre-satir">
                    <td>${i18n('autoCompleteSifrePanel.sifreBulunamadi.sutun')}</td>
                    <td></td>
                    <td></td>
                </tr>
            `;

            $(tr).appendTo(sifrePanel);
        } else {
            this.hariciSifreListesi.forEach(x => {
                let tr = /* html */`
                    <tr class="sifre-satir">
                        <td>${x.alanAdi}</td>
                        <td>${x.icerik.kullaniciAdi}</td>
                        <td data-sifre="${x.icerik.sifre}" data-maskeli="true">**********</td>
                        <td>
                            <button class="goster-button" title="${i18n('autoCompleteSifrePanel.goster.title')}"><img src="/images/gizle_icon.png"></button>
                            <button class="qr-button" title="Qr"><img src="/images/qr_icon.png"></button>
                        </td>
                    </tr>
                `

                $(tr).appendTo(sifrePanel);
            })
        }
        
    }
}