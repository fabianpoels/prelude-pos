import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'

let Schema = mongoose.Schema

let PosSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true, trim: true },
    gym: { type: String, ref: 'Gym', required: true },
    pages: [{ type: String, ref: 'Page' }],
  },
  { timestamps: true }
)

let Pos = mongoose.model('Pos', PosSchema)

export default Pos
