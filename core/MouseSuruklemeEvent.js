/**
 * 
 * @param {HTMLElement} element 
 * @param {(yon: 'yukari'|'asagi'|'sol'|'sag')=>void} kaydirmaEvent 
 */
export default function mouseSuruklemeEvent(element, kaydirmaEvent, hassasslik = 40) {

    let baslangicKoordinat = {
        x: null,
        y: null
    };

    let bitisKoordinat = {
        x: null,
        y: null
    }

    element.addEventListener('mousedown', function(/** @type {MouseEvent} */ mouseEvent) {
        baslangicKoordinat.x = mouseEvent.clientX;
        baslangicKoordinat.y = mouseEvent.clientY;
    });

    element.addEventListener('touchstart', function(/** @type {TouchEvent} */ touchEvent) {
        baslangicKoordinat.x = touchEvent.touches[0].clientX;
        baslangicKoordinat.x = touchEvent.touches[0].clientX;
    });

    element.addEventListener('mouseup', function(/** @type {MouseEvent} */ mouseEvent) {
        bitisKoordinat.x = mouseEvent.clientX;
        bitisKoordinat.y = mouseEvent.clientY;

        kararVer();
    })

    element.addEventListener('touchend', function(/** @type {TouchEvent} */ touchEvent) {
        bitisKoordinat.x = touchEvent.changedTouches[0].clientX;
        bitisKoordinat.x = touchEvent.changedTouches[0].clientX;

        kararVer();
    });

    function kararVer() {
        if (baslangicKoordinat.y - bitisKoordinat.y > hassasslik) {
            kaydirmaEvent('yukari');
        } else if (bitisKoordinat.y - baslangicKoordinat.y > hassasslik) {
            kaydirmaEvent('asagi');
        }

        if (baslangicKoordinat.x - bitisKoordinat.x > hassasslik) {
            kaydirmaEvent('sol');
        } else if (bitisKoordinat.x - baslangicKoordinat.x > hassasslik) {
            kaydirmaEvent('sag');
        }
    }
}