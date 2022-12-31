<template>
	<!-- 404 Subpage -->
	<section id="portfolio" class="portfolio animated-section" ref="portfolio">
		<div class="section-content">
			<div class="page-title mb-0 pb-0">
				<h2>
					My
					<span>Works</span>
				</h2>
			</div>

			<DeveloperActivity class="mt-2 mb-5" />

			<div class="row">
				<div class="col-md-6 mb-4" v-for="(project, index) in projectList" :key="index">
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
												<a :href="project.liveDemoLink" target="_blank" title="Live demo">
													<font-awesome-icon :icon="['fas', 'eye']" />
												</a>
											</li>
											<li v-if="project.repoLink">
												<a :href="project.repoLink" target="_blank" title="Github repo">
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
										<span v-if="project.description" v-html="project.description">
										</span>
										<template v-else> No description </template>
									</p>
								</div>

								<div class="footer">
									<a v-if="project.liveDemoLink" :href="project.liveDemoLink" class="mr-2" target="_blank"
										title="Live demo">
										<font-awesome-icon :icon="['fas', 'eye']" />
										Live demo
									</a>

									<a v-if="project.repoLink" :href="project.repoLink" target="_blank" title="Live demo">
										<font-awesome-icon :icon="['fab', 'github']" />
										Github repo
									</a>
									<div class="d-flex align-items-center" v-if="project.linkToShare">
										<font-awesome-icon :icon="['fas', 'share-alt']" class="mr-2" />
										<a :href="`https://www.linkedin.com/shareArticle
												?mini=true
												&url=${project.linkToShare}
												&title=Share my work on Linkedin
												&summary=I share with you this project which interested me a lot!
												&source=Nathan Mandemvo`" target="_blank" class="mr-2">
											<font-awesome-icon :icon="['fab', 'linkedin']" />
											Linkedin</a>
										<a :href="`https://twitter.com/intent/tweet
												?url=${project.linkToShare}
												&title=Share my work on Twitter
												&text=I share with you this project which interested me a lot!
												&hashtags=nathanMandemvo,${project.hashtags}`" target="_blank" class="mr-2">
											<font-awesome-icon :icon="['fab', 'twitter']" />
											Twitter</a>
									</div>
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
				<!-- /.col-sm-6 -->
			</div>
			<!-- /.row -->
		</div>
		<!-- /.section-content -->
	</section>
	<!-- /.portfolio -->
</template>

<script>
import animatePortfolioCard from "../assets/js/animatePortfolioCard";
import DeveloperActivity from "../components/DeveloppeurActivity";

export default {
	components: {
		DeveloperActivity,
	},
	data() {
		return {
			projectList: [
				{
					label: "nsl-me",
					description: `
						My personal web site <3, ispirated by
						<a href='https://lmpixels.com/demo/breezycv/dark/1/' target='_blank'>breezycv</a>
					`,
					repoLink: "https://github.com/Neosoulink/nsl-me",
					liveDemoLink: "https://nsl-me.web.app",
					linkToShare: "https://nsl-me.web.app",
					hashtags: "VueJS,vanillaJavascript,less,Vuex,Developer,fullstack",
				},
				{
					label: "VirtualClass",
					description: `
						A multi-task application, which allows you to quickly and easily create your documents in a secure way. <br />
						🚧 Currently in development
					`,
					repoLink: "https://github.com/Neosoulink/VirtualClass",
					image: "@/assets/img/projects/virtualclass.png",
				},
				{
					label: "RDCCovid19",
					description: `
						A web application aimed at resolving problems related to Covid-19, by offering services such as reporting or requesting exit certificates...
					`,
					repoLink: "https://github.com/african-law-reports/accesscovid19_old",
					liveDemoLink: "https://rdccovid19.com/",
					linkToShare: "https://rdccovid19.com/",
					hashtags: "Covid19,rdc,webApp,Developer",
				},
				{
					label: "RNA",
					description: `
						An online lawyer register
					`,
					repoLink: "https://github.com/african-law-reports/accesscovid19_old",
					liveDemoLink:
						"https://national-register-of-lawyers.000webhostapp.com/",
					linkToShare:
						"https://national-register-of-lawyers.000webhostapp.com/",
					hashtags: "rdc,registreAvocat,webApp",
				},
				{
					label: "Juridocs",
					description: `
						Partisipation and integration of some modules.
					`,
					repoLink: "https://github.com/african-law-reports/juridocs",
					liveDemoLink: "https://www.juridocs.org/",
					linkToShare: "https://www.juridocs.org/",
					hashtags: "rdc,juridocs,webApp,africanlawreport,Law",
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
		document.title = '@MNath_ | Portfolio'
	},
};
</script>
