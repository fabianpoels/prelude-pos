import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let PageSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, trim: true, required: true },
    icon: { type: String },
    color: { type: String },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    buttons: [
      {
        key: { type: String, required: true },
        item: { type: String, ref: 'Item', required: true },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
)

let Page = mongoose.model('Page', PageSchema)

export default Page
