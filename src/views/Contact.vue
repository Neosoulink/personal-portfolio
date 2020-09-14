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
					<font-awesome-icon icon="map-marker-alt" class />
					<h4>RDCongo - Kinshasa</h4>
					<span class="lm-info-block-value"></span>
					<span class="lm-info-block-text"></span>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="phone-alt" class />
					<h4>+243 823 132 630</h4>
					<span class="lm-info-block-value"></span>
					<span class="lm-info-block-text"></span>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="envelope" class />
					<h4>
						<a
							href="/cdn-cgi/l/email-protection"
							class="__cf_email__"
							data-cfemail="e1808d8499a18499808c918d84cf828e8c"
						>nathaninbusines2.0@gmail.com</a>
					</h4>
					<span class="lm-info-block-value"></span>
					<span class="lm-info-block-text"></span>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="check-circle" class />
					<h4>Freelance Available</h4>
					<span class="lm-info-block-value"></span>
					<span class="lm-info-block-text"></span>
				</div>

				<div class="lm-info-block gray-default">
					<font-awesome-icon icon="envelope" class />
					<h4>
						<a
							href="/cdn-cgi/l/email-protection"
							class="__cf_email__"
							data-cfemail="e1808d8499a18499808c918d84cf828e8c"
						>nathaninbusines2.0@gmail.com</a>
					</h4>
					<span class="lm-info-block-value"></span>
					<span class="lm-info-block-text"></span>
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

				<form id="contact_form" class="contact-form" @submit.prevent>
					<div class="messages"></div>

					<div class="controls two-columns">
						<div class="fields clearfix">
							<div class="left-column">
								<div class="form-group form-group-with-icon" :class="{'form-group-focus' : form.fullName}">
									<input
										id="form_name"
										type="text"
										name="name"
										class="form-control-custom"
										v-model="form.fullName"
										required="required"
										data-error="Name is required."
									/>
									<label>Full Name</label>
									<div class="form-control-custom-border"></div>
									<div class="help-block with-errors"></div>
								</div>

								<div class="form-group form-group-with-icon" :class="{'form-group-focus' : form.email}">
									<input
										id="form_email"
										type="email"
										name="email"
										class="form-control-custom"
										v-model="form.email"
										required="required"
										data-error="Valid email is required."
									/>
									<label>Email Address</label>
									<div class="form-control-custom-border"></div>
									<div class="help-block with-errors"></div>
								</div>

								<div class="form-group form-group-with-icon" :class="{'form-group-focus' : form.subject}">
									<input
										id="form_subject"
										type="text"
										name="subject"
										class="form-control-custom"
										v-model="form.subject"
										required="required"
										data-error="Subject is required."
									/>
									<label>Subject</label>
									<div class="form-control-custom-border"></div>
									<div class="help-block with-errors"></div>
								</div>
							</div>
							<div class="right-column">
								<div class="form-group form-group-with-icon" :class="{'form-group-focus' : form.message}">
									<textarea
										id="form_message"
										name="message"
										class="form-control-custom"
										v-model="form.message"
										rows="7"
										required="required"
										data-error="Please, leave me a message."
									></textarea>
									<label>Message</label>
									<div class="form-control-custom-border"></div>
									<div class="help-block with-errors"></div>
								</div>
							</div>
						</div>

						<div
							class="g-recaptcha"
							data-sitekey="6LdqmCAUAAAAAMMNEZvn6g4W5e0or2sZmAVpxVqI"
							data-theme="dark"
						></div>

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
export default {
	name: "Contact",
	data() {
		return {
			form: {
				fullName: null,
				email: null,
				subject: null,
				message: null
			}
		};
	}
};
</script>
