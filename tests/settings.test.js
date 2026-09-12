const assert = require("node:assert/strict");
const {
  validateSettings,
  SETTINGS_STORAGE_KEY,
} = require("../public/js/settings.js");

function run(name, fn) {
  fn();
  console.log(`ok - ${name}`);
}

run("empty submission requires display name and email", () => {
  const result = validateSettings({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.displayName, "Display name is required.");
  assert.equal(result.errors.email, "Email is required.");
});

run("short display name is rejected", () => {
  const result = validateSettings({
    displayName: "A",
    email: "user@example.com",
    password: "",
    confirmPassword: "",
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.displayName,
    "Display name must be at least 2 characters."
  );
});

run("invalid email is rejected", () => {
  const result = validateSettings({
    displayName: "Ada",
    email: "not-an-email",
    password: "",
    confirmPassword: "",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.email, "Enter a valid email address.");
});

run("short password is rejected", () => {
  const result = validateSettings({
    displayName: "Ada Lovelace",
    email: "ada@example.com",
    password: "short",
    confirmPassword: "short",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.password, "Password must be at least 8 characters.");
});

run("password mismatch is rejected", () => {
  const result = validateSettings({
    displayName: "Ada Lovelace",
    email: "ada@example.com",
    password: "longenough",
    confirmPassword: "different1",
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.confirmPassword, "Passwords do not match.");
});

run("valid submission without password succeeds", () => {
  const result = validateSettings({
    displayName: " Ada Lovelace ",
    email: " ada@example.com ",
    password: "",
    confirmPassword: "",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.values.displayName, "Ada Lovelace");
  assert.equal(result.values.email, "ada@example.com");
  assert.equal(SETTINGS_STORAGE_KEY, "userSettings");
});

run("valid submission with matching password succeeds", () => {
  const result = validateSettings({
    displayName: "Ada Lovelace",
    email: "ada@example.com",
    password: "longenough",
    confirmPassword: "longenough",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

console.log("All settings validation checks passed.");
