<template>
	<!-- 404 Subpage -->
	<section data-id="404" class="animated-section position-relative">
		<div class="section-content vcentered">

			<img src="@/assets/img/undraw_Taken_if77.svg" class="img-404" alt="">
			<div class="title-block">
				<h3>404 - Page not found</h3>
				<router-link :to="{ name: 'Home' }">
					<font-awesome-icon :icon="['fas', 'home']" />
					Go home
				</router-link>
			</div>
			<!-- /.title-block -->
		</div>
		<!-- /.section-content -->
	</section>
	<!-- End of 404 Subpage -->
</template>

<script>
export default {
	name: "notFound",
	mounted() {
		document.title = '@MNath_ | Not found'
	},
};
</script>
