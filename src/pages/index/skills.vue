<script setup lang="ts">
import { pages } from "~/static";

const canDisplayLanding = useState<boolean>(
	`canDisplayLanding_${pages.SKILL_PAGE}`,
	() => true
);

definePageMeta({
	key: pages.SKILL_PAGE,
});
</script>

<template>
	<div>
		<Title>Nathan Mande - Skills</Title>
		<LazyHomeContent
			:can-display-landing="canDisplayLanding"
			:landing-head="$t('skillsLandingHead')"
			:landing-foot="`${$t('skills')}?`"
			:content-title="`${$t('about')} ${$t('skills')}`"
			:content-body="$t('skillsContent')"
			@landing-animation-done="() => (canDisplayLanding = false)"
		/>
	</div>
</template>
