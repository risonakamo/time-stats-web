// types enhancing time-stat api types but not actually present in the api itself

/** same as time event analysis, but with extra info so it can stand alone or in a list
 *  instead of the dict */
interface TimeEventAnalysis2 extends TimeEventAnalysis
{
    tagValue:string
}