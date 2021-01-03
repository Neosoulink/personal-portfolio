<template>
  <!-- Resume Subpage -->
  <section data-id="resume" class="animated-section">
    <div class="page-title">
      <h2>Resume</h2>
    </div>

    <div class="section-content">
      <div class="row">
        <div class="col-12 col-sm-7">
          <div class="block-title">
            <h3>Experience</h3>
          </div>

          <div class="timeline timeline-second-style clearfix">
            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2019 - Current</h5>
                <span class="item-company">African Law Repport</span>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Full-Stack Developper</h4>
                <p>
                  Creation of a management platform for lawyers. Maintenance of the
                  official website of the cabinet of Emery Mukendi W. (cabemery.org).
                  Update of the juriDocs.org software (web and mobile) and Cabemery.org
                  website.
                </p>
                <p>
                  In direct partnership with
                  <a href="https://www.cabemery.org/" target="_blank">
                    www.cabemry.org
                    <font-awesome-icon icon="external-link-alt" /> </a
                  >.
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
                <h4 class="item-title">Consultant Programmer Engineer</h4>
                <p></p>
              </div>
            </div>
          </div>

          <div class="white-space-50"></div>

          <div class="block-title">
            <h3>Education</h3>
          </div>

          <div class="timeline timeline-second-style clearfix">
            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2020 - Current</h5>
                <span class="item-company">ISC</span>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Licence study</h4>
                <p></p>
              </div>
            </div>

            <div class="timeline-item clearfix">
              <div class="left-part">
                <h5 class="item-period">2019</h5>
                <span class="item-company">Institus superieur de commerce</span>
              </div>
              <div class="divider"></div>
              <div class="right-part">
                <h4 class="item-title">Informatic graduate</h4>
                <p>End of my graduate study (graduation).</p>
              </div>
            </div>
          </div>
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
            <Skill
              v-for="(item, index) in skills"
              :key="index"
              :title="item.title"
              :percentage="parseInt(item.percentage)"
            ></Skill>
          </div>
          <!-- End of Coding Skills -->

          <div class="white-space-10"></div>

          <div class="block-title">
            <h3>
              Database
              <span>Used</span>
            </h3>
          </div>

          <div class="skills-info skills-second-style">
            <Skill title="MySQL" :percentage="75"></Skill>
            <Skill title="Oracle" :percentage="65"></Skill>
            <Skill title="Firebase" :percentage="70"></Skill>
            <Skill title="MongoDB" :percentage="75"></Skill>
          </div>
          <!-- End of Coding Skills -->

          <div class="white-space-10"></div>

          <!-- Knowledges -->
          <div class="block-title">
            <h3>Knowledges</h3>
          </div>

          <ul class="knowledges">
            <li>Marketing Digital</li>
            <li>Print Software</li>
            <li>SEO</li>
            <li>System Conception</li>
          </ul>
          <!-- End of Knowledges -->
        </div>
        <!-- End of Skills & Certificates -->
      </div>

      <div class="white-space-50"></div>

      <!-- Certificates -->
      <div class="row">
        <div class="col-12 col-sm-12">
          <div class="block-title">
            <h3>Certificates</h3>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Certificate 1 -->
        <div class="col-12 col-sm-6">
          <div class="certificate-item clearfix">
            <div class="certi-logo">
              <img
                src="https://skillvalue.com/assets/img/logo.pentalog-company-white.svg"
                alt="logo"
              />
            </div>

            <div class="certi-content">
              <div class="certi-title">
                <h4>
                  <a
                    href="https://skillvalue.com/fr/user/certificate/1IIwT7FONwBlJCrOjaL3piDfp8LAzUaJJfmubKhJPPw1rJoBODiAGGAbaC2e"
                    target="_blank"
                    >Vuejs Certificate</a
                  >
                </h4>
              </div>
            </div>
          </div>
        </div>
        <!-- End of Certificate 1 -->

        <!-- Certificate 2 -->
        <div class="col-12 col-sm-6">
          <div class="certificate-item clearfix">
            <div class="certi-logo">
              <img
                src="https://skillvalue.com/assets/img/logo.pentalog-company-white.svg"
                alt="logo"
              />
            </div>

            <div class="certi-content">
              <div class="certi-title">
                <h4>
                  <a
                    href="https://skillvalue.com/fr/user/certificate/6xgAFXiInVW8HNONdMe8J84I7Zc0SV07MUdwokborxf2C4tEJkCXV5pmWPRr"
                    target="_blank"
                    >Laravel Certificate</a
                  >
                </h4>
              </div>
            </div>
          </div>
        </div>
        <!-- End of Certificate 2 -->

        <!-- Certificate 2 -->
        <div class="col-12 col-sm-6">
          <div class="certificate-item clearfix">
            <div class="certi-logo">
              <img
                src="https://skillvalue.com/assets/img/logo.pentalog-company-white.svg"
                alt="logo"
              />
            </div>

            <div class="certi-content">
              <div class="certi-title">
                <h4>
                  <a
                    href="https://skillvalue.com/fr/user/certificate/uMKjt1g4GJgYuIiq4tRtnW60PsuIVL7w94dyfd39yoBpMcvC6SBqn8CkpXKg"
                    target="_blank"
                    >JavaScript ES6 Certificate</a
                  >
                </h4>
              </div>
            </div>
          </div>
        </div>
        <!-- End of Certificate 2 -->
      </div>
      <!-- End of Certificates -->
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
			skills : 'author/getSkills'
		})
	},
  mounted() {
  },
};
</script>
