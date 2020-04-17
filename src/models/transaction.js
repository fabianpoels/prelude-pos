import mongoose from 'mongoose'
import Price from '@/models/price'
import config from '@/config/config'
let Schema = mongoose.Schema

let PriceSchema = Price.schema

let TransactionSchema = new Schema(
  {
    _id: Number,
    gym: { type: String, ref: 'Gym', required: true },
    pos: { type: String, ref: 'Pos', required: true },
    user: { type: String, ref: 'User', required: true },
    priceIds: [{ type: String, ref: 'Price', required: true }],
    prices: [PriceSchema],
    paymentMethod: { type: String, enum: Object.values(config.transaction.paymentMethods), required: true },
    archived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

let Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction
