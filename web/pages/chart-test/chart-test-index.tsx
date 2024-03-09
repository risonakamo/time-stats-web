import {createRoot} from "react-dom/client";
import { Chart,CategoryScale,LinearScale,BarElement,Title,Colors,
  Tooltip,Legend,ArcElement } from "chart.js";
import {QueryClient,QueryClientProvider,useQuery,useMutation} from "@tanstack/react-query";
import { useEffect,useMemo,useState } from "react";
import _ from "lodash";
import { useImmer } from "use-immer";

import { TagBreakdownAnalysisPanel } from
  "components/tag-breakdown-analysis-panel/tag-breakdown-analysis-panel";
import { DatasetInfoPanel } from "components/dataset-info-panel/dataset-info-panel";
import { FileList } from "components/file-list/file-list";

import { getAvailableTimeDatas,getTimeDatafile } from "apis/time-stat-api";
import { getChartPageArgs,setSelectedUrlArg } from "apis/url-query";

import "./chart-test-index.less";

Chart.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,Colors,ArcElement);

interface GetDatafileMqyArgs
{
  dataFilename:string
  dataFilters:TagFilter[]
}

function ChartTestIndex():JSX.Element
{
  // --- states ---
  const [selectedDataFileName,setSelectedDataFileName]=useState<string|null>(null);
  const [activeFilters,setActiveFilters]=useImmer<TagFilter[]>([]);



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
    },

    onError(err):void
    {
      console.log(err);
    }
  });



  // ---- derived state ----
  // the current datafile info corresponding with the selected datafile name. changes when the selected
  // datafile name changes or the data changes
  const currentDatafileInfo:TimeStatDataFile|undefined=useMemo(()=>{
    if (!getDatafileMqy.data)
    {
      return undefined;
    }

    return _.find(availableTimeDatasQy.data,(datafile:TimeStatDataFile):boolean=>{
      return datafile.filename==selectedDataFileName;
    });
  },[
    getDatafileMqy.data,
    selectedDataFileName,
    availableTimeDatasQy.data
  ]);



  // --- effects ----
  // on selected data file name change, request new data. also change the url query
  useEffect(()=>{
    if (!selectedDataFileName)
    {
      return;
    }

    getDatafileMqy.mutate({
      dataFilename:selectedDataFileName,
      dataFilters:activeFilters
    });

    setSelectedUrlArg(selectedDataFileName);
  },[selectedDataFileName,activeFilters]);

  // on page load, set the selected data file name to the one in the args, if any
  useEffect(()=>{
    const args:ChartPageUrlArgs=getChartPageArgs();

    if (!args.selected)
    {
      return;
    }

    setSelectedDataFileName(args.selected);
  },[]);





  // --- handlers ---
  /** file list selected a file. set the selected data file state */
  function h_onFilelistSelect(newSelectedFile:string):void
  {
    setSelectedDataFileName(newSelectedFile);
  }

  /** requested to remove tag filter. modify tag filter state to remove the target filter */
  function h_tagFilterRemove(removeFilter:TagFilter):void
  {
    setActiveFilters((draft)=>{
      _.remove(draft,(filter:TagFilter):boolean=>{
        return filter.tag==removeFilter.tag && filter.value==removeFilter.value;
      });
    });
  }





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

  /** render the info panel zone. only renders if have enough information */
  function r_infoPanel():JSX.Element
  {
    if (!getDatafileMqy.data || !currentDatafileInfo)
    {
      return <h1>no data loaded</h1>;
    }

    return <DatasetInfoPanel datafile={getDatafileMqy.data} datasetInfo={currentDatafileInfo}
      activeFilters={activeFilters} onTagFilterRemove={h_tagFilterRemove}/>;
  }

  return <>
    <section className="file-list">
      <FileList files={availableTimeDatasQy.data} selectedFile={selectedDataFileName}
        onSelect={h_onFilelistSelect}/>
    </section>

    <section className="contents">
      <div className="info-zone">
        {r_infoPanel()}
      </div>

      <div className="tag-analysis">
        {r_tagAnalysisPanels()}
      </div>
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