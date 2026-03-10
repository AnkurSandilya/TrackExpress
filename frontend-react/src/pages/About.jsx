import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <style>{`
        .about-page {
          min-height: calc(100vh - 76px);
          padding: 40px 20px;
        }

        .about-container {
          max-width: 1000px;
          margin: 0 auto;
          background: #ffffff;
          padding: 36px;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .about-title {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #111;
        }

        .about-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 34px;
          line-height: 1.6;
        }

        .about-section {
          margin-bottom: 30px;
        }

        .about-section h3 {
          font-size: 22px;
          margin-bottom: 12px;
          color: #111;
        }

        .about-section p {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.8;
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 10px;
        }

        .about-card {
          background: #f9fafb;
          border-left: 5px solid #ff3b3b;
          padding: 20px;
          border-radius: 14px;
        }

        .about-card h4 {
          font-size: 18px;
          margin-bottom: 10px;
          color: #111;
        }

        .about-card p {
          font-size: 14px;
          color: #555;
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .about-page {
            padding: 24px 14px;
          }

          .about-container {
            padding: 24px 18px;
          }

          .about-title {
            font-size: 28px;
          }

          .about-subtitle {
            font-size: 15px;
          }

          .about-section h3 {
            font-size: 20px;
          }
        }
      `}</style>

      <Navbar />

      <div className="about-page">
        <div className="about-container">
          <h2 className="about-title">About TrackExpress</h2>
          <p className="about-subtitle">
            TrackExpress is a smart parcel tracking and booking platform designed
            to simplify courier operations for users. From shipment creation to
            live delivery updates, the system helps users stay informed at every stage.
          </p>

          <div className="about-section">
            <h3>Who We Are</h3>
            <p>
              TrackExpress is built as a modern courier management solution that
              combines parcel booking, shipment tracking, price estimation, and
              delivery support in one platform. The goal is to provide a seamless
              experience for customers who want speed, transparency, and reliability
              while sending parcels from one city to another.
            </p>
          </div>

          <div className="about-section">
            <h3>What We Offer</h3>
            <div className="about-grid">
              <div className="about-card">
                <h4>Real-Time Tracking</h4>
                <p>
                  Users can enter their tracking ID and instantly check parcel
                  status, current shipment stage, and delivery progress.
                </p>
              </div>

              <div className="about-card">
                <h4>Easy Booking</h4>
                <p>
                  Customers can create a new shipment by entering sender and
                  receiver details, route information, and package weight.
                </p>
              </div>

              <div className="about-card">
                <h4>Delivery Support</h4>
                <p>
                  An integrated support assistant helps users understand common
                  delivery issues such as delays, address changes, and status updates.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              Our mission is to make courier tracking systems more user-friendly,
              informative, and efficient. We aim to reduce uncertainty during the
              delivery process by giving customers direct access to booking tools,
              shipment estimates, and support in one place.
            </p>
          </div>

          <div className="about-section">
            <h3>Why TrackExpress</h3>
            <p>
              Unlike traditional courier systems where users depend on delayed updates
              or manual customer support, TrackExpress is designed to provide instant
              visibility and a smooth digital experience. It focuses on clean UI,
              practical features, and fast interaction between frontend and backend.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;