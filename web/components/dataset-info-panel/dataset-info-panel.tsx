import _ from "lodash";
import {ArrowClockwise, ArrowSquareOut} from "@phosphor-icons/react";

import { FilterBubble } from "components/filter-bubble/filter-bubble";
import { Button1 } from "components/button1/button1";

import { nanoToHours,truncateHour } from "lib/utils";

import "./dataset-info-panel.less";

interface DatasetInfoPanelProps
{
  datasetInfo:DataFileInfo2
  datafile:TimeDataFile
  activeFilters:TagFilter[]
  refreshing:boolean

  onTagFilterRemove(filter:TagFilter):void
  onRefresh(datafile:DataFileInfo2):void
}

/** component that displays information about a dataset */
export function DatasetInfoPanel(props:DatasetInfoPanelProps):JSX.Element
{
  // all control buttons disabled if no sheet url
  const controlButtonsDisabled:boolean=(
    props.datasetInfo.sheetUrl.length==0
  );

  // refresh button is disabled additionally if currently refreshing
  const refreshButtonDisabled:boolean=(
    controlButtonsDisabled
    || props.refreshing
  );

  /** clicked refresh button. trigger refresh event with the datafile */
  function h_refreshClick():void
  {
    if (refreshButtonDisabled)
    {
      return;
    }

    props.onRefresh(props.datasetInfo);
  }

  /** clicked url button. open sheets url of data file */
  function h_urlClick():void
  {
    if (props.datasetInfo.sheetUrl.length==0)
    {
      return;
    }

    window.open(props.datasetInfo.sheetUrl,"_blank");
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

  var refreshButtonText:string="Refresh";

  if (props.refreshing)
  {
    refreshButtonText="Refreshing...";
  }

  return <div className="dataset-info-panel">
    <h1>{props.datasetInfo.displayName}</h1>

    <div className="control-buttons">
      <Button1 text={refreshButtonText} icon={<ArrowClockwise className="icon"/>}
        onClick={h_refreshClick} disabled={refreshButtonDisabled}/>
      <Button1 text="Open Sheets" icon={<ArrowSquareOut className="icon"/>}
        onClick={h_urlClick} disabled={controlButtonsDisabled}/>
    </div>

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