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
	<button id="hamburger-menu-button" class="space-y-2" :onclick="props.onclick">
		<div
			v-for="i in [0, 1, 2]"
			:key="i"
			:class="`transition w-[35px] h-0.5 ${
				i === 0 && props.active
					? 'translate-y-[10.25px] rotate-45'
					: i === 2 && props.active
					? '-translate-y-[10.25px] -rotate-45'
					: props.active
					? 'opacity-0'
					: ''
			}`"
		>
			<div class="bg-light h-full w-full" />
		</div>
	</button>
</template>

<style lang="css">
#hamburger-menu-button:hover > .transition > div {
	animation: start-animation 0.5s;
}
#hamburger-menu-button > .transition:nth-child(2) > div {
	animation-delay: 0.05s;
}
#hamburger-menu-button > .transition:nth-child(3) > div {
	animation-delay: 0.1s;
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
