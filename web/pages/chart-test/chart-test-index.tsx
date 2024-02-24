import {createRoot} from "react-dom/client";
import { Bar } from "react-chartjs-2";
import { ChartOptions,ChartData,Chart,CategoryScale,LinearScale,BarElement,Title,
  Tooltip,Legend } from "chart.js";

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

  return <>
    hello

    <Bar options={barconfig} data={bardata}/>
  </>;
}

function main()
{
  createRoot(document.querySelector("main")!).render(<ChartTestIndex/>);
}

window.onload=main;