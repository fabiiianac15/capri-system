import type { ReactNode } from 'react';

interface ModernCardProps {
  children: ReactNode;
  variant?: 'default' | 'gradient' | 'bordered';
  hoverEffect?: boolean;
  className?: string;
}

export function ModernCard({ 
  children, 
  variant = 'default',
  hoverEffect = true,
  className = '' 
}: ModernCardProps) {
  const baseClasses = "relative overflow-hidden rounded-2xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white shadow-lg border-2 border-gray-100",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg border-2 border-gray-100",
    bordered: "bg-white shadow-md border-2 border-gray-200"
  };
  
  const hoverClasses = hoverEffect 
    ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer" 
    : "";

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color: 'green' | 'blue' | 'purple' | 'pink' | 'indigo' | 'orange' | 'teal' | 'red';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
  const colorConfig = {
    green: {
      bg: 'from-[#4a7c0b] to-[#6b7c45]',
      light: 'bg-[#e8f0d8]',
      text: 'text-[#4a7c0b]',
      border: 'border-[#4a7c0b]/30',
      accent: 'bg-[#4a7c0b]'
    },
    blue: {
      bg: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-400/30',
      accent: 'bg-blue-500'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-400/30',
      accent: 'bg-purple-500'
    },
    pink: {
      bg: 'from-pink-500 to-pink-600',
      light: 'bg-pink-50',
      text: 'text-pink-600',
      border: 'border-pink-400/30',
      accent: 'bg-pink-500'
    },
    indigo: {
      bg: 'from-indigo-500 to-indigo-600',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-400/30',
      accent: 'bg-indigo-500'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      light: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-400/30',
      accent: 'bg-orange-500'
    },
    teal: {
      bg: 'from-teal-500 to-teal-600',
      light: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-400/30',
      accent: 'bg-teal-500'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      light: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-400/30',
      accent: 'bg-red-500'
    }
  };

  const config = colorConfig[color];

  return (
    <ModernCard className={`group border-transparent hover:${config.border} p-6`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full -mr-16 -mt-16"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-br ${config.bg} p-4 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {trend && (
            <div className={`${config.light} p-2 rounded-xl`}>
              <span className={`text-xs font-bold ${config.text}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            </div>
          )}
        </div>
        
        <p className={`text-xs font-extrabold ${config.text} uppercase tracking-wider mb-2`}>
          {title}
        </p>
        <p className="text-5xl font-black text-gray-900 mb-3">
          {value}
        </p>
        
        {subtitle && (
          <div className={`flex items-center gap-2 text-xs ${config.light} px-3 py-1.5 rounded-full w-fit`}>
            <div className={`w-2 h-2 ${config.accent} rounded-full animate-pulse`}></div>
            <span className={`font-bold ${config.text.replace('text-', 'text-').replace('-600', '-700')}`}>
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </ModernCard>
  );
}

interface ActionCardProps {
  title: string;
  icon: string;
  onClick?: () => void;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'indigo';
}

export function ActionCard({ title, icon, onClick, color }: ActionCardProps) {
  const colorConfig = {
    green: {
      gradient: 'from-[#e8f0d8] to-[#d3dbb8] hover:from-[#d3dbb8] hover:to-[#c0e09c]',
      border: 'border-[#c0e09c]',
      text: 'text-[#1a2e02]',
      accent: 'bg-[#4a7c0b]/10'
    },
    blue: {
      gradient: 'from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300',
      border: 'border-blue-300',
      text: 'text-blue-900',
      accent: 'bg-blue-500/10'
    },
    purple: {
      gradient: 'from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300',
      border: 'border-purple-300',
      text: 'text-purple-900',
      accent: 'bg-purple-500/10'
    },
    orange: {
      gradient: 'from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300',
      border: 'border-orange-300',
      text: 'text-orange-900',
      accent: 'bg-orange-500/10'
    },
    pink: {
      gradient: 'from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300',
      border: 'border-pink-300',
      text: 'text-pink-900',
      accent: 'bg-pink-500/10'
    },
    indigo: {
      gradient: 'from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300',
      border: 'border-indigo-300',
      text: 'text-indigo-900',
      accent: 'bg-indigo-500/10'
    }
  };

  const config = colorConfig[color];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden p-6 bg-gradient-to-br ${config.gradient} rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 ${config.border} w-full`}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 ${config.accent} rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="relative">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <p className={`text-sm font-black ${config.text}`}>{title}</p>
      </div>
    </button>
  );
}

interface ContentCardProps {
  title: string;
  icon: ReactNode;
  iconColor: 'green' | 'blue' | 'purple' | 'orange' | 'teal' | 'indigo' | 'pink';
  badge?: string;
  children: ReactNode;
}

export function ContentCard({ title, icon, iconColor, badge, children }: ContentCardProps) {
  const iconColorConfig = {
    green: 'from-[#4a7c0b] to-[#6b7c45]',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600'
  };

  const badgeColorConfig = {
    green: 'bg-[#e8f0d8] text-[#2a4a04]',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    teal: 'bg-teal-100 text-teal-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    pink: 'bg-pink-100 text-pink-700'
  };

  return (
    <ModernCard className="p-7">
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-${iconColor}-100 to-transparent rounded-full -mr-20 -mt-20`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className={`bg-gradient-to-br ${iconColorConfig[iconColor]} p-3 rounded-xl shadow-md`}>
              {icon}
            </div>
            <span>{title}</span>
          </h3>
          {badge && (
            <span className={`${badgeColorConfig[iconColor]} text-sm font-bold px-4 py-2 rounded-full`}>
              {badge}
            </span>
          )}
        </div>
        
        {children}
      </div>
    </ModernCard>
  );
}
