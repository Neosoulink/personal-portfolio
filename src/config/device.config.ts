export class DeviceConfig {
	public static ua = "";

	public static BROWSER?:
		| "edge"
		| "opera"
		| "samsung"
		| "uc"
		| "chrome"
		| "firefox"
		| "safari"
		| "ie" = DeviceConfig.checkBrowser();
	public static OS?: "pc" | "windows" | "macos" | "ios" | "android" =
		DeviceConfig.checkOs();
	public static DEVICE?: "pc" | "mobile" | "tablet" =
		DeviceConfig.checkDevice();
	public static IPHONE?: "iphone" = DeviceConfig.checkIPhone();

	public static checkBrowser() {
		if (
			DeviceConfig.ua.indexOf("edge") !== -1 ||
			DeviceConfig.ua.indexOf("edga") !== -1 ||
			DeviceConfig.ua.indexOf("edgios") !== -1
		)
			return (DeviceConfig.BROWSER = "edge");

		if (
			DeviceConfig.ua.indexOf("opera") !== -1 ||
			DeviceConfig.ua.indexOf("opr") !== -1
		)
			return (DeviceConfig.BROWSER = "opera");

		if (DeviceConfig.ua.indexOf("samsungbrowser") !== -1)
			return (DeviceConfig.BROWSER = "samsung");

		if (DeviceConfig.ua.indexOf("ucbrowser") !== -1)
			return (DeviceConfig.BROWSER = "uc");

		if (
			DeviceConfig.ua.indexOf("chrome") !== -1 ||
			DeviceConfig.ua.indexOf("crios") !== -1
		)
			return (DeviceConfig.BROWSER = "chrome");

		if (
			DeviceConfig.ua.indexOf("firefox") !== -1 ||
			DeviceConfig.ua.indexOf("fxios") !== -1
		)
			return (DeviceConfig.BROWSER = "firefox");

		if (DeviceConfig.ua.indexOf("safari") !== -1)
			return (DeviceConfig.BROWSER = "safari");

		if (
			DeviceConfig.ua.indexOf("msie") !== -1 ||
			DeviceConfig.ua.indexOf("trident") !== -1
		) {
			console.warn(`${DeviceConfig.BROWSER}: Browser not supported!`);
			return (DeviceConfig.BROWSER = "ie");
		}

		if (!DeviceConfig.BROWSER) console.warn("Unknown browser");

		return DeviceConfig.BROWSER;
	}

	public static checkOs() {
		if (DeviceConfig.ua.indexOf("windows nt") !== -1)
			return (DeviceConfig.OS = "windows");

		if (DeviceConfig.ua.indexOf("android") !== -1)
			return (DeviceConfig.OS = "android");

		if (
			DeviceConfig.ua.indexOf("iphone") !== -1 ||
			DeviceConfig.ua.indexOf("ipad") !== -1
		)
			return (DeviceConfig.OS = "ios");

		if (DeviceConfig.ua.indexOf("mac os x") !== -1)
			return (DeviceConfig.OS = "macos");

		if (!DeviceConfig.OS) console.warn("Unknown OS");

		return DeviceConfig.OS;
	}

	public static checkDevice() {
		DeviceConfig.DEVICE = "pc";

		if (
			DeviceConfig.ua.indexOf("iphone") !== -1 ||
			(DeviceConfig.ua.indexOf("android") !== -1 &&
				DeviceConfig.ua.indexOf("mobile") !== -1) ||
			DeviceConfig.ua.indexOf("Mobile") !== -1
		)
			return (DeviceConfig.DEVICE = "mobile");

		if (
			DeviceConfig.ua.indexOf("ipad") !== -1 ||
			DeviceConfig.ua.indexOf("android") !== -1
		)
			return (DeviceConfig.DEVICE = "tablet");

		if (
			DeviceConfig.ua.indexOf("ipad") > -1 ||
			(DeviceConfig.ua.indexOf("macintosh") > -1 && "ontouchend" in document)
		)
			return (DeviceConfig.DEVICE = "tablet");

		return DeviceConfig.DEVICE;
	}

	public static checkIPhone() {
		if (DeviceConfig.ua.indexOf("iphone") !== -1)
			DeviceConfig.IPHONE = "iphone";

		return DeviceConfig.IPHONE;
	}
}
