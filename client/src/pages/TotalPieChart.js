import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import {Spinner} from "react-bootstrap";
import Apexchart from 'react-apexcharts'
import { TotalProfit } from "../components/TotalProfit";

export const TotalPieChart = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  // eslint-disable-next-line
  const [ticker, setTicker] = useState(null);
  const [overAll, setOverAll] = useState([])
  const [todayProfit, setTodayProfit] = useState([])
  const [series,setSeries]=useState([])
  const [options,setOptions]=useState({options: {
    chart: {
      width: 360,
      type: 'pie',
    },
    labels: [],
  }})

  
  const getDataChart = useCallback(async () => {
    try {
      const fetched = await request(`/api/total/get`, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      setTicker(fetched);
      console.log(fetched)
      setOverAll(fetched.map(item=>{
        if(item.currency[0]==='USD'){
            
            return Math.floor(item.avgPrice * item.usdRub )
        }      
        else{
           
            return Math.floor (item.avgPrice)
        }
        }))
        setTodayProfit(fetched.map(item=>{
            if(item.currency[0]==='USD'){
                
                return Math.floor(
                    (item.c * item.sum * item.usdRub) - (item.o * item.sum * item.usdRub)
                    )
            }      
            else{
               
                return Math.floor (
                    (item.c * item.sum) - (item.o * item.sum)
                )
            }
            }))
      setSeries(fetched.map(item=>{
        if(item.currency[0]==='USD'){
            
            return Math.floor((item.c * item.sum) * item.usdRub )
        }      
        else{
           
            return Math.floor (item.avgPrice)
        }
        }))
      setOptions({options: {
        chart: {
          width: 360,
          type: 'pie',
        },
        labels: fetched.map(item=>item._id),
        legend: {
            position: 'bottom',
            show: true,
          },
          plotOptions: {
            pie: {
              expandOnClick: true,
              donut: {
                labels: {
                    show: true,
                    total:{
                        show:true,
                        formatter: function (w) {
                          return w.globals.seriesTotals.reduce((a, b) => {
                            return (a + b)
                          }, 0)
                        },
                        label: 'Total, ₽',
                    }
                }
            }
            }
          }
      }})
    } catch (e) {}
  }, [token, request]);


  useEffect(() => {
    getDataChart();
  }, [getDataChart]);
  
  //console.log(ticker)
  if (loading) {
    return (
    <div style={{textAlign:"center"}}>
        <Spinner animation="border" />
    </div>
    )
  }

  
  return (
    <div style={{textAlign:"-webkit-center"}}>
    <TotalProfit total={series} overAll={overAll} todayProfit={todayProfit}/>
    <Apexchart options={options.options} series={series} type="donut" width={360} />
    </div>
  )
};
