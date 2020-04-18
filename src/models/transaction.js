import mongoose from 'mongoose'
import Price from '@/models/price'
import config from '@/config/config'
let Schema = mongoose.Schema

let PriceSchema = Price.schema

let TransactionSchema = new Schema(
  {
    number: { type: Number, required: true },
    gym: { type: String, ref: 'Gym', required: true },
    pos: { type: String, ref: 'Pos', required: true },
    user: { type: String, ref: 'User', required: true },
    priceIds: [{ type: String, ref: 'Price', required: true }],
    prices: [PriceSchema],
    paymentMethod: { type: String, enum: Object.values(config.transaction.paymentMethods), required: true },
    totalAmount: { type: Number },
    archived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

TransactionSchema.pre('validate', async function(next) {
  if (this.isNew) {
    let number = (await Transaction.findOne().sort({ number: 'desc' })).number || 0
    this.number = number + 1
  }
  next()
})

TransactionSchema.pre('save', function(next) {
  this.totalAmount = this.prices.reduce((sum, price) => sum + price.salesPrice, 0)
  next()
})

let Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction
