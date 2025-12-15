import React from 'react';
import ReactApexChart from 'react-apexcharts';

type ChartProps = {
	// using `interface` is also ok
	[x: string]: any;
};
type ChartState = {
	chartData: any[];
	chartOptions: any;
};

class LineChart extends React.Component<ChartProps, ChartState> {
	constructor(props: { chartData: any[]; chartOptions: any }) {
		super(props);

		this.state = {
			chartData: [],
			chartOptions: {}
		};
	}

	componentDidUpdate(prevProps: ChartProps) {
		if (
			prevProps.chartData !== this.props.chartData ||
			prevProps.chartOptions !== this.props.chartOptions
		) {
			this.setState({
				chartData: this.props.chartData,
				chartOptions: this.props.chartOptions
			});
		}
	}


	render() {
		return (
			<ReactApexChart
				options={this.state.chartOptions}
				series={this.state.chartData}
				type='line'
				width='100%'
				height='100%'
			/>
		);
	}
}

export default LineChart;
