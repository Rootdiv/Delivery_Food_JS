'use strict';

const cardButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.close');
const cancel = document.querySelector('.clear-cart');

const toggleModal = () => {
  modal.classList.toggle('is-open');
};

cardButton.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);
cancel.addEventListener('click', toggleModal);

new window.WOW().init();

//День 1
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDeliveryJS');

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
  loginInput.removeAttribute('style');
};

const logIn = event => {
  event.preventDefault();
  if (loginInput.value.trim() !== '') {
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
};

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
checkAuth();
