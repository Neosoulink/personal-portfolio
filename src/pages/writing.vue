<script setup lang="ts">
import markdownParser from "@nuxt/content/transformers/markdown";

const layoutState = useContentLayout();
const dataPending = ref<boolean>(true);

const parsedContents = ref<
	{
		title: string;
		description?: string | null;
		author?: string | null;
		createdAt?: string | null;
		updatedAt?: string | null;
		url: string;
	}[]
>([]);

definePageMeta({
	layout: "content",
});

onMounted(async () => {
	layoutState.value.displayLeftSide = true;
	parsedContents.value = [];
	layoutState.value.subTitle =
		"I share some cool tips and tricks, I 'll appreciate knowing one of them helped you :)";

	dataPending.value = true;
	const { data } = await $fetch("/api/writing");

	if (!data?.length) return;

	for (let i = 0; i < data.length; i++) {
		const item = data[i];

		await markdownParser
			?.parse?.("custom.md", item.content ?? "", {})
			.then((md: Record<string, any>) => {
				parsedContents.value.push({
					...md,
					createdAt: item.created_at,
					title: md.title ?? item.title,
					url: item.url ?? "/",
				});
			});
	}

	dataPending.value = false;
});
</script>

<template>
	<div
		v-if="dataPending || !parsedContents.length"
		class="flex items-center justify-center mt-20"
	>
		{{ dataPending ? "Loading resources..." : "No resource found" }}
	</div>

	<div v-if="!dataPending">
		<LazyContentCard
			v-if="!dataPending"
			v-for="(item, id) in parsedContents"
			:key="id"
			:title="item.title"
			:url="item.url"
			:description="item.description"
		>
			<template #footer>
				<span class="text-sm text-right opacity-80">
					Author(s):
					<span class="text-primary">{{ item.author ?? "Unknown" }}</span>
				</span>
			</template>
		</LazyContentCard>
	</div>
</template>
