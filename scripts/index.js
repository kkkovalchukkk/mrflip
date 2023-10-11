const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const overlayEl = document.querySelector('.overlay');
const formInOverlayEl = overlayEl.querySelector('form');
const closeBtnEl = overlayEl.querySelector('.overlay__close');
const toggleOverlayBtnEl = document.querySelector('.togglePopup');

const closeOverlayByClick = (e) => {
  if (e.target === overlayEl) {
    window.removeEventListener('click', closeOverlayByClick);
    overlayEl.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

const closeOverlayByClickEsc = (e) => {
  if (e.key === 'Escape') {
    window.removeEventListener('click', closeOverlayByClickEsc);
    overlayEl.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

toggleOverlayBtnEl.addEventListener('click', () => {
  document.querySelector('header').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  window.addEventListener('keydown', closeOverlayByClickEsc);
  window.addEventListener('click', closeOverlayByClick);
  overlayEl.classList.add('active');
  document.body.classList.add('no-scroll');
});

closeBtnEl.addEventListener('click', () => {
  window.removeEventListener('keydown', closeOverlayByClickEsc);
  window.removeEventListener('click', closeOverlayByClick);
  overlayEl.classList.remove('active');
  document.body.classList.remove('no-scroll');
});

const checkInput = (input) => input.value;

const addInputError = (input, errorClassName) =>
  input.classList.add(errorClassName);

const removeInputError = (input, errorClassName) =>
  input.classList.remove(errorClassName);

const validateForm = (cfg) => {
  const formEls = document.querySelectorAll(cfg.form);
  formEls &&
    formEls.forEach((form) => {
      const inputEls = form.querySelectorAll('input');
      const telInputEl = form.querySelector('input[type="tel"]');
      const emailInputEl = form.querySelector('input[type="email"]');

      telInputEl &&
        IMask(telInputEl, {
          mask: '+{7} (000) 000-00-00',
        });

      telInputEl &&
        telInputEl.addEventListener('input', () => {
          const l = telInputEl.value.length;
          if (l !== 18) {
            addInputError(telInputEl, 'error');
          } else {
            removeInputError(telInputEl, 'error');
          }
          if (emailRegex.test(emailInputEl.value)) {
            removeInputError(emailInputEl, 'error');
            removeInputError(telInputEl, 'error');
          }
        });

      emailInputEl &&
        emailInputEl.addEventListener('input', () => {
          if (!emailRegex.test(emailInputEl.value)) {
            addInputError(emailInputEl, 'error');
          } else {
            removeInputError(emailInputEl, 'error');
          }
          if (+telInputEl.value.length === 18) {
            removeInputError(emailInputEl, 'error');
            removeInputError(telInputEl, 'error');
          }
        });

      emailInputEl &&
        emailInputEl.addEventListener('keydown', (e) => {
          e.code === 'Space' && e.preventDefault();
        });
      telInputEl &&
        telInputEl.addEventListener('keydown', (e) => {
          e.code === 'Space' && e.preventDefault();
        });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        inputEls.forEach((input) => {
          if (!checkInput(input)) {
            addInputError(input, 'error');
          } else {
            removeInputError(input, 'error');
          }
        });

        if (!emailRegex.test(emailInputEl.value)) {
          addInputError(emailInputEl, 'error');
        } else {
          removeInputError(emailInputEl, 'error');
        }

        const l = telInputEl.value.length;
        if (l !== 18) {
          addInputError(telInputEl, 'error');
        } else {
          removeInputError(telInputEl, 'error');
        }

        if (Array.from(inputEls).some((inp) => inp.value)) {
          inputEls.forEach((inp) => inp.classList.remove('error'));
        }

        if (!form.querySelectorAll('.error').length) {
          const email = emailInputEl.value;
          const tel = telInputEl.value;

          const json = JSON.stringify({
            email: email,
            tel: tel,
          });
          console.log(json);
          fetch('https://api.mr-flip.ru/api/v1/new-buildings/user-data/set', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: json,
          }).then((res) => {
            if (res.ok) {
              overlayEl.classList.add('success');
            } else {
              overlayEl.classList.add('failed');
            }
          });
        }
      });
    });
};

validateForm({ form: '.overlay__form' });
