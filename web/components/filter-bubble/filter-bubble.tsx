import "./filter-bubble.less";

interface FilterBubbleProps
{
  tagName:string
  tagValue:string

  onClick?():void
}

export function FilterBubble(props:FilterBubbleProps):JSX.Element
{
  return <div className="filter-bubble" onClick={props.onClick}>
    <div className="strikethrough"></div>
    <div className="remove-icon"></div>
    <p className="tag-name">{props.tagName}</p>
    <p className="ellipse">...</p>
    <p>{props.tagValue}</p>
  </div>;
}