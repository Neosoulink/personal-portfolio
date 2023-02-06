<template>
	<nav class="flex flex-row justify-between items-center bg-dark text-white w-screen py-5 px-28 absolute z-40">
		<div class="flex flex-row items-center text-2xl font-semibold">
			<div class="h-12 w-12 rounded-full bg-primary-900 mr-5" /> Nathan Mande
		</div>

		<ul class="flex flex-row list-none ">
			<li v-for="(item, index) in ['Projects', 'Blog']" :key="index" class="mr-4"><a
					class="cursor-pointer text-2xl font-medium opacity-60 hover:opacity-100">{{ item }}</a>
			</li>
		</ul>
	</nav>
</template>
