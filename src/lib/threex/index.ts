import * as htmlMixer from "./html-mixer";
import * as htmlMultipleMixer from "./html-multiple-mixer";
import * as htmlMixerHelper from "./html-mixer-helper";

export default {
	htmlMixer,
	/**
	 * Special wrapper to handle multiple THREEx.HtmlMixer.Context for a single WebglRenderer.
	 * _💡 Especially useful when the `webglRenderer` is doing scissor/viewport like **multiviewport** editors._
	 */
	htmlMultipleMixer,
	htmlMixerHelper,
};
