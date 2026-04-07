import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import Collections from '../components/Collections';
import FeaturedProducts from '../components/FeaturedProducts';
import BrandStory from '../components/BrandStory';
import SocialProof from '../components/SocialProof';
import UGCGallery from '../components/UGCGallery';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Collections />
      <FeaturedProducts />
      <Ticker variant="coral" />
      <BrandStory />
      <SocialProof />
      <UGCGallery />
      <Newsletter />
    </>
  );
}
