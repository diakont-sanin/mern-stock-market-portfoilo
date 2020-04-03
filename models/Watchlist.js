const {Schema,model,Types} = require('mongoose')

const schema = new Schema({
   ticker:{type:String},
   owner:{type:Types.ObjectId, ref:'User'},
   currency: {type:String},
   currencyCode: {type:String},
   shortName: {type:String},
   securCode: {type:String},
   classCode: {type:String},
   description:{type:String}
})

module.exports = model('WatchList', schema)