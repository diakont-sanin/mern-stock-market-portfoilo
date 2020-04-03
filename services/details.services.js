const fetch = require('node-fetch')


_apiDetail = 'https://bcs-express.ru/webapi/api/quotes?securCode='
const fetchDetail = async item => {
    const res = await fetch(`${_apiDetail}${item}`)
    if (!res.ok) {
      throw new Error(
        `Could not fetch ${_apiDetail}${item}` + `, received ${res.status}`
      );
    }
    return await res.json();
  }
  
const getDetail = async (item)=>{
    const details = await fetchDetail(item)
    return _transformDetails(details)
  }

const _transformDetails = (item) => {
    return {
      id: item.id,
      currency:item.currency,
      currencyCode:item.currencyCode,
      shortName:item.shortName,
      securCode:item.securCode,
      classCode:item.classCode,
      description:item.description,
      fullName:item.fullName,
    }
  }
module.exports = getDetail