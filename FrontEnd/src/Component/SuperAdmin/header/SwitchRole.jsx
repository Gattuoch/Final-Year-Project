import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

const roles = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full system access & billing",
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Manage users & content",
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access",
  },
];

const SwitchRole = () => {
  const [activeRole, setActiveRole] = useState("admin");

  const handleSwitch = (roleId) => {
    setActiveRole(roleId);

    // 🔗 TODO: API call
    // switchUserRole(roleId)
  };

  return (
    <div className="max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Switch Role
        </h2>
        <p className="text-sm text-gray-500">
          Toggle between your available permissions
        </p>
      </div>

      <div className="border-t mb-4" />

      {/* Active Role Info */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <p className="text-sm font-medium text-gray-800">
          Active:{" "}
          <span className="font-semibold">
            {roles.find((r) => r.id === activeRole)?.name}
          </span>
        </p>
      </div>

      {/* Roles */}
      <div className="space-y-4">
        {roles.map((role) => {
          const isActive = role.id === activeRole;

          return (
            <div
              key={role.id}
              className={`flex items-center justify-between rounded-xl border p-4 transition
                ${
                  isActive
                    ? "bg-cyan-500 text-white border-cyan-500"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <div>
                <p
                  className={`font-semibold ${
                    isActive ? "text-white" : "text-gray-900"
                  }`}
                >
                  {role.name}
                </p>
                <p
                  className={`text-sm ${
                    isActive ? "text-cyan-100" : "text-gray-500"
                  }`}
                >
                  {role.description}
                </p>
              </div>

              {isActive ? (
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <CheckCircle size={18} />
                  Active
                </span>
              ) : (
                <button
                  onClick={() => handleSwitch(role.id)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Switch
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SwitchRole;
