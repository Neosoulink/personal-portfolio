<script setup lang="ts">
const props = defineProps({
	error: Object,
});
</script>

<template>
	<div
		class="flex flex-col items-center justify-center text-center bg-dark text-light h-dvh w-dvw"
	>
		<h1 class="mb-1 font-medium opacity-50 text-7xl">
			{{ props.error?.statusCode ?? "444" }}
		</h1>
		<h2 class="mb-5 text-xl opacity-50">
			{{ props.error?.statusMessage ?? "Something went wrong" }}
		</h2>
		<a class="font-medium capitalize" href="/">&lt;- Return to home</a>
	</div>
</template>
