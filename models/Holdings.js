const {Schema,model,Types} = require('mongoose')

const schema = new Schema({
   ticker:{type:String},
   price:{type:Number},
   quantity:{type:Number},
   side:{type:String},
   owner:{type:Types.ObjectId, ref:'User'},
   date:{type:Date/*,default:Date.now*/}, 
   currency: {type:String},
   currencyCode: {type:String},
   shortName: {type:String},
   securCode: {type:String},
   classCode: {type:String},
   description:{type:String}

})

module.exports = model('Holdings', schema)