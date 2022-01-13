const { createActions } = require('../utils/mongo');
const subset = createActions('subset');


module.exports = {
    preset: {
        ash: ['ASH',],
        bsh: ['BSH',],
        ksh: ['KSH',],
        msz: ['MSZ',],
        bsz: ['BSZ',],
        csz: ['CSZ',],
    },
    update: (key, codes) => {
        // return subset.updateOne({ key }, { $addToSet: { codes: { $each: codes } }, $set: { names } }, { upsert: true });
        return subset.updateOne({ key }, { $set: codes }, { upsert: true });
    },
    findOne: (query, options) => {
        return subset.findOne(query, options);
    }
};