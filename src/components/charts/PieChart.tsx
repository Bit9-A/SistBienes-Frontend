import React from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartProps = {
	chartData: any[];
	chartOptions: any;
	[x: string]: any;
};

class PieChart extends React.Component<ChartProps> {
	render() {
		return (
			<ReactApexChart
				options={this.props.chartOptions}
				series={this.props.chartData}
				type='pie'
				width='100%'
				height='300px' // Altura explícita
			/>
		);
	}
}

export default PieChart;
