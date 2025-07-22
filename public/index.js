function toggleOptions() {
    var options = document.getElementById("membershipOptions");
    options.style.display = (options.style.display === "block") ? "none" : "block";
  }
window.addEventListener('DOMContentLoaded', () => {
  fetch('/get-user-email')
    .then(response => response.json())
    .then(data => {
      if (data.email) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('userProfile').style.display = 'block';
        document.getElementById('userEmailText').textContent = data.email;
      }
    });

  // Toggle popup
  const userIcon = document.querySelector('.user-icon');
  const userPopup = document.getElementById('userPopup');

  userIcon?.addEventListener('click', () => {
    userPopup.style.display = userPopup.style.display === 'block' ? 'none' : 'block';
  });

  // Hide popup when clicking outside
  document.addEventListener('click', function (event) {
    if (!document.getElementById('userProfile').contains(event.target)) {
      userPopup.style.display = 'none';
    }
  });
});

// Logout function
function logoutUser() {
  fetch('/logout', {
    method: 'POST',
    credentials: 'same-origin'
  }).then(() => {
       window.location.href = 'login.html';
  });
}


let userEmail = null;

// On page load: get user email
fetch('/get-user-email')
  .then(res => res.json())
  .then(data => {
    userEmail = data.email || null;
    checkUserStatus();
  });

function checkUserStatus() {
  fetch('/get-notice')
    .then(res => res.json())
    .then(data => {
      const noticeText = document.getElementById('noticeText');
      const noticeInput = document.getElementById('noticeInput');
      const saveBtn = document.getElementById('saveNoticeBtn');

      noticeText.textContent = data.notice || "No notice yet.";

      // Show input and save button only if admin
      if (userEmail === 'aman0567shukla@gmail.com') {
        noticeInput.style.display = 'block';
        noticeInput.value = data.notice || "";
        saveBtn.style.display = 'block';
      }
    });
}

function toggleNoticePopup() {
  const popup = document.getElementById('noticePopup');
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

function saveNotice() {
  const noticeValue = document.getElementById('noticeInput').value;

  fetch('/set-notice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notice: noticeValue })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Notice updated!");
        document.getElementById('noticeText').textContent = noticeValue;
      } else {
        alert("Unauthorized or failed to update.");
      }
    });
}
