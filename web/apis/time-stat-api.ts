// api calls with time stat api

import axios from "axios";

const ax=axios.create({
    baseURL:"http://localhost:4200",
});

/** get all available data files */
export async function getAvailableTimeDatas():Promise<TimeStatDataFile[]>
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