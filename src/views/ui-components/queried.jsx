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
    Table,
    Badge
} from 'reactstrap';

import firebase from 'firebase';
import { Projects } from '../../components/dashboard-components';
import leg from '../../assets/images/leg.png';
import arm from '../../assets/images/arm.png';
import abdominal from '../../assets/images/abdominal.png';
import shoulder from '../../assets/images/shoulder.png';
import back from '../../assets/images/back.png';
import chest from '../../assets/images/chest.png';
import { useTranslation } from 'react-i18next'

class BadgeList extends React.Component{
    constructor(props) {
        super(props);
        this.render1 = this.render1.bind(this);
    }

    render1 () {
        const { t, i18n } = useTranslation();
        return(
            <div class=''>
                {this.props.query_tag.map((key, index) => {
                    return(
                        <Badge tag={key} className="mx-1" color="info" pill >
                            <i className="mdi mdi-dots-horizontal" /> {t(key)}
                        </Badge>
                    )
                })}
            </div>
        )
    }

    render () {
        return (<this.render1/>);
    }
}


class BodyList extends React.Component{
    constructor(props) {
        super(props);
        this.render1 = this.render1.bind(this);
    }

    render1 () {
        const { t, i18n } = useTranslation();
        return(
            <div class=''>
                {this.props.query_tag.map((key, index) => {
                    
                        var bodyimg;
                        if(key == 'arm') bodyimg = arm;
                        if(key == 'shoulder') bodyimg = shoulder;
                        if(key == 'back') bodyimg = back;
                        if(key == 'chest') bodyimg = chest;
                        if(key == 'abdominal') bodyimg = abdominal;
                        if(key == 'leg') bodyimg = leg;
                        return(
                        <Badge className="mx-1" tag={key} color="danger" pill>
                            <img height="13px" src={bodyimg}/> {t(key)}
                        </Badge>
                        )                    
                })}
            </div>
        )
    }

    render () {
        return ( <this.render1/>);
    }
}


class Queried extends React.Component{
    constructor(props){
        super(props);
        this.render1 = this.render1.bind(this);
        this._isMounted = false;
        this.state = {
            minminute: null,
            maxminute: null,
            level: null,
            tags: [],
            results: [],
            title_query: null,
            shoulder: false,
            arms: false,
            back: false,
            chest: false,
            abdominals: false,
            legs: false,
            bodypart: []
        }
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    componentDidMount () {
        this._isMounted = true;
        var param = window.location.href.split('/');
        param = param[param.length - 1].split('&');

        var tag_temp = []
        if (param.length > 10){
            for (var i = 10 ; i < param.length ; i++){
                tag_temp.push(param[i]);
            }
        }

        // Mintime parameter
        { (param[0] != 'null' && (param[0] * 1) >= 0) ? this.state.minminute = param[0] * 1 : this.state.minminute = -1};
        // Maxtime parameter
        { (param[1] != 'null' && (param[1] * 1) <= 9999) ? this.state.maxminute = param[1] * 1 : this.state.maxminute = 10000};
        // Lelvel parameter
        { (param[2] != 'null') ? this.state.level = param[2] : this.state.level = null};
        // Title parameter
        { (param[3] === 'null' || param[3].length == 0) ? this.state.title_query = null : this.state.title_query = param[3].replace('%20', ' ').toLowerCase()};
        // Bodypart parameter
        { (param[4] === 'true') ? this.state.shoulder = true : this.state.shoulder = false};
        { (param[5] === 'true') ? this.state.arms = true : this.state.arms = false};
        { (param[6] === 'true') ? this.state.back = true : this.state.back = false};
        { (param[7] === 'true') ? this.state.abdominals = true : this.state.abdominals = false};
        { (param[8] === 'true') ? this.state.chest = true : this.state.chest = false};
        { (param[9] === 'true') ? this.state.legs = true : this.state.legs = false};


        this.state.tags = tag_temp;


        // Time query reverse (if mintime > maxtime)
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
        
        // Time Query
        var temp = [];
        for (var i = 0 ; i < keys.length ; i++){
            var _time = data[i].tag.time * 1;
            if (this.state.minminute <= _time && this.state.maxminute >= _time){
                temp.push(keys[i]);
            }
        }

        // Level Query
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

        // Tag Query
        for (var j = 0 ; j < this.state.tags.length ; j++ ){
            var temp = [];
            var target = this.state.tags[j].toLowerCase();
            for (var i = 0; i < keys.length ; i++){
                if (temp2.includes(keys[i])){
                    var compare_target = data[i].tag.tag;
                    compare_target = compare_target.toString().toLowerCase();
                    if (compare_target.includes(target))
                        temp.push(keys[i]);
                }
            }

            var temp2 = [];
            for (var i = 0; i < temp.length ; i++){
                temp2.push(temp[i]);
            }
        }
        

        // Title Query
        var temp3 = [];
        if (this.state.title_query != null){
            for (var i = 0 ; i < keys.length ; i++){
                if (temp2.includes(keys[i])){
                    var _title = data[i].title.toLowerCase();
                    if (_title.includes(this.state.title_query)){
                        temp3.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp2.includes(keys[i])){
                    temp3.push(keys[i]);
                }
            }
        }
        
        // Bodypart Query
        //      Shoulder
        var temp4 = [];
        if (this.state.shoulder){
            this.state.bodypart.push('shoulder');
            for (var i = 0 ; i < keys.length ; i++){
                if (temp3.includes(keys[i])){
                    var _check = data[i].tag.bodypart['shoulder'];
                    if (_check){
                        temp4.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp3.includes(keys[i])){
                    temp4.push(keys[i]);
                }
            }
        }

        //      Arms
        var temp3 = [];
        if (this.state.arms){
            this.state.bodypart.push('arm');
            for (var i = 0 ; i < keys.length ; i++){
                if (temp4.includes(keys[i])){
                    var _check = data[i].tag.bodypart['arm'];
                    if (_check){
                        temp3.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp4.includes(keys[i])){
                    temp3.push(keys[i]);
                }
            }
        }
        
        //      Back
        var temp4 = [];
        if (this.state.back){
            this.state.bodypart.push('back');
            for (var i = 0 ; i < keys.length ; i++){
                if (temp3.includes(keys[i])){
                    var _check = data[i].tag.bodypart['back'];
                    if (_check){
                        temp4.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp3.includes(keys[i])){
                    temp4.push(keys[i]);
                }
            }
        }

        //      Abdominal
        var temp3 = [];
        if (this.state.abdominals){
            this.state.bodypart.push('abdominal');
            for (var i = 0 ; i < keys.length ; i++){
                if (temp4.includes(keys[i])){
                    var _check = data[i].tag.bodypart['abdominal'];
                    if (_check){
                        temp3.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp4.includes(keys[i])){
                    temp3.push(keys[i]);
                }
            }
        }

        //      Chest
        var temp4 = [];
        if (this.state.chest){
            this.state.bodypart.push('chest');
            for (var i = 0 ; i < keys.length ; i++){
                if (temp3.includes(keys[i])){
                    var _check = data[i].tag.bodypart['chest'];
                    if (_check){
                        temp4.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp3.includes(keys[i])){
                    temp4.push(keys[i]);
                }
            }
        }

        //      Legs
        var temp3 = [];
        if (this.state.legs){
            this.state.bodypart.push('leg');
            for (var i = 0 ; i < keys.length ; i++){
                if (temp4.includes(keys[i])){
                    var _check = data[i].tag.bodypart['leg'];
                    if (_check){
                        temp3.push(keys[i]);
                    }
                }
            }
        }else{
            for (var i = 0 ; i < keys.length ; i++){
                if (temp4.includes(keys[i])){
                    temp3.push(keys[i]);
                }
            }
        }

        this.setState({
            results: temp3
        })

    }


    render1 () {
        const { t, i18n } = useTranslation();
        return (
            <div>
                <CardTitle>{t('Routine Search Result')}</CardTitle>
                <CardTitle>{t('Filtering')}</CardTitle>
                <div className = 'd-flex'>
                { this.state.title_query != null ?
                    <ul className='d-flex'>{t('queried_title1') + this.state.title_query + t('queried_title2')}</ul>
                :
                    null
                }
                { this.state.minminute >= 1 && this.state.maxminute <= 9999 ?
                    <ul className='d-flex'>{t('queried_time1_1') + this.state.minminute + t('queried_time1_2') + this.state.maxminute + t('queried_time1_3')}</ul>
                :
                    null
                }
                { this.state.minminute >= 1 && this.state.maxminute > 9999 ?
                    <ul className='d-flex'>{t('queried_time2_1') + this.state.minminute + t('queried_time2_2')}</ul>
                :
                    null
                }
                { this.state.minminute < 1 && this.state.maxminute <= 9999 ?
                    <ul className='d-flex'>{t('queried_time3_1') + this.state.maxminute + t('queried_time3_2')}</ul>
                :
                    null
                }
                { this.state.level != null ?
                    <ul className='d-flex ml-1'>{t('queried_level') + t(this.state.level)}</ul>
                :
                    null
                }
                { this.state.tags.length > 0 ?
                    <div className='d-flex'>
                        <ul className='ml-1'>{t('queried_tag')}</ul>
                        <BadgeList color="info" query_tag={this.state.tags} />
                    </div>
                :
                    null
                }
                { this.state.bodypart.length > 0 ?
                    <div className='d-flex'>
                        <ul className='ml-1'>{t('queried_bodypart')}</ul>
                        <BodyList color="warning" query_tag={this.state.bodypart} />
                    </div>
                :
                    null
                }
                </div>
                <CardTitle>{t('Result')}</CardTitle>
                <CardTitle></CardTitle>
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
                    <CardTitle>{t('search_sorry')}</CardTitle>
                }
            </div>
        )
    }

    render () {
        return (<this.render1/>);
    }
}

export default Queried;