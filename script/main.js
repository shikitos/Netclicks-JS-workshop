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
    if (target.classList.contains('modal') || target.closest('.cross')) {
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }
});