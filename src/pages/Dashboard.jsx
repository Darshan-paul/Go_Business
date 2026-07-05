import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getReferrals } from "../services/referralService";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

const RECORDS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

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

const Dashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState({});
  const [referral, setReferral] = useState({ link: "", code: "" });
  const [referrals, setReferrals] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Debounce the search box so we don't call the API on every keystroke.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Fetch whenever search or sort changes.
  useEffect(() => {
    let isCancelled = false;

    const fetchDashboard = async () => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const data = await getReferrals(debouncedSearch, sortOrder);
        if (isCancelled) return;

        setMetrics(data.metrics || []);
        setServiceSummary(data.serviceSummary || {});
        setReferral(data.referral || { link: "", code: "" });
        setReferrals(data.referrals || []);
        setCurrentPage(1);
      } catch (error) {
        if (!isCancelled) setErrorMsg(error.message);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, sortOrder]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCopy = async (value, setCopiedState) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch {
      setCopiedState(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/referral/${id}`);
  };

  const totalEntries = referrals.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / RECORDS_PER_PAGE));

  const paginatedReferrals = useMemo(() => {
    const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
    return referrals.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [referrals, currentPage]);

  const rangeStart = totalEntries === 0 ? 0 : (currentPage - 1) * RECORDS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * RECORDS_PER_PAGE, totalEntries);

  const goToPage = (pageNumber) => {
    setCurrentPage(Math.min(Math.max(1, pageNumber), totalPages));
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-loading">Loading your referral dashboard...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-error" role="alert">
          {errorMsg}
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
        <Navbar />
      <h1 className="dashboard-title">Referral Dashboard</h1>
      <p className="dashboard-subtitle">
        Track your referrals, earnings, and partner activity in one place.
      </p>

      {/* Overview */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-heading">Overview</h2>
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div className="metric-card" key={metric.label}>
              <p className="metric-label">{metric.label}</p>
              <p className="metric-value">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service summary */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-heading">Service summary</h2>
        {!serviceSummary.service ? (
  <p className="dashboard-empty">No service activity yet.</p>
) : (
          <div className="table-scroll-wrapper">
            <table className="referral-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Your Referrals</th>
                  <th>Active Referrals</th>
                  <th>Total Ref. Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
  <td>{serviceSummary.service}</td>
  <td>{serviceSummary.yourReferrals}</td>
  <td>{serviceSummary.activeReferrals}</td>
  <td>{formatProfit(serviceSummary.totalRefEarnings)}</td>
</tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Refer friends */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-heading">Refer friends and earn more</h2>

        <div className="referral-link-block">
          <label className="referral-link-label">Your Referral Link</label>
          <div className="referral-link-row">
            <input
              type="text"
              className="referral-link-input"
              value={referral.link}
              readOnly
            />
            <button
              type="button"
              className="referral-copy-btn"
              onClick={() => handleCopy(referral.link, setCopiedLink)}
              disabled={!referral.link}
            >
              {copiedLink ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="referral-link-block">
          <label className="referral-link-label">Your Referral Code</label>
          <div className="referral-link-row">
            <input
              type="text"
              className="referral-link-input"
              value={referral.code}
              readOnly
            />
            <button
              type="button"
              className="referral-copy-btn"
              onClick={() => handleCopy(referral.code, setCopiedCode)}
              disabled={!referral.code}
            >
              {copiedCode ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </section>

      {/* All referrals */}
      <section className="dashboard-section">
        <div className="table-header-row">
          <h2 className="dashboard-section-heading">All referrals</h2>
          <div className="table-controls">
            <input
              type="text"
              className="referral-search-input"
              placeholder="Name or service…"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select
              className="referral-sort-select"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        {referrals.length === 0 ? (
          <p className="dashboard-empty">No referrals match your search.</p>
        ) : (
          <>
            <div className="table-scroll-wrapper">
              <table className="referral-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReferrals.map((row) => (
                    <tr
                      key={row.id}
                      className="clickable-row"
                      onClick={() => handleRowClick(row.id)}
                    >
                      <td>{row.name}</td>
                      <td>{row.serviceName}</td>
                      <td>{formatDate(row.date)}</td>
                      <td>{formatProfit(row.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <p className="pagination-footer">
              Showing {rangeStart}–{rangeEnd} of {totalEntries} entries
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;