<script lang="ts" setup>
import gsap from "gsap";

// DATA
const links = [
	{
		label: "Blog",
		icon: "",
		path: "/blog",
	},
	{
		label: "Credits",
		icon: "",
		path: "/credits",
	},
];

// STATES
const isMenuOpen = useMenu();

watch(isMenuOpen, async (newState) => {
	if (newState) {
		setTimeout(() => {
			document
				.querySelector("#menu>ul")
				?.childNodes.forEach((element, index) => {
					if (element instanceof HTMLLIElement) {
						gsap.fromTo(
							element,
							{ transform: "scale(0)" },
							{
								transform: "scale(1)",
								ease: "ease-out",
								delay: index * 0.1,
								duration: 0.2,
							}
						);
					}
				});
		}, 10);
	}
});
</script>

<template>
	<transition
		enter-active-class="duration-300 ease-out"
		enter-from-class="transform opacity-0"
		enter-to-class="opacity-100"
		leave-active-class="duration-200 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="transform opacity-0"
	>
		<div
			id="menu"
			v-show="isMenuOpen"
			class="fixed top-0 left-0 transform h-screen w-screen flex justify-center items-center bg-[rgba(var(--dark),0.3)] text-light backdrop-blur transition-all z-30"
			@click="
				(e) => {
					e.stopPropagation();
					isMenuOpen = false;
				}
			"
		>
			<ul id="menu-links-container" class="text-center">
				<li v-for="(link, index) in links" :key="index" class="mb-5">
					<nuxt-link
						:to="link.path"
						class="text-3xl transition opacity-70 hover:opacity-100"
						@click="() => (isMenuOpen = false)"
					>
						{{ link.label }}
					</nuxt-link>
				</li>
			</ul>
		</div>
	</transition>
</template>
~/composables/useMenu
