const {Schema,model,Types} = require('mongoose')

const schema = new Schema({
   usd:{type:Number},
   rub:{type:Number},
   owner:{type:Types.ObjectId, ref:'User'}
})

module.exports = model('Cash', schema)