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
import animatePortfolioCard from '../assets/js/animatePortfolioCard';
export default {
	data() {
		return {
			projectList : []
		};
	},
	mounted() {
		setTimeout(() => {
			const domPortfolioCards = window.document.querySelectorAll(
				"#portfolio .portfolio-card"
			);
			domPortfolioCards.forEach((portFolioCard) => {
				animatePortfolioCard(portFolioCard);
			});
		}, 1000);
	},
};
</script>
