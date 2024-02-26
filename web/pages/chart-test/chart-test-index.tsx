import {createRoot} from "react-dom/client";
import { Bar } from "react-chartjs-2";
import { ChartOptions,ChartData,Chart,CategoryScale,LinearScale,BarElement,Title,
  Tooltip,Legend } from "chart.js";
import {QueryClient,QueryClientProvider,useQuery,useMutation} from "@tanstack/react-query";
import { useEffect } from "react";

import { getAvailableTimeDatas,getTimeDatafile } from "apis/time-stat-api";

import "./chart-test-index.less";

Chart.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

interface GetDatafileMqyArgs
{
  dataFilename:string
  dataFilters:TagFilter[]
}

function ChartTestIndex():JSX.Element
{
  // --- test data ---
  const barconfig:ChartOptions<"bar">={

  };

  const bardata:ChartData<"bar">={
    labels:["thing1","thing2","thing3"],
    datasets:[
      {
        label:"data1",
        data:[1,10,50],
      },
      {
        label:"data2",
        data:[5,3]
      }
    ]
  };



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
      dataFilename:"data1.tsv",
      dataFilters:[]
    });
  },[]);


  console.log("data",getDatafileMqy.data);

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