<template>
	<footer class="text-light w-screen md:mb-[50px] mb-6 z-40">
		<Container class="flex flex-row justify-between items-end">
			<div class="flex flex-col items-start">
				<span>Leave 🌟 a star on the GitHub repo</span>
				<a
					href="/"
					class="text-[rgba(var(--light),0.5)] hover:text-light transition underline"
					>Neosoulink/mydevjourney</a
				>
			</div>

			<div class="flex flex-col text-right items-end">
				<span>Feel free to checkout my</span>
				<span class="mb-4">social networks</span>

				<div class="flex flex-row space-x-2">
					<div
						v-for="i in Array(4).keys()"
						:key="i"
						class="h-9 w-9 border rounded-full"
					/>
				</div>
			</div>
		</Container>
	</footer>
</template>
