import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
let Schema = mongoose.Schema

let GymSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    poss: [{ type: Schema.Types.ObjectId, ref: 'Pos' }],
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

GymSchema.plugin(mongooseLeanVirtuals)

let Gym = mongoose.model('Gym', GymSchema)

export default Gym
