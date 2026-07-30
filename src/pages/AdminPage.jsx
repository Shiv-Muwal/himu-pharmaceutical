import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Pill,
  ClipboardList,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Lock,
  Mail,
  Eye,
  Check,
  X,
  AlertCircle,
  ShoppingBag,
  DollarSign,
  Package,
  ChevronRight,
  RefreshCw,
  Settings,
  User,
  KeyRound,
  Grid,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMockProducts,
  saveMockProduct,
  deleteMockProduct,
  getMockOrders,
  updateOrderStatus,
} from "@/lib/mock-backend";
import { cn } from "@/lib/utils";

export default function AdminPanelPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation Panel Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Database State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Timeframe filter state
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Persistent Admin Profile & Credentials State
  const [adminProfile, setAdminProfile] = useState({
    name: "HIMU Administrator",
    email: "admin@hemu.com",
  });
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState("Never");

  // Profile Edit State
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Password Reset State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState("");

  // Product Manager State
  const [searchProduct, setSearchProduct] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Dermatology",
    composition: "",
    strength: "",
    price: 150,
    compareAtPrice: 199,
    imageKey: "cream",
    shortDescription: "",
    description: "",
    storage: "Store in a cool, dry place below 25°C.",
    packaging: "30g Tube",
    shelfLife: "36 Months",
  });
  const [formErrors, setFormErrors] = useState({});

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Responsive Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auth Session Check
    if (localStorage.getItem("himu-admin-logged-in") === "true") {
      setIsLoggedIn(true);
    }

    // Load Admin credentials
    const savedPassword = localStorage.getItem("himu-admin-pwd") || "admin123";
    setAdminPassword(savedPassword);
    const savedProfile = localStorage.getItem("himu-admin-profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setAdminProfile(parsed);
      setEditProfileName(parsed.name);
      setEditProfileEmail(parsed.email);
    } else {
      setEditProfileName("HIMU Administrator");
      setEditProfileEmail("admin@hemu.com");
    }
    const savedLastLogin =
      localStorage.getItem("himu-admin-last-login") || "First Session";
    setLastLoginTimestamp(savedLastLogin);

    // Load Database collections
    setProducts(getMockProducts());
    setOrders(getMockOrders());
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if (
      emailInput.trim() === adminProfile.email &&
      passwordInput === adminPassword
    ) {
      const loginTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });
      localStorage.setItem("himu-admin-logged-in", "true");
      localStorage.setItem("himu-admin-last-login", loginTime);
      setLastLoginTimestamp(loginTime);
      setIsLoggedIn(true);
      setEmailInput("");
      setPasswordInput("");
    } else {
      setLoginError("Invalid email address or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("himu-admin-logged-in");
    setIsLoggedIn(false);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    if (!editProfileName.trim() || !editProfileEmail.trim()) {
      alert("Name and Email are required fields.");
      return;
    }
    const newProfile = { name: editProfileName, email: editProfileEmail };
    localStorage.setItem("himu-admin-profile", JSON.stringify(newProfile));
    setAdminProfile(newProfile);
    setProfileSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setProfileSuccessMsg(""), 3000);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccessMsg("");
    if (currentPassword !== adminPassword) {
      setPwdError("Current password is incorrect.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdError("Confirm password does not match new password.");
      return;
    }
    localStorage.setItem("himu-admin-pwd", newPassword);
    setAdminPassword(newPassword);
    setPwdSuccessMsg("Password reset successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setTimeout(() => setPwdSuccessMsg(""), 3000);
  };

  // Dynamic timeframe filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const dateStr = order.date.replace(/,/g, "");
      const orderDate = new Date(dateStr);
      const now = new Date();
      if (isNaN(orderDate.getTime())) {
        return true;
      }
      if (timeFilter === "live") {
        // Today's orders starting from 12 AM local time
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        return orderDate >= startOfToday;
      }
      if (timeFilter === "weekly") {
        // Last 7 days
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= sevenDaysAgo;
      }
      if (timeFilter === "monthly") {
        // Last 30 days
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000,
        );
        return orderDate >= thirtyDaysAgo;
      }
      if (timeFilter === "custom") {
        if (!customStartDate) return true;
        const start = new Date(customStartDate);
        const end = customEndDate ? new Date(customEndDate) : new Date();
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }
      return true;
    });
  }, [orders, timeFilter, customStartDate, customEndDate]);

  // Stats computation
  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = filteredOrders.filter(
      (o) => o.status === "Pending",
    ).length;
    const totalProductsCount = products.length;
    return { totalOrders, totalRevenue, pendingOrders, totalProductsCount };
  }, [filteredOrders, products]);

  // Monthly stats list for analytics bar chart representation
  const monthlyStats = useMemo(() => {
    return [
      { month: "March 2026", revenue: 15400, orders: 48, percentage: 35 },
      { month: "April 2026", revenue: 24200, orders: 72, percentage: 55 },
      { month: "May 2026", revenue: 38900, orders: 110, percentage: 88 },
      { month: "June 2026", revenue: 41200, orders: 125, percentage: 95 },
      {
        month: "July 2026",
        revenue: stats.totalRevenue + 8500,
        orders: stats.totalOrders + 24,
        percentage: 70,
      },
    ];
  }, [stats.totalRevenue, stats.totalOrders]);

  // Product category options
  const categoriesList = [
    "Dermatology",
    "Skin Care",
    "Antibiotics",
    "Cosmetics",
    "Hair Care",
    "Capsules",
    "Tablets",
    "Syrups",
    "Injectables",
    "Ointments",
  ];
  const imagePresets = {
    capsule:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
    tablet:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
    cream:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
    syrup:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&h=800&fit=crop",
    injectable:
      "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=800&fit=crop",
    cosmetic:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    skincare:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
    haircare:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop",
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!searchProduct.trim()) return products;
    const q = searchProduct.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q),
    );
  }, [products, searchProduct]);

  // Product CRUD saving
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!productForm.name.trim()) newErrors.name = "Product name is required";
    if (!productForm.composition.trim())
      newErrors.composition = "Composition is required";
    if (!productForm.strength.trim())
      newErrors.strength = "Strength / Volume is required";
    if (productForm.price <= 0) newErrors.price = "Enter a valid price";
    if (!productForm.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
    const categorySlug = productForm.category
      .toLowerCase()
      .replace(/\s+/g, "-");
    const imageUrl = imagePresets[productForm.imageKey] || imagePresets.cream;
    const dataToSave = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: productForm.name,
      category: productForm.category,
      categorySlug,
      composition: productForm.composition,
      strength: productForm.strength,
      price: Number(productForm.price),
      compareAtPrice: Number(productForm.compareAtPrice),
      image: imageUrl,
      images: [imageUrl, imagePresets.capsule, imagePresets.tablet].filter(
        Boolean,
      ),
      shortDescription: productForm.shortDescription,
      description:
        productForm.description ||
        `${productForm.name} is a premium formulation developed by HIMU Pharmacy to support healthcare standard.`,
      storage: productForm.storage,
      packaging: productForm.packaging,
      shelfLife: productForm.shelfLife,
      variants: [{ name: productForm.name, strength: productForm.strength }],
    };
    saveMockProduct(dataToSave);

    // Refresh products list
    setProducts(getMockProducts());
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setFormErrors({});
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Dermatology",
      composition: "",
      strength: "",
      price: 150,
      compareAtPrice: 199,
      imageKey: "cream",
      shortDescription: "",
      description: "",
      storage: "Store in a cool, dry place below 25°C.",
      packaging: "30g Tube",
      shelfLife: "36 Months",
    });
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);

    // Map image back to key
    let imageKey = "cream";
    for (const [key, val] of Object.entries(imagePresets)) {
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
        product.compareAtPrice ||
        Math.round((product.price * 1.35) / 10) * 10 - 1,
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

  const handleDeleteProduct = (productId) => {
    if (
      confirm("Are you sure you want to delete this product from the catalog?")
    ) {
      const updated = deleteMockProduct(productId);
      setProducts(updated);
    }
  };

  const handleUpdateStatus = (orderId, status) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updated.find((o) => o.id === orderId) || null);
    }
  };

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 pt-16">
        <div className="absolute inset-0 bg-[#fff8e7]/30 z-0 pointer-events-none molecular-bg" />
        <Card className="w-full max-w-md shadow-2xl rounded-3xl z-10 glass border border-border/40 overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Lock className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-black text-foreground font-[family-name:var(--font-heading)]">
                HIMU Admin Login
              </h1>
              <p className="text-xs text-muted-foreground">
                Enter your administrative credentials to manage products and
                orders.
              </p>
            </div>
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 cursor-pointer">
                Access Dashboard
              </Button>
            </form>
            <div className="border-t border-border/30 pt-4 text-center">
              <Link
                href="/"
                className="text-xs text-primary font-bold hover:underline"
              >
                ← Return to Home Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminInitials = adminProfile.name
    ? adminProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  const sidebarTabs = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "products", label: "Product Catalog", icon: Pill },
    { id: "orders", label: "Customer Orders", icon: ClipboardList },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const timeframeFilters = [
    { id: "live", label: "Live (Today)" },
    { id: "weekly", label: "Weekly (7d)" },
    { id: "monthly", label: "Monthly (30d)" },
    { id: "custom", label: "Custom Date Range" },
  ];

  const overviewStatCards = [
    {
      label: "Delivered Revenue",
      value: `₹${stats.totalRevenue}`,
      desc: "Calculated from delivered orders",
      icon: DollarSign,
      color: "text-emerald bg-emerald/10 border-emerald/20",
    },
    {
      label: "Orders Placed",
      value: stats.totalOrders,
      desc: "Total transactions count",
      icon: ShoppingBag,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "WHO-GMP Products",
      value: stats.totalProductsCount,
      desc: "Active items in catalog",
      icon: Package,
      color: "text-secondary bg-secondary/15 border-secondary/20",
    },
    {
      label: "Pending Deliveries",
      value: stats.pendingOrders,
      desc: "Awaiting administrator validation",
      icon: RefreshCw,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#f7f5ef] text-foreground">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground border-r border-[#0b5d3b]/20 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-0 hidden lg:flex",
        )}
      >
        {/* Sidebar Header Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center font-[family-name:var(--font-heading)] font-black text-sm text-gold border border-white/15">
              {adminInitials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate leading-snug">
                {adminProfile.name}
              </p>
              <p className="text-[10px] text-white/60 font-semibold truncate mt-0.5">
                Super Administrator
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-white/5 space-y-1 text-[10px] text-white/50">
            <p>Last Login:</p>
            <p className="font-bold text-white/80">{lastLoginTimestamp}</p>
          </div>
        </div>
        {/* Sidebar Navigation */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-left",
                  active
                    ? "bg-[#fff8e7] text-primary border-[#fff8e7] shadow-lg shadow-black/10"
                    : "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full gap-2 text-xs h-10 border-white/15 bg-transparent hover:bg-white/10 hover:text-white hover:border-white/30 text-white cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 border-b border-[#0b5d3b]/20 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer"
          >
            <Grid className="h-6 w-6" />
          </button>
          <span className="font-[family-name:var(--font-heading)] font-black text-sm tracking-wider">
            HIMU ADMIN
          </span>
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
            {adminInitials}
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6">
          {/* Section title */}
          <div className="flex items-center justify-between gap-4 border-b border-border/30 pb-4">
            <div>
              <h2 className="text-2xl font-black font-[family-name:var(--font-heading)] capitalize">
                {activeTab === "overview"
                  ? "Dashboard Overview"
                  : activeTab === "products"
                    ? "Product Catalog"
                    : activeTab === "orders"
                      ? "Customer Orders"
                      : "Account Settings"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure listings, analyze store health, and change security
                details.
              </p>
            </div>
            <div className="hidden lg:block text-xs bg-muted border border-border/40 rounded-xl px-3 py-1.5 font-bold">
              Status: <span className="text-emerald">Online</span>
            </div>
          </div>

          {/* --- TAB: OVERVIEW --- */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* Timeframe Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-border/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {timeframeFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setTimeFilter(filter.id)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                        timeFilter === filter.id
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/50 border-border/30 hover:bg-muted text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {/* Custom Date Inputs */}
                {timeFilter === "custom" && (
                  <div className="flex items-center gap-2 text-xs flex-wrap animate-fade-in">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground font-semibold">
                        Start:
                      </span>
                      <Input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="h-8 py-1 px-2 text-xs w-32"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground font-semibold">
                        End:
                      </span>
                      <Input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="h-8 py-1 px-2 text-xs w-32"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Stats overview grids */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {overviewStatCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.label}
                      className={cn(
                        "rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                        stat.color,
                      )}
                    >
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <h3 className="text-2xl font-black font-[family-name:var(--font-heading)] text-foreground mt-1.5">
                            {stat.value}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {stat.desc}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-background shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Analytics & Recent orders */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Monthly Revenue bar lists */}
                <div className="lg:col-span-4 space-y-4">
                  <Card className="rounded-2xl border border-border/30 shadow-sm overflow-hidden h-full flex flex-col justify-between">
                    <div className="p-5 border-b border-border/20">
                      <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
                        Revenue Analytics
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Month-wise performance trend
                      </p>
                    </div>
                    <CardContent className="p-5 space-y-4">
                      {monthlyStats.map((ms) => (
                        <div key={ms.month} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{ms.month}</span>
                            <span className="text-primary font-bold">
                              ₹{ms.revenue.toLocaleString("en-IN")} ({ms.orders}{" "}
                              orders)
                            </span>
                          </div>
                          {/* Mini Bar Chart */}
                          <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${ms.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                {/* Recent orders */}
                <div className="lg:col-span-8 space-y-4">
                  <Card className="rounded-2xl border border-border/30 shadow-sm overflow-hidden h-full">
                    <div className="p-5 border-b border-border/20 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
                        Recent Transactions
                      </h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        All Orders <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        {filteredOrders.length === 0 ? (
                          <div className="p-8 text-center text-sm text-muted-foreground">
                            No orders match the selected timeframe.
                          </div>
                        ) : (
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-muted/30 font-semibold text-muted-foreground border-b border-border/20">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Detail</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                              {filteredOrders.slice(0, 4).map((order) => (
                                <tr
                                  key={order.id}
                                  className="hover:bg-muted/10"
                                >
                                  <td className="p-4 font-bold">{order.id}</td>
                                  <td className="p-4 font-semibold">
                                    {order.customer.name}
                                  </td>
                                  <td className="p-4 font-bold text-primary">
                                    ₹{order.total}
                                  </td>
                                  <td className="p-4">
                                    <span
                                      className={cn(
                                        "inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase",
                                        order.status === "Delivered"
                                          ? "bg-emerald/10 text-emerald"
                                          : order.status === "Shipped"
                                            ? "bg-primary/10 text-primary"
                                            : order.status === "Cancelled"
                                              ? "bg-red-500/10 text-red-500"
                                              : "bg-amber-500/10 text-amber-500",
                                      )}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-center">
                                    <button
                                      onClick={() => setSelectedOrder(order)}
                                      className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: PRODUCTS CATALOG --- */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleOpenAddModal}
                  className="gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </div>
              <Card className="rounded-2xl border border-border/30 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {filteredProducts.length === 0 ? (
                      <div className="p-12 text-center text-sm text-muted-foreground">
                        No products match your criteria.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-muted/30 font-semibold text-muted-foreground border-b border-border/20">
                            <th className="p-4">Product details</th>
                            <th className="p-4">Composition</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Strength</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                          {filteredProducts.map((prod) => (
                            <tr key={prod.id} className="hover:bg-muted/10">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/20">
                                    <Image
                                      src={prod.image}
                                      alt={prod.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold truncate max-w-xs">
                                      {prod.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground truncate">
                                      {prod.id}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 max-w-xs truncate">
                                {prod.composition}
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant="gold"
                                  className="text-[9px] px-2 py-0.5"
                                >
                                  {prod.category}
                                </Badge>
                              </td>
                              <td className="p-4">{prod.strength}</td>
                              <td className="p-4 font-semibold text-muted-foreground">
                                ⭐ {prod.rating || "4.5"}
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-primary">
                                  ₹{prod.price}
                                </div>
                                {prod.compareAtPrice && (
                                  <div className="text-[10px] text-muted-foreground line-through">
                                    ₹{prod.compareAtPrice}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleOpenEditModal(prod)}
                                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id)}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* --- TAB: CUSTOMER ORDERS --- */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-in">
              <Card className="rounded-2xl border border-border/30 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {orders.length === 0 ? (
                      <div className="p-12 text-center text-sm text-muted-foreground">
                        No customer orders received yet.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-muted/30 font-semibold text-muted-foreground border-b border-border/20">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer Info</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-center">Qty</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Order Status</th>
                            <th className="p-4 text-center">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-muted/10">
                              <td className="p-4 font-bold">{order.id}</td>
                              <td className="p-4">
                                <div className="font-semibold text-foreground">
                                  {order.customer.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {order.customer.phone}
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">
                                {order.date}
                              </td>
                              <td className="p-4 text-center font-bold">
                                {order.items.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0,
                                )}
                              </td>
                              <td className="p-4 font-bold text-primary">
                                ₹{order.total}
                              </td>
                              <td className="p-4 uppercase text-[10px] font-black text-muted-foreground">
                                {order.paymentMethod}
                              </td>
                              <td className="p-4">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleUpdateStatus(order.id, e.target.value)
                                  }
                                  className={cn(
                                    "text-[10px] font-black rounded-lg border px-2.5 py-1.5 cursor-pointer uppercase",
                                    order.status === "Delivered"
                                      ? "border-emerald/45 bg-emerald/5 text-emerald"
                                      : order.status === "Shipped"
                                        ? "border-primary/45 bg-primary/5 text-primary"
                                        : order.status === "Cancelled"
                                          ? "border-red-500/40 bg-red-500/5 text-red-500"
                                          : "border-amber-500/40 bg-amber-50/5 text-amber-500",
                                  )}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* --- TAB: SETTINGS & PASSWORD RESET --- */}
          {activeTab === "settings" && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              {/* Profile Details Card */}
              <Card className="rounded-2xl border border-border/30 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border/20 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
                    Admin Profile Information
                  </h3>
                </div>
                <CardContent className="p-6">
                  {profileSuccessMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-xs font-semibold flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      <span>{profileSuccessMsg}</span>
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Admin Name
                      </label>
                      <Input
                        value={editProfileName}
                        onChange={(e) => setEditProfileName(e.target.value)}
                        placeholder="Administrator Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={editProfileEmail}
                        onChange={(e) => setEditProfileEmail(e.target.value)}
                        placeholder="admin@hemu.com"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 cursor-pointer"
                    >
                      Save Profile Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {/* Password Reset Card */}
              <Card className="rounded-2xl border border-border/30 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border/20 flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
                    Security Credentials Reset
                  </h3>
                </div>
                <CardContent className="p-6">
                  {pwdError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      <span>{pwdError}</span>
                    </div>
                  )}
                  {pwdSuccessMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-xs font-semibold flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      <span>{pwdSuccessMsg}</span>
                    </div>
                  )}
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Current Password *
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        New Password *
                      </label>
                      <Input
                        type="password"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Confirm New Password *
                      </label>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 cursor-pointer"
                    >
                      Reset Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL: ADD / EDIT PRODUCT --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />
          <Card className="relative w-full max-w-2xl bg-[#fff8e7] rounded-3xl shadow-2xl border border-border/40 z-10 overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground font-[family-name:var(--font-heading)]">
                {editingProduct
                  ? "Modify Product Details"
                  : "Add New Product to Catalog"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={handleProductSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Product Name *
                  </label>
                  <Input
                    name="name"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                    className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Composition *
                  </label>
                  <Input
                    name="composition"
                    placeholder="e.g. Ceramide + Peptide"
                    value={productForm.composition}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        composition: e.target.value,
                      }))
                    }
                    className={formErrors.composition ? "border-red-500" : ""}
                  />
                  {formErrors.composition && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {formErrors.composition}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Strength / Volume *
                  </label>
                  <Input
                    name="strength"
                    placeholder="e.g. 50g or 100ml"
                    value={productForm.strength}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        strength: e.target.value,
                      }))
                    }
                    className={formErrors.strength ? "border-red-500" : ""}
                  />
                  {formErrors.strength && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {formErrors.strength}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Price (₹) *
                  </label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        price: Number(e.target.value),
                      }))
                    }
                    className={formErrors.price ? "border-red-500" : ""}
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-[10px] mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Original Price (₹ Compare-At)
                  </label>
                  <Input
                    type="number"
                    value={productForm.compareAtPrice}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        compareAtPrice: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Product Representation Image *
                  </label>
                  <select
                    value={productForm.imageKey}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        imageKey: e.target.value,
                      }))
                    }
                    className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none"
                  >
                    <option value="cream">Cream Tube / Ointment</option>
                    <option value="skincare">Skincare Body Lotion</option>
                    <option value="cosmetic">Cosmetics Pack</option>
                    <option value="haircare">Haircare Revive Serum</option>
                    <option value="capsule">Capsules Pack (Green/White)</option>
                    <option value="tablet">Tablets Strip (Silver)</option>
                    <option value="syrup">Syrup Bottle</option>
                    <option value="injectable">Injectable Vial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Packaging Type
                  </label>
                  <Input
                    placeholder="e.g. 50g Tube"
                    value={productForm.packaging}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        packaging: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Short Description *
                </label>
                <Input
                  value={productForm.shortDescription}
                  onChange={(e) =>
                    setProductForm((p) => ({
                      ...p,
                      shortDescription: e.target.value,
                    }))
                  }
                  placeholder="One sentence briefing what this medicine/product is for"
                  className={
                    formErrors.shortDescription ? "border-red-500" : ""
                  }
                />
                {formErrors.shortDescription && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.shortDescription}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Detailed Description
                </label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Comprehensive description of product benefits, usages..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Storage Info
                  </label>
                  <Input
                    value={productForm.storage}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        storage: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Shelf Life
                  </label>
                  <Input
                    value={productForm.shelfLife}
                    onChange={(e) =>
                      setProductForm((p) => ({
                        ...p,
                        shelfLife: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                    Safety Warnings
                  </label>
                  <Input placeholder="Keep out of reach of children" />
                </div>
              </div>
              <div className="pt-4 border-t border-border/30 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="cursor-pointer">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- MODAL: VIEW ORDER DETAILS --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <Card className="relative w-full max-w-lg bg-[#fff8e7] rounded-3xl shadow-2xl border border-border/40 z-10 overflow-hidden max-h-[90vh] flex flex-col text-xs">
            <div className="p-5 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground font-[family-name:var(--font-heading)]">
                Order details: {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground font-semibold">
                    Date & Time
                  </p>
                  <p className="font-bold text-sm mt-0.5">
                    {selectedOrder.date}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">
                    Order Status
                  </p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value)
                    }
                    className="mt-1 flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              {/* Customer details */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/10 space-y-2">
                <h4 className="font-bold text-primary uppercase text-[9px] tracking-wider mb-2">
                  Customer Profile
                </h4>
                <div className="grid grid-cols-2 gap-y-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground">
                      Full Name:
                    </span>
                    <p className="font-bold">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">
                      Phone Number:
                    </span>
                    <p className="font-bold">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground">
                      Email Address:
                    </span>
                    <p className="font-medium">
                      {selectedOrder.customer.email}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-muted-foreground">
                      Delivery Destination:
                    </span>
                    <p className="font-medium">
                      {selectedOrder.customer.address}
                    </p>
                    <p className="text-muted-foreground font-medium">
                      {selectedOrder.customer.city} -{" "}
                      {selectedOrder.customer.pincode}
                    </p>
                  </div>
                </div>
              </div>
              {/* Purchase items list */}
              <div>
                <h4 className="font-bold text-primary uppercase text-[9px] tracking-wider mb-2">
                  Ordered Items
                </h4>
                <div className="border border-border/30 rounded-2xl overflow-hidden divide-y divide-border/20">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 flex justify-between items-center hover:bg-muted/10"
                    >
                      <div>
                        <p className="font-bold text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.selectedVariant} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-primary">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Totals */}
              <div className="border-t border-border/20 pt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Payment Mode
                  </p>
                  <p className="font-bold uppercase text-foreground mt-0.5">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Total Paid
                  </p>
                  <p className="text-lg font-black text-primary font-[family-name:var(--font-heading)]">
                    ₹{selectedOrder.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#0b5d3b]/10 bg-muted/10 flex justify-end">
              <Button
                onClick={() => setSelectedOrder(null)}
                className="cursor-pointer"
              >
                Done
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
