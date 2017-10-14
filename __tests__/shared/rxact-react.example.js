import Rx from 'rxjs'
import { setup, teardown } from 'rxact'

export default (plugins, StateStream) => {
  describe('rxact-react', () => {
    afterEach(() => {
      teardown()
    })

    it('Add instance funtion "observer" to StateStream', () => {
      setup({ Observable: Rx.Observable, plugins })
      
      const stream = new StateStream('stream')
      expect(stream.observer).toBeDefined()
    })
  })
}
