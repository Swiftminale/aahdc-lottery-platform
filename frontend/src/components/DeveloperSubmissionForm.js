// frontend/src/components/DeveloperSubmissionForm.js
import React, { useState } from 'react';
import { submitUnits } from '../services/unitService';

const unitTypologies = ['Studio', '1BR', '2BR', '3BR', 'Shop'];

function DeveloperSubmissionForm() {
  const [units, setUnits] = useState([
    { unitId: '', typology: '', netArea: '', grossArea: '', floorNumber: '', blockName: '', totalBuildingGrossArea: '' }
  ]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnitChange = (index, event) => {
    const { name, value } = event.target;
    const newUnits = [...units];
    newUnits[index][name] = value;

    // Auto-fill totalBuildingGrossArea if it's the first unit in a new block
    if (name === 'blockName' && value && !newUnits[index].totalBuildingGrossArea) {
        const existingBlockUnits = newUnits.filter((u, i) => i !== index && u.blockName === value);
        if (existingBlockUnits.length > 0) {
            newUnits[index].totalBuildingGrossArea = existingBlockUnits[0].totalBuildingGrossArea;
        }
    }
    setUnits(newUnits);
  };

  const addUnit = () => {
    // Pre-fill blockName and totalBuildingGrossArea from the last unit if available
    const lastUnit = units[units.length - 1];
    const newUnit = {
        unitId: '',
        typology: '',
        netArea: '',
        grossArea: '',
        floorNumber: '',
        blockName: lastUnit ? lastUnit.blockName : '',
        totalBuildingGrossArea: lastUnit ? lastUnit.totalBuildingGrossArea : ''
    };
    setUnits([...units, newUnit]);
  };

  const removeUnit = (index) => {
    const newUnits = units.filter((_, i) => i !== index);
    setUnits(newUnits);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // Basic client-side validation for empty fields
      for (const unit of units) {
        for (const key in unit) {
          if (!unit[key]) {
            setError(`Please fill all fields for Unit ID: ${unit.unitId || 'New Unit'}.`);
            setLoading(false);
            return;
          }
        }
      }

      // Convert area and floor numbers to numbers
      const unitsToSend = units.map(unit => ({
        ...unit,
        netArea: parseFloat(unit.netArea),
        grossArea: parseFloat(unit.grossArea),
        floorNumber: parseInt(unit.floorNumber, 10),
        totalBuildingGrossArea: parseFloat(unit.totalBuildingGrossArea),
      }));

      const response = await submitUnits(unitsToSend);
      setMessage(response.message);
      setUnits([{ unitId: '', typology: '', netArea: '', grossArea: '', floorNumber: '', blockName: '', totalBuildingGrossArea: '' }]); // Clear form
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-card">
      <h2>Developer Unit Submission</h2>
      {message && <p className="message-success">{message}</p>}
      {error && <p className="message-error">{error}</p>}
      {loading && <p>Submitting units...</p>}

      <form onSubmit={handleSubmit}>
        {units.map((unit, index) => (
          <div key={index} style={{ border: '1px solid #e0e0e0', padding: '20px', marginBottom: '20px', borderRadius: '10px', backgroundColor: '#fdfdfd' }}>
            <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#34495e' }}>Unit {index + 1}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <label>
                Unit ID:
                <input type="text" name="unitId" value={unit.unitId} onChange={(e) => handleUnitChange(index, e)} required />
              </label>
              <label>
                Typology:
                <select name="typology" value={unit.typology} onChange={(e) => handleUnitChange(index, e)} required>
                  <option value="">Select Typology</option>
                  {unitTypologies.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                Net Area (sqm):
                <input type="number" step="0.01" name="netArea" value={unit.netArea} onChange={(e) => handleUnitChange(index, e)} required />
              </label>
              <label>
                Gross Area (sqm):
                <input type="number" step="0.01" name="grossArea" value={unit.grossArea} onChange={(e) => handleUnitChange(index, e)} required />
              </label>
              <label>
                Floor Number:
                <input type="number" name="floorNumber" value={unit.floorNumber} onChange={(e) => handleUnitChange(index, e)} required />
              </label>
              <label>
                Block/Building Name:
                <input type="text" name="blockName" value={unit.blockName} onChange={(e) => handleUnitChange(index, e)} required />
              </label>
              <label style={{ gridColumn: 'span 2' }}>
                Total Gross Area of Building (for this block):
                <input type="number" step="0.01" name="totalBuildingGrossArea" value={unit.totalBuildingGrossArea} onChange={(e) => handleUnitChange(index, e)} required />
              </label>
            </div>
            {units.length > 1 && (
              <button type="button" onClick={() => removeUnit(index)} style={{ backgroundColor: '#dc3545', marginTop: '15px' }}>
                Remove Unit
              </button>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          <button type="button" onClick={addUnit}>
            Add Another Unit
          </button>
          <button type="submit" disabled={loading}>
            Submit All Units
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeveloperSubmissionForm;
