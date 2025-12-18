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
  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      if (data.length === 0) return { columns: [], rows: [] };

      const columns = Object.keys(data[0]);
      const rows = data.map((obj) => columns.map((col) => obj[col]));

      return { columns, rows };
    } else if (data && data.columns && data.rows) {
      return data;
    }
    return { columns: [], rows: [] };
  };

  const normalizedData = normalizeData(data);
  const { columns, rows } = normalizedData;

  if (!columns.length || !rows.length) {
    return <div>No hay datos para visualizar</div>;
  }

  const labelColumn = columns[0];
  const valueColumn = columns[1];

  const nombresHumanos = {
    date_trunc: "Fecha",
    max_importe_total: "Importe total máximo",
    total_importe_total: "Importe total",
    promedio_importe_total: "Promedio importe total",
    total_cantidad: "Cantidad total",
    pais: "País",
    conteo_transacciones: "Conteo de transacciones",
    producto: "Producto",
    ventas: "Ventas",
    coste: "Coste",
    margen: "Margen",
  };

  const labels = rows.map((row) => {
    const labelValue = row[0];

    if (labelColumn === "date_trunc") {
      const fecha = new Date(labelValue);
      const dia = fecha.getUTCDate().toString().padStart(2, "0");
      const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getUTCFullYear();
      return `${dia}/${mes}/${año}`;
    }

    return labelValue;
  });

  const values = rows.map((row) => {
    const val = row[1];
    return typeof val === "number"
      ? parseFloat(val.toFixed(2))
      : parseFloat(val);
  });

  const baseColors = [
    "rgba(6, 18, 48, 0.85)",
    "rgba(66, 105, 210, 0.85)",
    "rgba(168, 197, 240, 0.85)",
    "rgba(26, 53, 101, 0.85)",
    "rgba(231, 231, 231, 0.85)",
    "rgba(100, 140, 230, 0.85)",
    "rgba(45, 75, 150, 0.85)",
    "rgba(200, 210, 240, 0.85)",
    "rgba(80, 120, 200, 0.85)",
    "rgba(150, 180, 230, 0.85)",
  ];

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
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            } else if (context.parsed !== null) {
              label += context.parsed.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            }
            return label;
          },
        },
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
              ticks: {
                color: "#061230",
                callback: function (value) {
                  return value.toLocaleString("es-ES", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                },
              },
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
