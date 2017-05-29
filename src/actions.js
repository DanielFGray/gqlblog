// @flow
import { provideState } from 'freactal'
import { Observable } from 'rxjs'
import { get } from 'superagent'

const wrapWithPending = (pendingKey, cb) => effects =>
  effects.setFlag(pendingKey, true)
    .then(cb)
    .then(value => effects.setFlag(pendingKey, false).then(() => value))

const wrapComponentWithState = provideState({
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
      Observable.from(get('https://randomuser.me/api'))
        .map(x => x.body.results)
        .map(user => state => ({ ...state, user }))
        .toPromise()),
  },
})

export default wrapComponentWithState
