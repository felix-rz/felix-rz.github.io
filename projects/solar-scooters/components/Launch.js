const graphContainer = d3.select('#a-graph');
const slidesContainer = d3.select('.slides');
const gridsContainer = d3.select('.grids')
const loader = d3.select('#loader');

let currentScenario = "fleet_78";
let loop = false;

Promise.all([Stations_row, Nodes_row, Edges_row, Cloudy_row, TripPaths_row, Trips_row])
    .then(([Stations, Nodes, Edges, Cloudy, TripPaths, Trips]) => {

        Trips.forEach(d => {
            d['nodes'] = [];
            allPaths[d['trip_id']].forEach(n => {
                d['nodes'].push(allNodes[n])
            })
            d['journey'] = [
                [d['dst_lon'], d['dst_lat']],
                ...d['nodes'],
                [d['origin_lon'], d['origin_lat']],
            ]
        })


        Edges.forEach(d => {
            mapGeo.coordinates.push([
                allNodes[d['source']],
                allNodes[d['target']]
            ])
        })


        map(Stations, Trips, graphContainer)

        const cloudyByE = d3.nest().key(d => d['e']).entries(Cloudy);
        const cloudyCharts = [];

        gridsContainer.selectAll('.grid').data(cloudyByE)
            .join('div').attr('class', 'grid col-6 col-lg-4 position-relative d-flex')
            .each(function(d, i) {
                d3.select(this).call(g => {
                   
                    const chart = grid(g, d);
                    chart(0)
                    cloudyCharts.push(chart)
                })
            });

        d3.select('#day-input').on('input', function() {

            setTimeout(() => {
                const day = this.value;
                d3.select('#day-value').html(day)
                cloudyCharts.forEach(d => {
                    d(day)
                })
            }, 50);

        })
        

        let defaultSelected = {
            fleet: 0,
            res_time: 0,
            panel: 0
        }

        const slidesData = [{
                title: 'The Fleet Size',
                slides: [{

                        html: `
                            <p>More scooters mean higher operational costs for operators, so a balance between a small fleet size and a high service rate is preferred.</p>
                            <p>What is smallest fleet size that can serve most trips?</p>
                            `,
                        options: { data: fleetSize, default: 'fleet' },
                        action: () => {
                            d3.selectAll('.variable').classed('selected', false)
                            d3.select('.variable-fleetsize').classed('selected', true)
                            d3.select('.variable-fleetsize').select('.value').html('348?')
                            d3.select('.variable-time').select('.value').html('5 mins')
                            d3.select('.variable-pv').select('.value').html(`12 &#13217;`)


                            currentScenario = `fleet_${fleetSize[defaultSelected["fleet"]].size}`;
                        }
                    },
                    {
                        html: `
                            <p>Compared to a fleet size of 348 scooters in the study period, we found that a much lower number of vehicles could serve almost all trips. Specifically, we selected a fleet size of 234 scooters as a good outcome where over 95% of all trips are served, but offering a 33% reduction compared to the real-world case.</p>
                        `,
                        chart: fleetSize,
                        action: () => {
                            d3.selectAll('.variable').classed('selected', false)
                            d3.select('.variable-fleetsize').classed('selected', true)
                            d3.select('.variable-fleetsize').select('.value').html('234')
                            d3.select('.variable-time').select('.value').html('5 mins')
                            d3.select('.variable-pv').select('.value').html(`12 &#13217;`)

                            currentScenario = `fleet_234`;
                        }
                    },
                ]
            },
            {
                title: 'The Reservation Time',
                slides: [{

                        html: `
                        <p>As an on-demand service, users can request a scooter to reposition to the request location even if one would not be available immediately. Depending on the acceptable maximum waiting time, different ratio of trips can be served by the fleet of scooters.</p>
                        <p>What is the minimum reservation time (minutes) that can serve most trips?</p>
                        `,
                        options: { data: reserveTime, default: 'res_time' },
                        action: () => {
                            d3.selectAll('.variable').classed('selected', false)
                            d3.select('.variable-time').classed('selected', true)
                            d3.select('.variable-fleetsize').select('.value').html('234')
                            d3.select('.variable-time').select('.value').html('5 mins?')
                            d3.select('.variable-pv').select('.value').html(`12 &#13217;`)

                            currentScenario = `res_time_${reserveTime[defaultSelected["res_time"]].size}`;

                        }
                    },
                    {
                        html: `
                        <p>We found that the service rate grows significantly when the reservation time increases from 1 to 5 minutes. Then, it grows slowly from 5 to 20 minutes, and it is already above 99% for 10 minutes.</p>
                        `,
                        chart: reserveTime,
                        action: () => {
                            d3.selectAll('.variable').classed('selected', false)
                            d3.select('.variable-time').classed('selected', true)
                            d3.select('.variable-fleetsize').select('.value').html('234')
                            d3.select('.variable-time').select('.value').html('10 mins')
                            d3.select('.variable-pv').select('.value').html(`12 &#13217;`)

                            currentScenario = `panel_12`;
                        }
                    },
                ]
            },
            {
                title: 'The Solar Panel Size',
                slides: [{

                        html: `
                        <p>Considering the limited stations in urban areas and the saving of operational cost, selecting an appropriate size for solar panels is vital for establishing an efficient solution.</p>
                        <p>What is smallest solar panel size (&#13217;) that can serve most trips?</p>
                        `,
                        options: { data: pvSize, default: 'panel' },
                        action: () => {
                            d3.selectAll('.variable').classed('selected', false)
                            d3.select('.variable-pv').classed('selected', true)
                            d3.select('.variable-fleetsize').select('.value').html('234')
                            d3.select('.variable-time').select('.value').html('10 mins')
                            d3.select('.variable-pv').select('.value').html(`12 &#13217; ?`)

                            currentScenario = `panel_${pvSize[defaultSelected["panel"]].size}`.replace('.', '_');
                        }
                    },
                    {
                        html: `
                        <p>It is found that each station needs solar panels at 1&#13217; to serve 99.7% of all real trips.</p>
                        `,
                        chart: pvSize,
                        action: () => {
                            d3.selectAll('.variable').classed('selected', false)
                            d3.select('.variable-pv').classed('selected', true)
                            d3.select('.variable-fleetsize').select('.value').html('234')
                            d3.select('.variable-time').select('.value').html('10 mins')
                            d3.select('.variable-pv').select('.value').html(`1 &#13217;`)

                            currentScenario = `panel_1`;
                        }
                    },
                ]
            },
        ]

        const slidesData_slideonly = slidesData.reduce((a, val) => a.concat(val.slides), []);


        const slideContent = slidesContainer.selectAll('.slide-section').data(slidesData)
            .join('div').attr('class', 'slide-section col-12 d-flex flex-column align-items-lg-center');
        slideContent.append('h2').attr('class', 'sticky-top col-12 col-md-10 col-xl-9 bg')
            .html(d => d.title);
        const slide = slideContent.selectAll('.slide').data(d => d.slides)
            .join('div').attr('class', 'slide col-12 col-md-10 col-xl-9')
            .html(d => `<div class="bg">${d.html}</div>`)
        slide.filter(d => d.hasOwnProperty('options'))
            .each(function(d) {
                d3.select(this).call(g => {
                    createEvent(g, d.options)
                })
            });
        slide.filter(d => d.hasOwnProperty('chart'))
            .each(function(d) {
                d3.select(this).call(g => {
                    // createChart(g, d.chart)
                    stackedBarChart(g, d.chart).height(200)()
                })
            });
        //make select events
        function createEvent(dom, data) {
            const options = dom.selectAll('.options').data([0])
                .join('div').attr('class', 'options bg');
            options.append('div').attr('class', 'options-divider d-flex align-items-center mb-3 mt-5')
                .html(`
                        <div class="pe-2">Select a value</div>
                        <div class="divider flex-grow-1 border-top"></div>
                    `);
            const alloptions = options.selectAll('.option').data(data.data)
                .join('div').attr('class', (d, i) => `option border ${i === defaultSelected[data.default] ? 'selected' : ''}`)
                .html(d => d.size)
            alloptions.on('click', function(d, i) {
                alloptions.classed('selected', false)
                d3.select(this).classed('selected', true)
                defaultSelected[data.default] = i;

                currentScenario = `${data.default}_${d.size}`.replace('.', '_');
                
            })
           
        }

        document.addEventListener('scroll', detectScroll);
        const slidesNodes = document.querySelectorAll('.slide');
        const [top, bottom] = [h * .15, h * .95];
        let currentSlideId = null;
        const triggerY = isLandscape ? 0.4 : 0.2;

        const exitSlides = [document.querySelector("#resilience"), document.querySelector('#setting'), document.querySelector("#cover")]

        function detectScroll() {
            window.requestAnimationFrame(() => {
                slidesNodes.forEach((slide, i) => {
                    const pageBox = slide.getBoundingClientRect()
                    const trigger = (pageBox.bottom - pageBox.top) * triggerY + pageBox.top;

                    if (trigger > top && trigger < bottom) {

                        if (i !== currentSlideId) {
                            currentSlideId = i;
                            slidesData_slideonly[currentSlideId].action();
                            
                            loop = true;
                        }

                    }

                })

                exitSlides.forEach((exit) => {
                    const _pageBox = exit.getBoundingClientRect()
                    const _trigger = (_pageBox.bottom - _pageBox.top) * triggerY + _pageBox.top;

                    if (_trigger > top && _trigger < bottom) {
                        if (exit.id !== currentSlideId) {
                            currentSlideId = exit.id;
                            loop = false;
                        }

                    }
                })
            });
        }


        window.addEventListener("resize", () => {
            const _tempW = window.innerWidth;
            if (_tempW === w && isSmallScreen) return;

            getSizes();

        });


    })