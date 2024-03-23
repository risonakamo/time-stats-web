import _ from "lodash";

import { FilterBubble } from "components/filter-bubble/filter-bubble";

import { nanoToHours,truncateHour } from "lib/utils";

import "./dataset-info-panel.less";

interface DatasetInfoPanelProps
{
  datasetInfo:DataFileInfo2
  datafile:TimeDataFile
  activeFilters:TagFilter[]

  onTagFilterRemove(filter:TagFilter):void
  onRefresh(datafile:DataFileInfo2):void
}

/** component that displays information about a dataset */
export function DatasetInfoPanel(props:DatasetInfoPanelProps):JSX.Element
{
  /** clicked refresh button. trigger refresh event with the datafile */
  function h_refreshClick():void
  {
    props.onRefresh(props.datasetInfo);
  }

  /** render list of filter bubbles */
  function r_filterBubbles():JSX.Element[]
  {
    return _.map(props.activeFilters,(filter:TagFilter):JSX.Element=>{
      /** bubble was clicked. trigger that the relevant tag filter is beign removed */
      function h_bubbleClick():void
      {
        props.onTagFilterRemove(filter);
      }

      const key:string=`${filter.tag}:${filter.value}`;
      return <FilterBubble tagName={filter.tag} tagValue={filter.value} key={key}
        onClick={h_bubbleClick}/>;
    });
  }

  return <div className="dataset-info-panel">
    <h1>{props.datasetInfo.displayName}</h1>
    <button onClick={h_refreshClick}>refresh</button>

    <div className="filters-display">
      {r_filterBubbles()}
    </div>

    <div className="info-box">
      <p>Total time: {truncateHour(nanoToHours(props.datafile.topAnalysis.totalTime))}</p>
      <p>Average time: {truncateHour(nanoToHours(props.datafile.topAnalysis.averageTime))}</p>
      <p>Number of Events: {props.datafile.topAnalysis.numEvents}</p>
      <p>Last update: ---</p>
    </div>
  </div>;
}