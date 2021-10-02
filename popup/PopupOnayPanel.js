import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */`
<template>
    <div class="panel sifreKontroluPanel" style="height: 220px">
        <form autocomplete="off" class="mt-3">
            <div class="baslik text-center">
                <h5 ref="baslik"></h5>
            </div>
            <div ref="icerik" class="form-group mt-4">
                
            </div>
            <div class="row d-flex justify-content-end">
                <button class="mr-3" ref="onaylaButton" type="button">Onayla</button>
                <button class="mr-3" ref="iptalButton" type="button">İptal</button>
            </div>
        </form>
    </div>
</template>
`;

export default class PopupOnayPanel extends CodeyzerBilesen {

    /** @type {HTMLHeadingElement} */ $baslik
    /** @type {HTMLDivElement} */ $icerik
    /** @type {HTMLButtonElement}  */ $onaylaButton
    /** @type {HTMLButtonElement} */ $iptalButton

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$baslik = this.bilesen('baslik');
        this.$icerik = this.bilesen('icerik');
        this.$onaylaButton = this.bilesen('onaylaButton');
        this.$iptalButton = this.bilesen('iptalButton');
    }

    init() {
       
    }

    /**
     * 
     * @param {string} baslik
     * @param {string} icerik
     * @returns {Promise<boolean>}
     */
    onayDialog(baslik, icerik) {
        document.body.append(this);
        let $anaPanel = document.querySelector('#anaPanel');
        $anaPanel.classList.add('engelli');
        this.$baslik.innerText = baslik;
        this.$icerik.innerText = icerik;
        return new Promise((resolve, _reject) => {
            this.$onaylaButton.addEventListener('click', () => resolve(true));
            this.$iptalButton.addEventListener('click', () => resolve(false));
        }).finally(() => {
            $anaPanel.classList.remove('engelli');
            this.remove();
        });
    }
}