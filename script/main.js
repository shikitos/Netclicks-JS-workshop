//var-s for left pop-up menu
const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger');


//open-close menu
hamburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.body.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});


//dropdowns at the pop-up menu
leftMenu.addEventListener('click', event => {
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


//Changing of the cards
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
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