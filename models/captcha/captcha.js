'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const captchaSchema = new Schema({
  cap: String,
  uuid: String
})

const Captcha = mongoose.model('Captcha', captchaSchema);

export default Captcha