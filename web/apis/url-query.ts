/** parse url search args for chart page */
export function getChartPageArgs():ChartPageUrlArgs
{
    const args:URLSearchParams=new URLSearchParams(location.search);

    return {
        selected:args.get("selected")
    };
}

/** set the selected url arg */
export function setSelectedUrlArg(selected:string):void
{
    const args:URLSearchParams=new URLSearchParams(location.search);
    args.set("selected",selected);
    history.replaceState("","",`${location.pathname}?${args}`);
}