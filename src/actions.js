// @flow
import { provideState } from 'freactal'
import { get } from 'superagent'

const wrapWithPending = (pendingKey, cb) => (effects, ...a) =>
  effects.setFlag(pendingKey, true)
    .then(() => cb(effects, ...a))
    .then(value => effects.setFlag(pendingKey, false).then(() => value))

const Provider = provideState({
  initialState: () => ({
    list: [1, 2, 3],
    user: null,
    userPending: false,
  }),
  effects: {
    addItem: (effects, num) => state =>
      ({ ...state, list: state.list.concat(num) }),
    setFlag: (effects, key, value) => state => ({ ...state, [key]: value }),
    getUser: wrapWithPending('userPending', () =>
      get('https://randomuser.me/api')
        .then(x => x.body.results[0])
        .then(user => state => ({ ...state, user }))),
  },
})

export default Provider
