import {
	Box3,
	LinearSRGBColorSpace,
	Matrix4,
	Mesh,
	NoToneMapping,
	PCFShadowMap,
	PerspectiveCamera,
	Vector3,
	WebGLRenderTarget,
} from "three";

// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

export interface PortalAssets {
	mesh: THREE.Mesh;
	meshWebGLTexture: THREE.WebGLRenderTarget;
	meshCamera: THREE.PerspectiveCamera;
}

export interface PortalMeshCorners {
	bottomLeft: Vector3;
	bottomRight: Vector3;
	topLeft: Vector3;
	topRight: Vector3;
}

/** Renderer */
export default class Renderer extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appRenderer = this._experience.app.renderer;
	protected readonly _appRendererInstance =
		this._experience.app.renderer.instance;
	protected readonly _renderPortalAssets: {
		[callbackName: string]: {
			assets: PortalAssets;
			corners: PortalMeshCorners;
		};
	} = {};
	protected _currentRenderTarget = this._appRendererInstance.getRenderTarget();
	protected _currentXrEnabled = this._appRendererInstance.xr.enabled;
	protected _currentShadowAutoUpdate =
		this._appRendererInstance.shadowMap.autoUpdate;
	protected _portalBottomLeftCorner = new Vector3();
	protected _portalBottomRightCorner = new Vector3();
	protected _portalTopLeftCorner = new Vector3();
	protected _portalReflectedPosition = new Vector3();

	public construct() {
		// Configure renderer behaviors
		~(() => {
			this._appRendererInstance.outputColorSpace = LinearSRGBColorSpace;
			this._appRendererInstance.toneMapping = NoToneMapping;
			this._appRendererInstance.toneMappingExposure = 1;
			this._appRendererInstance.shadowMap.enabled = false;
			this._appRendererInstance.shadowMap.type = PCFShadowMap;
			this._appRendererInstance.setClearColor("#211d20");
			this._appRendererInstance.setSize(
				this._experience.app.sizes.width,
				this._experience.app.sizes.height
			);
			this._appRendererInstance.setPixelRatio(
				this._experience.app.sizes.pixelRatio
			);
			this._appRendererInstance.localClippingEnabled = true;
		})();

		~(() => {
			this._appRenderer.beforeRenderUpdate = () => {
				if (!Object.keys(this._renderPortalAssets).length) return;

				Object.keys(this._renderPortalAssets).forEach((key: string) => {
					if (this._renderPortalAssets[key]) {
						this._currentRenderTarget =
							this._appRendererInstance.getRenderTarget();
						this._currentXrEnabled = this._appRendererInstance.xr.enabled;
						this._currentShadowAutoUpdate =
							this._appRendererInstance.shadowMap.autoUpdate;
						this._appRendererInstance.xr.enabled = false;
						this._appRendererInstance.shadowMap.autoUpdate = false;
						this.renderPortal(
							this._renderPortalAssets[key].assets.mesh,
							this._renderPortalAssets[key].assets.meshWebGLTexture,
							this._renderPortalAssets[key].assets.meshCamera,
							this._renderPortalAssets[key].corners
						);
						// restore the original rendering properties
						this._appRendererInstance.xr.enabled = this._currentXrEnabled;
						this._appRendererInstance.shadowMap.autoUpdate =
							this._currentShadowAutoUpdate;
						this._appRendererInstance.setRenderTarget(
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
		mesh: Mesh,
		meshWebGLTexture: WebGLRenderTarget,
		portalCamera: PerspectiveCamera,
		corners: PortalMeshCorners
	) {
		mesh.localToWorld(
			this._portalBottomLeftCorner.set(
				corners.bottomLeft.x,
				corners.bottomLeft.y,
				corners.bottomLeft.z
			)
		);
		mesh.localToWorld(
			this._portalBottomRightCorner.set(
				corners.bottomRight.x,
				corners.bottomRight.y,
				corners.bottomRight.z
			)
		);
		mesh.localToWorld(
			this._portalTopLeftCorner.set(
				corners.topLeft.x,
				corners.topLeft.y,
				corners.topLeft.z
			)
		);

		this._appRendererInstance.setRenderTarget(meshWebGLTexture);
		this._appRendererInstance.state.buffers.depth.setMask(true);
		if (this._appRendererInstance.autoClear === false)
			this._appRendererInstance.clear();
		mesh.visible = false;
		this._appRendererInstance.render(this._experience.app.scene, portalCamera);
		mesh.visible = true;
	}

	public addPortalAssets(portalName: string, assets: PortalAssets): void {
		// Calculate width, height
		const boundingBox = new Box3().setFromObject(assets.mesh);
		const width = boundingBox.max.x - boundingBox.min.x;
		const height = boundingBox.max.y - boundingBox.min.y;
		const halfWidth = width / 2;
		const halfHeight = height / 2;

		// Define the corners of the plane in local coordinates
		const corners = [
			new Vector3(-halfWidth, -halfHeight, 0),
			new Vector3(halfWidth, -halfHeight, 0),
			new Vector3(-halfWidth, halfHeight, 0),
			new Vector3(halfWidth, halfHeight, 0),
		];

		// Apply the mesh's position and rotation to the corners
		const matrix = new Matrix4();
		matrix.makeRotationFromQuaternion(assets.mesh.quaternion);
		matrix.setPosition(assets.mesh.position);
		matrix.compose(
			assets.mesh.position,
			assets.mesh.quaternion,
			assets.mesh.scale
		);
		corners.map((corner) => corner.applyMatrix4(matrix));

		this._renderPortalAssets[portalName] = {
			assets,
			corners: {
				bottomLeft: corners[0],
				bottomRight: corners[1],
				topLeft: corners[2],
				topRight: corners[3],
			},
		};
	}

	public removePortalAssets(portalName: string): void {
		if (this._renderPortalAssets[portalName])
			delete this._renderPortalAssets[portalName];
	}
}
