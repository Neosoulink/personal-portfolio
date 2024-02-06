export class ErrorFactory {
	constructor(_: any) {
		throw createError({
			statusCode: 444,
			statusMessage: "No response",
			message: _.message ?? "🚧 Something went wrong",
			fatal: true,
		});
	}
}
