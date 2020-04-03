const fetch = require("node-fetch");

_apiBase = `https://api.bcs.ru/udfdatafeed/v1/history?symbol=`;
var start = new Date();
start.setHours(0,0,0,0)
const beginDay = start/1000
const getResource = async item => {
  const now = Math.floor(Date.now()/1000)
  const res = await fetch(
    `${_apiBase}${item}&resolution=D&from=${now}&to=${now}&token=7da831b352539cbeee290fb0fb52ed49`
  );
  const resBeginDay = await fetch(
    `${_apiBase}${item}&resolution=D&from=${beginDay}&to=${now}&token=7da831b352539cbeee290fb0fb52ed49`
  );
  if (!res.ok) {
    throw new Error(
      `Could not fetch ${_apiBase}${item}` + `, received ${res.status}`
    );
  }
  return await res.json();
};

const getResourceBeginDay = async item => {
  const now = Math.floor(Date.now()/1000)
  const resBeginDay = await fetch(
    `${_apiBase}${item}&resolution=D&from=${beginDay}&to=${now}&token=7da831b352539cbeee290fb0fb52ed49`
  );
  if (!res.ok) {
    throw new Error(
      `Could not fetch ${_apiBase}${item}` + `, received ${res.status}`
    );
  }
  return await resBeginDay.json();
};

const getPrices = async id => {
  const ticker = await getResource(`${id}`);
  const tickerBegin = await getResource(`${id}`);
  if(ticker.c.length){
    
    return ticker
  }else{
    
    return tickerBegin
  }
  
}

module.exports = getPrices
