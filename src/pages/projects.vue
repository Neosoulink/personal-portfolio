<script setup lang="ts">
const layoutState = useContentLayout();
const dataPending = ref<boolean>(true);
const projectsList = ref<
	{
		title: string;
		url: string;
		stars?: number | undefined;
		views?: number | undefined;
		description?: string | null | undefined;
		created_at?: string | null | undefined;
		updated_at?: string | null | undefined;
	}[]
>([]);

definePageMeta({
	layout: "content",
});

onMounted(async () => {
	layoutState.value.displayLeftSide = true;
	layoutState.value.subTitle =
		"I often to share open source, you can start them to support my work!";
	dataPending.value = true;

	const { data } = await $fetch("/api/projects");

	if (!data.length) return;

	projectsList.value = data;
	dataPending.value = false;
});
</script>

<template>
	<div
		v-if="dataPending || !projectsList.length"
		class="flex items-center justify-center mt-20"
	>
		{{ dataPending ? "Loading projects..." : "No project found" }}
	</div>

	<div v-if="!dataPending">
		<LazyContentCard
			v-for="(item, id) in projectsList"
			:key="id"
			:title="item.title"
			:url="item.url"
			:description="item.description"
		>
			<template #footer>
				<span
					class="flex flex-row items-center justify-end w-full space-x-2 text-xs text-right opacity-80"
				>
					<span>
						<svg
							class="inline-block h-3 mb-1 mr-2 fill-none"
							viewBox="0 0 644 616"
						>
							<path
								d="M296.833 59.1331C304.55 36.9357 308.407 25.8374 314.113 22.7614C319.05 20.0991 324.993 20.0991 329.933 22.7614C335.637 25.8374 339.493 36.9357 347.21 59.1331L398.22 205.879C400.417 212.197 401.513 215.356 403.493 217.708C405.24 219.786 407.47 221.406 409.987 222.426C412.833 223.581 416.177 223.649 422.863 223.785L578.19 226.95C601.687 227.429 613.433 227.669 618.123 232.144C622.18 236.017 624.017 241.671 623.01 247.189C621.85 253.566 612.487 260.663 593.76 274.863L469.957 368.72C464.627 372.763 461.963 374.783 460.337 377.39C458.9 379.696 458.05 382.316 457.857 385.023C457.64 388.09 458.607 391.29 460.543 397.693L505.533 546.396C512.337 568.89 515.74 580.136 512.933 585.976C510.503 591.033 505.693 594.526 500.133 595.276C493.71 596.14 484.067 589.43 464.777 576.006L337.253 487.27C331.763 483.45 329.02 481.54 326.037 480.796C323.4 480.143 320.643 480.143 318.01 480.796C315.027 481.54 312.28 483.45 306.79 487.27L179.268 576.006C159.979 589.43 150.334 596.14 143.911 595.276C138.352 594.526 133.542 591.033 131.112 585.976C128.305 580.136 131.708 568.89 138.513 546.396L183.501 397.693C185.438 391.29 186.406 388.09 186.188 385.023C185.995 382.316 185.144 379.696 183.708 377.39C182.082 374.783 179.417 372.763 174.087 368.72L50.286 274.863C31.5593 260.663 22.196 253.566 21.0337 247.189C20.0273 241.671 21.8647 236.017 25.9223 232.144C30.6103 227.669 42.358 227.429 65.853 226.95L221.18 223.785C227.867 223.649 231.21 223.581 234.059 222.426C236.575 221.406 238.805 219.786 240.552 217.708C242.531 215.356 243.629 212.197 245.825 205.879L296.833 59.1331Z"
								stroke="#F4F7F5"
								stroke-width="40"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>

						<span class="text-primary">{{ item.stars ?? "Unknown" }}</span>
					</span>

					<span>
						<svg
							class="inline-block h-[10px] mb-1 mr-2 fill-none"
							viewBox="0 0 776 506"
						>
							<path
								d="M504 253C504 308.23 452.067 353 387.999 353C323.936 353 272 308.23 272 253C272 197.77 323.936 153 387.999 153C452.067 153 504 197.77 504 253Z"
								stroke="#F4F7F5"
								stroke-width="43"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M388 20C215.317 20 69.1432 117.956 20 253C69.1425 388.043 215.317 486 388 486C560.681 486 706.856 388.043 756 253C706.856 117.957 560.681 20 388 20Z"
								stroke="#F4F7F5"
								stroke-width="40"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>

						<span class="text-primary">{{ item.views ?? "Unknown" }}</span>
					</span>
				</span>
			</template>
		</LazyContentCard>
	</div>
</template>
