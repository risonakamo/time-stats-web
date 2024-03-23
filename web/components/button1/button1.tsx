import clsx from "clsx";

import "./button1.less";

interface Button1Props
{
  text:string
  icon:JSX.Element

  disabled?:boolean
  onClick?():void
}

export function Button1(props:Button1Props):JSX.Element
{
  /** handle click. trigger only if not disabled */
  function h_click():void
  {
    if (props.disabled)
    {
      return;
    }

    props.onClick?.();
  }

  const topcx:string=clsx("button1",{
    disabled:props.disabled
  });

  return <div className={topcx} onClick={h_click}>
    {props.icon}
    <p>{props.text}</p>
  </div>;
}