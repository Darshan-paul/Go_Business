import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReferralById } from "../services/referralService";
import "./ReferralDetails.css";
import Navbar from "../components/Navbar";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "--";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const formatProfit = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "--";
  return currencyFormatter.format(amount);
};

const ReferralDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [referral, setReferral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const fetchReferral = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
  const data = await getReferralById(id);

  console.log(JSON.stringify(data, null, 2));

  if (!isCancelled) setReferral(data);
}catch (error) {
        if (!isCancelled) setErrorMsg(error.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchReferral();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleBackClick = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="referral-details-page">
        <p className="referral-details-loading">Loading referral details...</p>
      </div>
    );
  }

  if (errorMsg || !referral) {
    return (
      <div className="referral-details-page">
        <p className="referral-details-error" role="alert">
          Referral not found
        </p>
        <button
          type="button"
          className="back-to-dashboard-btn"
          onClick={handleBackClick}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="referral-details-page">
        <Navbar />
      <h1 className="referral-details-title">Referral Details</h1>

      <div className="referral-details-card">
        <h2 className="referral-partner-name">{referral.name}</h2>

        <div className="referral-detail-row">
          <span className="referral-detail-label">Referral ID</span>
          <span className="referral-detail-value">{referral.id}</span>
        </div>

        <div className="referral-detail-row">
          <span className="referral-detail-label">Service Name</span>
          <span className="referral-detail-value">{referral.serviceName}</span>
        </div>

        <div className="referral-detail-row">
          <span className="referral-detail-label">Date</span>
          <span className="referral-detail-value">{formatDate(referral.date)}</span>
        </div>

        <div className="referral-detail-row">
          <span className="referral-detail-label">Profit</span>
          <span className="referral-detail-value">{formatProfit(referral.profit)}</span>
        </div>
      </div>

      <button
        type="button"
        className="back-to-dashboard-btn"
        onClick={handleBackClick}
      >
        Back to dashboard
      </button>
    </div>
  );
};

export default ReferralDetails;