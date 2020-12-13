import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
let Schema = mongoose.Schema

let CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    identifier: { type: String, trim: true },
    color: { type: String, trim: true },
    gym: { type: Schema.Types.ObjectId, ref: 'Gym' },
    businessUnit: { type: Schema.Types.ObjectId, ref: 'BusinessUnit' },
    vatRegime: { type: Number, required: true },
    archived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

CategorySchema.plugin(mongooseLeanVirtuals)

let Category = mongoose.model('Category', CategorySchema)

export default Category
