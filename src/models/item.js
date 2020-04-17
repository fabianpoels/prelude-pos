import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
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
  },
  { timestamps: true }
)

let Item = mongoose.model('Item', ItemSchema)

export default Item
