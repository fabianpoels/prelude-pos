import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let BusinessUnitSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true, trim: true },
    identifier: { type: String, trim: true },
    vatRegime: { type: Number },
    gym: { type: String, ref: 'Gym' },
    archived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

let BusinessUnit = mongoose.model('BusinessUnit', BusinessUnitSchema)

export default BusinessUnit
