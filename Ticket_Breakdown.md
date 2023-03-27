# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here
Assuming:

- database is relational database since word 'tables' are being used at the Ticket Breakdown session from above.
- custom id for each agent can be anything and varies between facilities. Therefore no validation or regex check to ensure the data is correct. There could be further develpoment for validation for each facility if needed.

### Ticket 1 - Add Database Schema

Create database migration to Add new Table: Agents_custom_ids to the database
This new table is to hold custom_ids for each Agent at different Facilities

Assuming the relationshaip between:

- custom_id to Agent is n to 1
- Agent to Facility is n to n
- custom_id to Agent to facility is 1 to 1 to 1


Table Columns:

- agent_id
  - Type: INT NOT NULL
  - Foreign key referencing id from Agents Table
  - ON UPDATE CASCADE
  - ON DELETE CASCADE
- facility id
  - Type: INT NOT NULL
  - Foreign key referencing id from Facilities Table
  - ON UPDATE CASCADE
  - ON DELETE CASCADE
- custom_id
  - Type: VARCHAR(128) NOT NULL
    - The size of the varchar should be determined by the size of agents * facilities with spare room for growth. Here 128 is just an example.

Table CONSTRAINT

- unique_custom_facility Unique(custom_id, facility_id)
  - Set unique constraint between custom_id and facility_id to prevent same custom_id are used in same facility twice
- unique_agent_facility_custom Unique(agent_id, custom_id, facility_id)
  - Set unique constraint between agent_id, facility_id and custom_id to prevent duplications

Acceptance criteria:

1. No duplication record that is holding same custom_id and facility_id
2. No duplication record that is holding same custom_id, facility_id and agent_id
3. New record should only be created if foriegn keys (agent_id, facility_id) existed in other tables
4. custom_id cannot be empty when insertin new record
5. Migration should be able to rollback without any sideeffect

time/effort estimates: ~2 hrs work

### Ticket 2 - Create Migration to imoprt current existing custom_ids for different Facilities

Create database migration to import data for the new Agents_custom_ids Table

1. Gather Data from facilities
2. Make sure no empty custom_ids, agent_ids or facility_id

Acceptance criteria:

1. No duplication record that is holding same custom_id and facility_id
2. No duplication record that is holding same custom_id, facility_id and agent_id

time/effort estimates: ~2hrs for implementing database migration but may need longer turn around time for gathering data with Project Manager's help to coordinate with other team

### Ticket 3 - Update Agent Model layer to support new schema

Update Agent Model to reflect the new Agents_custom_ids Table and updated related api

Area to be covered but not limited to:

- API /facilities/{facility_id}/agents
  - custom_id should be provided for each agent when fetching agents for each facilities
- API /agents/{agent_id}
  - when fetching agent, a list of custom_id for each facilities should be provided if required

  ```JSON
  {
    "custom_ids": {
        {facility_id}: {custom_id},
        ...
    }
  }
  ```

Acceptance criteria:

- Existing Tests should all pass
- Tests should be implemented to ensure data integrity and accuracy for each endpoint

time/effort estimates: depends on the amount of codes need to be updated, the complexity should be at least moderate level and require 2-3 days of work.

### Ticket 4 - Add new API endpoints for allowing facility to save their own custom_id for each agent

Assuming there will be front end team to implement the interface to use this endpoint for CRUD custom_ids, this ticket will only handle the backend endpoints

Assuming access control mechanism is implemented and can be reused easily among codebase

Endpoints:

1. Get `/facilities/{facility_id}/agents/{agent_id}/custom_id`
   - Return a custom_id for given agent at given facility
2. Post `/facilities/{facility_id}/agents/{agent_id}/custom_id`
   - Validating given data from request body (Assuming JSON request body format)
      - custom_ids parameter cannot be emptied
      - type of custom_ids parameter has to be an array
3. Put `/facilities/{facility_id}/agents/{agent_id}/custom_ids`
   - Validating given data from request body (Assuming JSON request body format)
      - custom_ids parameter cannot be emptied
      - type of custom_ids parameter has to be an array
4. DELETE `/facilities/{facility_id}/agents/{agent_id}/custom_ids`

Acceptance criteria:
The response of each endpoitn should follow the same pattern of existing endpoints in the codebase

time/effort: 3-4 days of work

### Ticket 5 - Update generate report functions to use custom_id from new Agents_custom_ids Table

Update `generateReport` function to use facilities' own custom_id for each agent when generating reports.

Update `getShiftsByFacility` function to allow agents' custom_id are returned base on the given Facility id.

Acceptance criteria:

- New reports should use custom_id from Agents_custom_ids table when referring to each agent
  - ensure correct custom_ids are shown for correct facility

time/effort: 2 days of work
