// frontend/src/pages/AAHDCAdminPage.js
import React, { useState, useEffect } from 'react';
import { getUnits } from '../services/unitService';
import { runAllocation } from '../services/allocationService';
import { downloadExcelReport, downloadPdfReport } from '../services/reportService';

function AAHDCAdminPage() {
  const [units, setUnits] = useState([]);
  const [allocatedUnits, setAllocatedUnits] = useState([]);
  const [unallocatedUnits, setUnallocatedUnits] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const allUnits = await getUnits();
      setUnits(allUnits);
      setAllocatedUnits(allUnits.filter(u => u.allocated));
      setUnallocatedUnits(allUnits.filter(u => !u.allocated));
    } catch (err) {
      setError(err.message || 'Failed to fetch units.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleRunAllocation = async () => {
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await runAllocation(selectedMethod);
      setMessage(response.message);
      if (response.complianceIssues && response.complianceIssues.length > 0) {
          setError('Compliance issues detected after allocation: ' + response.complianceIssues.join(', '));
      }
      fetchUnits(); // Refresh unit data
    } catch (err) {
      setError(err.message || 'Failed to run allocation.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await downloadExcelReport();
      setMessage('Excel report downloaded successfully.');
    } catch (err) {
      setError(err.message || 'Failed to download Excel report.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await downloadPdfReport();
      setMessage('PDF report downloaded successfully.');
    } catch (err) {
      setError(err.message || 'Failed to download PDF report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-card">
      <h2>AAHDC Admin Portal</h2>
      {loading && <p>Loading...</p>}
      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}

      <section style={{ marginBottom: '30px' }}>
        <h3>Unallocated Units ({unallocatedUnits.length})</h3>
        {unallocatedUnits.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Unit ID</th>
                <th>Typology</th>
                <th>Gross Area</th>
                <th>Floor</th>
                <th>Block</th>
              </tr>
            </thead>
            <tbody>
              {unallocatedUnits.map((unit) => (
                <tr key={unit.unitId}>
                  <td>{unit.unitId}</td>
                  <td>{unit.typology}</td>
                  <td>{unit.grossArea.toFixed(2)}</td>
                  <td>{unit.floorNumber}</td>
                  <td>{unit.blockName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No unallocated units to display. Please submit units via the Developer Portal.</p>
        )}
      </section>

      <section style={{ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h3>Run Allocation</h3>
        <label style={{ display: 'block', marginBottom: '15px', textAlign: 'left' }}>
          Select Distribution Method:
          <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }}>
            <option value="">-- Select Method --</option>
            <option value="Full Lottery">Full Lottery (Houses + Shops)</option>
            <option value="Hybrid Lottery">Hybrid Lottery (Houses) + Negotiation (Shops)</option>
            <option value="Block-by-Block Assignment">Block-by-Block Assignment</option>
            <option value="Lottery Based on Floor Number">Lottery Based on Floor Number</option>
          </select>
        </label>
        <button onClick={handleRunAllocation} disabled={!selectedMethod || loading || unallocatedUnits.length === 0}>
          Run Allocation
        </button>
      </section>

      <section style={{ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h3>Allocated Units ({allocatedUnits.length})</h3>
        {allocatedUnits.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Unit ID</th>
                <th>Typology</th>
                <th>Gross Area</th>
                <th>Floor</th>
                <th>Block</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {allocatedUnits.map((unit) => (
                <tr key={unit.unitId}>
                  <td>{unit.unitId}</td>
                  <td>{unit.typology}</td>
                  <td>{unit.grossArea.toFixed(2)}</td>
                  <td>{unit.floorNumber}</td>
                  <td>{unit.blockName}</td>
                  <td style={{ fontWeight: 'bold', color: unit.owner === 'AAHDC' ? '#27ae60' : '#2980b9' }}>{unit.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No units have been allocated yet. Run an allocation method above.</p>
        )}
      </section>

      <section style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h3>Reports</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={handleDownloadExcel} disabled={loading || allocatedUnits.length === 0} style={{ backgroundColor: '#28a745' }}>
            Download Excel Report
          </button>
          <button onClick={handleDownloadPdf} disabled={loading || allocatedUnits.length === 0} style={{ backgroundColor: '#6c757d' }}>
            Download PDF Report
          </button>
        </div>
      </section>
    </div>
  );
}

export default AAHDCAdminPage;
