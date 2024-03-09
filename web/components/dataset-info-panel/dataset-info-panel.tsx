import { FilterBubble } from "components/filter-bubble/filter-bubble";

import { nanoToHours } from "lib/utils";

import "./dataset-info-panel.less";

interface DatasetInfoPanelProps
{
  datasetInfo:TimeStatDataFile
  datafile:TimeDataFile
}

/** component that displays information about a dataset */
export function DatasetInfoPanel(props:DatasetInfoPanelProps):JSX.Element
{
  return <div className="dataset-info-panel">
    <h1>{props.datasetInfo.displayName}</h1>

    <div className="filters-display">
      <FilterBubble tagName="Category" tagValue="sk2"/>
      <FilterBubble tagName="item" tagValue="3"/>
    </div>

    <div className="info-box">
      <p>Total time: {nanoToHours(props.datafile.topAnalysis.totalTime)}</p>
      <p>Average time: {nanoToHours(props.datafile.topAnalysis.averageTime)}</p>
      <p>Last update: ---</p>
    </div>
  </div>;
}