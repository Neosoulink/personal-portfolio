<script setup lang="ts">
import { pages } from "~/static";

const canDisplayLanding = useState<boolean>(
	`canDisplayLanding_${pages.HOME_PAGE}`,
	() => true
);

definePageMeta({
	key: pages.HOME_PAGE,
});
</script>

<template>
	<div>
		<Title>Nathan Mande - Home</Title>
		<LazyHomeContent
			:can-display-landing="canDisplayLanding"
			:landing-head="$t('homeLandingHead')"
			:landing-foot="$t('homeLandingFoot')"
			:content-title="$t('homeTitle')"
			:content-body="$t('homeContent')"
			@landing-animation-done="() => (canDisplayLanding = false)"
		/>
	</div>
</template>
