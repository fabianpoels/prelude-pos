import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let PriceSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, trim: true },
    salesPrice: { type: Number, required: true, default: 0 },
    vatRegime: { type: Number, required: true },
    archived: { type: Boolean, required: true, default: false },
    item: { type: String, ref: 'Item' },
  },
  { timestamps: true }
)

let Price = mongoose.model('Price', PriceSchema)

export default Price
