// typings for time stat server api. all these types should exist on the api side as well
// all duration units are NANOSECONDs

/** collection of tag breakdowns. associated with a list of events.
 *  key: a tag (not the value, but the tag name)
 *  value: breakdown for that particular tag */
type TagBreakdownsDict=Record<string,TagBreakdown>

/** analysis of a tag's values.
 *  key: a tag value (not the name of the tag, but the unique values of the tag)
 *  val: the analysis of all events that have that particular value */
type TagValueAnalysisDict=Record<string,TimeEventAnalysis>

/** an available time data file */
interface TimeStatDataFile
{
    filename:string
    displayName:string
}

/** a tag filter */
interface TagFilter
{
    tag:string
    value:string
}

/** analysis output for a particular time data file */
interface TimeDataFile
{
    topAnalysis:TimeEventAnalysis
    tagsAnalysis:TagBreakdownsDict
}

/** analysis of a list of time events */
interface TimeEventAnalysis
{
    totalTime:number
    averageTime:number

    earliestEventDate:number
}

/** breakdown analysis for a particular tag */
interface TagBreakdown
{
    tag:string

    valuesAnalysis:TagValueAnalysisDict

    averageTime:number
    totalTime:number
}

/** request to get a data file */
interface GetDataRequest
{
    filename:string
    filters:TagFilter[]
}