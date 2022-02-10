import CodeyzerBilesen from '/core/bilesenler/CodeyzerBilesen.js';
import { i18n, pluginUrlGetir } from '/core/util.js';

let template = () => /* html */`
<template>
     <style>
        :host {
            all: initial;
        }
        .codeyzer-body {
            color: #ff7f2a;
            background-color: #080808;
            font-family: Monospace;
            font-size: 15px;
        }
    </style>
    <link rel="stylesheet" href="${pluginUrlGetir('/node_modules/bootstrap/dist/css/bootstrap.css')}">
    <link rel="stylesheet" href="${pluginUrlGetir('/core/codeyzer.css')}">
    <div class="codeyzer-body panel">
        
            <select>
                <option>Oğuz</option>
                <option>Semir</option>
            </select> 
       
            <button type="button" class="mt-2" style="width=100%">Doldur</button>
</template>
`;

export default class SifreOnerPanel extends CodeyzerBilesen {

    constructor() {
        super(template);
    }

    connectedCallback() {
        super.connectedCallback();
    }

    init() {
       
    }
}