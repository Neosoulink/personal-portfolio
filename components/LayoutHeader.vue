<template>
	<nav class="flex flex-row justify-between items-center bg-dark text-white fixed top-0 w-screen py-7 pr-5 z-40">
		<div class="pl-28 flex flex-row items-center text-2xl font-extrabold">
			<div class="h-12 w-12 rounded-full bg-primary-900 mr-5" /> Nathan Mande
		</div>

		<ul class="flex flex-row list-none pr-28">
			<li v-for="(item, index) in ['About', 'Contact', 'Projects', 'Blog']" :key="index" class="mr-4"><a
					class="cursor-pointer text-2xl font-semibold opacity-60 hover:opacity-100">{{ item }}</a>
			</li>
		</ul>
	</nav>
</template>
