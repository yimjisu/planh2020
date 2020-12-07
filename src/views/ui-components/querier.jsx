import React from 'react';

class Querier extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
    }

    componentWillUnmount() {
        this.__isMounted = false;
        this.state = {
            query_text: ''
        }
    }

    componentDidMount () {
        this._isMounted = true;
        var param = window.location.href.split('/');
        this.setState({
            query_text: param[param.length -1]
        })
   
    }

    render() {
        return(null);
    }
}

export default Querier;