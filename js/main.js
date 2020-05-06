const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}


const authBtn = document.querySelector('.button-auth');
const authModal = document.querySelector('.modal-auth');
const authCloseBtn = document.querySelector('.close-auth');


authBtn.addEventListener('click', toggleAuthModal);
authCloseBtn.addEventListener('click', toggleAuthModal);

function toggleAuthModal() {
  authModal.classList.toggle('is-open');
}

const logInForm = document.querySelector('#logInForm');
const loginInp = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonLogin = document.querySelector('.button-login');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');

checkAuth();

function checkAuth() {
  if(login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function authorized() {
  console.log('Authorized');

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

function notAuthorized(params) {
  console.log('Not authorized');

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