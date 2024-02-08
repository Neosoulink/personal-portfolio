import { Octokit } from "octokit";

export default defineEventHandler(async (event) => {
	try {
		const gitUsername = event.context.gitUsername as string | undefined;
		const gitRepo = event.context.gitRepo as string | undefined;
		const octokit = event.context.octokit as Octokit | undefined;
		const result: {
			title: string;
			url: string | null;
			content?: string | null;
			created_at?: string | null;
			updated_at?: string | null;
		}[] = [];

		if (
			typeof gitUsername !== "string" ||
			typeof gitRepo !== "string" ||
			!octokit
		)
			throw new Error("Insufficient user configuration details.", {
				cause: { code: 401 },
			});

		const octokitAvailableResources = (
			await octokit.rest.repos.getContent({
				path: "writing",
				owner: gitUsername,
				repo: gitRepo,
			})
		).data;
		const availableResources: typeof octokitAvailableResources =
			octokitAvailableResources as [];

		if (typeof availableResources !== "object" || !availableResources.length) {
			setResponseStatus(event, 404);
			return {
				statusCode: 404,
				statusMessage: "Projects not available",
				data: [],
			};
		}

		for (const resource of availableResources) {
			if (/md$/gi.test(resource.name)) {
				const mdContent = (
					await octokit.rest.repos.getContent({
						path: `writing/${resource.name}`,
						owner: gitUsername,
						repo: gitRepo,
					})
				).data;
				const safeMdContent: (typeof availableResources)[0] = mdContent as any;

				if (safeMdContent?.content !== undefined) {
					const parsedContent = Buffer.from(safeMdContent.content, "base64")
						.toString("utf-8")
						.replace(/((\r\n|\r|\n)---(\r\n|\r|\n|.)*)/gi, "\n---");
					const resourceName = resource.name.replace(".md", "");

					result.push({
						title: resourceName,
						url: resource.html_url,
						content: parsedContent,
					});
				}
			}
		}
		setResponseStatus(event, 200);
		return {
			statusCode: 200,
			statusMessage: "Resources loaded",
			data: result,
		};
	} catch (error: any) {
		console.error("Error fetching repository files:", error?.message);
		setResponseStatus(event, error?.cause?.code ?? 404);
		return {
			statusCode: error?.cause?.code ?? 404,
			statusMessage: error?.message ?? "Resources not available",
			data: [],
		};
	}
});
