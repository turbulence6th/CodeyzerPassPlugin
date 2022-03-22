import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { i18n } from '/core/util.js';
import NavigasyonPanelSatir from '/iframe/GelismisAyarlar/NavigasyonPanelSatir.js';

const template = () => /* html */ `
<template>
    <div ref="panel" class="yanPanel">
        <navigasyon-panel-satir baslik="${i18n('navigasyonPanel.kasa.baslik')}" ref="kasa">
            <kasa-panel slot="satirPanel"></kasa-panel>
        </navigasyon-panel-satir>
    </div>
</template>
`;

export default class NavigasyonPanel extends CodeyzerBilesen {

    /** @type {HTMLDivElement} */ $panel;
    /** @type {(secilen: NavigasyonPanelSatir) => void} */ geriCagir;

    constructor() {
        super(template);
    }

    init() {
        this.$panel = this.bilesen('panel');

        for (let cocuk of this.$panel.childNodes) {
            if (cocuk instanceof NavigasyonPanelSatir) {
                /** @type {NavigasyonPanelSatir} */ let satir = cocuk;
                satir.addEventListener('click', () => this.panelEtkinlestir(satir));
            }
        }
    }

    /**
     * 
     * @param {NavigasyonPanelSatir} secilen 
     */
    panelEtkinlestir(secilen) {
        for (let cocuk of this.$panel.childNodes) {
            if (cocuk instanceof NavigasyonPanelSatir) {
                /** @type {NavigasyonPanelSatir} */ let satir = cocuk;
                satir.seciliKaldir();
            }
        }

        secilen.seciliYap();
        this.geriCagir?.(secilen);
    }

    /**
     * 
     * @param {(secilen: NavigasyonPanelSatir) => void} geriCagir 
     */
    panelEtkinlestiginde(geriCagir) {
        this.geriCagir = geriCagir;
    }
}