import React from 'react'

const timeLoop = (Comp) => class A extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            initialized: false,
        }

        this.increaseTime = this.increaseTime.bind(this)
    }

    componentDidMount() {
        this.increaseTime()
        this.setState({ initialized: true, })
    }

    increaseTime() {
        this.setState({ time: this.state.time + 0.01 })

        requestAnimationFrame(this.increaseTime)
    }

    render() {
        return <Comp
                   {...this.props}
                   initialized={ this.state.initialized }
                   time={ this.state.time } />
    }
}

export default timeLoop
