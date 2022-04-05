const stackedBarChart = (_, data) => {

    let node = _;
    let _legends = true;
    let _height = null;

    const _data = data.map(d => {
        d.sum = d.pd + d.pr;
        return d;
    })


    const cats = ['pr', 'pd']

    const color = d3.scaleOrdinal()
        .domain(cats)
        .range(["#333", "#595e62"])

    function updateViz() {

        let [width, height] = [node.node().clientWidth, _height || node.node().clientHeight];

        const y = d3.scaleLinear()
            .domain([0, d3.max(_data, d => d.sum)])
            .range([height * 0.8, height * 0.1]).nice();

        const x = d3.scaleBand()
            .domain(_data.map(d => d.size))
            .range([width * 0.12, width * 0.95])
            .align(0.5)




        const drawData = d3.stack().keys(cats)(_data)
        // console.log(drawData)
        let svg = node.selectAll('.canvas').data([0])
        svg = svg.enter().append('svg').merge(svg)
            .attr('class', 'canvas stackedbarchart')
            .attr('width', width)
            .attr('height', height)

        let groups = svg.selectAll('.groups').data([0])

        groups = groups.enter().append('g').attr('class', 'groups')
            .merge(groups)

        let update = groups.selectAll(".sub_group")
            .data(drawData)
        update = update.enter().append("g").attr('class', 'sub_group')
            .attr('stroke-width', 0.5)
            .style('cursor', isMobile ? 'none' : 'pointer')
            .merge(update).attr("fill", d => color(d.key))
            .attr('stroke', '#000')

        let updatePath = update.selectAll(".bar")
            .data(d => d)
        let enterPath = updatePath.enter().append("rect")


        updatePath.exit().remove()

        updatePath.merge(enterPath)
            .attr('class', d => `bar bar-${d.data.id} noSelect`)
            .attr("x", d => x(d.data.size) + x.bandwidth()*0.25)
            .attr("y", d => y(d[1]))
            .attr("width", d => x.bandwidth()*0.5)
            .attr("height", d => y(d[0]) - y(d[1]))
 
        const x_axis = d3.axisBottom()
            .tickSizeOuter(0)
            .scale(x);

        const y_axis = d3.axisLeft()
            .tickValues(y.ticks(8))
            .tickSizeOuter(0)
            .tickSizeInner(-width * 0.95)
            .tickFormat(d => `${d * 100}%`)
            .scale(y);

        let axis = svg.selectAll('.axis').data([0]);
        axis = axis.enter().insert("g",".groups").attr('class', 'axis').merge(axis);

        let axisX = axis.selectAll('.axis-x').data([0]);
        axisX = axisX.enter().append('g').attr('class', 'axis-x')
            .merge(axisX).attr('transform', `translate(${0}, ${y.range()[0]})`);

        axisX.call(x_axis)
            .selectAll("text")
            .attr("text-anchor", "middle")

        let axisY = axis.selectAll('.axis-y').data([0]);
        axisY = axisY.enter().append("g").attr('class', 'axis-y light')
            .merge(axisY).attr('transform', `translate(${x.range()[0] }, ${0})`);

        axisY.transition().call(y_axis);




    }

    updateViz.legends = function(_) {
        if (typeof _ === 'undefined') return _legends;
        _legends = _;
        return this;
    }
    updateViz.height = function(_) {
        if (typeof _ === 'undefined') return _height;
        _height = _;
        return this;
    }


    return updateViz
}