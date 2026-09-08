/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('units').del()
  await knex('units').insert([
    {id: "unit1", name: 'Alpha', mission_ids: JSON.stringify([ 'mission1', "mission2"])},
    {id: "unit2", name: 'Bravo', mission_ids: JSON.stringify([ 'mission1', "mission2"])},
    {id: "unit3", name: 'Charlie', mission_ids: JSON.stringify([ 'mission1', "mission3"])}
  ]);
};
