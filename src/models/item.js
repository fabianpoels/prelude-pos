import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
import config from '@/config/config'
let Schema = mongoose.Schema

let ItemSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    identifier: { type: String, trim: true },
    gym: { type: String, ref: 'Gym' },
    category: { type: String, ref: 'Category' },
    archived: { type: Boolean, required: true, default: false },
    isEntryToken: { type: Boolean, default: false },
    tokenType: { type: String, enum: config.tokenTypes },
    subscriptionDuration: { type: Number },
    punchcardEntries: { type: Number },
  },
  { timestamps: true }
)

let Item = mongoose.model('Item', ItemSchema)

export default Item
