import { useEffect, useMemo, useState } from "react";
import { api, adminSession } from "@/lib/api";
import {
  EMPTY_PRODUCT_FORM,
  IMAGE_PRESETS,
  LOW_STOCK_THRESHOLD,
  downloadCsv,
} from "@/admin/constants";

export function useAdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [adminProfile, setAdminProfile] = useState({
    name: "HIMU Administrator",
    email: "admin@himu.local",
  });
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState("Never");
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async (token) => {
    const [user, productsData, ordersData, customersData, activityData] = await Promise.all([
      api("/auth/me", { token }),
      api("/products?limit=200", { token }),
      api("/orders?limit=200", { token }),
      api("/customers", { token }).catch(() => ({ items: [] })),
      api("/activity", { token }).catch(() => ({ items: [] })),
    ]);
    if (user.role && user.role !== "admin") {
      adminSession.clear();
      throw new Error("Not an administrator account");
    }
    setAdminProfile(user);
    setEditProfileName(user.name);
    setEditProfileEmail(user.email);
    setProducts(productsData.items || []);
    setOrders(ordersData.items || []);
    setCustomers(customersData.items || []);
    setActivity(activityData.items || []);
  };

  useEffect(() => {
    setMounted(true);
    const token = adminSession.get();
    if (!token) return;
    loadDashboard(token)
      .then(() => setIsLoggedIn(true))
      .catch(() => adminSession.clear());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });
      if (result.user.role && result.user.role !== "admin") {
        throw new Error("This account is not an administrator.");
      }
      adminSession.set(result.token);
      await loadDashboard(result.token);
      setLastLoginTimestamp(
        new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }),
      );
      setIsLoggedIn(true);
      setEmailInput("");
      setPasswordInput("");
      setActiveTab("overview");
    } catch (error) {
      setLoginError(error.message || "Unable to sign in. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    adminSession.clear();
    setIsLoggedIn(false);
    setActiveTab("overview");
    setSelectedOrders([]);
  };

  const handleRefresh = async () => {
    const token = adminSession.get();
    if (!token) return;
    setRefreshing(true);
    try {
      await loadDashboard(token);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    if (!editProfileName.trim() || !editProfileEmail.trim()) {
      alert("Name and Email are required fields.");
      return;
    }
    try {
      const newProfile = await api("/auth/me", {
        method: "PATCH",
        token: adminSession.get(),
        body: JSON.stringify({ name: editProfileName, email: editProfileEmail }),
      });
      setAdminProfile(newProfile);
      setProfileSuccessMsg("Profile details updated successfully!");
      setTimeout(() => setProfileSuccessMsg(""), 3000);
    } catch (error) {
      setProfileSuccessMsg(error.message || "Unable to update profile");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccessMsg("");
    if (!newPassword || newPassword.length < 12) {
      setPwdError("New password must be at least 12 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdError("Confirm password does not match new password.");
      return;
    }
    try {
      await api("/auth/password", {
        method: "PATCH",
        token: adminSession.get(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwdSuccessMsg("Password reset successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPwdSuccessMsg(""), 3000);
    } catch (error) {
      setPwdError(error.message || "Unable to reset password");
    }
  };

  const filteredOrdersByTime = useMemo(() => orders, [orders]);

  const filteredOrders = useMemo(() => {
    return filteredOrdersByTime.filter((order) => {
      const matchesStatus =
        orderStatusFilter === "all" || order.status === orderStatusFilter;
      if (!matchesStatus) return false;
      if (!orderSearch.trim()) return true;
      const q = orderSearch.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customer?.name?.toLowerCase().includes(q) ||
        order.customer?.email?.toLowerCase().includes(q) ||
        order.customer?.phone?.includes(q)
      );
    });
  }, [filteredOrdersByTime, orderSearch, orderStatusFilter]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrdersByTime.length;
    const delivered = filteredOrdersByTime.filter((o) => o.status === "Delivered");
    const totalRevenue = delivered.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = filteredOrdersByTime.filter((o) => o.status === "Pending").length;
    const shippedOrders = filteredOrdersByTime.filter((o) => o.status === "Shipped").length;
    const cancelledOrders = filteredOrdersByTime.filter((o) => o.status === "Cancelled").length;
    const avgOrderValue = delivered.length
      ? Math.round(totalRevenue / delivered.length)
      : 0;
    const lowStockCount = products.filter(
      (p) => Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD,
    ).length;
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      shippedOrders,
      cancelledOrders,
      avgOrderValue,
      totalProductsCount: products.length,
      lowStockCount,
      customersCount: customers.length,
      conversionRate:
        totalOrders > 0 ? Math.round((delivered.length / totalOrders) * 100) : 0,
    };
  }, [filteredOrdersByTime, products, customers]);

  const topProducts = useMemo(() => {
    const map = {};
    filteredOrdersByTime.forEach((order) => {
      order.items?.forEach((item) => {
        const key = item.productName || item.productId;
        if (!map[key]) {
          map[key] = { name: key, qty: 0, revenue: 0 };
        }
        map[key].qty += item.quantity || 0;
        map[key].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [filteredOrdersByTime]);

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((p) => Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => Number(a.stock) - Number(b.stock)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        productCategoryFilter === "all" || p.category === productCategoryFilter;
      if (!matchesCategory) return false;
      if (!searchProduct.trim()) return true;
      const q = searchProduct.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.composition?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q)
      );
    });
  }, [products, searchProduct, productCategoryFilter]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.city?.toLowerCase().includes(q),
    );
  }, [customers, customerSearch]);

  const notifications = useMemo(() => {
    const list = [];
    if (stats.pendingOrders > 0) {
      list.push({
        id: "pending",
        tone: "amber",
        title: `${stats.pendingOrders} pending orders`,
        body: "Need review & dispatch",
        action: () => setActiveTab("orders"),
      });
    }
    if (stats.lowStockCount > 0) {
      list.push({
        id: "stock",
        tone: "red",
        title: `${stats.lowStockCount} low-stock items`,
        body: `Below ${LOW_STOCK_THRESHOLD} units`,
        action: () => setActiveTab("inventory"),
      });
    }
    activity.slice(0, 5).forEach((item) => {
      list.push({
        id: item.id,
        tone: "green",
        title: item.message,
        body: new Date(item.at).toLocaleString("en-IN"),
        action: null,
      });
    });
    return list;
  }, [stats.pendingOrders, stats.lowStockCount, activity]);

  const globalResults = useMemo(() => {
    if (!globalQuery.trim()) return [];
    const q = globalQuery.toLowerCase();
    const productHits = products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({ type: "product", id: p.id, label: p.name, tab: "products" }));
    const orderHits = orders
      .filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q),
      )
      .slice(0, 4)
      .map((o) => ({
        type: "order",
        id: o.id,
        label: `${o.id} · ${o.customer?.name}`,
        tab: "orders",
        order: o,
      }));
    const customerHits = customers
      .filter((c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({ type: "customer", id: c.id, label: c.name, tab: "customers" }));
    return [...productHits, ...orderHits, ...customerHits];
  }, [globalQuery, products, orders, customers]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!productForm.name.trim()) newErrors.name = "Product name is required";
    if (!productForm.composition.trim()) newErrors.composition = "Composition is required";
    if (!productForm.strength.trim()) newErrors.strength = "Strength / Volume is required";
    if (productForm.price <= 0) newErrors.price = "Enter a valid price";
    if (!productForm.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    const categorySlug = productForm.category.toLowerCase().replace(/\s+/g, "-");
    const imageUrl = IMAGE_PRESETS[productForm.imageKey] || IMAGE_PRESETS.cream;
    const dataToSave = {
      name: productForm.name,
      category: productForm.category,
      categorySlug,
      composition: productForm.composition,
      strength: productForm.strength,
      price: Number(productForm.price),
      compareAtPrice: Number(productForm.compareAtPrice),
      stock: Number(productForm.stock ?? 0),
      image: imageUrl,
      images: [imageUrl, IMAGE_PRESETS.capsule, IMAGE_PRESETS.tablet].filter(Boolean),
      shortDescription: productForm.shortDescription,
      description:
        productForm.description ||
        `${productForm.name} is a premium formulation developed by HIMU Pharmacy.`,
      storage: productForm.storage,
      packaging: productForm.packaging,
      shelfLife: productForm.shelfLife,
      variants: [{ name: productForm.name, strength: productForm.strength }],
      active: true,
    };
    try {
      const token = adminSession.get();
      const saved = await api(
        editingProduct ? `/products/${editingProduct.id}` : "/products",
        {
          method: editingProduct ? "PUT" : "POST",
          token,
          body: JSON.stringify(dataToSave),
        },
      );
      setProducts((current) =>
        editingProduct
          ? current.map((product) => (product.id === saved.id ? saved : product))
          : [saved, ...current],
      );
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setFormErrors({});
      const activityData = await api("/activity", { token }).catch(() => ({ items: [] }));
      setActivity(activityData.items || []);
    } catch (error) {
      setFormErrors({ submit: error.message || "Unable to save product" });
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    let imageKey = "cream";
    for (const [key, val] of Object.entries(IMAGE_PRESETS)) {
      if (val === product.image) {
        imageKey = key;
        break;
      }
    }
    setProductForm({
      name: product.name,
      category: product.category,
      composition: product.composition,
      strength: product.strength,
      price: product.price,
      compareAtPrice:
        product.compareAtPrice || Math.round((product.price * 1.35) / 10) * 10 - 1,
      stock: product.stock ?? 0,
      imageKey,
      shortDescription: product.shortDescription,
      description: product.description,
      storage: product.storage,
      packaging: product.packaging,
      shelfLife: product.shelfLife,
    });
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Delete this product from the catalog?")) return;
    try {
      await api(`/products/${productId}`, {
        method: "DELETE",
        token: adminSession.get(),
      });
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (error) {
      alert(error.message || "Unable to delete product");
    }
  };

  const handleUpdateStock = async (product, stock) => {
    try {
      const saved = await api(`/products/${product.id}`, {
        method: "PUT",
        token: adminSession.get(),
        body: JSON.stringify({ ...product, stock: Number(stock) }),
      });
      setProducts((current) =>
        current.map((p) => (p.id === saved.id ? saved : p)),
      );
    } catch (error) {
      alert(error.message || "Unable to update stock");
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const updated = await api(`/orders/${orderId}/status`, {
        method: "PATCH",
        token: adminSession.get(),
        body: JSON.stringify({ status }),
      });
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updated : order)),
      );
      if (selectedOrder?.id === orderId) setSelectedOrder(updated);
      const activityData = await api("/activity", {
        token: adminSession.get(),
      }).catch(() => ({ items: [] }));
      setActivity(activityData.items || []);
    } catch (error) {
      alert(error.message || "Unable to update order");
    }
  };

  const handleBulkStatus = async (status) => {
    if (!selectedOrders.length) return;
    for (const id of selectedOrders) {
      await handleUpdateStatus(id, status);
    }
    setSelectedOrders([]);
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((current) =>
      current.includes(orderId)
        ? current.filter((id) => id !== orderId)
        : [...current, orderId],
    );
  };

  const toggleSelectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const exportOrders = () => {
    downloadCsv(
      `himu-orders-${Date.now()}.csv`,
      filteredOrders.map((o) => ({
        id: o.id,
        customer: o.customer?.name,
        email: o.customer?.email,
        phone: o.customer?.phone,
        city: o.customer?.city,
        total: o.total,
        payment: o.paymentMethod,
        status: o.status,
        date: o.date,
      })),
    );
  };

  const exportProducts = () => {
    downloadCsv(
      `himu-products-${Date.now()}.csv`,
      filteredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        composition: p.composition,
        strength: p.strength,
      })),
    );
  };

  const exportCustomers = () => {
    downloadCsv(
      `himu-customers-${Date.now()}.csv`,
      filteredCustomers.map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        orders: c.ordersCount,
        spent: c.totalSpent,
        status: c.status,
      })),
    );
  };

  return {
    mounted,
    isLoggedIn,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    loginError,
    loginLoading,
    handleLogin,
    handleLogout,
    handleRefresh,
    refreshing,
    activeTab,
    setActiveTab,
    products,
    orders,
    customers,
    activity,
    adminProfile,
    lastLoginTimestamp,
    editProfileName,
    setEditProfileName,
    editProfileEmail,
    setEditProfileEmail,
    profileSuccessMsg,
    handleUpdateProfile,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    pwdError,
    pwdSuccessMsg,
    handlePasswordReset,
    filteredOrders,
    filteredOrdersByTime,
    stats,
    topProducts,
    lowStockProducts,
    searchProduct,
    setSearchProduct,
    productCategoryFilter,
    setProductCategoryFilter,
    filteredProducts,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    customerSearch,
    setCustomerSearch,
    filteredCustomers,
    globalQuery,
    setGlobalQuery,
    globalResults,
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    isProductModalOpen,
    setIsProductModalOpen,
    editingProduct,
    productForm,
    setProductForm,
    formErrors,
    handleProductSubmit,
    handleOpenAddModal,
    handleOpenEditModal,
    handleDeleteProduct,
    handleUpdateStock,
    selectedOrder,
    setSelectedOrder,
    handleUpdateStatus,
    selectedOrders,
    toggleOrderSelection,
    toggleSelectAllOrders,
    handleBulkStatus,
    exportOrders,
    exportProducts,
    exportCustomers,
    sidebarOpen,
    setSidebarOpen,
  };
}
