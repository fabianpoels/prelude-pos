import mongoose from 'mongoose'
import Price from '@/models/price'
import Item from '@/models/item'
let PriceSchema = Price.schema
let ItemSchema = Item.schema
let Schema = mongoose.Schema

let EntrySchema = new Schema(
  {
    user: { type: String, ref: 'User' },
    customer: { type: String, ref: 'Customer' },
    item: ItemSchema,
    price: PriceSchema,
    datetime: { type: Date },
    isCorrection: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

let Entry = mongoose.model('Entry', EntrySchema)

export default Entry
