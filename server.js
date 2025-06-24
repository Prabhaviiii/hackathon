const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth');
const caregiverRoutes = require('./routes/caregivers');
const userRoutes = require('./routes/users'); 



app.use(cors());
app.use(express.json());

// route usage
app.use('/api/auth', authRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/users', userRoutes); 


// test route
app.get('/', (req, res) => {
  res.send('API Running');
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
