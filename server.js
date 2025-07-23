const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();
dotenv.config();

// ✅ PostgreSQL (Neon) setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('Connected to Neon PostgreSQL!'))
  .catch(err => console.error('Connection error:', err));

// ✅ Setup transporter (for sending OTP email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Middleware
let otpStore = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}));

// ✅ Research PDF Upload (Admin)
const researchStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/research');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const researchUpload = multer({ storage: researchStorage });

app.post('/upload-research', researchUpload.single('file'), (req, res) => {
  const { title, category } = req.body;
  const filename = req.file.filename;
  pool.query(
    'INSERT INTO published_papers (title, filename, category, uploaded_at) VALUES ($1, $2, $3, NOW())',
    [title, filename, category],
    (err) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

app.get('/get-published-papers', (req, res) => {
  pool.query('SELECT * FROM published_papers ORDER BY uploaded_at DESC', (err, results) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, papers: results.rows });
  });
});

// ✅ Submit Form Upload (upload_paper.html)
const submissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const submissionUpload = multer({ storage: submissionStorage });

app.post('/submit-research-paper', submissionUpload.fields([
  { name: 'manuscriptFile', maxCount: 1 },
  { name: 'copyrightFile', maxCount: 1 }
]), (req, res) => {
  const {
    section,
    principalAuthor,
    correspondingAuthor,
    correspondingEmail,
    manuscriptTitle,
    message
  } = req.body;

  const manuscriptFile = req.files['manuscriptFile']?.[0]?.filename || '';
  const copyrightFile = req.files['copyrightFile']?.[0]?.filename || '';

  const sql = `
    INSERT INTO research_papers (
      section,
      principal_author,
      corresponding_author,
      email,
      manuscript_title,
      manuscript_file,
      copyright_file,
      message,
      submitted_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  `;

  pool.query(sql, [
    section,
    principalAuthor,
    correspondingAuthor,
    correspondingEmail,
    manuscriptTitle,
    manuscriptFile,
    copyrightFile,
    message
  ], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correspondingEmail,
      subject: 'Research Submission Confirmation',
      text: `Hello ${correspondingAuthor},\n\nYour research paper titled "${manuscriptTitle}" has been received successfully.\n\nThank you!`
    });

    res.json({ success: true });
  });
});

// ✅ OTP Routes
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  }, (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true });
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ✅ Auth & User Session
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query(
    'INSERT INTO users_data (email, password) VALUES ($1, $2)',
    [email, hashedPassword],
    (err) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  pool.query('SELECT * FROM users_data WHERE email = $1', [email], async (err, result) => {
    if (err || result.rows.length === 0) return res.json({ success: false });

    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (isMatch) {
      req.session.email = email;
      res.json({ success: true, user: { email } });
    } else {
      res.json({ success: false });
    }
  });
});

app.post('/set-password', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query(
    'UPDATE users_data SET password = $1 WHERE email = $2',
    [hashedPassword, email],
    (err) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

app.get('/get-user-email', (req, res) => {
  const email = req.session.email || null;
  res.json({ email });
});

// ✅ Notice System
let currentNotice = "No notice set yet.";

app.get('/get-notice', (req, res) => {
  res.json({ notice: currentNotice });
});

app.post('/set-notice', (req, res) => {
  const { email } = req.session;
  if (email !== 'aman0567shukla@gmail.com') {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const { notice } = req.body;
  currentNotice = notice;
  res.json({ success: true });
});

// ✅ Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ✅ Static Files
app.use('/research', express.static(path.join(__dirname, 'public/research')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
