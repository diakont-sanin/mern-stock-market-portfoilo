const { Router } = require("express");
const Holdings = require("../models/Holdings");
const Cash = require("../models/Cash");
const auth = require("../middleware/auth.middleware");
const router = Router();
const getPrices = require("../services/prices.services");
var Mongoose = require('mongoose');
var ObjectId = Mongoose.Types.ObjectId;


router.get("/get", auth, async (req, res) => {
  try {
      const cash = []
      await Holdings.aggregate([
      {$match: {
         owner: new ObjectId(req.user.userId)
     }},
      {
        $group: {
          _id: "$ticker",
          avgPrice: {
            $sum: { $multiply: ["$price", "$quantity"] }
          },
          sum: { $sum: "$quantity" },
          currency: {$push:"$currencyCode"}
        },
        
      }
    ]).then(async item=>{
    const usdRub = await getPrices('USD000UTSTOM').then(rub=>rub.c.pop())
    await Cash.findOne({owner:req.user.userId}).then(item=>cash.push({
        c:1,
        o:1,
        sum:item.usd,
        _id:'$',
        avgPrice:item.usd,
        currency:['USD'],
        usdRub
    },{
        c:1,
        o:1,
        sum:item.rub,
        _id:'₽',
        avgPrice:item.rub,
        currency:['RUB'],
        usdRub
    })
    )
    const promises = item.map(async item => {
      const prices = await getPrices(item._id);

      return ({...item,c:prices.c.pop(),o:prices.o.pop(),usdRub });
    });
    const results = await Promise.all(promises);
    const total = results.concat(cash)
    res.json(total)
    
    }) 
  } catch (err) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
})

module.exports = router;