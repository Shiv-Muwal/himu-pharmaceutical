import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { CartProvider } from "@/providers/CartProvider";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
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
import AccountPage from "@/pages/AccountPage";
import NotFoundPage from "@/pages/NotFoundPage";

const LOGIN_SCROLL_KEY = "himu-scroll-login-prompted";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ScrollLoginPrompt() {
  const { pathname } = useLocation();
  const { isAuthenticated, loading, loginOpen, openLogin } = useAuth();

  useEffect(() => {
    if (loading || isAuthenticated || loginOpen) return;
    if (pathname === "/signup") return;
    if (sessionStorage.getItem(LOGIN_SCROLL_KEY) === "1") return;

    const onScroll = () => {
      if (window.scrollY < 160) return;
      if (sessionStorage.getItem(LOGIN_SCROLL_KEY) === "1") return;
      sessionStorage.setItem(LOGIN_SCROLL_KEY, "1");
      openLogin();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAuthenticated, loading, loginOpen, openLogin, pathname]);

  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <ScrollLoginPrompt />
      <PageLoader />
      <ScrollProgressBar />
      <Navbar />
      <main
        className="min-h-screen flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0"
        style={{ paddingTop: "var(--site-header-height, 4.5rem)" }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<AccountPage />} />
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
      <Footer />
      <MobileAppNav />
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
