// @flow
import hoistStatics from 'hoist-non-react-statics'
import React, { Component } from 'react'
import {
  getObservable,
  isObservable
} from 'rxact'
import type { ComponentType } from 'react'
import type {
  ISubscription,
  IESObservable,
} from 'rxact/lib/observable'
import noop from './utils/noop'

export type MapStateToProps = (stateProps: any, ownProps: {}) => any
export type MergeProps = (stateProps: any, ownProps: {}) => any

type State = {
  component: any,
}

type Props = any

type Decorator = (
  mapStateToProps?: MapStateToProps, mergeProps?: MergeProps,
) => (WrappedComponent: ComponentType<any>) => ComponentType<any>

type CreateObserver = (state$: IESObservable) => {
  subscription: ISubscription,
  decorator: Decorator,
}

const setDisplayName = component => {
  const displayName = component.displayName
  || component.name
  || 'Component'

  return `RxactObserver(${displayName})`
}

const defaultMergeProps = (state, props) => ({
  ...props,
  ...state,
})

const createObserver: CreateObserver = (state$) => {
  const Observable = getObservable()

  if (!(isObservable(state$))) {
    throw new Error('Expect state$ to be instance of Observable')
  }

  let streamSubscription = { unsubscribe: () => {} }
  const decorator = (mapStateToProps, mergeProps = defaultMergeProps) =>
    (WrappedComponent) => {
      class Observer extends Component<Props, State> {
        static displayName = setDisplayName(WrappedComponent)

        constructor(props) {
          super(props)

          this.props$ = new Observable(observer => {
            this.setProps = props => observer.next(props)

            this.setProps(this.props)

            return {
              unsubscribe: () => {
                this.setProps = noop
              }
            }
          })

          this.initialSubscriptions()
        }

        subscription = null

        setProps = noop

        props$ = noop

        state = {
          component: null,
        }

        component = null

        componentWillUnmount() {
          if (this.subscription && typeof this.subscription.unsubscribe === 'function') {
            this.subscription.unsubscribe()
            this.subscription = null
          }
        }

        componentWillReceiveProps(nextProps) {
          this.setProps(nextProps)
        }

        shouldComponentUpdate() {
          return false
        }

        initialSubscriptions = () => {
          let stream$ = state$

          const vdom$ = new Observable(observer => {
            let readyCount = 0
            let streamState
            let propState
            const onSubscribe = () => {
              if (readyCount < 2) {
                readyCount += 1
              }

              if (readyCount > 1) {
                let nextState = streamState

                if (typeof mapStateToProps === 'function') {
                  nextState = mapStateToProps(streamState, propState)
                }

                const componentProps = mergeProps(nextState, propState)

                const nextVdom = (
                  <WrappedComponent {...componentProps} />
                )
                observer.next(nextVdom)

              }
            }

            const propSubscription = this.props$.subscribe((state) => {
              propState = state
              onSubscribe()

            })
            streamSubscription = stream$.subscribe((state) => {

              streamState = state
              onSubscribe()
            })

            return {
              unsubscribe: () => {
                streamSubscription.unsubscribe()
                propSubscription.unsubscribe()
              }
            }
          })

          this.subscription = vdom$.subscribe(component => {
            this.component = component

            if (this.subscription) {
              this.forceUpdate()
            }
          })
        }

        render() {
          return this.component
        }
      }

      return hoistStatics(Observer, WrappedComponent)
    }

  return {
    decorator,
    subscription: streamSubscription,
  }
}

export default createObserver
