<template>
	<div id="app" ref="app" :class="currentStoreTheme.theme">
		<!-- Animated Background -->
		<div
			class="img-animated-bg"
			:style="{ transform: imgAnimatedBgTransformStyle }"
		>
			<!--<vue-particles
        color="#e0fffe"
        :particleOpacity="1"
        :particlesNumber="100"
        shapeType="edge"
        :particleSize="8"
        linesColor="#e0fffe"
        :lineLinked="true"
        :lineOpacity="0.6"
        :hoverEffect="false"
        :clickEffect="false"
      ></vue-particles>-->
		</div>

		<!-- Loading animation -->
		<div class="preloader d-none">
			<div class="preloader-animation">
				<div class="preloader-spinner"></div>
			</div>
		</div>
		<!-- /Loading animation -->

		<div class="page">
			<div class="page-content">
				<header
					id="site_header"
					class="header"
					:class="{ ' mobile-menu-hide': !showMenu }"
				>
					<div class="header-content">
						<div class="header-photo">
							<svg
								id="e59edb86-a3bc-4694-8aac-31e565ca5cfc"
								data-name="Layer 1"
								xmlns="http://www.w3.org/2000/svg"
								width="676"
								height="676"
								viewBox="0 0 676 676"
							>
								<title>male_avatar</title>
								<path
									d="M938,450a336.852,336.852,0,0,1-27.22,133.1L909.66,585.68A338.559,338.559,0,0,1,541.35,782.93q-3.045-.54-6.08-1.12a334.98111,334.98111,0,0,1-61.14-18.03q-4.815-1.935-9.56-4.01c-2.16-.94-4.32-1.91-6.46-2.91A338.41424,338.41424,0,0,1,262,450c0-186.67,151.33-338,338-338S938,263.33,938,450Z"
									transform="translate(-262 -112)"
									:fill="currentStoreTheme.color"
								/>
								<path
									d="M541.35,782.93q-3.045-.54-6.08-1.12c-1.32-38.31-5.85-116.94-21.30005-199.29C505.52,537.45,493.79,491.25,477.52,449.95a412.60387,412.60387,0,0,0-19.07-41.84c-16.44-31.05-36.38-57.19-60.56-74.9l3.56-4.86q30.165,22.11,54.22,62.08,7.215,11.97,13.86005,25.54,7.125,14.52,13.59,30.83,4.125,10.38,7.97,21.48,16.74,48.195,28.46,109.98,2.59506,13.65,4.94,27.97C536.6,680.2,540.25,748.59,541.35,782.93Z"
									transform="translate(-262 -112)"
									opacity="0.2"
								/>
								<path
									d="M464.57,759.77c-2.16-.94-4.32-1.91-6.46-2.91-2.09-22.7-5.93-50.86-12.95-77.59A254.55666,254.55666,0,0,0,433.35,644.07c-8.01-18.75-18.38-34.69-31.79-44.52l3.56-4.85c14.04,10.28,24.87,26.53,33.24,45.54,9.43,21.42,15.72,46.35,19.91,70.17C461.38,728.1,463.34,745.19,464.57,759.77Z"
									transform="translate(-262 -112)"
									opacity="0.2"
								/>
								<circle
									cx="102.26174"
									cy="190.98167"
									r="30.08857"
									opacity="0.2"
								/>
								<circle
									cx="111.9514"
									cy="449.99083"
									r="30.08857"
									opacity="0.2"
								/>
								<path
									d="M483.71449,353.52139c-6.38046,35.99732,7.70456,68.59225,7.70456,68.59225s24.42979-25.76825,30.81025-61.76557-7.70457-68.59225-7.70457-68.59225S490.09494,317.52407,483.71449,353.52139Z"
									transform="translate(-262 -112)"
									opacity="0.2"
								/>
								<path
									d="M383.71766,438.97122c34.33494,12.555,68.83676,4.498,68.83676,4.498s-21.16612-28.41279-55.50106-40.96784-68.83675-4.498-68.83675-4.498S349.38272,426.41617,383.71766,438.97122Z"
									transform="translate(-262 -112)"
									opacity="0.2"
								/>
								<path
									d="M377.89534,668.333c24.066,8.80008,48.28314,3.0594,48.28314,3.0594S411.37687,651.384,387.31086,642.5839s-48.28314-3.0594-48.28314-3.0594S353.82933,659.53292,377.89534,668.333Z"
									transform="translate(-262 -112)"
									opacity="0.2"
								/>
								<circle
									cx="337.30608"
									cy="281.0788"
									r="131.77014"
									fill="#f5f5f5"
								/>
								<path
									d="M547.83337,493.96531s16.47127,78.23852,16.47127,86.47415,78.23852,45.296,78.23852,45.296L712.546,613.382,737.253,539.26129s-41.17817-61.76725-41.17817-86.47415Z"
									transform="translate(-262 -112)"
									fill="#f5f5f5"
								/>
								<path
									d="M910.78,583.1,909.66,585.68A338.559,338.559,0,0,1,541.35,782.93q-3.045-.54-6.08-1.12a334.98111,334.98111,0,0,1-61.14-18.03q-4.815-1.935-9.56-4.01c-2.16-.94-4.32-1.91-6.46-2.91a337.59273,337.59273,0,0,1-55.25-32.28l-15.62-45.31,8.78-6.69995,18.06-13.79,19.27-14.71,5.01-3.83,75.61-57.72,5.58-4.26,39.3-30,.01-.01s42.5,69.25,104.27,48.66,60.42-79.63,60.42-79.63Z"
									transform="translate(-262 -112)"
									fill="#2f2e41"
								/>
								<path
									d="M485.03538,286.916s41.83653-90.64581,122.02321-69.72755,125.50958,52.29566,128.996,83.67306-1.74319,78.44348-1.74319,78.44348-8.716-64.498-64.498-50.55247-142.94147,3.48638-142.94147,3.48638L512.9264,457.74849s-15.6887-22.66145-33.12058-8.71594S429.25335,314.807,485.03538,286.916Z"
									transform="translate(-262 -112)"
									fill="#2f2e41"
								/>
								<path
									d="M474.13,763.78q-4.815-1.935-9.56-4.01c-2.16-.94-4.32-1.91-6.46-2.91a338.835,338.835,0,0,1-87.59-58.7c9.19-12.52,16.72-18.89,16.72-18.89h61.77l9.26,31.14Z"
									transform="translate(-262 -112)"
									fill="#2f2e41"
								/>
								<path
									d="M856.67,576.32l52.99,9.36A337.94434,337.94434,0,0,1,852.9,674.25Z"
									transform="translate(-262 -112)"
									fill="#2f2e41"
								/>
							</svg>
						</div>
						<div class="header-titles">
							<h2>Nathan Mandemvo</h2>
							<h4>Development lover</h4>
						</div>
					</div>

					<ul class="main-menu">
						<li>
							<router-link exact :to="{name: 'Home'}" class="nav-anim">
								<font-awesome-icon icon="home" class="menu-icon" />
								<span class="link-text">Home</span>
							</router-link>
						</li>
						<li>
							<router-link exact :to="{name: 'About'}" class="nav-anim">
								<font-awesome-icon icon="user-astronaut" class="menu-icon" />
								<span class="link-text">About Me</span>
							</router-link>
						</li>
						<li>
							<router-link exact :to="{name: 'Resume'}" class="nav-anim">
								<font-awesome-icon icon="graduation-cap" class="menu-icon" />
								<span class="link-text">Resume</span>
							</router-link>
						</li>
						<li>
							<router-link exact :to="{name: 'MyWork'}" class="nav-anim">
								<font-awesome-icon icon="laptop-code" class="menu-icon" />
								<span class="link-text">My Work</span>
							</router-link>
						</li>
						<li>
							<router-link exact :to="{name: 'Contact'}" class="nav-anim">
								<font-awesome-icon icon="address-book" class="menu-icon" />
								<span class="link-text">Contact</span>
							</router-link>
						</li>
					</ul>

					<div class="social-links">
						<ul>
							<li>
								<a
									href="#"
									target="_blank"
								>
									<font-awesome-icon
										:icon="['fab', 'linkedin']"
										class="menu-icon"
									/>
								</a>
							</li>
							<li>
								<a href="#" target="_blank">
									<font-awesome-icon
										:icon="['fab', 'twitter']"
										class="menu-icon"
									/>
								</a>
							</li>
							<li>
								<a
									href="https://wa.me/+243823132630?text=I'm%20interested%20about%20your%20profile"
									target="_blank"
								>
									<font-awesome-icon
										:icon="['fab', 'whatsapp']"
										class="menu-icon"
									/>
								</a>
							</li>
							<li>
								<a href="https://web.facebook.com/NSL.Solaris" target="_blank">
									<font-awesome-icon
										:icon="['fab', 'facebook']"
										class="menu-icon"
									/>
								</a>
							</li>
							<li>
								<a href="https://github.com/Neosoulink" target="_blank">
									<font-awesome-icon
										:icon="['fab', 'github']"
										class="menu-icon"
									/>
								</a>
							</li>
							<li>
								<a
									href="https://www.instagram.com/destinyofnath/"
									target="_blank"
									><font-awesome-icon
										:icon="['fab', 'instagram']"
										class="menu-icon"
								/></a>
							</li>
						</ul>
					</div>

					<!-- Theme change -->
					<div class="theme-circle-color">
						<div class="themes-buttons" ref="themes-buttons">
							<button
								v-for="(item, index) in getStoreThemeList"
								:key="index"
								:class="`${index} ${
									index == currentStoreTheme.theme ? 'active' : ''
								}`"
								@click="changeAppClassName(index)"
							>
								<span class="indicator"></span>
							</button>
						</div>
					</div>
					<!-- End Theme change -->

					<div class="header-buttons">
						<button
							href="/CV_Nathan-Mandemvo.pdf"
							target="_blank"
							class="btn-primary-custom"
							download
						>
							Download CV
						</button>
					</div>

					<a href="https://lmpixels.com/demo/breezycv/dark/1/" target="_blank" class="copyrights">© {{currentYear}} INSPIRED BY breezycv.</a>
				</header>

				<!-- Mobile Navigation -->
				<div
					class="menu-toggle"
					:class="{ open: showMenu }"
					@click="showMenu = !showMenu"
				>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<!-- End Mobile Navigation -->

				<!-- Arrows Nav -->
				<div class="arrows-nav">
					<div class="arrow-right" @click="nextRoute()">
						<font-awesome-icon icon="chevron-right" class="menu-icon" />
					</div>
					<div class="arrow-left" @click="previousRoute()">
						<font-awesome-icon icon="chevron-left" class="menu-icon" />
					</div>
				</div>
				<!-- End Arrows Nav -->

				<div class="content-area" @click="hideMenu()">
					<div class="animated-sections">
						<transition :name="routeDirection">
							<router-view></router-view>
						</transition>
					</div>
					<!-- /.animated-sections -->
				</div>
				<!-- /.content-area -->
			</div>
			<!-- /.page-content -->

		</div>
	</div>
</template>

<script>
import { mapMutations } from "vuex";
import createRipple from "./assets/js/rippleEffect";

export default {
	data() {
		return {
			imgAnimatedBgTransform: "",
			showMenu: false,
			routes: ["Home", "About", "Resume", "MyWork", "Contact", "Lost"],
			indexRoute: 1,
			routeDirection: "slide",
			currentYear : new Date().getFullYear()
		};
	},
	computed: {
		imgAnimatedBgTransformStyle() {
			return this.imgAnimatedBgTransform;
		},
		routeLength() {
			return this.routes.length;
		},
		getStoreThemeList() {
			return this.$store.getters["site/getThemeList"];
		},
		currentStoreTheme() {
			return {
				theme: this.$store.getters["site/getCurrentTheme"],
				color: this.$store.getters["site/getCurrentColor"],
			};
		},
	},
	methods: {
		...mapMutations({
			setStoreTheme: "site/SET_CURRENT_THEME",
		}),
		hideMenu() {
			this.showMenu = false;
		},
		nextRoute() {
			let nextIndex = this.indexRoute + 1;
			if (nextIndex > this.routeLength - 1) {
				nextIndex = 1;
			}

			let i = 0;
			this.routes.forEach((routeName) => {
				i++;
				if (i == nextIndex) {
					this.$router.push({ name: routeName });
				}
			});
		},

		previousRoute() {
			let nextIndex = this.indexRoute - 1;
			if (nextIndex < 1) {
				nextIndex = this.routeLength - 1;
			}

			let i = 0;
			this.routes.forEach((routeName) => {
				i++;
				if (i == nextIndex) {
					this.$router.push({ name: routeName });
				}
			});
		},
		changeAppClassName(className = "default" || "primaryTheme" || null) {
			this.setStoreTheme(className);
		},
	},
	mounted() {
		//window.addEventListener("mousemove", (e) => {
		//  const mouseX = e.clientX / (window.innerWidth / 5);
		//  const mouseY = e.clientY / (window.innerHeight / 5);
		//  this.imgAnimatedBgTransform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
		//});

		//const buttons = window.document.querySelectorAll(
		//	".themes-buttons > button"
		//);
		//for (const button of buttons) {
		//	button.addEventListener("click", createRipple);
		//}
	},
	watch: {
		$route(to, from) {
			this.hideMenu();
			let i = 0;
			this.routes.forEach((routeName) => {
				i++;
				if (to.name == "Lost") {
					this.routeDirection = "fadeUp";
				} else if (routeName == to.name) {
					if (i > this.indexRoute) {
						this.routeDirection = "fadeUp";
					} else {
						this.routeDirection = "fadeDown";
					}
					this.indexRoute = i;
				}
			});
		},
	},
};
</script>
