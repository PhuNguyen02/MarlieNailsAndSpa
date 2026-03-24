import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import PricingPage from '@/pages/PricingPage';
import BookingPage from '@/pages/BookingPage';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminLoginPage from '@/pages/Admin/LoginPage';
import AdminDashboard from '@/pages/Admin/Dashboard';
import CalendarPage from '@/pages/Admin/CalendarPage';
import StaffManagement from '@/pages/Admin/StaffManagement';
import ShiftManagementPage from '@/pages/Admin/ShiftManagementPage';
import ProtectedRoute from '@/components/Admin/ProtectedRoute';

// Blog - Customer Pages
import BlogHomePage from '@/pages/Blog/BlogHomePage';
import BlogListPage from '@/pages/Blog/BlogListPage';
import BlogPostPage from '@/pages/Blog/BlogPostPage';
import BlogSearchPage from '@/pages/Blog/BlogSearchPage';

// Blog - Admin Pages
import BlogDashboard from '@/pages/Admin/Blog/BlogDashboard';
import PostsList from '@/pages/Admin/Blog/PostsList';
import PostEditor from '@/pages/Admin/Blog/PostEditor';
import CategoriesManager from '@/pages/Admin/Blog/CategoriesManager';
import TagsManager from '@/pages/Admin/Blog/TagsManager';
import CommentsManager from '@/pages/Admin/Blog/CommentsManager';
import MediaLibrary from '@/pages/Admin/Blog/MediaLibrary';

// New Pages
import AboutPage from '@/pages/AboutPage/AboutPage';
import ContactPage from '@/pages/ContactPage/ContactPage';
import ContactMessagesManager from '@/pages/Admin/ContactMessagesManager';
import ServicesManager from '@/pages/Admin/ServicesManager';
import CustomersManager from '@/pages/Admin/CustomersManager';
import PromotionsManager from '@/pages/Admin/PromotionsManager';
import TestimonialsManager from '@/pages/Admin/TestimonialsManager';

// Customer Auth Pages
import LoginPage from '@/pages/Customer/LoginPage';
import RegisterPage from '@/pages/Customer/RegisterPage';
import CustomerDashboard from '@/pages/Customer/Dashboard';
import CustomerProfilePage from '@/pages/Customer/ProfilePage';
import CustomerProtectedRoute from '@/components/Customer/CustomerProtectedRoute';
import BannersManager from '@/pages/Admin/BannersManager';
import HomepageManager from '@/pages/Admin/HomepageManager';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Customer Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/my-account" element={<CustomerProtectedRoute />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="profile" element={<CustomerProfilePage />} />
      </Route>

      {/* Blog - Public Routes */}
      <Route path="/blog" element={<BlogHomePage />} />
      <Route path="/blog/category/:slug" element={<BlogListPage />} />
      <Route path="/blog/tag/:slug" element={<BlogListPage />} />
      <Route path="/blog/search" element={<BlogSearchPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="time-slots" element={<ShiftManagementPage />} />
          <Route path="settings" element={<div>Settings (Coming Soon)</div>} />

          {/* Blog Admin Routes */}
          <Route path="blog" element={<BlogDashboard />} />
          <Route path="blog/posts" element={<PostsList />} />
          <Route path="blog/posts/new" element={<PostEditor />} />
          <Route path="blog/posts/:id/edit" element={<PostEditor />} />
          <Route path="blog/categories" element={<CategoriesManager />} />
          <Route path="blog/tags" element={<TagsManager />} />
          <Route path="blog/comments" element={<CommentsManager />} />
          <Route path="blog/media" element={<MediaLibrary />} />

          {/* Contact Messages */}
          <Route path="contact-messages" element={<ContactMessagesManager />} />

          {/* Services & Customers */}
          <Route path="services" element={<ServicesManager />} />
          <Route path="customers" element={<CustomersManager />} />
          <Route path="promotions" element={<PromotionsManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="banners" element={<BannersManager />} />
          <Route path="homepage" element={<HomepageManager />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
