import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let GymSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    name: { type: String, required: true, trim: true },
    users: [{ type: String, ref: 'User' }],
    poss: [{ type: String, ref: 'Pos' }],
    vlApiKey: { type: String, trim: true },
    settings: {
      number_delimiter: { type: String, trim: true, default: '.' },
      number_separator: { type: String, trim: true, default: ',' },
      currency_sign: { type: String, trim: true, default: '€' },
      currency_text: { type: String, trim: true, default: 'EUR' },
    },
  },
  { timestamps: true }
)

let Gym = mongoose.model('Gym', GymSchema)

export default Gym
