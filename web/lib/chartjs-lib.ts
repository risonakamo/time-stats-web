// functions to convert things to chart js related structures

import _ from "lodash";

/** convert tag analysis value dict, which contains analysis for multiple values of a single TagBreakdownsDict
 *  tag, into bar chart data */
export function convertToBarData(tagAnalysisList:TimeEventAnalysis2[]):BarData[]
{
    return _.map(tagAnalysisList,(analysis:TimeEventAnalysis2,i:number):BarData=>{
        return {
            x:analysis.tagValue,

            // convert nanoseconds to hours
            y:analysis.totalTime*2.77778e-13,
        };
    });
}