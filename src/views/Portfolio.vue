<template>
	<!-- 404 Subpage -->
	<section id="portfolio" class="portfolio animated-section" ref="portfolio">
		<div class="page-title">
			<h2>Portfolio</h2>
		</div>

		<div class="parallax-parent">
			<div class="parallax-background">
				<h1>I LOVE TO PROGRAMMING</h1>
			</div>

			<section class="parallax-child-container" :style="{height : parallaxChildContainerSize.height}">
				<div id="make-3D-space">
					<div id="product-card" ref="productCard">
						<div id="product-front">
							<div class="shadow"></div>
							<img
								src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
								alt=""
							/>
							<div class="image_overlay"></div>
							<div
								id="view_details"
								class="btn-primary-custom"
								ref="viewDetails"
							>
								View details
							</div>
							<div class="stats">
								<div class="stats-container">
									<h3 class="project-name">Virtual Class</h3>

									<div class="project-links">
									<div class="bar-separator"></div>
										<ul>
											<li>
												<a href="#" target="_blank" title="Show live demo">
													<font-awesome-icon :icon="['fas', 'eye']" />
												</a>
											</li>
											<li>
												<a href="#" target="_blank" title="See code on github">
													<font-awesome-icon :icon="['fab', 'github']" />
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div id="product-back">
							<div class="shadow"></div>
							<div class="description-wrapper">
								<h3 class="description-title">Virtual Class</h3>

								<p class="description">
								<div class="bar-separator"></div>
									Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis autem voluptatem in.
								</p>
							</div>
							<div id="flip-back">
								<div id="cy"></div>
								<div id="cx"></div>
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
		</div>
		<!-- /.parallax-parent -->
	</section>
	<!-- End of 404 Subpage -->
</template>

<script>
export default {
	data() {
		return {
			parallaxChildContainerSize : {
				height : 0+'px',
				width: 0+'px',
			}
		}
	},
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


		const domPortfolio = this.$refs.portfolio;
		const parallaxChildContainerSize_ = this.parallaxChildContainerSize;

		parallaxChildContainerSize_.height = domPortfolio.getBoundingClientRect().width+'px';
		parallaxChildContainerSize_.width = domPortfolio.getBoundingClientRect().height+'px';

		window.addEventListener("resize", (e) => {

			if ( domPortfolio.getBoundingClientRect().width >  domPortfolio.getBoundingClientRect().height) {
				parallaxChildContainerSize_.height = domPortfolio.getBoundingClientRect().height+'px';
				parallaxChildContainerSize_.width = domPortfolio.getBoundingClientRect().width+'px';

			} else {
					parallaxChildContainerSize_.height = domPortfolio.getBoundingClientRect().width+'px';
				parallaxChildContainerSize_.width = domPortfolio.getBoundingClientRect().height+'px';
			}
		});
	},
};
</script>
