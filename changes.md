# 2025.07.30.

## Route changes

- tools/id: route now requires 'tool_id' instead of 'id'
- tools/new-tool: route updated
- tools/scraps: route is now removed
- tools/update/id: now requires 'tool_id' instead of 'id'
- tools/update/id: additional exception handling added
- tools/calibrate/id: additional error handling added, route reworked
- tools/calibrations/id: route is updated
- tools/calibration-update/id: route is reworked
- tools/delete-calibration/id: route reworked
- **NEW** routes with '/misc-items' prefix

## Schema changes

- UserToolOut: 'id' removed
- ToolOut: 'id' removed
- CalibCreate: 'calibration_id' added
- **NEW** CalibUpdate schema
- **NEW** MiscItems schema

## DB changes

- removed the 'visibility' column from the 'calibrations' table
- new 'calibration_id' column to 'calibrations'
- 'last_modified' and 'modified_by' columns have been added to 'tools' and 'calibrations' tables
- **NEW** 'misc_items' table to store gauges and other miscellaneous items
