import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import {Table,Spinner} from "react-bootstrap";
import { Link } from "react-router-dom";


export const WatchList = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [ticker, setTicker] = useState(null);

  const getHolding = useCallback(async () => {
    try {
      const fetched = await request(`/api/watchlist/get`, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setTicker(fetched);
    } catch (e) {}
  }, [token, request]);
 
  useEffect(() => {
    getHolding();
  }, [getHolding]);

  const changePercent = (close,open)=>{
    const result = ((close/open)*100-100).toFixed(2)
    return result < 0 ? `${result}%`: `+${result}%` 
  }
  
  if (loading) {
    return (
    <div style={{textAlign:"center"}}>
        <Spinner animation="border" />
    </div>
    )
  }
  console.log(ticker)
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Тикер</th>
          <th>Цена</th>
          <th>Изменение %</th>
        </tr>
      </thead>
      <tbody>
        {!loading &&
          ticker &&
          ticker.map((item, index) => {
            
            return (
              <tr key={index}>
                <td><Link to={`/watchlist/${item._doc.ticker}`}>{item._doc.ticker}</Link></td>
                <td>
                   {item.c}
                </td>
                <td style= {item.c > item.o ? {color:"green"}:{color:"red"}}>
                    {changePercent(item.c,item.o)}
                </td>
               
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};
