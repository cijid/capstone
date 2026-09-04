import { useState } from "react";

function ReportEffectForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    capability: "PNT",
    title: "",
    severity: "High",
    confidence: "High",
    location: "",
    description: "",
    recommendedAction: "",
    startTime: "",
    endTime: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="modal-backdrop">
      <div className="report-modal">
        <div className="modal-header">
          <h2>Report New Effect</h2>

          <button
            type="button"
            className="close-button"
            onClick={onCancel}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <label>
            Capability
            <select
              name="capability"
              value={formData.capability}
              onChange={handleChange}
            >
              <option value="PNT">PNT</option>
              <option value="SATCOM">SATCOM</option>
              <option value="MW/MT">MW/MT</option>
            </select>
          </label>

          <label>
            Effect Name
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: PNT Interference"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Severity
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label>
              Confidence
              <select
                name="confidence"
                value={formData.confidence}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <label>
            Location / Area of Effect
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Training Area Alpha"
              required
            />
          </label>

          <label>
            Description / Mission Impact
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the operational impact..."
              rows="4"
              required
            />
          </label>

          <label>
            Recommended Action / PACE Guidance
            <textarea
              name="recommendedAction"
              value={formData.recommendedAction}
              onChange={handleChange}
              placeholder="Describe recommended mitigation..."
              rows="3"
            />
          </label>

          <div className="form-row">
            <label>
              Start Time
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </label>

            <label>
              End Time
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Submit Effect Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportEffectForm;