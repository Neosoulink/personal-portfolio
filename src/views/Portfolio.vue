<template>
	<!-- 404 Subpage -->
	<section id="portfolio" class="portfolio animated-section" ref="portfolio">
		<div class="section-content">
			<div class="page-title">
				<h2>Portfolio</h2>
			</div>

			<div class="row">
				<div class="col-md-6 mb-4" v-for="(item, index) in ['items', 'fd']" :key="index" @load="initPortfolioCard(this)">
					<div class="portfolio-card-wrapper">
						<div class="portfolio-card">
							<div class="portfolio-card-front">
								<div class="image_overlay"></div>
								<div class="view_details btn-primary-custom">
									View details
								</div>
								<div class="stats-container">
									<h3 class="project-name">Virtual Class</h3>

									<div class="project-links">
										<div class="bar-separator"></div>
										<ul>
											<li>
												<a href="#" target="_blank" title="Live demo">
													<font-awesome-icon :icon="['fas', 'eye']" />
												</a>
											</li>
											<li>
												<a href="#" target="_blank" title="Github repo">
													<font-awesome-icon :icon="['fab', 'github']" />
												</a>
											</li>
										</ul>
									</div>
									<!-- /.project-links -->
								</div>
								<!-- /.stats-container -->
							</div>
							<!-- /.portfolio-card-front -->

							<div class="portfolio-card-back">
								<div class="description-wrapper">
									<h3 class="description-title">Virtual Class</h3>

									<div class="bar-separator"></div>
									<p class="description-content">
										Lorem ipsum dolor sit, amet consectetur adipisicing elit.
										Omnis autem voluptatem in.
									</p>
								</div>

								<div class="footer">
									<a href="#" class="mr-2" target="_blank" title="Live demo">
										<font-awesome-icon :icon="['fas', 'eye']" />
										Live demo
									</a>

									<a href="#" target="_blank" title="Live demo">
										<font-awesome-icon :icon="['fab', 'github']" />
										Github repo
									</a>
								</div>

								<div class="flip-back">
									<div class="cy"></div>
									<div class="cx"></div>
								</div>
							</div>
							<!-- /.portfolio-card-back -->
						</div>
						<!-- /.portfolio-card -->
					</div>
					<!-- /.portfolio-card-wrapper -->
				</div>
			</div>
		</div>
		<!-- /.section-content -->
	</section>
	<!-- /.portfolio -->
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		initPortfolioCard(portFolioCard = Object) {
			const domPortfolioCard = portFolioCard;
			const domViewDetails = domPortfolioCard.querySelector(".view_details");
			const domPortfolioFront = domPortfolioCard.querySelector(
				".portfolio-card-front"
			);

			const domPortfolioBack = domPortfolioCard.querySelector(
				".portfolio-card-back"
			);
			const domCy = domPortfolioCard.querySelector(".cy");
			const domCx = domPortfolioCard.querySelector(".cx");
			const domflipBack = domPortfolioCard.querySelector(".flip-back");

			domViewDetails.addEventListener("click", (e) => {
				domCx.classList.remove("s1");
				domCx.classList.remove("s2");
				domCx.classList.remove("s3");
				domCy.classList.remove("s1");
				domCy.classList.remove("s2");
				domCy.classList.remove("s3");

				e.preventDefault();
				domPortfolioCard.classList.add("flip-10");
				setTimeout(function () {
					domPortfolioCard.classList.remove("flip-10");
					domPortfolioCard.classList.add("flip90");

					setTimeout(() => {
						domPortfolioFront.style.display = "none";
					}, 80);
				}, 50);

				setTimeout(function () {
					domPortfolioCard.classList.remove("flip90");
					domPortfolioCard.classList.add("flip190");

					domPortfolioBack.style.display = "initial";

					setTimeout(function () {
						domPortfolioCard.classList.remove("flip190");
						domPortfolioCard.classList.add("flip180");

						setTimeout(function () {
							domPortfolioCard.style.transition = "100ms ease-out";

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
				domPortfolioCard.classList.remove("flip180");
				domPortfolioCard.classList.add("flip190");

				setTimeout(function () {
					domPortfolioCard.classList.remove("flip190");
					domPortfolioCard.classList.add("flip90");

					setTimeout(() => {
						domPortfolioBack.style.display = "none";

						domPortfolioFront.style.display = "initial";
					}, 100);
				}, 50);

				setTimeout(function () {
					domPortfolioCard.classList.remove("flip90");
					domPortfolioCard.classList.add("flip-10");

					setTimeout(function () {
						domPortfolioCard.classList.remove("flip-10");
						domPortfolioCard.style.transition = "100ms ease-out";

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
	},
	mounted() {

		setTimeout(() => {
			const domPortfolioCards = window.document.querySelectorAll(
				"#portfolio .portfolio-card"
			);
			domPortfolioCards.forEach((portFolioCard) => {
				this.initPortfolioCard(portFolioCard);
			});
		}, 1000);
	},
};
</script>
