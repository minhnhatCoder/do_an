import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function VerticalBarChart({ data, title }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: title,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-[99%] h-[99%]">
      <Bar options={options} data={data} />
    </div>
  );
}
