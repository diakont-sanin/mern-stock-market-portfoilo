import React, { useState, useEffect, useContext, useCallback } from "react";
import {Button} from "react-bootstrap";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
import { Star, StarFill } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";


export const AddWatch = () => {


  let path = useHistory().location.pathname
  let matched = path.replace('/watchlist/','')
  

  const auth = useContext(AuthContext);
  const [show, setShow] = useState(false);
  // eslint-disable-next-line
  const [form, setForm] = useState({
    ticker: matched,
  });
  const [loading, setLoading] = useState(true)
  
  const message = useMessage();
  const { error, request, clearError } = useHttp();

  
  const getLink = useCallback(async () => {
    try {

      const fetched = await request(`/api/watchlist/get/${matched}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      fetched.map(item=>{
        if(item.item.length)
        setShow(true)
        setLoading(false)
        return item
      })
    } catch (e) {}
  }, [auth, matched, request])



  const handleSubmit = async event => {
    try {
        const data = await request(
          "/api/watchlist/add",
          "POST",
          { ...form },
          {
            Authorization: `Bearer ${auth.token}`
          }
        )
        
        message(data.message)
          
      }
      catch (err) {}
  };
 
  useEffect(() => {
    getLink()
  }, [getLink,error, message, clearError])
  
  if(loading)
  return <></>

  return (
    <>
      {!show  && <Button variant="link" onClick={()=>setShow(true)}>
        <Star size={25} onClick={handleSubmit}/>
      </Button>}
      {show && <Button variant="link" onClick={()=>setShow(false)}>
        <StarFill size={25} onClick={handleSubmit}/>
      </Button>}
    </>
  );
};
