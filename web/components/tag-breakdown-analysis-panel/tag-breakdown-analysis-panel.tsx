import { Bar,Pie } from "react-chartjs-2";
import { useState,useMemo } from "react";
import { useImmer } from "use-immer";
import { ChartData,ChartOptions } from "chart.js";
import { useEffect } from "react";
import {ChartPie,ChartBar} from "@phosphor-icons/react";

import { ToggleControlLine,ControlLineButtonConfig }
  from "components/toggle-control-line/toggle-control-line";
import { TagAnalysisBarChart } from "components/tag-analysis-bar-chart/tag-analysis-bar-chart";

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

  const [totalTimePieData,setTotalTimePieData]=useImmer<ChartData<"pie",number[]>>({
    datasets:[]
  });

  const [averageTimePieData,setAverageTimePieData]=useImmer<ChartData<"pie",number[]>>({
    datasets:[]
  });

  const [pieconfig,setPieconfig]=useImmer<ChartOptions<"pie">>({

  });




  // ---- derived states ----
  const totalTimeData:BarData[]=useMemo(()=>{
    return convertToBarDataTotalTime(
      sortTagAnalysisByDate(
        tagAnalysisDictToList(
          props.tagAnalysis.valuesAnalysis
    )));
  },[props.tagAnalysis.valuesAnalysis]);

  const averageTimeData:BarData[]=useMemo(()=>{
    return convertToBarDataAverageTime(
      sortTagAnalysisByDate(
        tagAnalysisDictToList(
          props.tagAnalysis.valuesAnalysis
    )));
  },[props.tagAnalysis.valuesAnalysis]);




  // --- effects ---
  // update bar data on tag analysis changing
  useEffect(()=>{
    const listdata:TimeEventAnalysis2[]=sortTagAnalysisByDate(
      tagAnalysisDictToList(props.tagAnalysis.valuesAnalysis)
    );

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
  },[props.tagAnalysis]);




  // --- handlers ---
  /** chart mode changed from control line */
  function h_chartModeChange(newMode:ChartMode):void
  {
    setChartMode(newMode);
  }

  function h_barClick(chartLabel:string,selectedTagValue:string):void
  {
    console.log(selectedTagValue);
  }


  // --- render ---
  /** render charts section. conditionally renders based on the current chart mode */
  function r_charts():JSX.Element
  {
    if (chartMode=="bar")
    {
      return <>
        <TagAnalysisBarChart chartLabel="Total Time" barColour="#6086b2" bardata={totalTimeData}
          onBarClick={h_barClick}/>

        <TagAnalysisBarChart chartLabel="Average Time" barColour="#de5261" bardata={averageTimeData}
          onBarClick={h_barClick}/>
      </>;
    }

    else if (chartMode=="pie")
    {
      return <>
        <div className="chart pie">
          <h3>Total Time</h3>
          <div className="chart-contain">
            <Pie options={pieconfig} data={totalTimePieData}/>
          </div>
        </div>

        <div className="chart pie">
          <h3>Average Time</h3>
          <div className="chart-contain">
            <Pie options={pieconfig} data={averageTimePieData}/>
          </div>
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