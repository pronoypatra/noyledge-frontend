import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Quiz App</h1>
      <p>Welcome to the ultimate quiz platform!</p>
      <div>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
      </div>
    </div>
  );
};

export default Home;
