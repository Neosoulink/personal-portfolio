<template>
  <!-- Resume Subpage -->
  <section data-id="resume" class="animated-section">
    <div class="page-title">
      <h2>Resume</h2>
    </div>

    <div class="section-content">
      <div class="row">
        <div class="col-12 col-sm-7 mb-4">
          <div class="block-title">
            <h3>Experience</h3>
          </div>

          <div class="timeline timeline-second-style clearfix">
            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2022 - Current</h5>
                <a href="https://ever.tech/" class="item-company">Ever Technologies<font-awesome-icon
                    icon="external-link-alt" /></a>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Full-stack software engineer</h4>
                <p class="">
                  I develop existing full-stack applications, I lead teams and guide new developers. It's a real
                  pleasure to contribute to
                  Ever...
                </p>
              </div>
            </div>

            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2021 - Current</h5>
                <a href="https://tech-congo.com/" target="_blank" class="item-company">Tech Congo <font-awesome-icon
                    icon="external-link-alt" /></a>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Lead software engineer</h4>
                <p class="">
                  Subcontracting for the Keeano company.
                  Creation of <a href="https://keeano.com" target="_blank">Keeano web <font-awesome-icon
                      icon="external-link-alt" /></a> and mobile app (Android and
                  IOS).
                  Development of IT solutions for various applications
                </p>
              </div>
            </div>

            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2021</h5>
                <a href="https://www.maishapay.net" target="_blank" class="item-company">MaishaPay Fintech
                  <font-awesome-icon icon="external-link-alt" /></a>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Contactor Mobile engineer</h4>
                <p class="">
                  Design and development of the new version of the Maishapay mobile app
                </p>
              </div>
            </div>

            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2019 - 2020</h5>
                <span class="item-company">African Law Report</span>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Contactor Web & Mobile engineer</h4>
                <p class="">
                  Creation of a management platform for lawyers. Maintenance of the website of the company
                  (<a href="cabemery.org" target="_blank">Cabemery <font-awesome-icon icon="external-link-alt" /></a>).
                  Maintenance of <a href="juriDocs.org" target="_blank">juriDocs <font-awesome-icon
                      icon="external-link-alt" /></a> web and mobile apps.
                </p>
              </div>
            </div>

            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2019 - 2020</h5>
                <span class="item-company">Aktif Office</span>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Contactor web engineer</h4>
                <p></p>
              </div>
            </div>
          </div>

          <div class="white-space-50"></div>

          <!-- Knowledges -->
          <div class="block-title">
            <h3>Knowledge & Others</h3>
          </div>

          <ul class="knowledges">
            <li>Figma UI/UX</li>
            <li>Digital Marketing</li>
            <li>Project managment with Trello, Jira & CLickUp</li>
            <li>SEO</li>
            <li>Web3D</li>
            <li>System Conception</li>
            <li>Team player</li>
            <li>Web3</li>
            <li>Code testing</li>
          </ul>
          <!-- End of Knowledges -->
        </div>

        <!-- Skills & Certificates -->
        <div class="col-12 col-sm-5">
          <!-- Coding Skills -->
          <div class="block-title">
            <h3>
              Coding
              <span>Skills</span>
            </h3>
          </div>

          <div class="skills-info skills-second-style">
            <Skill v-for="(item, index) in skills" :key="index" :title="item.title"
              :percentage="parseInt(item.percentage)"></Skill>
          </div>
          <!-- End of Coding Skills -->

          <div class="white-space-10"></div>

          <div class="block-title">
            <h3>
              DBMS / Services
              <span>Used</span>
            </h3>
          </div>

          <div class="skills-info skills-second-style">
            <Skill title="Firebase" :percentage="70"></Skill>
            <Skill title="MySQL" :percentage="75"></Skill>
            <Skill title="MongoDB" :percentage="65"></Skill>
          </div>
          <!-- End of Coding Skills -->
        </div>
      </div>
    </div>

  </section>
  <!-- End of Resume Subpage -->
</template>

<script>
import { mapGetters } from "vuex";
import Skill from "../components/Skill";

export default {
  name: "Resume",
  components: {
    Skill,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      skills: 'author/getSkills'
    })
  },
  mounted() {
    document.title = '@MNath_ | Resume'
  },
};
</script>
