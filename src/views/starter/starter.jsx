import React from 'react';
import {
    Row,
    Col
} from 'reactstrap';
import { SalesSummary, Projects, Feeds, SocialCards } from 'components/dashboard-components';
import firebase from 'firebase';

class Starter extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {keys:[], myroutine:[]};
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){

        this._isMounted = true;
        var ref = firebase.database().ref().child('routine');
        
        ref.on('value', snap => {
            var val = snap.val();
            
            if(val!=null & this._isMounted){
                var keys = [];
                for(var key in val){
                    keys.push(key);
                }
                this.setState({keys: keys});
                console.log('keys', keys);
            }
        })

        var ref = firebase.database().ref().child('myroutine');
        
        ref.on('value', snap => {
            var val = snap.val();
            
            if(val!=null & this._isMounted){
                var keys = [];
                for(var key in val){
                    keys.push(key);
                }
                this.setState({myroutine: keys});
            }
        })
    }
    render(){
    return (
        <div>
             <h5 className="mb-3">My Page</h5>
            <Row>
                <Col sm={6} lg={4}>
                    <Feeds />
                </Col>
                <Col sm={6} lg={4}>
                    {this.state.myroutine.map((key, index) => {
                        return(<Projects props={key} detail={true} my={true}/>)
                        <Review props={key}/>
                    })}
                </Col>
            </Row>
            <h5 className="mb-3">Explore routines</h5>
            <Row>
                {this.state.keys.map((key, index) => {
                    return(
                <Col sm={6} lg={4}>
                    <Projects props={key} detail={false} my={false}/>
                </Col>
                )})}
            </Row>
        </div>
    )}
}

export default Starter;