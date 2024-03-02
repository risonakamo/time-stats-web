/** typing of chartjs bar chart */
interface BarData
{
    x:string
    y:number
}

/** typing of chartjs pie data */
interface PieData
{
    value:number
    id:string
}

/** created from array of PieData. pie data is split into 2 parts to be given to the pie chart */
interface SplitPieData
{
    data:number[]
    labels:string[]
}