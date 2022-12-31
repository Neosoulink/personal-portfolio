<template>
  <div id="app" ref="app" :class="currentStoreTheme.theme">
    <!-- Animated Background -->
    <div class="img-animated-bg" :style="{ transform: imgAnimatedBgTransformStyle }">
      <div class="bgTransition"></div>
      <div class="bgImg"></div>

      <vue-particles color="#f5f5f5" :particleOpacity="1" :particlesNumber="100" shapeType="edge" :particleSize="8"
        linesColor="#f5f5f5" :lineLinked="true" :lineOpacity="0.6" :hoverEffect="false"
        :clickEffect="false"></vue-particles>
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
        <header id="site_header" class="header" :class="{ ' mobile-menu-hide': !showMenu }">
          <div class="header-content">
            <div class="header-photo">
              <img src="https://avatars.githubusercontent.com/u/44310540" title="@MNath_" alt="@MNath_">
            </div>
            <div class="header-titles">
              <h2>Nathan Mande</h2>
              <h4>Passionate Software engineer</h4>
            </div>
          </div>

          <ul class="main-menu">
            <li>
              <router-link exact :to="{ name: 'Home' }" class="nav-anim">
                <font-awesome-icon icon="home" class="menu-icon" />
                <span class="link-text">Home</span>
              </router-link>
            </li>
            <li>
              <router-link exact :to="{ name: 'About' }" class="nav-anim">
                <font-awesome-icon icon="user-astronaut" class="menu-icon" />
                <span class="link-text">About Me</span>
              </router-link>
            </li>
            <li>
              <router-link exact :to="{ name: 'Resume' }" class="nav-anim">
                <font-awesome-icon icon="graduation-cap" class="menu-icon" />
                <span class="link-text">Resume</span>
              </router-link>
            </li>
            <li>
              <router-link exact :to="{ name: 'MyWork' }" class="nav-anim">
                <font-awesome-icon icon="laptop-code" class="menu-icon" />
                <span class="link-text">My Works</span>
              </router-link>
            </li>
            <li>
              <router-link exact :to="{ name: 'Contact' }" class="nav-anim">
                <font-awesome-icon icon="address-book" class="menu-icon" />
                <span class="link-text">Contact</span>
              </router-link>
            </li>
          </ul>

          <div class="social-links">
            <ul>
              <li>
                <a href="#" target="_blank">
                  <font-awesome-icon :icon="['fab', 'linkedin']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank">
                  <font-awesome-icon :icon="['fab', 'twitter']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a href="https://wa.me/+243823132630?text=I'm%20interested%20about%20your%20profile" target="_blank">
                  <font-awesome-icon :icon="['fab', 'whatsapp']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a href="https://web.facebook.com/NSL.Solaris" target="_blank">
                  <font-awesome-icon :icon="['fab', 'facebook']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a href="https://github.com/Neosoulink" target="_blank">
                  <font-awesome-icon :icon="['fab', 'github']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/destinyofnath/" target="_blank"><font-awesome-icon
                    :icon="['fab', 'instagram']" class="menu-icon" /></a>
              </li>
            </ul>
          </div>

          <!-- Theme change -->
          <div class="theme-circle-color">
            <div class="themes-buttons" ref="themes-buttons">
              <button v-for="(item, index) in getStoreThemeList" :key="index"
                :class="`${index} ${index == currentStoreTheme.theme ? 'active' : ''}`"
                @click="changeAppClassName(index)">
                <span class="indicator"></span>
              </button>
            </div>
          </div>
          <!-- End Theme change -->

          <div class="header-buttons">
            <a href="/Nathan-Mande_Resume-En.pdf" target="_blank" class="btn-primary-custom" title="download resume"
              download>
              Download CV
            </a>
          </div>

          <a href="https://lmpixels.com/demo/breezycv/dark/1/" target="_blank" class="copyrights">© INSPIRED BY
            breezycv.</a>
        </header>

        <!-- Mobile Navigation -->
        <div class="menu-toggle" :class="{ open: showMenu }" @click="showMenu = !showMenu">
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
      currentYear: new Date().getFullYear(),
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
    window.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / (window.innerWidth / 5);
      const mouseY = e.clientY / (window.innerHeight / 5);
      this.imgAnimatedBgTransform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
    });

    const buttons = window.document.querySelectorAll(".themes-buttons > button");
    for (const button of buttons) {
      button.addEventListener("click", createRipple);
    }
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
