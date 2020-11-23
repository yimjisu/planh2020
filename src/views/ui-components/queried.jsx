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

class Queried extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            minminute: null,
            maxminute: null,
            level: null,
            tags: [],
            results: [],
        }
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
        var param = window.location.href.split('?');

        param = param[param.length - 1].split('&');

        var tag_temp = []
        if (param.length > 3){
            for (var i = 3 ; i < param.length ; i++){
                tag_temp.push(param[i]);
            }
        }


        { (param[0] != 'null' && (param[0] * 1) >= 0) ? this.state.minminute = param[0] * 1 : this.state.minminute = -1};
        { (param[1] != 'null' && (param[1] * 1) <= 9999) ? this.state.maxminute = param[1] * 1 : this.state.maxminute = 10000};
        { (param[2] != 'null') ? this.state.level = param[2] : this.state.level = null};
        this.state.tags = tag_temp;

        if (this.state.minminute > this.state.maxminute){
            var timetmp = this.state.minminute;
            this.state.minminute = this.state.maxminute;
            this.state.maxminute = timetmp;
        }

        var ref = firebase.database().ref().child('routine');
        var keys = [];
        var data = [];
        ref.once('value', snap=>{
            var val = snap.val();
            if (val != null & this._isMounted){
                for (var key in val){
                    keys.push(key);
                    data.push(val[key]);
                }
            }
        })

        var temp = [];
        for (var i = 0 ; i < keys.length ; i++){
            var _time = data[i].tag.time * 1;
            if (this.state.minminute <= _time && this.state.maxminute >= _time){
                temp.push(keys[i]);
            }
        }

        var temp2 = [];
        if (this.state.level != null){
            for (var i = 0 ; i < keys.length ; i++){
                if (temp.includes(keys[i])){
                    var _level = data[i].tag.level;
                    if (this.state.level === _level){
                        temp2.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp.includes(keys[i])){
                    temp2.push(keys[i]);
                }
            }
        }


        
        for (var j = 0 ; j < this.state.tags.length ; j++ ){
            var temp = [];
            var target = this.state.tags[j];
            for (var i = 0; i < keys.length ; i++){
                if (temp2.includes(keys[i])){
                    if (data[i].tag.tag.includes(target))
                        temp.push(keys[i]);
                }
            }

            var temp2 = [];
            for (var i = 0; i < temp.length ; i++){
                temp2.push(temp[i]);
            }
        }
        
        this.setState({
            results: temp2
        })
    }


    render () {
        return (
            <div>
                <h5 className="mb-3">Routine Search Result</h5>
                { this.state.results.length > 0 ?
                    <div>
                        <Row>
                            {this.state.results.map((key, index) => {
                                return(
                                    <Col sm={6} lg={4}>
                                        <Projects props={key} detail={false} />
                                    </Col>
                                )})}
                        </Row>
                    </div>
                :
                    <CardTitle>Sorry, there were no matches for your search.</CardTitle>
                }
            </div>
        )
    }
}

export default Queried;