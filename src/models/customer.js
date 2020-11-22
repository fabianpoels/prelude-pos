import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
import Price from '@/models/price'
import Item from '@/models/item'
let PriceSchema = Price.schema
let ItemSchema = Item.schema
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
      zipCode: String,
      town: String,
      country: String,
    },
    dateOfBirth: { type: Date },
    items: [{ type: String, ref: 'Item' }],
    entryTokens: [
      {
        item: ItemSchema,
        price: PriceSchema,
        purchasedAt: { type: Date },
        validUntil: { type: Date },
        entrances: [Date],
      },
    ],
    comments: [
      {
        comments: String,
        user: { type: String, ref: 'User' },
        datetime: Date,
      }
    ],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

let Customer = mongoose.model('Customer', CustomerSchema)
export default Customer
