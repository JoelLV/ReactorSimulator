import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react"

const LineGraph = ({ lineData, currMilliSec }) => {
    const canvasRef = useRef(null)
    const milliSecBoundary = 300000

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: lineData.map((datum, index) => {
                    if (currMilliSec >= milliSecBoundary) {
                        return (currMilliSec - (milliSecBoundary - (200 * index))) / 1000
                    } else {
                        return (index * 200) / 1000
                    }
                }),
                datasets: [{
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
                    },
                    x: {
                        beginAtZero: true,
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