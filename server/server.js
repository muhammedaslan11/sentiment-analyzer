const express = require('express');
const cors = require('cors');

const app = express();

// Sadece belirli bir kaynaktan gelen isteklere izin ver
const corsOptions = {
  origin: 'https://sentimentanalysisgl.netlify.app',
  methods: 'GET, POST',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

// Diğer Express yönlendirmeleri ve işlemleri burada devam eder...

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
