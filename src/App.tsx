import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { EnquiryModal } from './components/EnquiryModal.tsx';

// Public Views
import { HomeView } from './views/HomeView.tsx';
import { CatalogueView } from './views/CatalogueView.tsx';
import { FabricDetailView } from './views/FabricDetailView.tsx';
import { CollectionsView } from './views/CollectionsView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ManufacturingView } from './views/ManufacturingView.tsx';
import { BlogView } from './views/BlogView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { LocationView } from './views/LocationView.tsx';
import { SEOHead } from './components/SEOHead.tsx';

// Admin Views
import { AdminLayout } from './views/admin/AdminLayout.tsx';
import { AdminLogin } from './views/admin/AdminLogin.tsx';
import { AdminDashboard } from './views/admin/AdminDashboard.tsx';
import { AdminFabrics } from './views/admin/AdminFabrics.tsx';
import { AdminEnquiries } from './views/admin/AdminEnquiries.tsx';
import { AdminCollections } from './views/admin/AdminCollections.tsx';
import { AdminCategories } from './views/admin/AdminCategories.tsx';
import { AdminHeroSlides } from './views/admin/AdminHeroSlides.tsx';
import { AdminContacts } from './views/admin/AdminContacts.tsx';
import { AdminBlog } from './views/admin/AdminBlog.tsx';
import { AdminTestimonials } from './views/admin/AdminTestimonials.tsx';
import { AdminManufacturing } from './views/admin/AdminManufacturing.tsx';
import { AdminSubscribers } from './views/admin/AdminSubscribers.tsx';
import { AdminMedia } from './views/admin/AdminMedia.tsx';
import { AdminSettings } from './views/admin/AdminSettings.tsx';
import { AdminShopTheLook } from './views/admin/AdminShopTheLook.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryFabricName, setEnquiryFabricName] = useState<string>('');

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('sri_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string }>(() => {
    const saved = localStorage.getItem('sri_admin_user');
    return saved ? JSON.parse(saved) : { name: 'SRI Fabrics Admin', email: 'admin@srifabrics.com' };
  });
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Handle URL history state & sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Ensure scroll is instantly at top whenever route changes so hero slide is never hidden
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPath]);

  const navigateTo = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    // Always instantly scroll to the absolute top so the slide is completely visible right from header
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleOpenEnquiry = (fabricName?: string) => {
    setEnquiryFabricName(fabricName || '');
    setEnquiryModalOpen(true);
  };

  const handleAdminLogin = (token: string, admin: any) => {
    setAdminToken(token);
    setAdminUser(admin);
    localStorage.setItem('sri_admin_token', token);
    localStorage.setItem('sri_admin_user', JSON.stringify(admin));
    navigateTo('/arvexa');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('sri_admin_token');
    localStorage.removeItem('sri_admin_user');
    navigateTo('/arvexa');
  };

  // Route Dispatcher
  const renderContent = () => {
    // 1. Admin Routing (Hidden route accessible via /arvexa)
    if (currentPath.startsWith('/arvexa') || currentPath.startsWith('/admin')) {
      if (!adminToken) {
        return (
          <AdminLogin
            onLoginSuccess={handleAdminLogin}
            onBackToSite={() => navigateTo('/')}
          />
        );
      }

      return (
        <AdminLayout
          currentTab={adminTab}
          onTabChange={setAdminTab}
          onLogout={handleAdminLogout}
          adminUser={adminUser}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard token={adminToken} onNavigateTab={setAdminTab} />
          )}
          {adminTab === 'enquiries' && <AdminEnquiries token={adminToken} />}
          {adminTab === 'fabrics' && <AdminFabrics token={adminToken} />}
          {adminTab === 'collections' && <AdminCollections token={adminToken} />}
          {adminTab === 'categories' && <AdminCategories token={adminToken} />}
          {adminTab === 'hero-slides' && <AdminHeroSlides token={adminToken} />}
          {adminTab === 'shop-the-look' && <AdminShopTheLook token={adminToken} />}
          {adminTab === 'contacts' && <AdminContacts token={adminToken} />}
          {adminTab === 'blog' && <AdminBlog token={adminToken} />}
          {adminTab === 'testimonials' && <AdminTestimonials token={adminToken} />}
          {adminTab === 'manufacturing' && <AdminManufacturing token={adminToken} />}
          {adminTab === 'subscribers' && <AdminSubscribers token={adminToken} />}
          {adminTab === 'media' && <AdminMedia token={adminToken} />}
          {adminTab === 'settings' && <AdminSettings token={adminToken} />}
        </AdminLayout>
      );
    }

    // 2. Public Dynamic Routing
    if (currentPath.startsWith('/fabrics/')) {
      const slug = currentPath.replace('/fabrics/', '').split('?')[0];
      return (
        <FabricDetailView
          slug={slug}
          onBack={() => navigateTo('/sarees')}
          onRequestEnquiry={handleOpenEnquiry}
          onViewFabric={(s) => navigateTo(`/fabrics/${s}`)}
          onNavigate={navigateTo}
        />
      );
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '').split('?')[0];
      return <BlogView initialSlug={slug} onNavigate={navigateTo} />;
    }

    // 3. Location-Based Sourcing Hub Routing
    if (currentPath.startsWith('/locations/')) {
      const slug = currentPath.replace('/locations/', '').split('?')[0];
      return (
        <LocationView
          locationSlug={slug}
          onNavigate={navigateTo}
          onRequestEnquiry={handleOpenEnquiry}
        />
      );
    }

    // Shorthand Location Aliases
    const locationAliases: Record<string, string> = {
      '/fabric-wholesale-surat': 'surat',
      '/textile-wholesale-gujarat': 'gujarat',
      '/b2b-fabric-ahmedabad': 'ahmedabad',
      '/wholesale-fabric-mumbai': 'mumbai',
      '/b2b-textile-delhi': 'delhi',
      '/wholesale-fabric-jaipur': 'jaipur',
      '/fabric-wholesale-bengaluru': 'bengaluru',
      '/b2b-textile-india': 'india',
      '/locations': 'india',
    };

    const cleanPath = currentPath.split('?')[0];
    if (locationAliases[cleanPath]) {
      return (
        <LocationView
          locationSlug={locationAliases[cleanPath]}
          onNavigate={navigateTo}
          onRequestEnquiry={handleOpenEnquiry}
        />
      );
    }

    // Parse query params for catalogue
    const searchParams = new URLSearchParams(window.location.search);
    const catQuery = searchParams.get('category') || undefined;
    const colQuery = searchParams.get('collection') || undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const typeQuery = searchParams.get('fabricType') || undefined;

    const normalizedPath = currentPath.split('?')[0];

    switch (normalizedPath) {
      case '/fabrics':
      case '/fabric':
        return (
          <>
            <SEOHead
              title="Fabric Wholesale Surat | Pure Silk, Chinon & Georgette Yardages | SRI FABRIC"
              description="Wholesale fabrics directly from Surat looms. Sourcing pure mulberry silks, viscose chinon, organza, georgette & plain dyed bases for apparel makers & designers."
              keywords="fabric wholesale Surat, wholesale fabrics Surat, pure silk fabric wholesale, viscose chinon Surat, organza fabric wholesale, georgette fabric mill, Surat textile market Ring Road, bulk fabric supplier India"
              canonicalPath="/fabrics"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Wholesale Fabrics Surat',
                description: 'Wholesale fabrics directly from Surat looms including pure silks, chinon, organza, and georgettes.',
                url: 'https://srifabrics.com/fabrics',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Wholesale Fabrics', item: 'https://srifabrics.com/fabrics' },
                  ],
                },
              }}
            />
            <CatalogueView
              key="fabric-catalogue"
              collectionType="fabric"
              initialCategory={catQuery}
              initialSearch={searchQuery}
              initialFabricType={typeQuery}
              onViewFabric={(slug) => navigateTo(`/fabrics/${slug}`)}
              onRequestEnquiry={handleOpenEnquiry}
              onNavigate={navigateTo}
            />
          </>
        );

      case '/top-dupatta':
      case '/top-dupatta-set':
      case '/topdupatta':
        return (
          <>
            <SEOHead
              title="Top + Dupatta Sets Wholesale Surat | Artisanal Suit Lengths | SRI FABRIC"
              description="Wholesale unstitched designer top & dupatta sets from Surat. Premium combed cotton, muslin, digital printed chinon & coordinated ethnic ensembles for boutiques."
              keywords="top dupatta wholesale Surat, unstitched suit wholesale, wholesale kurti fabric Surat, muslin suit sets wholesale, digital print dupatta wholesale, boutique salwar suit fabrics"
              canonicalPath="/top-dupatta"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Top + Dupatta Wholesale Sets',
                description: 'Designer unstitched top and dupatta sets for boutiques and retailers.',
                url: 'https://srifabrics.com/top-dupatta',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Top + Dupatta Sets', item: 'https://srifabrics.com/top-dupatta' },
                  ],
                },
              }}
            />
            <CatalogueView
              key="top-dupatta-catalogue"
              collectionType="top-dupatta"
              initialCategory={catQuery}
              initialSearch={searchQuery}
              initialFabricType={typeQuery}
              onViewFabric={(slug) => navigateTo(`/fabrics/${slug}`)}
              onRequestEnquiry={handleOpenEnquiry}
              onNavigate={navigateTo}
            />
          </>
        );

      case '/shop':
      case '/sarees':
      case '/saree':
      case '/dresses':
      case '/dress':
      case '/kurti-set':
      case '/kurti-sets':
        return (
          <>
            <SEOHead
              title="Wholesale Sarees Surat | Direct Mill Banarasi, Dola Silk & Organza | SRI FABRIC"
              description="Explore wholesale sarees from Surat's premier textile mill. Regal Banarasi katan, Dola silk, tissue organza & festive bridal sarees in bulk trade bundles."
              keywords="wholesale sarees Surat, Surat saree manufacturer, Banarasi sarees wholesale, Dola silk saree wholesale, organza saree supplier Surat, bridal saree wholesale Surat, B2B saree manufacturer Surat"
              canonicalPath="/sarees"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Wholesale Sarees Surat',
                description: 'Direct mill wholesale sarees from Surat looms including Banarasi katan, Dola silk, and organza sarees.',
                url: 'https://srifabrics.com/sarees',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Wholesale Sarees', item: 'https://srifabrics.com/sarees' },
                  ],
                },
              }}
            />
            <CatalogueView
              key={`sarees-${catQuery || 'all'}`}
              collectionType="saree"
              initialCategory={catQuery}
              initialSearch={searchQuery}
              initialFabricType={typeQuery}
              onViewFabric={(slug) => navigateTo(`/fabrics/${slug}`)}
              onRequestEnquiry={handleOpenEnquiry}
              onNavigate={navigateTo}
            />
          </>
        );

      case '/collections':
        return (
          <>
            <SEOHead
              title="Designer Textile Collections & Lookbooks | SRI FABRIC Surat"
              description="Explore curated fabric & saree collections from SRI FABRIC Surat. Royal Chinon, Pure Silk Heritage, Organza Radiance, and Luxe Georgette lookbooks."
              keywords="fabric collections Surat, luxury textile lookbook, pure silk collections, organza textile edit, designer saree lookbook, Surat mill collections"
              canonicalPath="/collections"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Curated Textile Collections',
                description: 'Curated fabric and saree capsules for couture ateliers and fashion houses.',
                url: 'https://srifabrics.com/collections',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Collections', item: 'https://srifabrics.com/collections' },
                  ],
                },
              }}
            />
            <CollectionsView
              onViewFabric={(slug) => navigateTo(`/fabrics/${slug}`)}
              onRequestEnquiry={handleOpenEnquiry}
            />
          </>
        );

      case '/about':
        return (
          <>
            <SEOHead
              title="About SRI FABRIC | Three Decades of Textile Manufacturing in Surat"
              description="Discover SRI FABRIC Surat: Three decades of textile heritage, direct mill weaving, sustainable AZO-free practices, and global B2B fabric export."
              keywords="textile mill Surat, SRI FABRIC history, fabric manufacturer Surat, B2B textile export India, Surat weaving looms, about SRI FABRIC"
              canonicalPath="/about"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'AboutPage',
                name: 'About SRI FABRIC',
                description: 'Three decades of textile heritage and rapier loom manufacturing in Surat, Gujarat.',
                url: 'https://srifabrics.com/about',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://srifabrics.com/about' },
                  ],
                },
              }}
            />
            <AboutView
              onNavigate={navigateTo}
              onRequestEnquiry={() => handleOpenEnquiry()}
            />
          </>
        );

      case '/manufacturing':
        return (
          <>
            <SEOHead
              title="Textile Manufacturing in Surat | High-Speed Looms & Digital Printing | SRI FABRIC"
              description="Advanced textile manufacturing and custom digital fabric printing in Surat, Gujarat. Rapier looms, electronic Jacquards, 500,000m monthly capacity."
              keywords="textile manufacturing Surat, rapier looms Surat, digital textile printing Surat, electronic Jacquard weaving, fabric production capacity Surat, textile dyeing mill"
              canonicalPath="/manufacturing"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'ItemPage',
                name: 'Textile Manufacturing Facility Surat',
                description: 'Advanced rapier loom weaving and digital printing facility in Surat, Gujarat.',
                url: 'https://srifabrics.com/manufacturing',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Manufacturing', item: 'https://srifabrics.com/manufacturing' },
                  ],
                },
              }}
            />
            <ManufacturingView
              onRequestEnquiry={() => handleOpenEnquiry()}
            />
          </>
        );

      case '/global-reach':
        return (
          <>
            <SEOHead
              title="Global Textile Export from Surat | International B2B Fabric Supply | SRI FABRIC"
              description="Exporting luxury Indian textiles and wholesale fabrics to 35+ countries worldwide. Certified quality documentation and seamless port-to-port freight."
              keywords="Indian fabric export, textile export Surat, wholesale saree exporter India, international fabric shipping, B2B textile supplier USA UK UAE"
              canonicalPath="/global-reach"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'ItemPage',
                name: 'Global Textile Export Network',
                description: 'International fabric export from Surat to 35+ countries worldwide.',
                url: 'https://srifabrics.com/global-reach',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Global Export', item: 'https://srifabrics.com/global-reach' },
                  ],
                },
              }}
            />
            <AboutView
              onNavigate={navigateTo}
              onRequestEnquiry={() => handleOpenEnquiry()}
            />
          </>
        );

      case '/blog':
        return (
          <>
            <SEOHead
              title="Textile Sourcing & Fabric Wholesale Blog | SRI FABRIC Surat"
              description="Expert B2B textile sourcing guides, Surat fabric wholesale market insights, digital printing advice, and apparel manufacturing tips from SRI FABRIC."
              keywords="textile blog India, fabric sourcing guide, Surat wholesale market tips, silk fabric care, B2B textile insights, textile trends India"
              canonicalPath="/blog"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'Blog',
                name: 'SRI FABRIC Textile Insights & Sourcing Guide',
                description: 'B2B fabric sourcing guides and industry news from Surat.',
                url: 'https://srifabrics.com/blog',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://srifabrics.com/blog' },
                  ],
                },
              }}
            />
            <BlogView onNavigate={navigateTo} />
          </>
        );

      case '/contact':
        return (
          <>
            <SEOHead
              title="Contact SRI FABRIC Surat | B2B Fabric Inquiry & Swatch Request"
              description="Connect with SRI FABRIC in Surat, Gujarat. Request fabric swatch folders, custom mill quotations, and schedule a factory visit. Call +91 9875198837."
              keywords="contact SRI FABRIC, Surat textile mill address, fabric sample request Surat, B2B fabric quotation, Surat wholesale office"
              canonicalPath="/contact"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: 'Contact SRI FABRIC',
                description: 'B2B inquiry desk, showroom appointments, and fabric swatch orders.',
                url: 'https://srifabrics.com/contact',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://srifabrics.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://srifabrics.com/contact' },
                  ],
                },
              }}
            />
            <ContactView />
          </>
        );

      case '/':
      default:
        return (
          <>
            <SEOHead
              title="SRI FABRIC – Fabric Wholesale Surat | B2B Textile Manufacturer"
              description="SRI FABRIC is Surat's leading B2B fabric wholesaler & textile manufacturer. Ready stock & made-to-order pure silks, wholesale sarees, chinon & digital prints."
              keywords="fabric wholesale Surat, wholesale sarees Surat, B2B textile manufacturer India, Surat textile market Ring Road, pure silk fabric wholesale, Banarasi katan silk manufacturer, Dola silk wholesale Surat, chinon fabric supplier, tissue organza wholesale"
              canonicalPath="/"
              jsonLd={{
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'SRI FABRIC Surat',
                url: 'https://srifabrics.com/',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://srifabrics.com/sarees?search={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              }}
            />
            <HomeView
              onNavigate={navigateTo}
              onRequestEnquiry={handleOpenEnquiry}
              onViewFabric={(slug) => navigateTo(`/fabrics/${slug}`)}
            />
          </>
        );
    }
  };

  const isAdminRoute = currentPath.startsWith('/arvexa') || currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#4a1122] selection:text-[#f7e6c4]">
      {/* Show Public Header only on non-admin routes */}
      {!isAdminRoute && (
        <Header
          currentPath={currentPath}
          onNavigate={navigateTo}
          onRequestEnquiry={handleOpenEnquiry}
        />
      )}

      {/* Main Page Area */}
      <main className="flex-1">{renderContent()}</main>

      {/* Show Public Footer only on non-admin routes */}
      {!isAdminRoute && <Footer onNavigate={navigateTo} />}

      {/* B2B Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultFabricName={enquiryFabricName}
      />
    </div>
  );
}
