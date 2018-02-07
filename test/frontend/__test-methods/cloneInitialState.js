const initialState = require('../../../app/reducers/_initial').default;
module.exports = (state = initialState) => JSON.parse(JSON.stringify(state));
