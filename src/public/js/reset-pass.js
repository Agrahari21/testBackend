const form = document.getElementById("form");
const messageTag = document.getElementById("message");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const notification = document.getElementById("notification");
const submitBtn = document.getElementById("submit");
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:',.<>?])[a-zA-Z\d!@#$%^&*()_+\-=[\]{}|;:',.<>?]{8,}$/;

form.style.display = "none";
let token, id;
window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  //console.log(params);
  token = params.token;
  id = params.id;

  const res = await fetch("/auth/verify-pass-reset-token", {
    method: "POST",
    body: JSON.stringify({ id, token }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const { message } = await res.json();
    messageTag.innerText = message;
    messageTag.classList.add("error");
    return;
  }
  messageTag.style.display = "none";
  form.style.display = "block";
});

const displayNotification = (message, type) => {
  notification.style.display = "block";
  notification.innerText = message;
  notification.classList.add(type);
};

const handleSubmit = async (evt) => {
  evt.preventDefault();
  //validate
  if (!passwordRegex.test(password.value)) {
    //if (!password.value.trim()) {
    return displayNotification(
      "Invalid Password use alpha numeric and special characters",
      "error"
    );
  }
  if (password.value !== confirmPassword.value) {
    return displayNotification("Password do not match!", "error");
  }
  //submit form
  submitBtn.disabled = true;
  submitBtn.innerText = "Please wait..";

  const res = await fetch("/auth/reset-pass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id, token, password: password.value }),
  });

  submitBtn.disabled = false;
  submitBtn.innerText = "Update Password";

  if (!res.ok) {
    const { message } = await res.json();
    return displayNotification(message, "error");
  }
  messageTag.style.display = "block";
  messageTag.innerText = "Your Password updated successfully";
  form.style.display = "none";
};
form.addEventListener("submit", handleSubmit);
