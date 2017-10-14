import { StateStream } from 'rxact'
import { decorator } from '../src/index'
import rxactReactExample from './shared/rxact-react.example'
import createObserverExample from './shared/createObserver.example'

describe('decorator', () => {
  const TestStateStream = decorator()(StateStream)
  rxactReactExample([], TestStateStream)
  createObserverExample([], TestStateStream)
})
