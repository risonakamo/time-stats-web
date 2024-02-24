import {createRoot} from "react-dom/client";
import { Bar } from "react-chartjs-2";
import {ChartConfiguration,CoreChartOptions} from "chart.js";

import "./chart-test-index.less";

function ChartTestIndex():JSX.Element
{
  const barconfig={

  };

  return <>
    hello

    <Bar options={barconfig}/>
  </>;
}

function main()
{
  createRoot(document.querySelector("main")!).render(<ChartTestIndex/>);
}

window.onload=main;