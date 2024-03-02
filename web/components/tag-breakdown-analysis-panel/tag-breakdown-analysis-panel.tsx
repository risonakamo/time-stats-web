import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { useImmer } from "use-immer";
import { ChartData,ChartOptions } from "chart.js";
import { useEffect } from "react";

import { convertToBarDataTotalTime,convertToBarDataAverageTime } from "lib/chartjs-lib";
import { tagAnalysisDictToList,sortTagAnalysisByTotalTime,
  sortTagAnalysisByDate } from "lib/time-stat-api-lib";

import "./tag-breakdown-analysis-panel.less";

interface TagBreakdownAnalysisPanelProps
{
  tagAnalysis:TagBreakdown
}

/** analysis ui for a single tag breakdown */
export function TagBreakdownAnalysisPanel(props:TagBreakdownAnalysisPanelProps):JSX.Element
{
  const [bardata,setBardata]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });

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

  // update bar data on tag analysis changing
  useEffect(()=>{
    setBardata((draft)=>{
      draft.datasets=[
        {
          data:convertToBarDataTotalTime(
            sortTagAnalysisByDate(tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis))
          ),
          label:"total time",
        },
        // probably move this to another chart.
        // hard to see when its on the same scale as the total time, which is much bigger.
        // {
        //   data:convertToBarDataAverageTime(
        //     sortTagAnalysisByDate(tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis))
        //   ),
        //   label:"average time"
        // }
      ];
    });

    setBarconfig((draft)=>{
      draft.scales!.x!.title!.text=props.tagAnalysis.tag;
    });
  },[props.tagAnalysis]);

  return <div className="tag-breakdown-analysis-panel">
    <Bar options={barconfig} data={bardata}/>
  </div>;
}