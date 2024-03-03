import _ from "lodash";
import {clsx} from "clsx";

import "./toggle-control-line.less";

interface ToggleControlLineProps
{
  text:string
  buttons:ControlLineButtonConfig[]

  selectedOption:string

  onSelectOption(newOption:string):void
}

export interface ControlLineButtonConfig
{
  icon:JSX.Element
  value:string
}

/** control line toggleable switch component */
export function ToggleControlLine(props:ToggleControlLineProps):JSX.Element
{
  /** render the buttons */
  function r_buttons():JSX.Element[]
  {
    return _.map(props.buttons,(buttonConfig:ControlLineButtonConfig):JSX.Element=>{
      const disabled:boolean=buttonConfig.value==props.selectedOption;

      /** clicked button. trigger option select on the button, if button is not disabled */
      function h_buttonClick():void
      {
        if (disabled)
        {
          return;
        }

        console.log("huh",buttonConfig.value);
        props.onSelectOption(buttonConfig.value);
      }

      const buttonWrapCx:string=clsx("button-wrap",{
        disabled,
      });

      return <div className={buttonWrapCx} onClick={h_buttonClick}>
        {buttonConfig.icon}
      </div>;
    });
  }

  return <div className="toggle-control-line">
    <div className="description">{props.text}</div>
    <div className="buttons">
      {r_buttons()}
    </div>
  </div>;
}