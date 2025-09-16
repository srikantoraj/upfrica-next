# Project Structure

```
upfrica/
├── public/
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── media/
│   ├── placeholder.png
│   ├── robots.txt
│   └── site.webmanifest
├── scripts/
│   ├── gen-structure.mjs
│   ├── scan.mjs
│   └── snapshot.js
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── [cc]/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── reviews/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── write-review/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── PriceBlock.jsx
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── text.jsx
│   │   │   │   ├── find-for-me/
│   │   │   │   │   ├── layout.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── requests/
│   │   │   │   │   ├── opengraph-image.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── search/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── shops/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   ├── DummyShopInfo.jsx
│   │   │   │   │   │   ├── FaqJsonLd.jsx
│   │   │   │   │   │   ├── HeroSectionSkeleton.jsx
│   │   │   │   │   │   ├── PriceRange.css
│   │   │   │   │   │   ├── PriceRange.jsx
│   │   │   │   │   │   ├── ProductCardSkeleton.jsx
│   │   │   │   │   │   ├── SearchResultSkeleton.jsx
│   │   │   │   │   │   ├── ShopEditModal.jsx
│   │   │   │   │   │   ├── ShopPageClient.jsx
│   │   │   │   │   │   ├── ShopProfileCard.jsx
│   │   │   │   │   │   ├── ShopProfileSkeleton.jsx
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── ShopBadges.jsx
│   │   │   │   │   ├── ShopsPageClient.jsx
│   │   │   │   │   ├── layout.js
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── shoptypes/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── ShopTypePageClient.jsx
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── sourcing/
│   │   │   │   │   ├── requests/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   ├── layout.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── RegionSetter.jsx
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   ├── layout.jsx
│   │   │   │   ├── page.jsx
│   │   │   │   └── sitemap.js
│   │   │   ├── addItem/
│   │   │   │   └── page.jsx
│   │   │   ├── address/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── address-two/
│   │   │   │   └── page.jsx
│   │   │   ├── admin/
│   │   │   │   └── users/
│   │   │   │       └── page.jsx
│   │   │   ├── all-blogs/
│   │   │   │   ├── edit/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       ├── LoadingSkeleton.jsx
│   │   │   │   │       └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── bigcommerce/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── blog/
│   │   │   │   └── page.jsx
│   │   │   ├── bulksell/
│   │   │   │   └── page.jsx
│   │   │   ├── careers/
│   │   │   │   ├── apply/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── cart/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── categories/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── checkout/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── createdProduct/
│   │   │   │   └── page.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── all-orders/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.jsx
│   │   │   │   │   │   └── page1.jsx
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── DeliveryTracker.js
│   │   │   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   │   ├── OrdersPage.jsx
│   │   │   │   │   │   └── SideBar.jsx
│   │   │   │   │   ├── layout.js
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── page2.jsx
│   │   │   │   ├── all-orders copy/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.jsx
│   │   │   │   │   │   └── page1.jsx
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── DeliveryTracker.js
│   │   │   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   │   ├── OrdersPage.jsx
│   │   │   │   │   │   └── SideBar.jsx
│   │   │   │   │   ├── layout.js
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── page2.jsx
│   │   │   │   ├── all-products/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── create-help-blog/
│   │   │   │   │   ├── dummy/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── create-job/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── edit-job/
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.jsx
│   │   │   │   ├── payment-success/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── deals/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── details/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.jsx
│   │   │   ├── draft/
│   │   │   │   └── page.jsx
│   │   │   ├── dropship/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── edit/
│   │   │   │   └── page.jsx
│   │   │   ├── filter/
│   │   │   │   ├── Filter.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── PriceRange.css
│   │   │   │   ├── SearchBox.jsx
│   │   │   │   ├── layout.js
│   │   │   │   ├── page.jsx
│   │   │   │   └── priceRange.jsx
│   │   │   ├── help/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── layout.js
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── page.txt
│   │   │   │   ├── dummy/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── help-draft/
│   │   │   │   └── page.jsx
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   ├── multi_page/
│   │   │   │   └── page.jsx
│   │   │   ├── new-dashboard/
│   │   │   │   ├── add-new-product/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── layout.js
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── affiliate/
│   │   │   │   │   ├── referrals/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── agent/
│   │   │   │   │   ├── requests/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── all-orders/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.jsx
│   │   │   │   │   │   └── page1.jsx
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── DeliveryTracker.js
│   │   │   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   │   ├── OrdersPage.jsx
│   │   │   │   │   │   └── SideBar.jsx
│   │   │   │   │   ├── layout.js
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── page2.jsx
│   │   │   │   ├── all-products/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── all-users/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── blog-categories/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── buyer/
│   │   │   │   │   ├── requests/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── cancelled-orders/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── checkout/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── draft/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── draft-products/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── edit-product/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── specifics/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   └── variants/
│   │   │   │   │       └── [id]/
│   │   │   │   │           └── page.jsx
│   │   │   │   ├── help-blogs/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   ├── layout.js
│   │   │   │   │   │   ├── page.jsx
│   │   │   │   │   │   └── page.txt
│   │   │   │   │   ├── create-help-blog/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── draft-blogs/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   └── [slug]/
│   │   │   │   │   │       ├── LoadingSkeleton.jsx
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── create-job/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── edit-job/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── my-orders/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.jsx
│   │   │   │   │   │   └── page1.jsx
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── DeliveryTracker.js
│   │   │   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   │   ├── OrdersPage.jsx
│   │   │   │   │   │   └── SideBar.jsx
│   │   │   │   │   ├── layout.js
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── page2.jsx
│   │   │   │   ├── order-edit/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── BuyerInfoBlock.jsx
│   │   │   │   │   │   ├── DeliveryTracker.js
│   │   │   │   │   │   ├── MarkAsReceivedBottomSheet.jsx
│   │   │   │   │   │   ├── OrderCard.jsx
│   │   │   │   │   │   ├── OrderItemCard.jsx
│   │   │   │   │   │   ├── OrdersPage.jsx
│   │   │   │   │   │   ├── SellerOrderBlock.jsx
│   │   │   │   │   │   └── SideBar.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── out-of-stock/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── overview/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── payment-success/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── payments/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── pending-orders/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── pending-reviews/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── product-add/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── product-details/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── editor/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── page.jsx
│   │   │   │   │   └── page1.jsx
│   │   │   │   ├── profile-settings/
│   │   │   │   │   ├── address-book/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── quick-actions/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── requests/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── reviews/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── sales/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── DispatchInfo.jsx
│   │   │   │   │   │   ├── DispatchStatusBadge.jsx
│   │   │   │   │   │   ├── OrderDetailsModal.jsx
│   │   │   │   │   │   ├── OrderItemCard.jsx
│   │   │   │   │   │   ├── OrderSummaryBox.jsx
│   │   │   │   │   │   ├── SalesPage.jsx
│   │   │   │   │   │   ├── SalesPageTheme.jsx
│   │   │   │   │   │   ├── SellerOrderCard.jsx
│   │   │   │   │   │   ├── SellerOrderDetail.jsx
│   │   │   │   │   │   └── TrackingInfoModal.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── seller/
│   │   │   │   │   ├── reviews/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── settings/
│   │   │   │   │   ├── addresses/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── payout/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── security/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── shipping/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── shop/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── shipped-orders/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── sourcing/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── temp/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── layout-theme.jsx
│   │   │   │   ├── layout.js
│   │   │   │   ├── page-theme.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── onboarding/
│   │   │   │   └── account-type/
│   │   │   │       └── page.jsx
│   │   │   ├── order/
│   │   │   │   ├── [section]/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── orders/
│   │   │   │   ├── all/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── cancellations/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── purchases/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── returns/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── sales/
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── phoenixcoded/
│   │   │   │   └── page.jsx
│   │   │   ├── prelist/
│   │   │   │   └── page.jsx
│   │   │   ├── prelist_ebay/
│   │   │   │   └── page.jsx
│   │   │   ├── price/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── pricing/
│   │   │   │   └── page.jsx
│   │   │   ├── product_variants/
│   │   │   │   └── page.jsx
│   │   │   ├── products/
│   │   │   │   ├── edit/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   ├── specifics/
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.jsx
│   │   │   │   │   └── variants/
│   │   │   │   │       └── [id]/
│   │   │   │   │           └── page.jsx
│   │   │   │   └── new/
│   │   │   │       ├── [id]/
│   │   │   │       │   ├── layout.js
│   │   │   │       │   └── page.jsx
│   │   │   │       └── page.jsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.jsx
│   │   │   ├── sell-online/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── sellplus/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── shopify/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── shops/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.jsx
│   │   │   ├── sidebar/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── signup/
│   │   │   │   └── page.jsx
│   │   │   ├── sourcing/
│   │   │   │   └── page.jsx
│   │   │   ├── support/
│   │   │   │   └── page.jsx
│   │   │   ├── todays-deals/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── unauthorized/
│   │   │   │   └── page.jsx
│   │   │   ├── updated-password/
│   │   │   │   └── page.jsx
│   │   │   ├── updated-profile/
│   │   │   │   └── page.jsx
│   │   │   ├── upsearch/
│   │   │   │   └── [name]/
│   │   │   │       ├── layout.js
│   │   │   │       └── page.jsx
│   │   │   ├── verify-account/
│   │   │   │   └── page.jsx
│   │   │   ├── works/
│   │   │   │   ├── layout.js
│   │   │   │   └── page.jsx
│   │   │   ├── zoomImage/
│   │   │   │   └── page.jsx
│   │   │   ├── page.jsx
│   │   │   └── upload-test.jsx
│   │   ├── agent/
│   │   │   ├── requests/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   ├── api/
│   │   │   ├── [...path]/
│   │   │   │   └── route.js
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.js
│   │   │   │   └── me/
│   │   │   │       └── route.js
│   │   │   ├── b/
│   │   │   │   └── [...path]/
│   │   │   │       └── route.js
│   │   │   ├── revalidate/
│   │   │   │   └── route.js
│   │   │   ├── sourcing/
│   │   │   │   └── config/
│   │   │   │       └── route.js
│   │   │   ├── suggest/
│   │   │   │   └── route.js
│   │   │   └── products.js
│   │   ├── fonts/
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── image/
│   │   │   └── signin.svg
│   │   ├── landing/
│   │   │   └── page.js
│   │   ├── password/
│   │   │   └── new/
│   │   │       └── page.jsx
│   │   ├── reviews/
│   │   │   └── [reviewToken]/
│   │   │       └── page.jsx
│   │   ├── sandbox/
│   │   │   └── price/
│   │   │       └── page.jsx
│   │   ├── settings/
│   │   │   ├── addresses/
│   │   │   │   └── page.jsx
│   │   │   ├── payments/
│   │   │   │   └── page.jsx
│   │   │   ├── payouts/
│   │   │   │   └── page.jsx
│   │   │   ├── shop/
│   │   │   │   └── page.jsx
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx
│   │   │   └── page2.jsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── countrySlice.js
│   │   │   │   ├── exchangeRatesSlice.js
│   │   │   │   ├── reviewsSlice.js
│   │   │   │   ├── toggleSlice.js
│   │   │   │   ├── uiSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── store.js
│   │   ├── upload-test/
│   │   │   └── page.jsx
│   │   ├── utils/
│   │   │   ├── productUtils.js
│   │   │   ├── roles.js
│   │   │   ├── showToast.js
│   │   │   ├── storage.js
│   │   │   └── utils.js
│   │   ├── constants.js
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── loading.jsx
│   │   ├── page.js
│   │   ├── providers.jsx
│   │   ├── sitemap.js
│   │   └── theme.txt
│   ├── components/
│   │   ├── AddItem/
│   │   │   ├── AiDescription.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── CollectionInPersonSection.jsx
│   │   │   ├── CompleteListing.jsx
│   │   │   ├── DeliveryDetails.jsx
│   │   │   ├── DomesticPostage.jsx
│   │   │   ├── DropdownSelect.jsx
│   │   │   ├── EbayFooter.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── Item.jsx
│   │   │   ├── ItemAttributeField.jsx
│   │   │   ├── ItemAttributesForm.jsx
│   │   │   ├── ItemConditionSelector.jsx
│   │   │   ├── ItemDisclosures.jsx
│   │   │   ├── ItemSpecificsForm.jsx
│   │   │   ├── LegalFAQNotice.jsx
│   │   │   ├── ListingCTA.jsx
│   │   │   ├── ListingFee.jsx
│   │   │   ├── PackageDetails.jsx
│   │   │   ├── PhotoTipsModal.jsx
│   │   │   ├── PhotoUploader.jsx
│   │   │   ├── PhotoUploaderUI.jsx
│   │   │   ├── PriceFields.jsx
│   │   │   ├── PricingOptionsPanel.jsx
│   │   │   ├── PricingSection.jsx
│   │   │   ├── PromoteListing.jsx
│   │   │   ├── ScheduleListing.jsx
│   │   │   ├── SoldListingsSummary.jsx
│   │   │   ├── ThumbnailGrid.jsx
│   │   │   ├── TitleSection.jsx
│   │   │   ├── ToggleOptions.jsx
│   │   │   └── UploaderGrid.jsx
│   │   ├── Careers/
│   │   │   ├── CareersHero.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── JobList .jsx
│   │   │   ├── JoinUpfrica.jsx
│   │   │   └── JoinUsSection.jsx
│   │   ├── LocaleRedirect/
│   │   │   └── LocaleRedirect.js
│   │   ├── Modal/
│   │   │   └── Modal.jsx
│   │   ├── ProductDetailSection/
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── DetailsTabs.jsx
│   │   │   ├── PriceBlock.jsx
│   │   │   ├── ProductDetailSection.jsx
│   │   │   ├── ProductSlider-wip.jsx
│   │   │   ├── ProductSlider.jsx
│   │   │   ├── ProductSliderOlds.jsx
│   │   │   ├── ReviewsPreview.jsx
│   │   │   ├── SellerCard.jsx
│   │   │   ├── SpecificsTableWithIcons.jsx
│   │   │   ├── StickyPriceBar.jsx
│   │   │   ├── TrustBadges.jsx
│   │   │   └── UnavailableProduct.jsx
│   │   ├── SalesEndSection/
│   │   │   └── SalesEndSection.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   ├── addresses/
│   │   │   ├── AddressForm.jsx
│   │   │   └── GoogleAddressInput.jsx
│   │   ├── affiliate/
│   │   │   └── CreateReferralDrawer.jsx
│   │   ├── api/
│   │   │   ├── data.js
│   │   │   └── useBrands.js
│   │   ├── auth/
│   │   │   ├── AccessDeniedScreen.jsx
│   │   │   ├── AuthSheetProvider.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RoleGuard.jsx
│   │   ├── badges/
│   │   │   ├── BadgePill.jsx
│   │   │   ├── BadgeStrip.jsx
│   │   │   └── TrustBadge.jsx
│   │   ├── bigcommerce/
│   │   │   ├── AIMachineTypes.jsx
│   │   │   ├── AuthorCard.jsx
│   │   │   ├── BlogHeader.jsx
│   │   │   ├── BlogPage.jsx
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── FashionAIImpact.jsx
│   │   │   ├── HeaderSection.jsx
│   │   │   ├── PdfDownloadCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ShareButtons.jsx
│   │   │   ├── TableOfContents.jsx
│   │   │   └── WhatIsAI.jsx
│   │   ├── common/
│   │   │   ├── New arrivals/
│   │   │   │   └── NewArrivals.jsx
│   │   │   ├── footer/
│   │   │   │   └── Footer.jsx
│   │   │   ├── header/
│   │   │   │   ├── Cover.jsx
│   │   │   │   ├── CustomSlider.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── LogoutButton.jsx
│   │   │   │   ├── Nav.jsx
│   │   │   │   ├── NavTitle.jsx
│   │   │   │   ├── PhoneSlider.jsx
│   │   │   │   ├── SearchBox.jsx
│   │   │   │   ├── ShopingCart.jsx
│   │   │   │   ├── UserEmail.jsx
│   │   │   │   ├── UserMenu.jsx
│   │   │   │   └── UserName.jsx
│   │   │   ├── nav/
│   │   │   │   └── NotificationsBell.jsx
│   │   │   ├── AccessDeniedScreen.jsx
│   │   │   ├── AccountTypeBadge.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── LangDomSync.jsx
│   │   │   ├── Money.jsx
│   │   │   └── StarRating.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashbordSearchBar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── e-commerce/
│   │   │   ├── checkout/
│   │   │   │   └── CheckoutPage.jsx
│   │   │   ├── product-detail/
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── ProductFeatures.jsx
│   │   │   │   └── RelatedProducts.jsx
│   │   │   ├── products/
│   │   │   │   ├── Product.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductFilterBar.jsx
│   │   │   │   └── ProductsPage.jsx
│   │   │   └── products-list/
│   │   │       └── ProductList.jsx
│   │   ├── form/
│   │   │   └── DateTimeField.jsx
│   │   ├── help/
│   │   │   ├── HelpCenterPage.jsx
│   │   │   ├── MainArticle.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── home/
│   │   │   ├── About/
│   │   │   │   └── About.jsx
│   │   │   ├── Categories/
│   │   │   │   ├── Categories.jsx
│   │   │   │   └── CategoryItem.jsx
│   │   │   ├── Faq/
│   │   │   │   ├── Faq.jsx
│   │   │   │   └── FaqItem.jsx
│   │   │   ├── ProductList/
│   │   │   │   ├── PriceRefinements.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductListClient.jsx
│   │   │   │   ├── RealtedProduct.jsx
│   │   │   │   ├── RecentProductCard.jsx
│   │   │   │   ├── RecentlyViewedList.jsx
│   │   │   │   ├── RelatedProductCard.jsx
│   │   │   │   ├── RelatedProductCardSkeleton.jsx
│   │   │   │   └── ShopCard.jsx
│   │   │   ├── BottomBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HeroCarousel.jsx
│   │   │   ├── HeroCurved.jsx
│   │   │   ├── NavCategories.jsx
│   │   │   ├── ProductRail.jsx
│   │   │   ├── PromoTiles.jsx
│   │   │   ├── RailCard.jsx
│   │   │   ├── StickyPriceBar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── ValuePills.jsx
│   │   ├── input/
│   │   │   ├── ApprovalNotesSelect.jsx
│   │   │   ├── Brand.jsx
│   │   │   ├── CancellationReturns.jsx
│   │   │   ├── Categore.jsx
│   │   │   ├── Conditon.jsx
│   │   │   ├── DateSelector.jsx
│   │   │   ├── DeliverySection.jsx
│   │   │   ├── Description.jsx
│   │   │   ├── PhoneInput.jsx
│   │   │   ├── Photo.jsx
│   │   │   ├── PriceSection.jsx
│   │   │   ├── Promotions.jsx
│   │   │   ├── SellersPaymentTerms.jsx
│   │   │   ├── SubmitButton.jsx
│   │   │   └── Title.jsx
│   │   ├── men fashion/
│   │   │   └── MenFashion.jsx
│   │   ├── multi_page/
│   │   │   ├── App.jsx
│   │   │   ├── BulkEditMenu.jsx
│   │   │   ├── DraftRow.jsx
│   │   │   ├── DraftTable.jsx
│   │   │   └── Header.jsx
│   │   ├── new-dashboard/
│   │   │   ├── products/
│   │   │   │   ├── AddProductForm.jsx
│   │   │   │   ├── EditProductForm.jsx
│   │   │   │   ├── ProductDashboard.jsx
│   │   │   │   ├── ProductListCards.jsx
│   │   │   │   ├── ProductListCardstheme.jsx
│   │   │   │   ├── ProductListResponsive.jsx
│   │   │   │   ├── ProductListTable.jsx
│   │   │   │   ├── ProductListTabletheme.jsx
│   │   │   │   ├── ProductSummaryPills.jsx
│   │   │   │   └── ProductsHeader.jsx
│   │   │   ├── settings/
│   │   │   │   ├── FAQs.jsx
│   │   │   │   ├── PayoutSettings.jsx
│   │   │   │   ├── ShopDetailsForm.jsx
│   │   │   │   └── ShopDetailsSettings.jsx
│   │   │   ├── sourcing/
│   │   │   │   ├── tables/
│   │   │   │   │   ├── BrowseRequestsTable.jsx
│   │   │   │   │   ├── MyOffersTable.jsx
│   │   │   │   │   └── MySourcingOrders.jsx
│   │   │   │   ├── MyRequests.jsx
│   │   │   │   ├── OfferComposeModal.jsx
│   │   │   │   ├── RequestDetails.jsx
│   │   │   │   ├── SourcingWorkbench.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── AffiliateDashboardHome.jsx
│   │   │   ├── AffiliateSidebar.jsx
│   │   │   ├── AgentDashboardHome.jsx
│   │   │   ├── AgentShell.jsx
│   │   │   ├── AgentSidebar.jsx
│   │   │   ├── Buyer-theme.jsx
│   │   │   ├── BuyerDashboardHome.jsx
│   │   │   ├── BuyerSidebar.jsx
│   │   │   ├── CompleteSetupBanner.jsx
│   │   │   ├── DashboardHomeTheme.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── DynamicSidebar.jsx
│   │   │   ├── DynamicSidebarLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MetricBox.jsx
│   │   │   ├── MyReviewsPageContent.jsx
│   │   │   ├── ProductReviewList.jsx
│   │   │   ├── RecentReviews.jsx
│   │   │   ├── RequireRole.jsx
│   │   │   ├── RoleSwitcher.jsx
│   │   │   ├── SellerDashboardHome.jsx
│   │   │   ├── SellerProductReviewCard.jsx
│   │   │   ├── SellerReviewCard.jsx
│   │   │   ├── SellerReviewList.jsx
│   │   │   ├── SellerReviewsPageContent.jsx
│   │   │   ├── SellerReviewsSummaryCard.jsx
│   │   │   ├── SellerSidebar.jsx
│   │   │   ├── SeoArticleEditor.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── page.jsx
│   │   ├── onboarding/
│   │   │   ├── AccountTypeAndPlan-1.jsx
│   │   │   ├── AccountTypeAndPlan.jsx
│   │   │   ├── AccountTypePage.jsx
│   │   │   └── AccountTypeSelector.jsx
│   │   ├── order/
│   │   │   ├── OrderBord.jsx
│   │   │   ├── OrderCart.jsx
│   │   │   └── ProfileCard.jsx
│   │   ├── overview/
│   │   │   ├── Analytics.jsx
│   │   │   ├── AnalyticsSection.jsx
│   │   │   ├── ChartSection.jsx
│   │   │   ├── EarningsChart.jsx
│   │   │   ├── IdeasLocations.jsx
│   │   │   ├── MapPlaceholder.jsx
│   │   │   ├── RatingSection.jsx
│   │   │   ├── RecentOrders.jsx
│   │   │   ├── RecentUsers.jsx
│   │   │   ├── ResponsiveHeader.jsx
│   │   │   ├── SalesCard.jsx.jsx
│   │   │   ├── SalesCardGroup.jsx
│   │   │   ├── SellerOrdersData.jsx
│   │   │   ├── SocialCard.jsx
│   │   │   ├── SocialStats.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── SummaryGroup.jsx
│   │   │   ├── UserFeedbackSection.jsx
│   │   │   ├── UserStats.jsx
│   │   │   ├── earningsData.js
│   │   │   ├── recentUsers.js
│   │   │   ├── socialStats.js
│   │   │   └── summaryCards.js
│   │   ├── priceFiter/
│   │   │   ├── LeftFilter.jsx
│   │   │   └── PopularShoppingIdeas.jsx
│   │   ├── pricing/
│   │   │   └── UpfricaPricing.jsx
│   │   ├── productVeryenet/
│   │   │   ├── ProductVariantForm.jsx
│   │   │   ├── VariantGroup.jsx
│   │   │   └── VariantOption.jsx
│   │   ├── products/
│   │   │   ├── ProductEditorStepper.jsx
│   │   │   ├── ProductListTable.jsx
│   │   │   └── QuickListDrawer.jsx
│   │   ├── review/
│   │   │   ├── DisplayReviews.jsx
│   │   │   ├── ProductRatingLine.jsx
│   │   │   ├── ProductReviewModal.jsx
│   │   │   ├── ProductSummaryCard.jsx
│   │   │   ├── RatingPopover.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── ReviewListInfinite.jsx
│   │   │   ├── ReviewSummaryBox.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── StillInStockBanner.jsx
│   │   │   └── SubmitReviewForm.jsx
│   │   ├── search/
│   │   │   ├── SearchAutosuggest.jsx
│   │   │   └── SearchFacets.jsx
│   │   ├── shopify/
│   │   │   ├── CtaFooterBanner.jsx
│   │   │   ├── DdpLabelsSection.jsx
│   │   │   ├── DutiesCollection.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── NewsletterBanner.jsx
│   │   │   ├── ShopifyBanner.jsx
│   │   │   ├── ShopifyShippingHero.jsx
│   │   │   ├── SidebarNewsletterCTA.jsx
│   │   │   ├── StartBusinessCTA.jsx
│   │   │   ├── TariffNoticeSection.jsx
│   │   │   └── TradeUpdateSection.jsx
│   │   ├── sourcing/
│   │   │   ├── MyRequests.jsx
│   │   │   ├── OfferList.jsx
│   │   │   ├── OffersPanel.jsx
│   │   │   ├── PublicBrowseRequests.jsx
│   │   │   └── RequestForm.jsx
│   │   ├── support/
│   │   │   └── MobileNav.jsx
│   │   ├── ui/
│   │   │   ├── details/
│   │   │   │   └── Dummy.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── FormInput.jsx
│   │   │   ├── InfoPopover.jsx
│   │   │   ├── InfoTooltip.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── PlanCheckoutModal.jsx
│   │   │   ├── PlanComparisonModal.jsx
│   │   │   ├── PlanComparisonTable.jsx
│   │   │   ├── PlanToggleFilter.jsx
│   │   │   ├── button.jsx
│   │   │   ├── dialog.js
│   │   │   ├── popover.jsx
│   │   │   └── tooltip.jsx
│   │   ├── user/
│   │   │   ├── UserContent.jsx
│   │   │   └── Users.jsx
│   │   ├── Addresses.jsx
│   │   ├── BasketModal.jsx
│   │   ├── BasketSheet.jsx
│   │   ├── BasketSheetGlobal.jsx
│   │   ├── CartModal.jsx
│   │   ├── CategoreTitle.jsx
│   │   ├── CommonButton.jsx
│   │   ├── ContactSellerCard.jsx
│   │   ├── ContactSheet.jsx
│   │   ├── CreateReview.jsx
│   │   ├── CreateReviews.jsx
│   │   ├── CustomerReviewsSection.jsx
│   │   ├── DeliveryDate.jsx
│   │   ├── DescriptionAndReviews.jsx
│   │   ├── DirectBuyPopup.jsx
│   │   ├── EarlyDeals.jsx
│   │   ├── EarlyDealsClient.jsx
│   │   ├── FeatureGate.jsx
│   │   ├── GoogleMapsLoader.jsx
│   │   ├── Guard.jsx
│   │   ├── HeaderControls.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── InfoPopover.jsx
│   │   ├── InputField.jsx
│   │   ├── LaptopDetels.jsx
│   │   ├── LoaderButton.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── LocalStorageComponent.jsx
│   │   ├── LocaleControl.jsx
│   │   ├── Modal.jsx
│   │   ├── MultiBuySection.jsx
│   │   ├── MultiPriceBoxes.jsx
│   │   ├── Pagination.jsx
│   │   ├── PaymentDeliveryReturns.jsx
│   │   ├── PaymentMethod.jsx
│   │   ├── PhotosSection.jsx
│   │   ├── Price.jsx
│   │   ├── ProductImage.jsx
│   │   ├── ProductList.server.jsx
│   │   ├── RatingSection.jsx
│   │   ├── RecentlyViewed.js
│   │   ├── SellectedItem.jsx
│   │   ├── Selling.jsx
│   │   ├── ShopFAQSection.jsx
│   │   ├── ShopRichArticle.jsx
│   │   ├── SimplePrice.jsx
│   │   ├── Slider.jsx
│   │   ├── SortableImage.jsx
│   │   ├── TextSection.jsx
│   │   ├── TitleFrom.jsx
│   │   ├── ToastEditor.jsx
│   │   ├── UploadTester.jsx
│   │   ├── User.jsx
│   │   ├── WomenFasion.jsx
│   │   ├── menuItems.js
│   │   ├── menuItems2
│   │   └── useAutosave.jsx
│   ├── constants/
│   │   └── infoRegistry.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   ├── AuthContext.js.bak
│   │   ├── LocalizationProvider.jsx
│   │   ├── OrderContext.js
│   │   └── RoleViewContext.js
│   ├── hooks/
│   │   ├── useCountries.js
│   │   ├── useEntitlements.js
│   │   ├── useOnboardingGate.js
│   │   ├── useSaleCountdown.js
│   │   └── useTheme.js
│   ├── icon/
│   │   └── 5e77cec29a2d83c77498eed4_hero-illustration.svg
│   ├── lib/
│   │   ├── api/
│   │   │   ├── search.js
│   │   │   └── suggest.js
│   │   ├── products/
│   │   │   └── api.js
│   │   ├── seo/
│   │   │   ├── builders.js
│   │   │   └── helpers.js
│   │   ├── set-cc/
│   │   │   └── route.js
│   │   ├── sourcing/
│   │   │   ├── api.js
│   │   │   └── hooks.js
│   │   ├── api-path.js
│   │   ├── api.js
│   │   ├── axiosInstance.js
│   │   ├── cc.js
│   │   ├── cdn-image-loader.js
│   │   ├── currency.js
│   │   ├── fx.js
│   │   ├── geo.js
│   │   ├── getCleanToken.js
│   │   ├── home.js
│   │   ├── i18n.js
│   │   ├── image.js
│   │   ├── init.js
│   │   ├── locale-routing.js
│   │   ├── money.js
│   │   ├── notifications.js
│   │   ├── pricing-mini.js
│   │   ├── pricing.js
│   │   ├── rails.js
│   │   ├── seller-contact.js
│   │   ├── socialLoginUrl.js
│   │   └── utils.js
│   └── public/
│       ├── icon/
│       │   └── 5e77cec29a2d83c77498eed4_hero-illustration.svg
│       └── images/
│           ├── carres.jpg
│           └── logo.png
├── .env.local
├── .env.production
├── .env.test
├── .gitignore
├── README.md
├── STRUCTURE.md
├── frontend_scan.json
├── jsconfig.json
├── middleware.js
├── next-env.d.ts
├── next.config.js
├── old_next.config.mjs.txt
├── package.json
├── postcss.config.mjs
├── scan.txt
├── scan_frontend.py
├── struct.txt
├── tailwind.config.js
└── tsconfig.json
```

## App routes (focus)

```
upfrica/
├── app/
│   (no app/ directory found)
```

## Components (by category snapshot)

```
upfrica/
├── components/
│   (no components/ directory found)
```
