import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CategorySchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    identifier: { type: String, trim: true },
    color: { type: String, trim: true },
    gym: { type: String, ref: 'Gym' },
    businessUnit: { type: String, ref: 'BusinessUnit' },
    vatRegime: { type: Number, required: true },
    archived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

let Category = mongoose.model('Category', CategorySchema)

export default Category
