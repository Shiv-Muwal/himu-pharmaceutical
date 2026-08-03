import {
  ShopPromoStrip,
  BannerCarousel,
  ShopSearchBar,
  QuickCategoryRail,
  DermaSpotlightSection,
  ShopTrustStrip,
  ShopCTASection,
} from "@/components/sections/shop-home";
import {
  TrustedBrandsSection,
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
      <TrustedBrandsSection />
      <ShopCTASection />
      <HomeBlogsSection />
    </>
  );
}
