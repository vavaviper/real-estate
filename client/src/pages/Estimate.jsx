import { useState } from 'react';

export default function Estimate() {
  const [formData, setFormData] = useState({
    area: '',
    bedrooms: '',
    bathrooms: '',
    stories: '',
    mainroad: 0,
    guestroom: 0,
    basement: 0,
    hotwaterheating: 0,
    airconditioning: 0,
    parking: '',
    prefarea: 0,
    furnishingstatus: 'unfurnished',
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEstimatedPrice(null);

    try {
      // Convert string values to numbers
      const payload = {
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        stories: parseInt(formData.stories),
        mainroad: parseInt(formData.mainroad),
        guestroom: parseInt(formData.guestroom),
        basement: parseInt(formData.basement),
        hotwaterheating: parseInt(formData.hotwaterheating),
        airconditioning: parseInt(formData.airconditioning),
        parking: parseInt(formData.parking),
        prefarea: parseInt(formData.prefarea),
        furnishingstatus: formData.furnishingstatus,
      };

      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to get estimate');
      }

      const data = await response.json();
      setEstimatedPrice(data.data.prediction);
    } catch (err) {
      setError(err.message || 'An error occurred while getting the estimate');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='max-w-4xl mx-auto p-3 my-7 bg-blue-50 rounded-2xl shadow-lg'>
      <h1 className='text-4xl font-bold text-slate-800 mb-8'>
        House Price Estimator
      </h1>
      <p className='text-slate-600 mb-8'>
        Enter your property details to get an estimated price for your house.
      </p>

      <div className='bg-white rounded-lg shadow-lg p-8'>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            {/* Area */}
            <div>
              <label className='block text-slate-700 font-semibold mb-2'>
                Area (sq ft) *
              </label>
              <input
                type='number'
                name='area'
                value={formData.area}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                placeholder='e.g., 7420'
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className='block text-slate-700 font-semibold mb-2'>
                Bedrooms *
              </label>
              <input
                type='number'
                name='bedrooms'
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                placeholder='e.g., 4'
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className='block text-slate-700 font-semibold mb-2'>
                Bathrooms *
              </label>
              <input
                type='number'
                name='bathrooms'
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                placeholder='e.g., 2'
              />
            </div>

            {/* Stories */}
            <div>
              <label className='block text-slate-700 font-semibold mb-2'>
                Stories *
              </label>
              <input
                type='number'
                name='stories'
                value={formData.stories}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                placeholder='e.g., 3'
              />
            </div>

            {/* Parking */}
            <div>
              <label className='block text-slate-700 font-semibold mb-2'>
                Parking Spaces *
              </label>
              <input
                type='number'
                name='parking'
                value={formData.parking}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
                placeholder='e.g., 2000000'
              />
            </div>

            {/* Furnishing Status */}
            <div>
              <label className='block text-slate-700 font-semibold mb-2'>
                Furnishing Status *
              </label>
              <select
                name='furnishing'
                value={formData.furnishing}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
              >
                <option value='unfurnished'>Unfurnished</option>
                <option value='semi-furnished'>Semi-Furnished</option>
                <option value='furnished'>Furnished</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className='bg-slate-50 p-6 rounded-lg mb-6'>
            <h3 className='text-slate-800 font-semibold mb-4'>Amenities</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  name='mainroad'
                  checked={formData.mainroad === 1}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600'
                />
                <span className='ml-2 text-slate-700'>Main Road Access</span>
              </label>

              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  name='guestroom'
                  checked={formData.guestroom === 1}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600'
                />
                <span className='ml-2 text-slate-700'>Guest Room</span>
              </label>

              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  name='basement'
                  checked={formData.basement === 1}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600'
                />
                <span className='ml-2 text-slate-700'>Basement</span>
              </label>

              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  name='hotwaterheating'
                  checked={formData.hotwaterheating === 1}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600'
                />
                <span className='ml-2 text-slate-700'>Hot Water Heating</span>
              </label>

              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  name='airconditioning'
                  checked={formData.airconditioning === 1}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600'
                />
                <span className='ml-2 text-slate-700'>Air Conditioning</span>
              </label>

              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  name='prefarea'
                  checked={formData.prefarea === 1}
                  onChange={handleChange}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600'
                />
                <span className='ml-2 text-slate-700'>Preferred Area</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50'
          >
            {loading ? 'Estimating...' : 'Get Estimate'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className='mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
            <p className='font-semibold'>Error: {error}</p>
          </div>
        )}

        {/* Estimated Price */}
        {estimatedPrice !== null && (
          <div className='mt-6 p-6 bg-blue-50 border border-blue-300 rounded-lg'>
            <h2 className='text-2xl font-bold text-slate-800 mb-2'>
              Estimated Price
            </h2>
            <p className='text-4xl font-bold text-blue-600'>
              {formatPrice(estimatedPrice)}
            </p>
            <p className='text-slate-600 mt-2 text-sm'>
              This is an estimate based on your property details. Actual market price may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
