const fetch = require('node-fetch')

const _chartUrl = 'https://api.bcs.ru/udfdatafeed/v1/history?symbol='
const fetchChartData = async (item,resolution) => {
    let start = new Date();
    start.setHours(10,0,0,0)
    const beginDay = start/1000
    let dateTo = Math.floor(Date.now()/1000)
    
    switch(resolution){
      case 'D':
        resolution = '15'
        dateFrom = beginDay
        break
      case 'W':
        resolution = 'D' 
        dateFrom = dateTo - 86400*7
        break
      case 'M':
        resolution = 'D'
        dateFrom = dateTo - 86400*30
        break
      case 'Y':
        resolution = 'W'
        dateFrom = dateTo - 86400*365
        break
      case 'Q':
        resolution = 'W'
        dateFrom = dateTo - 86400*365*4
        break
    }
    
    const res = await fetch(`${_chartUrl}${item}&resolution=${resolution}&from=${dateFrom}&to=${dateTo}&token=7da831b352539cbeee290fb0fb52ed49`)
    if (!res.ok) {
      throw new Error(
        `Could not fetch ${_chartUrl}${item}` + `, received ${res.status}`
      );
    }
    return await res.json();
  }
  
const getChart = async (item,resolution)=>{
    const chart = await fetchChartData(item,resolution)
    return chart 
  }

module.exports = getChart
