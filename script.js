const form = document.getElementById("name-form");
const loginScreen = document.getElementById("login-screen");
const choiceScreen = document.getElementById("choice-screen");
const nameInput = document.getElementById("chat-name");
const submitButton = document.getElementById("chat-submit");
const introThread = document.getElementById("intro-thread");
const knowledgeFill = document.getElementById("knowledge-fill");
const topicProgressSlots = Array.from(document.querySelectorAll(".topic-slot.progress-box"));
const fifthPath = document.getElementById("fifth-path");
const journeyNote = document.getElementById("journey-note");
const learnAtmosphere = document.querySelector(".learn-atmosphere");
const journeyThread = document.getElementById("journey-thread");
const journeyForm = document.getElementById("journey-form");
const journeyInput = document.getElementById("journey-input");
const journeySelection = document.getElementById("journey-selection");
const splitExplore = document.getElementById("split-explore");
const backToJourneyChat = document.getElementById("back-to-journey-chat");
const splitModuleCollected = document.getElementById("split-module-collected");
const splitModuleQuotes = document.getElementById("split-module-quotes");
const splitModuleRefined = document.getElementById("split-module-refined");
const splitNavHint = document.getElementById("split-nav-hint");
const exampleThread = document.getElementById("example-thread");
const exampleTabs = Array.from(document.querySelectorAll(".example-tab"));
const finalInsightModal = document.getElementById("final-insight-modal");
const finalInsightConclusion = document.getElementById("final-insight-conclusion");
const finalInsightClose = document.getElementById("final-insight-close");
const finalInsightBackdrop = document.getElementById("final-insight-backdrop");

const introMessages = [
  "Welcome to Gavin's Social Documentary.",
  "As AI becomes more and more prominent in the modern world. We as a people need to be spending more time better understanding how it impacts our society. With the speed and rate at which these programs are updated and tailored. It is up to us, the consumers, to define and develop better methods not only on how we use AI. But also develop a mechanism to better identify when we shouldn't use AI. I propose that to accomplish this, we need to all work together.",
  "In this experience, I will be presenting different perspectives I have gathered from Clarkson Professors. And outlining what they think about AI. In terms of academics, how they feel it affects the student body. As well as the impacts it has on the fields they research.",
  "To begin, please type your name in the chat."
];

let currentKnowledge = 0;
const maxKnowledge = 100;
/** Max knowledge points per professor topic (split across enter + 2 example tabs). */
const KNOWLEDGE_PER_TOPIC = 25;
/** @type {Record<string, { enter: boolean; ex1: boolean; ex2: boolean }>} */
const topicEngagement = {};
const TOPIC_CHUNK_WEIGHTS = { enter: 8, ex1: 9, ex2: 8 };

let journeyChatInitialized = false;
let currentSplitLabel = null;
let activeExampleId = "1";

/**
 * Example thread messages: plain `{ role, text }` or attachment `{ role, file: { name } }`.
 * @type {Record<string, Record<string, Array<{ role: string; text?: string; file?: { name: string } }>>>}
 */
const exampleConversationStore = {};

exampleConversationStore["Professor 1"] = {
  "1": [
    { role: "ai", text: "What can I help you with today?" },
    { role: "user", text: "I need you to find the solutions to all these homework problems." },
    { role: "user", file: { name: "Homework_Set_4.pdf" } },
    { role: "ai", text: "Absolutely! Let me take a look at the file and give you the answers." },
    {
      role: "ai",
      text: "Here are the solutions for every problem in your homework file, with full work shown for each:\n• Problem 1: …\n• Problem 2: …\n• Problem 3: …\n(and so on for the rest.)"
    }
  ],
  "2": [
    { role: "ai", text: "What can I help you with today?" },
    {
      role: "user",
      text: "I have this project that I need to finish, but I do not know how to properly build it. Can you take this instruction set and create it for me?"
    },
    { role: "ai", text: "Absolutely! Please upload the instructions and I will get started." },
    { role: "user", file: { name: "Project_Instructions.docx" } },
    { role: "ai", text: "I've built this from your instructions. Here's the completed project." },
    { role: "ai", file: { name: "Completed_Project.zip" } }
  ]
};

const moduleContent = {
  "Professor 1": {
    title: "Independent Skills",
    collected: `Many professors brought up the concern that AI has the potential to undermine a student's advancement of core skills. And that the access to any answers needed would halt their desire to challenge and question material. Creating a habitual cycle of asking questions and receiving answers without deploying any thought into the work itself.

Leading to students that could supply the work, but had no tangible understanding of the material. This was tied to professors' concerns with students entering the workforce. Artificial intelligence gives them the ability to get to the position. But robs them of the skills to reproduce the work without AI assistance.

This lines up with what students would traditionally believe professors' outlook on artificial intelligence in education. However, meeting in person provided me with an important context. They feel this way because they care for the students. Wanting them to grow and progress with their own minds. And view AI as a potential threat to students along their academic journey.`,
    quotes: [
      '"Well, I think there are a number of different levels of AI. You can think about something like Grammarly—that’s pretty low-level for most students because it’s really just working with existing language. And then there’s another level, which is generative AI, something that produces content from a prompt. What students are learning with AI is information without context. A good classroom involves a conversation between students and teacher that is somewhat equal. A student might say something incorrect, and the teacher responds by guiding them toward a better understanding." - Anthropology Professor',
      "\u201cI've always known that there are students getting help to do their own work. I encourage them to come get their help from me, but I know they also get it from their frat brothers, from the tutoring centers, from the web. So the idea of getting help on your homework is nothing new. And I kind of don’t care if the students are getting their help from AI. But if you can't understand it—if it came from some other source and not from the class—do you really understand it? And will you understand it enough to do the same task on the exam? \u201d - Computer Science Professor",
    ].join("\n\n"),
    refined: `Although professors expressed concern around students' use of AI. There were a few that expressed it was their responsibility to teach students how to effectively use AI. That it was an intellectual tool that needed to be handled with care. With one professor using carpentry as an example:

A beginner apprentice would not be sent to use the heavy machinery. They have not been fully trained, and are liable to hurt themselves. Much like a circular saw. It is an incredible tool. And can be used to make many wonderful creations. But it also has the power to take a user's finger off if they are not careful.

Artificial intelligence can be seen the same way. An incredible tool that can be used to create new and exciting things. But without the proper training, and the right precautions. A person is capable of doing irreparable damage to themselves.`,
  },
  "Professor 2": {
    title: "Healthy Use",
    collected: "Add key classroom observations, quotes, and source-backed findings for this topic here.",
    quotes: "Add professor quotes here — include name or department when you can.",
    refined: "Add synthesized insights and practical recommendations for encouraging healthy, intentional use of AI in academic work."
  },
  "Professor 3": {
    title: "The effects of AI on fields",
    collected: "Add key field observations, quotes, and source-backed findings for this topic here.",
    quotes: "Add professor quotes here — include name or department when you can.",
    refined: "Add synthesized insights and practical recommendations about how AI is changing the professor's research field."
  },
  "Professor 4": {
    title: "Future Implementation",
    collected: "Add key field observations, quotes, and source-backed findings for this topic here.",
    quotes: "Add professor quotes here — include name or department when you can.",
    refined: "Add synthesized insights and practical recommendations for how AI could be well incorporated into the field going forward."
  },
  "Final Insight": {
    title: "Final Insight",
    conclusion:
      "This project brought together Clarkson professors’ views on AI in academics and in their fields. Across topics, a recurring theme is balance: using AI as a tool without replacing the thinking, judgment, and skills students and professionals still need. Independent work, honest use of help, and clear expectations in courses and careers will shape whether AI supports learning or undermines it. As tools change, the conclusion that matters is collective—we define good use of AI by how we teach, assess, and model it in our own work."
  }
};

const topicAliases = [
  { key: "Professor 1", patterns: [/^1\b/, /\bindependent\b/i, /\bskills?\b/i] },
  { key: "Professor 2", patterns: [/^2\b/, /\bhealthy\b/i, /\buse\b/i] },
  { key: "Professor 3", patterns: [/^3\b/, /\beffects?\b/i, /\bfields?\b/i, /\bresearch\b/i] },
  { key: "Professor 4", patterns: [/^4\b/, /\bfuture\b/i, /\bimplementation\b/i] }
];

function ensureExampleStore(label) {
  if (!exampleConversationStore[label]) {
    exampleConversationStore[label] = { "1": [], "2": [] };
  }
}

function appendThreadMessage(container, text, kind) {
  if (!container) {
    return;
  }
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${kind}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function appendChatMessage(text, kind) {
  appendThreadMessage(introThread, text, kind);
}

/**
 * Renders a file-style attachment bubble in the example thread (emoji + filename).
 * @param {HTMLElement | null} container
 * @param {"user"|"ai"} role
 * @param {string} fileName
 */
function appendExampleFileBubble(container, role, fileName) {
  if (!container) {
    return;
  }
  const kind = role === "user" ? "user" : "ai";
  const safeName = String(fileName || "document").trim() || "document";
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${kind} file-attachment`;
  bubble.setAttribute(
    "aria-label",
    `${kind === "user" ? "You" : "Assistant"} sent a file: ${safeName}`
  );

  const row = document.createElement("div");
  row.className = "file-attachment-row";

  const icon = document.createElement("span");
  icon.className = "file-attachment-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "\u{1F4C1}";

  const meta = document.createElement("div");
  meta.className = "file-attachment-meta";

  const nameEl = document.createElement("span");
  nameEl.className = "file-attachment-name";
  nameEl.textContent = safeName;

  const hint = document.createElement("span");
  hint.className = "file-attachment-hint";
  hint.textContent = "File";

  meta.appendChild(nameEl);
  meta.appendChild(hint);
  row.appendChild(icon);
  row.appendChild(meta);
  bubble.appendChild(row);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function renderExampleThreadFromStore() {
  if (!exampleThread || !currentSplitLabel) {
    return;
  }
  ensureExampleStore(currentSplitLabel);
  const messages = exampleConversationStore[currentSplitLabel][activeExampleId] || [];
  exampleThread.replaceChildren();
  messages.forEach((m) => {
    const kind = m.role === "user" ? "user" : "ai";
    if (m.file && typeof m.file.name === "string") {
      appendExampleFileBubble(exampleThread, kind, m.file.name);
      return;
    }
    if (m.text != null && m.text !== "") {
      appendThreadMessage(exampleThread, m.text, kind);
    }
  });
}

function ensureTopicEngagement(label) {
  if (!topicEngagement[label]) {
    topicEngagement[label] = { enter: false, ex1: false, ex2: false };
  }
  return topicEngagement[label];
}

function topicPointsEarned(label) {
  const e = ensureTopicEngagement(label);
  let pts = 0;
  if (e.enter) pts += TOPIC_CHUNK_WEIGHTS.enter;
  if (e.ex1) pts += TOPIC_CHUNK_WEIGHTS.ex1;
  if (e.ex2) pts += TOPIC_CHUNK_WEIGHTS.ex2;
  return pts;
}

function tryAwardTopicChunk(label, chunk) {
  if (chunk !== "enter" && chunk !== "ex1" && chunk !== "ex2") {
    return;
  }
  const eng = ensureTopicEngagement(label);
  if (eng[chunk]) {
    return;
  }
  eng[chunk] = true;
  const amt = TOPIC_CHUNK_WEIGHTS[chunk];
  currentKnowledge = Math.min(currentKnowledge + amt, maxKnowledge);
  renderKnowledge();
  refreshTopicProgressSlot(label);
}

function refreshTopicProgressSlot(label) {
  const box = topicProgressSlots.find((b) => b.dataset.label === label);
  if (!box) {
    return;
  }
  const earned = topicPointsEarned(label);
  const statusEl = box.querySelector(".topic-slot-status");
  const iconEl = box.querySelector(".topic-slot-icon");
  if (earned >= KNOWLEDGE_PER_TOPIC) {
    box.classList.add("claimed");
    box.classList.remove("topic-slot--partial");
    if (statusEl) {
      statusEl.textContent = `Complete · +${KNOWLEDGE_PER_TOPIC} Knowledge`;
    }
    if (iconEl) {
      iconEl.textContent = "✓";
    }
  } else if (earned > 0) {
    box.classList.remove("claimed");
    box.classList.add("topic-slot--partial");
    if (statusEl) {
      statusEl.textContent = `Progress · +${earned}/${KNOWLEDGE_PER_TOPIC}`;
    }
    if (iconEl) {
      iconEl.textContent = "◐";
    }
  } else {
    box.classList.remove("claimed", "topic-slot--partial");
    if (statusEl) {
      statusEl.textContent = "Not visited yet";
    }
    if (iconEl) {
      iconEl.textContent = "○";
    }
  }
}

function setActiveExampleTab(id) {
  activeExampleId = id;
  exampleTabs.forEach((tab) => {
    const isActive = tab.dataset.exampleId === id;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  renderExampleThreadFromStore();
  if (currentSplitLabel && (id === "1" || id === "2")) {
    tryAwardTopicChunk(currentSplitLabel, `ex${id}`);
  }
}

function initJourneyChat(displayName) {
  if (journeyChatInitialized || !journeyThread) {
    return;
  }
  journeyChatInitialized = true;

  const introWrap = document.createElement("div");
  introWrap.className = "chat-bubble ai journey-intro-bubble";
  const titleEl = document.createElement("strong");
  titleEl.className = "journey-intro-title";
  titleEl.textContent = "Gavin's Social Documentary";
  introWrap.appendChild(titleEl);

  const p1 = document.createElement("p");
  p1.className = "journey-intro-p";
  p1.textContent = "Clarkson professors on AI in academics and in their fields.";
  introWrap.appendChild(p1);

  const p2 = document.createElement("p");
  p2.className = "journey-intro-p";
  const welcomePrefix = document.createTextNode("Welcome, ");
  const nameSpan = document.createElement("span");
  nameSpan.id = "user-name";
  nameSpan.textContent = displayName || "Visitor";
  const welcomeSuffix = document.createTextNode(
    ". Type 1–4 or a topic name below, then Send. In each topic, open Examples 1–2 for full Knowledge. Complete all four topics for Final Insight."
  );
  p2.appendChild(welcomePrefix);
  p2.appendChild(nameSpan);
  p2.appendChild(welcomeSuffix);
  introWrap.appendChild(p2);

  journeyThread.appendChild(introWrap);

  const hintTopics = document.createElement("div");
  hintTopics.className = "chat-bubble ai journey-guide-bubble";
  hintTopics.textContent =
    "1 · Independent Skills\n2 · Healthy Use\n3 · Effects of AI on fields\n4 · Future Implementation";
  journeyThread.appendChild(hintTopics);

  journeyThread.scrollTop = journeyThread.scrollHeight;
}

function splitViewGuideFirst() {
  return "Examples on the left, research notes on the right. Open Example 1 and Example 2 to earn the full Knowledge slice for this topic. Use Back to topic chat when finished.";
}

function splitViewGuideAgain() {
  return "Same layout as before. Use Back to topic chat when finished.";
}

function parseTopicInput(raw) {
  const t = raw.trim();
  if (!t) {
    return null;
  }
  const lower = t.toLowerCase();
  for (const { key, patterns } of topicAliases) {
    for (const re of patterns) {
      if (re.test(lower)) {
        return key;
      }
    }
  }
  if (lower.includes("final") && lower.includes("insight")) {
    return "Final Insight";
  }
  return null;
}

function showFinalInsightModal() {
  const content = moduleContent["Final Insight"];
  if (!content || !finalInsightModal || !finalInsightConclusion) {
    return;
  }
  finalInsightConclusion.textContent = content.conclusion ?? "";
  finalInsightModal.classList.remove("hidden");
  finalInsightModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("final-insight-open");
  if (finalInsightClose) {
    finalInsightClose.focus();
  }
}

function hideFinalInsightModal() {
  if (!finalInsightModal) {
    return;
  }
  finalInsightModal.classList.add("hidden");
  finalInsightModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("final-insight-open");
}

function showSplitView(label, options = {}) {
  if (label === "Final Insight") {
    return;
  }
  const content = moduleContent[label];
  if (!content || !splitExplore || !splitModuleCollected || !splitModuleRefined) {
    return;
  }

  const isRevisit = options.isRevisit === true;
  if (splitNavHint) {
    splitNavHint.textContent = isRevisit ? splitViewGuideAgain() : splitViewGuideFirst();
  }

  currentSplitLabel = label;
  ensureExampleStore(label);
  splitModuleCollected.textContent = content.collected;
  if (splitModuleQuotes) {
    splitModuleQuotes.textContent = content.quotes ?? "";
  }
  splitModuleRefined.textContent = content.refined;

  tryAwardTopicChunk(label, "enter");

  activeExampleId = "1";
  setActiveExampleTab("1");

  if (journeySelection) {
    journeySelection.classList.add("hidden");
  }
  splitExplore.classList.remove("hidden");
  splitExplore.setAttribute("aria-hidden", "false");
  document.body.classList.add("split-explore-open");
}

function hideSplitView() {
  if (splitExplore) {
    splitExplore.classList.add("hidden");
    splitExplore.setAttribute("aria-hidden", "true");
  }
  if (journeySelection) {
    journeySelection.classList.remove("hidden");
  }
  document.body.classList.remove("split-explore-open");
  currentSplitLabel = null;
}

function openTopic(label, userFacingLine) {
  if (label === "Final Insight") {
    if (fifthPath && fifthPath.disabled) {
      appendThreadMessage(
        journeyThread,
        "Final Insight is locked until each topic is complete: open the section and view Examples 1–2 (Topic list on the right).",
        "ai"
      );
      journeyThread.scrollTop = journeyThread.scrollHeight;
      return;
    }
    appendThreadMessage(journeyThread, userFacingLine, "user");
    appendThreadMessage(journeyThread, "Closing reflection — close the window when you’re done.", "ai");
    showFinalInsightModal();
    if (journeyNote) {
      journeyNote.textContent = "Final Insight is open — close the window when you’re done reading.";
    }
    journeyThread.scrollTop = journeyThread.scrollHeight;
    return;
  }

  const priorProgress = topicPointsEarned(label);

  appendThreadMessage(journeyThread, userFacingLine, "user");

  if (priorProgress > 0) {
    appendThreadMessage(journeyThread, splitViewGuideAgain(), "ai");
  } else {
    appendThreadMessage(journeyThread, splitViewGuideFirst(), "ai");
  }

  showSplitView(label, { isRevisit: priorProgress > 0 });

  if (journeyNote) {
    journeyNote.textContent = "Split view — use Back to topic chat when finished.";
  }
  journeyThread.scrollTop = journeyThread.scrollHeight;
}

function playIntroMessages() {
  if (!introThread) {
    return;
  }
  let delay = 280;
  introMessages.forEach((message, index) => {
    window.setTimeout(() => {
      appendChatMessage(message, "ai");
      if (index === introMessages.length - 1 && nameInput && submitButton) {
        nameInput.disabled = false;
        submitButton.disabled = false;
        nameInput.focus();
      }
    }, delay);
    delay += index === 0 ? 900 : 1800;
  });
}

function renderKnowledge() {
  const safe = Math.min(currentKnowledge, maxKnowledge);
  const ratio = safe / maxKnowledge;
  if (knowledgeFill) {
    knowledgeFill.style.height = `${safe}%`;
  }
  document.body.style.setProperty("--knowledge-progress", String(ratio));

  if (learnAtmosphere) {
    if (document.body.classList.contains("red-mode")) {
      learnAtmosphere.style.opacity = String(Math.min(0.52, ratio * 0.52));
    } else {
      learnAtmosphere.style.opacity = "0";
    }
  }

  if (safe >= maxKnowledge && fifthPath) {
    fifthPath.disabled = false;
    fifthPath.removeAttribute("aria-disabled");
    fifthPath.classList.remove("is-locked");
    const lockIcons = fifthPath.querySelector(".final-lock-icons");
    if (lockIcons) {
      lockIcons.classList.add("is-unlocked");
    }
    fifthPath.setAttribute(
      "aria-label",
      "Final Insight, unlocked. Click to open the conclusion."
    );
    if (journeyNote) {
      journeyNote.textContent = "All paths explored. Final Insight is ready.";
    }
  }
}

if (form && loginScreen && choiceScreen && nameInput) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameValue = nameInput.value.trim();
    appendChatMessage(nameValue || "Visitor", "user");

    window.setTimeout(() => {
      const displayName = nameValue || "Visitor";
      loginScreen.classList.add("hidden");
      choiceScreen.classList.remove("hidden");
      document.body.classList.add("red-mode");
      initJourneyChat(displayName);
      renderKnowledge();
      if (journeyInput) {
        journeyInput.focus();
      }
    }, 350);
  });
}

if (journeyForm && journeyInput && journeyThread) {
  journeyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = journeyInput.value;
    journeyInput.value = "";
    const label = parseTopicInput(raw);
    if (!label) {
      appendThreadMessage(
        journeyThread,
        "Try 1–4, a topic keyword, or Final Insight after all four are explored.",
        "ai"
      );
      journeyThread.scrollTop = journeyThread.scrollHeight;
      return;
    }
    if (label === "Final Insight") {
      openTopic("Final Insight", raw.trim() || "Final Insight");
      return;
    }
    const title = moduleContent[label]?.title || label;
    openTopic(label, raw.trim() || `Open ${title}`);
  });
}

exampleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.exampleId;
    if (!id) {
      return;
    }
    setActiveExampleTab(id);
  });
});

if (fifthPath) {
  fifthPath.addEventListener("click", () => {
    if (fifthPath.disabled) {
      return;
    }
    openTopic("Final Insight", "I'd like to open Final Insight.");
  });
}

if (backToJourneyChat) {
  backToJourneyChat.addEventListener("click", () => {
    hideSplitView();
    appendThreadMessage(journeyThread, "Back in chat — pick another topic below.", "ai");
    journeyThread.scrollTop = journeyThread.scrollHeight;
    if (journeyNote && currentKnowledge < maxKnowledge) {
      journeyNote.textContent =
        "Open topics from the chat; use Examples 1–2 in each topic for full Knowledge.";
    }
    if (journeyInput) {
      journeyInput.focus();
    }
  });
}

function onFinalInsightModalClose() {
  hideFinalInsightModal();
  if (journeyThread) {
    appendThreadMessage(journeyThread, "Conclusion closed — reopen with Final Insight below.", "ai");
    journeyThread.scrollTop = journeyThread.scrollHeight;
  }
  if (journeyInput) {
    journeyInput.focus();
  }
}

if (finalInsightClose) {
  finalInsightClose.addEventListener("click", onFinalInsightModalClose);
}

if (finalInsightBackdrop) {
  finalInsightBackdrop.addEventListener("click", onFinalInsightModalClose);
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  if (!finalInsightModal || finalInsightModal.classList.contains("hidden")) {
    return;
  }
  event.preventDefault();
  onFinalInsightModalClose();
});

/**
 * Add a line to an example transcript (e.g. bad AI interactions). Persists per topic + example slot.
 * @param {string} label — "Professor 1" … "Professor 4" or "Final Insight"
 * @param {string} exampleId — "1" | "2"
 * @param {"user"|"ai"} role
 * @param {string} text
 */
function addExampleMessage(label, exampleId, role, text) {
  ensureExampleStore(label);
  const r = role === "user" ? "user" : "ai";
  exampleConversationStore[label][exampleId].push({ role: r, text });
  if (currentSplitLabel === label && activeExampleId === String(exampleId)) {
    renderExampleThreadFromStore();
  }
}

/**
 * Add a file-attachment bubble (📁 + filename) to an example transcript.
 * @param {string} label
 * @param {string} exampleId — "1" | "2"
 * @param {"user"|"ai"} role
 * @param {string} fileName
 */
function addExampleFileMessage(label, exampleId, role, fileName) {
  ensureExampleStore(label);
  const r = role === "user" ? "user" : "ai";
  exampleConversationStore[label][exampleId].push({ role: r, file: { name: fileName } });
  if (currentSplitLabel === label && activeExampleId === String(exampleId)) {
    renderExampleThreadFromStore();
  }
}

window.addExampleMessage = addExampleMessage;
window.addExampleFileMessage = addExampleFileMessage;

playIntroMessages();
