function CoverageSummary({ satellites, observer }) {
  const visibleSatellites = satellites.filter((satellite) => satellite.visible);

  return (
    <div className="coverage-summary">
      <div>
        <span>Observer</span>

        <strong>{observer.name}</strong>
      </div>

      <div>
        <span>Satellites Tracked</span>

        <strong>{satellites.length}</strong>
      </div>

      <div>
        <span>Currently In View</span>

        <strong>{visibleSatellites.length}</strong>
      </div>

      <div>
        <span>Minimum Elevation</span>

        <strong>10°</strong>
      </div>
    </div>
  );
}

export default CoverageSummary;
