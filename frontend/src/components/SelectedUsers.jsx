import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { FaUsers } from "react-icons/fa"
import Modal from "./Modal"
import AvatarGroup from "./AvatarGroup"

const SelectedUsers = ({ selectedUser, setSelectedUser }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUser, setTempSelectedUser] = useState([])

  // 🔥 FETCH USERS (FIXED)
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")

      console.log("USER API RESPONSE:", response.data)

      // ✅ support both formats
      const users = response.data.users || response.data

      if (Array.isArray(users)) {
        setAllUsers(users)
      } else {
        setAllUsers([])
      }

    } catch (error) {
      console.log("Error fetching users:", error)
      setAllUsers([])
    }
  }

  // 🔁 toggle selection
  const toggleUserSelection = (userId) => {
    setTempSelectedUser((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  // ✅ assign users to parent
  const handleAssign = () => {
    setSelectedUser(tempSelectedUser)
    setIsModalOpen(false)
  }

  // 🖼 avatars preview
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUser.includes(user._id))
    .map((user) => user.profileImageUrl)

  // 🚀 initial fetch
  useEffect(() => {
    getAllUsers()
  }, [])

  // 🔥 sync selected users when editing
  useEffect(() => {
    setTempSelectedUser(selectedUser || [])
  }, [selectedUser])

  return (
    <div className="space-y-4 mt-2">

      {/* 👉 ADD BUTTON */}
      {selectedUserAvatars.length === 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md"
          type="button"
        >
          <FaUsers className="text-lg" /> Add Members
        </button>
      )}

      {/* 👉 AVATAR GROUP */}
      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      {/* 👉 MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Select Users"}
      >
        <div className="space-y-3 h-[60vh] overflow-y-auto">

          {/* ❌ NO USERS */}
          {allUsers.length === 0 && (
            <p className="text-gray-500 text-center">No users found</p>
          )}

          {/* ✅ USER LIST */}
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-gray-200"
            >
              <img
                src={user?.profileImageUrl || "https://via.placeholder.com/40"}
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUser.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4"
              />
            </div>
          ))}
        </div>

        {/* 👉 ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleAssign}
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectedUsers