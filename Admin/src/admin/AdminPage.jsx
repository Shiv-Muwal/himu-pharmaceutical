import { AnimatePresence, motion } from "framer-motion";
import { useAdminDashboard } from "@/admin/hooks/useAdminDashboard";
import { AdminLogin } from "@/admin/components/AdminLogin";
import { AdminSidebar, AdminMobileHeader } from "@/admin/components/AdminSidebar";
import { AdminTopBar } from "@/admin/components/AdminTopBar";
import { OverviewPanel } from "@/admin/components/OverviewPanel";
import { ProductsPanel, InventoryPanel } from "@/admin/components/ProductsPanel";
import { OrdersPanel } from "@/admin/components/OrdersPanel";
import { CustomersPanel } from "@/admin/components/CustomersPanel";
import { SettingsPanel } from "@/admin/components/SettingsPanel";
import { ProductModal, OrderDetailModal } from "@/admin/components/AdminModals";

const TAB_META = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Live commerce health, alerts, and quick actions",
  },
  products: {
    title: "Product Catalog",
    subtitle: "Create, refine, export and manage formulations",
  },
  inventory: {
    title: "Inventory Control",
    subtitle: "Stock levels, restock shortcuts and low-stock alerts",
  },
  orders: {
    title: "Order Operations",
    subtitle: "Search, filter, bulk update and export fulfillments",
  },
  customers: {
    title: "Customer Directory",
    subtitle: "Buyers from orders and registered accounts",
  },
  settings: {
    title: "Account Settings",
    subtitle: "Profile identity and credential security",
  },
};

export default function AdminPage() {
  const dash = useAdminDashboard();

  if (!dash.mounted) return null;

  if (!dash.isLoggedIn) {
    return (
      <AdminLogin
        emailInput={dash.emailInput}
        setEmailInput={dash.setEmailInput}
        passwordInput={dash.passwordInput}
        setPasswordInput={dash.setPasswordInput}
        loginError={dash.loginError}
        loginLoading={dash.loginLoading}
        handleLogin={dash.handleLogin}
      />
    );
  }

  const meta = TAB_META[dash.activeTab];

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top,_#f3f8f4_0%,_#f7f5ef_45%,_#efe8d8_100%)] text-foreground">
      <AdminSidebar
        activeTab={dash.activeTab}
        setActiveTab={dash.setActiveTab}
        sidebarOpen={dash.sidebarOpen}
        setSidebarOpen={dash.setSidebarOpen}
        handleLogout={dash.handleLogout}
        stats={dash.stats}
      />

      <div className="flex h-screen flex-1 flex-col overflow-y-auto">
        <AdminMobileHeader
          sidebarOpen={dash.sidebarOpen}
          setSidebarOpen={dash.setSidebarOpen}
        />

        <AdminTopBar
          globalQuery={dash.globalQuery}
          setGlobalQuery={dash.setGlobalQuery}
          globalResults={dash.globalResults}
          setActiveTab={dash.setActiveTab}
          setSelectedOrder={dash.setSelectedOrder}
          notifications={dash.notifications}
          notificationsOpen={dash.notificationsOpen}
          setNotificationsOpen={dash.setNotificationsOpen}
          handleRefresh={dash.handleRefresh}
          refreshing={dash.refreshing}
        />

        <main className="flex-1 space-y-6 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-border/30 pb-4">
            <div>
              <motion.h2
                key={dash.activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-[family-name:var(--font-heading)] text-2xl font-black capitalize"
              >
                {meta.title}
              </motion.h2>
              <p className="mt-1 text-xs text-muted-foreground">{meta.subtitle}</p>
            </div>
            <div className="hidden items-center gap-2 rounded-2xl border border-emerald/20 bg-emerald/10 px-3 py-1.5 text-xs font-bold text-emerald lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
              System Online
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={dash.activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              {dash.activeTab === "overview" && (
                <OverviewPanel
                  stats={dash.stats}
                  filteredOrders={dash.filteredOrdersByTime}
                  topProducts={dash.topProducts}
                  lowStockProducts={dash.lowStockProducts}
                  activity={dash.activity}
                  setActiveTab={dash.setActiveTab}
                  setSelectedOrder={dash.setSelectedOrder}
                  handleOpenAddModal={dash.handleOpenAddModal}
                />
              )}
              {dash.activeTab === "products" && (
                <ProductsPanel
                  searchProduct={dash.searchProduct}
                  setSearchProduct={dash.setSearchProduct}
                  productCategoryFilter={dash.productCategoryFilter}
                  setProductCategoryFilter={dash.setProductCategoryFilter}
                  filteredProducts={dash.filteredProducts}
                  handleOpenAddModal={dash.handleOpenAddModal}
                  handleOpenEditModal={dash.handleOpenEditModal}
                  handleDeleteProduct={dash.handleDeleteProduct}
                  exportProducts={dash.exportProducts}
                />
              )}
              {dash.activeTab === "inventory" && (
                <InventoryPanel
                  lowStockProducts={dash.lowStockProducts}
                  products={dash.products}
                  handleUpdateStock={dash.handleUpdateStock}
                  handleOpenEditModal={dash.handleOpenEditModal}
                />
              )}
              {dash.activeTab === "orders" && (
                <OrdersPanel
                  filteredOrders={dash.filteredOrders}
                  orderSearch={dash.orderSearch}
                  setOrderSearch={dash.setOrderSearch}
                  orderStatusFilter={dash.orderStatusFilter}
                  setOrderStatusFilter={dash.setOrderStatusFilter}
                  handleUpdateStatus={dash.handleUpdateStatus}
                  setSelectedOrder={dash.setSelectedOrder}
                  selectedOrders={dash.selectedOrders}
                  toggleOrderSelection={dash.toggleOrderSelection}
                  toggleSelectAllOrders={dash.toggleSelectAllOrders}
                  handleBulkStatus={dash.handleBulkStatus}
                  exportOrders={dash.exportOrders}
                />
              )}
              {dash.activeTab === "customers" && (
                <CustomersPanel
                  filteredCustomers={dash.filteredCustomers}
                  customerSearch={dash.customerSearch}
                  setCustomerSearch={dash.setCustomerSearch}
                  exportCustomers={dash.exportCustomers}
                />
              )}
              {dash.activeTab === "settings" && (
                <SettingsPanel
                  editProfileName={dash.editProfileName}
                  setEditProfileName={dash.setEditProfileName}
                  editProfileEmail={dash.editProfileEmail}
                  setEditProfileEmail={dash.setEditProfileEmail}
                  profileSuccessMsg={dash.profileSuccessMsg}
                  handleUpdateProfile={dash.handleUpdateProfile}
                  currentPassword={dash.currentPassword}
                  setCurrentPassword={dash.setCurrentPassword}
                  newPassword={dash.newPassword}
                  setNewPassword={dash.setNewPassword}
                  confirmNewPassword={dash.confirmNewPassword}
                  setConfirmNewPassword={dash.setConfirmNewPassword}
                  pwdError={dash.pwdError}
                  pwdSuccessMsg={dash.pwdSuccessMsg}
                  handlePasswordReset={dash.handlePasswordReset}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ProductModal
        isOpen={dash.isProductModalOpen}
        onClose={() => dash.setIsProductModalOpen(false)}
        editingProduct={dash.editingProduct}
        productForm={dash.productForm}
        setProductForm={dash.setProductForm}
        formErrors={dash.formErrors}
        onSubmit={dash.handleProductSubmit}
      />

      <OrderDetailModal
        order={dash.selectedOrder}
        onClose={() => dash.setSelectedOrder(null)}
        handleUpdateStatus={dash.handleUpdateStatus}
      />
    </div>
  );
}
