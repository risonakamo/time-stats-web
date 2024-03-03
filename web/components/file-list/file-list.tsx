import "./file-list.less";

interface FileListProps
{

}

export function FileList(props:FileListProps):JSX.Element
{
  return <div className="file-list">
    <div className="entry">
      <h2>rouge</h2>
      <p>rouge.csv</p>
      <p>2024/04/02</p>
    </div>
    <div className="entry">
      <h2>rouge</h2>
      <p>rouge.csv</p>
      <p>2024/04/02</p>
    </div>
    <div className="entry">
      <h2>rouge</h2>
      <p>rouge.csv</p>
      <p>2024/04/02</p>
    </div>
  </div>;
}