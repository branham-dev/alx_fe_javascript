document.addEventListener("DOMContentLoaded", () => {
	const quotesCollection = [
		{
			quote: "The only way to do great work is to love what you do.",
			category: "Motivation",
		},
		{
			quote: "In the middle of every difficulty lies opportunity.",
			category: "Wisdom",
		},
		{
			quote: "Simplicity is the soul of efficiency.",
			category: "Productivity",
		},
		{
			quote: "Your time is limited, so don’t waste it living someone else’s life.",
			category: "Life",
		},
		{
			quote: "A person who never made a mistake never tried anything new.",
			category: "Innovation",
		},
		{
			quote: "The function of good software is to make the complex appear to be simple.",
			category: "Technology",
		},
		{
			quote: "It’s not that we use technology, we live technology.",
			category: "Technology",
		},
		{
			quote: "Success is not in what you have, but who you are.",
			category: "Success",
		},
		{
			quote: "The secret of getting ahead is getting started.",
			category: "Motivation",
		},
		{
			quote: "Creativity is intelligence having fun.",
			category: "Creativity",
		},
	];

	if (!localStorage.getItem("quotes")) {
		localStorage.setItem("quotes", JSON.stringify(quotesCollection));
	}

	const quoteDisplay = document.getElementById("quoteDisplay");
	const newQuote = document.getElementById("newQuote");
	const addNewQuote = document.getElementById("addNewQuote");
	const importFile = document.getElementById("importFile");
	const categoryFilter = document.getElementById("categoryFilter");
	const syncServer = document.getElementById("syncServer");

	const fetchQuotesFromServer = async () => {
		try {
			const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
				method: "GET",
				headers: {
					"X-Api-Key": "bBAoORicgvkiHDotTAaI/w==4s2Nsv9miD9jVrfI", // Secure storage
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

			const data = await response.json();
			if (data && data.length > 0) {
				const { quote, category } = data[0];
				const storedQuotes = saveOrRetrieve();
				const exists = storedQuotes.some((q) => q.quote === quote);

				if (!exists) {
					saveOrRetrieve(undefined, undefined, { quote, category }, "save");
				}
				console.log("Updated quotes:", saveOrRetrieve());
			} else {
				console.error("No quotes found in the response.");
			}
		} catch (error) {
			console.error("Error fetching quotes:", error.message);
		}
	};

	syncServer.addEventListener("click", () => {
		fetchQuotesFromServer();
		const storedQuotes = saveOrRetrieve();
		console.log(storedQuotes);
	});

	const quoteRecord = [];

	const filterQuotes = (e) => {
		console.log(e.target.value);
		const selectedCategory = e.target.value;
		saveOrRetrieve(selectedCategory, undefined, undefined, "saveCategory");
		showRandomQuote(selectedCategory);
	};

	categoryFilter.addEventListener("change", filterQuotes);

	const saveOrRetrieve = (category, obj, quote, command) => {
		const storedQuotes = JSON.parse(localStorage.getItem("quotes"));
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

	const categoryOfGod = () => {
		const newArray = [];
		const storedQuotes = saveOrRetrieve();
		for (let i = 0; i < storedQuotes.length; i++) {
			if (storedQuotes[i].category === "god") {
				storedQuotes[i].category = "God";
			}
			newArray.push(storedQuotes[i]);
		}
		localStorage.setItem("quotes", JSON.stringify(newArray));
	};
	categoryOfGod();

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
			const first = categoryFilter.firstElementChild;
			categoryFilter.innerHTML = ""; // Clear existing options
			categoryFilter.appendChild(first);
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
		if (quotesCollection.length > 0) {
			// return random;
			quoteDisplay.innerHTML = "";
			const article = document.createElement("article");
			const quoteText = document.createElement("p");
			quoteText.textContent = quotesCollection[random].quote;
			// quoteText.textContent = quotesCollection[showRandomQuote()].text;
			const quoteCategory = document.createElement("p");
			quoteCategory.textContent = quotesCollection[random].category;
			// quoteCategory.textContent = quotesCollection[showRandomQuote()].category;
			const lastQuoteObj = { quote: quoteText.textContent, category: quoteCategory.textContent };
			saveOrRetrieve(undefined, undefined, lastQuoteObj, "record");
			// console.log(quoteText.textContent, quoteCategory.textContent)
			article.appendChild(quoteText);
			article.appendChild(quoteCategory);
			quoteDisplay.appendChild(article);
			// console.log(quotesCollection);
			// setTimeout(() => {
			// 	console.clear(quotesCollection);
			// }, 30000);
		}
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
			const newQuoteObj = { quote: newQuoteText, category: newQuoteCategory };
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

	// ! TODO and redundant

	const fetchData = async () => {
		const response = await fetch("https://jsonplaceholder.typicode.com/posts");
	};
	const postData = async () => {
		const response = await fetch("https://jsonplaceholder.typicode.com/posts", { method: "POST" });
	};
	const syncQuotes = async () => {
		alert("Quotes synced with server!");
	};
	setInterval(() => {
		syncQuotes();
	}, 500000);
});
// localStorage.clear();
