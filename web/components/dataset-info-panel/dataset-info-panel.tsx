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
      <div className="filter">
        <div className="strikethrough"></div>
        <div className="remove-icon"></div>
        <p className="tag-name">Category</p>
        <p className="ellipse">...</p>
        <p>sk2</p>
      </div>

      <div className="filter">
        <div className="strikethrough"></div>
        <div className="remove-icon"></div>
        <p className="tag-name">Item</p>
        <p className="ellipse">...</p>
        <p>3</p>
      </div>
    </div>

    <div className="info-box">
      <p>Total time: {nanoToHours(props.datafile.topAnalysis.totalTime)}</p>
      <p>Average time: {nanoToHours(props.datafile.topAnalysis.averageTime)}</p>
      <p>Last update: ---</p>
    </div>
  </div>;
}