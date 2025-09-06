import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";
import "./SwellChart.css";

const SwellChart = ({ data, xLabels, plotBands, max }) => {
  const chartRef = useRef(null);

  const options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      marginRight: 2,
      spacingLeft: 0,
      style: {
        fontFamily: "inherit",
      },
      type: "column",
    },
    credits: {
      enabled: false,
    },
    legend: {
      borderWidth: 0,
      margin: 0,
    },
    plotOptions: {
      areaspline: {},
      column: {
        borderRadius: 0,
        borderWidth: 0,
        groupPadding: 0.07,
        dataLabels: {
          enabled: false,
        },
      },
      series: {
        marker: {},
        stacking: "normal",
      },
    },
    series: data || [],
    title: {
      text: null,
    },
    tooltip: {
      formatter: function() {
        let avg = 0;
        let min = 0;
        let max = 0;
        let rating;
        let tooltip = "";
        for (const point of this.points.reverse()) {
          if (point.series.name === "Min") {
            tooltip = `<strong>${point.point.tooltip_time || point.x}</strong>${tooltip}`;
            rating = point.point.rating;
            min = point.y;
          } else if (point.series.name === "Avg") {
            avg = point.y;
          } else {
            max = point.y;
          }
        }
        if (rating) {
          tooltip += `<br><i>${rating}</i>`;
        }
        tooltip += `<br>Max: ${(min + avg + max).toPrecision(2)} ft`;
        tooltip += `<br>Avg: ${(min + avg).toPrecision(2)} ft`;
        tooltip += `<br>Min: ${min.toPrecision(2)} ft`;
        return tooltip;
      },
      shared: true,
    },
    xAxis: {
      categories: xLabels || [],
      plotBands: plotBands || [],
      title: {
        text: null,
      },
    },
    yAxis: {
      max: max,
      offset: -8,
      stackLabels: {
        enabled: true,
        formatter: function() {
          return Highcharts.numberFormat(this.total, 1);
        },
        style: {
          fontSize: "0.65em",
          fontWeight: "normal",
        },
      },
      tickInterval: 1,
      title: {
        text: null,
      },
    },
  };

  return (
    <div className="swell-chart">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

SwellChart.propTypes = {
  data: PropTypes.array,
  xLabels: PropTypes.array,
  plotBands: PropTypes.array,
  max: PropTypes.number,
};

export default SwellChart;