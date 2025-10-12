import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import goatService from '../services/goat.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B9D'];

interface GoatStats {
  total: number;
  byCategory: Array<{ category: string; _count: number }>;
  byBreed: Array<{ breed: string; _count: number }>;
  bySex: Array<{ sex: string; _count: number }>;
  totalMilkProduction: number;
}

export default function Reportes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'statistics';
  const [stats, setStats] = useState<GoatStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await goatService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg className="h-12 w-12 animate-spin text-[#6b7c45]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-medium text-[#6b7c45]">Cargando reportes...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Preparar datos para gráficas
  const categoryData = stats?.byCategory.map(cat => ({
    name: cat.category,
    cantidad: cat._count,
  })) || [];

  const breedData = stats?.byBreed.map(breed => ({
    name: breed.breed,
    value: breed._count,
  })) || [];

  const sexData = stats?.bySex.map(sex => ({
    name: sex.sex === 'MALE' ? 'Machos' : 'Hembras',
    cantidad: sex._count,
  })) || [];

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8] animate-fade-in">
            <h1 className="text-3xl font-bold text-[#1a2e02] mb-2">Reportes y Estadísticas</h1>
            <p className="text-[#6b7c45]">Visualiza el desempeño de tu granja caprina en tiempo real</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-[#E8E8E8] p-2 flex gap-2">
            <button
              onClick={() => handleTabChange('statistics')}
              className={`
                flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                ${activeTab === 'statistics'
                  ? 'bg-[#1a2e02] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              📊 Estadísticas
            </button>
            <button
              onClick={() => handleTabChange('charts')}
              className={`
                flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                ${activeTab === 'charts'
                  ? 'bg-[#1a2e02] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              📈 Gráficas
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'statistics' && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Cabras */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E8E8] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Cabras</p>
                    <div className="bg-[#d3dbb8] p-2 rounded-lg">
                      <span className="text-2xl">🐐</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-[#1a2e02] my-3">
                    {stats?.total || 0}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#6b7c45] rounded-full"></span>
                    Activas en el sistema
                  </p>
                </div>

                {/* Producción Total */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E8E8] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Producción</p>
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <span className="text-2xl">🥛</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-blue-700 my-3">
                    {stats?.totalMilkProduction.toFixed(1) || 0}L
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Litros acumulados
                  </p>
                </div>

                {/* Machos */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E8E8] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Machos</p>
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <span className="text-2xl">♂️</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-indigo-700 my-3">
                    {stats?.bySex.find(s => s.sex === 'MALE')?._count || 0}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    Reproductores
                  </p>
                </div>

                {/* Hembras */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E8E8] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Hembras</p>
                    <div className="bg-pink-50 p-2 rounded-lg">
                      <span className="text-2xl">♀️</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-pink-700 my-3">
                    {stats?.bySex.find(s => s.sex === 'FEMALE')?._count || 0}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Productoras
                  </p>
                </div>
              </div>

              {/* Resumen por Categoría */}
              <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8]">
                <h3 className="text-2xl font-bold text-[#1a2e02] mb-6 flex items-center gap-3">
                  <span className="bg-[#d3dbb8] p-2 rounded-lg text-2xl">📊</span>
                  <span>Distribución por Categoría</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {stats?.byCategory.map((cat) => (
                    <div
                      key={cat.category}
                      className="text-center p-5 bg-[#e8f0d8] rounded-xl border-2 border-[#d3dbb8] hover:border-[#6b7c45] hover:shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">{cat.category}</p>
                      <p className="text-3xl font-bold text-[#1a2e02]">
                        {cat._count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen por Raza */}
              <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8]">
                <h3 className="text-2xl font-bold text-[#1a2e02] mb-6 flex items-center gap-3">
                  <span className="bg-teal-50 p-2 rounded-lg text-2xl">🧬</span>
                  <span>Distribución por Raza</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {stats?.byBreed.map((breed) => (
                    <div
                      key={breed.breed}
                      className="text-center p-6 bg-[#e8f0d8] rounded-xl border-2 border-[#d3dbb8] hover:border-[#6b7c45] hover:shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                      <p className="text-sm font-bold text-[#1a2e02] mb-3">{breed.breed}</p>
                      <p className="text-4xl font-bold text-[#6b7c45]">
                        {breed._count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-6 animate-fade-in">
              {/* Gráfica de Barras - Por Categoría */}
              <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8]">
                <h3 className="text-xl font-bold text-[#1a2e02] mb-2">Distribución por Categoría</h3>
                <p className="text-sm text-gray-600 mb-6">Cantidad de caprinos por categoría productiva</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E8E8E8',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#6b7c45" name="Cantidad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Grid 2 columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica Circular - Por Raza */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8]">
                  <h3 className="text-xl font-bold text-[#1a2e02] mb-2">Distribución por Raza</h3>
                  <p className="text-sm text-gray-600 mb-6">Proporción de caprinos por raza</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={breedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {breedData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfica de Barras - Por Sexo */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8]">
                  <h3 className="text-xl font-bold text-[#1a2e02] mb-2">Distribución por Sexo</h3>
                  <p className="text-sm text-gray-600 mb-6">Comparación entre machos y hembras</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sexData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis type="number" stroke="#888" style={{ fontSize: '12px' }} />
                      <YAxis type="category" dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #E8E8E8',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#0088FE" name="Cantidad" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfica de Área - Producción de Leche */}
              {stats && stats.totalMilkProduction > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E8E8]">
                  <h3 className="text-xl font-bold text-[#1a2e02] mb-2">Producción de Leche Total</h3>
                  <p className="text-sm text-gray-600 mb-6">Litros producidos acumulados</p>
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-4">
                      <span className="text-5xl">🥛</span>
                    </div>
                    <p className="text-5xl font-bold text-blue-700 mb-2">
                      {stats.totalMilkProduction.toFixed(1)}L
                    </p>
                    <p className="text-gray-600">Total de litros producidos</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
