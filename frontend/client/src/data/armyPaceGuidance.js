const guidanceByTitle = {
  "Timing Synchronization Discrepancy": {
    primary: "Verify the approved timing source and clock settings at both sites; measure the offset and repeat the synchronization check.",
    alternate: "Use a second validated timing source and compare its timestamp against the primary source before relying on time-sensitive data.",
    contingency: "Record and communicate the measured offset; flag affected reports so the coordination center can account for uncertain timing.",
    emergency: "Suspend decisions that require precise synchronized time until a trusted time reference is restored and confirmed.",
  },
  "Position and Navigation Consistency Check": {
    primary: "Check GNSS reception and navigation-unit initialization; compare time-aligned readings on the PNT navigation terminal.",
    alternate: "Cross-check position against an independent, approved navigation source before using the reported location.",
    contingency: "Use verified last-known position and manual position checks, clearly marking location data as uncertain.",
    emergency: "Stop relying on conflicting position reports for movement or coordination until the position is independently confirmed.",
  },
  "Missile Warning Report Processing Delay": {
    primary: "Check the sensor gateway, processing unit, and operator-terminal logs; identify where report latency occurs and repeat the test.",
    alternate: "Use an independently verified reporting path to confirm that warning reports reach the operations center on time.",
    contingency: "Notify the operations center of the delay and use the approved backup reporting procedure while tracking report timestamps.",
    emergency: "Treat delayed or unconfirmed reports as a loss of timely warning and escalate through established command procedures.",
  },
  "Intermittent Mobile SATCOM Connection": {
    primary: "Check antenna visibility, terminal status, and connections; repeat voice and data connectivity tests.",
    alternate: "Switch to an approved secondary communications link and confirm two-way contact with the operations center.",
    contingency: "Use scheduled check-ins and store-and-forward messages through an approved backup channel.",
    emergency: "If contact cannot be restored, follow the unit's lost-communications procedure and report the outage when a link becomes available.",
  },
};

const fallbackGuidance = {
  primary: "Follow the effect's recommended action and verify whether the capability has recovered.",
  alternate: "Use an independently verified, approved backup for the affected capability.",
  contingency: "Inform the supported team of the degraded capability and use its documented continuity procedure.",
  emergency: "Escalate the unresolved mission impact through established command procedures.",
};

export function getArmyPaceGuidance(effect) {
  return guidanceByTitle[effect?.title] || fallbackGuidance;
}