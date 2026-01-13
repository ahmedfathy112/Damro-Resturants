"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  ToggleLeft,
  ToggleRight,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { compressImage } from "../../../lib/imageCompression";

const ProductsTab = ({ restaurantId }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الجميع");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // حالة نموذج إضافة منتج جديد
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparation_time: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [restaurantId]);

  const fetchProducts = async () => {
    if (!restaurantId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // استخراج الفئات الفريدة من المنتجات
  const categories = [
    "الجميع",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // تصفية المنتجات حسب البحث والفئة
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "الجميع" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // رفع صورة المنتج

  const uploadProductImage = async (file) => {
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${restaurantId}/${fileName}`;

      // استخدام supabase للرفع (يعمل مع RLS policies الصحيحة)
      const { error: uploadError } = await supabase.storage
        .from("menu-item-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error("فشل في رفع الصورة: " + uploadError.message);
      }

      // الحصول على رابط الصورة باستخدام العميل العادي
      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-item-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("حدث خطأ أثناء رفع الصورة: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // إضافة منتج جديد
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("menu_items").insert([
        {
          ...newProduct,
          restaurant_id: restaurantId,
          price: parseFloat(newProduct.price),
          preparation_time: parseInt(newProduct.preparation_time) || null,
          is_available: true,
        },
      ]);

      if (error) throw error;

      // إعادة تعيين النموذج وإخفائه
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        preparation_time: "",
        image_url: "",
      });
      setShowAddForm(false);

      // إعادة تحميل المنتجات
      fetchProducts();

      alert("تم إضافة المنتج بنجاح!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  // تبديل حالة توفر المنتج
  const toggleProductAvailability = async (productId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({
          is_available: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      // تحديث الحالة المحلية
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, is_available: !currentStatus }
            : product
        )
      );
    } catch (error) {
      console.error("Error toggling product availability:", error);
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (productId) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      // تحديث الحالة المحلية
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      alert("تم حذف المنتج بنجاح!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("حدث خطأ أثناء حذف المنتج");
    }
  };

  // معالجة تحميل الصورة

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من حجم الصورة
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      alert("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    // التحقق من نوع الملف
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("نوع الملف غير مدعوم. يرجى استخدام صورة JPEG, PNG, أو WebP");
      return;
    }

    try {
      // ضغط الصورة قبل الرفع
      setCompressing(true);
      const compressedFile = await compressImage(file);
      setCompressing(false);

      // رفع الصورة المضغوطة
      const imageUrl = await uploadProductImage(compressedFile);
      setNewProduct((prev) => ({ ...prev, image_url: imageUrl }));
      alert("✓ تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Upload error:", error);
      setCompressing(false);
      alert(`خطأ في رفع الصورة: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* نموذج إضافة منتج جديد */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              إضافة منتج جديد
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر (ج.م) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option value="">اختر الفئة</option>
                  <option value="المقبلات">المقبلات</option>
                  <option value="الأطباق الرئيسية">الأطباق الرئيسية</option>
                  <option value="الحلويات">الحلويات</option>
                  <option value="المشروبات">المشروبات</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت التحضير (دقيقة)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newProduct.preparation_time}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      preparation_time: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المنتج
              </label>
              <textarea
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة المنتج
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Upload size={18} />
                  {compressing
                    ? "جاري الضغط..."
                    : uploading
                    ? "جاري الرفع..."
                    : "اختر صورة"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading || compressing}
                  />
                </label>
                {newProduct.image_url && (
                  <span className="text-sm text-green-600">
                    ✓ تم رفع الصورة
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                إضافة المنتج
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500">
              {searchTerm || categoryFilter !== "الجميع"
                ? "لا توجد منتجات تطابق معايير البحث"
                : "لا توجد منتجات حتى الآن"}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة أول منتج
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* صورة المنتج */}
              <div className="relative">
                <img
                  src={product.image_url || "/placeholder-food.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <button
                    onClick={() =>
                      toggleProductAvailability(
                        product.id,
                        product.is_available
                      )
                    }
                    className={`p-2 rounded-full ${
                      product.is_available
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    } transition-colors`}
                  >
                    {product.is_available ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.is_available ? "متاح" : "غير متاح"}
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

                {product.description && (
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {product.category}
                  </span>
                  {product.preparation_time && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      ⏱️ {product.preparation_time} دقيقة
                    </span>
                  )}
                </div>

                {/* الإجراءات */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      /* سيتم تنفيذ التعديل لاحقاً */
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit size={14} />
                    تعديل
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
          ))
        )}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          <p className="text-sm text-gray-600">إجمالي المنتجات</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.is_available).length}
          </p>
          <p className="text-sm text-gray-600">منتجات متاحة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-red-600">
            {products.filter((p) => !p.is_available).length}
          </p>
          <p className="text-sm text-gray-600">منتجات غير متاحة</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {categories.length - 1}
          </p>
          <p className="text-sm text-gray-600">عدد الفئات</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
