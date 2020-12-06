import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import Price from '@/models/price'
import Item from '@/models/item'
let PriceSchema = Price.schema
let ItemSchema = Item.schema
let Schema = mongoose.Schema

let CustomerSchema = new Schema(
  {
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
        comment: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        datetime: Date,
      },
    ],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

CustomerSchema.plugin(mongooseLeanVirtuals)

let Customer = mongoose.model('Customer', CustomerSchema)
export default Customer
