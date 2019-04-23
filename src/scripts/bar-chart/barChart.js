import * as d3 from 'd3';

export default class BarChart {

    constructor(
        selectElement,
        data,
        config
    ) {
        this.width = config.width - config.margin.left - config.margin.right;
        this.height = config.height - config.margin.top - config.margin.bottom;
        this.config = config;
        this.data = data;
        this.yData = this.data.map((data) => data.y);
        this.xData = this.data.map((data) => data.x);

        this.mainChart = d3.select(selectElement).append("svg")
            .data(data)
            .attr("class", "container")
            .attr("width", this.width + config.margin.left + config.margin.right)
            .attr("height", this.height + config.margin.top + config.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");
    }

    draw() {
        const maxY = this.yData.reduce((total, number) => this.sumValue(total, number));
        const yScale = d3.scaleLinear().domain([0, maxY])
            .range([this.height, 0]);

        this.createYAxis(yScale);

        const xScale = d3.scaleBand()
            .domain(this.xData)
            .rangeRound([0, this.width]);

        this.createXAxis(xScale);
        this.getYAxisText();
        this.getXAxisText();

        this.createBars(xScale, yScale);
    };

    createYAxis(yScale) {
        const yAxis = d3.axisLeft()
            .scale(yScale);
        this.mainChart.append("g")
            .attr("class", "axis")
            .call(yAxis);
    }

    getYAxisText() {
        this.mainChart.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("y", 15)
            .attr("x", -(this.height / 2) + (this.config.margin.top))
            .attr("dy", "-3.0em")
            .attr("transform", "rotate(-90)")
            .text('Fund Glows');
    }

    createXAxis(xScale) {
        const xAxis = d3.axisBottom()
            .scale(xScale);

        this.mainChart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis);
    }

    getXAxisText() {
        this.mainChart.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", (this.width / 2) + (this.config.margin.left / 2))
            .attr("y", this.height + 40)
            .text('Years');
    }

    createBars(xScale, yScale) {
        this.mainChart.selectAll()
            .data(this.data)
            .enter()
            .append('rect')
            .attr('x', (data) => xScale(data.x))
            .attr('y', (data, i) => {
                const countValue = i === 0 ? 0
                    : this.yData.slice(0, i)
                        .reduce((total, number) => {
                            return total + number;
                        });

                return data.y < 0 ? yScale(countValue)
                    : yScale(Math.abs(data.y)) - (this.height - yScale(countValue));
            })
            .attr('height', (data) => this.height - yScale(Math.abs(data.y)))
            .attr('width', xScale.bandwidth());
    }

    sumValue(total, number) {
        return total + number;
    }

};