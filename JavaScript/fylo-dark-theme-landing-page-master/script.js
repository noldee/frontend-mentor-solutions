document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("email-form");
  const emailInput = document.getElementById("email");
  const inputGroup = emailInput.parentElement;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValue = emailInput.value.trim();

    if (emailValue === "" || !emailRegex.test(emailValue)) {
      inputGroup.classList.add("error");
    } else {
      inputGroup.classList.remove("error");
      alert("¡Gracias por registrarte!");
      emailInput.value = "";
    }
  });

  emailInput.addEventListener("input", () => {
    if (inputGroup.classList.contains("error")) {
      inputGroup.classList.remove("error");
    }
  });
});
