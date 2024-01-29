<script lang="ts" setup>
import GSAP from "gsap";

const props = withDefaults(
	defineProps<{ active?: boolean; onclick?: () => unknown }>(),
	{ active: false }
);

onMounted(() => {
	if (process.client) {
		const BURGER_LINES = document.querySelectorAll(
			"#hamburger-menu-button > .transition > div"
		);

		BURGER_LINES.forEach((element, index) => {
			GSAP.fromTo(
				element,
				{ width: "0%" },
				{ width: "100%", delay: index * 0.19 }
			);
		});
	}
});
</script>

<template>
	<button
		class="space-y-2"
		type="button"
		@click="
			() => {
				props.onclick;
			}
		"
	>
		<div
			v-for="i in [0, 1, 2]"
			:key="i"
			:class="`transition-all w-[30px] h-0.5 ${
				i === 0 && props.active
					? 'translate-y-[10.25px] rotate-45'
					: i === 2 && props.active
					? '-translate-y-[10.25px] -rotate-45'
					: props.active
					? 'opacity-0'
					: ''
			}`"
		>
			<div class="w-full h-full bg-light" />
		</div>
	</button>
</template>

<style lang="scss" scoped>
button {
	&:hover > div {
		> div {
			animation: start-animation 0.5s;
		}

		@for $i from 1 through 2 {
			&:nth-child(#{$i + 1}) > div {
				animation-delay: #{$i * 0.05}s;
			}
		}
	}
}

@keyframes start-animation {
	from {
		width: 0;
	}

	to {
		width: 100%;
	}
}
</style>
