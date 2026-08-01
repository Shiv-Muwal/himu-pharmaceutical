import {
  ShopPromoStrip,
  BannerCarousel,
  ShopSearchBar,
  QuickCategoryRail,
  DermaSpotlightSection,
  PopularShopSection,
  ShopTrustStrip,
  ShopCTASection,
} from "@/components/sections/shop-home";

export default function HomePage() {
  return (
    <>
      <ShopPromoStrip />
      <BannerCarousel />
      <ShopSearchBar />
      <QuickCategoryRail />
      <DermaSpotlightSection />
      <ShopTrustStrip />
      <PopularShopSection />
      <ShopCTASection />
    </>
  );
}
