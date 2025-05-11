import { useState, useEffect } from 'react'
import { 
  FaUserInjured, 
  FaUserMd, 
  FaCalendarCheck, 
  FaBan,
  FaClipboardCheck
} from 'react-icons/fa'
import Card from '../components/ui/Card'
import StatsCard from '../components/ui/StatsCard'
import Button from '../components/ui/Button'
import { 
  dashboardStats, 
  recentActivities,
  appointmentHistory,
  appointments
} from '../utils/mockData'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  const [stats, setStats] = useState(dashboardStats)
  const [activities, setActivities] = useState(recentActivities)
  const [chartData, setChartData] = useState({})
  const [appointmentsByStatus, setAppointmentsByStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Filter data based on selected period
      const filteredStats = filterDataByPeriod(selectedPeriod)
      setStats(filteredStats)
      
      // Process chart data
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      
      const lineData = {
        labels: days,
        datasets: [
          {
            label: 'Appointments',
            data: days.map(day => filteredStats.appointmentsPerDay.find(d => d.name === day)?.count || 0),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.3,
          }
        ]
      }
      
      const barData = {
        labels: filteredStats.specialtiesDistribution.map(s => s.name),
        datasets: [
          {
            label: 'Doctors',
            data: filteredStats.specialtiesDistribution.map(s => s.count),
            backgroundColor: '#8B5CF6',
          }
        ]
      }
      
      // Process appointments by status
      const combined = [...appointments, ...appointmentHistory]
      const filteredAppointments = filterAppointmentsByPeriod(combined, selectedPeriod)
      const statusCounts = filteredAppointments.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
      }, {})
      
      const doughnutData = {
        labels: Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        datasets: [
          {
            data: Object.values(statusCounts),
            backgroundColor: [
              '#3B82F6', // scheduled
              '#10B981', // completed
              '#EF4444', // cancelled
              '#F59E0B', // no-show
            ],
            borderWidth: 1,
          }
        ]
      }
      
      setChartData({
        line: lineData,
        bar: barData,
        doughnut: doughnutData
      })
      
      setAppointmentsByStatus(statusCounts)
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [selectedPeriod])
  
  const filterDataByPeriod = (period) => {
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }
    
    // Filter appointments within the period
    const filteredAppointments = [...appointments, ...appointmentHistory].filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= startDate && aptDate <= now
    })
    
    // Calculate new stats based on filtered appointments
    return {
      ...dashboardStats,
      totalAppointments: filteredAppointments.length,
      upcomingAppointments: filteredAppointments.filter(apt => apt.status === 'scheduled').length,
      cancelledAppointments: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
      completedAppointments: filteredAppointments.filter(apt => apt.status === 'completed').length,
    }
  }
  
  const filterAppointmentsByPeriod = (appointments, period) => {
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= startDate && aptDate <= now
    })
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse-slow text-primary-500 text-lg">
          Loading dashboard data...
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant={selectedPeriod === 'week' ? 'primary' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            This Week
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'primary' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'primary' : 'outline'}
            onClick={() => setSelectedPeriod('year')}
          >
            This Year
          </Button>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={FaUserInjured}
          change="+5% from last month"
          changeType="positive"
        />
        <StatsCard 
          title="Total Doctors" 
          value={stats.totalDoctors} 
          icon={FaUserMd}
          change="No change"
          changeType="neutral"
        />
        <StatsCard 
          title="Upcoming Appointments" 
          value={stats.upcomingAppointments} 
          icon={FaCalendarCheck}
          change="+12% from last week"
          changeType="positive"
        />
        <StatsCard 
          title="Cancelled Appointments" 
          value={stats.cancelledAppointments} 
          icon={FaBan}
          change="-3% from last week"
          changeType="positive"
        />
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Appointments per day */}
        <Card title="Appointments Per Day">
          <div className="h-64">
            {chartData.line && <Line data={chartData.line} options={chartOptions} />}
          </div>
        </Card>
        
        {/* Chart 2: Specialty Distribution */}
        <Card title="Doctors by Specialty">
          <div className="h-64">
            {chartData.bar && <Bar data={chartData.bar} options={chartOptions} />}
          </div>
        </Card>
      </div>
      
      {/* Additional row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Status */}
        <Card title="Appointment Status Overview">
          <div className="h-64 flex items-center justify-center">
            {chartData.doughnut && <Doughnut data={chartData.doughnut} options={chartOptions} />}
          </div>
        </Card>
        
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card title="Recent Activities">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <FaClipboardCheck className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{activity.user}</span> {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t text-center">
              <Button variant="outline" size="sm">View All Activities</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard