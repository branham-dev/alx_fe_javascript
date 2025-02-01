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
	const importFile = document.getElementById("importFile");
	const categoryFilter = document.getElementById("categoryFilter");

	const quoteRecord = [];

	const filterQuotes = (e) => {
		console.log(e.target.value);
		const selectedCategory = e.target.value;
		saveOrRetrieve(selectedCategory, undefined, undefined, "saveCategory");
		showRandomQuote(selectedCategory);
	};

	categoryFilter.addEventListener("change", filterQuotes);

	const saveOrRetrieve = (category, obj, quote, command) => {
		const storedQuotes = JSON.parse(localStorage.getItem("quotes")) || quotesCollection;
		if (category === undefined && obj === undefined && quote === undefined && command === undefined) {
			// console.log(storedQuotes);
			return storedQuotes;
		} else if (quote && command === "save") {
			storedQuotes.push(quote);
			localStorage.setItem("quotes", JSON.stringify(storedQuotes));
			return undefined;
		} else if (quote && command === "record") {
			quoteRecord.push(quote);
			// console.log(quoteRecord);
			if (quoteRecord.length === 2) {
				sessionStorage.setItem("lastQuote", JSON.stringify(quoteRecord[0]));
				quoteRecord.shift();
			} else {
				return;
			}
		} else if (obj && command === "import") {
			obj.map((quote) => {
				storedQuotes.push(quote);
				localStorage.setItem("quotes", JSON.stringify(storedQuotes));
			});
			return undefined;
		} else if (category && command === "saveCategory") {
			localStorage.setItem("category", JSON.stringify(category));
		} else if (!category && command === "getCategory") {
			const storedCategory = JSON.parse(localStorage.getItem("category"));
			console.log(storedCategory);
			return storedCategory;
		} else {
			return;
		}
	};

	// const setSelectValue = () => {
	// 	const savedCategory = saveOrRetrieve(undefined, undefined, undefined, "getCategory");
	// 	categoryFilter.value = saveOrRetrieve;
	// 	console.log(savedCategory);
	// };
	// setSelectValue();

	const populateCategories = () => {
		const storedQuotes = saveOrRetrieve();
		const allCategories = storedQuotes.map(({ category }) => category);
		const categories = [...new Set(allCategories)];

		if (categoryFilter) {
			categoryFilter.innerHTML = ""; // Clear existing options
			categories.map((category) => {
				const option = document.createElement("option");
				option.value = category;
				option.textContent = category;
				categoryFilter.appendChild(option);
			});
		}
		console.log(categories);
	};
	populateCategories();
	categoryFilter.value = saveOrRetrieve(undefined, undefined, undefined, "getCategory");

	const showRandomQuote = (value) => {
		let quotesCollection = null;
		if (value === "all") {
			quotesCollection = saveOrRetrieve();
		} else {
			const allCollection = saveOrRetrieve();
			quotesCollection = [];
			for (let i = 0; i < allCollection.length; i++) {
				if (allCollection[i].category === value) {
					quotesCollection.push(allCollection[i]);
				}
			}
			console.log(quotesCollection);
		}
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
		const lastQuoteObj = { text: quoteText.textContent, category: quoteCategory.textContent };
		saveOrRetrieve(undefined, undefined, lastQuoteObj, "record");
		// console.log(quoteText.textContent, quoteCategory.textContent)
		article.appendChild(quoteText);
		article.appendChild(quoteCategory);
		quoteDisplay.appendChild(article);
		// console.log(quotesCollection);
		// setTimeout(() => {
		// 	console.clear(quotesCollection);
		// }, 30000);
	};

	showRandomQuote(saveOrRetrieve(undefined, undefined, undefined, "getCategory"));

	newQuote.addEventListener("click", () => {
		showRandomQuote(saveOrRetrieve(undefined, undefined, undefined, "getCategory"));
		// location.reload();
	});

	const createAddQuoteForm = () => {
		const quoteInput = document.getElementById("newQuoteText");
		const categoryInput = document.getElementById("newQuoteCategory");
		const newQuoteText = quoteInput.value;
		const newQuoteCategory = categoryInput.value;

		if (newQuoteText && newQuoteCategory) {
			const newQuoteObj = { text: newQuoteText, category: newQuoteCategory };
			saveOrRetrieve(undefined, undefined, newQuoteObj, "save");
			populateCategories();
			// console.log(newQuoteObj);
			// quotesCollection.push(newQuoteObj);
			// console.log(quotesCollection);
			quoteInput.value = "";
			categoryInput.value = "";
		}
	};

	addNewQuote.addEventListener("click", createAddQuoteForm);

	const exportQuotes = () => {
		const toRemove = document.getElementById("quotesLink");
		if (toRemove) {
			document.body.removeChild(toRemove);
		}
		const quotes = JSON.stringify(saveOrRetrieve());
		const quotesBlob = new Blob([quotes], { type: "application/json" });
		const quotesUrl = URL.createObjectURL(quotesBlob);
		// console.log(quotesUrl);
		const link = document.createElement("a");
		link.id = "quotesLink";
		link.href = quotesUrl;
		link.download = "quotes.json";
		link.innerText = "Download the exported quotes";
		document.body.prepend(link);
		console.log(quotes);
		link.onclick = () => {
			setTimeout(() => {
				document.body.removeChild(link);
				URL.revokeObjectURL(quotesUrl);
			}, 100);
		};
	};

	const exportButton = () => {
		const button = document.createElement("button");
		button.textContent = "Export Quotes";
		document.body.insertBefore(button, document.body.children[4]);

		button.addEventListener("click", exportQuotes);
	};
	exportButton();

	const importFromJsonFile = (e) => {
		const fileList = e.target.files;
		const numFiles = fileList.length;
		// console.log(fileList);
		// console.log(numFiles);
		const fileReader = new FileReader();
		fileReader.onload = (event) => {
			try {
				const importedQuotes = JSON.parse(event.target.result);
				console.log(importedQuotes);
				saveOrRetrieve(undefined, importedQuotes, undefined, "import");
			} catch (error) {
				console.error(`Error parsing JSON: ${error.message}`);
			}
		};
		fileReader.readAsText(fileList[0]);
	};
	importFile.addEventListener("change", importFromJsonFile, false);
});
