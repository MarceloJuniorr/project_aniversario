import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import Hero from './sections/Hero';
import Countdown from './sections/Countdown';
import About from './sections/About';
import EventDetails from './sections/EventDetails';
import RSVP from './sections/RSVP';
import GiftPix from './sections/GiftPix';
import Footer from './sections/Footer';
import Admin from './pages/Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if we're on the admin path or if there's a redirect flag
    const path = window.location.pathname;
    const adminRedirect = sessionStorage.getItem('admin_redirect');
    
    if (path === '/admin' || path.startsWith('/admin/') || adminRedirect === 'true') {
      setIsAdmin(true);
      // Clear the redirect flag
      if (adminRedirect) {
        sessionStorage.removeItem('admin_redirect');
      }
    }
  }, []);

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        <Toaster 
          position="top-center" 
          richColors 
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
        <Admin />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
      <main>
        <Hero />
        <Countdown />
        <About />
        <EventDetails />
        <RSVP />
        <GiftPix />
      </main>
      <Footer />
    </div>
  );
}

export default App;
