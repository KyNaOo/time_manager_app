import React, { useState } from "react";

const ProfilePage = () => {
  const [username, setUsername] = useState("johndoe");
  const [isEditing, setIsEditing] = useState(false);

  const userData = {
    email: "john.doe@example.com",
    role: "Software Developer",
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-lg">{username}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="text-lg">{userData.email}</div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <div className="text-lg">{userData.role}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
