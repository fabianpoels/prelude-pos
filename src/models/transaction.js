import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import Price from '@/models/price'
import config from '@/config/config'
let Schema = mongoose.Schema

let PriceSchema = Price.schema

let TransactionSchema = new Schema(
  {
    number: { type: Number, required: true },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    pos: { type: Schema.Types.ObjectId, ref: 'Pos', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
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
    let t = await Transaction.findOne().sort({ number: 'desc' })
    if (t && t.number && t.number > 0) {
      this.number = t.number + 1
    } else {
      this.number = 1
    }
  }
  next()
})

TransactionSchema.pre('save', function(next) {
  this.totalAmount = this.prices.reduce((sum, price) => sum + price.salesPrice, 0)
  next()
})

TransactionSchema.plugin(mongooseLeanVirtuals)

let Transaction = mongoose.model('Transaction', TransactionSchema)

export default Transaction
