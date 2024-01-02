import { UnknownError } from "./unknown.error";

export class ErrorFactory {
	constructor(_: any) {
		if (_ instanceof Error) throw new UnknownError(_);

		throw new Error("🚧 Something went wrong", _);
	}
}
