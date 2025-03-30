const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('goto /genderize');
});

app.get('/genderize', async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const response = await axios.get(`https://api.genderize.io/?name=${name}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});