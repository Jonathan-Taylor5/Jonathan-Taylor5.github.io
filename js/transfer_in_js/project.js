import {
  select,
  csv,
  array,
  scaleLinear,
  max,
  scaleBand,
  scaleOrdinal,
  axisLeft,
  axisBottom,
  format
} from 'd3';


const titleText = 'Premier League Team Spending';
const xAxisLabelText = 'Transfer In (in Euros)';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

// Create a group element to hold the chart elements
const chart = svg.append('g');

const render = data => {

  const xValue = d => d[selectedTT];
  var yValue = d => d.team;
  const margin = { top: 50, right: 50, bottom: 77, left: 150 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);
  
  console.log();
  console.log(max(data, xValue))
  
const colorScale = scaleOrdinal()
    .domain(data.map(yValue))
    .range(['#034694', '#6CABDD', '#E03A3E', '#EF0107', '#C8102E', '#003399', '#001C58', '#0053A0', '#95BFE5', '#7A263A', '#FDB913', '#000000', '#0057B8', '#D71920', '#FFFFFF']);
  
  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.5);
  
  // Remove the old chart elements
  chart.selectAll('*').remove();
  
  // Append the new chart elements
  const xAxisTickFormat = number =>
  {if (selectedTT === 'transfer_out') {
    return format('.3s')(number).replace('G', 'M');
  } else {
    return format('.3s')(number).replace('G', 'B');
  }};
  
  const xAxis = axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight);
  
  chart.append('g')
    .call(axisLeft(yScale))
    .selectAll('.domain, .tick line')
      .remove();
  
  const xAxisG = chart.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
  
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 65)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabelText);
  
  chart.selectAll('rect').data(data)
    .enter().append('rect')
      .attr('y', d => yScale(yValue(d)))
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(yValue(d)))
  
  chart.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .text(titleText);
  
  
  chart.attr('transform', `translate(${margin.left},${margin.top})`);
  
};

const dataPack = csv('../../files/data.csv');

console.log(dataPack);

const seasonSelect = document.getElementById("season");
var selectedSeason = seasonSelect.value;

const transferSelect = document.getElementById("transferType");
var selectedTT = transferSelect.value;


dataPack.then(data => {
  const filteredData = data.filter(d => d.season === selectedSeason);
  filteredData.forEach(d => {
    d.transfer_in = +d.transfer_in;
  });
  render(filteredData);
});

seasonSelect.addEventListener('change', () => {
  selectedSeason = seasonSelect.value;
  console.log(selectedSeason);
  dataPack.then(data => {
    const filteredData = data.filter(d => d.season === selectedSeason);
    filteredData.forEach(d => {
      d.transfer_in = +d.transfer_in * 1;
    });
    render(filteredData); // update the render with filteredData
  });
});

transferSelect.addEventListener('change', () => {
	selectedTT = transferSelect.value;
  console.log(selectedTT);
  dataPack.then(data => {
    const filteredData = data.filter(d => d.season === selectedSeason);
    filteredData.forEach(d => {
      d.selectedTT = +d.selectedTT * 1;
    });
    render(filteredData); // update the render with filteredData
  });
});
