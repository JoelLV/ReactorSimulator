import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react"

const LineGraph = ({ lineData, currMilliSec, tempUnit }) => {
    const canvasRef = useRef(null)
    const milliSecBoundary = 300000

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: "line",
            label: "Data",
            data: {
                labels: lineData.map((_, index) => {
                    if (currMilliSec >= milliSecBoundary) {
                        // This formula is in charge of rolling the milliseconds
                        // being displayed whenever we reach the millisecond boundary
                        // which is 300,000 or 5 minutes.
                        return ((currMilliSec - (milliSecBoundary - (200 * index))) / 1000).toFixed(2)
                    } else {
                        return ((index * 200) / 1000).toFixed(2)
                    }
                }),
                datasets: [{
                    label: 'Average Temp',
                    data: lineData,
                    borderWidth: 2,
                    fill: true,
                }]
            },
            options: {
                color: "#000000",
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: `Temperature in ${tempUnit === "celsius" ? "°C" : "°F"}`,
                            font: {
                                family: "Roboto Mono"
                            }
                        },
                        ticks: {
                            font: {
                                family: "Roboto Mono"
                            }
                        }
                    },
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time in Seconds',
                            font: {
                                family: "Roboto Mono"
                            }
                        },
                        ticks: {
                            font: {
                                family: "Roboto Mono"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: "Roboto Mono"
                            }
                        }
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            }
        })

        return () => {
            myChart.destroy()
        }
    }, [lineData, currMilliSec])

    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default LineGraph