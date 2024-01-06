import { HtmlMixerPlane } from "./html-mixer";
import { HtmlMultipleMixerPlane } from "./html-multiple-mixer";

export const isIOS = () => {
	var iosQuirkPresent = function () {
		var audio = new Audio();

		audio.volume = 0.5;
		return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
	};

	var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	var isAppleDevice = navigator.userAgent.includes("Macintosh");
	var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

	return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
};

/**
 * create domElement for a iframe to insert in a THREEx.HtmlmixedPlane
 *
 * @param  {String} url  the url for the iframe
 */
export const createIframeDomElement = (
	url: string
): HTMLDivElement | HTMLIFrameElement => {
	// create the iframe element
	let domElement = document.createElement("iframe");
	domElement.src = url;
	domElement.style.border = "none";

	// TODO:: Ensure the IOS (and other mobile devices) compatibility
	// IOS workaround for iframe
	if (isIOS()) {
		// - see the following post for explanation on this workaround
		// - http://dev.magnolia-cms.com/blog/2012/05/strategies-for-the-iframe-on-the-ipad-problem/
		domElement.style.width = "100%";
		domElement.style.height = "100%";

		let container = document.createElement("div");

		container.appendChild(domElement);
		container.style.overflow = "scroll";

		return container;
	}

	return domElement;
};

/**
 * Set the iframe.src in a mixerPlane.
 * - Useful as it handle IOS specificities
 */
export const setIframeSrc = (
	mixerPlane: HtmlMultipleMixerPlane | HtmlMixerPlane,
	url: string
) => {
	// handle THREEx.HtmlMultipleMixer.Plane
	if (mixerPlane instanceof HtmlMultipleMixerPlane) {
		mixerPlane.planes.forEach(function (plane) {
			setIframeSrc(plane, url);
		});
		return;
	}

	// Sanity check
	console.assert(mixerPlane instanceof HtmlMixerPlane);
	// Get the domElement
	let domElement = mixerPlane.domElement;
	// Handle IOS special case
	if (isIOS() && mixerPlane.domElement.firstChild instanceof HTMLElement)
		domElement = mixerPlane.domElement.firstChild;

	// sanity check
	console.assert(domElement instanceof HTMLIFrameElement);
	if (domElement instanceof HTMLIFrameElement)
		// actually set the iframe.src
		domElement.src = url;
};

/**
 * Create domElement for a image to insert in a THREEx.HtmlmixedPlane
 *
 * @param  {String} url  the url for the iframe
 */
export const createImageDomElement = (url: string) => {
	let domElement = document.createElement("img");
	domElement.src = url;
	return domElement;
};
