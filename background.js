"use strict";

let currentRequest;
let config;
getConfig();

chrome.webNavigation.onCommitted.addListener(handler);

function handler(details) {
    if (config === undefined || currentRequest !== undefined) {
        return;
    }

    const { webhook } = config;
    const { url } = details;
    if (/https:\/\/meet.google.com\/.+/.test(url) || /https:\/\/us02web.zoom.us\/.+/.test(url)) {
        currentRequest = new XMLHttpRequest();
        currentRequest.open(webhook.method, webhook.url);
        currentRequest.onload = () => {
            currentRequest = undefined;
        };
        currentRequest.onerror = (e) => {
            alert(e);
            currentRequest = undefined;
        };
        currentRequest.send();
    }
}

function getConfig() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('config.json'), true);
    xhr.onload = () => {
        config = JSON.parse(xhr.response);
    };
    xhr.onerror = (e) => {
        alert(e);
    };
    xhr.send();
}