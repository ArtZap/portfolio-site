// Быстрая обертка DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    /* 1. Галерея с попапом */
    const galleryImgs = document.querySelectorAll('.gallery img');
    const imgPopup = document.getElementById('img-popup');
    const popupImg = imgPopup.querySelector('img');
    const arrows = { left: imgPopup.querySelector('.nav-arrow.left'), right: imgPopup.querySelector('.nav-arrow.right') };
    let currentIndex = 0;
  
    function updatePopup() {
      popupImg.src = galleryImgs[currentIndex].src;
      arrows.left.classList.toggle('hidden', currentIndex === 0);
      arrows.right.classList.toggle('hidden', currentIndex === galleryImgs.length - 1);
    }
  
    galleryImgs.forEach((img, idx) => img.addEventListener('click', () => {
      currentIndex = idx;
      updatePopup();
      imgPopup.classList.add('active');
    }));
  
    imgPopup.querySelector('.close-popup').addEventListener('click', () => imgPopup.classList.remove('active'));
    arrows.left.addEventListener('click', () => { currentIndex--; updatePopup(); });
    arrows.right.addEventListener('click', () => { currentIndex++; updatePopup(); });
  
    /* 2 & 3 & 4. Форма обратной связи */
    const feedbackBtn = document.getElementById('open-feedback');
    const feedbackPopup = document.getElementById('feedback-popup');
    const form = document.getElementById('feedback-form');
    const submitBtn = document.getElementById('submit-btn');
  
    feedbackBtn.addEventListener('click', () => feedbackPopup.classList.add('active'));
    feedbackPopup.querySelector('.close-popup').addEventListener('click', () => feedbackPopup.classList.remove('active'));
  
    function validateField(field) {
      const val = field.value.trim();
      if (!val) return false;
      if (field.name === 'phone') return /^\+?\d{7,15}$/.test(val);
      if (field.name === 'email') return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(val);
      if (field.name === 'message') return /^[A-Za-zА-Яа-я0-9\s.,!?]+$/.test(val);
      return true;
    }
  
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      [...form.elements].forEach(field => {
        if (field.required && !validateField(field)) {
          field.style.borderColor = 'red';
          valid = false;
        } else {
          field.style.borderColor = '#ccc';
        }
      });
      if (!valid) return;
  
      submitBtn.classList.add('sending');
      submitBtn.textContent = 'Отправляем...';
      submitBtn.disabled = true;
  
      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(res => {
          if (res.ok) {
            submitBtn.classList.remove('sending');
            submitBtn.classList.add('success');
            submitBtn.textContent = 'Успешно отправлено';
          } else throw new Error('Ошибка');
        })
        .catch(() => {
          submitBtn.classList.remove('sending');
          submitBtn.textContent = 'Ошибка отправки';
          submitBtn.disabled = false;
        });
    });
  
    /* 5. Попап через 30 сек */
    const promo = document.getElementById('promo-popup');
    const promoKey = 'promoClosed';
    if (!localStorage.getItem(promoKey)) {
      setTimeout(() => promo.classList.add('active'), 30000);
    }
    promo.querySelector('.close-promo').addEventListener('click', () => {
      promo.classList.remove('active');
      localStorage.setItem(promoKey, 'true');
    });
  
    /* 6. Обратный отсчет */
    const timerEl = document.getElementById('timer');
    const targetDate = new Date('2025-06-25T00:00:00');
    function updateTimer() {
      const diff = targetDate - new Date();
      if (diff <= 0) { timerEl.textContent = 'Событие наступило!'; clearInterval(timerInterval); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      timerEl.textContent = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
  
    /* 7. Фиксированное меню */
    const header = document.getElementById('site-header');
    const hero = document.getElementById('hero');
    const observer = new IntersectionObserver(entries => {
      entries[0].isIntersecting
        ? header.classList.remove('fixed')
        : header.classList.add('fixed');
    }, { rootMargin: '-100px 0px 0px 0px' });
    observer.observe(hero);
  
    /* 8. Анимация SVG */
    const rocketPath = document.getElementById('rocket-path');
    document.addEventListener('scroll', () => {
      const len = rocketPath.getTotalLength();
      const scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      rocketPath.style.strokeDasharray = len;
      rocketPath.style.strokeDashoffset = len - len * scrollRatio;
    });
    document.addEventListener('mousemove', e => {
      const logo = document.getElementById('animated-logo');
      const x = (e.clientX / window.innerWidth) * 30 - 15;
      const y = (e.clientY / window.innerHeight) * 30 - 15;
      logo.style.transform = `translate(-50%, -50%) rotate(${x}deg)`;
    });
  });