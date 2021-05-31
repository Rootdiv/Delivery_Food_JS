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

new WOW().init(); //jshint ignore:line
