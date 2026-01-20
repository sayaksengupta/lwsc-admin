import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsF,
} from '@coreui/react'
import { CChartBar, CChartLine, CChartPie } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilPeople, cilHappy, cilUser, cilMedicalCross } from '@coreui/icons'
import { dashboardApi } from 'src/services/api'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState('7')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await dashboardApi.getStats({ days: timeRange })
        setStats(res.data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [timeRange])

  if (loading && !stats) return <div className="text-center mt-5">Loading dashboard...</div>
  if (!stats) return <div className="text-center mt-5">No data available</div>

  // Prepare Chart Data
  const trends = stats.logs?.trends || {}
  
  // Merge all dates from all trend types to ensure x-axis is complete
  const allDates = new Set([
     ...(trends.pain?.map(d => d._id) || []),
     ...(trends.mood?.map(d => d._id) || []),
     ...(trends.hydration?.map(d => d._id) || []),
     ...(trends.medication?.map(d => d._id) || [])
  ]);
  const dates = Array.from(allDates).sort();

  // Helper to map counts to the sorted dates
  const mapDataToDates = (dataArray) => {
    return dates.map(date => {
      const found = dataArray?.find(d => d._id === date);
      return found ? found.count : 0;
    });
  };
  
  const lineChartData = {
    labels: dates,
    datasets: [
      {
        label: 'Pain Logs',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        borderColor: 'rgba(220, 53, 69, 1)',
        pointBackgroundColor: 'rgba(220, 53, 69, 1)',
        data: mapDataToDates(trends.pain),
      },
      {
        label: 'Mood Logs',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: 'rgba(255, 193, 7, 1)',
        pointBackgroundColor: 'rgba(255, 193, 7, 1)',
        data: mapDataToDates(trends.mood),
      },
      {
        label: 'Hydration',
        backgroundColor: 'rgba(13, 202, 240, 0.2)',
        borderColor: 'rgba(13, 202, 240, 1)',
        pointBackgroundColor: 'rgba(13, 202, 240, 1)',
        data: mapDataToDates(trends.hydration),
      },
      {
        label: 'Medication',
        backgroundColor: 'rgba(102, 16, 242, 0.2)',
        borderColor: 'rgba(102, 16, 242, 1)',
        pointBackgroundColor: 'rgba(102, 16, 242, 1)',
        data: mapDataToDates(trends.medication),
      },
    ],
  }

  const painLocations = stats.insights?.topPainLocations || []
  const barChartData = {
    labels: painLocations.map(p => p.name),
    datasets: [
      {
        label: 'Reported Count',
        backgroundColor: '#f87979',
        data: painLocations.map(p => p.count),
      },
    ],
  }

  const moodDist = stats.insights?.moodDistribution || []
  const pieChartData = {
    labels: moodDist.map(m => m._id),
    datasets: [ 
      {
        data: moodDist.map(m => m.count),
        backgroundColor: ['#2eb85c', '#f9b115', '#e55353', '#321fdb'],
      },
    ],
  }

  return (
    <>
      <CRow>
        <CCol xs={12} sm={6} lg={2}> {/* Adjusted width for 5 items */}
          <CWidgetStatsF
            className="mb-3"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/users')}
            icon={<CIcon width={24} icon={cilUser} size="xl" />}
            title="Total Parents"
            value={stats.users?.total}
            color="primary"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={2}>
          <CWidgetStatsF
            className="mb-3"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/users')}
            icon={<CIcon width={24} icon={cilPeople} size="xl" />}
            title="Total Children"
            value={stats.users?.totalChildren}
            color="info"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={2}>
          <CWidgetStatsF
            className="mb-3"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/users')}
            icon={<CIcon width={24} icon={cilArrowTop} size="xl" />}
            title="Growth (30 Days)"
            value={stats.users?.newLast30Days}
            color="success"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/logs/pain')}
            icon={<CIcon width={24} icon={cilMedicalCross} size="xl" />}
            title="Total Pain Logs"
            value={stats.logs?.total?.pain}
            color="danger"
          />
        </CCol>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/logs/medications')}
            icon={<CIcon width={24} icon={cilMedicalCross} size="xl" />} // Using same icon, maybe change color
            title="Total Medication Log"
            value={stats.logs?.total?.medication}
            color="warning"
          />
        </CCol>
      </CRow>

      {/* Activity Line Chart */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Activity Trends
              </h4>
              <div className="small text-body-secondary">Last {timeRange} Days</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <div className="float-end btn-group" role="group">
                {['7', '30', '90'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn btn-outline-secondary ${timeRange === value ? 'active' : ''}`}
                    onClick={() => setTimeRange(value)}
                  >
                    {value} Days
                  </button>
                ))}
              </div>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={lineChartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
              },
              scales: {
                x: { grid: { drawOnChartArea: false } },
                y: { beginAtZero: true },
              },
              elements: {
                line: { tension: 0.4 },
                point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
              },
            }}
          />
        </CCardBody>
      </CCard>

      {/* Insights Section */}
      <CRow>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Pain Hotspots</CCardHeader>
            <CCardBody>
              <CChartBar
                data={barChartData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} lg={6}>
          <CCard className="mb-4">
            <CCardHeader>Mood Distribution</CCardHeader>
            <CCardBody>
              <CChartPie
                data={pieChartData}
                options={{
                  plugins: { legend: { position: 'right' } },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
