import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function Graph(props) {
  const // destructuring objects
    { rows, filterRows } = props,
    // make array into an array that just has the invoice amounts
    cpu = rows.map((d) => {
      return { x: new Date(d.date), y: Number(d.cpu_pct_used) };
    }),
    mem = rows.map((d) => {
      return { x: new Date(d.date), y: Number(d.mem_pct_used) };
    }),
    swap = rows.map((d) => {
      return { x: new Date(d.date), y: Number(d.swap_pct_used) };
    }),
    transient = rows.map((d) => {
      return { x: new Date(d.date), y: Number(d.transient_pct_used) };
    }),
    saswork = rows.map((d) => {
      return { x: new Date(d.date), y: Number(d.saswork_pct_used) };
    }),
    xythosfs = rows.map((d) => {
      return { x: new Date(d.date), y: Number(d.xythosfs_pct_used) };
    }),
    min = Math.min(...cpu.map((d) => d.x)),
    max = Math.max(...cpu.map((d) => d.x)),
    // take min date time and set to midnight on that day
    minDate = new Date(min).setHours(0, 0, 0, 0),
    // take max date time and set to 11:59pm on that day
    maxDate = new Date(max).setHours(23, 59, 59, 999);
  // create an array of dates starting at midnight and ending at 11:59pm
  // for each day between min and max date
  const dates = [];
  for (let d = minDate; d <= maxDate; d += 86400000) {
    dates.push(new Date(d));
  }
  const plotBands = dates.map((d, di) => {
    return {
      from: d,
      to: dates[di + 1] ? dates[di + 1] : maxDate,
      color: di % 2 ? "#ffffff" : "#dddddd",
      label: {
        text: d.toLocaleString("en-us", { weekday: "long" }),
        style: {
          color: "black",
        },
      },
    };
  });
  const options = {
      chart: {
        type: "spline", // column, spline, area, bar, scatter, etc.
        zoomType: "x",
        zooming: { type: "x" },
        height: window.innerHeight,
      },
      info: {
        min: min,
        max: max,
        dates: dates,
      },
      title: {
        text: "LSAF Resource Usage",
      },
      series: [
        { name: "CPU", data: cpu },
        { name: "Mem", data: mem },
        { name: "Swap", data: swap },
        { name: "Transient", data: transient },
        { name: "SASwork", data: saswork },
        { name: "Xythosfs", data: xythosfs },
      ],
      xAxis: {
        type: "datetime",
        labels: {
          format: "{value:%Y-%b-%e %l:%M %p}",
        },
        minRange: 3600000,
        plotBands: plotBands,
      },
      yAxis: {
        title: {
          text: "% Used",
        },
      },
      time: { useUTC: true, timezoneOffset: 0 },
      data: { dateFormat: "YYYY-MM-DD" },
      plotOptions: {
        series: {
          turboThreshold: 0,
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                show(this);
              },
            },
          },
        },
        connectNulls: true,
      },
    },
    show = (e) => {
      // console.log("Date: " + e.category + ", % Used: " + e.y);
      filterRows(e.category);
    };
  console.log("options", options);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default Graph;
