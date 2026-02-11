// ==UserScript==
// @name         Polytoria Store Asset Downloader
// @namespace    http://tampermonkey.net/
// @version      0.69
// @author       chinese temu workers and AlfaCodeo
// @description  Streamlines the process of ripping textures from polytoria store.
// @match        *://*.polytoria.com/store/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    let assetURL = null;
    let buttonCreated = false;

    function findContainer() {
        return (
            document.querySelector(".d-grid.gap-2") ||
            document.querySelector(".d-grid") ||
            document.querySelector(".btn")?.parentElement
        );
    }

    function createButton(url) {

        if (buttonCreated) return;

        const interval = setInterval(() => {

            const container = findContainer();

            if (!container) return;

            const btn = document.createElement("a");

            btn.href = url;
            btn.target = "_blank";

            btn.className = "btn btn-success";
            btn.innerHTML = '<i class="fas fa-download me-1"></i> Download';

            container.appendChild(btn);

            buttonCreated = true;

            clearInterval(interval);

        }, 200);
    }

    function extract(text) {

        if (assetURL) return;

        const match = text.match(
            /https:\/\/cdn\.polytoria\.com\/assets\/[A-Za-z0-9]+\.(png|jpg|webp)/
        );

        if (match) {

            assetURL = match[0];

            createButton(assetURL);
        }
    }

    // Hook fetch early
    const origFetch = window.fetch;

    window.fetch = async function (...args) {

        const res = await origFetch.apply(this, args);

        res.clone().text().then(extract).catch(()=>{});

        return res;
    };

    // Hook XHR early
    const origOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (...args) {

        this.addEventListener("load", function () {

            if (this.responseText) extract(this.responseText);

        });

        return origOpen.apply(this, args);
    };

    // Also check already loaded resources
    window.addEventListener("load", () => {

        const entries = performance.getEntriesByType("resource");

        for (const entry of entries) {

            if (entry.name.includes("cdn.polytoria.com/assets/")) {

                assetURL = entry.name;

                createButton(assetURL);

                break;
            }
        }
    });

})();
