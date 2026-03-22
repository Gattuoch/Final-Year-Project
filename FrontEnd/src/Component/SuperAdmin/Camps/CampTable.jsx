import { Eye, Pencil, Trash2, Star } from "lucide-react";

export default function CampTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm mt-6">
      <table className="w-full text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            <th className="p-4 text-left">Camp</th>
            <th>Location</th>
            <th>Status</th>
            <th>Capacity</th>
            <th>Rating</th>
            <th>Revenue</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">Mountain View Camp</p>
                <p className="text-gray-500 text-xs">ID: #C001</p>
              </div>
            </td>

            <td>
              Simien Mountains <br />
              <span className="text-gray-400 text-xs">North Region</span>
            </td>

            <td>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                Active
              </span>
            </td>

            <td>50 / 80</td>

            <td className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400" />
              4.8
            </td>

            <td className="font-medium">$12,450</td>

            <td className="flex gap-3 text-gray-500">
              <Eye className="cursor-pointer hover:text-blue-500" />
              <Pencil className="cursor-pointer hover:text-green-500" />
              <Trash2 className="cursor-pointer hover:text-red-500" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
