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
							<div class="portfolio-card-front"
								:style="project.coverImg ? `background-image: url(${project.coverImg});` : ''">

								<div class="image_overlay" />

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
// HELPERS
import animatePortfolioCard from "../assets/js/animatePortfolioCard";

// COMPONENTS
import DeveloperActivity from "../components/DeveloppeurActivity";

// IMGS
const _TheDashImg = require('../assets/img/projects/_TheDash.png');
const everDemandImg = require('../assets/img/projects/everDemand.png');
const juriDOcsImg = require('../assets/img/projects/juridocs.png');
const keeanoImg = require('../assets/img/projects/keeano.png');
const listItImg = require('../assets/img/projects/listIt.png');
const nslMeImg = require('../assets/img/projects/nsl-me.png');
const rdccovid19Img = require('../assets/img/projects/rdccovid19.png');
const rnaImg = require('../assets/img/projects/rna.png');
const shefaImg = require('../assets/img/projects/shefa.png');
const techCongoImg = require('../assets/img/projects/techCongo.png');
const virtualclassImg = require('../assets/img/projects/virtualclass.png');

export default {
	components: {
		DeveloperActivity,
	},
	data() {
		return {
			projectList: [
				{
					label: "Ever Demand",
					description: `
						Commerce Platform for On-Demand Economy and Digital Marketplaces. An Open-Source, Real-Time, Reactive, On-Demand Commerce Platform built with TypeScript.
					`,
					coverImg: everDemandImg,
					liveDemoLink: "https://ever.co",
					linkToShare: "https://ever.co",
					repoLink: "https://github.com/ever-co/ever-demand",
					hashtags: "OpenSource,commerce,on_demand,Ever.tech,Ever.co,Typescript,react,node.js,GraphQl,react,reactNative,Angular",
				},
				{
					label: "Keeano",
					description: `
						An application that helps travelers to find the best destinations or go under the desired conditions, and the means of transport available in the sea ⛵
					`,
					coverImg: keeanoImg,
					liveDemoLink: "https://keeano.com/",
					linkToShare: "https://keeano.com/",
					hashtags: "keeano,travel,sea,coast,map,tourism,react,reactNative",
				},
				{
					label: "Shefa",
					description: `
						A mobile financial app that will keep you focused on your financial goals 🌟.
					`,
					coverImg: shefaImg,
					repoLink: "https://github.com/african-law-reports/juridocs",
					liveDemoLink: "https://shefafinential.com/",
					linkToShare: "https://shefafinential.com/",
					hashtags: "mobile,ios,android,goals,finance,quotes,productivity,react,reactNative",
				},
				{
					label: "_TheDash",
					description: `
						__TheDash is an open-source application which gives you the possibility to organize and find your projects more easily in your local php server (E.g: XAMP, Laragon, etc.) Otherwise it gives you some details about your php environment server.
					`,
					coverImg: _TheDashImg,
					linkToShare: "https://github.com/Neosoulink/__TheDash",
					repoLink: "https://github.com/Neosoulink/__TheDash",
					hashtags: "dashboard,php,poo",
				},
				{
					label: "List It",
					description: `
						List It is a team of friendly and experienced amazon listing professionals who know exactly what it takes to become a successful seller on Amazon.
					`,
					coverImg: listItImg,
					liveDemoLink: "https://www.listitamazon.com/services",
					linkToShare: "https://www.listitamazon.com/services",
					hashtags: "Amazon,react,nextjs",
				},
				{
					label: "nsl-me",
					description: `
					My personal web site <3, ispirated by
					<a href='https://lmpixels.com/demo/breezycv/dark/1/' target='_blank'>breezycv -></a>
					`,
					coverImg: nslMeImg,
					repoLink: "https://github.com/Neosoulink/nsl-me",
					liveDemoLink: "https://nsl-me.web.app",
					linkToShare: "https://nsl-me.web.app",
					hashtags: "VueJS,vanillaJavascript,less,Vuex,Developer,fullstack",
				},
				{
					label: "Tech-Congo website",
					description: `
						IT Solutions & services
					`,
					coverImg: techCongoImg,
					liveDemoLink: "https://tech-congo.com/",
					linkToShare: "https://tech-congo.com/",
					hashtags: "IT_Services,react,animation",
				},
				{
					label: "VirtualClass",
					description: `
						A multi-task application, which allows you to quickly and easily create your documents in a secure way. <br />
						🚧 Currently in development
					`,
					coverImg: virtualclassImg,
					repoLink: "https://github.com/Neosoulink/VirtualClass",
				},
				{
					label: "RDCCovid19",
					description: `
						A web application aimed at resolving problems related to Covid-19, by offering services such as reporting or requesting exit certificates...
					`,
					coverImg: rdccovid19Img,
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
					coverImg: rnaImg,
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
					coverImg: juriDOcsImg,
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
		document.title = '@MNath_ | Works'
	},
};
</script>
