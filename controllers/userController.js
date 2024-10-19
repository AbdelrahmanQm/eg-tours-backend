const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.createUser = factory.createOne(User);
exports.deleteUser = factory.deleteOne(User);
