/**
 * React Provider Design Pattern
 * @author mrzjd
 * @date 2019/12/03
 */
function CounterProvider (Render) {
    /* 组件初始化状态 */
    const state = {
        value: 1
    }

    /* 状态机的控制器 */
    const reducer = {
        plus (state, payload) {
            return {
                ...state,
                value: state.value + (payload || 1)
            }
        }
    }

    const actions = {
        delayPlus (dispatch) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    dispatch('plus')
                    resolve()
                }, 2000)
            })
        }
    }

    return connect(Render, { state, reducer, actions })
}

class CounterRenderer extends React.PureComponent {
    constructor (props) {
        super(props)

        /* this: 挂载UI事件(不影响state的逻辑) */
    }

    render () {
        // return <div className="counter">
        //     <div className="value">{ this.props.value }</div>
        //     <button onClick={ () => this.props.dispatch('plus') } >plus</button>
        //     <button onClick={ () => this.props.trigger('delayPlus') } >delay plus</button>
        // </div>
        return h(
            'div',
            { className: 'counter' },
            ...[
                h(
                    'div',
                    {
                        className: 'value'
                    },
                    this.props.value
                ),
                h(
                    'button',
                    {
                        onClick: () => this.props.dispatch('plus')
                    },
                    'plus'
                ),
                h(
                    'button',
                    {
                        onClick: () => this.props.trigger('delayPlus')
                    },
                    'delay plus'
                )
            ]
        )
    }
}

const Counter = CounterProvider(CounterRenderer) // export
