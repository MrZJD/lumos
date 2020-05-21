/* 提供者基类 */
class Provider extends React.PureComponent {
    constructor (props) {
        super(props)

        this.state = props.state
        this.reducer = props.reducer
        this.actions = props.actions

        this.dispatch = (type, payload) => {
            const handler = this.reducer[type]

            if (!handler) {
                console.warn(`Provider: dispatch -> ${type} not exist`)
                return
            }
    
            this.setState(state => handler(state, payload))
        }

        this.trigger = (type) => {
            const handler = this.actions[type]

            if (!handler) {
                console.warn(`Provider: trigger -> ${type} not exist`)
                return
            }

            return handler(this.dispatch)
        }
    }

    //  <this.props.children provider={ this.state } dispatch={ this.dispatch } />

    render () {
        return h(
            this.props.renderer,
            {
                ...this.state,
                dispatch: this.dispatch,
                trigger: this.trigger
            }
        )
    }
}

// * 工厂 链接 provider -> ui
function connect (Render, { state, reducer, actions }) {
    return function () {
        // return <Provider state reducer actions renderer={ Render } />
        return h(
            Provider,
            {
                state,
                reducer,
                actions,
                renderer: Render
            }
        )
    }
}
