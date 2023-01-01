<template>
	<section data-id="home" class="animated-section start-page">
		<div class="section-content vcentered">
			<div class="title-block">
				<h2>Nathan Mande</h2>
				<div class="owl-carousel text-rotation">
					<div class="item">
						<div ref="typewrite" class="sp-subtitle typewrite" data-period="2000"
							data-type='[ "Hi, I`m Nathan", "A passionate fullstack software engineer", "I`m a curious guy", "I like to travel and discover", "I also like to learn new technologies"]'>
							<span class="wrap"></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import typeWriter from "../assets/js/typeWriterEffect.js";

export default {
	name: "Home",
	mounted() {
		typeWriter(this.$refs.typewrite);
		document.title = '@MNath_ | Home'
	},
};
</script>
