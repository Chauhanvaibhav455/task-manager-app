import React, { useEffect, useState } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import { FaFileLines } from "react-icons/fa6"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")

  // ✅ NEW: sorting state
  const [sortBy, setSortBy] = useState("newest")

  const navigate = useNavigate()

  // Fetch tasks
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      if (response?.data) {
        setAllTasks(response.data?.tasks || [])

        const statusSummary = response.data?.statusSummary || {}

        const statusArray = [
          { label: "All", count: statusSummary.all || 0 },
          { label: "Pending", count: statusSummary.pendingTasks || 0 },
          { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
          { label: "Completed", count: statusSummary.completedTasks || 0 },
        ]

        setTabs(statusArray)
      }
    } catch (error) {
      console.log("Error fetching tasks: ", error)
    }
  }

  // ✅ REAL-TIME AUTO REFRESH
  useEffect(() => {
    getAllTasks()

    const interval = setInterval(() => {
      getAllTasks()
    }, 5000)

    return () => clearInterval(interval)
  }, [filterStatus])

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } })
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "tasks_details.xlsx")

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log("Error downloading report: ", error)
      toast.error("Error downloading report. Please try again!")
    }
  }

  // ✅ SORTING LOGIC
  const sortedTasks = [...allTasks].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt)

    if (sortBy === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt)

    if (sortBy === "dueDate")
      return new Date(a.dueDate) - new Date(b.dueDate)

    if (sortBy === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 }
      return order[a.priority] - order[b.priority]
    }

    return 0
  })

  return (
    <DashboardLayout activeMenu={"Manage Task"}>
      <div className="my-6 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">

          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Tasks
            </h2>

            <button
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleDownloadReport}
            >
              Download
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">

            {/* Tabs */}
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <button
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleDownloadReport}
            >
              <FaFileLines />
              Download Report
            </button>
          </div>
        </div>

        {/* Tasks */}
        {sortedTasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No tasks found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {sortedTasks.map((item) => {
              
              // ✅ OVERDUE LOGIC
              const isOverdue =
                item.dueDate &&
                new Date(item.dueDate) < new Date() &&
                item.status?.toLowerCase() !== "completed"

              return (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map(
                    (user) => user.profileImageUrl
                  )}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  isOverdue={isOverdue}   // 🔴 IMPORTANT
                  onClick={() => handleClick(item)}
                />
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
