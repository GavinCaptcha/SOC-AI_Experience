const form = document.getElementById("name-form");
const loginScreen = document.getElementById("login-screen");
const choiceScreen = document.getElementById("choice-screen");
const userName = document.getElementById("user-name");
const animatedTerm = document.getElementById("animated-term");
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
  document.body.style.setProperty("--knowledge-progress", String(safeMana / maxMana));

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

if (animatedTerm) {
  const terms = ["AI?", "LLMs?", "Artificial Intelligence?", "ChatGPT?", "Claude?"];
  let termIndex = 1;
  let charIndex = terms[0].length;
  let isDeleting = true;

  function tickTyping() {
    const currentTerm = terms[termIndex];

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
      animatedTerm.textContent = currentTerm.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        termIndex = (termIndex + 1) % terms.length;
        window.setTimeout(tickTyping, 320);
        return;
      }
      window.setTimeout(tickTyping, 80);
      return;
    }

    const nextTerm = terms[termIndex];
    charIndex = Math.min(nextTerm.length, charIndex + 1);
    animatedTerm.textContent = nextTerm.slice(0, charIndex);
    if (charIndex === nextTerm.length) {
      isDeleting = true;
      window.setTimeout(tickTyping, 950);
      return;
    }
    window.setTimeout(tickTyping, 95);
  }

  window.setTimeout(tickTyping, 800);
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
