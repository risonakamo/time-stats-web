import "./button1.less";

interface Button1Props
{
  text:string
  icon:JSX.Element
}

export function Button1(props:Button1Props):JSX.Element
{
  return <div className="button1">
    {props.icon}
    <p>{props.text}</p>
  </div>;
}