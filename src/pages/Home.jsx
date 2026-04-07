import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import Manifesto from '../components/Manifesto';
import Collections from '../components/Collections';
import HorizontalProducts from '../components/HorizontalProducts';
import FeatureStrip from '../components/FeatureStrip';
import BrandStory from '../components/BrandStory';
import Ticker2 from '../components/Ticker';
import SocialProof from '../components/SocialProof';
import UGCGallery from '../components/UGCGallery';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Collections />
      <Manifesto />
      <HorizontalProducts />
      <FeatureStrip />
      <BrandStory />
      <Ticker variant="coral" />
      <SocialProof />
      <UGCGallery />
      <Newsletter />
    </>
  );
}
