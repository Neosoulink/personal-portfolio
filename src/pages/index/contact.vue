<script setup lang="ts">
// STATIC
import { pages } from "~/static";

const canDisplayLanding = useState<boolean>(
	`canDisplayLanding_${pages.CONTACT_PAGE}`,
	() => true
);

definePageMeta({
	key: pages.CONTACT_PAGE,
});
</script>

<template>
	<LazyHomeContent
		:can-display-landing="canDisplayLanding"
		:landing-head="$t('contactLandingHead')"
		:landing-foot="$t('contactLandingFoot')"
		:content-title="$t('contactTitle')"
		:content-body="$t('contactContent')"
		@landing-animation-done="() => (canDisplayLanding = false)"
	/>
</template>
