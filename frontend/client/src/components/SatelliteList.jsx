function SatelliteList({ satellites, selectedSatelliteId, onSatelliteSelect }) {
  return (
    <aside className="satellite-list-panel">
      <div className="panel-header">
        <div>
          <p className="panel-label">Orbital Assets</p>

          <h2>Satellites</h2>
        </div>

        <span className="satellite-count">{satellites.length}</span>
      </div>

      <div className="satellite-list">
        {satellites.map((satellite) => {
          const selected = satellite.noradId === selectedSatelliteId;

          return (
            <button
              key={satellite.noradId}
              className={`satellite-list-item ${selected ? "selected" : ""}`}
              onClick={() => onSatelliteSelect(satellite)}
            >
              <span
                className={`satellite-status-dot ${
                  satellite.visible ? "visible" : "not-visible"
                }`}
              />

              <div>
                <strong>{satellite.name}</strong>

                <span>NORAD {satellite.noradId}</span>
              </div>

              <span className="satellite-list-elevation">
                {satellite.elevation !== null
                  ? `${satellite.elevation.toFixed(0)}°`
                  : "--"}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default SatelliteList;
