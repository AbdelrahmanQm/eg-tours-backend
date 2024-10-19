const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB Connected');
});

const app = require('./app');

const port = 3000;
app.listen(port, () => {
  console.log(`App is listening to port ${port}...`);
});
