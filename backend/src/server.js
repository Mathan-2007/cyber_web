const app = require('./app');
require('dotenv').config();

const PORT = Number(process.env.PORT || 5001);

app.listen(PORT, () => {
  console.log(`CyberNEX backend running on http://localhost:${PORT}`);
});
