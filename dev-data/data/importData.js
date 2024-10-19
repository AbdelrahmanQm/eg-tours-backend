const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: 'config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('DATABASE CONNECTED!!');
});
console.log(process.argv);
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async (Model, data) => {
  try {
    await Model.create(data, { validateBeforeSave: false });
    console.log('Data Imported');
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async (Model) => {
  try {
    await Model.deleteMany();
    console.log('Data Deleted');
  } catch (err) {
    console.error('Unable to delete data');
  }
};

// const importTours = async () => {
//   try {
//     await Tour.create(tours);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const deleteTours = async () => {
//   try {
//     await Tour.deleteMany();
//   } catch (err) {
//     console.log(err);
//   }
// };

if (process.argv[2] === '--import') {
  importData(process.argv[3], process.argv[4]);
  console.log('Data Imported');
  process.exit();
}

if (process.argv[2] === '--delete') {
  deleteData(process.argv[3]);
  console.log('Data Deleted');
  process.exit();
}

// deleteData(User);
importData(User, users);
