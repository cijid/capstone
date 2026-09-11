function EditEffectForm({
  effect,
  onChange,
  onSubmit,
  onCancel,
}) {
  if (!effect) {
    return null;
  }

  function formatDateTimeLocal(value) {
    if (!value) {
      return "";
    }

    if (!String(value).includes("T")) {
      return value;
    }

    const date = new Date(value);

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
              name="capabilityCategory"
              value={
                effect.capabilityCategory
              }
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
              value={
                effect.title || ""
              }
              onChange={onChange}
              required
            />
          </label>

          <div className="form-row">
            <label>
              Severity

              <select
                name="severity"
                value={
                  effect.severity ?? 2
                }
                onChange={onChange}
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
                value={
                  effect.confidence ?? 0
                }
                onChange={onChange}
                required
              />
            </label>
          </div>

          <label>
            Status

            <select
              name="statusCode"
              value={
                effect.statusCode ?? 1
              }
              onChange={onChange}
            >
              <option value="1">
                Active
              </option>

              <option value="3">
                Monitoring
              </option>

              <option value="4">
                Resolved
              </option>
            </select>
          </label>

          <label>
            Location / Area of Effect

            <input
              type="text"
              name="location"
              value={
                effect.location || ""
              }
              onChange={onChange}
              required
            />
          </label>

          <label>
            Description / Mission Impact

            <textarea
              name="description"
              value={
                effect.description || ""
              }
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
                effect.recommendedAction ||
                ""
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
                value={formatDateTimeLocal(
                  effect.startTime
                )}
                onChange={onChange}
              />
            </label>

            <label>
              End Time

              <input
                type="datetime-local"
                name="endTime"
                value={formatDateTimeLocal(
                  effect.endTime
                )}
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