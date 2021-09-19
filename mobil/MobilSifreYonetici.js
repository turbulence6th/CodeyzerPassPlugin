import SifreYonetici from '/core/SifreYonetici.js';
import { getDepo } from '/core/util.js';

export default class MobilSifreYonetici extends SifreYonetici {

    /**
     * 
     * @returns {Promise<string>}
     */
    sifreAl() {
        return new Promise((resolve, reject) => {
            resolve(getDepo().sifre);
        });
    }
}