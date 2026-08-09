import { useEffect, useMemo, useState } from "react";
import { api, adminSession } from "@/lib/api";
import {
  EMPTY_PRODUCT_FORM,
  EMPTY_BANNER_FORM,
  EMPTY_BLOG_FORM,
  LOW_STOCK_THRESHOLD,
  downloadCsv,
  linesToList,
  listToLines,
} from "@/admin/constants";
import {
  addAdminCategory,
  getAdminCategories,
  removeAdminCategory,
} from "@/admin/lib/categories";
import {
  addJob,
  getJobs,
  removeJob,
  updateJob,
} from "@/admin/lib/jobs";

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
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState(EMPTY_BANNER_FORM);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState(EMPTY_BLOG_FORM);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [categories, setCategories] = useState(["Skin Care"]);
  const [jobs, setJobs] = useState([]);
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
    const [
      user,
      productsData,
      ordersData,
      customersData,
      activityData,
      bannersData,
      blogsData,
    ] = await Promise.all([
      api("/auth/me", { token }),
      api("/products?limit=200", { token }),
      api("/orders?limit=200", { token }),
      api("/customers", { token }).catch(() => ({ items: [] })),
      api("/activity", { token }).catch(() => ({ items: [] })),
      api("/banners?all=true", { token }).catch(() => ({ items: [] })),
      api("/blogs", { token }).catch(() => ({ items: [] })),
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
    setBanners(bannersData.items || []);
    setBlogs(blogsData.items || []);
  };

  useEffect(() => {
    setMounted(true);
    setCategories(getAdminCategories());
    setJobs(getJobs());
    const token = adminSession.get();
    if (!token) return;
    loadDashboard(token)
      .then(() => setIsLoggedIn(true))
      .catch(() => adminSession.clear());
  }, []);

  const handleAddCategory = (name) => {
    setCategories(addAdminCategory(name));
  };

  const handleRemoveCategory = (name) => {
    setCategories(removeAdminCategory(name));
  };

  const handleAddJob = (payload) => {
    setJobs(addJob(payload));
  };

  const handleUpdateJob = (id, payload) => {
    setJobs(updateJob(id, payload));
  };

  const handleRemoveJob = (id) => {
    setJobs(removeJob(id));
  };

  const loginWithCredentials = async (email, password) => {
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: String(email || "").trim(),
          password: String(password || ""),
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

  const handleLogin = async (e) => {
    e.preventDefault();
    await loginWithCredentials(emailInput, passwordInput);
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
        order.customer?.phone?.includes(q) ||
        order.customer?.address?.toLowerCase().includes(q) ||
        order.customer?.city?.toLowerCase().includes(q) ||
        order.customer?.pincode?.includes(q)
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
        c.city?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q) ||
        c.pincode?.includes(q),
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
    const images = (productForm.images || []).filter(Boolean);
    if (!images.length && !productForm.image) {
      newErrors.images = "Upload at least one product image";
    }
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    const categorySlug = productForm.category.toLowerCase().replace(/\s+/g, "-");
    const gallery = images.length ? images : [productForm.image].filter(Boolean);
    const ingredients = (productForm.ingredients || [])
      .map((item) => ({
        name: String(item.name || "").trim(),
        blurb: String(item.blurb || "").trim(),
      }))
      .filter((item) => item.name);
    const benefits = linesToList(productForm.benefitsText);
    const tags = linesToList(productForm.tagsText);
    const highlights = linesToList(productForm.highlightsText).map((label) => ({ label }));
    const uses = linesToList(productForm.usesText);
    const variantName = productForm.variantName?.trim() || productForm.name;

    const dataToSave = {
      name: productForm.name.trim(),
      category: productForm.category,
      categorySlug,
      composition: productForm.composition.trim(),
      strength: productForm.strength.trim(),
      price: Number(productForm.price),
      compareAtPrice: Number(productForm.compareAtPrice) || undefined,
      stock: Number(productForm.stock ?? 0),
      image: gallery[0],
      images: gallery,
      shortDescription: productForm.shortDescription.trim(),
      description:
        productForm.description?.trim() ||
        `${productForm.name} is a premium formulation for daily care.`,
      storage: productForm.storage,
      packaging: productForm.packaging,
      shelfLife: productForm.shelfLife,
      dosage: productForm.dosage || undefined,
      uses,
      benefits,
      ingredients,
      highlights,
      tags,
      variants: [{ name: variantName, strength: productForm.strength.trim() }],
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
    const cats = getAdminCategories();
    setCategories(cats);
    setProductForm({
      ...EMPTY_PRODUCT_FORM,
      category: cats[0] || "Skin Care",
    });
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const gallery = [
      ...(product.images?.length ? product.images : []),
      product.image,
    ].filter(Boolean);
    const uniqueGallery = [...new Set(gallery)];
    setProductForm({
      name: product.name || "",
      category: product.category || "Skin Care",
      composition: product.composition || "",
      strength: product.strength || "",
      price: product.price ?? 0,
      compareAtPrice:
        product.compareAtPrice || Math.round((product.price * 1.35) / 10) * 10 - 1,
      stock: product.stock ?? 0,
      image: uniqueGallery[0] || "",
      images: uniqueGallery,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      storage: product.storage || "",
      packaging: product.packaging || "",
      shelfLife: product.shelfLife || "",
      dosage: product.dosage || "",
      usesText: listToLines(product.uses),
      benefitsText: listToLines(product.benefits),
      tagsText: listToLines(product.tags),
      highlightsText: listToLines(
        (product.highlights || []).map((h) => (typeof h === "string" ? h : h.label)),
      ),
      ingredients:
        product.ingredients?.length > 0
          ? product.ingredients.map((item) => ({
              name: item.name || "",
              blurb: item.blurb || "",
            }))
          : [{ name: "", blurb: "" }],
      variantName: product.variants?.[0]?.name || product.name || "",
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
        address: o.customer?.address,
        city: o.customer?.city,
        pincode: o.customer?.pincode,
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
        address: c.address,
        city: c.city,
        pincode: c.pincode,
        orders: c.ordersCount,
        spent: c.totalSpent,
        status: c.status,
      })),
    );
  };

  const resetBannerForm = () => {
    setEditingBannerId(null);
    setBannerForm(EMPTY_BANNER_FORM);
  };

  const handleEditBanner = (banner) => {
    setEditingBannerId(banner.id || banner.bannerId);
    setBannerForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      link: banner.link || "/products",
      ctaLabel: banner.ctaLabel || "Shop now",
      order: String(banner.order ?? 0),
    });
    setActiveTab("banners");
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const token = adminSession.get();
    if (!token) return;
    if (!bannerForm.image?.trim()) {
      alert("Please upload a banner image first.");
      return;
    }
    const payload = {
      title: bannerForm.title.trim(),
      subtitle: bannerForm.subtitle.trim(),
      image: bannerForm.image.trim(),
      link: bannerForm.link.trim() || "/products",
      ctaLabel: bannerForm.ctaLabel.trim() || "Shop now",
      order: Number(bannerForm.order) || 0,
      active: true,
    };
    try {
      if (editingBannerId) {
        await api(`/banners/${editingBannerId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await api("/banners", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }
      const bannersData = await api("/banners?all=true", { token });
      setBanners(bannersData.items || []);
      resetBannerForm();
    } catch (error) {
      alert(error.message || "Unable to save banner");
    }
  };

  const handleDeleteBanner = async (banner) => {
    const id = banner.id || banner.bannerId;
    if (!id || !confirm(`Remove banner “${banner.title}”?`)) return;
    const token = adminSession.get();
    try {
      await api(`/banners/${id}`, { method: "DELETE", token });
      setBanners((prev) => prev.filter((b) => (b.id || b.bannerId) !== id));
      if (editingBannerId === id) resetBannerForm();
    } catch (error) {
      alert(error.message || "Unable to delete banner");
    }
  };

  const handleToggleBanner = async (banner) => {
    const id = banner.id || banner.bannerId;
    const token = adminSession.get();
    try {
      await api(`/banners/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ active: banner.active === false }),
      });
      const bannersData = await api("/banners?all=true", { token });
      setBanners(bannersData.items || []);
    } catch (error) {
      alert(error.message || "Unable to update banner");
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogForm({
      ...EMPTY_BLOG_FORM,
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id || blog.blogId);
    setBlogForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "Healthcare",
      author: blog.author || "HIMU Editorial",
      date: blog.date || new Date().toISOString().slice(0, 10),
      image: blog.image || "",
      readTime: blog.readTime || "3 min read",
    });
    setActiveTab("blogs");
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const token = adminSession.get();
    if (!token) return;
    const payload = {
      title: blogForm.title.trim(),
      excerpt: blogForm.excerpt.trim(),
      content: blogForm.content.trim(),
      category: blogForm.category.trim() || "Healthcare",
      author: blogForm.author.trim() || "HIMU Editorial",
      date: blogForm.date || new Date().toISOString().slice(0, 10),
      image: blogForm.image.trim(),
      readTime: blogForm.readTime.trim() || "3 min read",
    };
    try {
      if (editingBlogId) {
        await api(`/blogs/${editingBlogId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await api("/blogs", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }
      const blogsData = await api("/blogs", { token });
      setBlogs(blogsData.items || []);
      resetBlogForm();
    } catch (error) {
      alert(error.message || "Unable to save blog");
    }
  };

  const handleDeleteBlog = async (blog) => {
    const id = blog.id || blog.blogId;
    if (!id || !confirm(`Delete blog “${blog.title}”?`)) return;
    const token = adminSession.get();
    try {
      await api(`/blogs/${id}`, { method: "DELETE", token });
      setBlogs((prev) => prev.filter((b) => (b.id || b.blogId) !== id));
      if (editingBlogId === id) resetBlogForm();
    } catch (error) {
      alert(error.message || "Unable to delete blog");
    }
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
    categories,
    handleAddCategory,
    handleRemoveCategory,
    jobs,
    handleAddJob,
    handleUpdateJob,
    handleRemoveJob,
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
    banners,
    bannerForm,
    setBannerForm,
    editingBannerId,
    handleBannerSubmit,
    handleEditBanner,
    handleDeleteBanner,
    handleToggleBanner,
    resetBannerForm,
    blogs,
    blogForm,
    setBlogForm,
    editingBlogId,
    handleBlogSubmit,
    handleEditBlog,
    handleDeleteBlog,
    resetBlogForm,
    sidebarOpen,
    setSidebarOpen,
  };
}
