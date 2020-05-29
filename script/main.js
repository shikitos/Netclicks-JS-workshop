//Global consts-s
const API = "5d35ede145339b338e490a96168d6a2b",
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

//var for pleloader and add a class
const loading = document.createElement("div");
loading.className = "loading";

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
    const target = event.target,
        dropdown = target.closest(".dropdown");
    if (dropdown) {
        dropdown.classList.toggle("active");
        leftMenu.classList.add("openMenu");
        hamburger.classList.add("open");
    }
});

//Open modal window
tvShowList.addEventListener("click", (event) => {
    event.preventDefault(); //By clicking at the card we avoid the scrollUp
    const target = event.target,
        card = target.closest(".tv-card");
    if (card) {
        new DBService()
            .getTestCard()
            .then((response) => {
                tvCardImg.src = IMG_URL + response.poster_path;
                modalTitle.textContent = response.name; //get name
                genresList.textContent = ""; // Clean the list of the genres
                for (const item of response.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                } //get genres by the function reduce
                rating;
                description;
                modalLink;
            })
            .then(() => {
                //second then for making load text and after text open modal
                document.body.style.overflow = "hidden"; //Off the scroll
                modal.classList.remove("hide"); //make modal visible
            }); //When you click at the card -- adds data about card in the modal
    }
});

//Close modal window
modal.addEventListener("click", (event) => {
    const target = event.target;
    if (
        target.classList.contains("modal") || //Click out of the modal?
        target.closest(".cross")
    ) {
        //Or click at the cross?
        modal.classList.add("hide"); //Make modal hidden
        document.body.style.overflow = ""; //On the scroll
    }
});

//modal

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
};

const renderCard = (response) => {
    tvShowList.textContent = ""; //Clearing the list of the cards
    response.results.forEach((item) => {
        //Iterating through the array
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
        } = item; //Take data from JSON for new cards and make destructurization of the data
        const posterImg = poster ? IMG_URL + poster : "img/no-poster.jpg", //If we have not poster - change poster at "no-poster.jpg"
            backdropImg = backdrop ? IMG_URL + backdrop : "img/no-poster.jpg", //If we have not backdrop - change backdrop at "no-poster.jpg"
            voteValue = vote ? `<span class="tv-card__vote">${vote}</span>` : "", //If we have not vote - change vote at null
            card = document.createElement("li"); //Create an element <li>

        card.classList.add("tv-shows__item"); //Add a class for the element
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${voteValue}
            <img class="tv-card__img" src="${posterImg}" data-backdrop="${backdropImg}" alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        loading.remove(); //remove loading after load all cards
        tvShowList.append(card); //Add cards under all cards
    });
}; {
    tvShows.append(loading); //create loading -- when our cards are not visible - we see preloader
    new DBService().getTestData().then(renderCard); //Create new cards
} //it will be a function