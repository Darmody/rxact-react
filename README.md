<h1 align="center">Rxact React</h1>

[![npm version](https://img.shields.io/npm/v/rxact-react.svg?style=flat-square)](https://www.npmjs.com/package/rxact-react)
[![CircleCI master](https://img.shields.io/circleci/project/github/Darmody/rxact-react/master.svg?style=flat-square)](https://circleci.com/gh/Darmody/rxact-react/tree/master)
[![Coveralls github branch](https://img.shields.io/coveralls/github/Darmody/rxact-react/master.svg?style=flat-square)](https://coveralls.io/github/Darmody/rxact-react)

Rxact React is a React observer for Rxact.

After setup this plugin, the instance of `StateStream` will have an `observer` function helping you binding stream's state to react component.

## Installation

```
  yarn add rxact rxact-react
```

## Usage

There are two ways:

#### 1. Install as a plugin

```javascript
  import { setup, StateStream } from 'rxact'
  import { plugin as rxactReact } from 'rxact-react'

  setup({
    Observable: /** Observable lib you like **/,
    plugins: [rxactReact()],
  })

  const stream = new StateStream('stream', { name: 'rxact' })

  stream.observer(state => ({
    name: state.name,
  }))(
    class ReactComponent extends React.Component {
      ...
    }
  )
```

#### 2. Enhance StateStream

```javascript
  import { setup, StateStream } from 'rxact'
  import { decorator as rxactReact } from 'rxact-react'

  const EnhancedStateStream = decorator()(StateStream)

  setup({
    Observable: /** Observable lib you like **/,
    StateStream: EnhancedStateStream,
  })

  const stream = new EnhancedStateStream('stream', { name: 'rxact' })

  stream.observer(state => ({
    name: state.name,
  }))(
    class ReactComponent extends React.Component {
      ...
    }
  )
```

## API

#### plugin()

Return a StateStream plugin.

#### decorator()

Return a function for wrapping StateStream.

#### stateStream.observer()

```javascript
  stateStream.observer(
    mapStateToProps: ?Function,
    mergeProps: ?Function,
  ): StateStreamPlugin
```

|    Parameter    | Type |          Description          | Default |
  | -------------  | ---- |          -----------          | ------- |
  | mapStateToProps  | Function | Function for mapping stream state to component state. | None |
  | mergeProps  | Function | Function for merging result of `mapStateToProps` and parent props. | None |

If you are familiar with `react-redux`, you will find out it is almost as same as `connect`.

## License

[MIT](https://github.com/Darmody/rxact-react/blob/master/LICENSE)
