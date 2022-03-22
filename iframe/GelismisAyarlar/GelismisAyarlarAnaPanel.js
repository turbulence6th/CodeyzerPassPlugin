import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { getAygitYonetici, i18n, setDepo } from '/core/util.js';
import NavigasyonPanel from '/iframe/GelismisAyarlar/NavigasyonPanel.js';
import NavigasyonPanelSatir from '/iframe/GelismisAyarlar/NavigasyonPanelSatir.js';

const template = () => /* html */ `
<template>
    <navigasyon-panel ref="navigasyonPanel"></navigasyon-panel>
    <div ref="gelismisPanel">
        <h3>${i18n('gelismisAyarlarAnaPanel.hosgeldiniz.title')}</h3>
    </div>
</template>
`;

export default class GelismisAyarlarAnaPanel extends CodeyzerBilesen {

    /** @type {NavigasyonPanel} */ $navigasyonPanel;
    /** @type {HTMLDivElement} */ $gelismisPanel;

    constructor() {
        super(template);
    }

    init() {
        this.$navigasyonPanel = this.bilesen('navigasyonPanel');
        this.$gelismisPanel = this.bilesen('gelismisPanel');

        getAygitYonetici().depoGetir()
        .then((response) => {
            if (response != null) {
                setDepo(response);         
            }
        })

        this.$navigasyonPanel.panelEtkinlestiginde((/** @type {NavigasyonPanelSatir} */ satir) => this.goster(satir));
    }

    /**
     * 
     * @param {NavigasyonPanelSatir} panelSatir 
     */
    goster(panelSatir) {
        this.$gelismisPanel.innerHTML = '';
        this.$gelismisPanel.append(panelSatir.$satirPanel);
    }
}