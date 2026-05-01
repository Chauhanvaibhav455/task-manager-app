import React, { useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"

const localizer = momentLocalizer(moment)

const TaskCalendar = () => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [events, setEvents] = useState([])

  // ✅ FETCH TASKS
  const getTasks = async () => {
    try {
      if (!currentUser) return

      let response

      if (currentUser.role === "admin") {
        response = await axiosInstance.get("/tasks")
      } else {
        response = await axiosInstance.get("/tasks/user-dashboard-data")
      }

      let tasks = []

      if (currentUser.role === "admin") {
        tasks = response?.data?.tasks || []
      } else {
        tasks = response?.data?.recentTasks || []
      }

      const formattedEvents = tasks
        .filter((task) => task?.dueDate)
        .map((task) => {
          const isOverdue =
            new Date(task.dueDate) < new Date() &&
            task.status !== "Completed"

          return {
            id: task._id,
            title: `${task.title}${isOverdue ? " 🔴" : ""}`,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: true,
            resource: {
              status: task.status,
              overdue: isOverdue,
            },
          }
        })

      setEvents(formattedEvents)
    } catch (error) {
      console.log("Error fetching tasks:", error)
    }
  }

  useEffect(() => {
    getTasks()
  }, [currentUser])

  // ✅ CLICK EVENT
  const handleSelectEvent = (event) => {
    if (currentUser?.role === "admin") {
      navigate("/admin/create-task", {
        state: { taskId: event.id },
      })
    } else {
      navigate(`/user/task-details/${event.id}`)
    }
  }

  // ✅ CLICK EMPTY DATE
  const handleSelectSlot = (slotInfo) => {
    console.log("DATE CLICKED:", slotInfo)

    if (currentUser?.role === "admin") {
      const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD")

      navigate("/admin/create-task", {
        state: { selectedDate },
      })
    }
  }

  return (
    <DashboardLayout activeMenu={"Calendar"}>
      <div className="p-6">

        <h2 className="text-2xl font-bold mb-4">
          Task Calendar
        </h2>

        {/* 🔥 IMPORTANT HEIGHT FIX */}
        <div className="bg-white p-4 rounded shadow h-[80vh]">

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"

            selectable={true} // ✅ MUST
            views={["month", "week", "day"]} // ✅ FIX
            defaultView="month" // ✅ FIX

            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}

            style={{ height: "100%" }}

            // 🎨 COLOR HANDLING
            eventPropGetter={(event) => {
              let bgColor = "#3b82f6"

              if (event.resource?.status === "Completed") {
                bgColor = "#16a34a"
              } else if (event.resource?.status === "Pending") {
                bgColor = "#eab308"
              } else if (event.resource?.overdue) {
                bgColor = "#dc2626"
              }

              return {
                style: {
                  backgroundColor: bgColor,
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  padding: "2px 5px",
                },
              }
            }}
          />

        </div>
      </div>
    </DashboardLayout>
  )
}

export default TaskCalendar
