# Planning Documentation for JSST

Team Name - Master Chiefs
Project Name - Joint Space Service Tracker (JSST)

## Team Members

Cliff - Team Lead / Project Manager
Emilio, Kentiaus - Back End
Caleb, Jose - Front End

## Problem Statement

Army operations depend heavily on satellite communications (SATCOM) and Positioning, Navigation and Timing (PNT) across essentially every warfighting function, while current Space Force planning emphasizes making PNT/SATCOM status and degradation understandable and usable by the Joint Force. When these capabilities are degraded or unavailable, users need the ability to determine and report what capabilities are affected, how the degradation impacts their mission, and what actions they should take to mitigate those effects.

"Can I see what space-enabled capabilities I have right now, what is degraded, and what should I do about it?"

## Users and Stakeholders

Primary Users: Army or ops personnel dependent on SATCOM/PNT

Secondary Users: Space Force personnel responsible for communicating capability status

Stakeholders: Commanders, ops centers, planners, comm, space support personnel

## Needs/Outcomes - What users need to accomplish without specifying the software implementation

Users need to quickly determine which space-enabled capabilities are available at their location.

Users need to understand whether PNT or SATCOM degradation will affect their mission.

Users need actionable mitigation guidance when a capability is degraded.

Space Force admins need to be able to input status of capabilities.

Users need to be able to define capability dependencies

Users can provide capability status updates

Middle Man in-between a team and command level overseeing limitations and connectivity levels.

## Product Vision

A shared operational application that provides Joint Force users with an intuitive, location-based view of SATCOM and PNT availability, degradation, mission impacts, and recommended response actions.

## MVP

User/Admin Dashboard - Has a map displaying reported capability status

Admin - form for admins to enter capability status

User/Admin - show the statuses (Normal / Degraded / Unavailable)

User/Admin - Location associated with each report

User/Admin - Timestamps/how recent (freshness indicator)

User/ Admin - Description of the impact

User/Admin recommended response action / PACE

User - ability for users to submit/update a status report

User/Admin - separate views for admins / users

Stakeholder - Read only view

Stakeholder / Admin - C2 view (FIRES)

User/Admin - Identify dependent capabilities

## EPICS

1. Space Capability Situational Awareness - Allow users to understand the
   current state of space-enabled capabilities in their operating area.
   (map, statuses, location)

2. Capability Status Reporting- Allow authorized personnel and supported users to contribute current capability status information. (admin status form, user submitted reports,status, updates, location)

3. Mission Dependencies - Connect space capability degradation to mission capabilities(dependencies, affected systems/functions, mission impact descriptions)

4. Mitigation & PACE Guidance - Help users determine what action to take when a capabilityis degraded or unavailable

5. Role-based operational views - Present views appropriate to user's role

6. C2 Situational Awareness - Allow leadership to view dashboards... understand degradationacross teams, capes, and locations.

## User Stories

1 - As an operator, I want to see the current status of each capability, so that I can identify which capabilities are operational, degraded, or unavailable.
2 - As an authorized user, I want to update the status of a capability, so that changes in availability are reflected in the system.
3 - As an operator, I want to see when a capability I depend on becomes degraded or unavailable, so that I can adjust mission planning accordingly.
4 - As an operator, I want to view alternate capabilities when my primary capability is unavailable, so that I can continue supporting the mission.
5 - As an administrator, I want to manage which information and functions are available to each role, so that users have appropriate access.
6 - As a leader, I want to see degradation by location, so that I can identify areas experiencing the greatest operational impact.

As a Commander I want to know the best time of day, devices to be used, and ability to perform the task in a given time.
I want all devices PMCS'ed before operation and after, situational awareness, what limitational dependencies due to environmental factors, possible Non-friendly or adversaries in the AO.
So that I am able to plan and conduct the mission properly.

As a soldier in the field I need a simple, location-based view of SATCOM and PNT capabilities in my AO so that I can quickly identify degraded or unavailable capabilities, understand the impact to my mission, and take the appropriate PACE action.

As a leader, I want to see my capabilities across my AO so that I can understand risks to my teams and missions and make informed decisions to mitigate those impacts, , and know what alternate course of action to use.
