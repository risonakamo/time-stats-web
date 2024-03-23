// api calls with time stat api

import axios from "axios";

const ax=axios.create({
    baseURL:`http://${window.location.hostname}:4200`,
});

/** get all available data files */
export async function getAvailableTimeDatas():Promise<DataFileInfo2[]>
{
    return (await ax.get("/data-names")).data;
}

/** get a target datafile with options */
export async function getTimeDatafile(filename:string,filters:TagFilter[]):Promise<TimeDataFile>
{
    const request:GetDataRequest={
        filename,
        filters
    };

    return (await ax.post("/get-data",request)).data;
}

/** request a datafile to be updated */
export async function updateDataFile(filename:string):Promise<void>
{
    const request:UpdateDataRequest={
        filename
    };

    return ax.post("/update-data",request);
}