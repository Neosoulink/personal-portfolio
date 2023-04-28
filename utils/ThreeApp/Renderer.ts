import * as THREE from "three";

// CLASSES
import ThreeApp from ".";

export interface intenseProps {}

export default class Renderer {
	private app = new ThreeApp({});
	intense: THREE.WebGLRenderer;

	constructor() {
		this.intense = new THREE.WebGLRenderer({
			canvas: this.app.canvas,
			antialias: true,
			alpha: true,
		});

		this.intense.physicallyCorrectLights = true;
		this.intense.outputEncoding = THREE.sRGBEncoding;
		this.intense.toneMapping = THREE.CineonToneMapping;
		this.intense.toneMappingExposure = 1.75;
		this.intense.shadowMap.enabled = true;
		this.intense.shadowMap.type = THREE.PCFSoftShadowMap;
		this.intense.setClearColor("#211d20");
		this.intense.setSize(this.app.sizes.width, this.app.sizes.height);
		this.intense.setPixelRatio(this.app.sizes.pixelRatio);
	}

	resize() {
		this.intense.setSize(this.app.sizes.width, this.app.sizes.height);
		this.intense.setPixelRatio(this.app.sizes.pixelRatio);
	}

	update() {
		this.intense.render(this.app.scene, this.app.cameraIntense);
	}
}
