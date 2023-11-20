import HomeExperience from "../experiences/Home";

export default defineNuxtPlugin(() => {
	return {
		provide: {
			HomeExperience,
		},
	};
});
