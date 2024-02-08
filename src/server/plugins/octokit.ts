import { Octokit } from "octokit";
import { name, version } from "~~/package.json";

// CONFIGS
import { ServerConfig } from "~/config/server";

export default defineNitroPlugin((nitroApp) => {
	const octokit = new Octokit({
		auth: ServerConfig.GITHUB_TOKEN,
		userAgent: `@${name}/${version}`,
		defaultScopes: ["repo", "gist"],
	});

	nitroApp.hooks.hook("request", (event) => {
		event.context.octokit = octokit;
		event.context.gitUsername = ServerConfig.GITHUB_USERNAME;
		event.context.gitRepo = ServerConfig.GITHUB_REPO_NAME;
	});
});
