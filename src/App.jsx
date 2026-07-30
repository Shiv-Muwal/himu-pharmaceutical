import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { CartProvider } from "@/providers/cart-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
import AdminPage from "@/admin";
import CareersPage from "@/pages/CareersPage";
import CategoryPage from "@/pages/CategoryPage";
import CertificationsPage from "@/pages/CertificationsPage";
import ContactPage from "@/pages/ContactPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import FAQPage from "@/pages/FAQPage";
import ManufacturingPage from "@/pages/ManufacturingPage";
import NewsPage from "@/pages/NewsPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import QualityPage from "@/pages/QualityPage";
import ResearchPage from "@/pages/ResearchPage";
import TermsPage from "@/pages/TermsPage";
import SignupPage from "@/pages/SignupPage";
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
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <PageLoader />
      {!isAdmin && <ScrollProgressBar />}
      {!isAdmin && <Navbar />}
      <main className="flex-1 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/manufacturing" element={<ManufacturingPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/quality" element={<QualityPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
      {!isAdmin && <CookieBanner />}
      {!isAdmin && <FloatingButtons />}
      <CartDrawer />
      <CheckoutModal />
      {!isAdmin && <LoginModal />}
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
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
