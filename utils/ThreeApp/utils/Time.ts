import EventEmitter from "events";

export default class Time extends EventEmitter {
	start: number;
	current: any;
	elapsed: number;
	delta: number;

	constructor() {
		super();

		this.start = Date.now();
		this.current = this.start;
		this.elapsed = 0;
		this.delta = 16;

		window.requestAnimationFrame(() => this.tick());
	}

	tick() {
		const currentTime = Date.now();
		this.delta = currentTime - this.current;
		this.current = currentTime;
		this.elapsed = this.current - this.start;

		this.emit("tick", {
			delta: this.delta,
			current: this.current,
			elapsed: this.elapsed,
		});

		window.requestAnimationFrame(() => this.tick());
	}
}
