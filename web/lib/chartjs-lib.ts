// functions to convert things to chart js related structures

import _ from "lodash";

/** convert tag analysis value dict, which contains analysis for multiple values of a single TagBreakdownsDict
 *  tag, into bar chart data, using total time as the value */
export function convertToBarDataTotalTime(tagAnalysisList:TimeEventAnalysis2[]):BarData[]
{
    return _.map(tagAnalysisList,(analysis:TimeEventAnalysis2,i:number):BarData=>{
        return {
            x:analysis.tagValue,

            // convert nanoseconds to hours
            y:analysis.totalTime*2.77778e-13,
        };
    });
}

/** convert tag analysis value dict, which contains analysis for multiple values of a single TagBreakdownsDict
 *  tag, into bar chart data, using average time as the value */
export function convertToBarDataAverageTime(tagAnalysisList:TimeEventAnalysis2[]):BarData[]
{
    return _.map(tagAnalysisList,(analysis:TimeEventAnalysis2,i:number):BarData=>{
        return {
            x:analysis.tagValue,

            // convert nanoseconds to hours
            y:analysis.averageTime*2.77778e-13,
        };
    });
}

/** convert bar data to pie data */
export function bardataToPiedata(bardata:BarData[]):PieData[]
{
    return _.map(bardata,(data:BarData):PieData=>{
        return {
            value:data.y,
            id:data.x
        };
    });
}

/** convert list of pie data into split pie data */
export function splitPieData(piedatas:PieData[]):SplitPieData
{
    return {
        data:_.map(piedatas,(data:PieData):number=>{
            return data.value;
        }),
        labels:_.map(piedatas,(data:PieData):string=>{
            return data.id;
        })
    };
}