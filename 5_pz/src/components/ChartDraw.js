import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

const margin = {
	top: 10,
	bottom: 60,
	left: 40,
	right: 10
};

const series = [
	{ index: 1, color: "red" },
	{ index: 0, color: "blue" }
];

const ChartDraw = (props) => {
	const chartRef = useRef(null);

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const svg = d3.select(chartRef.current);
		setWidth(parseFloat(svg.style("width")));
		setHeight(parseFloat(svg.style("height")));
	}, []);

	const boundsWidth = width - margin.left - margin.right;
	const boundsHeight = height - margin.top - margin.bottom;

	const visibleSeries = useMemo(() => {
		return series.filter((item, index) => props.oy[index]);
	}, [props.oy]);

	const values = props.data.flatMap(d => visibleSeries.map(item => d.values[item.index]));
	const [min, max] = d3.extent(values);

	const scaleX = useMemo(() => {
		return d3
			.scaleBand()
			.domain(props.data.map(d => d.labelX))
			.range([0, boundsWidth])
			.padding(0.2);
	}, [props.data, boundsWidth]);

	const scaleY = useMemo(() => {
		return d3
			.scaleLinear()
			.domain([min * 0.85, max * 1.1])
			.range([boundsHeight, 0]);
	}, [boundsHeight, min, max]);

	useEffect(() => {
		if (boundsWidth <= 0 || boundsHeight <= 0 || visibleSeries.length === 0) {
			return;
		}

		const svg = d3.select(chartRef.current);
		svg.selectAll("*").remove();

		const xAxis = d3.axisBottom(scaleX);
		svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-30)");

		const yAxis = d3.axisLeft(scaleY);
		svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.call(yAxis);

		if (props.chartType === "scatter") {
			visibleSeries.forEach((item, index) => {
				svg
					.selectAll(`.dot-${index}`)
					.data(props.data)
					.enter()
					.append("circle")
					.attr("r", 5)
					.attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() * (index + 1) / (visibleSeries.length + 1))
					.attr("cy", d => scaleY(d.values[item.index]))
					.attr("transform", `translate(${margin.left}, ${margin.top})`)
					.style("fill", item.color);
			});
		} else {
			const barWidth = scaleX.bandwidth() / visibleSeries.length;

			visibleSeries.forEach((item, index) => {
				svg
					.selectAll(`.bar-${index}`)
					.data(props.data)
					.enter()
					.append("rect")
					.attr("x", d => scaleX(d.labelX) + index * barWidth)
					.attr("y", d => scaleY(d.values[item.index]))
					.attr("width", barWidth)
					.attr("height", d => boundsHeight - scaleY(d.values[item.index]))
					.attr("transform", `translate(${margin.left}, ${margin.top})`)
					.style("fill", item.color);
			});
		}
	}, [boundsWidth, boundsHeight, height, scaleX, scaleY, props.data, props.chartType, visibleSeries]);

	return (
		<svg ref={chartRef}> </svg>
	)
}

export default ChartDraw;
