import { Bar,Pie } from "react-chartjs-2";
import { useState } from "react";
import { useImmer } from "use-immer";
import { ChartData,ChartOptions } from "chart.js";
import { useEffect } from "react";
import {ChartPie,ChartBar} from "@phosphor-icons/react";

import { ToggleControlLine,ControlLineButtonConfig } from "components/toggle-control-line/toggle-control-line";

import { convertToBarDataTotalTime,convertToBarDataAverageTime,bardataToPiedata,
  splitPieData } from "lib/chartjs-lib";
import { tagAnalysisDictToList,sortTagAnalysisByTotalTime,
  sortTagAnalysisByDate } from "lib/time-stat-api-lib";
import { nanoToHours } from "lib/utils";

import "./tag-analysis-chart.less";

interface TagAnalysisChartProps
{
  bardata:BarData[]
  chartLabel:string
  barColour:string
}

export function TagAnalysisChart(props:TagAnalysisChartProps):JSX.Element
{
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
    }
  });

  const [barData,setBarData]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });

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
    });
  },[props.bardata]);

  return <div className="tag-analysis-chart">
    <h3>{props.chartLabel}</h3>
    <div className="chart-contain">
      <Bar options={barconfig} data={barData}/>
    </div>
  </div>;
}