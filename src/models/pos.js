import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

let Schema = mongoose.Schema

let PosSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym', required: true },
    pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
  },
  { timestamps: true }
)

PosSchema.plugin(mongooseLeanVirtuals)

let Pos = mongoose.model('Pos', PosSchema)

export default Pos
