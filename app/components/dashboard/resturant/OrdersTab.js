// components/restaurant/OrdersTab.jsx
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Phone, MapPin } from 'lucide-react';

const OrdersTab = ({ orders, searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'مؤكد': return 'bg-green-100 text-green-800';
      case 'قيد التحضير': return 'bg-yellow-100 text-yellow-800';
      case 'جاهز للتسليم': return 'bg-purple-100 text-purple-800';
      case 'في الطريق': return 'bg-indigo-100 text-indigo-800';
      case 'تم التسليم': return 'bg-gray-100 text-gray-800';
      case 'ملغى': return 'bg-red-100 text-red-800';
      case 'مرفوض': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`تغيير حالة الطلب ${orderId} إلى ${newStatus}`);
    // هنا ستكون دالة تحديث حالة الطلب
  };

  return (
    <div className="space-y-6">
      {/* شريط البحث والفلاتر */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="البحث برقم الطلب أو اسم العميل..."
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
            <option value="all">جميع الطلبات</option>
            <option value="جديد">طلبات جديدة</option>
            <option value="مؤكد">مؤكدة</option>
            <option value="قيد التحضير">قيد التحضير</option>
            <option value="جاهز للتسليم">جاهزة للتسليم</option>
            <option value="تم التسليم">مسلمة</option>
            <option value="ملغى">ملغاة</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Filter size={20} />
            تصدير
          </button>
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* رأس الطلب */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.date} - {order.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-xl text-gray-900">{order.total} ج.م</p>
                  <p className="text-sm text-gray-600">{order.items.length} منتج</p>
                </div>
              </div>

              {/* معلومات العميل */}
              <div className="flex items-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{order.customer.name}</h4>
                    <a href={`tel:${order.customer.phone}`} className="text-blue-600 hover:text-blue-800">
                      <Phone size={16} />
                    </a>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{order.customer.address}</span>
                  </div>
                </div>
              </div>

              {/* عناصر الطلب */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">عناصر الطلب:</h5>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                          {item.quantity}×
                        </span>
                        <span className="text-gray-900">{item.name}</span>
                        {item.notes && (
                          <span className="text-gray-500 italic">({item.notes})</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{item.price} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* الإجراءات */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {order.status === 'جديد' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(order.id, 'مؤكد')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={18} />
                      قبول الطلب
                    </button>
                    <button 
                      onClick={() => handleStatusChange(order.id, 'مرفوض')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <XCircle size={18} />
                      رفض الطلب
                    </button>
                  </>
                )}
                
                {order.status === 'مؤكد' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'قيد التحضير')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                  >
                    <Clock size={18} />
                    بدء التحضير
                  </button>
                )}
                
                {order.status === 'قيد التحضير' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'جاهز للتسليم')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    الطلب جاهز
                  </button>
                )}
                
                {order.status === 'جاهز للتسليم' && (
                  <button 
                    onClick={() => handleStatusChange(order.id, 'في الطريق')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Clock size={18} />
                    في الطريق
                  </button>
                )}

                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Eye size={18} />
                  عرض التفاصيل
                </button>

                {/* وقت التحضير المقدر */}
                <div className="mr-auto text-sm text-gray-600">
                  وقت التحضير: {order.estimatedTime} دقيقة
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;