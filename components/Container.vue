<template>
	<div class="container mx-auto md:px-20 px-2" :class="className" :style="style">
		<slot />
	</div>
</template>

<script lang="ts">
export default {
	props: {
		style: Object,
		className: String,
	},
};
</script>
q
