const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SETTINGS_STORAGE_KEY = "capstoneUserSettings";

const form = document.getElementById("settingsForm");
const displayNameInput = document.getElementById("displayName");
const emailInput = document.getElementById("email");
const themeInput = document.getElementById("theme");
const emailNotificationsInput = document.getElementById("emailNotifications");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const formSuccess = document.getElementById("formSuccess");

const fieldErrors = {
  displayName: document.getElementById("displayNameError"),
  email: document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
  confirmPassword: document.getElementById("confirmPasswordError"),
};

function setFieldError(fieldName, message) {
  const input = form.elements[fieldName];
  const errorElement = fieldErrors[fieldName];

  if (errorElement) {
    errorElement.textContent = message;
  }

  if (input) {
    input.classList.toggle("invalid", Boolean(message));
  }
}

function clearErrors() {
  Object.keys(fieldErrors).forEach((fieldName) => {
    setFieldError(fieldName, "");
  });
  formSuccess.textContent = "";
}

function validateSettings(values) {
  const errors = {};
  const displayName = values.displayName.trim();
  const email = values.email.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!displayName) {
    errors.displayName = "Display name is required.";
  } else if (displayName.length < 2) {
    errors.displayName = "Display name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (password || confirmPassword) {
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}

function loadSavedSettings() {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!savedSettings) {
      return;
    }

    const settings = JSON.parse(savedSettings);
    displayNameInput.value = settings.displayName || "";
    emailInput.value = settings.email || "";
    themeInput.value = settings.theme || "system";
    emailNotificationsInput.checked = Boolean(settings.emailNotifications);
  } catch (error) {
    console.warn("Could not load saved settings.", error);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const values = {
    displayName: displayNameInput.value,
    email: emailInput.value,
    theme: themeInput.value,
    emailNotifications: emailNotificationsInput.checked,
    password: passwordInput.value,
    confirmPassword: confirmPasswordInput.value,
  };

  const errors = validateSettings(values);
  const errorFields = Object.keys(errors);

  if (errorFields.length > 0) {
    errorFields.forEach((fieldName) => {
      setFieldError(fieldName, errors[fieldName]);
    });
    return;
  }

  const settingsToSave = {
    displayName: values.displayName.trim(),
    email: values.email.trim(),
    theme: values.theme,
    emailNotifications: values.emailNotifications,
  };

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
  passwordInput.value = "";
  confirmPasswordInput.value = "";
  formSuccess.textContent = "Settings saved.";
});

loadSavedSettings();
