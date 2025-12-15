import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ChartRenderer = ({ payload }) => {
  const { chart_type, data } = payload;
  const [labelColumn, valueColumn] = data.columns;

  // Alias de nombres humanos
  const nombresHumanos = {
    date_trunc: "Fecha",
    max_importe_total: "Importe total máximo",
    total_importe_total: "Importe total",
    promedio_importe_total: "Promedio importe total",
    total_cantidad: "Cantidad total",
    pais: "País",
  };

  // Labels
  const labels = data.rows.map((row) => {
    if (labelColumn === "date_trunc") {
      const fecha = new Date(row[0]);
      const dia = fecha.getUTCDate().toString().padStart(2, "0");
      const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getUTCFullYear();
      return `${dia}/${mes}/${año}`;
    }
    return row[0];
  });

  // Values
  const values = data.rows.map((row) => {
    const val = row[1];
    return typeof val === "number" ? parseFloat(val.toFixed(2)) : val;
  });

  // Paleta base
  const baseColors = [
    "rgba(6, 18, 48, 0.85)", // dark
    "rgba(66, 105, 210, 0.85)", // light
    "rgba(168, 197, 240, 0.85)",
    "rgba(26, 53, 101, 0.85)",
    "rgba(231, 231, 231, 0.85)",
  ];

  // Estilos por tipo de gráfico
  const datasetStyle = (() => {
    if (chart_type === "pie") {
      return {
        backgroundColor: baseColors.slice(0, values.length),
        borderColor: "rgba(6, 18, 48, 0.8)",
        borderWidth: 1,
        hoverOffset: 8,
      };
    }

    if (chart_type === "bar") {
      return {
        backgroundColor: "rgba(66, 105, 210, 0.7)",
        borderColor: "rgba(6, 18, 48, 0.9)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(66, 105, 210, 0.9)",
      };
    }

    if (chart_type === "line") {
      return {
        borderColor: "rgba(66, 105, 210, 1)",
        backgroundColor: "rgba(66, 105, 210, 0.25)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(6, 18, 48, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
      };
    }

    return {};
  })();

  const chartData = {
    labels,
    datasets: [
      {
        label: nombresHumanos[valueColumn] || valueColumn,
        data: values,
        ...datasetStyle,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#061230",
          font: {
            size: 13,
            family: "Poppins",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(6, 18, 48, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales:
      chart_type !== "pie"
        ? {
            x: {
              ticks: { color: "#061230" },
              grid: { color: "rgba(6, 18, 48, 0.1)" },
            },
            y: {
              ticks: { color: "#061230" },
              grid: { color: "rgba(6, 18, 48, 0.1)" },
            },
          }
        : {},
  };

  if (chart_type === "bar") return <Bar data={chartData} options={options} />;
  if (chart_type === "pie") return <Pie data={chartData} options={options} />;
  if (chart_type === "line") return <Line data={chartData} options={options} />;

  return null;
};

export default ChartRenderer;
