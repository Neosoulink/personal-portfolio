import {
	HtmlMixerContext,
	HtmlMixerPlane,
	type HtmlMixerPlaneOpts,
} from "./html-mixer";


/**
 * Multiple context handled as one, thus able to handle multi viewport
 */
export class HtmlMultipleMixerContext {
	contexts: HtmlMixerContext[] = [];

	update() {
		this.contexts.forEach((context) => context.update());
	}
}

interface HtmlMultipleMixerPlaneOpts extends HtmlMixerPlaneOpts {}

export class HtmlMultipleMixerPlane {
	public opts: HtmlMultipleMixerPlaneOpts;
	public object3d: THREE.Mesh<THREE.PlaneGeometry>;
	public planes: HtmlMixerPlane[] = [];

	constructor(
		multipleMixerContext: HtmlMultipleMixerContext,
		domElement: HTMLElement,
		opts: HtmlMultipleMixerPlaneOpts
	) {
		this.opts = opts || {};
		this.opts = JSON.parse(JSON.stringify(this.opts));

		let contexts = multipleMixerContext.contexts;

		let mixerContext = contexts[0];
		let plane = new HtmlMixerPlane(mixerContext, domElement, opts);

		this.planes.push(plane);

		this.object3d = plane.object3d;

		this.opts.object3d = this.object3d;

		for (let i = 1; i < contexts.length; i++) {
			let mixerContext = contexts[i];
			let cloneElement = domElement.cloneNode() as HTMLElement;
			let plane = new HtmlMixerPlane(mixerContext, cloneElement, opts);
			this.planes.push(plane);
		}
	}
	// update all context
	update = () => {
		this.planes.forEach((plane) => plane.update());
	};
}
