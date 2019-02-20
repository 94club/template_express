'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
	userId: Number,
	username: String,
	password: String,
})

const User = mongoose.model('User', userSchema);

export default User