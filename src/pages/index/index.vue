template
<script setup lang="ts">
// STATIC
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
	<HomeContent
		:can-display-landing="canDisplayLanding"
		landing-head="Welcome to"
		landing-foot="my spaceship"
		content-title="Hello humans."
		content-body="Home here we are. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, ullam. Quibusdam alias dolores a voluptatum eveniet quia veniam ad quos, qui quae. Eveniet enim quasi tenetur, sapiente sed dolor labore!"
		@landing-animation-done="() => (canDisplayLanding = false)"
	/>
</template>
