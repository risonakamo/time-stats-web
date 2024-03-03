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
  /** clicked on the description. switch to the next item in the list of items */
  function h_descriptionClick():void
  {
    // look for the currently selected item
    for (let i=0;i<props.buttons.length;i++)
    {
      // found the selected item
      if (props.buttons[i].value==props.selectedOption)
      {
        // if the selected item is the last item, return the first item instead
        if (i==props.buttons.length-1)
        {
          props.onSelectOption(props.buttons[0].value);
          return;
        }

        // otherwise, return the next item's value
        props.onSelectOption(props.buttons[i+1].value);
        return;
      }
    }
  }

  /** render the buttons */
  function r_buttons():JSX.Element[]
  {
    return _.map(props.buttons,(buttonConfig:ControlLineButtonConfig):JSX.Element=>{
      const selected:boolean=buttonConfig.value==props.selectedOption;

      /** clicked button. trigger option select on the button, if button is not selected */
      function h_buttonClick():void
      {
        if (selected)
        {
          return;
        }

        props.onSelectOption(buttonConfig.value);
      }

      const buttonWrapCx:string=clsx("button-wrap",{
        selected,
      });

      return <div className={buttonWrapCx} onClick={h_buttonClick}>
        {buttonConfig.icon}
      </div>;
    });
  }

  return <div className="toggle-control-line">
    <div className="description" onClick={h_descriptionClick}>{props.text}</div>
    <div className="buttons">
      {r_buttons()}
    </div>
  </div>;
}