import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

const UserDashboard = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState({})
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  // ✅ PREPARE DATA
  const prepareChartData = (charts) => {
    if (!charts) return

    const taskDistribution = charts.taskDistribution || {}
    const taskPriorityLevels = charts.taskPriorityLevel || {}

    const pieData = [
      { name: "Pending", value: taskDistribution.Pending || 0 },
      { name: "In Progress", value: taskDistribution.InProgress || 0 },
      { name: "Completed", value: taskDistribution.Completed || 0 },
    ]

    const barData = [
      { name: "Low", value: taskPriorityLevels.Low || 0 },
      { name: "Medium", value: taskPriorityLevels.Medium || 0 },
      { name: "High", value: taskPriorityLevels.High || 0 },
    ]

    setPieChartData(pieData)
    setBarChartData(barData)
  }

  // ✅ FETCH DATA
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/user-dashboard-data")

      if (response?.data) {
        setDashboardData(response.data)
        prepareChartData(response.data.charts)
      }
    } catch (error) {
      console.log("Error fetching user dashboard data: ", error)
    }
  }

  // ✅ AUTO REFRESH
  useEffect(() => {
    getDashboardData()

    const interval = setInterval(getDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  // 🔴 OVERDUE
  const overdueCount =
    dashboardData?.recentTasks?.filter((task) => {
      if (!task?.dueDate) return false

      return (
        new Date(task.dueDate) < new Date() &&
        task.status?.toLowerCase() !== "completed"
      )
    }).length || 0

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold">
            Welcome! {currentUser?.name}
          </h2>
          <p className="mt-1">
            {moment().format("dddd Do MMMM YYYY")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

          <div className="bg-white p-6 rounded shadow">
            <h3>Total Tasks</h3>
            <p className="text-2xl font-bold">
              {dashboardData?.charts?.taskDistribution?.All || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3>Pending</h3>
            <p className="text-2xl font-bold">
              {dashboardData?.charts?.taskDistribution?.Pending || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3>In Progress</h3>
            <p className="text-2xl font-bold">
              {dashboardData?.charts?.taskDistribution?.InProgress || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3>Completed</h3>
            <p className="text-2xl font-bold">
              {dashboardData?.charts?.taskDistribution?.Completed || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
            <h3>Overdue Tasks</h3>
            <p className="text-2xl font-bold text-red-600">
              {overdueCount}
            </p>
          </div>

        </div>

        {/* 🚀 FIXED CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded shadow">
            <h3 className="mb-4 font-semibold">Task Distribution</h3>

            {pieChartData.length > 0 ? (
              <CustomPieChart data={pieChartData} colors={COLORS} />
            ) : (
              <p className="text-gray-400 text-center">No data available</p>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="mb-4 font-semibold">Priority Levels</h3>

            {barChartData.length > 0 ? (
              <CustomBarChart data={barChartData} />
            ) : (
              <p className="text-gray-400 text-center">No data available</p>
            )}
          </div>

        </div>

        {/* Tasks */}
        <RecentTasks tasks={dashboardData?.recentTasks || []} />

      </div>
    </DashboardLayout>
  )
}

export default UserDashboard
