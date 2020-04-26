import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CustomerSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    nationalNumber: { type: String },
    phone: { type: String },
    address: {
      street: String,
      number: String,
      suffix: String,
      zipCode: String,
      town: String,
      country: String,
    },
    dateOfBirth: { type: Date },
    items: [{ type: String, ref: 'Item' }],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

let Customer = mongoose.model('Customer', CustomerSchema)
export default Customer
