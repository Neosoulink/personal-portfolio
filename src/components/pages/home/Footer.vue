<template>
	<footer class="z-20 flex flex-row items-center justify-between text-light">
		<div class="flex flex-col items-start text-sm opacity-70">
			<span>Nathan Mande @ 2024</span>
		</div>

		<div type="button" class="flex flex-row space-x-2">
			<button
				v-for="i in Array(4).keys()"
				:key="i"
				class="w-6 h-6 border rounded-md"
			/>
		</div>
	</footer>
</template>
