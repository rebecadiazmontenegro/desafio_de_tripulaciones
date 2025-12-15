import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

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

  // Formatear labels y valores
const labels = data.rows.map(row => {
  if (labelColumn === "date_trunc") {
    const fecha = new Date(row[0]);
    const dia = fecha.getUTCDate().toString().padStart(2, "0");
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getUTCFullYear();
    return `${dia}/${mes}/${año}`;
  }
  return row[0];
});

  const values = data.rows.map(row => {
    const val = row[1];
    return typeof val === "number" ? parseFloat(val.toFixed(2)) : val;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: valueColumn,
        data: values
      }
    ]
  };

  if (chart_type === 'bar') return <Bar data={chartData} />;
  if (chart_type === 'pie') return <Pie data={chartData} />;
  if (chart_type === 'line') return <Line data={chartData} />;

  return null;
};

export default ChartRenderer;