<template>
	<!-- Contact Subpage -->
	<section data-id="contact" class="animated-section">
		<div class="page-title">
			<h2>Contact</h2>
		</div>

		<div class="section-content">
			<!-- Contact Info -->
			<div class="info-block-container">
				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="phone-alt" />
					<h4>
						<a href="tel:+243 823 132 630" target="_blank">Call me: +243 823 132 630</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'whatsapp']" />
					<h4>
						<a href="https://wa.me/+243823132630?text=I'm%20interested%20about%20your%20profile" target="_blank">Contact
							me in Whatsapp</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'linkedin']" />
					<h4>
						<a href="https://www.linkedin.com/in/nathan-mandemvo-87b0b2196/" target="_blank">Join me in Linkedin</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'twitter']" />
					<h4>
						<a href="https://twitter.com/nsl_nathan" target="_blank">Follow me on Twitter</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'facebook']" />
					<h4>
						<a href="https://web.facebook.com/NSL.Solaris" target="_blank">Be freind on Facebook</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'github']" />
					<h4>
						<a href="https://github.com/Neosoulink" target="_blank">Follow me on Github</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'instagram']" />
					<h4>
						<a href="https://www.instagram.com/destinyofnath/" target="_blank">Follow me on Instagram</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="laptop-code" />
					<h4>
						<a href="https://www.codingame.com/profile/cc01af57cefe78a2e220ceeb2cc838a09672843"
							target="_blank">challenge me on codingame</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="at" />
					<h4>
						<a href="mailto:nathaninbusines2.0@gmail.com?subject=I'm%20interested%20about%20your%20profile"
							target="_blank">nathaninbusines2.0@gmail.com</a>
					</h4>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon :icon="['fab', 'stack-overflow']" class />
					<h4>
						<a href="https://stackoverflow.com/users/11686855/neosoulink" target="_blank">stackoverflow</a>
					</h4>
				</div>
			</div>
			<!-- End of Contact Info -->

			<div class="white-space-40"></div>

			<!-- Contact Form -->
			<div class>
				<!--<div id="map" class="map"></div>-->
				<div class="block-title">
					<h3>
						How Can I
						<span>Help You?</span>
					</h3>
				</div>

				<form id="contact_form" @submit.prevent="sendEmail()">
					<div class="messages"></div>

					<div class="controls two-columns">
						<div class="fields clearfix">
							<div class="">

								<div class="form-group form-group-with-icon" :class="{ 'form-group-focus': form.subject }">
									<input id="form_subject" type="text" name="subject" class="form-control-custom" v-model="form.subject"
										required="required" data-error="Subject is required." />
									<label>Subject</label>
									<div class="form-control-custom-border"></div>
									<div class="help-block with-errors"></div>
								</div>

								<div class="form-group form-group-with-icon" :class="{ 'form-group-focus': form.message }">
									<textarea id="form_message" name="body" class="form-control-custom" v-model="form.body" rows="7"
										required="required" data-error="Please, leave me a message."></textarea>
									<label>Message</label>
									<div class="form-control-custom-border"></div>
									<div class="help-block with-errors"></div>
								</div>
							</div>
						</div>

						<div class="g-recaptcha">
							<vue-recaptcha theme="dark" sitekey="6Leip0QaAAAAABA2pFDnWpUrAbdiEQETMtNwvh15" :loadRecaptchaScript="true"
								@verify="form.isValidatedRecaptcha = true" @expired="form.isValidatedRecaptcha = false">
							</vue-recaptcha>
							<small v-if="!form.isValidatedRecaptcha" class="text-danger">Please validate the reCAPTCHA</small>
						</div>

						<input type="submit" class="button btn-send" value="Send message" />
					</div>
				</form>
			</div>
			<!-- End of Contact Form -->
		</div>
		<!-- /.section-content -->
	</section>
	<!-- End of Contact Subpage -->
</template>

<script>
import VueRecaptcha from "vue-recaptcha";

export default {
	name: "Contact",
	components: { VueRecaptcha },
	data() {
		return {
			form: {
				fullName: null,
				email: null,
				subject: null,
				body: null,
				isValidatedRecaptcha: false
			},
		};
	},
	methods: {
		sendEmail() {
			if (this.form.isValidatedRecaptcha) {
				window.open(`mailto:nathaninbusiness2.0@gmail.com?subject=${this.form.subject}&body=${this.form.body}`);
			} else {
				window.alert('Please, be sure to validate reCaptcha')
			}
		}
	},
	mounted() {
		//this.this.$recaptchaInstance.showBadge()
		document.title = '@MNath_ | Contact'
	},
};
</script>
