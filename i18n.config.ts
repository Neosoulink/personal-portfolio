import en from "~/assets/I18n/en.json";
import fr from "~/assets/I18n/fr.json";

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "en",
	messages: {
		en: en,
		fr: fr,
	},
}));
