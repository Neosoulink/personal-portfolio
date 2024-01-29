<template>
	<footer
		class="z-20 flex flex-row items-center justify-between p-4 bg-black text-light backdrop-blur-sm bg-opacity-20 sm:backdrop-blur-none sm:bg-transparent sm:p-0 text-[3.5vw] xs:text-[12px] sm:text-sm"
	>
		<div class="flex flex-col items-start opacity-70">
			<span>Nathan Mande @ 2024</span>
		</div>

		<home-camera-path-slider />

		<div type="button" class="flex flex-row space-x-2">
			<button
				v-for="i in Array(4).keys()"
				:key="i"
				class="w-6 h-6 border rounded-md"
			/>
		</div>
	</footer>
</template>
