function grid(_, data) {

    const [width, height] = [_.node().clientWidth, _.node().clientHeight];

    const ID = data.key;
    const margin = 50;

    let dashboard = _.selectAll('.dashboard-layer')
        .data([1])
    dashboard = dashboard.enter().append('div')
        .attr('class', 'col-12 d-flex dashboard-layer justify-content-center flex-column flex-md-row align-item-center align-item-md-center')


    let dashboardtitle = dashboard.selectAll('.dashboard-layer-title')
        .data([1])
    dashboardtitle = dashboardtitle.enter().append('div')
        .attr('class', 'dashboard-layer-title px-2 pt-2')
        .html(`
                <div class="d-flex flex-md-column flex-row">
                    <div class="fs-5 lh-1">${data.key}</div>
                    <div class="fs-7 text-muted fst-italic">Wh</div>
                </div>
            `)

    let dashboardsvg = dashboard.selectAll('.dashboard-layer-svg')
        .data([1])
    dashboardsvg = dashboardsvg.enter().append('div')
        .attr('class', 'dashboard-layer-svg')
        .merge(dashboardsvg)
       
    const chart = lineChart(dashboardsvg,data.values).w(Math.max(width - 100,150)).h(height * 0.8)



    return chart

}