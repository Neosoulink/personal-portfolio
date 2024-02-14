<script setup lang="ts">
const correctLinks = () => {
	document.querySelectorAll("a").forEach((link) => {
		if (link.href.includes(window.location.host)) return;

		link.addEventListener(
			"click",
			(e) => {
				e.preventDefault();

				console.log(link.href);

				window.parent.dispatchEvent(
					new CustomEvent<IframeLinkClickEventDetails>("iframelinkclick", {
						detail: { link: link.href },
					})
				);
			},
			{ passive: false }
		);
	});
};
const _onMounted = () => {
	if (!process.client || !window || window.self === window.top) return;

	setTimeout(correctLinks, 200);
};

definePageMeta({
	layout: "content-lite",
});

onMounted(_onMounted);
</script>

<template>
	<ContentDoc>
		<template #not-found>
			<G-Not-Found />
		</template>
	</ContentDoc>
</template>
