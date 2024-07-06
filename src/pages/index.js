import Meta from '@/components/Meta/index';
import { LandingLayout } from '@/layouts/index';
import {
  CallToAction,
  Features,
  Footer,
  Guides,
  Hero,
  Pricing,
  Testimonial,
} from '@/sections/index';

const Home = () => {
  return (
    <LandingLayout>
      <Meta
        title="Intrvyu - AI-Powered Recruitment Agents"
        description="Discover Intrvyu, the ultimate solution for modern recruitment. Our AI-powered agents streamline the hiring process by conducting efficient and accurate candidate screenings. Enhance your recruitment strategy with Intrvyu's advanced technology, ensuring you find the perfect fit for your organization quickly and effectively. Join the future of hiring with Intrvyu's intelligent and adaptive recruitment agents."
      />
      <Hero />
      <Features />
      <Pricing />
      <Guides />
      <Testimonial />
      <CallToAction />
      <Footer />
    </LandingLayout>
  );
};

export default Home;
