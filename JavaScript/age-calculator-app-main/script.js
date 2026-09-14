const form = document.getElementById('ageForm');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const dayWrapper = document.getElementById('dayWrapper');
const monthWrapper = document.getElementById('monthWrapper');
const yearWrapper = document.getElementById('yearWrapper');
const dayError = document.getElementById('dayError');
const monthError = document.getElementById('monthError');
const yearError = document.getElementById('yearError');
const resultYears = document.getElementById('resultYears');
const resultMonths = document.getElementById('resultMonths');
const resultDays = document.getElementById('resultDays');

function clearErrors() {
  [dayWrapper, monthWrapper, yearWrapper].forEach(w => w.classList.remove('error'));
  [dayError, monthError, yearError].forEach(e => e.textContent = '');
}

function setError(wrapper, errorEl, message) {
  wrapper.classList.add('error');
  errorEl.textContent = message;
}

function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function calculateAge(birthDay, birthMonth, birthYear) {
  const today = new Date();
  let years = today.getFullYear() - birthYear;
  let months = today.getMonth() - (birthMonth - 1);
  let days = today.getDate() - birthDay;

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function animateResult(element, targetValue) {
  const duration = 800;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(eased * targetValue);

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  const day = dayInput.value.trim();
  const month = monthInput.value.trim();
  const year = yearInput.value.trim();
  let hasError = false;

  if (!day) {
    setError(dayWrapper, dayError, 'This field is required');
    hasError = true;
  } else if (Number(day) < 1 || Number(day) > 31) {
    setError(dayWrapper, dayError, 'Must be a valid day');
    hasError = true;
  }

  if (!month) {
    setError(monthWrapper, monthError, 'This field is required');
    hasError = true;
  } else if (Number(month) < 1 || Number(month) > 12) {
    setError(monthWrapper, monthError, 'Must be a valid month');
    hasError = true;
  }

  if (!year) {
    setError(yearWrapper, yearError, 'This field is required');
    hasError = true;
  } else {
    const now = new Date();
    if (Number(year) > now.getFullYear()) {
      setError(yearWrapper, yearError, 'Must be in the past');
      hasError = true;
    }
  }

  if (!hasError) {
    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);

    if (!isValidDate(dayNum, monthNum, yearNum)) {
      if (!dayWrapper.classList.contains('error')) {
        setError(dayWrapper, dayError, 'Must be a valid date');
      }
      hasError = true;
    } else {
      const birthDate = new Date(yearNum, monthNum - 1, dayNum);
      const today = new Date();
      if (birthDate > today) {
        setError(yearWrapper, yearError, 'Must be in the past');
        hasError = true;
      }
    }
  }

  if (hasError) return;

  const age = calculateAge(Number(day), Number(month), Number(year));
  animateResult(resultYears, age.years);
  animateResult(resultMonths, age.months);
  animateResult(resultDays, age.days);
}

form.addEventListener('submit', handleSubmit);

[dayInput, monthInput, yearInput].forEach(input => {
  input.addEventListener('input', () => {
    const wrapper = input.closest('.input-wrapper');
    if (wrapper.classList.contains('error')) {
      wrapper.classList.remove('error');
      wrapper.querySelector('.error-message').textContent = '';
    }
  });
});
