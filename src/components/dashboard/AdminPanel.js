import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api"; // Import the API utility

function AdminPanel() {
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      // console.log("Fetching quizzes...");

      // Fetch quizzes with populated `createdBy` field
      const response = await api.get("/quizzes");

      // Log the response to ensure it's populated correctly
      // console.log("Response from server:", response.data);

      // Get the userId from localStorage
      const userId = localStorage.getItem("userId");
      // console.log("User ID from localStorage:", userId); // Log to check if it's present

      // Ensure we handle ObjectId comparison properly by converting both sides to strings
      const createdByMe = response.data.filter(q => {
        const createdByIdString = q.createdBy._id.toString(); // Convert createdBy._id to string
        // console.log("Comparing quiz createdBy._id:", createdByIdString);
        // console.log("With userId:", userId);

        // Filter quizzes where the createdBy._id matches userId
        return createdByIdString === userId;
      });

      // console.log("Filtered Quizzes (created by me):", createdByMe);

      setFilteredQuizzes(createdByMe);
    } catch (error) {
      setError(error);
      // console.error("Error fetching quizzes:", error.response || error);
    }
  };

  if (error) {
    return <p>Error fetching quizzes.</p>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <Link to="/admin/quiz/create" className="btn">+ Create New Quiz</Link>

      <h3>Your Quizzes</h3>
      {filteredQuizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        <ul>
          {filteredQuizzes.map((quiz) => {
            // Log each quiz's properties to the console
            // console.log("Rendering quiz:", quiz); // Logs the whole quiz object
            // console.log("Title:", quiz.title); // Logs the quiz title
            // console.log("Description:", quiz.description); // Logs the quiz description
            // console.log("Created By:", quiz.createdBy); // Logs the createdBy object

            return (
              <li key={quiz._id}>
                <strong>{quiz.title}</strong> - {quiz.description}
                <div>
                  <Link to={`/admin/quiz/${quiz._id}/questions`} className="btn-small">
                    Add Questions
                  </Link>
                  <Link to={`/admin/quiz/${quiz._id}/results`} className="btn-small">
                    View Results
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AdminPanel;




// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../utils/api"; // Import the API utility

// function AdminPanel() {
//   const [quizzes, setQuizzes] = useState([]);

//   useEffect(() => {
//     fetchQuizzes();
//   }, []);

//   const fetchQuizzes = async () => {
//     try {
//       const response = await api.get("/quizzes");
//       setQuizzes(response.data);
//     } catch (error) {
//       console.error("Error fetching quizzes:", error.response || error);
//       alert(`Error: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };


//   return (
//     <div className="admin-panel">
//       <h2>Admin Dashboard</h2>
//       <Link to="/admin/quiz/create" className="btn">+ Create New Quiz</Link>

//       <h3>Your Quizzes</h3>
//       {quizzes.length === 0 ? (
//         <p>No quizzes created yet.</p>
//       ) : (
//         <ul>
//           {quizzes.map((quiz) => (
//             <li key={quiz._id}>
//               <strong>{quiz.title}</strong> - {quiz.description}
//               <div>
//                 <Link to={`/admin/quiz/${quiz._id}/questions`} className="btn-small">
//                   Add Questions
//                 </Link>
//                 <Link to={`/admin/quiz/${quiz._id}/results`} className="btn-small">
//                   View Results
//                 </Link>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default AdminPanel;
