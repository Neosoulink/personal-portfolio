<template>
	<!-- Home Subpage -->
	<section data-id="home" class="animated-section start-page">
		<div class="section-content vcentered">
			<div class="title-block">
				<h2>Nathan Mandemvo</h2>
				<div class="owl-carousel text-rotation">
					<div class="item">
						<div
							ref="typewrite"
							class="sp-subtitle typewrite"
							data-period="2000"
							data-type='[ "Hi, I`m Nath.", "A Simple Fullstack developer.", "I Love to Develop." ]'
						>
							<span class="wrap"></span>
						</div>
					</div>
				</div>
				<!-- /.owl-carouse -->
			</div>
			<!-- /.title-block -->
		</div>
		<!-- /.section-content -->
	</section>
	<!-- End of Home Subpage -->
</template>

<script>
import typeWriter from "../assets/js/typeWriterEffect.js";

export default {
	name: "Home",
	mounted() {
		typeWriter(this.$refs.typewrite);
	},
};
</script>
