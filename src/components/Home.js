import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Quiz App</h1>
      <p className="home-subtitle">Welcome to the ultimate quiz platform!</p>
      <div className="home-buttons">
        <Link to="/login"><button className="btn">Login</button></Link>
        <Link to="/register"><button className="btn">Register</button></Link>
      </div>
    </div>
  );
};

export default Home;
