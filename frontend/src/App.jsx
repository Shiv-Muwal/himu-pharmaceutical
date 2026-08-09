import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { LocationProvider } from "@/providers/LocationProvider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileAppNav } from "@/components/layout/mobile-app-nav";
import {
  ScrollProgressBar,
  BackToTop,
  CookieBanner,
  FloatingButtons,
  PageLoader,
} from "@/components/global/site-widgets";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CheckoutModal } from "@/components/cart/checkout-modal";
import { LoginModal } from "@/components/auth/login-modal";
import { generateOrganizationSchema } from "@/lib/seo";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import JobsPage from "@/pages/JobsPage";
import CategoryPage from "@/pages/CategoryPage";
import CertificationsPage from "@/pages/CertificationsPage";
import ContactPage from "@/pages/ContactPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import FAQPage from "@/pages/FAQPage";
import ManufacturingPage from "@/pages/ManufacturingPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import QualityPage from "@/pages/QualityPage";
import TermsPage from "@/pages/TermsPage";
import SignupPage from "@/pages/SignupPage";
import AccountPage from "@/pages/AccountPage";
import NotFoundPage from "@/pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname === "/signup";

  return (
    <>
      <ScrollToTop />
      <PageLoader />
      <ScrollProgressBar />
      <Navbar />
      <main
        className="min-h-screen flex-1"
        style={{ paddingTop: "var(--site-header-height, 4.5rem)" }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/careers" element={<Navigate to="/jobs" replace />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/manufacturing" element={<ManufacturingPage />} />
          <Route path="/news" element={<Navigate to="/" replace />} />
          <Route path="/news/:slug" element={<Navigate to="/" replace />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/research" element={<Navigate to="/jobs" replace />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      {!hideFooter && <MobileAppNav />}
      <BackToTop />
      <CookieBanner />
      <FloatingButtons />
      <CartDrawer />
      <CheckoutModal />
      <LoginModal />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const orgSchema = generateOrganizationSchema();
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = JSON.stringify(orgSchema);
    el.dataset.seo = "organization";
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <AppLayout />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
