'use strict';

// Slider
const optionSlider = {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'coverflow',
};

new window.Swiper('.swiper-container', optionSlider);

const cardButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close');
const cancel = document.querySelector('.clear-cart');
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDeliveryJS');

const validName = str => {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_.]{3,20}$/;
  return regName.test(str);
};

const toggleModal = () => {
  modal.classList.toggle('is-open');
};

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
  loginInput.removeAttribute('style');
  if (modalAuth.classList.contains('is-open')) {
    window.disableScroll();
  } else {
    window.enableScroll();
  }
};

const logIn = event => {
  event.preventDefault();
  if (validName(loginInput.value)) {
    login = loginInput.value;
    localStorage.setItem('gloDeliveryJS', login);
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
  } else {
    loginInput.style.cssText = 'border: 2px solid #ff0000';
  }
};

const logOut = () => {
  login = null;
  localStorage.removeItem('gloDeliveryJS');
  userName.removeAttribute('style');
  buttonOut.removeAttribute('style');
  buttonAuth.removeAttribute('style');
  buttonOut.removeEventListener('click', logOut);
  checkAuth();
};

const authorized = () => {
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', event => {
    if (event.target.matches('.is-open')) {
      toggleModalAuth();
    }
  });
};

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

const createCardRestaurant = () => {
  const card = `
    <a href="#" class="card card-restaurant wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">4.5</div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>
      </div>
    </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = () => {

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.</div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

const openGoods = event => {
  event.preventDefault();
  const target = event.target;
  if (login) {
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      createCardGood();
    }
  } else {
    toggleModalAuth();
  }
};

cardButton.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);
cancel.addEventListener('click', toggleModal);
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

checkAuth();

createCardRestaurant();

new window.WOW().init();
