<template>
  <LandingView />

  <div class="w-full min-h-full">
    <HomeSection />
    <AboutSection />
    <ContactSection />
  </div>
</template>

<script lang="ts">
// COMPONENTS
import LandingView from "../../components/LandingView.vue";
import HomeSection from "./+home.vue";
import AboutSection from "./+about.vue";
import ContactSection from "./+contact.vue";

export default {
  name: "root",
  components: { LandingView, HomeSection, AboutSection, ContactSection },
};
</script>
