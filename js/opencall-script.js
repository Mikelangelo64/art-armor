document.addEventListener('DOMContentLoaded', function () {
  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    document.querySelector('body').classList.add('v-mobile');
    document.querySelector('html').classList.add('v-mobile');
    document.body.style.setProperty('--mobile', `none`);
  } else {
    document.querySelector('body').classList.add('v-desk');
    document.querySelector('html').classList.add('v-desk');
    document.body.style.setProperty('--mobile', `block`);
  }

  //normal vh
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    if (vh === window.innerHeight * 0.01 || document.body.clientWidth < 900) {
      return;
    }

    vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  });

  //popup
  const makeTimelinePopup = (item) => {
    const popupInner = item.querySelector('.popup-opencall__scroll');
    if (!popupInner) {
      return;
    }

    const timelinePopup = gsap.timeline({
      defaults: { duration: 0.3, ease: 'power4.inOut' },
    });
    timelinePopup
      .from(item, { display: 'none' })
      .to(item, { display: 'flex', duration: 0.01 })
      .from(item, { opacity: 0 })
      .to(item, { opacity: 1 });

    return timelinePopup;
  };

  const popupAnimations = {};
  const popups = document.querySelectorAll('.popup-opencall');

  if (popups.length !== 0) {
    popups.forEach((popup) => {
      const timeline = makeTimelinePopup(popup);
      timeline.pause();
      popupAnimations[popup.dataset.popupname] = timeline;
    });
  }

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);

    //console.log(popupAnimations, popupClass, evt.target);
    popupAnimations[popupClass].play();

    popup.classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  if (popupOpenBtns.length !== 0) {
    popupOpenBtns.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        openPopup(evt);
      });
    });
  }

  //close popup
  const popupCloseBtns = document.querySelectorAll('.popup-opencall__close');
  const popupArr = document.querySelectorAll('.popup-opencall');

  const closePopup = (popup) => {
    popup.classList.remove('_opened');
    const popupClass = popup.dataset.popupname;
    //console.dir(popup);
    popupAnimations[popupClass].reverse();

    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');
  };

  if (popupCloseBtns) {
    Array.from(popupCloseBtns).forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup = this.parentElement.parentElement.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr) {
    Array.from(popupArr).forEach((popup) => {
      const wrapper = popup.querySelector('.popup-opencall__wrapper');
      if (!wrapper) {
        return;
      }

      const listener = (event) => {
        if (!wrapper.contains(event.target) && event.which === 1) {
          closePopup(popup);
        }
      };

      document.addEventListener('mousedown', listener);
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        const popup = document.querySelector('.popup-opencall._opened');
        if (popup) {
          closePopup(popup);
        }
      }
    });
  }

  //select
  //select input data in hidden input
  const inputData = (data, input, button) => {
    input.value = data;
    button.innerHTML = data;
  };

  //select init
  const selectArr = document.querySelectorAll('.select');

  if (selectArr.length !== 0) {
    selectArr.forEach((select) => {
      const button = select.querySelector('.select-button');
      const popup = select.querySelector('.select-popup ');
      const inputHidden = select.querySelector('input[type=hidden]');

      if (!button || !popup || !inputHidden) {
        return;
      }

      const buttonText = button.querySelector('.select-button__text');
      if (!buttonText) {
        return;
      }

      const optionalArr = popup.querySelectorAll('.select-popup__item');
      if (optionalArr.length === 0) {
        return;
      }

      //close select when click on something else except select
      const listener = (evt) => {
        if (
          !popup.contains(evt.target) &&
          popup.classList.contains('visible') &&
          evt.target !== button &&
          evt.which === 1
        ) {
          popup.classList.toggle('visible');
        }
      };

      document.addEventListener('mousedown', listener);

      //button open/close select
      button.addEventListener('click', (evt) => {
        evt.preventDefault();
        popup.classList.toggle('visible');
      });

      //input data from select list
      optionalArr.forEach((optional) => {
        optional.addEventListener('click', (evt) => {
          evt.preventDefault();
          const data = evt.target.dataset.month;
          inputData(data, inputHidden, buttonText);
          popup.classList.remove('visible');
        });
      });
    });
  }
});
