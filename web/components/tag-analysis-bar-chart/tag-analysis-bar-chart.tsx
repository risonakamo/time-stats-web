import { Bar } from "react-chartjs-2";
import { useImmer } from "use-immer";
import { ChartData,ChartOptions,ChartEvent,ActiveElement } from "chart.js";
import { useEffect,useRef } from "react";

import "./tag-analysis-bar-chart.less";

interface TagAnalysisBarChartProps
{
  bardata:BarData[]
  chartLabel:string
  barColour:string

  onBarClick(chartLabel:string,value:string):void
}

export function TagAnalysisBarChart(props:TagAnalysisBarChartProps):JSX.Element
{
  // --- refs ---
  const sync=useRef({
    h_barClick
  });

  sync.current.h_barClick=h_barClick;



  // ---- states ----
  const [barconfig,setBarconfig]=useImmer<ChartOptions<"bar">>({
    scales:{
      y:{
        title:{
          display:true,
          text:"Hours",
        }
      },
      x:{
        title:{
          display:true,
          text:"missing tag value"
        }
      }
    },

    // clicked on bar in chart. trigger event with the tag value of the clicked bar
    onClick:sync.current.h_barClick,
  });

  const [barData,setBarData]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });


  // ---- handlers ----
  /** clicked on bar in chart. trigger event with the tag value of the clicked bar */
  function h_barClick(event:ChartEvent,elements:ActiveElement[]):void
  {
    if (!elements.length)
    {
      return;
    }

    props.onBarClick(
      props.chartLabel,
      props.bardata[elements[0].index].x
    );
  }



  // ---- effects ----
  // on data change, update the chart dataset
  useEffect(()=>{
    setBarData((draft)=>{
      draft.datasets=[
        {
          data:props.bardata,
          label:props.chartLabel,
          backgroundColor:props.barColour
        },
      ];
    });

    setBarconfig((draft)=>{
      draft.scales!.x!.title!.text=props.chartLabel;
      draft.onClick=sync.current.h_barClick;
    });
  },[props.bardata]);



  // ---- render ----
  return <div className="tag-analysis-bar-chart">
    <h3>{props.chartLabel}</h3>
    <div className="chart-contain">
      <Bar options={barconfig} data={barData}/>
    </div>
  </div>;
}