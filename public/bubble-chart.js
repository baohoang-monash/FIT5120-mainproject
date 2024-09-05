// Function to draw the bubble chart
function drawBubbleChart() {
    d3.select("#bubble-chart").selectAll("*").remove();

    const margin = { top: 50, right: 200, bottom: 50, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#bubble-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load data from JSON
    d3.json("DVP_emission_data_2.json").then(data => {
        const z = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.Emission_per_Kiloton)])
            .range([10, 120]); 

        const color = d3.scaleOrdinal()
            .domain(["Coal", "Oil", "Gas", "Cement", "Flaring"])
            .range(d3.schemeSet2);

        function updateChart(year) {
            const filteredData = data.filter(d => d.Year == year);

            const simulation = d3.forceSimulation(filteredData)
                .force("x", d3.forceX(width / 2).strength(0.05))
                .force("y", d3.forceY(height / 2).strength(0.05))
                .force("collide", d3.forceCollide(d => z(d.Emission_per_Kiloton) + 1))
                .stop();

            const nodes = svg.selectAll("g.node")
                .data(filteredData, d => d.Emission_Source);

            nodes.exit().remove();

            const nodesEnter = nodes.enter().append("g")
                .attr("class", "node");

            nodesEnter.append("circle")
                .attr("r", d => z(d.Emission_per_Kiloton))
                .style("fill", d => color(d.Emission_Source))
                .style("opacity", "0.7")
                .attr("stroke", "black");

            nodesEnter.append("text")
                .attr("class", "name")
                .attr("dy", "-0.5em")
                .style("text-anchor", "middle")
                .style("pointer-events", "none")
                .style("font-size", "12px")
                .style("fill", "black")
                .text(d => d.Emission_Source);

            nodesEnter.append("text")
                .attr("class", "value")
                .attr("dy", "1.5em")
                .style("text-anchor", "middle")
                .style("pointer-events", "none")
                .style("font-size", "10px")
                .style("fill", "black")
                .text(d => d.Emission_per_Kiloton);

            nodes.select("circle")
                .attr("r", d => z(d.Emission_per_Kiloton))
                .style("fill", d => color(d.Emission_Source));

            nodes.select(".name")
                .text(d => d.Emission_Source);

            nodes.select(".value")
                .text(d => d.Emission_per_Kiloton);

            for (let i = 0; i < 300; ++i) simulation.tick();

            nodesEnter.merge(nodes)
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        }

        updateChart(1951);

        document.getElementById('bubbleYearSlider').addEventListener('input', function() {
            const year = +this.value;
            d3.select("#bubbleYearDisplay").text(year);
            updateChart(year);
        });

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width + 20}, 0)`);

        const legendData = color.domain();

        svg.append("text")
            .attr("x", width - 550)
            .attr("y", height / 30 - 50)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font-size", "20px")
            .style("font-type","bold")
            .style("fill", "#333")
            .text("Years Filter");

        svg.append("text")
            .attr("x", width + 30)
            .attr("y", height / 28 - 50)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .style("font-size", "20px")
            .style("font-type","bold")
            .style("fill", "#333")
            .text("Emission Type");

        legend.selectAll("rect")
            .data(legendData)
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.selectAll("text")
            .data(legendData)
            .enter().append("text")
            .attr("x", 24)
            .attr("y", (d, i) => i * 20 + 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .text(d => d);

    }).catch(error => console.error("Error loading bubble chart data:", error));
}

// Call the function to draw the bubble chart
drawBubbleChart();