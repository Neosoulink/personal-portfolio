<script setup lang="ts">
import { DeviceConfig } from "~/config/device.config";

const isFreeCamera = useState<boolean>("isFreeCamera");
const isFocusMode = useState<boolean>("isFocusMode");
</script>

<template>
	<footer
		:class="`z-20 flex flex-row items-center justify-center p-4 text-light   bg-opacity-20 sm:backdrop-blur-none sm:bg-transparent sm:p-0 text-[3.5vw] xs:text-[12px] xs:justify-between transition-opacity flex-wrap ${
			isFreeCamera ? '' : 'bg-black backdrop-blur-sm'
		}`"
	>
		<span
			class="order-last w-full mt-3 text-center sm:order-first opacity-70 sm:w-auto sm:mt-0 sm:text-start"
		>
			Nathan Mande @ 2024
		</span>

		<div
			:class="`w-full text-center xs:w-1/2 sm:w-3/12 lg:w-60 transition-opacity  ${
				isFreeCamera ? 'pointer-events-none opacity-30' : ''
			}`"
		>
			<home-camera-path-slider />
			<span class="block text-[10px] opacity-70"
				>Drag with slider
				<span v-if="DeviceConfig.DEVICE === 'pc'">or use the wheel</span></span
			>
		</div>

		<div
			type="button"
			class="z-20 flex flex-row items-center justify-center mt-3 space-x-2 sm:space-x-4 xs:mt-0 !pointer-events-auto"
		>
			<home-sound-toggle-button
				class="transition-opacity w-7 h-7 opacity-70 hover:opacity-100"
			/>

			<home-markers-toggle-button
				:class="`w-6 h-6 transition-opacity opacity-70 hover:opacity-100 ${
					isFocusMode ? 'pointer-events-none !opacity-40' : ''
				}`"
			/>

			<home-free-camera-button
				class="w-[22px] transition-opacity h-6 opacity-70 hover:opacity-100"
			/>
		</div>
	</footer>
</template>
