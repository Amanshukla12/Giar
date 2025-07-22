document.getElementById('submission-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const section = "General"; // or get from dropdown if added later
  const principalAuthor = document.getElementById('principal-author').value;
  const correspondingAuthor = document.getElementById('corresponding-author').value;
  const correspondingEmail = document.getElementById('corresponding-email').value;
  const manuscriptTitle = document.getElementById('manuscript-title').value;
  const manuscriptFile = document.getElementById('manuscript-file').files[0];
  const copyrightFile = document.getElementById('copyright-file').files[0];
  const message = document.getElementById('message').value;

  const formData = new FormData();
  formData.append('section', section);
  formData.append('principalAuthor', principalAuthor);
  formData.append('correspondingAuthor', correspondingAuthor);
  formData.append('correspondingEmail', correspondingEmail);
  formData.append('manuscriptTitle', manuscriptTitle);
  formData.append('manuscriptFile', manuscriptFile);
  formData.append('copyrightFile', copyrightFile);
  formData.append('message', message);

  try {
    const res = await fetch('/submit-research-paper', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    if (result.success) {
      alert('Your submission has been sent to the admin!');
      document.getElementById('submission-form').reset();
    } else {
      alert('Failed to submit. Please try again.');
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    alert('Server error. Try again later.');
  }
});
