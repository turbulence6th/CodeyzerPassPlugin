var platform;

$(document).ready(function() {
    $('#yukleme').hide();
    platformGetir();
});

let platformGetir = () => {
    mesajGonder({
        mesajTipi: "platform",
    }, response => {
        platform = response.platform;
        sifreGetir();
    });  
};

let sifreGetir = () => {
    chrome.runtime.sendMessage({
        mesajTipi: "depoGetir"
    }, (response) => {
        $('#yukleme').show();
        post("/hariciSifre/getir", {
            kullaniciKimlik: response.kullaniciKimlik
        })
        .then(data => {
            $('#yukleme').hide();
            if (data.basarili) {
                let platformAlanAdi = alanAdiGetir(platform);
                hariciSifreListesi = data.sonuc
                .map(x => {
                    x.icerik = icerikDesifreEt(x.icerik, response.sifre);
                    return x;
                })
                .filter(x => platformAlanAdi === alanAdiGetir(x.icerik.platform));
    
                let sifrePanel = $('#sifrePanel');
                hariciSifreListesi.forEach(x => {
                    let tr =    `<tr class="sifre-satir">
                                    <td>${x.icerik.kullaniciAdi}</td>
                                    <td data-sifre="${x.icerik.sifre}" data-maskeli="true">**********</td>
                                    <td>
                                        <button class="goster-button"><img src="/images/gizle_icon.png" width="16px"></button>
                                        <button class="kullan-button">Kullan</button>
                                    </td>
                                 </tr>`
    
                    $(tr).appendTo(sifrePanel);
                })
            }
        });    
    });
};

$('#kapatButton').on("click", function() {
    const message = JSON.stringify({
        mesajTipi: 'codeyzerKapat'
    });
    window.parent.postMessage(message, '*');
});

$(document).on("click", ".goster-button", function() {
    let button = $(this);
    let sifreTd = button.parent().prev();
    if (sifreTd.data('maskeli')) {
        sifreTd.text(sifreTd.data('sifre'));
        sifreTd.data('maskeli', false);
        button.html('<img src="/images/goster_icon.png" width="16px">');
    } else {
        sifreTd.text('**********');
        sifreTd.data('maskeli', true);
        button.html('<img src="/images/gizle_icon.png" width="16px">');
    }
})

$(document).on("click", ".kullan-button", function() {
    let button = $(this);
    let sifreTd = button.parent().prev();
    let kullaniciAdiTd = sifreTd.prev();

    let kullaniciAdi = kullaniciAdiTd.text();
    let sifre = sifreTd.data('sifre');

    const message = JSON.stringify({
        mesajTipi: 'codeyzerDoldur',
        kullaniciAdi: kullaniciAdi,
        sifre: sifre
    });
    window.parent.postMessage(message, '*');
});