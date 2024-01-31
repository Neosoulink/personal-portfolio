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
import { HtmlMixerContext } from "threex.htmlmixer-continued/lib/html-mixer";

// EXPERIENCE
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { events } from "~/static";

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

/**
 * [`quick-threejs#Renderer`](https://www.npmjs.com/package/quick-threejs)
 * Subset module. In charge of managing renderer states.
 */
export class Renderer extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appRenderer = this._experience.app.renderer;
	private readonly _ui = this._experience.ui;
	private readonly _camera = this._experience.camera;
	private readonly _appSizes = this._experience.app.sizes;
	private readonly _renderPortalAssets: {
		[callbackName: string]: {
			assets: PortalAssets;
			corners: PortalMeshCorners;
		};
	} = {};
	private readonly beforeRenderUpdateCallbacks: {
		[key: string]: () => unknown;
	} = {};

	private _currentRenderTarget = this._appRenderer.instance.getRenderTarget();
	private _currentXrEnabled = this._appRenderer.instance.xr.enabled;
	private _currentShadowAutoUpdate =
		this._appRenderer.instance.shadowMap.autoUpdate;
	private _portalBottomLeftCorner = new Vector3();
	private _portalBottomRightCorner = new Vector3();
	private _portalTopLeftCorner = new Vector3();
	private _onResize?: () => unknown;

	public _mixerContext?: HtmlMixerContext;

	private _renderPortal(
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

		this._appRenderer.instance.setRenderTarget(meshWebGLTexture);
		this._appRenderer.instance.state.buffers.depth.setMask(true);
		if (this._appRenderer.instance.autoClear === false)
			this._appRenderer.instance.clear();
		mesh.visible = false;
		this._appRenderer.instance.render(this._experience.app.scene, portalCamera);
		mesh.visible = true;
	}

	public enableCssRender = false;

	public get mixerContext() {
		return this._mixerContext;
	}

	public construct() {
		// RENDERER
		this._appRenderer.instance.outputColorSpace = LinearSRGBColorSpace;
		this._appRenderer.instance.toneMapping = NoToneMapping;
		this._appRenderer.instance.toneMappingExposure = 1;
		this._appRenderer.instance.shadowMap.enabled = false;
		this._appRenderer.instance.shadowMap.type = PCFShadowMap;
		this._appRenderer.instance.setClearColor("#5f5f5f", 1);
		this._appRenderer.instance.setSize(
			this._experience.app.sizes.width,
			this._experience.app.sizes.height
		);
		this._appRenderer.instance.setPixelRatio(
			this._experience.app.sizes.pixelRatio
		);
		this._appRenderer.instance.localClippingEnabled = true;

		// CSS RENDERER
		if (!this._camera?.instance) return;

		this._mixerContext = new HtmlMixerContext(
			this._appRenderer.instance,
			this._camera?.instance
		);

		const rendererCss = this._mixerContext.rendererCss;
		rendererCss.setSize(this._appSizes.width, this._appSizes.height);
		if (this._ui) this._ui.cssTargetElement = rendererCss.domElement;

		this._onResize = () =>
			rendererCss.setSize(this._appSizes.width, this._appSizes.height);
		this._appSizes.on("resize", this._onResize);
		this.addBeforeRenderUpdateCallBack(
			"_mixerContext",
			() => this.enableCssRender && this._mixerContext?.update()
		);

		// PORTAL RENDERER
		this.addBeforeRenderUpdateCallBack(Renderer.name, () => {
			if (!Object.keys(this._renderPortalAssets).length) return;

			const keys = Object.keys(this._renderPortalAssets);
			for (let i = 0; i < keys.length; i++) {
				if (this._renderPortalAssets[keys[i]]) {
					this._currentRenderTarget =
						this._appRenderer.instance.getRenderTarget();
					this._currentXrEnabled = this._appRenderer.instance.xr.enabled;
					this._currentShadowAutoUpdate =
						this._appRenderer.instance.shadowMap.autoUpdate;
					this._appRenderer.instance.xr.enabled = false;
					this._appRenderer.instance.shadowMap.autoUpdate = false;
					this._renderPortal(
						this._renderPortalAssets[keys[i]].assets.mesh,
						this._renderPortalAssets[keys[i]].assets.meshWebGLTexture,
						this._renderPortalAssets[keys[i]].assets.meshCamera,
						this._renderPortalAssets[keys[i]].corners
					);
					this._appRenderer.instance.xr.enabled = this._currentXrEnabled;
					this._appRenderer.instance.shadowMap.autoUpdate =
						this._currentShadowAutoUpdate;
					this._appRenderer.instance.setRenderTarget(this._currentRenderTarget);
				}
			}
		});

		this._appRenderer.beforeRenderUpdate = () => {
			const keys = Object.keys(this.beforeRenderUpdateCallbacks);

			for (let i = 0; i < keys.length; i++) {
				this.beforeRenderUpdateCallbacks[keys[i]]?.();
			}
		};

		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		this._appRenderer.beforeRenderUpdate = undefined;
		this._appRenderer.afterRenderUpdate = undefined;

		const _KEYS_BEFORE_UPDATE = Object.keys(this.beforeRenderUpdateCallbacks);
		const _KEYS_PORTAL_ASSETS = Object.keys(this._renderPortalAssets);

		for (let i = 0; i < _KEYS_BEFORE_UPDATE.length; i++)
			this.removeBeforeRenderUpdateCallBack(_KEYS_BEFORE_UPDATE[i]);

		for (let i = 0; i < _KEYS_PORTAL_ASSETS.length; i++)
			this.removePortalAssets(_KEYS_PORTAL_ASSETS[i]);

		this._onResize && this._appSizes.off("resize", this._onResize);
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
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

		this.emit(events.PORTAL_ADDED, portalName);
	}

	public removePortalAssets(portalName: string): void {
		if (!Object.keys(this._renderPortalAssets).length) return;
		if (this._renderPortalAssets[portalName])
			delete this._renderPortalAssets[portalName];
		if (!Object.keys(this._renderPortalAssets).length)
			this.emit(events.ALL_PORTALS_REMOVED, portalName);

		this.emit(events.PORTAL_REMOVED, portalName);
	}

	public addBeforeRenderUpdateCallBack(key: string, callback: () => unknown) {
		this.beforeRenderUpdateCallbacks[key] = callback;

		this.emit(events.BEFORE_RENDERER_ADDED, key);
	}

	public removeBeforeRenderUpdateCallBack(key: string) {
		if (!Object.keys(this.beforeRenderUpdateCallbacks).length) return;
		if (this.beforeRenderUpdateCallbacks[key])
			delete this.beforeRenderUpdateCallbacks[key];
		if (!Object.keys(this.beforeRenderUpdateCallbacks).length)
			this.emit(events.ALL_BEFORE_RENDERER_REMOVED, key);

		this.emit(events.BEFORE_RENDERER_REMOVED, key);
	}

	public update(): void {
		if (!this._mixerContext) return;

		this._mixerContext.rendererCss.setSize(
			this._appSizes.width,
			this._appSizes.height
		);
		this._mixerContext.cssCamera.fov = this._camera?.instance.fov ?? 0;
		this._mixerContext.cssCamera.matrixWorldNeedsUpdate = true;
		this._mixerContext.cssCamera.updateProjectionMatrix();
	}
}
