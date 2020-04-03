import React, {useState, useEffect} from "react";
import ApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";


export const HoldingChart = ({chart_re, price}) => {
  

  const param = useParams().id
  
  const [options, setOptions] = useState({
    
    options: {
      chart: {
        type: 'candlestick',
        height: 350
      },
      title: {
        text:  param +' ' + price ,
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    }
});

  const [series, setSeries] = useState({
    series: [
      {
        name: "series-1",
        data: []
      }
    ]
  })
  
  const getDataChart = (period) =>{
    
  const data = []
  
  chart_re.map(item=>{
    
    for (let i = 1; i <= item[period].t.length; i++){
      data.push(
       {
         x: Number(item[period].t[i]+'000'),
         y: [item[period].o[i], item[period].h[i], item[period].l[i], item[period].c[i]]
       },
      )
   }
   return true
  }
  
  )
  
  setSeries({series:[{name: "series-1",data}]})
  setOptions({
    
    options: {
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false ,
            customIcons: [
              {
                icon: 'D',
                index: 0,
                title: 'День',
                class: 'custom-icon',
                click: function (chart, options, e) {
                  getDataChart('D')
                  
                }
              },
              {
              icon: 'M',
              index: 1,
              title: 'Месяц',
              class: 'custom-icon',
              click: function (chart, options, e) {
                getDataChart('M')
              }
            },
            {
              icon: 'Y',
              index: 2,
              title: 'Год',
              class: 'custom-icon',
              click: function (chart, options, e) {
                getDataChart('Y')
              }
            },
            {
              icon: 'Q',
              index: 3,
              title: '4 года',
              class: 'custom-icon',
              click: function (chart, options, e) {
                getDataChart('Q')
              }
            }
            ]
          },
          autoSelected: 'zoom' 
        }
    },
      title: {
        text:  param +' ' + price  ,
        align: 'center'
      },
      xaxis: {
        type: 'datetime',
        labels:{
          datetimeUTC: false,
        },
        
        tooltip: {
          formatter: function(val, opts) {
            return new Date(val).toLocaleDateString() 
          }
        } 
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    }  
})
  }
  
  useEffect(()=>{
    getDataChart('D')
    // eslint-disable-next-line
  },[chart_re])


  
  return(
    <ApexChart
    options={options.options}
    series={series.series}
    type="candlestick"
    width="100%"
    
    />
  )

}

