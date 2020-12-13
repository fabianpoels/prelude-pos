import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import bcrypt from 'bcrypt'
import config from '@/config/config'
let Schema = mongoose.Schema

const saltRounds = 10

let UserSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    identifier: { type: String, required: true, trim: true },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym' },
    role: { type: String, enum: Object.values(config.user.roles), required: true },
    enabled: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
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

UserSchema.plugin(mongooseLeanVirtuals)

let User = mongoose.model('User', UserSchema)
export default User
