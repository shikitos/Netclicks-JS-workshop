//var-s for left pop-up menu
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger');


//open-close menu
hamburger.addEventListener('click', event => { //When you click at the hamburger - add/remove classes => open/close menu
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.body.addEventListener('click', event => { //When you click outside the left menu - remove classes => close menu
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});


//dropdowns at the pop-up menu
leftMenu.addEventListener('click', event => { //When you click at the dropdowns - add/remove active class => open/close list 
    const target = event.target,
        dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});


//var-s modal window
const tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');


//Open modal window
tvShowList.addEventListener('click', event => {
    event.preventDefault(); //By clicking at the card we avoid the scrollUp
    const target = event.target,
        card = target.closest('.tv-card');
    if (card) {
        document.body.style.overflow = 'hidden'; //off scroll
        modal.classList.remove('hide'); //make modal visible
    }
});


//Close modal window
modal.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('modal') || //click out of the modal?
        target.closest('.cross')) { //or click at the cross
        modal.classList.add('hide'); //make modal hidden
        document.body.style.overflow = ''; //on scroll
    }
});


//Changing the image of the cards
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src] //When you hover at the card - img at the cards is changing at another
        }
        //     drop = img.dataset.backdrop;
        // if (drop) {
        //     img.dataset.backdrop = img.src;
        //     img.src = drop;
        // } ---------but I created by destructuring assignment---- (above this comment)
    }
};

tvShowList.addEventListener('mouseover', changeImage); //mouse at the card
tvShowList.addEventListener('mouseout', changeImage); //mouse out of the card


//Class - create new cards from json
const DBService = class {
    getData = async(url) => { //Get data from json
        const res = await fetch(url); //Request with async/await
        if (res.ok) { //If true 
            return res.json(); //Return this elements
        } else { //Or
            throw new Error(`Unable to get data from the server at ${url}. Error status: ${res.status}. `) //Catching an error
        }
    }
    getTestData = async() => { //Where we are taking a data
        return await this.getData('test.json');
    }
}

const renderCard = response => {
    response.results.forEach(item => { //Iterating through the array
        const card = document.createElement('li'); //Create an element <li>
        card.classList.add('tv-shows__item'); //Add a class for the element
    });
};

new DBService().getTestData().then(renderCard()); //Create new cards