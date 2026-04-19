const form = document.getElementById("name-form");
const loginScreen = document.getElementById("login-screen");
const choiceScreen = document.getElementById("choice-screen");
const nameInput = document.getElementById("chat-name");
const submitButton = document.getElementById("chat-submit");
const introThread = document.getElementById("intro-thread");
const knowledgeFill = document.getElementById("knowledge-fill");
const topicProgressSlots = Array.from(document.querySelectorAll(".topic-slot.progress-box"));
const fifthPath = document.getElementById("fifth-path");
const learnAtmosphere = document.querySelector(".learn-atmosphere");
const journeyThread = document.getElementById("journey-thread");
const journeyForm = document.getElementById("journey-form");
const journeyInput = document.getElementById("journey-input");
const journeySelection = document.getElementById("journey-selection");
const splitExplore = document.getElementById("split-explore");
const backToJourneyChat = document.getElementById("back-to-journey-chat");
const splitModuleCollected = document.getElementById("split-module-collected");
const splitModuleRefined = document.getElementById("split-module-refined");
const splitNavHint = document.getElementById("split-nav-hint");
const exampleThread = document.getElementById("example-thread");
const exampleTabs = Array.from(document.querySelectorAll(".example-tab"));
const finalInsightModal = document.getElementById("final-insight-modal");
const finalInsightConclusion = document.getElementById("final-insight-conclusion");
const finalInsightClose = document.getElementById("final-insight-close");
const finalInsightBackdrop = document.getElementById("final-insight-backdrop");

const introMessages = [
  "In this experience, I will be presenting different perspectives I have gathered from Clarkson professors. Refining and outlining their personal thoughts on AI. Firstly how they view its use among the student body. Secondly, how they would like to see students interacting with artificial intelligence. And finally, how they envision the future of their respective field will look with the implementation of AI.",
  "To begin, please type your name in the chat."
];

let currentKnowledge = 0;
const maxKnowledge = 75;
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
      text: "I have this project that I need to finish, but I do not know how to properly build it. Can you test my thoughts and understanding of the material? I want to strengthen my deep learning in this topic."
    },
    { role: "ai", text: "Absolutely! Let me see what kind of material we are working on. Then we can start learning in more detail." },
    { role: "user", text: "The project is focused on maps and queues. Can we start with those two topics first?" },
    { role: "ai", text: "Let's get started and tackle these topics together." }
  ]
};

exampleConversationStore["Professor 2"] = {
  "1": [
    { role: "user", text: "Here is all my homework for the class that I have. It is due tonight, can you give me all the answers." },
    { role: "user", file: { name: "Homework_Assignment.pdf" } },
    { role: "ai", text: "Sure! I can absolutely give you those answers. Would you like me to explain how I come to the conclusions?" },
    { role: "user", text: "No thanks, just give me the solutions and I'll worry about learning the concepts later." },
    { role: "ai", text: "Of course, here are all the solutions to the homework." },
    { role: "ai", file: { name: "Homework_Solutions.pdf" } }
  ],
  "2": [
    {
      role: "user",
      text: "In class we are covering the concept of divergence, but I am having a really hard time wrapping my head around the idea. Can you explain it to me in an uncomplicated way?"
    },
    {
      role: "ai",
      text: "Sure! Let me start by explaining the concept of divergence to you step by step. If you want, you could upload some work and I could take you through the process of solving problems."
    },
    { role: "user", text: "No thanks, I would like to get a firm understanding of the basics first." },
    { role: "ai", text: "Of course! Let's get started then." }
  ]
};

exampleConversationStore["Professor 3"] = {
  "1": [
    { role: "ai", text: "Welcome to FakeCo's company AI assistant. How can I help you with your work today?" },
    { role: "user", text: "I need to make a major push to the repository, and I am almost confident that everything works properly." },
    { role: "ai", text: "That is a valid concern. Would you like for me to take a look over the code and make any changes that would fix up the program?" },
    { role: "user", text: "Sure, go through and change what needs to be changed." },
    {
      role: "ai",
      text: "I attempted to change the program's structure, but ran into a few issues. The fix I tried to implement seemed to break the entire system. Would you like me to try again?"
    }
  ],
  "2": [
    { role: "ai", text: "Welcome to FakeCo's company AI assistant. How can I help you with your work today?" },
    {
      role: "user",
      text: "I have a main part of the program that I would like to push to the main repository. I am almost confident that everything works. Can you make the push?"
    },
    {
      role: "ai",
      text: "Sure I can push all materials to the repository! Would you like me to first go through and fix any potential problems that might arise?"
    },
    { role: "user", text: "No thank you, I am confident that if any problems arise I will be able to handle them on my own." }
  ]
};

const moduleContent = {
  "Professor 1": {
    title: "Independent Skills",
    collected: `Many professors brought up concerns that AI could potentially undermine a student's core skills. And that the access to any answers needed would halt their desire to challenge and question material. Creating a habitual cycle of asking questions and receiving answers without deploying any thought into the work itself.
This was tied to professors' concerns with students entering the workforce. Artificial intelligence gives them the ability to get to the position. But robs them of the skills to reproduce the work without AI assistance.

This lines up with what students would traditionally believe professors' outlook on artificial intelligence in education. However, meeting in person provided me with an important context. This feeling stems from a care for the students. They want to see their classes grow and learn. And understand the threat that AI poses to their academic journey.`,
    quotes: [
      '"What students are learning with AI is information without context. A good classroom involves a conversation between students and teacher that is somewhat equal. A student might say something incorrect, and the teacher responds by guiding them toward a better understanding." - Anthropology Professor',
      "\"I've always known that there are students getting help to do their own work. I encourage them to come get their help from me, but I know they also get it from their frat brothers, from the tutoring centers, from the web. So the idea of getting help on your homework is nothing new. And I kind of don't care if the students are getting their help from AI. But if you can't understand it—if it came from some other source and not from the class—do you really understand it?\" - Computer Science Professor",
    ].join("\n\n"),
    refined: `A few professors expressed that they feel it is their responsibility to teach students how to effectively use AI. That it was an intellectual tool that needed to be handled with care. One professor used a craft like carpentry as an example.

A beginner apprentice would not be sent to use the heavy machinery on their first day. They have not been fully trained, and are liable to hurt themselves. Take a circular saw as an example. It is an incredible tool. And can be used to make many wonderful creations. But it also has the power to take a user's finger off if they are not careful.

Artificial intelligence can be seen the same way. A tool that can be used to create new and exciting things. But without the proper training, and the right precautions. A person is capable of doing irreparable damage to themselves.`,
  },
  "Professor 2": {
    title: "Defining Healthy Use",
    collected: `Each professor interviewed had different definitions of "healthy" use of AI.

Claiming that it is very dependent on the students specific use. And that it ultimately fell upon the professor to teach students how to properly use AI. Incorporating it into a syllabus the same way a class would teach a program like solidworks. Allowing for hands-on practice, and the guidance of a faculty member.

In this way, a professor could better monitor a student's interaction with artificial intelligence. And supply them with guidance when needed. Creating a more coherent student-professor-AI dynamic.
One professor described using AI in a lab setting. The same way that medical facilities treat viral diseases. That AI had the potential to change the way that we learn for the worst. And should not be treated lightly, but with care and diligence.`,
    quotes: `“AI should be used cautiously and not replace human thinking. It should be treated more like a controlled research tool rather than something relied upon daily. There should be more awareness of its limitations and costs.” - Anthropology Professor

“Students should use AI to support learning, not replace it. They should first understand concepts manually, then use AI to improve efficiency. Judgment and verification are critical skills when using AI.” - Computer Science Professor`,
    refined: `These insights provide us with a good understanding of how professors view "healthy" use of AI. I believe that this shift in perspective among professors has a strong correlation with their field of study.

Professors with experience in social arts had a better understanding of the effects AI has on the population. And were more familiar with the negative influence it has on our civilization. Resulting in a more cynical and skeptical view of artificial intelligence. This was a concern of each professor. However their approach to fixing the issue varied. With some opting to remove it completely. And others would like to imagine how we might find a good medium.

So what is healthy use? It stems from a core understanding of artificial intelligence. Much like a power tool in a mechanics shop. You need to approach with an idea of the power it holds. Be comfortable with your skills and have clear boundaries of what and what not to ask of AI. It can be a blurry line, but the better you are at managing your use. The better you will be with any topic you are researching.

Using AI not as a solution to a problem. But as more of a blackboard, research article, or fellow classmate. Treating it as a tool for learning.

TIP:
In models like ChatGPT, you can customize the types of responses that you will be given. Taking the model away from solution based, to theory based. You can specifically tell you now to give you any answers. But instead  help guide you through the material.

Procedures like this will help steer away from the negative uses of AI.`
  },
  "Professor 3": {
    title: "Potential Effects AI has in their Field",
    collected: `In this section of the material, I will be talking more heavily on how professors view the use of AI in their fields of research. What are their concerns about its use? How would they like to see it be used? And what are the conditions that they feel need to be addressed to find balance between creativity and AI?

This section will help give a perspective on how professors view AI in general, rather than focused only on student interaction. It helps outline their views and thoughts, gives them the opportunity to discuss how they feel AI is affecting the field currently, and what they would like to see done with AI in the future.`,
    quotes: `“AI is like a tool (e.g., a circular saw). It increases productivity rather than replacing workers entirely. Jobs will change, and expertise will require understanding how to use AI tools effectively.
Many companies now require AI use and have standardized tools. AI is integrated into workflows but still requires human oversight and decision-making. It typically handles only a portion of tasks.” - Computer Science Professor

“In anthropology, we study AI in three ways: as a cultural artifact, as a research tool, and as something to critique. AI reveals something about its creators… a desire to avoid human interaction.” - Anthropology Professor

“AI has gone through multiple hype cycles and will continue to evolve. It will change industries, but not always in predictable ways. Understanding its capabilities and limitations is essential for adapting to future developments.” - Computer Science Professor`,
    refined: `How professors imagine AI could be properly implemented depends on field context, responsibility, and risk tolerance. The strongest shared theme is not total rejection or blind adoption, but conditions for responsible integration.

Professors describe AI as a tool that can increase efficiency while still requiring human judgment. In that model, AI should support analysis, drafting, and exploration, while humans remain accountable for interpretation, ethics, and decisions.

Across interviews, concerns about overdependence, shallow understanding, and loss of originality remain central. The preferred direction is balanced implementation: AI is used intentionally, with clear boundaries, and paired with domain expertise so creativity and rigor are not replaced.`
  },
  "Final Insight": {
    title: "Final Insight",
    conclusion:
      "Each topic in this project is a building block to one core question:\n\nWhat do professors define as productive use of AI? And what do they imagine their field would look like with AI implemented?\n\nThe first section covers what professors think about AI in academics: Independent Skills and Defining Healthy Use. The second section addresses AI in their fields: the Potential Effects AI has in their Field and how they imagine AI could be properly implemented.\n\nTogether, these perspectives show that professors are not offering one universal answer. They are defining boundaries, responsibilities, and conditions that can help students use AI productively without replacing the independent thinking education is meant to build."
  }
};

const topicAliases = [
  { key: "Professor 1", patterns: [/^1\b/, /\bindependent\b/i, /\bskills?\b/i] },
  { key: "Professor 2", patterns: [/^2\b/, /\bhealthy\b/i, /\buse\b/i] },
  { key: "Professor 3", patterns: [/^3\b/, /\bpotential\b/i, /\beffects?\b/i, /\bfield\b/i, /\bimplemented?\b/i] }
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

  const nameForEnjoy = (displayName || "Visitor").trim() || "Visitor";

  const introWrap = document.createElement("div");
  introWrap.className = "chat-bubble ai journey-intro-bubble";

  const headline = document.createElement("p");
  headline.className = "journey-intro-headline";
  headline.textContent =
    "Hello! And welcome to Gavin's social documentary, A View from the other Side of the Imaginary Fence: How do professors view AI?";
  introWrap.appendChild(headline);

  const pNav = document.createElement("p");
  pNav.className = "journey-intro-p";
  pNav.textContent =
    "This page is dedicated to the exploration and presentation of the material. Each topic is a building block to one question: What do professors define as productive use of AI? And what do they imagine their field would look like with AI implemented?";
  introWrap.appendChild(pNav);

  const pEnjoy = document.createElement("p");
  pEnjoy.className = "journey-intro-p";
  pEnjoy.textContent = `Please enjoy, ${nameForEnjoy}!`;
  introWrap.appendChild(pEnjoy);

  journeyThread.appendChild(introWrap);

  const hintTopics = document.createElement("div");
  hintTopics.className = "chat-bubble ai journey-guide-bubble";
  hintTopics.textContent =
    "Please select the topic that you would like to explore:\n1. Independent Skills\n2. Defining Healthy Use\n3. Potential Effects AI has in their Field";
  journeyThread.appendChild(hintTopics);

  journeyThread.scrollTop = journeyThread.scrollHeight;
}

function splitViewGuideFirst() {
  return "Examples on the left, research notes on the right. Open Example of bad use and Example of good use to earn the full Knowledge slice for this topic. Use Back to topic chat when finished.";
}

function splitViewGuideAgain() {
  return "Same layout as before. Use Back to topic chat when finished.";
}

function renderCollectedPanel(content) {
  if (!splitModuleCollected || !content) {
    return;
  }

  splitModuleCollected.replaceChildren();
  const collectedBody = document.createElement("p");
  collectedBody.className = "split-collected-body";
  collectedBody.textContent = content.collected || "";
  splitModuleCollected.appendChild(collectedBody);

  const quoteText = String(content.quotes || "").trim();
  if (!quoteText) {
    return;
  }

  const label = document.createElement("p");
  label.className = "split-prof-quotes-label";
  label.textContent = "Profesor Qoutes";

  const quoteBody = document.createElement("p");
  quoteBody.className = "split-prof-quotes-body";
  quoteBody.textContent = quoteText;

  splitModuleCollected.appendChild(label);
  splitModuleCollected.appendChild(quoteBody);
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
  renderCollectedPanel(content);
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
        "Final Insight is locked until each topic is complete: open the section and view both example chats — bad use and good use (Topic list on the right).",
        "ai"
      );
      journeyThread.scrollTop = journeyThread.scrollHeight;
      return;
    }
    appendThreadMessage(journeyThread, userFacingLine, "user");
    appendThreadMessage(journeyThread, "Closing reflection — close the window when you’re done.", "ai");
    showFinalInsightModal();
    journeyThread.scrollTop = journeyThread.scrollHeight;
    return;
  }

  const priorProgress = topicPointsEarned(label);

  appendThreadMessage(journeyThread, userFacingLine, "user");

  showSplitView(label, { isRevisit: priorProgress > 0 });

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
    knowledgeFill.style.height = `${Math.max(0, Math.min(100, ratio * 100))}%`;
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
        "Try 1–3, a topic keyword, or Final Insight after all three are explored.",
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
    appendThreadMessage(journeyThread, "Welcome back to chat!", "ai");
    appendThreadMessage(
      journeyThread,
      "Please select which topic you would like to view next (1-3). And view all to unlock the final insight.",
      "ai"
    );
    journeyThread.scrollTop = journeyThread.scrollHeight;
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
 * @param {string} label — "Professor 1" … "Professor 3" or "Final Insight"
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
