const { Router } = require("express");
const Holdings = require("../models/Holdings");
const Cash = require("../models/Cash");
const auth = require("../middleware/auth.middleware");
const router = Router();
const getPrices = require("../services/prices.services");
const getDetail = require("../services/details.services");
const getDividend = require("../services/devidend.services");
const getChart = require("../services/chart.services");
var Mongoose = require("mongoose");
var ObjectId = Mongoose.Types.ObjectId;

router.get("/get", auth, async (req, res) => {
  try {
    const result = [];
    await Holdings.aggregate([
      {
        $match: {
          owner: new ObjectId(req.user.userId)
        }
      },
      {
        $group: {
          _id: "$ticker",
          avgPrice: {
            $sum: { $multiply: ["$price", "$quantity"] }
          },
          sum: { $sum: "$quantity" }
        }
      }
    ]).then(async item => {
      const promises = item.map(async item => {
        const prices = await getPrices(item._id);

        return { ...prices, ...item };
      });
      const results = await Promise.all(promises);
      results.map(itm => {
        result.push({
          c: itm.c.pop(),
          o: itm.o.pop(),
          _id: itm._id,
          avgPrice: itm.avgPrice,
          sum: itm.sum
        });
      });
    });
    //console.log(result)
    const sorted = result.sort((a, b) => {
      const getPercent = (open, close) => {
        return ((close / open) * 100 - 100).toFixed(2);
      };
      //let nameA = a._id
      let nameA = getPercent(a.o, a.c);
      let nameB = getPercent(b.o, b.c);
      if (nameA > nameB)
        //сортируем строки по возрастанию
        return -1;
      if (nameA < nameB) return 1;
      return 0; // Никакой сортировки
    });
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

router.get("/get/:id", auth, async (req, res) => {
  try {
    const result = [];
    const dividend = await getDividend(req.params.id);
    //const chart = await getChart(req.params.id,'7')
    const chart_re = {
      D: await getChart(req.params.id, "D"),
      W: await getChart(req.params.id, "W"),
      M: await getChart(req.params.id, "M"),
      Y: await getChart(req.params.id, "Y"),
      Q: await getChart(req.params.id, "Q")
    };
    await Holdings.find({
      ticker: req.params.id,
      owner: req.user.userId
    }).then(item => {
      result.push({ item, dividend, chart_re });
    });
    //console.log(result)
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

router.post("/add", auth, async (req, res) => {
  try {
    const { ticker, price, quantity, side } = req.body;
    const valid = ticker !== "" && price !== "" && quantity !== "";

    if (side === "Sell" && valid) {
      await getDetail(ticker).then(async items => {
        await new Holdings({
          ticker,
          price,
          quantity: quantity * -1,
          side,
          owner: req.user.userId,
          date: Date.now(),
          ...items
        }).save();
      });
      res.status(201).json({ message: "Добавлено в портфель" });
    } else if (valid) {
      await getDetail(ticker).then(async items => {
        await new Holdings({
          ticker,
          price,
          quantity,
          side,
          owner: req.user.userId,
          date: Date.now(),
          ...items
        }).save();
      });
      res.status(201).json({ message: "Добавлено в портфель" });
    } else {
      res.status(500).json({ message: "Заполнены не все поля" });
    }
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

router.post("/cash", auth, async (req, res) => {
  try {
    const { usd, rub } = req.body;
    const valid = usd !== "" || rub !== "";
    const exist = await (await Cash.find({ owner: req.user.userId })).length;
    console.log(exist);
    if (valid && !exist) {
      await new Cash({
        usd,
        rub,
        owner: req.user.userId
      }).save();
      res
        .status(201)
        .json({ message: `Добавлено в портфель ${usd} usd, ${rub || 0} rub` });
    } else if (valid && exist) {
      await Cash.find({ owner: req.user.userId }).then(item =>
        item.map(async item => {
          await Cash.findOneAndUpdate(
            {
              _id: item._id
            },
            {
              $set: {
                rub: item.rub + rub,
                usd: item.usd + usd
              }
            }
          );
        })
      );
      res.status(201).json({
        message: `Добавлено в портфель ${usd || 0} usd, ${rub || 0} rub`
      });
    } else {
      res.status(500).json({ message: "Не заполнены поля" });
    }
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

module.exports = router;
