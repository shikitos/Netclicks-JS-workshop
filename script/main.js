//Global consts-s
const API_KEY = "5d35ede145339b338e490a96168d6a2b",
    API_ENDPOINT = "https://api.themoviedb.org/3",
    IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";

//var-s for elements
const tvShowList = document.querySelector(".tv-shows__list"),
    tvShows = document.querySelector(".tv-shows");

//var-s for modal window elements
const modal = document.querySelector(".modal"),
    tvCardImg = document.querySelector(".tv-card__img"),
    modalTitle = document.querySelector(".modal__title"),
    genresList = document.querySelector(".genres-list"),
    rating = document.querySelector(".rating"),
    description = document.querySelector(".description"),
    modalLink = document.querySelector(".modal__link");

//var-s for left pop-up menu
const leftMenu = document.querySelector(".left-menu"),
    hamburger = document.querySelector(".hamburger");

//var for loading and add a class
const loading = document.createElement("div");
loading.classList.add("preloader");

//var for preloader for modal window 
const preloader = document.createElement('div');
preloader.className = 'loading';

//var-s for search form
const searchForm = document.querySelector(".search__form"),
    searchFormInput = document.querySelector(".search__form-input");

//var-s for results when not found
const posterWrapper = document.querySelector(".poster__wrapper"),
    modalContent = document.querySelector(".modal-content");

//var for pagination
const pagination = document.querySelector(".pagination");

// Instructor's option
tvShowsHead = document.querySelector(".tv-shows__head");

//Class - create new cards from json, create new modals for each card
const DBService = class {
    getData = async(url) => {
        //Get data from json
        const res = await fetch(url); //Request with async/await
        if (res.ok) {
            //If true
            return res.json(); //Return this elements
        } else {
            //Or
            throw new Error(
                `Unable to get data from the server at ${url}. Error status: ${res.status}. `
            ); //Catching an error
        }
    };
    getTestData = () => {
        //Where we are taking a data for cards
        return this.getData("test.json");
    };
    getTestCard = () => {
        //where we are taking a data for modal
        return this.getData("card.json");
    };
    getSearchResult = (query) => {
        //Taking the data about tv-shows
        this.url = `${API_ENDPOINT}/search/tv?api_key=${API_KEY}&query=${query}&language=en-EN`;
        return this.getData(
            `${API_ENDPOINT}/search/tv?api_key=${API_KEY}&query=${query}&language=en-EN`
        );
    };
    getNextPage = (page) => {
        return this.getData(this.url + `&page=` + page);
    };

    getTvShow = (id) => {
        return this.getData(`${API_ENDPOINT}/tv/${id}?api_key=${API_KEY}&language=en-EN`);
    };

    getTopRated = () =>
        this.getData(
            `${API_ENDPOINT}/tv/top_rated?api_key=${API_KEY}&language=en-EN`
        );

    getPopular = () =>
        this.getData(
            `${API_ENDPOINT}/tv/popular?api_key=${API_KEY}&language=en-EN`
        );

    getToday = () =>
        this.getData(
            `${API_ENDPOINT}/tv/airing_today?api_key=${API_KEY}&language=en-EN`
        );

    getWeek = () =>
        this.getData(
            `${API_ENDPOINT}/tv/on_the_air?api_key=${API_KEY}&language=en-EN`
        );
};

//New object in the const
const dbService = new DBService();

//open-close menu
hamburger.addEventListener("click", (event) => {
    //When you click at the hamburger - add/remove classes => open/close menu
    leftMenu.classList.toggle("openMenu");
    hamburger.classList.toggle("open");
});

document.body.addEventListener("click", (event) => {
    //When you click outside the left menu - remove classes => close menu
    const target = event.target;
    if (!target.closest(".left-menu")) {
        leftMenu.classList.remove("openMenu");
        hamburger.classList.remove("open");
    }
});

//dropdowns at the pop-up menu
leftMenu.addEventListener("click", (event) => {
    //When you click at the dropdowns - add/remove active class => open/close list
    event.preventDefault();
    const target = event.target,
        dropdown = target.closest(".dropdown");
    if (dropdown) {
        // Dropdown menu links
        dropdown.classList.toggle("active");
        leftMenu.classList.add("openMenu");
        hamburger.classList.add("open");
    }
    if (target.closest("#top-rated")) {
        dbService.getTopRated().then((response) => renderCard(response, target));
    }
    if (target.closest("#popular")) {
        dbService.getPopular().then((response) => renderCard(response, target));
    }
    if (target.closest("#week")) {
        dbService.getWeek().then((response) => renderCard(response, target));
    }
    if (target.closest("#today")) {
        dbService.getToday().then((response) => renderCard(response, target));
    }
    if (target.closest("#search")) {
        tvShowList.textContent = "";
        tvShowsHead.textContent = "";
    }
});

//Open modal window
tvShowList.addEventListener("click", (event) => {
    event.preventDefault(); //By clicking at the card we avoid the scrollUp
    const target = event.target,
        card = target.closest(".tv-card");
    if (card) {
        preloader;
        preloader.style.display = 'block';
        const id = card.dataset.idtv;
        dbService
            .getTvShow(id)
            .then((response) => {
                if (response.poster_path) {
                    tvCardImg.src = IMG_URL + response.poster_path;
                    tvCardImg.alt = response.name;
                    posterWrapper.style.display = "";
                } else {
                    posterWrapper.style.display = "none";
                }
                modalTitle.textContent = response.name; //get name
                genresList.textContent = ""; // Clean the list of the genres
                for (const item of response.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                } //get genres by the function reduce
                rating.textContent = response.vote_average;
                description.textContent = response.overview;
                modalLink.href = response.homepage;
            })
            .then(() => {
                //second then for making load text and after text open modal
                document.body.style.overflow = "hidden"; //Off the scroll
                modal.classList.remove("hide"); //make modal visible
                preloader.remove(); //remove loading after load all cards
            }); //When you click at the card -- adds data about card in the modal
    }
});

//Close modal window
modal.addEventListener("click", (event) => {
    const target = event.target;
    if (
        target.classList.contains("modal") || //Click out of the modal?
        target.closest(".cross") //Or click at the cross?
    ) {
        modal.classList.add("hide"); //Make modal hidden
        document.body.style.overflow = ""; //On the scroll
    }
});

//Modal

//Changing the image of the cards
const changeImage = (event) => {
    const card = event.target.closest(".tv-shows__item");
    if (card) {
        const img = card.querySelector(".tv-card__img");
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]; //When you hover at the card - img at the cards is changing at another
        }
        //     drop = img.dataset.backdrop;
        // if (drop) {
        //     img.dataset.backdrop = img.src;
        //     img.src = drop;
        // } ---------but I created by destructuring assignment---- (above this comment)
    }
};

tvShowList.addEventListener("mouseover", changeImage); //mouse at the card
tvShowList.addEventListener("mouseout", changeImage); //mouse out of the card

const renderCard = (response, target) => {
    tvShowList.textContent = ""; //Clear the list of the cards
    const searchResultHeader = document.querySelector(".tv-shows__head"),
        notFoundExists = searchResultHeader.querySelector("h2");
    if (notFoundExists) {
        searchResultHeader.removeChild(notFoundExists);
    }
    if (!response.total_results) {
        // Instructor's option to display message when movie isn't found
        const notFound = document.createElement("h2");
        notFound.innerText =
            "Sorry, but nothing matched your search criteria. Please try again.";
        searchResultHeader.append(notFound);
        return;
    }

    // Instructor's option for display message when movie isn't found
    tvShowsHead.textContent = target ? target.textContent : "Search Results";

    response.results.forEach((item) => {
        //Iterating through the array
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
        } = item; //Take data from JSON for new cards and make destructurization of the data
        const posterImg = poster ? IMG_URL + poster : "img/no-poster.jpg", //If we have not poster - change poster at "no-poster.jpg"
            backdropImg = backdrop ? IMG_URL + backdrop : "img/no-poster.jpg", //If we have not backdrop - change backdrop at "no-poster.jpg"
            voteValue = vote ? `<span class="tv-card__vote">${vote}</span>` : "", //If we have not vote - change vote at null
            card = document.createElement("li"); //Create an element <li>

        card.classList.add("tv-shows__item"); //Add a class for the element
        card.innerHTML = `
        <a href="#" data-idtv="${id}" class="tv-card">
            ${voteValue}
            <img class="tv-card__img" src="${posterImg}" data-backdrop="${backdropImg}" alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        loading.remove();
        tvShowList.append(card); //Add cards under all cards
    });
    //Number of the pages fog pagination
    pagination.textContent = '';

    if (!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
        }
    }
};

//Handle the search form
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); //Remove spaces at the beginning and at the end of the query
    const value = searchFormInput.value.trim();
    if (value) {
        tvShowList.append(loading); //add loader during search
        dbService.getSearchResult(value).then(renderCard); //search
    }
    searchFormInput.value = ""; //Clear the search input after request
});

pagination.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains("pages")) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
        console.log(dbService.getNextPage(target.textContent));

    }
});