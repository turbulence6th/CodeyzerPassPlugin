/**
 * 
 * @param {HTMLElement} element 
 * @param {(yon: 'yukari'|'asagi'|'sol'|'sag')=>void} kaydirmaEvent 
 */
export default function mouseSuruklemeEvent(element, kaydirmaEvent, hassasslik = 80) {

    let baslangicKoordinat;
    let bitisKoordinat;

    sifirla();

    element.addEventListener('mousedown', function(/** @type {MouseEvent} */ mouseEvent) {
        baslangicKoordinat.x = mouseEvent.clientX;
        baslangicKoordinat.y = mouseEvent.clientY;
    });

    element.addEventListener('touchstart', function(/** @type {TouchEvent} */ touchEvent) {
        baslangicKoordinat.x = touchEvent.touches[0].clientX;
        baslangicKoordinat.y = touchEvent.touches[0].clientY;
    });

    element.addEventListener('mouseup', function(/** @type {MouseEvent} */ mouseEvent) {
        bitisKoordinat.x = mouseEvent.clientX;
        bitisKoordinat.y = mouseEvent.clientY;

        kararVer();
    })

    element.addEventListener('touchend', function(/** @type {TouchEvent} */ touchEvent) {
        bitisKoordinat.x = touchEvent.changedTouches[0].clientX;
        bitisKoordinat.y = touchEvent.changedTouches[0].clientY;

        kararVer();
    });

    function sifirla() {
        baslangicKoordinat = {
            x: null,
            y: null
        };
    
        bitisKoordinat = {
            x: null,
            y: null
        }
    }

    function kararVer() {
        if (baslangicKoordinat.y - bitisKoordinat.y > hassasslik) {
            sifirla();
            kaydirmaEvent('yukari');
        } else if (bitisKoordinat.y - baslangicKoordinat.y > hassasslik) {
            sifirla();
            kaydirmaEvent('asagi');
        }

        if (baslangicKoordinat.x - bitisKoordinat.x > hassasslik) {
            sifirla();
            kaydirmaEvent('sag');
        } else if (bitisKoordinat.x - baslangicKoordinat.x > hassasslik) {
            sifirla();
            kaydirmaEvent('sol');
        }
    }
}