/**
 *
 * @param {HTMLDivElement} portFolioCard Div element
 */
function animatePortfolioCard(portFolioCard) {
	try {
		if (!portFolioCard) {
			throw new Error("Portfolio card not found");
		}

		const domPortfolioCard = portFolioCard;
		const domViewDetails = domPortfolioCard.querySelector(".view_details");
		const domPortfolioFront = domPortfolioCard.querySelector(
			".portfolio-card-front"
		);

		const domPortfolioBack = domPortfolioCard.querySelector(
			".portfolio-card-back"
		);
		const domCy = domPortfolioCard.querySelector(".cy");
		const domCx = domPortfolioCard.querySelector(".cx");
		const domFlipBack = domPortfolioCard.querySelector(".flip-back");

		if (
			!(
				domViewDetails &&
				domPortfolioFront &&
				domPortfolioBack &&
				domCy &&
				domCx &&
				domFlipBack
			)
		) {
			throw new Error("Something whe");
		}
		domViewDetails.addEventListener("click", (e) => {
			domCx.classList.remove("s1");
			domCx.classList.remove("s2");
			domCx.classList.remove("s3");
			domCy.classList.remove("s1");
			domCy.classList.remove("s2");
			domCy.classList.remove("s3");

			e.preventDefault();
			domPortfolioCard.classList.add("flip-10");
			setTimeout(function() {
				domPortfolioCard.classList.remove("flip-10");
				domPortfolioCard.classList.add("flip90");

				setTimeout(() => {
					domPortfolioFront.style.display = "none";
				}, 80);
			}, 50);

			setTimeout(function() {
				domPortfolioCard.classList.remove("flip90");
				domPortfolioCard.classList.add("flip190");

				domPortfolioBack.style.display = "initial";

				setTimeout(function() {
					domPortfolioCard.classList.remove("flip190");
					domPortfolioCard.classList.add("flip180");

					setTimeout(function() {
						domPortfolioCard.style.transition = "100ms ease-out";

						domCx.classList.add("s1");
						domCy.classList.add("s1");

						setTimeout(function() {
							domCx.classList.add("s2");
							domCy.classList.add("s2");
						}, 100);
						setTimeout(function() {
							domCx.classList.add("s3");
							domCy.classList.add("s3");
						}, 200);
					}, 100);
				}, 100);
			}, 150);
		});

		domFlipBack.addEventListener("click", () => {
			domPortfolioCard.classList.remove("flip180");
			domPortfolioCard.classList.add("flip190");

			setTimeout(function() {
				domPortfolioCard.classList.remove("flip190");
				domPortfolioCard.classList.add("flip90");

				setTimeout(() => {
					domPortfolioBack.style.display = "none";

					domPortfolioFront.style.display = "initial";
				}, 100);
			}, 50);

			setTimeout(function() {
				domPortfolioCard.classList.remove("flip90");
				domPortfolioCard.classList.add("flip-10");

				setTimeout(function() {
					domPortfolioCard.classList.remove("flip-10");
					domPortfolioCard.style.transition = "100ms ease-out";

					domCx.classList.add("s1");
					domCx.classList.add("s2");
					domCx.classList.add("s3");
					domCy.classList.add("s1");
					domCy.classList.add("s2");
					domCy.classList.add("s3");
				}, 100);
			}, 150);
		});
	} catch (error) {
		console.warn(error);
	}
}

export default animatePortfolioCard;
