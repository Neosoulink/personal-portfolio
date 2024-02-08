export class ServerConfig {
	static readonly GITHUB_TOKEN = (() => {
		try {
			return useRuntimeConfig().GITHUB_TOKEN;
		} catch (error) {
			return undefined;
		}
	})();

	static readonly GITHUB_USERNAME = (() => {
		try {
			return useRuntimeConfig().GITHUB_USERNAME;
		} catch (error) {
			return undefined;
		}
	})();

	static readonly GITHUB_REPO_NAME = (() => {
		try {
			return useRuntimeConfig().GITHUB_REPO_NAME;
		} catch (error) {
			return undefined;
		}
	})();
}
