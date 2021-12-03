import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */`
<template>
    <button type="button" class="codeyzer-checkbox" ref="checkbox">
        <img src="/images/bos_icon.png" style="height:1.1em;"/>
    </button>
    <a ref="label"></a>
</template>
`;

export default class CodeyzerCheckbox extends CodeyzerBilesen {

    /** @type {boolean} */ checked = false

    /** @type {HTMLButtonElement} */ $checkbox
    /** @type {HTMLLabelElement} */ $label

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$checkbox = this.bilesen('checkbox');
        this.$label = this.bilesen('label');
        this.$label.innerText = this.getAttribute('label');

        this.init();
    }

    init() {
        this.$checkbox.addEventListener('click', () => {
            this.checked = !this.checked;
            this.refreshImage();
            $(this).trigger('change');
        });
    }

    refreshImage() {
        if (this.checked) {
            this.$checkbox.innerHTML = /* html */`<img src="/images/tick_icon.png" style="height:1.1em;"/>`;
        } else {
            this.$checkbox.innerHTML = /* html */`<img src="/images/bos_icon.png" style="height:1.1em;"/>`;
        }
    }

    /**
     * @returns {boolean}
     */
    get value() {
        return this.checked;
    }

    /**
     * @param {boolean} val
     */
    set value(val) {
        this.checked = val;
        this.refreshImage();
    }
}