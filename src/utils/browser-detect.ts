

export let browserName: string = "";
export let browserVersion: string | number = "";
export let deviceName: string = "computer";

export function detectBrowser() {
    const userAgent = navigator.userAgent;
    if (/Firefox[\/\s](\d+\.\d+)/.test(userAgent)) {
        browserName = "firefox";
        browserVersion = Math.floor(Number(RegExp.$1));
    } else if (/MSIE (\d+\.\d+);/.test(userAgent)) {
        browserName = "internet explorer";
        browserVersion = Math.floor(Number(RegExp.$1));
    } else if (/Opera[\/\s](\d+\.\d+)/.test(userAgent)) {
        browserName = "opera";
        browserVersion = Math.floor(Number(RegExp.$1));
    } else if (userAgent.toLowerCase().indexOf("chrome") > -1 && userAgent.toLowerCase().indexOf("safari") > -1) {
        browserName = "chrome";
        browserVersion = "";
    } else if (userAgent.toLowerCase().indexOf("chrome") === -1 && userAgent.toLowerCase().indexOf("safari") > -1) {
        browserName = "safari";
        browserVersion = "";
    }
}

export function detectDevice() {
    const ua = navigator.userAgent;
    deviceName =
        ua.match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i)
            ? "iosdevice"
            : ua.match(/Android/i)
                ? "android"
                : ua.match(/BlackBerry/i)
                    ? "blackberry"
                    : ua.match(/IEMobile/i)
                        ? "iemobile"
                        : ua.match(/Silk/i)
                            ? "kindle"
                            : "computer";
}

// Initial detection
detectBrowser();
detectDevice();


