import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
 const [originalUrl, setOriginalUrl] = useState('');
const [expiresAt, setExpiresAt] = useState('');
const [shortenedLink, setShortenedLink] = useState(null);
const [analytics, setAnalytics] = useState([]);
const [loading, setLoading] = useState(false);
const [copied, setCopied] = useState(false);
const totalLinks = analytics.length;

const totalClicks = analytics.reduce(
  (sum, item) => sum + (item.clicks || 0),
  0
);

const activeLinks = analytics.filter(
  (item) =>
    !item.expiresAt ||
    new Date(item.expiresAt).getTime() > Date.now()
).length;

const expiredLinks = totalLinks - activeLinks;


  const BACKEND_URL = 'https://link-vault-api.onrender.com';

  // Fetch Link Analytics from Server
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Handle Short Link Creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setShortenedLink(null);
    setCopied(false);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/shorten`, {
        originalUrl,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
      });

      const fullShortUrl = `${BACKEND_URL}/${response.data.shortCode}`;
      setShortenedLink(fullShortUrl);
      setOriginalUrl('');
      setExpiresAt('');
      fetchAnalytics();
    } catch (error) {
      alert('Error creating short link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🔗 Link Vault</h1>
        <p>URL Shortener & Real-Time Analytics</p>
      </header>

      {/* Shorten Link Form */}
      <div style={styles.card}>
        <h2>Shorten a Long URL</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="url"
            placeholder="Paste your long URL here (e.g., https://google.com)..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            style={styles.input}
          />
          <div style={styles.expiryGroup}>
            <label style={styles.label}>Optional Expiry Date & Time:</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              style={styles.dateInput}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Shortening...' : 'Generate Short Link'}
          </button>
        </form>

        {/* Short Link Output Box */}
        {shortenedLink && (
          <div style={styles.resultBox}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Your Short Link:</p>
            <div style={styles.resultFlex}>
              <a href={shortenedLink} target="_blank" rel="noreferrer" style={styles.shortLink}>
                {shortenedLink}
              </a>
              <button onClick={copyToClipboard} style={styles.copyBtn}>
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </div>
        
{/* Analytics Summary */}
<div style={styles.statsGrid}>
  <div style={styles.statCard}>
    <h3>Total Links</h3>
    <p>{totalLinks}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Total Clicks</h3>
    <p>{totalClicks}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Active Links</h3>
    <p>{activeLinks}</p>
  </div>

  <div style={styles.statCard}>
    <h3>Expired Links</h3>
    <p>{expiredLinks}</p>
  </div>
</div>

      {/* Analytics Section */}
      <div style={styles.card}>
        <h2>Link Analytics</h2>
        {analytics.length === 0 ? (
          <p style={{ color: '#666' }}>No short links generated yet. Create one above!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Short Code</th>
                  <th style={styles.th}>Original Destination</th>
                  <th style={styles.th}>Clicks</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((item) => {
                  const isExpired = item.expiresAt && new Date() > new Date(item.expiresAt);
                  return (
                    <tr key={item._id}>
                      <td style={styles.td}>
                        <a href={`${BACKEND_URL}/${item.shortCode}`} target="_blank" rel="noreferrer">
                          {item.shortCode}
                        </a>
                      </td>
                      <td style={{ ...styles.td, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.originalUrl}
                      </td>
                      <td style={styles.td}><strong>{item.clicks}</strong></td>
                      <td style={styles.td}>
                        <span style={isExpired ? styles.badgeExpired : styles.badgeActive}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '30px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  
statsGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
  marginBottom: '24px'
},
statCard: {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
},

  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { padding: '12px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' },
  expiryGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', color: '#555' },
  dateInput: { padding: '10px 14px', fontSize: '14px', borderRadius: '8px', border: '1px solid #ccc' },
  button: { padding: '14px', fontSize: '16px', fontWeight: 'bold', color: '#fff', backgroundColor: '#2563eb', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  resultBox: { marginTop: '20px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' },
  resultFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  shortLink: { fontSize: '16px', color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' },
  copyBtn: { padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '12px' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e5e7eb', color: '#374151' },
  td: { padding: '12px', borderBottom: '1px solid #f3f4f6' },
  badgeActive: { padding: '4px 8px', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: 'bold' },
  badgeExpired: { padding: '4px 8px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '12px', fontWeight: 'bold' }
};

export default App;