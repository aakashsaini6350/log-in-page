const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Create schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  dob:Date,
});

const User = mongoose.model('User', UserSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- 🛠️ ADD THIS LINE HERE

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, phone,dob } = req.body;
  console.log('🟢 Received data:', req.body);
  try {
    const user = new User({ name, phone,dob});
    await user.save();
    res.json({ message: '✅ Data saved to database!' });
  } catch (err) {
    console.error('❌ Save Error:', err);
    res.status(500).json({ message: '❌ Error saving data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

