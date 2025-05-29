// Daily Traffic Dashboards Default
export const pieChartOptions: any = {
	labels: ['Equipos Informáticos', ' Mobiliario', 'Vehículos', 'Equipos de Oficina', 'Audiovisuales'],
	colors: ['#90caf9', '#f8bbd0', '#80cbc4', '#ffe082', '#00dafc'],
	chart: {
		width: '50px'
	},
	animations: {
		enabled: true,
		speed: 800,
		animateGradually: {
			enabled: true,
			delay: 150
		},
		dynamicAnimation: {
			enabled: true,
			speed: 350
		}
	},
	states: {
		hover: {
			filter: {
				type: 'none'
			}
		}
	},
	legend: {
		show: false
	},
	dataLabels: {
		enabled: false
	},
	hover: { mode: null },
	plotOptions: {
		donut: {
			expandOnClick: false,
			donut: {
				labels: {
					show: false
				}
			}
		}
	},
	fill: {
		colors: ['#47a7f5', '#f176a0', '#87cb80', '#ffcd36', '#00dafc']
	},
	tooltip: {
		enabled: true,
		theme: 'dark'
	}
};

// Total Spent Default

export const lineChartDataTotalSpent = [
	{
		name: 'Adquisiones Ultimo Mes',
		data: [1, 2, 4, 13]
	}
];

export const lineChartOptionsTotalSpent: any = {
	chart: {
		toolbar: {
			show: false
		},
		dropShadow: {
			enabled: true,
			top: 13,
			left: 0,
			blur: 10,
			opacity: 0.1,
			color: '#00dafc'
		}

	},
	colors: ['#00dafc'],
	fill: {
		type: 'gradient',
		gradient: {
			shade: 'dark',
			gradientToColors: ['#FDD835'],
			shadeIntensity: 1,
			type: 'horizontal',
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 100, 100, 100]
		},
	},
	markers: {
		size: 0,
		colors: 'white',
		strokeColors: '#7551FF',
		strokeWidth: 3,
		strokeOpacity: 0.9,
		strokeDashArray: 0,
		fillOpacity: 1,
		discrete: [],
		shape: 'circle',
		radius: 2,
		offsetX: 0,
		offsetY: 0,
		showNullDataPoints: true
	},
	tooltip: {
		theme: 'dark'
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		curve: 'smooth',
		type: 'line'
	},
	xaxis: {
		type: 'numeric',
		categories: ['ENE', 'FEB', 'MAR', 'ABR'],
		labels: {
			style: {
				colors: '#A3AED0',
				fontSize: '12px',
				fontWeight: '500'
			}
		},
		axisBorder: {
			show: false
		},
		axisTicks: {
			show: false
		}
	},
	yaxis: {
		show: false
	},
	legend: {
		show: false
	},
	grid: {
		show: false,
		column: {
			color: ['#7551FF', '#39B8FF'],
			opacity: 0.5
		}
	},

	color: ['#7551FF']
};
