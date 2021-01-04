<template>
  <div id="app" ref="app">
    <!-- Animated Background -->
    <div class="img-animated-bg" :style="{ transform: imgAnimatedBgTransformStyle }">
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
              <img src="./assets/img/undraw_male_avatar_323b.svg" alt="Nathan Mandemvo" />
            </div>
            <div class="header-titles">
              <h2>Nathan Mandemvo</h2>
              <h4>Full-Stack Dev</h4>
            </div>
          </div>

          <ul class="main-menu">
            <li data-toggle="tooltip" data-placement="left" title="Tooltip on left">
              <router-link exact to="/" class="nav-anim">
                <font-awesome-icon icon="home" class="menu-icon" />
                <span class="link-text">Home</span>
              </router-link>
            </li>
            <li class>
              <router-link exact to="/about" class="nav-anim">
                <font-awesome-icon icon="user" class="menu-icon" />
                <span class="link-text">About Me</span>
              </router-link>
            </li>
            <li class>
              <router-link exact to="/resume" class="nav-anim">
                <font-awesome-icon icon="graduation-cap" class="menu-icon" />
                <span class="link-text">Resume</span>
              </router-link>
            </li>
            <li class>
              <router-link exact to="/contact" class="nav-anim">
                <font-awesome-icon icon="address-book" class="menu-icon" />
                <span class="link-text">Contact</span>
              </router-link>
            </li>
          </ul>

          <div class="social-links">
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/nathan-mandemvo-87b0b2196/"
                  target="_blank"
                >
                  <font-awesome-icon :icon="['fab', 'linkedin']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/nsl_nathan" target="_blank">
                  <font-awesome-icon :icon="['fab', 'twitter']" class="menu-icon" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/+243823132630?text=I'm%20interested%20about%20your%20profile"
                  target="_blank"
                >
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
                <a href="https://www.instagram.com/destinyofnath/" target="_blank"
                  ><font-awesome-icon :icon="['fab', 'instagram']" class="menu-icon"
                /></a>
              </li>
            </ul>
          </div>

          <div class="themes-buttons" ref="themes-buttons">
            <a class="theme-primary active" @click="changeAppClassName()"></a>

            <a
              class="theme-danger"
              @click="changeAppClassName('dangerTheme', $event)"
            ></a>
          </div>

          <div class="header-buttons">
            <a
              href="/CV_Nathan-Mandemvo.pdf"
              target="_blank"
              class="btn-primary-custom"
              download
              >Download CV</a
            >
          </div>

          <div class="copyrights">© 2020 All rights reserved.</div>
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
        <div class="lmpixels-arrows-nav">
          <div class="lmpixels-arrow-right" @click="nextRoute()">
            <font-awesome-icon icon="chevron-right" class="menu-icon" />
          </div>
          <div class="lmpixels-arrow-left" @click="previousRoute()">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgAnimatedBgTransform: "",
      showMenu: false,
      routes: ["Home", "About", "Resume", "Contact", "Lost"],
      indexRoute: 1,
      routeDirection: "slide",
    };
  },
  computed: {
    imgAnimatedBgTransformStyle() {
      return this.imgAnimatedBgTransform;
    },
    routeLength() {
      return this.routes.length;
    },
  },
  methods: {
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
    changeAppClassName(className = "default" || "primaryTheme" || null, e = undefined) {
      const app = this.$refs["app"],
        themesButtons = this.$refs["themes-buttons"];

      themesButtons.childNodes.forEach((element) => {
        element.classList.remove("active");
      });

      console.log(className, e);
      if (className && e) {
        switch (className) {
          case "primaryTheme" || "default" || null:
            app.className = className;
            break;
          case "dangerTheme":
            app.className = className;
            break;

          default:
            console.warn(className, "this className aren't available");
            break;
        }
        e.target.classList.add("active");
      } else {
        app.className = "primaryTheme";
        themesButtons.childNodes[0].classList.add("active");
      }
    },
  },
  mounted() {
    //window.addEventListener("mousemove", (e) => {
    //  const mouseX = e.clientX / (window.innerWidth / 5);
    //  const mouseY = e.clientY / (window.innerHeight / 5);
    //  this.imgAnimatedBgTransform = `translate3d(-${mouseX}%, -${mouseY}%, 0)`;
    //});
  },
  watch: {
    $route(to, from) {
      this.hideMenu();
      let i = 0;
      this.routes.forEach((routeName) => {
        i++;
        if (to.name == "Lost") {
          this.routeDirection = "slide";
        } else if (routeName == to.name) {
          if (i > this.indexRoute) {
            this.routeDirection = "slideUp";
          } else {
            this.routeDirection = "slideDown";
          }
          this.indexRoute = i;
        }
      });
    },
  },
};
</script>
