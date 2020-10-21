import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let TagSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    tagId: { type: String, required: true },
    user: { type: String, ref: 'User' },
  },
  { timestamps: true }
)

let Tag = mongoose.model('Tag', TagSchema)

export default Tag
