(function() {
  'use strict';

  const form = document.getElementById('ticket-form');
  const avatarInput = document.getElementById('avatar');
  const avatarUpload = document.getElementById('avatar-upload');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarUploadText = document.getElementById('avatar-upload-text');
  const submitBtn = document.getElementById('submit-btn');
  const ticketSection = document.getElementById('ticket-section');
  const newTicketBtn = document.getElementById('new-ticket-btn');

  const ticketName = document.getElementById('ticket-name');
  const ticketFullname = document.getElementById('ticket-fullname');
  const ticketEmail = document.getElementById('ticket-email');
  const ticketGithub = document.getElementById('ticket-github');
  const ticketAvatar = document.getElementById('ticket-avatar');

  const MAX_FILE_SIZE = 500 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  let avatarFile = null;
  let avatarDataUrl = null;
  let formSubmitted = false;

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}-error`);
    if (input && errorEl) {
      input.setAttribute('aria-invalid', 'true');
      errorEl.innerHTML = '<span class="form-error-icon" aria-hidden="true"></span>' + message;
      errorEl.hidden = false;
    }
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`${inputId}-error`);
    if (input && errorEl) {
      input.removeAttribute('aria-invalid');
      errorEl.innerHTML = '';
      errorEl.hidden = true;
    }
  }

  function validateFullName(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Please enter your full name';
    }
    if (trimmed.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Please enter your email address';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  function validateGitHub(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Please enter your GitHub username';
    }
    if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
      return 'GitHub username can only contain letters, numbers, and hyphens';
    }
    return null;
  }

  function validateAvatar(file) {
    if (!file) {
      return 'Please upload an avatar';
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Avatar must be a JPG or PNG image';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Avatar must be less than 500KB';
    }
    return null;
  }

  function clearAllErrors() {
    ['fullname', 'email', 'github', 'avatar'].forEach(clearError);
  }

  function checkFormValidity() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const github = document.getElementById('github').value;

    const nameError = validateFullName(fullname);
    const emailError = validateEmail(email);
    const githubError = validateGitHub(github);
    const avatarError = validateAvatar(avatarFile);

    let isValid = true;

    if (nameError) {
      showError('fullname', nameError);
      isValid = false;
    } else {
      clearError('fullname');
    }

    if (emailError) {
      showError('email', emailError);
      isValid = false;
    } else {
      clearError('email');
    }

    if (githubError) {
      showError('github', githubError);
      isValid = false;
    } else {
      clearError('github');
    }

    if (avatarError) {
      showError('avatar', avatarError);
      isValid = false;
    } else {
      clearError('avatar');
    }

    return isValid;
  }

  function handleAvatarFile(file) {
    const error = validateAvatar(file);
    if (error) {
      showError('avatar', error);
      resetAvatarUpload();
      return false;
    }

    clearError('avatar');
    avatarFile = file;

    const reader = new FileReader();
    reader.onload = function(e) {
      avatarDataUrl = e.target.result;
      avatarPreview.src = avatarDataUrl;
      avatarPreview.hidden = false;
      avatarUpload.classList.add('has-avatar');
      avatarUploadText.textContent = file.name;
    };
    reader.readAsDataURL(file);

    return true;
  }

  function resetAvatarUpload() {
    avatarFile = null;
    avatarDataUrl = null;
    avatarPreview.src = '';
    avatarPreview.hidden = true;
    avatarUpload.classList.remove('has-avatar');
    avatarUploadText.textContent = 'Upload your photo (JPG or PNG, max size: 500KB).';
    avatarInput.value = '';
  }

  function generateTicket() {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const github = document.getElementById('github').value.trim();

    ticketName.textContent = fullname;
    ticketFullname.textContent = fullname;
    ticketEmail.textContent = email;
    ticketGithub.textContent = `@${github}`;
    ticketAvatar.src = avatarDataUrl;
    ticketAvatar.alt = `${fullname}'s avatar`;

    form.hidden = true;
    ticketSection.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    ticketSection.focus();
  }

  function resetForm() {
    form.reset();
    resetAvatarUpload();
    clearAllErrors();
    formSubmitted = false;
    ticketSection.hidden = true;
    form.hidden = false;
    document.getElementById('fullname').focus();
  }

  avatarUpload.addEventListener('click', (e) => {
    if (e.target !== avatarInput) {
      avatarInput.click();
    }
  });

  avatarUpload.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      avatarInput.click();
    }
  });

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleAvatarFile(file);
    }
  });

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    avatarUpload.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    avatarUpload.addEventListener(eventName, () => {
      avatarUpload.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    avatarUpload.addEventListener(eventName, () => {
      avatarUpload.classList.remove('drag-over');
    }, false);
  });

  avatarUpload.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      handleAvatarFile(file);
    }
  }, false);

  ['fullname', 'email', 'github'].forEach(fieldId => {
    const input = document.getElementById(fieldId);

    input.addEventListener('blur', () => {
      if (!formSubmitted) return;
      let error = null;
      switch (fieldId) {
        case 'fullname':
          error = validateFullName(input.value);
          break;
        case 'email':
          error = validateEmail(input.value);
          break;
        case 'github':
          error = validateGitHub(input.value);
          break;
      }
      if (error) {
        showError(fieldId, error);
      } else {
        clearError(fieldId);
      }
    });

    input.addEventListener('input', () => {
      if (!formSubmitted) return;
      if (input.getAttribute('aria-invalid') === 'true') {
        let error = null;
        switch (fieldId) {
          case 'fullname':
            error = validateFullName(input.value);
            break;
          case 'email':
            error = validateEmail(input.value);
            break;
          case 'github':
            error = validateGitHub(input.value);
            break;
        }
        if (!error) {
          clearError(fieldId);
        }
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!formSubmitted) {
      formSubmitted = true;
    }

    if (checkFormValidity()) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Generating...';

      setTimeout(() => {
        generateTicket();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate My Ticket';
      }, 500);
    } else {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  newTicketBtn.addEventListener('click', resetForm);

  document.getElementById('fullname').focus();
})();