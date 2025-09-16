// components/admin/RestaurantsTab.jsx
import {
  Search,
  Plus,
  Store,
  Star,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  XCircle,
} from "lucide-react";

const RestaurantsTab = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  pendingRestaurants,
}) => {
  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute right-3 top-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="البحث عن المطاعم..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">معلق</option>
            <option value="active">نشط</option>
            <option value="suspended">معطل</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            إضافة مطعم
          </button>
        </div>
      </div>

      {/* جدول المطاعم */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  اسم المطعم
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  المالك
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  التقييم
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Store size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {restaurant.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {restaurant.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{restaurant.owner}</p>
                    <p className="text-sm text-gray-600">{restaurant.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star
                        className="text-yellow-400"
                        size={16}
                        fill="currentColor"
                      />
                      <span className="text-gray-900">4.2</span>
                      <span className="text-sm text-gray-600">(24 تقييم)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      معلق الموافقة
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {restaurant.registrationDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsTab;
