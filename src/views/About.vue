<template>
	<!-- About Me Subpage -->
	<section data-id="about-me" class="animated-section">
		<div class="page-title">
			<h2>
				About
				<span>Me</span>
			</h2>
		</div>

		<div class="section-content">
			<!-- Personal Information -->
			<div class="row">
				<div class="col-12 text-justify">
					<p>
						A self-taught learner and simple passionate developer 🐱‍👤.
					</p>
					<p>
						I like to develop stuff and it's a real pleasure to have
						positive feedback from my contractors 🌟.
					</p>
					<p>
						I greatly admire & respect those who also develop and do
						great things from a few lines of code 🤝.
					</p>
					<p>
						As for work, I am pragmatic. I like to learn from others and
						I always try to do better than before 💻.
					</p>
					<p>
						I adapt very quickly to a new work environment and I I’m
						comfortable working in a team. I am pretty calm, and I
						listen to others when they need to talk to me 😀.
					</p>
				</div>
			</div>
			<!-- End of Personal Information -->

			<div class="white-space-50"></div>

			<!-- Services -->
			<div class="row">
				<div class="col-xs-12 col-sm-12">
					<div class="block-title">
						<h3>
							More
							<span>About Me</span>
						</h3>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xs-12 col-sm-6">
					<div class="col-inner">
						<div class="info-list-w-icon">
							<div class="info-block-w-icon">
								<div class="ci-icon">
									<i class="lnr lnr-store"></i>
								</div>
								<div class="ci-text">
									<h4>
										Technologies Curious
										<font-awesome-icon icon="leaf" class="text-primary-custom" />
									</h4>
									<p>Since I was a child, I was marked by 3D, creating 3D models with 3DS-Max and Blender... Today I
										discovered ThreeJs and I
										fell back into childhood.
									</p>
									<p>
										At the same time, I recently discovered web3.0, a new world, the future 🚀
									</p>
									<p>
										it's a real pleasure the learn new technologies and applying in my passion ❤
									</p>
								</div>
							</div>
							<div class="info-block-w-icon">
								<div class="ci-icon">
									<i class="lnr lnr-laptop-phone"></i>
								</div>
								<div class="ci-text">
									<h4>
										Music
										<font-awesome-icon icon="music" class="text-primary-custom" />
									</h4>
									<p>Without music, we can't stay alive.</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-xs-12 col-sm-6">
					<div class="col-inner">
						<div class="info-list-w-icon">
							<div class="info-block-w-icon">
								<div class="ci-icon">
									<i class="lnr lnr-pencil"></i>
								</div>
								<div class="ci-text">
									<h4>
										Traveler beginner
										<font-awesome-icon icon="globe" class="text-primary-custom" />
									</h4>
									<p>Not long ago, I discovered the pleasure of traveling and meeting new people. maybe one day, I will
										do my world tour too</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
		<!-- /.section-content -->
	</section>
	<!-- End of About Me Subpage -->
</template>

<script>
export default {
	mounted() {
		this.age = new Date().getFullYear() - 1998
		document.title = '@MNath_ | About'
	},
}
</script>
