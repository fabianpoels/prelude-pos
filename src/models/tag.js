import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
let Schema = mongoose.Schema

let TagSchema = new Schema(
  {
    tagId: { type: String, required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    dateAssigned: { type: Date },
    lastScanned: { type: Date },
  },
  { timestamps: true }
)

TagSchema.plugin(mongooseLeanVirtuals)

let Tag = mongoose.model('Tag', TagSchema)

export default Tag
