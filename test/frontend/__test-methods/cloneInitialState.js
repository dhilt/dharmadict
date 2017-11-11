const initialState = require('../../../app/reducers/_initial').default;
const cloneState = (state = initialState) => JSON.parse(JSON.stringify(state));

module.exports = {
  cloneState
};
