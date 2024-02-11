import {
	PlaneGeometry,
	Mesh,
	ShaderMaterial,
	DoubleSide,
	Color,
	Vector2,
	Raycaster,
} from "three";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// EXPERIENCE
import { ContentExperience } from "..";

// STATIC
import { events } from "~/static";

// SHADERS
import fragmentShader from "./shader/fragment.glsl";
import vertexShader from "./shader/vertex.glsl";
import { MathUtils } from "three/src/math/MathUtils.js";

export class World extends ExperienceBasedBlueprint {
	protected _experience = new ContentExperience();

	private readonly _appTime = this._experience.app.time;
	private readonly _appScene = this._experience.app.scene;
	private readonly _appSizes = this._experience.app.sizes;
	private readonly _ui = this._experience.ui;
	private readonly _camera = this._experience.camera;
	private readonly _onPointerMove = (e: PointerEvent, x: number, y: number) => {
		this._calculatePlaneUv(x, y);
		this._calculatePlaneRotation(x, y);
	};
	private readonly _onDeviceOrientation = (
		e: PointerEvent,
		beta: number,
		gamma: number
	) => {
		this._calculatePlaneRotation(beta, gamma);
	};
	private readonly _oResize = () => {
		if (!this._plane || !this._camera?.instance) return;

		const cameraDepth = this._camera.instance.position.z;
		const distance = cameraDepth - this._plane.position.z;
		const fov = (this._camera.instance.fov * Math.PI) / 180;
		const scaleY = 2 * Math.tan(fov / 2) * distance;
		const scaleX = scaleY * this._camera.instance.aspect;
		const newScale = scaleY + scaleX;

		if (this._plane?.material.uniforms.uUvScale)
			this._plane.material.uniforms.uUvScale.value = newScale;
		this._plane.scale.set(newScale, newScale, 1);
	};

	private _prevPointerCoord = {
		x: 0,
		y: 0,
	};
	private _planeTargetRotation = {
		x: 0,
		y: 0,
	};
	private _raycaster?: Raycaster;
	private _cursorCurrentX = 0.5;
	private _cursorCurrentY = 0.5;
	private _planeCursorTargetX = 0.5;
	private _planeCursorTargetY = 0.5;
	private _plane?: Mesh<PlaneGeometry, ShaderMaterial>;
	private _uTime = 0;

	private _initPlane() {
		if (!this._raycaster) return;

		this._raycaster.intersectObject;
		const geometry = new PlaneGeometry(1, 1, 100, 100);
		const material = new ShaderMaterial({
			fragmentShader,
			vertexShader,
			side: DoubleSide,
			uniforms: {
				uTime: { value: this._uTime },
				uCursor: { value: new Vector2() },
				uDisplacementMultiplayer: { value: 0.07 },
				uDisplacementRadius: { value: 12 },
				uUvScale: { value: 1 },
				uColors: {
					value: [new Color(0x454545), new Color(0x1d1d1d)],
				},
			},
		});

		this._plane = new Mesh(geometry, material);

		this._appScene.add(this._plane);
	}
	private _calculatePlaneUv(x: number, y: number) {
		if (!this._plane || !this._raycaster || !this._camera?.instance) return;

		this._raycaster.setFromCamera(new Vector2(x, y), this._camera.instance);

		const intersects = this._raycaster.intersectObject(this._plane, false);
		const intersectedObject = intersects[0];

		if (!intersectedObject?.uv) return;
		this._planeCursorTargetX = intersectedObject.uv.x;
		this._planeCursorTargetY = intersectedObject.uv.y;
	}
	private _calculatePlaneRotation(x: number, y: number) {
		if (!this._raycaster || !this._camera?.instance || !this._plane) return;

		const rotationX = (y - this._prevPointerCoord.y) * 0.2;
		const rotationY = (x - this._prevPointerCoord.x) * 0.2;

		this._planeTargetRotation.x -= rotationX;
		this._planeTargetRotation.y += rotationY;

		this._prevPointerCoord = {
			x,
			y,
		};
	}

	private _interpolatePointerCoord() {
		const ease = 0.1;
		this._cursorCurrentX = MathUtils.lerp(
			this._cursorCurrentX,
			this._planeCursorTargetX,
			ease
		);
		this._cursorCurrentY = MathUtils.lerp(
			this._cursorCurrentY,
			this._planeCursorTargetY,
			ease
		);
	}

	private _interpolatePlaneRotation() {
		if (!this._plane) return;
		const ease = 0.1;

		this._plane.rotation.x = MathUtils.lerp(
			this._plane.rotation.x,
			this._planeTargetRotation.x,
			ease
		);
		this._plane.rotation.y = MathUtils.lerp(
			this._plane.rotation.y,
			this._planeTargetRotation.y,
			ease
		);
	}

	public construct() {
		this._raycaster = new Raycaster();
		this._initPlane();
		this._oResize();

		this._ui?.on(events.POINTER_MOVE, this._onPointerMove);
		this._ui?.on(events.DEVICE_ORIENTATION, this._onDeviceOrientation);
		this._appSizes.on("resize", this._oResize);

		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		if (this._plane) {
			this._plane.removeFromParent();
			this._plane.material.dispose();
			this._plane = undefined;
		}
		if (this._raycaster) this._raycaster = undefined;

		this._ui?.off(events.POINTER_MOVE, this._onPointerMove);
		this._ui?.off(events.DEVICE_ORIENTATION, this._onDeviceOrientation);
		this._appSizes.off("resize", this._oResize);

		this.emit(events.DESTRUCTED);
	}

	public update() {
		if (!this._plane) return;

		this._uTime = this._appTime.elapsed * 0.001;

		if (typeof this._plane.material.uniforms?.uTime?.value === "number")
			this._plane.material.uniforms.uTime.value = this._uTime;

		if (this._plane.material.uniforms?.uCursor?.value instanceof Vector2)
			this._plane.material.uniforms.uCursor.value.set(
				this._cursorCurrentX,
				this._cursorCurrentY
			);

		this._interpolatePointerCoord();
		this._interpolatePlaneRotation();
	}
}
