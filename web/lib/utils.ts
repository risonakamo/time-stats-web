// random util functions

import _ from "lodash";

/** convert nanoseconds to hours */
export function nanoToHours(nanos:number):number
{
    return nanos*2.77778e-13;
}

/** add a tag filter to a list of tag filters. tag filter list can only have 1 filter per tag name,
 *  so if the tag name already exists in the filter list, it will be replaced by the new filter */
export function addTagFilter(filters:TagFilter[],newFilter:TagFilter):TagFilter[]
{
    // purge from the tag filter list any filter that has the same tag name as the
    // filter trying to be inserted
    const finalFilters:TagFilter[]=_.reject(filters,(filter:TagFilter):boolean=>{
        return filter.tag==newFilter.tag;
    });

    // add the new filter
    finalFilters.push(newFilter);

    return finalFilters;
}