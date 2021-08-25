'use strict';

// Slider
const optionSlider = {
  loop: true,
  autoplay: true,
  effect: 'cube',
  cubeEffect: {
    shadow: false,
  },
};

const swiper = new window.Swiper('.swiper-container', optionSlider);

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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');

let login = localStorage.getItem('gloDeliveryJS');

const getData = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус: ${response.status}`);
  }
  return response.json();
};


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

const createCardRestaurant = ({
  image,
  kitchen,
  name,
  price,
  products,
  stars,
  time_of_delivery: timeOfDelivery,
}) => {
  const cardRestaurant = document.createElement('a');
  cardRestaurant.href = '#';
  cardRestaurant.classList.add('card', 'card-restaurant');
  cardRestaurant.products = products;
  cardRestaurant.info = {
    kitchen,
    name,
    price,
    stars
  };
  const card = `
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <div class="card-info">
        <div class="rating">${stars}</div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
};

const createCardGood = ({
  description,
  id,
  image,
  name,
  price
}) => {

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <p class="ingredients">${description}</p>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
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

      const {
        name,
        kitchen,
        price,
        stars
      } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(data => {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
};

const searchHandler = event => {
  const value = event.target.value.trim();

  if (!value && event.code === 'Enter') {
    event.target.style.backgroundColor = '#ff0000';
    event.target.value = '';
    setTimeout(() => {
      event.target.style.backgroundColor = '';
    }, 1500);
    return;
  }

  if (value.length < 3) {
    return;
  }

  getData('./db/partners.json')
    .then(data => data.map(partner => partner.products))
    .then(linksProduct => {
      cardsMenu.textContent = '';

      linksProduct.forEach(link => {
        getData(`./db/${link}`).then(data => {
          const resultSearch = data.filter(item => {
            const name = item.name.toLowerCase();
            return name.includes(value.toLowerCase());
          });

          containerPromo.classList.add('hide');
          swiper.destroy(false);
          restaurants.classList.add('hide');
          menu.classList.remove('hide');

          restaurantTitle.textContent = 'Результат поиска';
          restaurantRating.textContent = '';
          restaurantPrice.textContent = '';
          restaurantCategory.textContent = 'Разная кухня';

          resultSearch.forEach(createCardGood);
        });
      });
    });
};

const init = () => {
  getData('../db/partners.json').then(data => {
    data.forEach(createCardRestaurant);
  });
  cardButton.addEventListener('click', toggleModal);
  closeModal.addEventListener('click', toggleModal);
  cancel.addEventListener('click', toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });
  inputSearch.addEventListener('keyup', searchHandler);
  checkAuth();
};

if (cardsRestaurants) {
  init();
} else {
  cardButton.addEventListener('click', toggleModal);
  closeModal.addEventListener('click', toggleModal);
  cancel.addEventListener('click', toggleModal);
  new window.WOW().init();
}
