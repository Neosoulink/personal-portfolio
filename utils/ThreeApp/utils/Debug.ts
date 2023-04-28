import { GUI } from "lil-gui";

export default class Debug {
	active = window.location.hash === "#debug";
	ui?: GUI;

	constructor() {
		if (this.active) {
			this.ui = new GUI();
		}
	}
}
