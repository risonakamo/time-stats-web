import {createRoot} from "react-dom/client";
import { Bar } from "react-chartjs-2";
import { ChartOptions,ChartData,Chart,CategoryScale,LinearScale,BarElement,Title,
  Tooltip,Legend } from "chart.js";
import {QueryClient,QueryClientProvider,useQuery,useMutation} from "@tanstack/react-query";
import { useEffect } from "react";
import _ from "lodash";
import {useImmer} from "use-immer";

import { getAvailableTimeDatas,getTimeDatafile } from "apis/time-stat-api";

import "./chart-test-index.less";

Chart.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

interface GetDatafileMqyArgs
{
  dataFilename:string
  dataFilters:TagFilter[]
}

interface BarData
{
  x:string
  y:number
}

function ChartTestIndex():JSX.Element
{
  // --- test data ---
  const barconfig:ChartOptions<"bar">={

  };

  const [bardata,setBardata]=useImmer<ChartData<"bar",BarData[]>>({
    datasets:[
      {
        data:[
          {x:"huh",y:10},
        ]
      },
      {
        data:[
          {x:"huh",y:11},
        ]
      },
    ]
  });



  // --- querys ---
  // request the available time datas
  const availableTimeDatasQy=useQuery<TimeStatDataFile[]>({
    queryKey:["avail-datas"],
    initialData:[],

    async queryFn():Promise<TimeStatDataFile[]>
    {
      return getAvailableTimeDatas();
    },
  });

  // request a data file. no effects - the currently loaded data file is just whatever
  // is in the data field of this qy
  const getDatafileMqy=useMutation<TimeDataFile,Error,GetDatafileMqyArgs>({
    async mutationFn(args:GetDatafileMqyArgs):Promise<TimeDataFile>
    {
      return getTimeDatafile(args.dataFilename,args.dataFilters);
    }
  });



  // --- effects ----
  // test requesting some test data file to do chart rendering
  useEffect(()=>{
    getDatafileMqy.mutate({
      dataFilename:"data2.tsv",
      dataFilters:[]
    });
  },[]);

  // test parsing the data into chart format
  useEffect(()=>{
    if (!getDatafileMqy.data)
    {
      return;
    }

    console.log("data update",getDatafileMqy.data);

    const valuesData:TagValueAnalysisDict=getDatafileMqy.data.tagsAnalysis["item"].valuesAnalysis;

    const newBarData:BarData[]=_.map(valuesData,(analysis:TimeEventAnalysis,tagValue:string):BarData=>{
      return {
        x:tagValue,
        y:analysis.totalTime*2.77778e-13
      };
    });

    setBardata((draft)=>{
      draft.datasets=[{data:newBarData}];
    });
  },[getDatafileMqy.data]);





  // --- render ---
  return <>
    hello

    <Bar options={barconfig} data={bardata}/>
  </>;
}

function main()
{
  createRoot(document.querySelector("main")!).render(
    <QueryClientProvider client={new QueryClient()}>
      <ChartTestIndex/>
    </QueryClientProvider>
  );
}

window.onload=main;