var platform;
var qrcode;

$(document).ready(function() {
    $('#yukleme').hide();
    $('#qrPanel').hide();
    sifreGetir();

   qrcode = new QRCode("qrcode", {
        width: 220,
        height: 220,
        colorDark : "#000000",
        colorLight : "#ff7f2a",
        correctLevel : QRCode.CorrectLevel.H
    });
});

let sifreGetir = () => {
    chrome.runtime.sendMessage({
        mesajTipi: "depoGetir"
    }, (response) => {
        $('#yukleme').show();
        $('#anaPanel').addClass('engelli');
        post("/hariciSifre/getir", {
            kullaniciKimlik: response.kullaniciKimlik
        })
        .then(data => {
            $('#yukleme').hide();
            $('#anaPanel').removeClass('engelli');
            if (data.basarili) {
                hariciSifreListesi = data.sonuc
                .map(x => {
                    x.icerik = icerikDesifreEt(x.icerik, response.sifre);
                    x.alanAdi = alanAdiGetir(x.icerik.platform);
                    return x;
                })
                .sort((x, y) => x.alanAdi.localeCompare(y.alanAdi));
    
                let sifrePanel = $('#sifrePanel');

                if (hariciSifreListesi.length === 0) {
                    let tr =    `<tr class="sifre-satir">
                                    <td>Şifre bulunamadı</td>
                                    <td></td>
                                    <td></td>
                                </tr>`

                    $(tr).appendTo(sifrePanel);
                } else {
                    hariciSifreListesi.forEach(x => {
                        let tr =    `<tr class="sifre-satir">
                                        <td>${x.alanAdi}</td>
                                        <td>${x.icerik.kullaniciAdi}</td>
                                        <td data-sifre="${x.icerik.sifre}" data-maskeli="true">**********</td>
                                        <td>
                                            <button class="goster-button" title="Göster"><img src="/images/gizle_icon.png"></button>
                                            <button class="qr-button" title="Qr"><img src="/images/qr_icon.png"></button>
                                           
                                        </td>
                                     </tr>`
        
                        $(tr).appendTo(sifrePanel);
                    })
                }
            }
        });    
    });
};

$('#qrKapatButton').on("click", function() {
    setTimeout(() => $('#anaPanel').removeClass('engelli'), 250);
    $('#qrPanel').fadeOut(500);
});

$(document).on("click", ".goster-button", function() {
    let button = $(this);
    let sifreTd = button.parent().prev();
    if (sifreTd.data('maskeli')) {
        sifreTd.text(sifreTd.data('sifre'));
        sifreTd.data('maskeli', false);
        button.attr('title', 'Gizle');
        button.html('<img src="/images/goster_icon.png">');
    } else {
        sifreTd.text('**********');
        sifreTd.data('maskeli', true);
        button.attr('title', 'Göster');
        button.html('<img src="/images/gizle_icon.png">');
    }
})

$(document).on("click", ".qr-button", function(event) {
    let button = $(this);
    let sifreTd = button.parent().prev();
    let sifre = sifreTd.data('sifre');
    
    qrcode.clear();
    qrcode.makeCode(sifre);

    $('#qrPanel').fadeIn(500);
    $('#anaPanel').addClass('engelli');
});