const { Router } = require("express");
const WatchList = require("../models/Watchlist");
const auth = require("../middleware/auth.middleware");
const router = Router();
const getPrices = require("../services/prices.services");
const getChart = require("../services/chart.services");
const getDividend = require("../services/devidend.services");
const getDetail = require("../services/details.services");
const fetch = require("node-fetch");

router.get("/get", auth, async (req, res) => {
  try {
    //await new WatchList({ticker:'AMAT',owner: req.user.userId}).save()
    const userHoldings =[]
    await WatchList.find({owner: req.user.userId}).then(async item => {
      
      const promises = item.map(async item => {
        const prices = await getPrices(item.ticker);
        return ({ ...prices, ...item });
      });
      const results = await Promise.all(promises);
      results.map(itm => {
        userHoldings.push({...itm,
          c:itm.c.pop(),
          o:itm.o.pop(),
        });
      });
    });
     //console.log(userHoldings)
    
        
      

    const sorted = userHoldings.sort((a,b)=>{
        let nameA = a._doc.ticker
        let nameB = b._doc.ticker
        if (nameA < nameB)
        return -1
        if (nameA > nameB)
        return 1
        return 0 
    })
    res.json(sorted)
  } catch (err) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

router.get("/get/:id", auth, async (req, res) => {
  try {
    
    const result = [];
    const dividend = await getDividend(req.params.id)
    //const chart = await getChart(req.params.id,'7')
    const chart_re = {
      D:await getChart(req.params.id,'D'),
      W:await getChart(req.params.id,'W'),
      M:await getChart(req.params.id,'M'),
      Y:await getChart(req.params.id,'Y'),
      Q:await getChart(req.params.id,'Q'),
    }
    
    await WatchList.find({
      ticker: req.params.id,
      owner: req.user.userId
    }).then(item => {
      
      result.push({ item, dividend,chart_re })
    });
    //console.log(result)
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

router.get("/indexes", auth, async (req, res) => {
    try {
      const _apiBase = `https://bcs-express.ru/webapi/api/quotes?securCode=`;
      const getIndexes = async item => {
        const res = await fetch(`${_apiBase}${item}`);
        if (!res.ok) {
          throw new Error(
            `Could not fetch ${_apiBase}${item}, received ${res.status}`
          );
        }
        return await res.json();
      };
      
      const getIndex = async id => {
        const ticker = await getIndexes(`${id}`);
        return ticker;
      };
      const userHoldings = [];
      
      await getIndex("BRENT").then(brent=>userHoldings.push(brent))
      await getIndex("USD000UTSTOM").then(rub=>userHoldings.push(rub))
      await getIndex("S%26P500").then(snp=>userHoldings.push(snp))
      await getIndex("IMOEX").then(moex=>userHoldings.push(moex))
  
      //console.log(userHoldings) 
      res.json(userHoldings);
    } catch (err) {
      res.status(500).json({ message: "Что-то пошло не так" });
    }
  });

router.post("/add", auth, async (req, res) => {
  try {
    console.log(req.body)
    const { ticker} = req.body;
    
    const details = await getDetail(ticker).then(item=>item)
    const exist = await WatchList.findOne({
      ticker,
      owner: req.user.userId
    })
    
    if (exist){
      await WatchList.findOneAndDelete({
        ticker,
      owner: req.user.userId
      })
      //res.status(201).json({ message: `${ticker} удалено из списка` });
    }else{
      const watch = new WatchList({
        ticker,
        owner: req.user.userId,
        ...details
      })
      await watch.save();
      //res.status(201).json({ message: `Добавлено в список отслеживания ${ticker}` });
    }
    
    
    
  } catch (error) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

module.exports = router;
