// @flow
import { StateStream } from 'rxact'
import createObserver from './createObserver'

export const plugin = () => (instance: StateStream) => {
  const { decorator, subscription } = createObserver(instance.state$)

  instance.observer = decorator
  instance.subscriptions.push(subscription)
}

export const decorator = () => {
  return (StateStream: StateStream) => {
    return class DebuggableStream extends StateStream {
      constructor(...params: Array<any>) {
        const instance = super(...params)

        return plugin()(instance)
      }
    }
  }
}
