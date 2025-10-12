import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import type { GoatStats } from '../types/index';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  stats: GoatStats;
}

export const CategoryChart = ({ stats }: ChartsProps) => {
  const data = {
    labels: stats.byCategory.map(c => c.category),
    datasets: [
      {
        label: 'Cantidad de Cabras',
        data: stats.byCategory.map(c => c._count),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',   // purple
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(34, 197, 94, 0.8)',    // green
          'rgba(234, 179, 8, 0.8)',    // yellow
          'rgba(236, 72, 153, 0.8)',   // pink
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribución por Categoría',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = stats.total;
            const value = context.parsed.y;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export const BreedPieChart = ({ stats }: ChartsProps) => {
  const data = {
    labels: stats.byBreed.map(b => b.breed),
    datasets: [
      {
        label: 'Cantidad',
        data: stats.byBreed.map(b => b._count),
        backgroundColor: [
          'rgba(20, 184, 166, 0.8)',   // teal
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(147, 51, 234, 0.8)',   // purple
          'rgba(249, 115, 22, 0.8)',   // orange
          'rgba(239, 68, 68, 0.8)',    // red
          'rgba(34, 197, 94, 0.8)',    // green
        ],
        borderColor: [
          'rgb(20, 184, 166)',
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Distribución por Raza',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = stats.total;
            const value = context.parsed as number;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-80">
      <Pie data={data} options={options} />
    </div>
  );
};

export const SexChart = ({ stats }: ChartsProps) => {
  const maleCount = stats.bySex.find(s => s.sex === 'MALE')?._count || 0;
  const femaleCount = stats.bySex.find(s => s.sex === 'FEMALE')?._count || 0;

  const data = {
    labels: ['Machos ♂️', 'Hembras ♀️'],
    datasets: [
      {
        label: 'Cantidad',
        data: [maleCount, femaleCount],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // indigo
          'rgba(236, 72, 153, 0.8)',   // pink
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribución por Sexo',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = stats.total;
            const value = context.parsed.x;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};
