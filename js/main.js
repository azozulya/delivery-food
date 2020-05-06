'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const authBtn = document.querySelector('.button-auth');
const authModal = document.querySelector('.modal-auth');
const authCloseBtn = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInp = document.querySelector('#login');
const userName = document.querySelector('.user-name');
//const buttonLogin = document.querySelector('.button-login');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleAuthModal() {
  authModal.classList.toggle('is-open');
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');

    authBtn.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    checkAuth();

  }

  userName.textContent = login;

  authBtn.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {

  function logIn(event) {
    event.preventDefault();

    login = loginInp.value;

    if(login.length > 0) {

      localStorage.setItem('gloDelivery', login);

      toggleAuthModal();

      authBtn.removeEventListener('click', toggleAuthModal);
      authCloseBtn.removeEventListener('click', toggleAuthModal);
      logInForm.removeEventListener('submit', logIn);

      logInForm.reset();
      checkAuth();

    } else {

      loginInp.classList.add('input-error');
      
      loginInp.addEventListener('keyup', function() {
        if(this.value.length > 0)
          this.classList.remove('input-error');
      });

    }
  }  
  authBtn.addEventListener('click', toggleAuthModal);
  authCloseBtn.addEventListener('click', toggleAuthModal);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>
        <!-- /.card-info -->
      </div>
      <!-- /.card-text -->
    </a>  
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood(){
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Везувий</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
            «Халапенье», соус «Тобаско», томаты.
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">545 ₽</strong>
        </div>
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  if(restaurant) {
    if(login){
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      cardsMenu.textContent = '';

      createCardGood();
      createCardGood();
      createCardGood();  
    } else {
      toggleAuthModal();
    }
  }
}

authBtn.addEventListener('click', toggleAuthModal);

authCloseBtn.addEventListener('click', toggleAuthModal);

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function(){
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
})

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

new Swiper('.swiper-container', {
  loop: true,
  autoplay: true
});