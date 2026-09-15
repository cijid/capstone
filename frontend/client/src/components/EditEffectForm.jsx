function EditEffectForm({
  effect,
  onChange,
  onSubmit,
  onCancel,
}) {
  if (!effect) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="report-modal">
        <div className="modal-header">
          <h2>Edit Effect</h2>

          <button
            type="button"
            className="close-button"
            onClick={onCancel}
          >
            X
          </button>
        </div>

        <form
          className="report-form"
          onSubmit={onSubmit}
        >
          <label>
            Capability

            <select
              name="capability"
              value={effect.capability}
              onChange={onChange}
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
              value={effect.title}
              onChange={onChange}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Severity

              <select
                name="severity"
                value={effect.severity}
                onChange={onChange}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </label>

            <label>
              Confidence

              <select
                name="confidence"
                value={effect.confidence}
                onChange={onChange}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </label>
          </div>

          <label>
            Status

            <select
              name="status"
              value={effect.status}
              onChange={onChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Monitoring">
                Monitoring
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>
          </label>

          <label>
            Location / Area of Effect

            <input
              type="text"
              name="location"
              value={effect.location}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Description / Mission Impact

            <textarea
              name="description"
              value={effect.description}
              onChange={onChange}
              rows="4"
              required
            />
          </label>

          <label>
            Recommended Action / PACE Guidance

            <textarea
              name="recommendedAction"
              value={
                effect.recommendedAction
              }
              onChange={onChange}
              rows="3"
            />
          </label>

          <div className="form-row">
            <label>
              Start Time

              <input
                type="datetime-local"
                name="startTime"
                value={effect.startTime}
                onChange={onChange}
              />
            </label>

            <label>
              End Time

              <input
                type="datetime-local"
                name="endTime"
                value={effect.endTime}
                onChange={onChange}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEffectForm;