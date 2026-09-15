import { useState } from "react";

function ReportEffectForm({
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    capability: "PNT",
    title: "",
    severity: "2",
    confidence: "90",

    locationName: "",
    latitude: "",
    longitude: "",
    radius: "",

    description: "",
    recommendedAction: "",

    startTime: "",
    endTime: "",

    userSubmitted: "",
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

        <form
          onSubmit={handleSubmit}
          className="report-form"
        >
          <label>
            Space Capability
            <select
              name="capability"
              value={formData.capability}
              onChange={handleChange}
              required
            >
              <option value="PNT">
                PNT
              </option>

              <option value="SATCOM">
                SATCOM
              </option>

              <option value="MW/MT">
                MW/MT
              </option>
            </select>
          </label>

          <label>
            Effect Name
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: SATCOM Interference"
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
                <option value="1">
                  Low
                </option>

                <option value="2">
                  Medium
                </option>

                <option value="3">
                  High
                </option>

                <option value="4">
                  Critical
                </option>
              </select>
            </label>

            <label>
              Confidence
              <input
                type="number"
                name="confidence"
                min="0"
                max="100"
                value={formData.confidence}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Location Name
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Example: Peterson SFB"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Latitude
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="38.8339"
                min="-90"
                max="90"
                required
              />
            </label>

            <label>
              Longitude
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-104.8214"
                min="-180"
                max="180"
                required
              />
            </label>
          </div>

          <label>
            Effect Radius (miles)
            <input
              type="number"
              name="radius"
              min="0"
              step="any"
              value={formData.radius}
              onChange={handleChange}
              placeholder="Example: 25"
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
              value={
                formData.recommendedAction
              }
              onChange={handleChange}
              placeholder="Describe recommended mitigation..."
              rows="3"
            />
          </label>

          <div className="form-row">
            <label>
              Start Time
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Time (Optional)
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Submitted By
            <input
              type="text"
              name="userSubmitted"
              value={formData.userSubmitted}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </label>

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