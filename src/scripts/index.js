import '../styles/index.scss';
import mockData from './data/data';
import BarChart from './bar-chart/barChart';

const config = {
    width: 300,
    height: 300,
    margin: { 
        top: 30, 
        right: 10, 
        bottom: 40, 
        left: 60 
    },
    color: {
        bar: 'red'
    }
};

const chart = new BarChart(
    "#chart", 
    mockData,
    config
);

chart.draw();
