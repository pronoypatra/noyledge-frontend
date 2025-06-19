import React, { useState } from 'react';
import api from '../../utils/api'; // Importing the configured API utility

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting quiz...');
    console.log('Title:', title);
    console.log('Description:', description);

    try {
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage

      if (!token) {
        console.warn('No token found in localStorage!');
        setMessage('❌ You must be logged in to create a quiz.');
        return;
      }

      console.log('Using token:', token);

      // Making the POST request to create the quiz
      const res = await api.post(
        '/quizzes', // This should be relative to the backend base URL set in api.js
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token as Authorization header
          },
        }
      );

      console.log('Server response:', res);

      if (res.status === 201 || res.status === 200) {
        setMessage('✅ Quiz created successfully!');
        setTitle(''); // Clear the input fields after successful creation
        setDescription('');
      } else {
        console.error('Unexpected response status:', res.status);
        setMessage('❌ Failed to create quiz.');
      }
    } catch (error) {
      console.error('❌ Error occurred during quiz creation:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        setMessage(`❌ Error ${error.response.status}: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        console.error('No response received from server.');
        console.error(error.request);
        setMessage('❌ No response from server.');
      } else {
        console.error('Error setting up the request:', error.message);
        setMessage('❌ Error setting up the request.');
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a New Quiz</h2>
      {message && <div className="mb-4 text-blue-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;

// import React, { useState } from 'react';
// import axios from 'axios';

// const CreateQuiz = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/quizzes', {
//         title,
//         description,
//       });

//       if (res.status === 201 || res.status === 200) {
//         setMessage('✅ Quiz created successfully!');
//         setTitle('');
//         setDescription('');
//       } else {
//         setMessage('❌ Failed to create quiz.');
//       }
//     } catch (error) {
//       console.error(error);
//     //   console.log(error);
//       setMessage('❌ Server error while creating quiz.');
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Create a New Quiz</h2>
//       {message && <div className="mb-4 text-blue-700">{message}</div>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Quiz Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border p-2"
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border p-2"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Create Quiz
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateQuiz;
