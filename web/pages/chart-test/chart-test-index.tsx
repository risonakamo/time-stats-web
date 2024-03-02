import {createRoot} from "react-dom/client";
import { Chart,CategoryScale,LinearScale,BarElement,Title,Colors,
  Tooltip,Legend,ArcElement } from "chart.js";
import {QueryClient,QueryClientProvider,useQuery,useMutation} from "@tanstack/react-query";
import { useEffect } from "react";
import _ from "lodash";
import { TagBreakdownAnalysisPanel } from
  "components/tag-breakdown-analysis-panel/tag-breakdown-analysis-panel";

import { getAvailableTimeDatas,getTimeDatafile } from "apis/time-stat-api";

import "./chart-test-index.less";

Chart.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,Colors,ArcElement);

interface GetDatafileMqyArgs
{
  dataFilename:string
  dataFilters:TagFilter[]
}

function ChartTestIndex():JSX.Element
{
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
      dataFilename:"lynette2.tsv",
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
  },[getDatafileMqy.data]);





  // --- render ---
  /** render a tag analysis panel for every tag breakdown */
  function r_tagAnalysisPanels():JSX.Element[]
  {
    return _.map(
      getDatafileMqy.data?.tagsAnalysis,
      (tagBreakdown:TagBreakdown,tagName:string):JSX.Element=>{
        return <TagBreakdownAnalysisPanel key={tagName} tagAnalysis={tagBreakdown}/>
      }
    );
  }

  return <>
    <section className="file-list">

    </section>

    <section className="contents">
      {r_tagAnalysisPanels()}
    </section>

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