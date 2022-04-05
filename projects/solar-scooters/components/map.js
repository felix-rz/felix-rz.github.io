function map(stationData, tripData, _) {

    const [width, height] = [_.node().clientWidth, _.node().clientHeight];

    const [mx,my] = [150,50];
    const projection = d3.geoMercator();

    let extent = [
        [width * 0.25, -my * 2],
        [width, height]
    ]

    let legendL = width * 0.8;
    let legendT = my * 2;
    let legendTop = 1 - legendT / height;
    let legendLeft = 0.8;
    if (isMiddleScreen && !isLandscape) {
        extent = [
            [0, -my * 2],
            [width, height]
        ]
        legendT = my * 3;
        legendTop = legendT / height;
        legendLeft = 1 - mx / width;
    }else if(isSmallScreen && !isLandscape){
        extent = [
            [0, -my * 2],
            [width, height]
        ]
        legendT = height - my - 20;
        legendL = 0;
        legendTop = (height - my) / height;

    }
    projection.fitExtent(
        extent,
        mapGeo,
    );

    const path = d3.geoPath()
        .projection(projection);

    const scaleBar = d3.geoScaleBar()
        .projection(projection)
        .extent(extent)
        .top(legendTop)
        .left(legendLeft)
        .tickValues([0, 250, 500])
        .units(d3.geoScaleMeters)
        .labelAnchor('middle')


    let svg = _.selectAll('.animation-layer-svg')
        .data([1])
    svg = svg.enter().append('svg')
        .attr('class', 'animation-layer-svg')
        .merge(svg)
        .attr('width', width)
        .attr('height', height)


    let canvas = _.selectAll('.animation-layer-canvas')
        .data([1])
    cnavas = canvas.enter().append('div').attr('class', 'animation-layer-canvas')
        .style('position', 'absolute')
        .attr('id', 'animation-layer-canvas')
        .style('top', 0)
        .style('left', 0)
        .attr('width', width)
        .attr('height', height)

    new p5(sketch, 'animation-layer-canvas');

    function sketch(p) {
        const tripsV = [];
        p.setup = function() {

            p.createCanvas(width, height);

            tripData.forEach(d => {
                const journeyXY = [];
                let journeyCount = 0;
                const count = d.journey.length - 1;
                for (let i = 0; i < count; i++) {
                    const a = projection(d.journey[i]) //[x,y]
                    const b = projection(d.journey[i + 1])
                    const dis = Math.floor(p.dist(...a, ...b)) * 0.5;

                    for (let t = 0; t < dis; t++) {
                        const x = a[0] + (t / dis) * (b[0] - a[0])
                        const y = a[1] + (t / dis) * (b[1] - a[1])
                        journeyCount++;
                        journeyXY.push([x, y])
                    }
                }

                tripsV.push({
                    vehicle: new VehiclePursue(...journeyXY[0], p, journeyXY, journeyCount, d),
                    journey: journeyXY,
                    count: journeyCount
                })


            })


        }


        p.draw = function() {

            if (loop) {

                p.clear();

                tripsV.forEach(v => {
                    
                    v.vehicle.display();
                    v.vehicle.update();
                    
                })
            }
        }
    }


    const landscape = svg.selectAll('.landscape').data([0]).join('g')
        .attr('class', 'landscape')

    //draw streets
    let streetmap = landscape.selectAll('.streetmap').data([0])
    streetmap = streetmap.enter().append('path')
        .merge(streetmap)
        .datum(mapGeo)
        .attr('class', 'streetmap')
        .attr('d', path)
        .attr('stroke', '#666')
        .attr('stroke-width', 0.2)
        .style('fill', 'none')

    landscape.selectAll('.scalelegend').data([0])
        .join('g')
        .attr('class', 'scalelegend')
        .call(scaleBar);



    //draw stations
    const stations = landscape.selectAll('.stations').data([0])
        .join('g').attr('class', 'stations')

    const station = stations.selectAll('.station').data(stationData);
    station.exit().remove();
    const enterStation = station.enter().append('g').attr('class', 'station')

    enterStation.append('circle').attr('class', 'dot')
        .attr('r', 2).attr('stroke-width', 1).attr('fill', '#999')
        .attr('stroke', '#000')


    enterStation.merge(station)
        .attr('transform', d => {
            d.xy = projection([d['lng'], d['lat']])
            return `translate(${d.xy[0]}, ${d.xy[1]})`
        })

    const legend = landscape.selectAll('.legend').data([0])
        .join('g').attr('class', 'legend')
        .attr('transform', d => `translate(${legendL},${legendT})`)

    legend.selectAll('.trip-icon').data([
            { color: "rgb(171, 5, 13)", name: "unserved trip" },
            { color: "rgb(51,51,51)", name: "served trip" },
        ])
        .join('g').attr('class', 'trip-icon')
        .attr('transform', (d, i) => `translate(0,${i * 15})`)
        .html((d, i) => `
            <circle cx="0" cy="-4" r="4" fill="${d.color}"></circle>
            <text x="10" font-size="12">${d.name}</text>
            `)


    //add icons
    const icons = landscape.selectAll('.icons').data([0])
        .join('g').attr('class', 'icons')

    const icon = icons.selectAll('.icon').data(sgIcons)
        .join('g').attr('class', 'icon')
        .attr('transform', d => `translate(${projection(d.coordinates).join(',')})`)
    icon.selectAll('.icon-img').data(d => [d])
        .join('svg:image').attr('class', 'icon-icon')
        .attr('xlink:href', d => `./static/imgs/${d.icon}`)
        .attr('width', 28)
        .attr('height', 28)
        .attr('x', d => -14)
        .attr('y', d => -14)


    loader.classed('d-none', true);
    container.classed('loading', false);



}