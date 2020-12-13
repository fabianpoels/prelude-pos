import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import config from '@/config/config'
let Schema = mongoose.Schema

let ItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    identifier: { type: String, trim: true },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    archived: { type: Boolean, required: true, default: false },
    isEntryToken: { type: Boolean, default: false },
    tokenType: { type: String, enum: config.tokenTypes, required: false },
    subscriptionDuration: { type: Number },
    punchcardEntries: { type: Number },
  },
  { timestamps: true }
)

ItemSchema.plugin(mongooseLeanVirtuals)

let Item = mongoose.model('Item', ItemSchema)

export default Item
