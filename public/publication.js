const journals = [
  {
    title: "International Journal of Physical Science",
    description: "Covers research in physics, material sciences, and physical phenomena.",
    image: "WhatsApp Image 2025-04-20 at 10.53.35_dcdd1044.jpg"
  },
  {
    title: "International Journal of Biological Science",
    description: "Research in Biotechnology, Medical Biology, Bioinformatics, etc.",
    image: "WhatsApp Image 2025-04-20 at 10.53.35_373966f7.jpg"
  },
  {
    title: "International Journal of Chemical Science",
    description: "Publishes chemical research including organic, inorganic, and physical chemistry.",
    image: "WhatsApp Image 2025-04-20 at 10.53.35_55ffbb6c.jpg"
  },
  {
    title: "International Journal of Environment Science",
    description: "Environmental studies, sustainability, and ecological research.",
    image: "WhatsApp Image 2025-04-20 at 10.53.36_6bc6d86e.jpg"
  },
  {
    title: "International Journal of Mathematical Science",
    description: "Mathematics, statistics, and computational methods.",
    image: "WhatsApp Image 2025-04-20 at 10.53.36_9895f614.jpg"
  },
  {
    title: "International Journal of Applied Research",
    description: "Applied research across multidisciplinary fields.",
    image: "WhatsApp Image 2025-04-20 at 11.09.45_28aeae85.jpg"
  }
];

  document.getElementById("applyBtn").addEventListener("click", function () {
    window.location.href = "upload_paper.html";
  });

  const journalDetailsData = {
  "International Journal of Biological Science": document.getElementById("bioJournalDetails").outerHTML,

  "International Journal of Mathematical Science": `
    <div class="container" style="background-color: #f5f5f5; border-left: 6px solid #3f51b5; padding: 20px;">
      <h2 style="text-align: center;">International Journal of Mathematical Science</h2>
      <p>
        Focuses on pure and applied mathematics including algebra, geometry, probability, statistics, and computational mathematics.
      </p>
      <h3 style="color: #3f51b5;">📋 Editorial Board</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; background: #fff; padding: 10px; border-radius: 8px;">
          <img src="math_editor1.jpg" class="editor-img" alt="Editor">
          <div>
            <strong>Dr. Sameer Rathi</strong> – Editor-in-Chief (India)<br>
            IIT Kanpur | Statistics<br>
            <a href="mailto:sameerrathi@example.com">sameerrathi@example.com</a>
          </div>
        </div>
      </div>
    </div>
  `,

  "International Journal of Chemical Science": `
    <div class="container" style="background-color: #fff8f0; border-left: 6px solid #e65100; padding: 20px;">
      <h2 style="text-align: center;">International Journal of Chemical Science</h2>
      <p>
        Covers all aspects of chemistry including organic, inorganic, and materials chemistry.
      </p>
      <h3 style="color: #e65100;">📋 Editorial Board</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; background: #fff; padding: 10px; border-radius: 8px;">
          <img src="chem_editor.jpg" class="editor-img" alt="Editor">
          <div>
            <strong>Dr. Priya Khanna</strong> – Senior Editor (India)<br>
            DU Chemistry Dept.<br>
            <a href="mailto:priyakhanna@example.com">priyakhanna@example.com</a>
          </div>
        </div>
      </div>
    </div>
  `
};




const categoriesDiv = document.getElementById('categories');
const flipButton = document.getElementById('flipButton');
const detailsDiv = document.getElementById('details');
const journalTitle = document.getElementById('journalTitle');
const journalDescription = document.getElementById('journalDescription');
const journalImage = document.getElementById('journalImage');
const publishBtn = document.getElementById('publishBtn');
const applyBtn = document.getElementById('applyBtn');
const adminForm = document.getElementById("adminPublishForm");
const categorySelect = document.getElementById("categorySelect");
const researchForm = document.getElementById("researchForm");
const uploadStatus = document.getElementById("uploadStatus");

let userEmail = null;

// Populate <select> with journal options
journals.forEach(j => {
  const opt = document.createElement("option");
  opt.value = j.title;
  opt.innerText = j.title;
  categorySelect.appendChild(opt);
});

// Fetch logged-in user email
fetch('/get-user-email')
  .then(res => res.json())
  .then(data => {
    userEmail = data.email;

    if (userEmail === "aman0567shukla@gmail.com") {
      adminForm.style.display = "block";
    } else {
      adminForm.style.display = "none";
    }
  })
  .catch(err => {
    console.error("Error fetching user email:", err);
  });

// Show all journals on button click
flipButton.addEventListener('click', () => {
  categoriesDiv.style.display = 'flex';
  flipButton.style.display = 'none';
});

// Create clickable categories
journals.forEach((journal, index) => {
  const div = document.createElement('div');
  div.className = 'category';
  div.innerText = journal.title;
  div.onclick = () => showDetails(index);
  categoriesDiv.appendChild(div);
});

// Show details and load research based on category
function showDetails(index) {
  const selectedCategory = journals[index].title;

  journalTitle.innerText = selectedCategory;
  journalDescription.innerHTML = journals[index].description;
  journalImage.src = journals[index].image;

  // Button display logic
  if (userEmail === "aman0567shukla@gmail.com") {
    publishBtn.style.display = 'inline-block';
    applyBtn.style.display = 'none';
  } else {
    publishBtn.style.display = 'none';
    applyBtn.style.display = 'inline-block';
  }

  // SHOW GIAR Section only for Biological Journal
  const bioDetailsDiv = document.getElementById("bioJournalDetails");
  if (selectedCategory === "International Journal of Biological Science||") {
    bioDetailsDiv.style.display = "none";
  } else {
    bioDetailsDiv.style.display = "block";
  }

  loadPublishedPapersForCategory(selectedCategory);
  detailsDiv.scrollIntoView({ behavior: 'smooth' });
}



// Open upload form if admin clicks "Publish"
publishBtn.addEventListener('click', () => {
  adminForm.scrollIntoView({ behavior: 'smooth' });
});

// Upload research paper (admin only)
researchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(researchForm);

  fetch("/upload-research", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        uploadStatus.textContent = "✅ Research published successfully!";
        researchForm.reset();
        loadPublishedPapersForCategory(categorySelect.value); // Refresh list after upload
      } else {
        uploadStatus.textContent = "❌ Failed to publish research.";
      }
    })
    .catch(err => {
      uploadStatus.textContent = "❌ Error uploading paper.";
      console.error(err);
    });
});

// Display papers by category
function loadPublishedPapersForCategory(selectedCategory) {
  fetch('/get-published-papers')
    .then(res => res.json())
    .then(data => {
      const dashboard = document.getElementById("dashboardSection");
      const list = document.getElementById("researchList");
      dashboard.style.display = "block";
      list.innerHTML = '';

      const filtered = data.papers.filter(paper => paper.category === selectedCategory);

      if (filtered.length === 0) {
        list.innerHTML = `<p style="color: #555;">No research papers found in this journal.</p>`;
      } else {
        filtered.forEach(paper => {
          const div = document.createElement("div");
          div.className = "research-card";
          div.innerHTML = `
            <h4>${paper.title}</h4>
            <p><strong>Category:</strong> ${paper.category}</p>
            <p><strong>Uploaded:</strong> ${new Date(paper.uploaded_at).toLocaleString()}</p>
            <a href="/research/${paper.filename}" target="_blank">📥 Download PDF</a>
          `;
          list.appendChild(div);
        });
      }
    })
    .catch(err => {
      console.error("Error loading papers:", err);
    });
}

