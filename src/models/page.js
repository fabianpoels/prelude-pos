import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
let Schema = mongoose.Schema

let PageSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    icon: { type: String },
    color: { type: String },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    buttons: [
      {
        key: { type: String, required: true },
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        color: { type: String },
      },
    ],
  },
  { timestamps: true }
)

PageSchema.plugin(mongooseLeanVirtuals)

let Page = mongoose.model('Page', PageSchema)

export default Page
