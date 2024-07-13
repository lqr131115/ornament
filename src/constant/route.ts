interface Route {
    path:string;
    name:string;
    [key:string]:any;
} 

export const JsRoutes:Route[] = [
    {
        path:"/js/particleTime",
        name:"ParticleTime"
    },
    {
        path:"/js/other",
        name:"Other"
    },
]   