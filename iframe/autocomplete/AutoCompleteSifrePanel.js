import Ekran from "/core/Ekran.js";
import { alanAdiGetir, backgroundMesajGonder, icerikDesifreEt, post, sifreAl } from "/core/util.js";

export default class AutoCompleteSifrePanel extends Ekran {

    /** @type {string} */ platform
    /** @type {QRCode} */ qrcode
    /** @type {HariciSifreDesifre[]} */ hariciSifreListesi = []

    /** @type {JQuery<HTMLDivElement>} */ $qrPanel = $('#qrPanel');

    static html() {
        return "/iframe/autocomplete/AutoCompleteSifrePanel.html";
    }
    
    init(_args) {
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
                button.attr('title', 'Gizle');
                button.html(/* html */`<img src="/images/goster_icon.png">`);
            } else {
                sifreTd.text('**********');
                sifreTd.data('maskeli', true);
                button.attr('title', 'Göster');
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
        backgroundMesajGonder({
            mesajTipi: "depoGetir"
        })
        .then(async response => {
            let sifre;
    
            try {
                sifre = await sifreAl();
            } catch(error) {
                window.close();
            }
    
            $('#yukleme').show();
            $('#anaPanel').addClass('engelli');
            post("/hariciSifre/getir", {
                kullaniciKimlik: response.kullaniciKimlik
            })
            .then((/** @type {Cevap<HariciSifreDTO[]>} */ data) => {
                $('#yukleme').hide();
                $('#anaPanel').removeClass('engelli');
                if (data.basarili) {
                    this.hariciSifreListesi.length = 0;
                    data.sonuc
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
                                <td>Şifre bulunamadı</td>
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
                                        <button class="goster-button" title="Göster"><img src="/images/gizle_icon.png"></button>
                                        <button class="qr-button" title="Qr"><img src="/images/qr_icon.png"></button>
                                        
                                    </td>
                                </tr>
                            `
            
                            $(tr).appendTo(sifrePanel);
                        })
                    }
                }
            });    
        });
    };
}