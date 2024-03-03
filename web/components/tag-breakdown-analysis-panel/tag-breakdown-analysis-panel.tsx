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

import "./tag-breakdown-analysis-panel.less";

interface TagBreakdownAnalysisPanelProps
{
  tagAnalysis:TagBreakdown
}

type ChartMode="bar"|"pie"

/** analysis ui for a single tag breakdown */
export function TagBreakdownAnalysisPanel(props:TagBreakdownAnalysisPanelProps):JSX.Element
{
  const [chartMode,setChartMode]=useState<ChartMode>("bar");

  const [totalTimeBarData,setTotalTimeBarData]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });

  const [averageTimeBarData,setAverageTimeBarData]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[]
  });

  const [totalTimePieData,setTotalTimePieData]=useImmer<ChartData<"pie",number[]>>({
    datasets:[]
  });

  const [averageTimePieData,setAverageTimePieData]=useImmer<ChartData<"pie",number[]>>({
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




  // --- effects ---
  // update bar data on tag analysis changing
  useEffect(()=>{
    const listdata:TimeEventAnalysis2[]=sortTagAnalysisByDate(
      tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis)
    );

    setTotalTimeBarData((draft)=>{
      draft.datasets=[
        {
          data:convertToBarDataTotalTime(
            listdata
          ),
          label:"total time",
        },
      ];
    });

    setAverageTimeBarData((draft)=>{
      draft.datasets=[{
        data:convertToBarDataAverageTime(
          listdata
        ),
        label:"average time",
        backgroundColor:"#de5261"
      }];
    });

    setTotalTimePieData((draft)=>{
      var piedata:PieData[]=bardataToPiedata(convertToBarDataTotalTime(
        listdata
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

    setAverageTimePieData((draft)=>{
      var piedata:PieData[]=bardataToPiedata(convertToBarDataAverageTime(
        listdata
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



  // --- handlers ---
  /** chart mode changed from control line */
  function h_chartModeChange(newMode:ChartMode):void
  {
    setChartMode(newMode);
  }


  // --- render ---
  /** render charts section. conditionally renders based on the current chart mode */
  function r_charts():JSX.Element
  {
    if (chartMode=="bar")
    {
      return <>
        <div className="chart">
          <Bar options={barconfig} data={totalTimeBarData}/>
        </div>

        <div className="chart">
          <Bar options={barconfig} data={averageTimeBarData}/>
        </div>
      </>;
    }

    else if (chartMode=="pie")
    {
      return <>
        <div className="chart pie">
          <Pie options={pieconfig} data={totalTimePieData}/>
        </div>

        <div className="chart pie">
          <Pie options={pieconfig} data={averageTimePieData}/>
        </div>
      </>;
    }

    return <p>unknown chart mode {chartMode}</p>;
  }

  const chartSwitchControlLineButtons:ControlLineButtonConfig[]=[
    {
      icon:<ChartBar/>,
      value:"bar"
    },
    {
      icon:<ChartPie/>,
      value:"pie"
    }
  ];

  return <div className="tag-breakdown-analysis-panel">
    <h2>{props.tagAnalysis.tag}</h2>

    <div className="info">
      <p>Total time: {truncateHour(nanoToHours(props.tagAnalysis.totalTime))} hrs</p>
      <p>Average time: {truncateHour(nanoToHours(props.tagAnalysis.averageTime))} hrs</p>
    </div>

    <div className="controls">
      <ToggleControlLine text="Chart mode" buttons={chartSwitchControlLineButtons}
        selectedOption={chartMode} onSelectOption={h_chartModeChange}/>
    </div>

    <div className="charts">
      {r_charts()}
    </div>
  </div>;
}

/** truncate hour to 2 decs */
function truncateHour(hours:number):number
{
  return parseFloat(hours.toFixed(2))
}