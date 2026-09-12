const SETTINGS_STORAGE_KEY = "userSettings";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSettingsFormValues(formData) {
  return {
    displayName: String(formData.displayName || "").trim(),
    email: String(formData.email || "").trim(),
    password: String(formData.password || ""),
    confirmPassword: String(formData.confirmPassword || ""),
  };
}

function validateSettings(formData) {
  const values = getSettingsFormValues(formData);
  const errors = {};

  if (!values.displayName) {
    errors.displayName = "Display name is required.";
  } else if (values.displayName.length < 2) {
    errors.displayName = "Display name must be at least 2 characters.";
  }

  if (!values.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password) {
    if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  } else if (values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    values,
    errors,
  };
}

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return { displayName: "", email: "" };
    }

    const parsed = JSON.parse(raw);
    return {
      displayName: String(parsed.displayName || ""),
      email: String(parsed.email || ""),
    };
  } catch (error) {
    return { displayName: "", email: "" };
  }
}

function saveNonSensitiveSettings(values) {
  const settingsToStore = {
    displayName: values.displayName,
    email: values.email,
  };

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToStore));
}

const settingsApi = {
  SETTINGS_STORAGE_KEY,
  validateSettings,
  loadSavedSettings,
  saveNonSensitiveSettings,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = settingsApi;
}

if (typeof document !== "undefined") {
  const form = document.getElementById("settings-form");

  if (form) {
    const displayNameInput = document.getElementById("display-name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const statusElement = document.getElementById("form-status");

    const fieldMap = {
      displayName: {
        input: displayNameInput,
        error: document.getElementById("display-name-error"),
      },
      email: {
        input: emailInput,
        error: document.getElementById("email-error"),
      },
      password: {
        input: passwordInput,
        error: document.getElementById("password-error"),
      },
      confirmPassword: {
        input: confirmPasswordInput,
        error: document.getElementById("confirm-password-error"),
      },
    };

    function clearFieldErrors() {
      Object.values(fieldMap).forEach(({ input, error }) => {
        error.textContent = "";
        error.removeAttribute("role");
        input.removeAttribute("aria-invalid");
      });
    }

    function showFieldErrors(errors) {
      Object.entries(fieldMap).forEach(([fieldName, { input, error }]) => {
        if (errors[fieldName]) {
          error.textContent = errors[fieldName];
          error.setAttribute("role", "alert");
          input.setAttribute("aria-invalid", "true");
        }
      });
    }

    function focusFirstInvalidField(errors) {
      const fieldOrder = ["displayName", "email", "password", "confirmPassword"];
      const firstInvalid = fieldOrder.find((fieldName) => errors[fieldName]);
      if (firstInvalid) {
        fieldMap[firstInvalid].input.focus();
      }
    }

    function populateForm() {
      const saved = loadSavedSettings();
      displayNameInput.value = saved.displayName;
      emailInput.value = saved.email;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      statusElement.textContent = "";
      statusElement.classList.remove("success");
      clearFieldErrors();

      const result = validateSettings({
        displayName: displayNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
      });

      if (!result.isValid) {
        showFieldErrors(result.errors);
        focusFirstInvalidField(result.errors);
        return;
      }

      saveNonSensitiveSettings(result.values);
      passwordInput.value = "";
      confirmPasswordInput.value = "";
      statusElement.classList.add("success");
      statusElement.textContent = "Settings saved successfully.";
      statusElement.focus();
    });

    populateForm();
  }
}
