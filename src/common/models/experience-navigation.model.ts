import type { Spherical, Vector3 } from "three";

export interface NavigationView {
	/** Enable navigation update and controls interactions. */
	enabled: boolean;
	/** Enable controls interactions. */
	controls: boolean;
	/** Enable navigation limits. */
	limits: boolean;
	/** Define the center of the scene. used to correctly set the limits. */
	center: Vector3;
	/** Spherical space for navigation */
	spherical: {
		smoothed: Spherical;
		smoothing: number;
		limits: {
			radius: { min: number; max: number };
			phi: { min: number; max: number };
			theta: { min: number; max: number };
			enabled: boolean;
			enabledPhi: boolean;
			enabledTheta: boolean;
		};
		value: Spherical;
	};
	/** Camera target */
	target: {
		value: Vector3;
		smoothed: Vector3;
		smoothing: number;
		limits: {
			x: { min: number; max: number };
			y: { min: number; max: number };
			z: { min: number; max: number };
			enabled: boolean;
		};
	};
	drag: {
		delta: { x: number; y: number };
		previous: { x: number; y: number };
		sensitivity: number;
		alternative: boolean;
	};
	zoom: { sensitivity: number; delta: number };
	down?: (x: number, y: number) => unknown;
	move?: (x: number, y: number) => unknown;
	up?: () => unknown;
	zooming?: (delta: number) => unknown;
	onMouseDown?: (event: MouseEvent) => unknown;
	onMouseUp?: (this: HTMLElement, ev: MouseEvent) => unknown;
	onMouseMove?: (this: HTMLElement, ev: MouseEvent) => unknown;
	onTouchStart?: (event: TouchEvent) => unknown;
	onTouchEnd?: (event: TouchEvent) => unknown;
	onTouchMove?: (event: TouchEvent) => unknown;
	onWheel?: (event: Event) => unknown;
	onLeave?: (event: Event) => unknown;
}

export interface ViewLimits {
	spherical: Exclude<NavigationView["spherical"], undefined>["limits"];
	target: Exclude<NavigationView["target"], undefined>["limits"];
}
