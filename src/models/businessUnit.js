import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
let Schema = mongoose.Schema

let BusinessUnitSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    identifier: { type: String, trim: true },
    vatRegime: { type: Number },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym' },
    archived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

BusinessUnitSchema.plugin(mongooseLeanVirtuals)

let BusinessUnit = mongoose.model('BusinessUnit', BusinessUnitSchema)

export default BusinessUnit
