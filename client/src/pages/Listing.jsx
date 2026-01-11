import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // Estimate UI state
  const [estimateOpen, setEstimateOpen] = useState(false);
  const [estimateInput, setEstimateInput] = useState({
    area: 6000,
    stories: 2,
    furnishingstatus: 'unfurnished',
    mainroad: 0,
    guestroom: 0,
    basement: 0,
    hotwaterheating: 0,
    airconditioning: 0,
    parking: 0,
    prefarea: 0,
  });
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState(null);
  const [estimateError, setEstimateError] = useState(null);

  // Prefill estimate inputs when listing is loaded
  useEffect(() => {
    if (!listing) return;
    setEstimateInput((prev) => ({
      ...prev,
      area: listing.area || prev.area,
      stories: listing.stories || prev.stories,
      furnishingstatus: listing.furnished ? 'furnished' : prev.furnishingstatus,
      airconditioning: listing.airconditioning ? 1 : prev.airconditioning || 0,
      parking: listing.parking ? 1 : 0,
      bedrooms: listing.bedrooms || 3,
      bathrooms: listing.bathrooms || 1,
    }));
  }, [listing]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const getEstimate = async () => {
    try {
      setEstimateError(null);
      setEstimateLoading(true);
      setEstimateResult(null);

      const payload = {
        area: Number(estimateInput.area),
        bedrooms: Number(listing.bedrooms || estimateInput.bedrooms || 3),
        bathrooms: Number(listing.bathrooms || estimateInput.bathrooms || 1),
        stories: Number(estimateInput.stories),
        mainroad: Number(estimateInput.mainroad),
        guestroom: Number(estimateInput.guestroom),
        basement: Number(estimateInput.basement),
        hotwaterheating: Number(estimateInput.hotwaterheating),
        airconditioning: Number(estimateInput.airconditioning || 0),
        parking: Number(estimateInput.parking || (listing.parking ? 1 : 0)),
        prefarea: Number(estimateInput.prefarea),
        furnishingstatus: estimateInput.furnishingstatus,
      };

      let res, json;
      try {
        res = await fetch('/api/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        json = await res.json();
        if (!res.ok || json.success === false) throw new Error('Node proxy error');
        setEstimateResult(json.data.predicted_price);
        setEstimateLoading(false);
        return;
      } catch (err) {
        // Fallback: call ML service directly
        try {
          const mlRes = await fetch('http://127.0.0.1:8001/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const mlJson = await mlRes.json();
          if (!mlRes.ok) throw new Error('ML service error');
          setEstimateResult(mlJson.predicted_price);
          setEstimateLoading(false);
          return;
        } catch (err2) {
          setEstimateError(err2.message || 'Prediction failed');
          setEstimateLoading(false);
          return;
        }
      }
    } catch (err) {
      setEstimateError(err.message);
      setEstimateLoading(false);
    }
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {(listing.imageUrls && listing.imageUrls.length > 0) ? (
              listing.imageUrls.map((url, idx) => (
                <SwiperSlide key={url || idx}>
                  <div
                    className='h-[550px] bg-gray-100'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide key='placeholder'>
                <div className='image-placeholder'>
                  No images available
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}

            {/* Price estimate */}
            <div className='mt-4'>
              {!estimateOpen && (
                <button
                  onClick={() => setEstimateOpen(true)}
                  className='btn-primary'
                >
                  Estimate price
                </button>
              )}

              {estimateOpen && (
                <div className='p-4 mt-3 border rounded-lg bg-white max-w-md'>
                  <div className='flex flex-col gap-3'>
                    <label className='font-semibold'>Area (sq ft)</label>
                    <input
                      type='number'
                      className='p-2 border rounded'
                      value={estimateInput.area}
                      onChange={(e) => setEstimateInput({ ...estimateInput, area: +e.target.value })}
                    />

                    <label className='font-semibold'>Stories</label>
                    <input
                      type='number'
                      className='p-2 border rounded'
                      value={estimateInput.stories}
                      onChange={(e) => setEstimateInput({ ...estimateInput, stories: +e.target.value })}
                    />

                    <label className='font-semibold'>Furnishing status</label>
                    <select
                      className='p-2 border rounded'
                      value={estimateInput.furnishingstatus}
                      onChange={(e) => setEstimateInput({ ...estimateInput, furnishingstatus: e.target.value })}
                    >
                      <option value='furnished'>furnished</option>
                      <option value='semi-furnished'>semi-furnished</option>
                      <option value='unfurnished'>unfurnished</option>
                    </select>

                    <div className='flex gap-2'>
                      <button
                        onClick={getEstimate}
                        disabled={estimateLoading}
                        className='btn-primary'
                      >
                        {estimateLoading ? 'Estimating...' : 'Get estimate'}
                      </button>
                      <button
                        onClick={() => setEstimateOpen(false)}
                        className='p-2 border rounded'
                      >
                        Close
                      </button>
                    </div>

                    {estimateError && <p className='text-red-500'>{estimateError}</p>}
                    {estimateResult && (
                      <p className='mt-2 font-semibold'>Estimated price: ${estimateResult.toLocaleString('en-US')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}