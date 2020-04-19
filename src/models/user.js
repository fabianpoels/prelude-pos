import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '@/config/config'
let Schema = mongoose.Schema

const saltRounds = 10

let UserSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    identifier: { type: String, required: true, trim: true },
    gym: { type: String, ref: 'Gym' },
    role: { type: String, enum: Object.values(config.user.roles), required: true },
  },
  { timestamps: true }
)

UserSchema.methods.validPassword = async function(passwordToVerify) {
  if (passwordToVerify !== null && passwordToVerify !== '' && this.password !== null && this.password !== '') {
    return await bcrypt.compare(passwordToVerify, this.password)
  } else {
    return false
  }
}

UserSchema.statics.getHashedPassword = async function(passwordToHash) {
  if (passwordToHash !== null && passwordToHash !== '' && passwordToHash) {
    return await bcrypt.hash(passwordToHash, saltRounds)
  } else {
    return ''
  }
}

let User = mongoose.model('User', UserSchema)
export default User
