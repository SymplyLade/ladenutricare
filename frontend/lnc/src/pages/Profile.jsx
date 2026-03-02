// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';
// import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, IdentificationIcon } from '@heroicons/react/24/outline';

// const Profile = () => {
//   const { user, setUser } = useAuth();
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     phone: user?.phone || '',
//     age: user?.age || '',
//     gender: user?.gender || '',
//     blood_group: user?.blood_group || '',
//     address: user?.address || '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });
//     try {
//       const response = await api.put('/users/profile', formData);
//       setUser(response.data);
//       setMessage({ type: 'success', text: 'Profile updated successfully!' });
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Failed to update profile' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

//       {message.text && (
//         <div className={`mb-4 px-4 py-3 rounded ${
//           message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//         }`}>
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Full Name
//             </label>
//             <div className="relative mt-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <UserIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <div className="relative mt-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 disabled
//                 value={user?.email || ''}
//                 className="block w-full pl-10 bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-gray-500"
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
//           </div>

//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//               Phone
//             </label>
//             <div className="relative mt-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <PhoneIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="tel"
//                 name="phone"
//                 id="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="age" className="block text-sm font-medium text-gray-700">
//               Age
//             </label>
//             <div className="relative mt-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <CalendarIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="number"
//                 name="age"
//                 id="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
//               Gender
//             </label>
//             <select
//               name="gender"
//               id="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700">
//               Blood Group
//             </label>
//             <div className="relative mt-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <IdentificationIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="blood_group"
//                 id="blood_group"
//                 value={formData.blood_group}
//                 onChange={handleChange}
//                 className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="e.g., A+"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//               Address
//             </label>
//             <textarea
//               name="address"
//               id="address"
//               rows={3}
//               value={formData.address}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 text-white py-2 px-6 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Profile;





import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, IdentificationIcon, CameraIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    blood_group: user?.blood_group || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previewUrl, setPreviewUrl] = useState(user?.profile_picture || '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append('profile_picture', file);

    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.post('/users/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data); // assuming backend returns updated user
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload picture' });
      // Revert preview
      setPreviewUrl(user?.profile_picture || '');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <CameraIcon className="h-5 w-5 mr-2 text-gray-400" />
              Change Photo
            </button>
            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                disabled
                value={user?.email || ''}
                className="block w-full pl-10 bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-gray-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="blood_group" className="block text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdentificationIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="blood_group"
                id="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., A+"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;