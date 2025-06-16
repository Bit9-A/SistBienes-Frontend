// Daily Traffic Dashboards Default
export const pieChartOptions: any = {
	chart: {
		width: '50px',
		toolbar: {
			show: true, // Muestra el menú de herramientas
			export: {
				csv: {
					filename: "PieChart"
				},
				svg: {
					filename: "PieChart"
				},
				png: {
					filename: "PieChart"
				}
			},
			tools: {
				download: true, // Activa el botón de descarga
				selection: false,
				zoom: false,
				zoomin: false,
				zoomout: false,
				pan: false,
				reset: false,
				customIcons: []
			}
		},
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
	tooltip: {
		enabled: true,
		theme: 'dark'
	}
};

export const lineChartOptionsTotalSpent: any = {
	chart: {
		toolbar: {
			show: true,
			export: {
				csv: {
					filename: "LineChart"
				},
				svg: {
					filename: "LineChart"
				},
				png: {
					filename: "LineChart"
				}
			},
			tools: {
				download: true,
				selection: false,
				zoom: false,
				zoomin: false,
				zoomout: false,
				pan: false,
				reset: false,
				customIcons: []
			}
		},
		dropShadow: {
			enabled: true,
			top: 13,
			left: 0,
			blur: 10,
			opacity: 0.1,
			color: '#3421c4'
		}
	},
	colors: ['#42f5a7'],
	fill: {
		type: 'gradient',
		gradient: {
			shade: 'light',
			gradientToColors: ['#3421c4'],
			shadeIntensity: 1,
			type: 'horizontal',
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 100]
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