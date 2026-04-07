const form = document.getElementById("name-form");
const loginScreen = document.getElementById("login-screen");
const choiceScreen = document.getElementById("choice-screen");
const userName = document.getElementById("user-name");
const manaValue = document.getElementById("mana-value");
const manaFill = document.getElementById("mana-fill");
const progressBoxes = Array.from(document.querySelectorAll(".progress-box"));
const fifthPath = document.getElementById("fifth-path");
const journeyNote = document.getElementById("journey-note");

let currentMana = 0;
const maxMana = 100;

function renderMana() {
  const safeMana = Math.min(currentMana, maxMana);
  if (manaValue) {
    manaValue.textContent = String(safeMana);
  }
  if (manaFill) {
    manaFill.style.width = `${safeMana}%`;
  }

  if (safeMana >= maxMana && fifthPath) {
    fifthPath.classList.remove("hidden");
    if (journeyNote) {
      journeyNote.textContent = "Mana full. The final path is now unlocked.";
    }
  }
}

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

progressBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.classList.contains("claimed")) {
      return;
    }

    const manaGain = Number(box.dataset.mana || "0");
    currentMana += manaGain;
    box.classList.add("claimed");
    box.textContent = `${box.textContent} +${manaGain} Mana`;
    renderMana();
  });
});

if (fifthPath) {
  fifthPath.addEventListener("click", () => {
    if (journeyNote) {
      journeyNote.textContent = "You unlocked the final insight. Your journey continues.";
    }
  });
}
