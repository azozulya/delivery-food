'use strict';

const GET_RESTAURANTS_URL = './db/partners.json';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const authBtn = document.querySelector('.button-auth');
const authModal = document.querySelector('.modal-auth');
const authCloseBtn = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInp = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const goodsHeader = document.querySelector('.restaurant-info');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');
let cart = localStorage.getItem(login) || [];

const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok){
    throw new Error(`Ошибка по адресу ${url}, 
      статус ошибки ${response.status}`);    
  } 
  return await response.json();
}

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
}

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
    inputSearch.style.display = 'none';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }
  userName.textContent = login;
  cartButton.style.display = 'flex';
  authBtn.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  inputSearch.style.display = 'none';

  function logIn(event) {
    event.preventDefault();   

    if(valid(loginInp.value)) {
      login = loginInp.value;
      localStorage.setItem('gloDelivery', login);
      cart = JSON.parse(localStorage.getItem(login)) || [];
      inputSearch.style.display = '';
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

function createCardRestaurant(restaurant) {
  const { 
    image, 
    kitchen, 
    name,
    price, 
    products, 
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurant;

  const card = `
    <a class="card card-restaurant" data-products="${products}">
      <img src="${image}" alt="image" class="card-image"/>
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
    </a>  
  `;  
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood({ description, id, image, name, price }){
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="${name}" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button id="${id}" class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price}&nbsp;₽</strong>
        </div>
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;  
  if (login) {

    const restaurant = target.closest('.card-restaurant'); 
    if(restaurant) {  
      goodsHeader.textContent = '';    
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      const getInfo = (el) => {
        const item = restaurant.querySelector(el);
        return item ? item.textContent : '';
      }

      const restaurantInfo = `
        <h2 class="section-title restaurant-title">${getInfo('.card-title')}</h2>
        <div class="card-info">
          <div class="rating">${getInfo('.rating')}</div>
          <div class="price">${getInfo('.price')}</div>
          <div class="category">${getInfo('.category')}</div>
        </div>
      `;
      
      goodsHeader.insertAdjacentHTML('beforeend', restaurantInfo);

      getData(`db/${restaurant.dataset.products}`).then(function(data){
          data.forEach(createCardGood);
        }
      );
    } 
  } else {
    toggleAuthModal();
  }
}

function returnMain() {  
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');  
}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id =  buttonAddToCart.id;

    const food = cart.find(function(item) {      
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({      
        id, 
        title, 
        cost, 
        count: 1
      });
    }
  }
}

function renderCart(){
  modalBody.textContent = '';

  cart.forEach(function({ id, title, cost, count }){    
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin', itemCart);
    localStorage.setItem(login, JSON.stringify(cart));
  });

  const totalPrice = cart.reduce( (res, item) => res + (parseFloat(item.cost) * item.count), 0);
  modalPrice.textContent = `${totalPrice} ₽`;
}

function changeCount(event){
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id;
    })
    
    if (target.classList.contains('counter-minus')) {
      food.count--;
      if(food.count === 0) {
        cart.splice(cart.indexOf(food),1);
      }
    }
    if (target.classList.contains('counter-plus')) food.count++;

    renderCart();
  } 

}

function init() {
  getData(GET_RESTAURANTS_URL).then(function(data){
    data.forEach(createCardRestaurant);
  })

  authBtn.addEventListener('click', toggleAuthModal);

  authCloseBtn.addEventListener('click', toggleAuthModal);

  cardsMenu.addEventListener('click', addToCart);

  cartButton.addEventListener("click",function(){
    renderCart();
    toggleModal();
  });

  modalBody.addEventListener('click', changeCount);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);
  
  clearCart.addEventListener('click', function(){
    cart.length = 0;
    renderCart();
  });

  logo.addEventListener('click', returnMain);

  inputSearch.addEventListener('keydown', function(event){
    if(event.keyCode === 13){
      const target = event.target;
      const value = target.value.toLowerCase().trim();
      const goods = [];

      target.value = '';

      if (!value || value.length < 2) {
        target.style.backgroundColor = 'tomato';
        setTimeout(function(){
          target.style.backgroundColor = '';
        }, 2000);
        return;
      }      

      getData(GET_RESTAURANTS_URL)
        .then(function(data){
          const products = data.map((el) => el.products);
        
          products.forEach(function(product){
            getData(`./db/${product}`)
              .then(function(data){
                goods.push(...data);
                const searchGoods = goods.filter(function(item){
                    return item.name.toLowerCase().includes(value);
                });
                console.log('goods: ', goods);
                goodsHeader.textContent = '';    
                cardsMenu.textContent = '';
                containerPromo.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                return searchGoods;
              })
              .then(function(data){
                console.log('data: ', data.length);
                data.forEach(createCardGood);
                goodsHeader.insertAdjacentHTML('afterbegin', `<h2 class="section-title restaurant-title">${data.length > 0 ? "Результат поиска" : "Ничего не найдено"}</h2>`);    
              })
          });

        });
    }
  });

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
  });
}

init();
