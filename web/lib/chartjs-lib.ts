// functions to convert things to chart js related structures

import _ from "lodash";

/** convert tag analysis value dict, which contains analysis for multiple values of a single TagBreakdownsDict
 *  tag, into bar chart data */
export function convertToBarData(tagAnalysisDict:TagValueAnalysisDict):BarData[]
{
    return _.map(tagAnalysisDict,(analysis:TimeEventAnalysis,tagValue:string):BarData=>{
        return {
            x:tagValue,

            // convert nanoseconds to hours
            y:analysis.totalTime*2.77778e-13
        };
    });
}