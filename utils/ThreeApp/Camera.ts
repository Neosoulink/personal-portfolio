import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// CLASSES
import ThreeApp from ".";

export interface CameraProps {
	enableControls: boolean;
}

export default class Camera {
	app = new ThreeApp({});
	intense: THREE.PerspectiveCamera;
	controls?: OrbitControls;

	constructor(props: CameraProps) {
		this.intense = new THREE.PerspectiveCamera(
			75,
			this.app.sizes.width / this.app.sizes.height,
			0.1,
			1000
		);

		this.intense.position.z = 8;
		this.app.scene.add(this.intense);

		if (props.enableControls) {
			this.controls = new OrbitControls(this.intense, this.app.canvas);
			this.controls.enableDamping = true;
		}
	}

	resize() {
		this.intense.aspect = this.app.sizes.width / this.app.sizes.height;
		this.intense.updateProjectionMatrix();
	}

	update() {
		this.controls?.update();
	}
}
