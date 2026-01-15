import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='min-h-screen bg-blue-50 py-12'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='bg-white rounded-2xl shadow-lg p-8'>
          <h1 className='text-4xl font-bold text-slate-900 mb-8'>Profile</h1>
          
          <form onSubmit={handleSubmit} className='space-y-6'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            
            {/* Profile Picture Section */}
            <div className='flex flex-col items-center mb-8'>
              <div className='relative'>
                <img
                  onClick={() => fileRef.current.click()}
                  src={formData.avatar || currentUser.avatar}
                  alt='profile'
                  className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-blue-200 hover:border-blue-400 transition shadow-lg'
                />
                <div className='absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition' onClick={() => fileRef.current.click()}>
                  <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                </div>
              </div>
              <p className='text-sm mt-4 text-center'>
                {fileUploadError ? (
                  <span className='text-red-600 font-medium'>
                    Error: Image must be less than 2 MB
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className='text-slate-600'>{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className='text-green-600 font-medium'>Image uploaded successfully!</span>
                ) : (
                  <span className='text-slate-500'>Click to change profile picture</span>
                )}
              </p>
            </div>

            {/* Form Fields */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Username</label>
                <input
                  type='text'
                  placeholder='username'
                  defaultValue={currentUser.username}
                  id='username'
                  className='w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Email</label>
                <input
                  type='email'
                  placeholder='email'
                  id='email'
                  defaultValue={currentUser.email}
                  className='w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Password</label>
                <input
                  type='password'
                  placeholder='New password (leave blank to keep current)'
                  onChange={handleChange}
                  id='password'
                  className='w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3 pt-4'>
              <button
                disabled={loading}
                className='w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 disabled:opacity-60 transition shadow-md'
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              <Link
                className='block w-full bg-slate-700 text-white p-3 rounded-lg text-center font-semibold hover:bg-slate-800 transition shadow-md'
                to={'/create-listing'}
              >
                Create Listing
              </Link>
            </div>
          </form>

          {/* Status Messages */}
          {error && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700 text-sm'>{error}</p>
            </div>
          )}
          {updateSuccess && (
            <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
              <p className='text-green-700 text-sm font-medium'>Profile updated successfully!</p>
            </div>
          )}

          {/* Account Actions */}
          <div className='flex justify-between mt-6 pt-6 border-t border-slate-200'>
            <button
              onClick={handleDeleteUser}
              className='text-red-600 hover:text-red-700 font-medium text-sm'
            >
              Delete Account
            </button>
            <button 
              onClick={handleSignOut} 
              className='text-slate-600 hover:text-slate-700 font-medium text-sm'
            >
              Sign Out
            </button>
          </div>

          {/* Show Listings Button */}
          <button 
            onClick={handleShowListings} 
            className='w-full mt-6 text-blue-600 hover:text-blue-700 font-semibold py-2'
          >
            {userListings.length > 0 ? 'Show My Listings' : 'View My Listings'}
          </button>
          
          {showListingsError && (
            <p className='text-red-600 text-sm text-center mt-2'>Error loading listings</p>
          )}
        </div>

        {/* Listings Section */}
        {userListings && userListings.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-2xl font-bold text-slate-900 mb-6'>Your Listings</h2>
            <div className='space-y-4'>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center gap-4 hover:shadow-md transition'
                >
                  <Link to={`/listing/${listing._id}`} className='flex items-center gap-4 flex-1'>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-20 w-20 object-cover rounded-lg'
                    />
                    <p className='text-slate-800 font-semibold hover:text-blue-600 transition truncate'>{listing.name}</p>
                  </Link>

                  <div className='flex gap-2'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition'>
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className='px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}