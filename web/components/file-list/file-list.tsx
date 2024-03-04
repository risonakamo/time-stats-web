import _ from "lodash";
import {clsx} from "clsx";

import "./file-list.less";

interface FileListProps
{
  files:TimeStatDataFile[]

  // filename that is currently selected
  selectedFile:string|null

  // triggered when option that is not already selected is clicked
  onSelect(selectedFile:string):void
}

/** file list for time stat data file selection */
export function FileList(props:FileListProps):JSX.Element
{
  /** render the entries */
  function r_entries():JSX.Element[]
  {
    return _.map(props.files,(datafile:TimeStatDataFile):JSX.Element=>{
      const selected:boolean=datafile.filename==props.selectedFile;

      /** clicked on entry. trigger on select */
      function h_entryClick():void
      {
        if (selected)
        {
          return;
        }

        props.onSelect(datafile.filename);
      }

      const entryCx:string=clsx("entry",{
        selected
      });

      return <div className={entryCx} key={datafile.filename} onClick={h_entryClick}>
        <h2>{datafile.displayName}</h2>
        <div className="info">
          <p className="filename">{datafile.filename}</p>
          <p>2024/04/02 02:34</p>
        </div>
      </div>;
    });
  }

  return <div className="file-list">
    {r_entries()}
  </div>;
}