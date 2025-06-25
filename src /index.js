const feedbackList = document.getElementById('feedback-list');
const feedbackFormSection = document.getElementById('feedback-form-section');
const feedbackForm = document.getElementById('feedback-form');
const contentInput = document.getElementById('content');
const postFeedbackBtn = document.getElementById('post-feedback-btn');
const searchInput = document.getElementById('search-input');

const API_URL = 'http://localhost:3000/feedbacks';

// Load feedbacks on DOM load
document.addEventListener('DOMContentLoaded', fetchFeedbacks);

// Toggle form
postFeedbackBtn.addEventListener('click', () => {
  feedbackFormSection.style.display = feedbackFormSection.style.display === 'none' ? 'block' : 'none';
});

// Submit feedback
feedbackForm.addEventListener('submit', e => {
  e.preventDefault();
  const content = contentInput.value.trim();
  if (content) {
    const newFeedback = { content, likes: 0 };
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFeedback)
    })
      .then(res => res.json())
      .then(data => {
        renderFeedback(data);
        contentInput.value = '';
      });
  }
});

// Search feedback
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      feedbackList.innerHTML = '';
      data
        .filter(item => item.content.toLowerCase().includes(term))
        .forEach(renderFeedback);
    });
});

// Fetch and render all feedbacks
function fetchFeedbacks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      feedbackList.innerHTML = '';
      data.forEach(renderFeedback);
    });
}

// Render a single feedback
function renderFeedback(feedback) {
  const li = document.createElement('li');
  li.className = 'feedback-item';
  li.innerHTML = `
    <p>${feedback.content}</p>
    <div class="feedback-controls">
      <button class="thumbs-up">👍 ${feedback.likes}</button>
      <button class="delete-btn">🗑️ Delete</button>
    </div>
  `;

  const thumbsUpBtn = li.querySelector('.thumbs-up');
  const deleteBtn = li.querySelector('.delete-btn');

  // Like handler
  thumbsUpBtn.addEventListener('click', () => {
    feedback.likes++;
    fetch(`${API_URL}/${feedback.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: feedback.likes })
    }).then(() => {
      thumbsUpBtn.textContent = `👍 ${feedback.likes}`;
    });
  });

  // Delete handler
  deleteBtn.addEventListener('click', () => {
    fetch(`${API_URL}/${feedback.id}`, {
      method: 'DELETE'
    }).then(() => li.remove());
  });

  feedbackList.appendChild(li);
}
