// Find the page elements that JavaScript will use.
const questionInput = document.getElementById("question");
const tagSelect = document.getElementById("tag");
const prioritySelect = document.getElementById("priority");
const addButton = document.getElementById("add-button");
const copyButton = document.getElementById("copy-button");
const questionList = document.getElementById("question-list");
const copyMessage = document.getElementById("copy-message");

// Load saved questions, or start with an empty list.
const questions = JSON.parse(localStorage.getItem("questionQueue")) || [];

function saveQuestions() {
  localStorage.setItem("questionQueue", JSON.stringify(questions));
}

function renderQuestions() {
  questionList.replaceChildren();

  questions.forEach((question, index) => {
    const item = document.createElement("li");
    item.append(`${question.tag} (${question.priority}): ${question.text} `);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      questions.splice(index, 1);
      saveQuestions();
      renderQuestions();
    });

    item.append(deleteButton);
    questionList.append(item);
  });
}

addButton.addEventListener("click", () => {
  const text = questionInput.value.trim();

  if (text === "") {
    return;
  }

  questions.push({
    text: text,
    tag: tagSelect.value,
    priority: prioritySelect.value
  });

  saveQuestions();
  renderQuestions();
  questionInput.value = "";
});

copyButton.addEventListener("click", async () => {
  const priorities = ["High", "Medium", "Low"];
  const prompt = priorities
    .map((priority) => {
      const group = questions.filter((question) => question.priority === priority);
      if (group.length === 0) {
        return "";
      }

      const lines = group.map((question) => `[${question.tag}] ${question.text}`);
      return `${priority}:\n${lines.join("\n")}`;
    })
    .filter((group) => group !== "")
    .join("\n\n");

  copyMessage.hidden = false;

  if (prompt === "") {
    copyMessage.textContent = "No questions to copy.";
    return;
  }

  try {
    await navigator.clipboard.writeText(prompt);
    copyMessage.textContent = "Copied!";
  } catch {
    copyMessage.textContent = "Could not copy. Try again.";
  }
});

renderQuestions();