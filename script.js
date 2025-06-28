document.addEventListener("DOMContentLoaded", () => {
  /* 2 & 3 & 4. Форма обратной связи */
  const feedbackBtn = document.getElementById("open-feedback");
  const feedbackPopup = document.getElementById("feedback-popup");
  const feedbackForm = document.getElementById("feedback-form-popup");
  const form = document.getElementById("feedback-form-popup");
  const submitBtn = document.getElementById("submit-btn");

  feedbackBtn.addEventListener("click", () =>
    feedbackPopup.classList.add("active")
  );

  feedbackPopup
    .querySelector(".close-popup")
    .addEventListener("click", () => feedbackPopup.classList.remove("active"));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && feedbackPopup.classList.contains("active")) {
      feedbackPopup.classList.remove("active");
    }
  });

  feedbackPopup.addEventListener("click", function (e) {
    if (!feedbackForm.contains(e.target)) {
      feedbackPopup.classList.remove("active");
    }
  });

  function validateField(field) {
    const val = field.value.trim();
    if (!val) return false;
    if (field.name === "phone") return /^\+?\d{7,15}$/.test(val);
    if (field.name === "email")
      return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(val);
    if (field.name === "message") return /^[A-Za-zА-Яа-я0-9\s.,!?]+$/.test(val);
    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    [...form.elements].forEach((field) => {
      if (field.required && !validateField(field)) {
        field.style.borderColor = "red";
        valid = false;
      } else {
        field.style.borderColor = "#ccc";
      }
    });
    if (!valid) return;

    submitBtn.classList.add("sending");
    submitBtn.textContent = "Отправляем...";
    submitBtn.disabled = true;

    fetch(form.action, { method: "POST", body: new FormData(form) })
      .then((res) => {
        if (res.ok) {
          submitBtn.classList.remove("sending");
          submitBtn.classList.add("success");
          submitBtn.textContent = "Успешно отправлено";
        } else throw new Error("Ошибка");
      })
      .catch(() => {
        submitBtn.classList.remove("sending");
        submitBtn.textContent = "Ошибка отправки";
        submitBtn.disabled = false;
      });
  });
  /* 8. Анимация SVG */
  const rocketPath = document.getElementById("rocket-path");
  document.addEventListener("scroll", () => {
    const len = rocketPath.getTotalLength();
    const scrollRatio =
      window.scrollY / (document.body.scrollHeight - window.innerHeight);
    rocketPath.style.strokeDasharray = len;
    rocketPath.style.strokeDashoffset = len - len * scrollRatio;
  });
  document.addEventListener("mousemove", (e) => {
    const logo = document.getElementById("animated-logo");
    const x = (e.clientX / window.innerWidth) * 30 - 15;
    logo.style.transform = `translate(-50%, -50%) rotate(${x}deg)`;
  });
});
