import HomeExperience from "../app/HomeExperience";

export default defineNuxtPlugin(() => {
	return {
		provide: {
			HomeExperience,
		},
	};
});
