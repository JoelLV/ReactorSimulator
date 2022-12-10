import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react"

const LineGraph = ({ lineData, currMilliSec }) => {
    const canvasRef = useRef(null)
    const milliSecBoundary = 300000

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: "line",
            label: "Data",
            data: {
                labels: lineData.map((datum, index) => {
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
                            text: 'Temperature in °C'
                        }
                    },
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time in Seconds'
                        }
                    }
                }
            }
        })

        return () => {
            myChart.destroy()
        }
    }, [lineData, currMilliSec])

    return (
        <div style={{width: "600px", height: "600px"}}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}

export default LineGraph