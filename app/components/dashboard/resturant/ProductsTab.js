// components/restaurant/ProductsTab.jsx
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const ProductsTab = ({
  products,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
}) => {
  const categories = [
    "الجميع",
    "المقبلات",
    "الأطباق الرئيسية",
    "الحلويات",
    "المشروبات",
  ];

  const toggleProductAvailability = (productId) => {
    console.log(`تبديل حالة المنتج ${productId}`);
    // هنا ستكون دالة تبديل حالة توفر المنتج
  };

  const handleEditProduct = (productId) => {
    console.log(`تعديل المنتج ${productId}`);
    // هنا ستكون دالة فتح نافذة تعديل المنتج
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      console.log(`حذف المنتج ${productId}`);
      // هنا ستكون دالة حذف المنتج
    }
  };

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
              placeholder="البحث عن المنتجات..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={20} />
            إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
          >
            {/* صورة المنتج */}
            <div className="relative">
              <img
                src={product.image || "/placeholder-food.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2">
                <button
                  onClick={() => toggleProductAvailability(product.id)}
                  className={`p-2 rounded-full ${
                    product.isAvailable
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  } transition-colors`}
                >
                  {product.isAvailable ? (
                    <ToggleRight size={20} />
                  ) : (
                    <ToggleLeft size={20} />
                  )}
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.isAvailable ? "متاح" : "غير متاح"}
                </span>
              </div>
            </div>

            {/* معلومات المنتج */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {product.name}
                </h3>
                <span className="text-lg font-bold text-green-600 mr-2">
                  {product.price} ج.م
                </span>
              </div>

              <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star
                      className="text-yellow-400"
                      size={12}
                      fill="currentColor"
                    />
                    <span className="text-xs text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* معلومات إضافية */}
              <div className="text-xs text-gray-500 mb-3">
                <p>وقت التحضير: {product.preparationTime} دقيقة</p>
                <p>تم الطلب {product.ordersCount} مرة</p>
              </div>

              {/* الإجراءات */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditProduct(product.id)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <Edit size={14} />
                  تعديل
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* إحصائيات المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            أفضل المنتجات مبيعاً
          </h3>
          <div className="space-y-3">
            {products
              .sort((a, b) => b.ordersCount - a.ordersCount)
              .slice(0, 5)
              .map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 text-sm">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {product.ordersCount} طلب
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            أعلى المنتجات تقييماً
          </h3>
          <div className="space-y-3">
            {products
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 text-sm">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      className="text-yellow-400"
                      size={14}
                      fill="currentColor"
                    />
                    <span className="text-gray-600 text-sm">
                      {product.rating}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            توزيع المنتجات حسب الفئة
          </h3>
          <div className="space-y-3">
            {categories.slice(1).map((category) => {
              const count = products.filter(
                (p) => p.category === category
              ).length;
              const percentage = Math.round((count / products.length) * 100);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 text-sm">{category}</span>
                    <span className="text-gray-600 text-sm">{count} منتج</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* إضافة منتج سريع */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          إضافة منتج سريع
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="اسم المنتج"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="السعر (ج.م)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>اختر الفئة</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="وقت التحضير (دقيقة)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={18} />
            إضافة منتج
          </button>
        </div>
        <div className="mt-4">
          <textarea
            placeholder="وصف المنتج (اختياري)"
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      {/* نصائح لتحسين المبيعات */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          💡 نصائح لتحسين مبيعات المنتجات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-blue-700">• أضف صوراً جذابة للمنتجات</p>
            <p className="text-blue-700">• اكتب أوصافاً مفصلة ومغرية</p>
            <p className="text-blue-700">• قم بتحديث الأسعار بانتظام</p>
          </div>
          <div className="space-y-2">
            <p className="text-blue-700">• تابع المنتجات غير المتاحة</p>
            <p className="text-blue-700">
              • اعرض عروضاً خاصة للمنتجات الأقل مبيعاً
            </p>
            <p className="text-blue-700">• استجب لتعليقات العملاء</p>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          <p className="text-sm text-gray-600">إجمالي المنتجات</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.isAvailable).length}
          </p>
          <p className="text-sm text-gray-600">منتجات متاحة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-red-600">
            {products.filter((p) => !p.isAvailable).length}
          </p>
          <p className="text-sm text-gray-600">منتجات غير متاحة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {Math.round(
              (products.reduce((sum, p) => sum + p.rating, 0) /
                products.length) *
                10
            ) / 10}
          </p>
          <p className="text-sm text-gray-600">متوسط التقييم</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
