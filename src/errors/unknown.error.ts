export class UnknownError extends Error {
	constructor(_: Error) {
		super();

		console.warn("🚧 Unknown error caught ==>", _.name, _.cause, _.message);
	}
}
