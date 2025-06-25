// Wait for DOM content to fully load
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const feedbackList = document.getElementById("feedback-list");
  const searchInput = document.getElementById("search-input");

  // Feedback storage
  let feedbacks = [];

  // 1. Handle new feedback submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = document.getElementById("content").value.trim();
    if (content === "") return;

    const feedback = {
      id: Date.now(), // unique ID
      content,
      likes: 0
    };

    feedbacks.push(feedback);
    renderFeedback(feedback);
    form.reset();
  });

  // 2. Handle thumbs up and delete buttons
  feedbackList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    const id = Number(li?.dataset.id);

    if (e.target.classList.contains("thumbs-up")) {
      const fb = feedbacks.find((f) => f.id === id);
      fb.likes++;
      li.querySelector(".likes").textContent = `👍 ${fb.likes}`;
    }

    if (e.target.classList.contains("delete-btn")) {
      feedbacks = feedbacks.filter((f) => f.id !== id);
      li.remove();
    }
  });

  // 3. Handle search filtering
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const items = feedbackList.querySelectorAll("li");

    items.forEach((li) => {
      const content = li.querySelector("p").textContent.toLowerCase();
      li.style.display = content.includes(query) ? "block" : "none";
    });
  });

  // Function to render a single feedback
  function renderFeedback(feedback) {
    const li = document.createElement("li");
    li.className = "feedback-item";
    li.dataset.id = feedback.id;

    li.innerHTML = `
      <p>${feedback.content}</p>
      <div class="feedback-controls">
        <span class="likes">👍 ${feedback.likes}</span>
        <button class="thumbs-up">Thumbs Up</button>
        <button class="delete-btn">🗑️ Delete</button>
      </div>
    `;

    feedbackList.appendChild(li);
  }
});
