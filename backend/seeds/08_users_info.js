/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user').del()
  await knex('user').insert([
    {id: "user01", name: 'Sniffy Buffy', rank: "Chief", admin: true, device_ids: JSON.stringify([ "device1", "device2", "device3", "device4", "device5", "device6", "device7", "device8"]), unit_id: "unit1"},
    {id: "user02", name: 'Jason Bason', rank: "Captain", admin: false, device_ids: JSON.stringify([ "device1"]), unit_id: "unit2"},
    {id: "user03", name: 'Macy Lacy', rank: "General", admin: false, device_ids: JSON.stringify([ "device1", "device2"]), unit_id: "unit3"}
  ]);
};
