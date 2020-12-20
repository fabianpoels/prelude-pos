import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

let Schema = mongoose.Schema

let CustomerAccountSchema = new Schema(
  {
    gym: { type: Schema.Types.ObjectId, ref: 'Gym' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    accountItems: {
      type: [
        {
          price: { type: Schema.Types.ObjectId, ref: 'Price' },
          amount: { type: Number },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
)

CustomerAccountSchema.plugin(mongooseLeanVirtuals)

let CustomerAccount = mongoose.model('CustomerAccount', CustomerAccountSchema)
export default CustomerAccount
