import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DashboardLayout from "../../components/DashboardLayout"
import axiosInstance from "../../utils/axioInstance"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import RecentTasks from "../../components/RecentTasks"
import CustomPieChart from "../../components/CustomPieChart"
import CustomBarChart from "../../components/CustomBarChart"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]

const Dashboard = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [dashboardData, setDashboardData] = useState({})
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  // Prepare chart data safely
  const prepareChartData = (data = {}) => {
    const taskDistribution = data.taskDistribution || {}
    const taskPriorityLevels = data.taskPriorityLevel || {}

    setPieChartData([
      { status: "Pending", count: taskDistribution.Pending || 0 },
      { status: "In Progress", count: taskDistribution.InProgress || 0 },
      { status: "Completed", count: taskDistribution.Completed || 0 },
    ])

    setBarChartData([
      { priority: "Low", count: taskPriorityLevels.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels.Medium || 0 },
      { priority: "High", count: taskPriorityLevels.High || 0 },
    ])
  }

  // Fetch data
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/tasks/dashboard-data")

      if (response?.data) {
        setDashboardData(response.data)
        prepareChartData(response.data.charts || {})
      }
    } catch (error) {
      console.log("Error fetching dashboard:", error)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  // 🔥 SAFE Overdue Logic (IMPORTANT FIX)
  const overdueTasksCount = Array.isArray(dashboardData?.recentTasks)
    ? dashboardData.recentTasks.filter((task) => {
        if (!task?.dueDate) return false

        const isOverdue = new Date(task.dueDate) < new Date()
        const isCompleted =
          task.status?.toLowerCase() === "completed"

        return isOverdue && !isCompleted
      }).length
    : 0


  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold">
            Welcome, {currentUser?.name}
          </h2>

          <p className="mt-1">
            {moment().format("dddd Do MMMM YYYY")}
          </p>

          <button
            className="mt-4 bg-white text-blue-600 px-5 py-2 rounded"
            onClick={() => navigate("/admin/create-task")}
          >
            Create Task
          </button>
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

          {/* 🔥 Overdue */}
          <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
            <h3>Overdue Tasks</h3>
            <p className="text-2xl font-bold text-red-600">
              {overdueTasksCount}
            </p>
          </div>

        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded">
            <h3 className="mb-4 font-semibold">Task Distribution</h3>
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>

          <div className="bg-white p-6 rounded">
            <h3 className="mb-4 font-semibold">Priority Levels</h3>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        {/* Recent Tasks */}
        <RecentTasks tasks={dashboardData?.recentTasks || []} />

      </div>
    </DashboardLayout>
  )
}

export default Dashboard
