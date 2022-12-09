import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react"

const LineGraph = ({ lineData }) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const ctx = canvasRef.current

        const myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: lineData.map((datum, index) => index),
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
    }, [lineData])

    return (
        <div style={{width: "600px", height: "600px"}}>
            <canvas ref={canvasRef}></canvas>
        </div>
    )
}

export default LineGraph