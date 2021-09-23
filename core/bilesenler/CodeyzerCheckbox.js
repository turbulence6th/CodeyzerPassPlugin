import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';

const template = () => /* html */`
<template>
    <button type="button" class="codeyzer-checkbox" ref="checkbox">
        <img src="/images/bos_icon.png"/>
    </button>
    <a ref="label"></a>
</template>
`;

export default class CodeyzerCheckbox extends CodeyzerBilesen {

    /** @type {boolean} */ checked = false

    /** @type {JQuery<HTMLButtonElement>} */ $checkbox
    /** @type {JQuery<HTMLLabelElement>} */ $label

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();

        this.$checkbox = this.bilesen('checkbox');
        this.$label = this.bilesen('label');
        this.$label.text(this.getAttribute('label'));

        this.init();
    }

    init() {
        this.$checkbox.on('click', () => {
            this.checked = !this.checked;
            this.refreshImage();
            $(this).trigger('change');
        });
    }

    refreshImage() {
        if (this.checked) {
            this.$checkbox.html(/* html */`<img src="/images/tick_icon.png"/>`);
        } else {
            this.$checkbox.html(/* html */`<img src="/images/bos_icon.png"/>`);
        }
    }

    get value() {
        return this.checked.toString();
    }

    set value(val) {
        this.checked = val === "true";
        this.refreshImage();
    }
}