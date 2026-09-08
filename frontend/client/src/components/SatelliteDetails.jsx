function SatelliteDetails({ satellite }) {
  if (!satellite) {
    return (
      <div className="satellite-details empty">
        <h2>Selected Asset</h2>

        <p>Select a satellite from the globe or satellite list.</p>
      </div>
    );
  }

  return (
    <div className="satellite-details">
      <div className="satellite-details-header">
        <div>
          <p className="panel-label">Selected Asset</p>

          <h2>{satellite.name}</h2>

          <p className="satellite-norad">NORAD {satellite.noradId}</p>
        </div>

        <span
          className={`visibility-badge ${
            satellite.visible ? "visible" : "not-visible"
          }`}
        >
          {satellite.visibilityStatus}
        </span>
      </div>

      <div className="satellite-detail-grid">
        <div>
          <span>Latitude</span>

          <strong>{satellite.latitude.toFixed(2)}°</strong>
        </div>

        <div>
          <span>Longitude</span>

          <strong>{satellite.longitude.toFixed(2)}°</strong>
        </div>

        <div>
          <span>Altitude</span>

          <strong>{satellite.altitude.toFixed(0)} km</strong>
        </div>

        <div>
          <span>Range</span>

          <strong>
            {satellite.range !== null
              ? `${satellite.range.toFixed(0)} km`
              : "N/A"}
          </strong>
        </div>

        <div>
          <span>Azimuth</span>

          <strong>
            {satellite.azimuth !== null
              ? `${satellite.azimuth.toFixed(1)}°`
              : "N/A"}
          </strong>
        </div>

        <div>
          <span>Elevation</span>

          <strong>
            {satellite.elevation !== null
              ? `${satellite.elevation.toFixed(1)}°`
              : "N/A"}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default SatelliteDetails;
