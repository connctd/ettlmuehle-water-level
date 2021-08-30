import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartProps {
  categories: string[];
  data1: number[];
  data2: number[];
  zoom?: boolean;
  style?: Object;
}

const Chart: React.FC<ChartProps> = ({
  zoom = false, style, categories, data1, data2
}) => {
  const tooltipFormatter = `
    {b}
    <hr style="margin:5px 0">
    <i style="color:#2E567E">Messstelle 1:</i>
    <br>
    Pegel: <b>{c0}</b> cm
    <br>
    Über NN: <b>{c1}</b> m
    <hr style="margin:5px 0">
    <i  style="color:#C05353">Messstelle 2:</i>
    <br>
    Pegel: <b>{c2}</b> cm
    <br>
    Über NN: <b>{c3}</b> m
  `;

  const option = {
    color: '#2E567E',
    legend: {
      top: 30,
      data: [
        'Messstelle 1',
        'Messstelle 2'
      ]
    },
    tooltip: {
      trigger: 'axis',
      formatter: tooltipFormatter
    },
    dataZoom: zoom ? [
      {
        show: true,
        realtime: true,
        start: 60,
        end: 100
      }
    ] : undefined,
    grid: {
      bottom: zoom ? 100 : 30
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: { show: true },
      data: categories.map((str) => str.replace(' ', '\n')),
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        name: 'Pegel (cm)',
        nameLocation: 'center',
        nameGap: 40,
        interval: 5,
        min: 0,
        max: 160
      },
      {
        type: 'value',
        name: 'Über NN (m)',
        nameLocation: 'center',
        nameRotate: -90,
        nameGap: 50,
        interval: 0.05,
        min: 430,
        max: 431.6
      }
    ],
    series: [
      {
        name: 'Messstelle 1',
        type: 'line',
        smooth: true,
        data: data1,
        markLine: {
          animation: false,
          symbol: 'none',
          label: {
            show: true,
            position: 'middle',
            color: '#717C8E',
            formatter: '{b}'
          },
          data: [
            {
              name: 'Maximaler Pegel',
              yAxis: 150
            },
            {
              name: 'Hochwasser',
              yAxis: 100
            },
            {
              name: 'Hoher Pegel',
              yAxis: 80
            },
            {
              name: 'Geringer Pegel',
              yAxis: 30
            },
            {
              name: 'Akuter Wassermangel',
              yAxis: 15
            }
          ]
        }
      },
      {
        type: 'line',
        smooth: true,
        data: data1.map((val) => (val + 43000) / 100)
      },
      {
        name: 'Messstelle 2',
        type: 'line',
        smooth: true,
        color: '#C05353',
        data: data2.map((val) => val)
      },
      {
        type: 'line',
        smooth: true,
        data: data2.map((val) => (val + 43000) / 100)
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      theme="blue"
      style={{
        display: 'inline-block',
        ...style
      }}
    />
  );
};

export default Chart;
