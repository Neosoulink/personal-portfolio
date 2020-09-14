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
						<h3>Education</h3>
					</div>

					<div class="timeline timeline-second-style clearfix">
						<div class="timeline-item clearfix">
							<div class="left-part">
								<h5 class="item-period">2019</h5>
								<span class="item-company">Institus superieur de commerce</span>
							</div>
							<div class="divider"></div>
							<div class="right-part">
								<h4 class="item-title">Informatic graduat</h4>
								<p>Maecenas finibus nec sem ut imperdiet. Ut tincidunt est ac dolor aliquam sodales. Phasellus sed mauris hendrerit, laoreet sem in, lobortis ante.</p>
							</div>
						</div>

						<div class="timeline-item clearfix">
							<div class="left-part">
								<h5 class="item-period">2007</h5>
								<span class="item-company">University of Studies</span>
							</div>
							<div class="divider"></div>
							<div class="right-part">
								<h4 class="item-title">Graphic Design</h4>
								<p>Aliquam tincidunt malesuada tortor vitae iaculis. In eu turpis iaculis, feugiat risus quis, aliquet urna. Quisque fringilla mollis risus, eu pulvinar dolor.</p>
							</div>
						</div>
					</div>

					<div class="white-space-50"></div>

					<div class="block-title">
						<h3>Experience</h3>
					</div>

					<div class="timeline timeline-second-style clearfix">
						<div class="timeline-item clearfix">
							<div class="left-part">
								<h5 class="item-period">2016 - Current</h5>
								<span class="item-company">Google</span>
							</div>
							<div class="divider"></div>
							<div class="right-part">
								<h4 class="item-title">Lead Ui/Ux Designer</h4>
								<p>Praesent dignissim sollicitudin justo, sed elementum quam lacinia quis. Phasellus eleifend tristique posuere. Sed vitae dui nec magna.</p>
							</div>
						</div>

						<div class="timeline-item clearfix">
							<div class="left-part">
								<h5 class="item-period">2013 - 2016</h5>
								<span class="item-company">Adobe</span>
							</div>
							<div class="divider"></div>
							<div class="right-part">
								<h4 class="item-title">Senior Ui/Ux Designer</h4>
								<p>Maecenas tempus faucibus rutrum. Duis eu aliquam urna. Proin vitae nulla tristique, ornare felis id, congue libero. Nam volutpat euismod quam.</p>
							</div>
						</div>

						<div class="timeline-item clearfix">
							<div class="left-part">
								<h5 class="item-period">2011 - 2013</h5>
								<span class="item-company">Google</span>
							</div>
							<div class="divider"></div>
							<div class="right-part">
								<h4 class="item-title">Junior Ui/Ux Designer</h4>
								<p>Duis mollis nunc quis quam viverra venenatis. Nulla nulla arcu, congue vitae nunc ac, sodales ultricies diam. Nullam justo leo, tincidunt sit amet.</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Skills & Certificates -->
				<div class="col-12 col-sm-5">
					<!-- Design Skills -->
					<div class="block-title">
						<h3>
							Design
							<span>Skills</span>
						</h3>
					</div>

					<div class="skills-info skills-second-style">
						<Skill title="HTML/CSS" :percentage="10"></Skill>

						<Skill title="HTML/CSS" :percentage="50"></Skill>

						<Skill title="HTML/CSS" :percentage="90"></Skill>
					</div>
					<!-- End of Design Skills -->

					<div class="white-space-10"></div>

					<!-- Coding Skills -->
					<div class="block-title">
						<h3>
							Coding
							<span>Skills</span>
						</h3>
					</div>

					<div class="skills-info skills-second-style">
						<Skill title="JavaScript" :percentage="90"></Skill>
					</div>
					<!-- End of Coding Skills -->

					<div class="white-space-10"></div>

					<!-- Knowledges -->
					<div class="block-title">
						<h3>Knowledges</h3>
					</div>

					<ul class="knowledges">
						<li>Marketing</li>
						<li>Print</li>
						<li>Digital Design</li>
						<li>Social Media</li>
						<li>Time Management</li>
						<li>Communication</li>
						<li>Problem-Solving</li>
						<li>Social Networking</li>
						<li>Flexibility</li>
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
							<img src="img/clients/client-1.png" alt="logo" />
						</div>

						<div class="certi-content">
							<div class="certi-title">
								<h4>Psyhology of Intertnation Design</h4>
							</div>
							<div class="certi-id">
								<span>Membership ID: XXXX</span>
							</div>
							<div class="certi-date">
								<span>19 April 2018</span>
							</div>
							<div class="certi-company">
								<span></span>
							</div>
						</div>
					</div>
				</div>
				<!-- End of Certificate 1 -->

				<!-- Certificate 2 -->
				<div class="col-12 col-sm-6">
					<div class="certificate-item clearfix">
						<div class="certi-logo">
							<img src="img/clients/client-1.png" alt="logo" />
						</div>

						<div class="certi-content">
							<div class="certi-title">
								<h4>Psyhology of Intertnation Design</h4>
							</div>
							<div class="certi-id">
								<span>Membership ID: XXXX</span>
							</div>
							<div class="certi-date">
								<span>19 April 2018</span>
							</div>
							<div class="certi-company">
								<span></span>
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
import Skill from "../components/Skill";

export default {
	name: "Resume",
	components: {
		Skill
	}
};
</script>
