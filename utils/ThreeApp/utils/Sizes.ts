import EventEmitter from "events";

export interface sceneSizesType {
	height: number;
	width: number;
}

export interface SizesProps {
	height?: number;
	width?: number;
	listenResize?: boolean;
}

export default class Sizes extends EventEmitter {
	width = window.innerWidth;
	height = window.innerHeight;
	listenResize: boolean;
	pixelRatio = Math.min(window.devicePixelRatio, 2);

	constructor({ height, width, listenResize = true }: SizesProps) {
		super();

		// SETUP
		this.height = Number(height ?? this.height);
		this.width = Number(width ?? this.width);
		this.listenResize = !!listenResize;

		if (this.listenResize) {
			window.addEventListener("resize", () => {
				this.height = window.innerHeight;
				this.width = window.innerWidth;
				this.pixelRatio = this.pixelRatio = Math.min(
					window.devicePixelRatio,
					2
				);

				this.emit("resize", { width: this.width, height: this.height });
			});
		}
	}
}
