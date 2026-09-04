/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('unit_info').del()
  await knex('unit_info').insert([
    {id: "unit-1", name: 'Alpha', mission_ids: JSON.stringify([ 'mission-alpha-01', "mission-alpha-02"])},
    {id: "unit-2", name: 'Bravo', mission_ids: JSON.stringify([ 'mission-bravo-01', "mission-bravo-02"])},
    {id: "unit-3", name: 'Charlie', mission_ids: JSON.stringify([ 'mission-charlie-01', "mission-charlie-02"])}
  ]);
};
