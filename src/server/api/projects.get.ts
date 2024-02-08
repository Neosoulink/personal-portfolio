import { Octokit } from "octokit";

export default defineEventHandler(async (event) => {
	try {
		const gitUsername = event.context.gitUsername as string | undefined;
		const gitRepo = event.context.gitRepo as string | undefined;
		const octokit = event.context.octokit as Octokit | undefined;
		const reposSelection: { [name: string]: number } = {};
		const result: {
			title: string;
			url: string;
			stars?: number;
			views?: number;
			description?: string | null;
			created_at?: string | null;
			updated_at?: string | null;
		}[] = [];

		if (
			typeof gitUsername !== "string" ||
			typeof gitRepo !== "string" ||
			!octokit
		) {
			throw new Error("Insufficient user configuration details.", {
				cause: { code: 401 },
			});
		}

		const octokitRepoList = (
			await octokit.rest.repos.listForAuthenticatedUser({
				per_page: 10,
				page: 1,
				sort: "updated",
				visibility: "public",
			})
		).data;
		const octokitAvailableProjects = (
			await octokit.rest.repos.getContent({
				path: "projects",
				owner: gitUsername,
				repo: gitRepo,
			})
		).data;
		const availableProjects: typeof octokitAvailableProjects =
			octokitAvailableProjects as [];

		if (typeof availableProjects !== "object" || !availableProjects.length) {
			setResponseStatus(event, 404);
			return {
				statusCode: 404,
				statusMessage: "Projects not available",
				data: [],
			};
		}

		for (const project of availableProjects) {
			if (/md$/gi.test(project.name)) {
				const projectName = project.name.replace(".md", "");
				result.push({
					title: projectName,
					stars: 0,
					views: 0,
					url: project.html_url ?? "",
				});

				reposSelection[projectName] = result.length - 1;
			}
		}

		for (const repo of octokitRepoList) {
			if (typeof reposSelection[repo.name] === "number") {
				result[reposSelection[repo.name]] = {
					...result[reposSelection[repo.name]],
					stars: repo.stargazers_count,
					views: repo.watchers,
					description: repo.description,
					url: repo.html_url ?? result[reposSelection[repo.name]].url,
					created_at: repo.created_at,
					updated_at: repo.updated_at,
				};
			}
		}

		setResponseStatus(event, 200);
		return {
			statusCode: 200,
			statusMessage: "Project loaded successfully",
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
