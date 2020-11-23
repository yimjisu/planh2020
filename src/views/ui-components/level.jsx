import React from 'react';
import {
    Card,
    CardImg,
    CardImgOverlay,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardColumns,
    CardGroup,
    CardDeck,
    CardLink,
    CardHeader,
    CardFooter,
    Button,
    Row,
    Col,
    Input,
    Table
} from 'reactstrap';

import firebase from 'firebase';
import { Projects } from 'components/dashboard-components';

var STATE = {CHECKING: 0, QUERIED: 1};

class LevelQueried extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            results: [],
            state: 1
        }
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
        var ref = firebase.database().ref().child('routine');

        ref.once('value', snap=>{
            var val = snap.val();
            if (val != null & this._isMounted){
                var keys = [];
                for (var key in val){
                    var _level = val[key].tag.level
                    if (_level == this.props.level)
                        keys.push(key);
                }
                this.setState({results: keys});
            }
        })
    }

    onClickRetry = () => {
        this.setState({
            state: STATE.CHECKING
        })
    }

    render () {
        if (this.state.results.length == 0){
            if (this.state.state == STATE.QUERIED){
                return(
                    <div>
                        <CardTitle>Sorry, there is no routines appropriate for your level.</CardTitle>
                        <Button onClick={this.onClickRetry}>Retry</Button>
                    </div>
                )
            } else if (this.state.state == STATE.CHECKING) {
                return (
                    <LevelCheck />
                )
            }
        }else{
            if (this.state.state == STATE.QUERIED){
                return (
                    <div>
                        <h5 className="mb-3">Routine recommendation for your level: {this.props.level}</h5>
                        <Row>
                            {this.state.results.map((key, index) => {
                                return(
                                    <Col sm={6} lg={4}>
                                        <Projects props={key} detail={false} />
                                    </Col>
                                )})}
                        </Row>
                        <Button onClick={this.onClickRetry}>Retry</Button>
                    </div>
                )
            } else if (this.state.state == STATE.CHECKING) {
                return (
                    <LevelCheck />
                )
            }
        }
    }
}

class LevelCheck extends React.Component{
    constructor(props){
        super(props);
        this.state={
            height: 160,
            weight: 50,
            aweek: null,
            plank: null,
            level: null,
            state: 0
        }
    }

    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){
        this._isMounted = true;
        this.state.state = STATE.CHECKING;
    }

    handleChangeHeight = (e) => {
        this.setState({
            height: e.target.value
        })
    }

    handleChangeWeight = (e) => {
        this.setState({
            weight: e.target.value
        })
    }

    onChangeAweek = (e) => {
        this.setState({
            aweek: e.target.value
        })
    }

    onChangePlank = (e) => {
        this.setState({
            plank: e.target.value
        })
    }

    onClickSubmit = () => {
        if (this.state.aweek == null || this.state.plank == null)
            window.alert('Please answer for all questions.')
        else{
            let r = this.state.aweek * 1 + this.state.plank * 1;
            
            if (r <= 1){
                this.setState({
                    level: 'low',
                    state: STATE.QUERIED
                })
            } else if (r <= 3){
                this.setState({
                    level: 'middle',
                    state: STATE.QUERIED
                })
            }else{
                this.setState({
                    level: 'high',
                    state: STATE.QUERIED
                })
            }
        }
    }

    render(){
        if (this.state.state == STATE.CHECKING) {
            return(
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardBody>
                                <table>
                                    <tr>
                                        <td style={{width:"45%"}}><CardTitle>Height</CardTitle></td>
                                        <td><Input type='number' value={this.state.height} onChange={this.handleChangeHeight} style={{textAlign: 'right', width:"100%"}} /></td>
                                        <td><CardTitle>cm</CardTitle></td>
                                    </tr>
                                    <tr>
                                        <td><CardTitle>Weight</CardTitle></td>
                                        <td><Input type='number' value={this.state.weight} onChange={this.handleChangeWeight} style={{textAlign: 'right', width:"100%"}} /></td>
                                        <td><CardTitle>kg</CardTitle></td>
                                    </tr>
                                </table>
                                <br/>
                                <br/>
                                <CardTitle>I do exercise...</CardTitle>
                                <div onChange={this.onChangeAweek}>
                                    <Input type='radio' value="0" name="aweek" style={{left:"10%"}} /><CardTitle style={{left:"10%"}}>0~1 days a week</CardTitle>
                                    <Input type='radio' value="1" name="aweek" style={{left:"10%"}} /><CardTitle style={{left:"10%"}}>2~3 days a week</CardTitle>
                                    <Input type='radio' value="2" name="aweek" style={{left:"10%"}} /><CardTitle style={{left:"10%"}}>4~5 days a week</CardTitle>
                                </div>
                                <br/>
                                <br/>
                                <CardTitle>I can do Plank for...</CardTitle>
                                <div onChange={this.onChangePlank}>
                                    <Input type='radio' value="0" name="plank" style={{left:"10%"}} /><CardTitle style={{left:"10%"}}>less than 1 min</CardTitle>
                                    <Input type='radio' value="1" name="plank" style={{left:"10%"}} /><CardTitle style={{left:"10%"}}>1~2 minutes</CardTitle>
                                    <Input type='radio' value="2" name="plank" style={{left:"10%"}} /><CardTitle style={{left:"10%"}}>more than 2 min</CardTitle>
                                </div>
                                <br/>
                                <Button style={{left:"70%", width:"30%"}} onClick={this.onClickSubmit}>Submit</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )
        } else if (this.state.state == STATE.QUERIED) {
            return (
                <LevelQueried level={this.state.level} />
            )
        }

    }
}

export default LevelCheck;