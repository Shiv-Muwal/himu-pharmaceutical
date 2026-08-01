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
import {
  TrustedBrandsSection,
  ShopWithBrandsSection,
  HomeBlogsSection,
} from "@/components/sections/home-extras";

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
      <TrustedBrandsSection />
      <ShopWithBrandsSection />
      <ShopCTASection />
      <HomeBlogsSection />
    </>
  );
}
