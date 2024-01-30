<script setup lang="ts">
import { DeviceConfig } from "~/config/device.config";
</script>

<template>
	<footer
		class="z-20 flex flex-row items-center justify-center p-4 bg-black text-light backdrop-blur-sm bg-opacity-20 sm:backdrop-blur-none sm:bg-transparent sm:p-0 text-[3.5vw] xs:text-[12px] xs:justify-between flex-wrap"
	>
		<span
			class="order-last w-full mt-3 text-center sm:order-first opacity-70 sm:w-auto sm:mt-0 sm:text-start"
		>
			Nathan Mande @ 2024
		</span>

		<div class="w-full text-center xs:w-1/2 sm:w-3/12 lg:w-60">
			<home-camera-path-slider />
			<span class="block text-[10px] opacity-70"
				>Drag with slider
				<span v-if="DeviceConfig.DEVICE === 'pc'">or use the wheel</span></span
			>
		</div>

		<div type="button" class="flex flex-row mt-3 space-x-2 xs:mt-0">
			<button
				v-for="i in Array(4).keys()"
				:key="i"
				class="w-6 h-6 border rounded-md"
			/>
		</div>
	</footer>
</template>
