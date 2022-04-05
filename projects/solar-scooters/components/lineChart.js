const lineChart = (_, data) => {

    let _y = "pct";
    let _x = "day";
    let _w = null;
    let _h = null;
    let container = _;

    const fillColor = '#595e62';
    let fillColor_Highlight = "#333";

    let svg = container.selectAll('svg').data([0])
    svg = svg.enter().append('svg').merge(svg)
        .attr('class', 'linechart')

    svg.selectAll("linearGradient").data([0, 1])
        .join('linearGradient')
        // .attr("gradientUnits", "userSpaceOnUse")
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '100%')
        .attr('y2', '0%')
        .attr('id', d => d === 0 ? `normal-grad` : 'highlight-grad')
        .html(d => `
                <stop stop-color="${d === 0 ? fillColor : fillColor_Highlight}" stop-opacity="1" offset="0%"></stop>
                <stop stop-color="${d === 0 ? fillColor : fillColor_Highlight}" stop-opacity="0.4" offset="30%"></stop>
                <stop stop-color="${d === 0 ? fillColor : fillColor_Highlight}" stop-opacity="0.4" offset="100%"></stop>
                `)




    let axis = svg.selectAll('.axis').data([0])
    axis = axis.enter().insert("g", '.groups').attr('class', 'axis').merge(axis)

    const dateRange = data.map(d => d[_x]);

    const scaleY = d3.scaleLinear().domain([0, d3.max(data, d => d[_y])]);
    const scaleX = d3.scalePoint().domain(dateRange);
    const area = d3.area()
    const area_highlight = d3.area()
   
    const days = data.length;

    function updateViz(highlight) {



        const [width, height] = [_w || container.node().clientWidth, _h || container.node().clientHeight];
        const [mw, mh] = [40, 5]

        const wRange = [0, width - mw];
        const hRange = [height - mh, mh * 2]
        scaleY.range(hRange)
        scaleX.range(wRange)

        area.y1(d => scaleY(0))
            .y0(d => scaleY(d[_y]))
            .x(d => scaleX(d[_x]))

        area_highlight.y1(d => scaleY(0))
            .y0(d => scaleY(d[_y]))
            .x(d => scaleX(d[_x]))

        const barW = (wRange[1] - wRange[0]) / days * 0.9;

        const highlightData = [];
        let lastHighlightValue = 0;
        data.forEach(d => {

            if (d[_x] <= highlight) {
                highlightData.push(d);
                lastHighlightValue = d[_y];
            }
        })
        
        if (lastHighlightValue < 0.5) {
            fillColor_Highlight = "rgba(171, 5, 13,0.6)";
        }else{
            fillColor_Highlight = "#333";
        }



        svg.attr('width', width).attr('height', height)

        let updateShadow = svg.selectAll('.lineshadow').data([data])
        updateShadow.exit().remove();
        let enterShadow = updateShadow.enter().append('path').attr('class', 'lineshadow')
        enterShadow.merge(updateShadow)
            .attr("fill", fillColor)
            .attr('fill-opacity', 0.4)
            .attr('stroke-width', 0)
            .attr('d', area)


        let updateHighlight = svg.selectAll('.linehighlight').data([highlightData])
        updateHighlight.exit().remove();
        let enterHighlight = updateHighlight.enter().append('path').attr('class', 'linehighlight')
        enterHighlight.merge(updateHighlight)
            .attr("fill", fillColor_Highlight)
            .attr('stroke-width', 0)
            .attr('d', area_highlight)



        // axis
        const x_axis = d3.axisBottom()
            .tickValues([dateRange[0], dateRange[dateRange.length - 1]])
            .tickSizeOuter(0)
            .tickSizeInner(5)
            // .tickFormat(d => formatDate(moment(d)))
            .scale(scaleX);

        const y_axis = d3.axisRight()
            .tickValues(scaleY.ticks(3))
            .tickSizeOuter(0)
            .tickSizeInner(scaleX.range()[0] - scaleX.range()[1])
            .tickFormat(d => `${(d * 100).toFixed(0)}%`)
            .scale(scaleY);

        let axisX = axis.selectAll('.axis-x').data([0]);
        axisX = axisX.enter().append('g').attr('class', 'axis-x')
            .merge(axisX).attr('transform', `translate(${0}, ${scaleY.range()[0]})`);

        axisX.call(x_axis);


        let axisY = axis.selectAll('.axis-y').data([0]);
        axisY = axisY.enter().append("g").attr('class', 'axis-y light')
            .merge(axisY).attr('transform', `translate(${scaleX.range()[1]}, ${0})`);

        axisY.transition().call(y_axis);



    }

    updateViz.h = function(_) {
        if (typeof _ === 'undefined') return _h;
        _h = _;
        return this;
    }
    updateViz.w = function(_) {
        if (typeof _ === 'undefined') return _w;
        _w = _;
        return this;
    }
    updateViz.y = function(_) {
        if (typeof _ === 'undefined') return _y;
        _y = _;
        return this;
    }
    updateViz.x = function(_) {
        if (typeof _ === 'undefined') return _x;
        _x = _;
        return this;
    }

    return updateViz
}