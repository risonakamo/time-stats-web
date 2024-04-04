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

import { getAvailableTimeDatas,getTimeDatafile,updateDataFile } from "apis/time-stat-api";
import { getChartPageArgs,setSelectedUrlArg } from "apis/url-query";

import { addTagFilter } from "lib/utils";

import "./chart-test-index.less";

Chart.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,Colors,ArcElement);

function ChartTestIndex():JSX.Element
{
  // --- states ---
  const [selectedDataFileName,setSelectedDataFileName]=useState<string|null>(null);
  const [activeFilters,setActiveFilters]=useImmer<TagFilter[]>([]);



  // --- querys ---
  // request the available time datas
  const availableTimeDatasQy=useQuery<DataFileInfo2[]>({
    queryKey:["avail-datas"],
    initialData:[],

    async queryFn():Promise<DataFileInfo2[]>
    {
      return getAvailableTimeDatas();
    },
  });

  // request a data file
  const getDatafileQy=useQuery<TimeDataFile|null>({
    queryKey:["datafile"],
    initialData:null,

    refetchOnMount:false,
    refetchOnReconnect:false,
    refetchOnWindowFocus:false,

    async queryFn():Promise<TimeDataFile|null>
    {
      if (!selectedDataFileName)
      {
        return null;
      }

      return getTimeDatafile(selectedDataFileName,activeFilters);
    },
  });

  // call to update the target data file. calls refresh afterward.
  // todo: this should probably just update the current datafile??
  // since it is refreshing the current data file. it should be impossible
  // to refresh anything other than the current datafile. but i guess that's
  // just how the event is coded right now.
  const updateDataFileMqy=useMutation({
    async mutationFn(args:{filename:string}):Promise<void>
    {
      return updateDataFile(args.filename);
    },

    onSettled():void
    {
      console.log("refetching file after update");
      getDatafileQy.refetch();
    }
  });



  // ---- derived state ----
  // the current datafile info corresponding with the selected datafile name. changes when the selected
  // datafile name changes or the data changes. made from the selected filename and the list of
  // retrieved data files
  const currentDatafileInfo:DataFileInfo2|undefined=useMemo(()=>{
    if (!getDatafileQy.data)
    {
      return undefined;
    }

    return _.find(availableTimeDatasQy.data,(datafile:DataFileInfo2):boolean=>{
      return datafile.filename==selectedDataFileName;
    });
  },[
    getDatafileQy.data,
    selectedDataFileName,
    availableTimeDatasQy.data
  ]);

  // set of names of tags that are being actively filtered
  const activeFilterTagNames:Set<string>=useMemo(()=>{
    return new Set(_.map(activeFilters,(filter:TagFilter):string=>{
      return filter.tag;
    }));
  },[activeFilters]);



  // --- effects ----
  // on selected data file name change, request new data. change the page's url ?querys to reflect
  // the selected data file
  useEffect(()=>{
    if (!selectedDataFileName)
    {
      return;
    }

    getDatafileQy.refetch();

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

  // global key controls
  useEffect(()=>{
    window.onkeydown=(e:KeyboardEvent)=>{
      if (e.key=="Escape")
      {
        popLastFilter();
      }
    };
  },[]);



  // --- state funcs ---
  // remove the last filter in the active filters list
  function popLastFilter():void
  {
    setActiveFilters((draft)=>{
      draft.pop();
    });
  }



  // --- handlers ---
  /** file list selected a file. set the selected data file state, if it is different from the
   *  current. reset active filters. */
  function h_onFilelistSelect(newSelectedFile:string):void
  {
    if (newSelectedFile==selectedDataFileName)
    {
      return;
    }

    setActiveFilters([]);
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

  /** analysis panel requesting to add a tag filter. add the filter */
  function h_analysisPanelAddFilter(newFilter:TagFilter):void
  {
    setActiveFilters((draft)=>{
      return addTagFilter(draft,newFilter);
    });
  }

  /** clicked on datafile refresh button. trigger refresh of the target file */
  function h_datafileRefresh(datafile:DataFileInfo2):void
  {
    updateDataFileMqy.mutateAsync({
      filename:datafile.filename
    });
  }





  // --- render ---
  /** render a tag analysis panel for every tag breakdown, except ones that have filters
   *  enabled on them */
  function r_tagAnalysisPanels():JSX.Element[]
  {
    return _(getDatafileQy.data?.tagsAnalysis)

    // filter out all items that filters are active for
    .pickBy((tagBreakdown:TagBreakdown,tagName:string):boolean=>{
      return !activeFilterTagNames.has(tagName);
    })

    // create panel for remaining tags
    .map(
      (tagBreakdown:TagBreakdown,tagName:string):JSX.Element=>{
        return <TagBreakdownAnalysisPanel key={tagName} tagAnalysis={tagBreakdown}
          onTagFilterCreate={h_analysisPanelAddFilter}/>
      }
    )
    .value();
  }

  /** render the info panel zone. only renders if have enough information */
  function r_infoPanel():JSX.Element
  {
    if (!getDatafileQy.data || !currentDatafileInfo)
    {
      return <h1>no data loaded</h1>;
    }

    return <DatasetInfoPanel datafile={getDatafileQy.data} datasetInfo={currentDatafileInfo}
      activeFilters={activeFilters} onTagFilterRemove={h_tagFilterRemove} onRefresh={h_datafileRefresh}/>;
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