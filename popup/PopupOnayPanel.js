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

    /** @type {JQuery<HTMLHeadingElement>} */ $baslik
    /** @type {JQuery<HTMLDivElement>} */ $icerik
    /** @type {JQuery<HTMLButtonElement>}  */ $onaylaButton
    /** @type {JQuery<HTMLButtonElement>} */ $iptalButton

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
        $('body').append($(this));
        $('#anaPanel').addClass('engelli');
        this.$baslik.text(baslik);
        this.$icerik.text(icerik);
        return new Promise((resolve, _reject) => {
            this.$onaylaButton.on('click', () => resolve(true));
            this.$iptalButton.on('click', () => resolve(false));
        }).finally(() => {
            $('#anaPanel').removeClass('engelli');
            $(this).remove();
        });
    }
}