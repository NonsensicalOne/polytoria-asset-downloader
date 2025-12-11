// ==UserScript==
// @name         Polytoria Asset Downloader (for store, doesn't work for faces)
// @namespace    http://tampermonkey.net/
// @version      0.67
// @description  Download Polytoria Assets
// @author       chinese temu workers
// @match        *://*.polytoria.com/store/*
// @license      Unlicense
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const JSONdata = JSON.parse(decodeURIComponent(atob(document.querySelector("#canvas").dataset.options)));
    //console.log(JSONdata);

    const aElement = document.createElement('a');
    aElement.target = "_blank";

    const button = document.createElement('button');
    button.className = 'btn btn-success';

    const icon = document.createElement('i');
    icon.className = 'fas fa-download me-1';

    const buttonText = document.createTextNode(' Download this item');

    button.appendChild(icon);
    button.appendChild(buttonText);

    if (JSONdata.shirt) {
      aElement.href = JSONdata.shirt;
    } else if (JSONdata.pants) {
      aElement.href = JSONdata.pants;
    } else if (JSONdata.items[0]) {
      aElement.href = JSONdata.items[0];
    } else {
      return;
    }

    aElement.appendChild(button);

    document.querySelector("#main-content > div:nth-child(3) > div.container.p-0.p-lg-5 > div.row.justify-content-center > div.col.col-md-9.col-lg-7.text-lg-end > div.row.justify-content-center.justify-content-lg-end > div > div.d-flex > div.flex-grow-1.d-grid.gap-2.mb-4.px-2.px-lg-0").appendChild(aElement);
})();
