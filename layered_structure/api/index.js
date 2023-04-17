const userService = require(`./user`);
const cityService = require(`./city`);
const countryService = require(`./country`);

module.exports = (db, common) => {
    return {
        user: userService(db, common),
        city: cityService(db),
        country: countryService(db),
    }
}
