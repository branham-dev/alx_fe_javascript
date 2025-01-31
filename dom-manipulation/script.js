document.addEventListener("DOMContentLoaded", () => {
	const quotesCollection = [
		{
			text: "The only way to do great work is to love what you do.",
			category: "Motivation",
		},
		{
			text: "In the middle of every difficulty lies opportunity.",
			category: "Wisdom",
		},
		{
			text: "Simplicity is the soul of efficiency.",
			category: "Productivity",
		},
		{
			text: "Your time is limited, so don’t waste it living someone else’s life.",
			category: "Life",
		},
		{
			text: "A person who never made a mistake never tried anything new.",
			category: "Innovation",
		},
		{
			text: "The function of good software is to make the complex appear to be simple.",
			category: "Technology",
		},
		{
			text: "It’s not that we use technology, we live technology.",
			category: "Technology",
		},
		{
			text: "Success is not in what you have, but who you are.",
			category: "Success",
		},
		{
			text: "The secret of getting ahead is getting started.",
			category: "Motivation",
		},
		{
			text: "Creativity is intelligence having fun.",
			category: "Creativity",
		},
	];

	const quoteDisplay = document.getElementById("quoteDisplay");
	const newQuote = document.getElementById("newQuote");
	const addNewQuote = document.getElementById("addNewQuote");

	const showRandomQuote = () => {
		const random = Math.floor(Math.random() * quotesCollection.length);
		// return random;
		quoteDisplay.innerHTML = "";
		const article = document.createElement("article");
		const quoteText = document.createElement("p");
		quoteText.textContent = quotesCollection[random].text;
		// quoteText.textContent = quotesCollection[showRandomQuote()].text;
		const quoteCategory = document.createElement("p");
		quoteCategory.textContent = quotesCollection[random].category;
		// quoteCategory.textContent = quotesCollection[showRandomQuote()].category;
		article.appendChild(quoteText);
		article.appendChild(quoteCategory);
		quoteDisplay.appendChild(article);
		console.log(quotesCollection);
		// setTimeout(() => {
		// 	console.clear(quotesCollection);
		// }, 30000);
	};
	showRandomQuote();

	newQuote.addEventListener("click", () => {
		showRandomQuote();
		// location.reload();
	});

	addNewQuote.addEventListener("click", () => {
		const quoteInput = document.getElementById("newQuoteText");
		const categoryInput = document.getElementById("newQuoteCategory");
		const newQuoteText = quoteInput.value;
		const newQuoteCategory = categoryInput.value;

		if (newQuoteText && newQuoteCategory) {
			const newQuoteObj = { text: newQuoteText, category: newQuoteCategory };
			console.log(newQuoteObj);
			quotesCollection.push(newQuoteObj);
			console.log(quotesCollection);
			quoteInput.value = "";
			categoryInput.value = "";
		}
	});
});
