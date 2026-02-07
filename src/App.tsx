import { Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './app/providers';
import { LoginPage } from './features/auth/pages/LoginPage';
import { SignupPage } from './features/auth/pages/SignupPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { UsersPage } from './features/users/pages/UsersPage';
import { ListingPage } from './features/listing/pages/ListingPage';
import { Extra } from './features/dashboard/pages/Extra';
import { PromotionBannerPage } from './features/promotion-banner/pages/PromotionBannerPage';
import { VendorsPage } from './features/vendors/pages/VendorsPage';
import { FeedsPage } from './features/feeds/pages/FeedsPage';
import { BreedersPage } from './features/breeders/pages/BreedersPage';
import { FeedRequestsPage } from './features/feed-requests/pages/FeedRequestsPage';
import { PaymentsPage } from './features/payments/pages/PaymentsPage';
import { PairsPage } from './features/pairs/pages/PairsPage';
import { VeterinaryListPage } from './features/veterinary/pages/VeterinaryListPage';
import { TopVeterinaryPage } from './features/veterinary/pages/TopVeterinaryPage';
import { FeaturedListingPage } from './features/featured-listing/pages/FeaturedListingPage';
import { FeaturedPricingPage } from './features/featured-pricing/pages/FeaturedPricingPage';
import { MainLayout } from './features/dashboard/components/MainLayout';
import { RequireAuth } from './features/auth/components/RequireAuth';

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/extra" element={<Extra />} />

        {/* Authenticated Routes with Persistent Sidebar */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/listing" element={<ListingPage />} />
            <Route path="/promotion-banner" element={<PromotionBannerPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/feeds" element={<FeedsPage />} />
            <Route path="/breeders" element={<BreedersPage />} />
            <Route path="/requests" element={<FeedRequestsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/pairs" element={<PairsPage />} />
            <Route path="/veterinary/list" element={<VeterinaryListPage />} />
            <Route path="/veterinary/top" element={<TopVeterinaryPage />} />
            <Route path="/featured-listing" element={<FeaturedListingPage />} />
            <Route path="/featured-pricing" element={<FeaturedPricingPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Providers>
  );
}

export default App;
