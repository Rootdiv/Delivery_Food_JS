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

const cartButton = document.querySelector('#cart-button');
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
const inputAddress = document.querySelector('.input-address');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDeliveryJS');

const cart = JSON.parse(localStorage.getItem(`gloDeliveryJS_${login}`)) || [];

const saveCart = () => {
  localStorage.setItem(`gloDeliveryJS_${login}`, JSON.stringify(cart));
};

const downloadCart = () => {
  if (localStorage.getItem(`gloDelivery_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
    cart.push(...data);
  }
};

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
  if (modal.classList.contains('is-open')) {
    window.disableScroll();
  } else {
    window.enableScroll();
  }
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

const returnMain = () => {
  containerPromo.classList.remove('hide');
  swiper.init(optionSlider);
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
};

const authorized = () => {
  const logOut = () => {
    login = null;
    cart.length = 0;
    localStorage.removeItem('gloDeliveryJS');
    userName.removeAttribute('style');
    buttonOut.removeAttribute('style');
    buttonAuth.removeAttribute('style');
    cartButton.removeAttribute('style');
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  };
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {
  const logIn = event => {
    event.preventDefault();
    if (validName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem('gloDeliveryJS', login);
      toggleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.cssText = 'border: 2px solid #ff0000';
    }
  };
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
      swiper.destroy(false);
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

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find(item => item.id === id);

    if (food) {
      food.count++;
    } else {
      cart.push({
        title,
        cost,
        id,
        count: 1
      });
    }
    saveCart();
  }
}

const renderCart = () => {
  modalBody.textContent = '';
  cart.forEach(({
    title,
    cost,
    id,
    count
  }) => {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });
  const totalPrice = cart.reduce((res, item) => res + (parseFloat(item.cost) * item.count), 0);
  modalPrice.textContent = totalPrice + ' ₽';
  saveCart();
};

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(item => item.id === target.dataset.id);

    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (!food.count) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;

    renderCart();
  }
}

const searchHandler = event => {
  const value = event.target.value.trim();

  if (!value && event.key === 'Enter') {
    event.target.style.backgroundColor = '#ff0000';
    event.target.value = '';
    setTimeout(() => {
      event.target.style.backgroundColor = '';
    }, 1500);
    return;
  }

  if (!/^[А-Яа-яЁё]$/.test(event.key)) return;

  if (value.length < 3) return;

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
  cartButton.addEventListener('click', () => {
    renderCart();
    toggleModal();
  });
  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
    toggleModal();
  });
  modalBody.addEventListener('click', changeCount);
  cardsMenu.addEventListener('click', addToCart);
  closeModal.addEventListener('click', toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', returnMain);
  inputSearch.addEventListener('keyup', searchHandler);
  inputAddress.addEventListener('keyup', searchHandler);
  modal.addEventListener('click', event => {
    if (event.target.matches('.is-open')) {
      toggleModal();
    }
  });
  checkAuth();
};

if (cardsRestaurants) {
  init();
} else {
  cartButton.addEventListener('click', toggleModal);
  closeModal.addEventListener('click', toggleModal);
  cancel.addEventListener('click', toggleModal);
  new window.WOW().init();
}
