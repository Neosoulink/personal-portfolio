<template>
	<!-- 404 Subpage -->
	<section id="portfolio" class="portfolio animated-section">
		<!--<div class="page-title">
			<h2>Portfolio</h2>
		</div>-->

			<div class="parallax-parent">
				<div class="parallax-background">
					<h1>I LOVE TO PROGRAMMING</h1>
				</div>
				<section class="parallax-child-container">
					<div class="parallax-child">
						<div id="make-3D-space">
							<div id="product-card" ref="productCard">
								<div id="product-front">
									<div class="shadow"></div>
									<img
										src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
										alt=""
									/>
									<div class="image_overlay"></div>
									<div id="view_details" ref="viewDetails">View details</div>
									<div class="stats">
										<div class="stats-container">
											<!--<span class="product_price"></span>-->
											<span class="product_name">Some description</span>

										</div>
									</div>
								</div>
								<div id="product-back">
									<div class="shadow"></div>
									<div id="carousel">
									</div>
									<div id="flip-back">
										<div id="cy"></div>
										<div id="cx"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section class="parallax-child-container">
					<div class="parallax-child">
						<p>GET IN TOUCH</p>
					</div>
				</section>

				<section class="parallax-child-container">
					<div class="parallax-child">
						<p>GET IN TOUCH</p>
					</div>
				</section>

				<section class="parallax-child-container">
					<div class="parallax-child">
						<p>GET IN TOUCH</p>
					</div>
				</section>

				<section class="parallax-child-container">
					<div class="parallax-child">
						<p>GET IN TOUCH</p>
					</div>
				</section>

				<section class="parallax-child-container">
					<div class="parallax-child">
						<p>GET IN TOUCH</p>
					</div>
				</section>
			</div>
		<!-- /.parallax-parent -->

	</section>
	<!-- End of 404 Subpage -->
</template>

<script>
export default {
	mounted() {
		const domProductCard = this.$refs.productCard;
		const domViewDetails = this.$refs.viewDetails;
		const domProductFront = domProductCard.querySelector("#product-front");
		const domDivShadowBack = domProductCard.querySelector(
			"#product-back div.shadow"
		);
		const domDivShadowFront = domProductCard.querySelector(
			"#product-front div.shadow"
		);
		const domProductBack = domProductCard.querySelector("#product-back");
		const domCy = domProductCard.querySelector("#cy");
		const domCx = domProductCard.querySelector("#cx");
		const domCarouselNext = domProductCard.querySelector("div.carouselNext");
		const domCarouselPrev = domProductCard.querySelector("div.carouselPrev");
		const domflipBack = domProductCard.querySelector("#flip-back");

		domProductCard.addEventListener("mouseover", () => {
			domProductCard.classList.add("animate");
		});
		domProductCard.addEventListener("mouseleave", () => {
			domProductCard.classList.remove("animate");
		});

		domViewDetails.addEventListener("click", (e) => {
			domCx.classList.remove("s1");
			domCx.classList.remove("s2");
			domCx.classList.remove("s3");
			domCy.classList.remove("s1");
			domCy.classList.remove("s2");
			domCy.classList.remove("s3");

			e.preventDefault();
			domProductCard.classList.add("flip-10");
			setTimeout(function () {
				domProductCard.classList.remove("flip-10");
				domProductCard.classList.add("flip90");

				domDivShadowBack.style.display = "initial";
				domDivShadowFront.style.display = "initial";

				setTimeout(() => {
					domProductFront.style.display = "none";
					domDivShadowFront.style.display = "none";
				}, 80);
			}, 50);

			setTimeout(function () {
				domProductCard.classList.remove("flip90");
				domProductCard.classList.add("flip190");

				domProductBack.style.display = "initial";
				domDivShadowBack.style.display = "initial";
				domDivShadowFront.style.display = "initial";

				setTimeout(function () {
					domProductCard.classList.remove("flip190");
					domProductCard.classList.add("flip180");

					domDivShadowBack.style.display = "none";
					domDivShadowFront.style.display = "none";

					setTimeout(function () {
						domProductCard.style.transition = "100ms ease-out";

						domCx.classList.add("s1");
						domCy.classList.add("s1");

						setTimeout(function () {
							domCx.classList.add("s2");
							domCy.classList.add("s2");
						}, 100);
						setTimeout(function () {
							domCx.classList.add("s3");
							domCy.classList.add("s3");
						}, 200);
						domCarouselNext.classList.add("visible");
						domCarouselPrev.classList.add("visible");
					}, 100);
				}, 100);
			}, 150);
		});

		domflipBack.addEventListener("click", () => {
			domProductCard.classList.remove("flip180");
			domProductCard.classList.add("flip190");

			setTimeout(function () {
				domProductCard.classList.remove("flip190");
				domProductCard.classList.add("flip90");

				domDivShadowBack.style.opacity = 0;
				setTimeout(() => {
					domProductBack.style.display = "none";
					domDivShadowBack.style.display = "none";

					domProductFront.style.display = "initial";
					domDivShadowFront.style.display = "initial";
				}, 100);
			}, 50);

			setTimeout(function () {
				domProductCard.classList.remove("flip90");
				domProductCard.classList.add("flip-10");

				setTimeout(() => {
					domDivShadowBack.style.display = "initial";
				}, 100);

				setTimeout(function () {
					domDivShadowFront.style.display = "none";
					domProductCard.classList.remove("flip-10");
					domProductCard.style.transition = "100ms ease-out";

					domCx.classList.add("s1");
					domCx.classList.add("s2");
					domCx.classList.add("s3");
					domCy.classList.add("s1");
					domCy.classList.add("s2");
					domCy.classList.add("s3");
				}, 100);
			}, 150);
		});
	},
};
</script>
