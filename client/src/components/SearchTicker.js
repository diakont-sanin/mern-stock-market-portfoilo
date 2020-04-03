import React, {useState} from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import {options} from '../tickerbase/symbol.tickerbase'
import { useHistory } from "react-router-dom";


export const SearchTicker = () => {

  const [form, setForm] = useState({
    ticker: "",
  });
  const history = useHistory()

  
  const filterByCallback = (options, props) => (
    String(options.label).toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
    String(options.fullname).toLowerCase().indexOf(props.text.toLowerCase()) !== -1 
 )

 const goTo = (ticker)=>{
  history.push(`/watchlist/${ticker}`)
 }
  return (
    <Typeahead
      onKeyDown={() => { 
       return form.ticker !== '' ? goTo(form.ticker): null
        //setForm({ ...form, ticker: e.target.value })
        
      }}
      selectHintOnEnter={true}
      filterBy={filterByCallback}
      id="ticker"
      type="text"
      placeholder="Нажмите Enter для поиска"
      /*console.log(e.length? e:[{label:''}])*/
      onChange={e =>{
        e.length
          ? setForm({ ...form, ticker: e[0].label })
          : setForm({ ...form })
          
          console.log(e.length)
      }
      }
      name="ticker"
      options={options}
      renderMenuItemChildren={option => (
        <div>
          {option.fullname}
          <div>
            <small>{option.label}</small>
          </div>
        </div>
      )}
    />
  );
};
