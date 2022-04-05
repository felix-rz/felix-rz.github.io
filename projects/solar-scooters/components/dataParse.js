const fleetSize = [
    {size:78,pd:0.350,pr:0.575},
    {size:156,pd: 0.392,pr:0.550},
    {size:234,pd: 0.417,pr:0.535},
    {size:312,pd: 0.438,pr:0.520},
    {size:390,pd: 0.472,pr:0.491},
    {size:468,pd: 0.457,pr:0.505},
]
     
const reserveTime = [
    {size:1,pd:0.348,pr:0.194},
    {size:5,pd: 0.417,pr:0.535},
    {size:6,pd: 0.414,pr:0.557},
    {size:10,pd: 0.429,pr:0.569},
    {size:12,pd: 0.431,pr:0.567},
    // {size:15,pd: 0.439,pr:0.560},
    // {size:20,pd: 0.445,pr:0.554},
]

const pvSize = [
    {size:0.5,pd:0.12,pr:0.12},
    {size:0.75,pd:0.27,pr:0.35},
    {size:1,pd:0.42,pr:0.57},
    // {size:1.25,pd:0.42,pr:0.57},
    // {size:1.5,pd:0.43,pr:0.57},
    // {size:1.75,pd:0.43,pr:0.57},
    // {size:2,pd:0.43,pr:0.57},
    // {size:4,pd:0.43,pr:0.57},
    {size:6,pd:0.43,pr:0.57},
    // {size:8,pd:0.43,pr:0.57},
    // {size:10,pd:0.43,pr:0.57},
    {size:12,pd:0.43,pr:0.57},
]
// res_time_1,res_time_5,res_time_6,res_time_12,res_time_15,res_time_20,panel_2,panel_0_5,panel_4,panel_0_75,panel_1,panel_6,panel_1_25,panel_8,panel_1_5,panel_10,panel_1_75,panel_12,fleet_78,fleet_156,fleet_234,fleet_312,fleet_390,fleet_468
// 0 -- served without repositioning
// 1 -- served with repositioning
// 2 -- rejected
const sgIcons = [
    {name:'Merlion',icon:"merlion.svg",coordinates:[103.855099,1.286449]},
    {name:'Gardens by the Bay',icon:"gardenbythebay.svg",coordinates:[103.863630,1.281804]},
    {name:'Marina Bay Sands',icon:"marinabay.svg",coordinates:[103.859970,1.285302]}
]

const Stations_row = d3.csv('./static/data/trip_path_data/stations.csv', parseStations);
const Nodes_row = d3.csv('./static/data/trip_path_data/nodes3.csv', parseNodes);
const Edges_row = d3.csv('./static/data/trip_path_data/edges.csv', parseEdges);
const Trips_row = d3.csv('./static/data/trip_path_data/all_cmb.csv', parseTrips);
const TripPaths_row = d3.dsv('\t', './static/data/trip_path_data/trips_paths.csv', parseTripPaths);
const Cloudy_row = d3.csv('./static/data/cloudy_pct.csv', parseCloudy);

const allPaths = {};
const allNodes = {};
// const edgesCost = {};
const mapGeo = {
    "type": "MultiLineString",
    "coordinates": []
}

function parseTripPaths(d) {
    // d['nd_id'] = +d['nd_id'];
    // d['trip_id'] = +d['trip_id'];
    if (!allPaths[d['trip_id']]) allPaths[d['trip_id']] = [];
    allPaths[d['trip_id']].push(d['nd_id'])
    return d;
}

function parseStations(t) {
    let d = {};
    d['sta'] = t['sta'];
    // d['nd_id'] = +t['nd_id'];
    d['lng'] = +t['lng'];
    d['lat'] = +t['lat'];
    return d;
}

function parseNodes(t) {
    let d = {};
    d['nd_id'] = t['node_id'];
    d['lng'] = +t['X'];
    d['lat'] = +t['Y'];
    allNodes[d['nd_id']] = [d['lng'], d['lat']]
    return d;
}

function parseEdges(t) {
    let d = {};
    d['source'] = +t['source']; //node id
    d['target'] = +t['target']; //node id
    d['cost'] = +t['cost']; //length in meter
    // edgesCost[`${d['source']}-${d['target']}`] = d['cost'];
    return d;
}

function parseTrips(d) {

    d['time_o'] = new Date(d['time_o']);
    // d['bty_o'] = +t['bty_o'];
    // d['bty_d'] = +t['bty_d'];

    // if((d['time_o'] >= new Date('2019-03-01')) || (d['time_o'] < new Date('2019-02-01')) || (d['bty_o'] <= d['bty_d']))return;
    if(d['time_o'].getDate() !== new Date('2019-02-17').getDate())return;

    
    d['time_d'] = new Date(d['time_d']);
    d['origin_lon'] = +d['origin_lon'];
    d['origin_lat'] = +d['origin_lat'];
    d['dst_lon'] = +d['dst_lon'];
    d['dst_lat'] = +d['dst_lat'];
    
    d['trip_id'] = d['id'];
    delete(d.id)

    return d;
}

function parseCloudy(d) {
    if (d['city'] !== 'MB') return;

    d['day'] = +d['day'];
    d['e'] = d['e'].replace('ele = ', '').replace(' Wh', '');
    d['pct'] = +d['pct'];

    return d;
}