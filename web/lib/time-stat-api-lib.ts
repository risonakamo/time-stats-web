// functions working with time stat api types

import _ from "lodash";

/** convert tag value analysis dict to list form */
export function tagAnalysisDictToList(tagAnalysisDict:TagValueAnalysisDict):TimeEventAnalysis2[]
{
    return _.map(tagAnalysisDict,(analysis:TimeEventAnalysis,tagValue:string):TimeEventAnalysis2=>{
        return {
            ...analysis,
            tagValue
        };
    });
}

/** sort list of tag analysis by its value */
export function sortTagAnalysisByValue(tagAnalysis:TimeEventAnalysis2[]):TimeEventAnalysis2[]
{
    return _.sortBy(tagAnalysis,(item:TimeEventAnalysis2):string=>{
        return item.tagValue;
    });
}

/** sort list of tag analysis by its earliest date per item */
export function sortTagAnalysisByDate(tagAnalysis:TimeEventAnalysis2[]):TimeEventAnalysis2[]
{
    return _.sortBy(tagAnalysis,(item:TimeEventAnalysis2):number=>{
        return item.earliestEventDate;
    });
}

/** sort list of tag analysis by total time per item */
export function sortTagAnalysisByTotalTime(tagAnalysis:TimeEventAnalysis2[]):TimeEventAnalysis2[]
{
    return _.sortBy(tagAnalysis,(item:TimeEventAnalysis2):number=>{
        return item.totalTime;
    });
}

/** sort list of tag analysis by average time per item */
export function sortTagAnalysisByAverageTime(tagAnalysis:TimeEventAnalysis2[]):TimeEventAnalysis2[]
{
    return _.sortBy(tagAnalysis,(item:TimeEventAnalysis2):number=>{
        return item.averageTime;
    });
}