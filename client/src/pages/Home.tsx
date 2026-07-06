import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problems from '../components/Problems';
import Features from '../components/Features';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import WhoIsThisFor from '../components/WhoIsThisFor';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      {/* Sticky header navbar */}
      <Navbar />
      
      {/* Page sections */}
      <main>
        <Hero />
        <Problems />
        <Features />
        <Stats />
        <HowItWorks />
        <WhoIsThisFor />
      </main>
      
      {/* Site Footer */}
      <Footer />
    </>
  );
}
