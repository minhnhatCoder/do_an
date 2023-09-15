import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function LineChart({ data, title }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-[99%] h-[99%]">
      <Line options={options} data={data} />
    </div>
  );
}
