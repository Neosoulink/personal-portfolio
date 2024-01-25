export class DeviceConfig {
	public static readonly ua = window.navigator.userAgent.toLowerCase();

	private static _BROWSER?: string = DeviceConfig._checkBrowser();
	private static _OS?: string = DeviceConfig._checkOs();
	private static _DEVICE?: string = DeviceConfig._checkDevice();
	private static _IPHONE?: string = DeviceConfig._checkIPhone();

	public static get BROWSER() {
		return DeviceConfig._BROWSER;
	}

	public static get OS() {
		return DeviceConfig._OS;
	}

	public static get DEVICE() {
		return DeviceConfig._DEVICE;
	}

	public static get IPHONE() {
		return DeviceConfig._IPHONE;
	}

	private static _checkBrowser() {
		if (
			DeviceConfig.ua.indexOf("edge") !== -1 ||
			DeviceConfig.ua.indexOf("edga") !== -1 ||
			DeviceConfig.ua.indexOf("edgios") !== -1
		)
			DeviceConfig._BROWSER = "edge";

		if (
			DeviceConfig.ua.indexOf("opera") !== -1 ||
			DeviceConfig.ua.indexOf("opr") !== -1
		)
			DeviceConfig._BROWSER = "opera";

		if (DeviceConfig.ua.indexOf("samsungbrowser") !== -1)
			DeviceConfig._BROWSER = "samsung";

		if (DeviceConfig.ua.indexOf("ucbrowser") !== -1)
			DeviceConfig._BROWSER = "uc";

		if (
			DeviceConfig.ua.indexOf("chrome") !== -1 ||
			DeviceConfig.ua.indexOf("crios") !== -1
		)
			DeviceConfig._BROWSER = "chrome";

		if (
			DeviceConfig.ua.indexOf("firefox") !== -1 ||
			DeviceConfig.ua.indexOf("fxios") !== -1
		)
			DeviceConfig._BROWSER = "firefox";

		if (DeviceConfig.ua.indexOf("safari") !== -1)
			DeviceConfig._BROWSER = "safari";

		if (
			DeviceConfig.ua.indexOf("msie") !== -1 ||
			DeviceConfig.ua.indexOf("trident") !== -1
		) {
			DeviceConfig._BROWSER = "ie";
			console.warn(`${DeviceConfig._BROWSER}: Browser not supported!`);
		}

		if (!DeviceConfig._BROWSER) console.warn("Unknown browser");

		return DeviceConfig._BROWSER;
	}

	private static _checkOs() {
		if (DeviceConfig.ua.indexOf("windows nt") !== -1)
			DeviceConfig._OS = "windows";

		if (DeviceConfig.ua.indexOf("android") !== -1) DeviceConfig._OS = "android";

		if (
			DeviceConfig.ua.indexOf("iphone") !== -1 ||
			DeviceConfig.ua.indexOf("ipad") !== -1
		)
			DeviceConfig._OS = "ios";

		if (DeviceConfig.ua.indexOf("mac os x") !== -1) DeviceConfig._OS = "macos";

		if (!DeviceConfig._OS) console.warn("Unknown _OS");

		return DeviceConfig._OS;
	}

	private static _checkDevice() {
		DeviceConfig._DEVICE = "pc";

		if (
			DeviceConfig.ua.indexOf("iphone") !== -1 ||
			(DeviceConfig.ua.indexOf("android") !== -1 &&
				DeviceConfig.ua.indexOf("Mobile") > 0)
		)
			DeviceConfig._DEVICE = "mobile";

		if (
			DeviceConfig.ua.indexOf("ipad") !== -1 ||
			DeviceConfig.ua.indexOf("android") !== -1
		)
			DeviceConfig._DEVICE = "tablet";

		if (
			DeviceConfig.ua.indexOf("ipad") > -1 ||
			(DeviceConfig.ua.indexOf("macintosh") > -1 && "ontouchend" in document)
		)
			DeviceConfig._DEVICE = "tablet";

		return DeviceConfig._DEVICE;
	}

	private static _checkIPhone() {
		if (DeviceConfig.ua.indexOf("iphone") !== -1)
			DeviceConfig._IPHONE = "iphone";

		return DeviceConfig._IPHONE;
	}
}
