"use strict";

let running = false;
let config;

chrome.webNavigation.onCommitted.addListener(handler);

async function handler(details) {
    const { url } = details;
    if (running || !(/https:\/\/meet\.google\.com\/.+/.test(url) || /https:\/\/us02web\.zoom\.us\/.+/.test(url))) {
        return;
    }

    running = true;
    try {
        const webhook = await getWebhook();
        await fetch(webhook.url, { method: webhook.method });
    } finally {
        running = false;
    }
}

async function getWebhook() {
    if (config === undefined) {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        config = await response.json();
    }

    return config.webhook;
}
