const form = document.getElementById("name-form");
const loginScreen = document.getElementById("login-screen");
const choiceScreen = document.getElementById("choice-screen");
const userName = document.getElementById("user-name");

if (form && loginScreen && choiceScreen && userName) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.getElementById("name");
    const nameValue = input && input.value ? input.value.trim() : "";

    userName.textContent = nameValue || "Visitor";
    loginScreen.classList.add("hidden");
    choiceScreen.classList.remove("hidden");
    document.body.classList.add("red-mode");
  });
}
