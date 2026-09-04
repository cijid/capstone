/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_info').del()
  await knex('user_info').insert([
    {id: "user-01", name: 'Sniffy Buffy', rank: "Chief", admin: true, devices: JSON.stringly([ "device-1", "device-2", "device-3", "device-4", "device-5", "device-6", "device-7", "device-8"])},
    {id: "user-02", name: 'Jason Bason', rank: "Captain", admin: false, devices: JSON.stringly([ "device-1"])},
    {id: "user-03", name: 'Macy Lacy', rank: "General", admin: false, devices: JSON.stringly([ "device-1", "device-2"])}
  ]);
};
