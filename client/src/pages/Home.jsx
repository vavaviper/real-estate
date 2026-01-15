import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className='min-h-screen bg-blue-50'>
      {/* Hero Section */}
      <div className='bg-blue-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='space-y-6'>
              <h1 className='text-slate-900 font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight'>
                Find your {' '}
                <span className='text-blue-600 font-italic'>perfect</span>
                <br />
                place with ease
              </h1>
              <p className='text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl'>
                Varsha Estate connects buyers, sellers, and renters with the best real estate opportunities across the country. Whether you're looking for a cozy apartment, a sprawling estate, or a commercial property, we have it all!
              </p>
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Link
                  to='/search'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition text-center shadow-lg'
                >
                  Browse Listings
                </Link>
                <Link
                  to='/estimate'
                  className='bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-lg font-semibold transition text-center shadow-md border-2 border-blue-200'
                >
                  Estimate Price
                </Link>
              </div>
            </div>
            
            {/* Right Image */}
            <div className='relative'>
              <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                <img
                  src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
                  alt='Beautiful modern home'
                  className='w-full h-auto object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-900 mb-3'>
              Why Choose Varsha Estate?
            </h2>
            <p className='text-slate-600 text-lg'>
              Making your property search simple and effective
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-blue-50 p-8 rounded-xl'>
              <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>Wide Selection</h3>
              <p className='text-slate-600'>Browse thousands of verified properties across the country</p>
            </div>
            <div className='bg-blue-50 p-8 rounded-xl'>
              <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>AI Price Estimator</h3>
              <p className='text-slate-600'>Get instant property valuations powered by machine learning</p>
            </div>
            <div className='bg-blue-50 p-8 rounded-xl'>
              <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>Secure & Trusted</h3>
              <p className='text-slate-600'>Safe transactions with verified sellers and comprehensive support</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className='bg-blue-50 py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-slate-900 mb-6'>About Varsha Estate</h2>
          <div className='space-y-4 text-slate-700 text-lg leading-relaxed'>
            <p>At Varsha Estate, we're passionate about helping you find the perfect place to call home. Founded on the principles of innovation, integrity, and customer satisfaction, our platform is designed to simplify the real estate process for buyers, sellers, and renters alike.</p>
            <p>Our mission is to make real estate accessible, transparent, and stress-free for everyone. We believe that finding a home should be an exciting journey, not a daunting task. That's why we've created a platform that puts the power of real estate in your hands, offering the tools and resources you need to make informed decisions.</p>
            <p>At Varsha Estate, we're more than just a real estate website. We're a partner in your journey to finding a place you can truly call home. Our dedicated team works tirelessly to provide you with the best possible experience, from browsing to closing.</p>
            <p>Thank you for choosing Varsha Estate. We're excited to help you find your dream home!</p>
          </div>
        </div>
      </div>
    </div>
  );
}