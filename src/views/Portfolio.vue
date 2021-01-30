<template>
	<!-- 404 Subpage -->
	<section id="portfolio" class="portfolio animated-section" ref="portfolio">
		<div class="section-content">
			<div class="page-title">
				<h2>
					My
					<span>work</span>
				</h2>
			</div>

			<div class="row">
				<div
					class="col-md-6 mb-4"
					v-for="(project, index) in projectList"
					:key="index"
				>
					<div class="portfolio-card-wrapper">
						<div class="portfolio-card">
							<div class="portfolio-card-front">
								<div class="image_overlay"></div>
								<div class="view_details btn-primary-custom">View details</div>
								<div class="stats-container">
									<h3 class="project-name">{{ project.label }}</h3>

									<div class="project-links">
										<div class="bar-separator"></div>
										<ul>
											<li v-if="project.liveDemoLink">
												<a
													:href="project.liveDemoLink"
													target="_blank"
													title="Live demo"
												>
													<font-awesome-icon :icon="['fas', 'eye']" />
												</a>
											</li>
											<li v-if="project.repoLink">
												<a
													:href="project.repoLink"
													target="_blank"
													title="Github repo"
												>
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
									<h3 class="description-title">{{ project.label }}</h3>

									<div class="bar-separator"></div>
									<p class="description-content">
										{{ project.description }}
									</p>
								</div>

								<div class="footer">
									<a
										v-if="project.liveDemoLink"
										:href="project.liveDemoLink"
										class="mr-2"
										target="_blank"
										title="Live demo"
									>
										<font-awesome-icon :icon="['fas', 'eye']" />
										Live demo
									</a>

									<a
										v-if="project.repoLink"
										:href="project.repoLink"
										target="_blank"
										title="Live demo"
									>
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
import animatePortfolioCard from "../assets/js/animatePortfolioCard";
export default {
	data() {
		return {
			projectList: [
				{
					label: "Virtual Class",
					description: "An multi tache application for quick creation app",
					repoLink: "https://github.com/Neosoulink/VirtualClass",
				},
			],
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
