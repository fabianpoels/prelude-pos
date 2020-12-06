import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
let Schema = mongoose.Schema

let PriceSchema = new Schema(
  {
    name: { type: String, trim: true },
    salesPrice: { type: Number, required: true, default: 0 },
    vatRegime: { type: Number, required: true },
    archived: { type: Boolean, required: true, default: false },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
  },
  { timestamps: true }
)

PriceSchema.plugin(mongooseLeanVirtuals)

let Price = mongoose.model('Price', PriceSchema)

export default Price
