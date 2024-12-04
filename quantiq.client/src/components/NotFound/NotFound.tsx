import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
        <button className="not-found-btn" onClick={() => window.location.href = '/'}>Go Back to Home</button>
      </div>
    </div>
  );
};

export default NotFound;
