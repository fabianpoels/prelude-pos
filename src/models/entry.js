import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import Price from '@/models/price'
import Item from '@/models/item'
let PriceSchema = Price.schema
let ItemSchema = Item.schema
let Schema = mongoose.Schema

let EntrySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    item: ItemSchema,
    price: PriceSchema,
    datetime: { type: Date },
    isCorrection: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

EntrySchema.plugin(mongooseLeanVirtuals)

let Entry = mongoose.model('Entry', EntrySchema)

export default Entry
