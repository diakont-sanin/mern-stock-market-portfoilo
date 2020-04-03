const fetch = require('node-fetch')

const _url = 'https://bcs-express.ru/webapi/api/calendar/dividends?emitent='
const fetchDividend = async item => {
    const res = await fetch(`${_url}${item}`)
    if (!res.ok) {
      throw new Error(
        `Could not fetch ${_url}${item}` + `, received ${res.status}`
      );
    }
    return await res.json();
  }
  
const getDividend = async (item)=>{
    const devidends = await fetchDividend(item)
    return devidends 
  }

module.exports = getDividend
