import {createRoot} from "react-dom/client";
import { Bar } from "react-chartjs-2";
import { ChartOptions,ChartData,Chart,CategoryScale,LinearScale,BarElement,Title,
  Tooltip,Legend } from "chart.js";
import {QueryClient,QueryClientProvider,useQuery} from "@tanstack/react-query";

import { getAvailableTimeDatas } from "apis/time-stat-api";

import "./chart-test-index.less";

Chart.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

function ChartTestIndex():JSX.Element
{
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

  // request the available time datas
  const availableTimeDatasQy=useQuery({
    queryKey:["avail-datas"],
    initialData:[],

    async queryFn():Promise<TimeStatDataFile[]>
    {
      return getAvailableTimeDatas();
    }
  });

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