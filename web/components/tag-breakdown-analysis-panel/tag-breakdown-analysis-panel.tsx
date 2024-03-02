import { Bar,Pie } from "react-chartjs-2";
import { useMemo } from "react";
import { useImmer } from "use-immer";
import { ChartData,ChartOptions } from "chart.js";
import { useEffect } from "react";

import { convertToBarDataTotalTime,convertToBarDataAverageTime,bardataToPiedata,
  splitPieData } from "lib/chartjs-lib";
import { tagAnalysisDictToList,sortTagAnalysisByTotalTime,
  sortTagAnalysisByDate } from "lib/time-stat-api-lib";
import { nanoToHours } from "lib/utils";

import "./tag-breakdown-analysis-panel.less";

interface TagBreakdownAnalysisPanelProps
{
  tagAnalysis:TagBreakdown
}

/** analysis ui for a single tag breakdown */
export function TagBreakdownAnalysisPanel(props:TagBreakdownAnalysisPanelProps):JSX.Element
{
  const [totalTimeBarData,setTotalTimeBarData]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });

  const [averageTimeBarData,setAverageTimeBarData]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });

  const [totalTimePieData,setTotalTimePieData]=useImmer<ChartData<"pie",number[]>>({
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

  const [pieconfig,setPieconfig]=useImmer<ChartOptions<"pie">>({

  });

  // update bar data on tag analysis changing
  useEffect(()=>{
    setTotalTimeBarData((draft)=>{
      draft.datasets=[
        {
          data:convertToBarDataTotalTime(
            sortTagAnalysisByDate(tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis))
          ),
          label:"total time",
        },
      ];
    });

    setAverageTimeBarData((draft)=>{
      draft.datasets=[{
        data:convertToBarDataAverageTime(
          sortTagAnalysisByDate(tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis))
        ),
        label:"average time",
        backgroundColor:"#de5261"
      }];
    });

    setTotalTimePieData((draft)=>{
      var piedata:PieData[]=bardataToPiedata(convertToBarDataTotalTime(
        sortTagAnalysisByDate(tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis))
      ));

      var splitdata:SplitPieData=splitPieData(piedata);

      draft.datasets=[
        {
          data:splitdata.data,
          label:props.tagAnalysis.tag
        },
      ];

      draft.labels=splitdata.labels;
    });

    setBarconfig((draft)=>{
      draft.scales!.x!.title!.text=props.tagAnalysis.tag;
    });
  },[props.tagAnalysis]);

  return <div className="tag-breakdown-analysis-panel">
    <h2>{props.tagAnalysis.tag}</h2>

    <div className="info">
      <p>Total time: {truncateHour(nanoToHours(props.tagAnalysis.totalTime))} hrs</p>
      <p>Average time: {truncateHour(nanoToHours(props.tagAnalysis.averageTime))} hrs</p>
    </div>

    <div className="charts">
      <div className="chart total-time-chart">
        <Bar options={barconfig} data={totalTimeBarData}/>
      </div>

      <div className="chart average-time-chart">
        <Bar options={barconfig} data={averageTimeBarData}/>
      </div>

      <div className="chart">
        <Pie options={pieconfig} data={totalTimePieData}/>
      </div>
    </div>
  </div>;
}

/** truncate hour to 2 decs */
function truncateHour(hours:number):number
{
  return parseFloat(hours.toFixed(2))
}