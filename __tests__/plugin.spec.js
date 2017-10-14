import { StateStream } from 'rxact'
import { plugin } from '../src/index'
import rxactReactExample from './shared/rxact-react.example'
import createObserverExample from './shared/createObserver.example'

describe('plugin', () => {
  const plugins = [plugin()]
  rxactReactExample(plugins, StateStream)
  createObserverExample(plugins, StateStream)
})
