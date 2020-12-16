import React, {useState} from 'react';
import ReactDOM, { render } from 'react-dom'
import firebase from 'firebase';
import { SalesSummary, Projects, Feeds, SocialCards } from '../../components/dashboard-components';
import {useTranslation} from 'react-i18next';

import
 {
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
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    timeoutsShape,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';import { Route, Link } from 'react-router-dom';
import classnames from 'classnames';
import StepRangeSlider from 'react-step-range-slider';
import { Radar } from "react-chartjs-2";
import Review_List from './review.jsx';

const options = {
    legend: {
        display: false,
        position: "bottom",
        boxWidth: 10,
        fontSize: 10,
        fontColor: 'rgb(255, 99, 132)',
    },
    scale: {
        reverse: false,
        gridLines: {
            color: ['black']
        },
        ticks: {
            max: 5,
            min: 0,
            stepSize: 1
        },
        pointLabels:{
            fontFamily: 'Poppins',
            fontSize: 10,
            fontColor: '#67757c'
        }
    },
    responsive: true,
    
    layout: {
        padding: {
            top: 0,
            left: 15,
            right: 15,
            bottom: 0
        }
    }
}

const Data = (rate) => {
    const { t, i18n } = useTranslation();
    //var label1 = t("Difficulty well set?");
    return {
    labels: [
        t("Difficulty well set?"),
        t("Was routine new?"),
        t("Was it effective?"),
        t("Post well written?"),
        t("Suggestable?"),
    ],
   /*
   labels: [
        "Difficulty well set?",
        "Was routine new?",
        "Was it effective?",
        "Post well written?",
        "Suggestable?",
    ], 
    */ 
    datasets: [
        {
            label: "My Rating",
            //if my review exists
            pointBackgroundColor: "rgba(0, 0, 0, 1)",
            borderColor: "rgba(0, 0, 0, 1)",
            //my data
            data : rate
        },
        /*
        {
            label: "Overall Rating",
            backgroundColor: "rgba(220, 220, 220, 0.5)",
            pointBackgroundColor: "rgba(220, 220, 220, 1)",
            //data from the firebase?
            data: props.overall
        }
        */
    ]
    }
}

const OnClickHandler = (props) => {
    //props={this.props} refRoot={refRoot} comment={this.state.comment} suggestion={this.state.suggestion} editable={true}
    const { t, i18n } = useTranslation();
    var ref_root = props.refRoot;
    var user = firebase.auth().currentUser;
    console.log(user);
    /*
    if(user == null){
        alert('To leave a review, login first!');
        return;
    }
    */
    var ref = ref_root.child('review');
    var comment = document.getElementById("text_comment").value;
    var suggestion = document.getElementById("text_suggestion").value;
    if(comment.length == 0 && suggestion.length == 0){
        alert(t('Write review before submit'));
        return;
    }
    //var name = document.getElementById("input-name").value;
    var name = "";
    if (user != null){
        name = user.displayName;
    }   
    else{
        name = "non login user";
    }
    var rate = document.getElementById("input-rate").value;
    //update total average rate
    var ref_avg = ref_root.child('rating');
    var total_avg_rating = rate.split(',').map(i=>parseInt(i, 10)).reduce((a,v) =>  a = a + v , 0 )/5;
    var rating_num = 1;
    ref.on('value', snap => {
        var val = snap.val();
        if(val!=null){
            var keys = [];
            var datas = [];
            for(var key in val){
                rating_num+=1;
                let temp = val[key].rate;
                temp = temp.split(',').map(i=>parseInt(i, 10)).reduce((a,v) =>  a = a + v , 0 );
                total_avg_rating+=temp/5;
            }
        }
    })
    console.log(total_avg_rating);
    console.log(rating_num);
    ref_avg.set(total_avg_rating/rating_num);
    //need to get user name somehow
    var total = {
        name : name,
        rate : rate,
        comment : {
            dislike : 0,
            like : 0,
            text : comment
        },
        suggestion : {
            dislike : 0,
            like : 0,
            text : suggestion
        }
    };
    if(!props.is_edit){
        let ref_temp = ref.push();
        ref_temp.set(total);
    }
    else{
        let ref_temp = ref.child(props.rev_key);
        ref_temp.set(total);
        //replace the review
    }
    props.props.history.replace('/reviewRead/'+props.props.match.params.key+'/'+props.props.match.params.my);
    //close this review page
};

const OnClickReportHandler = (rout_key, rev_key) => {
    var user = firebase.auth().currentUser;
    const { t, i18n } = useTranslation();
    if(user == null){
        alert(t('To report, login first!'));
        return;
    }
    console.log('reporthandler');
    var ref = firebase.database().ref().child('report');
    let temp = ref.push();
    temp.set({routine: rout_key, review: rev_key});
}   

const onClickDeleteHandler = (key, rootKey) => {
    var ref_root = firebase.database().ref().child('routine').child(rootKey).child('review').child(key);
    console.log('deletehandler');
    ref_root.remove();
}

//need toggle?
/*
const onClickLikeHandler = (isComment,isLike,key, rootKey) => {
    var user = firebase.auth().currentUser;
    const { t, i18n } = useTranslation();
    if(user == null){
        if(isLike){
            alert(t('To leave a dislike, login first!'));
        }
        else{
            alert(t('To leave a like, login first!'));
        }
        return;
    }
    //check like/dislike list 
    var ref_root = firebase.database().ref().child('routine').child(rootKey).child('review').child(key);
    if(isComment){
        let ref = isLike ? ref_root.child('comment').child('like') : ref_root.child('comment').child('dislike'); 
        var val; 
        ref.on('value', snap => {
            val = snap.val();
        })
        console.log(val);
        ref.set(val+1);
    }else{
        let ref = isLike ? ref_root.child('suggestion').child('like') : ref_root.child('suggestion').child('dislike');
        var val;
        ref.on('value', snap => {
            val = snap.val();
        })
        console.log(val);
        ref.set(val+1);
    }
}
*/
class ButtonToggle extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isComment: this.props.isComment,
        keyval: this.props.keyval,
        likePressed : false,
        dislikePressed : false,
      }
      this.onClickLikeHandler = this.onClickLikeHandler.bind(this);
      this.render1 = this.render1.bind(this);
    }
    
    onClickLikeHandler = (isLike) => {
        const { t, i18n } = useTranslation();
        var user = firebase.auth().currentUser;
        if(user == null){
            if(isLike){
                alert(t('To leave a dislike, login first!'));
            }
            else{
                alert(t('To leave a like, login first!'));
            }
            return;
        }
        
        //check like/dislike list 
        var ref_root = firebase.database().ref().child('routine').child(this.props.rootKey).child('review').child(this.state.keyval);
        var ref_like;
        var ref_dislike;
        if(this.state.isComment){
            ref_like = ref_root.child('comment').child('like') 
            ref_dislike = ref_root.child('comment').child('dislike'); 
        }else{
            ref_like = ref_root.child('suggestion').child('like')
            ref_dislike = ref_root.child('suggestion').child('dislike');
        }
        /*var ref_pressed = firebase.database().ref().child('userinfo').child(this.state.userid).child('-MMZTiR3gBd4Fwd1i2cP').child(''); //need review key
        if this.isComment 
        */
        if(isLike){
            if(this.state.likePressed){
                //-1 0
                var val; 
                ref_like.on('value', snap => {
                    val = snap.val();
                })
                ref_like.set(val-1);
                this.setState({likePressed : false, dislikePressed : false});
                //remove from firebase
                //ref_pressed.remove()
            }else{
                if(this.state.dislikePressed){
                    // +1 -1
                    var val; 
                    ref_like.on('value', snap => {
                        val = snap.val();
                    })
                    ref_like.set(val+1);
                    ref_dislike.on('value', snap => {
                        val = snap.val();
                    })
                    ref_dislike.set(val-1);
                }else{
                    // +1 0
                    var val; 
                    ref_like.on('value', snap => {
                        val = snap.val();
                    })
                    ref_like.set(val+1);
                }
                this.setState({likePressed : true, dislikePressed : false});
                //add to firebase
                //ref_pressed.set({likePressed : true, dislikePressed : false});
            }
        }else{
            if(this.state.dislikePressed){
                //0 -1
                var val; 
                ref_dislike.on('value', snap => {
                    val = snap.val();
                })
                ref_dislike.set(val-1);
                this.setState({likePressed : false, dislikePressed : false});
                //remove from firebase
                //ref_pressed.remove()
            }else{
                if(this.state.likePressed){
                    //-1 +1
                    var val; 
                    ref_like.on('value', snap => {
                        val = snap.val();
                    })
                    ref_like.set(val-1);
                    ref_dislike.on('value', snap => {
                        val = snap.val();
                    })
                    ref_dislike.set(val+1);
                }else{
                    //0 +1
                    var val; 
                    ref_dislike.on('value', snap => {
                        val = snap.val();
                    })
                    ref_dislike.set(val+1);
                    //add to firebase
                    //ref_pressed.set({slikePressed : false});
                }
                this.setState({likePressed : false, dislikePressed : true});
            }
        }
    }
    render(){
        return(<this.render1/>);
    }

    render1() {
        const { t, i18n } = useTranslation();
        var like_bg = this.state.likePressed ? "blue" : "";
        var dislike_bg = this.state.dislikePressed ? "red" : "";
        return (
            <div>
                <Button style={{backgroundColor: like_bg}} onClick={()=>this.onClickLikeHandler(true, this.props.rootKey)}>{t('like')} {this.props.likeval}</Button>
                <Button style={{backgroundColor: dislike_bg}} onClick={()=>this.onClickLikeHandler(false, this.props.rootKey)}>{t('dislike')} {-1*this.props.dislikeval}</Button>
            </div>
        );
    }
  }

const ReviewDisptab = (props) => {
    //var key = document.getElementById('input-key').value;
    console.log(props.keyval);
    console.log(props.comment.length);
    console.log(props.suggestion.length);
    console.log(props.sortop);
    return (
        <div className="ml-3 mr-3">
            {   
                props.sortop != 2 && props.comment.length>0? (
            <div>
            <h5 className="mb-3">Comment</h5>
            <div className="input-group">
                <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} value={props.comment} readOnly></textarea>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <ButtonToggle likeval={props.clike} dislikeval={props.cdislike} keyval={props.keyval} isComment={true} rootKey={props.rout_key}/>
                        <Button onClick={()=>OnClickReportHandler(props.rout_key,props.keyval)}>report</Button>
                    </span>
                </div>
            </div>
            </div>
            ) : <div></div>
            }
            {
                props.sortop != 1 && props.suggestion.length>0? (
            <div>
            <h5 className="mb-3">Suggestion</h5>
            <div className="input-group">
                <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} value={props.suggestion} readOnly></textarea>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <ButtonToggle likeval={props.slike} dislikeval={props.sdislike} keyval={props.keyval} isComment={false} rootKey={props.rout_key}/>
                        <Button onClick={()=>OnClickReportHandler(props.rout_key,props.keyval)}>report</Button>
                    </span>
                </div>
            </div>
            </div>
                ) : <div></div>
            }
            <CardBody>
            </CardBody>
        </div>
    )
}

const Reviewtab = (props) => {
    const [activeTab, setActiveTab] = useState('1');
  
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }
    const { t, i18n } = useTranslation();
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              {t('Comments')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              {t('Suggestions')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
                <Col sm="12">
                <div>
                    <label for="comment">{t('Write your comment')}: </label>
                </div>
                {
                    props.editable ? (
                        <div className="input-group">
                            <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} defaultValue={props.comment}></textarea>
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">
                                    <a onClick={() => OnClickHandler(props)}>{t('Submit')}</a>
                                </span>
                            </div>
                        </div>
                    )
                    : (
                        <div className="input-group">
                            <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} defaultValue={props.comment} readOnly></textarea>
                        </div>
                    )
                }
                </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
                <Col sm="12">
                <div>
                    <label for="suggestion">{t('Write your suggestion')}: </label>
                </div>
                {
                    props.editable ? (
                        <div className="input-group">
                            <textarea className="form-control" id="text_suggestion" rows="5" style={{resize: 'none'}} defaultValue={props.suggestion}></textarea>
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">
                                    <a onClick={() => OnClickHandler(props)}>{t('Submit')}</a>
                                </span> 
                            </div>
                        </div>
                    )
                    : (
                        <div className="input-group">
                            <textarea className="form-control" id="text_suggestion" rows="5" style={{resize: 'none'}} defaultValue={props.suggestion} readOnly></textarea>
                        </div>
                    )
                }
                </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  };

  //only the review writing part
  class ReviewWrite extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        var temp_rating = [3,3,3,3,3];
        var temp_comment = '';
        var temp_suggestion = '';
        var temp_is_edit = false;
        var temp_rev_key = null;
        console.log(this.props.location);
        if (this.props.location.state != null){
            temp_rating = this.props.location.state.rate.map(i=>parseInt(i));
            temp_comment = this.props.location.state.comment;
            temp_suggestion = this.props.location.state.suggestion;
            temp_is_edit = this.props.location.state.is_edit;
            temp_rev_key = this.props.location.state.rev_key;
        }
        this.state = {
            name : '',
            //rate : temp_rating,
            rate : [3,3,3,3,3],
            comment : temp_comment,
            suggestion : temp_suggestion,
            refRoot : null,
            is_edit : temp_is_edit,
            rev_key : temp_rev_key,
        };
        console.log(temp_rating);
        this.reference = {};
        console.log(this.state);
        this.render1 = this.render1.bind(this);
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
        var user = firebase.auth().currentUser;
        console.log('user', user);
        if(user!=null){
            this.state.name = user.displayName;
        }else{
            this.state.name = "non login user";
        }
        this.state.refRoot = firebase.database().ref().child('routine').child(this.props.match.params.key);
        /*
        var ref = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP').child('review');
        ref.on('value', snap => {
            var val = snap.val();
            console.log(val);
            if(val != null & this._isMounted){
                for (var key in val){
                    this.setState({
                        comment : val
                    });
                }
            }
        })
        */
    }

    render1(){
        var refRoot = firebase.database().ref().child('routine').child(this.props.match.params.key);
        const { t, i18n } = useTranslation();
        return (
        <div>
            <Row>
                <Col xs='12' md='12'>
                    <Projects props={this.props.match.params.key} detail={true} my={this.props.match.params.my}/>
                </Col>
            
            <Col xs='12' md='12'>
            {/* --------------------------------------------------------------------------------*/}
            {/* Row*/}
            {/* --------------------------------------------------------------------------------*/}
            <h5 className="mb-3">{t('Write your own review')}</h5>
            <Card>
            <Row>
                <Col xs="6" md="4">
                    {/* --------------------------------------------------------------------------------*/}
                    {/* Card-1*/}
                    {/* --------------------------------------------------------------------------------*/}
                    <CardBody>
                    <CardTitle>{t('Rating')}</CardTitle>
                    <Radar className="graph" id="radar-graph" data={Data(this.state.rate)} options={options} ref={(reference) => {this.reference = reference}}/>
                    </CardBody>
                </Col>
                <Col xs="6" md="3">
                    <CardBody>
                    <input
                        id="input-rate"
                        value={this.state.rate}
                        style={{display:'none'}}
                    />
                    <input
                        id="input-avgrate"
                        value={this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length}
                        style={{display:'none'}}
                    />
                    
                    {/*style={{border: 3, float: 'left', height: 'auto', width: 'auto'}}?*/}
                    <div>
                    <text className='slider-text pull-right'>{t('Yes')}</text>
                    <text className='slider-text pull-right mr-6'>{t('No')}</text>
                   
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>{t('Difficulty well set?')}</text>
                        <StepRangeSlider className='slider-slider' value={this.state.rate[0]} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[0]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>{t('Was routine new?')}</text>
                        <StepRangeSlider className='slider-slider' value={this.state.rate[1]} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[1]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>{t('Was it effective?')}</text>
                        <StepRangeSlider className='slider-slider' value={this.state.rate[2]} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[2]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>{t('Post well written?')}</text>
                        <StepRangeSlider className='slider-slider' value={this.state.rate[3]} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[3]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>{t('Suggestable?')}</text>
                        <StepRangeSlider className='slider-slider' value={this.state.rate[4]} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[4]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    </CardBody>
                </Col>
                <Col xs="12" md="5">
                    <CardBody>
                        <div>
                            <input id="input-name" value={this.state.name} style={{display:"none"}}/>
                            <span><CardTitle id="username">{this.state.name}</CardTitle></span>
                        </div>
                        <Reviewtab props={this.props} refRoot={refRoot} comment={this.state.comment} suggestion={this.state.suggestion} editable={true} is_edit={this.state.is_edit} rev_key={this.state.rev_key}/>
                    </CardBody>
                </Col>
            </Row>
            </Card>
            </Col>
            </Row>
        </div>
    );
    }
    render(){
        return(<this.render1/>);
    }
}

export default ReviewWrite;