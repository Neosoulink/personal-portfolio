import {
	ACESFilmicToneMapping,
	PCFShadowMap,
	SRGBColorSpace,
	Vector3,
} from "three";
import * as CameraUtils from "three/examples/jsm/utils/CameraUtils";

// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export interface PortalAssets {
	mesh: THREE.Mesh;
	texture: THREE.WebGLRenderTarget;
	camera: THREE.PerspectiveCamera;
}

/** Renderer */
export default class Renderer implements ExperienceBase {
	protected readonly _experience = new HomeExperience();
	protected readonly _appRenderer = this._experience.app.renderer;
	protected readonly _renderPortalAssets: {
		[callbackName: string]: PortalAssets;
	} = {};
	protected _currentRenderTarget = this._appRenderer.instance.getRenderTarget();
	protected _currentXrEnabled = this._appRenderer.instance.xr.enabled;
	protected _currentShadowAutoUpdate =
		this._appRenderer.instance.shadowMap.autoUpdate;
	protected _portalBottomLeftCorner = new Vector3();
	protected _portalBottomRightCorner = new Vector3();
	protected _portalTopLeftCorner = new Vector3();
	protected _portalReflectedPosition = new Vector3();

	constructor() {}

	public construct() {
		this._appRenderer.instance.outputColorSpace = SRGBColorSpace;
		this._appRenderer.instance.toneMapping = ACESFilmicToneMapping;
		this._appRenderer.instance.toneMappingExposure = 1;
		this._appRenderer.instance.shadowMap.enabled = false;
		this._appRenderer.instance.shadowMap.type = PCFShadowMap;
		this._appRenderer.instance.setClearColor("#211d20");
		this._appRenderer.instance.setSize(
			this._experience.app.sizes.width,
			this._experience.app.sizes.height
		);
		this._appRenderer.instance.setPixelRatio(
			this._experience.app.sizes.pixelRatio
		);
		this._appRenderer.instance.localClippingEnabled = true;

		~(() => {
			this._appRenderer.beforeRenderUpdate = () => {
				if (!Object.keys(this._renderPortalAssets).length) return;

				Object.keys(this._renderPortalAssets).forEach((key: string) => {
					if (this._renderPortalAssets[key]) {
						this._currentRenderTarget =
							this._appRenderer.instance.getRenderTarget();
						this._currentXrEnabled = this._appRenderer.instance.xr.enabled;
						this._currentShadowAutoUpdate =
							this._appRenderer.instance.shadowMap.autoUpdate;
						// Avoid camera modification
						this._appRenderer.instance.xr.enabled = false;
						// Avoid re-computing shadows
						this._appRenderer.instance.shadowMap.autoUpdate = false;
						this.renderPortal(
							this._renderPortalAssets[key].mesh,
							this._renderPortalAssets[key].texture,
							this._renderPortalAssets[key].camera
						);
						// restore the original rendering properties
						this._appRenderer.instance.xr.enabled = this._currentXrEnabled;
						this._appRenderer.instance.shadowMap.autoUpdate =
							this._currentShadowAutoUpdate;
						this._appRenderer.instance.setRenderTarget(
							this._currentRenderTarget
						);
					}
				});
			};
		})();
	}

	public destruct() {
		this._appRenderer.beforeRenderUpdate = undefined;
		this._appRenderer.afterRenderUpdate = undefined;
	}

	public renderPortal(
		mesh: THREE.Mesh,
		texture: THREE.WebGLRenderTarget,
		portalCamera: THREE.PerspectiveCamera
	) {
		// set the portal camera position to be reflected about the portal plane
		mesh.worldToLocal(
			this._portalReflectedPosition.copy(
				this._experience.app.camera.instance?.position ?? new Vector3()
			)
		);
		this._portalReflectedPosition.x *= -1.0;
		this._portalReflectedPosition.z *= -1.0;

		mesh.localToWorld(this._portalReflectedPosition);
		portalCamera.position.copy(this._portalReflectedPosition);

		mesh.localToWorld(this._portalBottomLeftCorner.set(50.05, -50.05, 0.0));
		mesh.localToWorld(this._portalBottomRightCorner.set(-50.05, -50.05, 0.0));
		mesh.localToWorld(this._portalTopLeftCorner.set(50.05, 50.05, 0.0));

		// set the projection matrix to encompass the portal's frame
		CameraUtils.frameCorners(
			portalCamera,
			this._portalBottomLeftCorner,
			this._portalBottomRightCorner,
			this._portalTopLeftCorner,
			false
		);

		// render the portal
		texture.texture.colorSpace = this._appRenderer.instance.outputColorSpace;

		this._appRenderer.instance.setRenderTarget(texture);
		this._appRenderer.instance.state.buffers.depth.setMask(true); // making sure the depth buffer is writable so it can be properly cleared, see #18897
		if (this._appRenderer.instance.autoClear === false)
			this._appRenderer.instance.clear();
		mesh.visible = false; // hide this portal from its own rendering
		this._appRenderer.instance.render(this._experience.app.scene, portalCamera);
		mesh.visible = true; // re-enable this portal's visibility for general rendering
	}

	public addPortalMeshAssets(portalName: string, assets: PortalAssets): void {
		this._renderPortalAssets[portalName] = assets;
	}

	public removeBeforeUpdateCallback(portalName: string): void {
		if (this._renderPortalAssets[portalName])
			delete this._renderPortalAssets[portalName];
	}
}
