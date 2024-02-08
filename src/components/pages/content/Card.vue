<script setup lang="ts">
defineProps<{ title: string; description?: string | null; url: string }>();
</script>

<template>
	<a
		:href="url"
		target="_blank"
		class="w-full !no-underline pt-5 px-2 sm:px-5 pb-3 transition-[background] bg-opacity-0 bg-white hover:bg-opacity-10 flex flex-col border-b border-b-[#ffffff55]"
	>
		<h2 class="mt-0 mb-1">{{ title }}</h2>

		<span class="mb-2 leading-normal tracking-normal opacity-80">{{
			description
		}}</span>

		<slot name="footer" />
	</a>
</template>
