function EffectFilters({
  statusFilter,
  setStatusFilter,
  capabilityFilter,
  clearCapabilityFilter,
}) {
  const statuses = [
    "All",
    "Active",
    "Monitoring",
    "Resolved",
  ];

  return (
    <div className="effect-controls">
      <div className="effect-filter-bar">
        {statuses.map((status) => (
          <button
            key={status}
            className={
              statusFilter === status
                ? "effect-filter-button active"
                : "effect-filter-button"
            }
            onClick={() =>
              setStatusFilter(status)
            }
          >
            {status}
          </button>
        ))}
      </div>

      {capabilityFilter !== "All" && (
        <button
          className="clear-capability-filter"
          onClick={clearCapabilityFilter}
        >
          Clear Capability Filter
        </button>
      )}
    </div>
  );
}

export default EffectFilters;