import React, {useState} from 'react';
import ReactDOM, { render } from 'react-dom'
import { Route, Link } from 'react-router-dom';
import firebase from 'firebase';
import { SalesSummary, Projects, Feeds, SocialCards } from '../../components/dashboard-components';
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
    Tooltip
} from 'reactstrap';
import classnames from 'classnames';
import StepRangeSlider from 'react-step-range-slider';
import img1 from '../../assets/images/users/1.jpg';
import img2 from '../../assets/images/users/2.jpg';
import img3 from '../../assets/images/users/3.jpg';
import img4 from '../../assets/images/users/4.jpg';
import img5 from '../../assets/images/users/5.jpg';
import img6 from '../../assets/images/users/6.jpg';
import { Radar } from "react-chartjs-2";
import { useTranslation } from 'react-i18next';
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
    return {
    labels: [
        t("Difficulty well set?"),
        t("Was routine new?"),
        t("Was it effective?"),
        t("Post well written?"),
        t("Suggestable?"),
    ],
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

const OnClickHandler = (ref_root) => {
    //const { t, i18n } = useTranslation();
    var user = firebase.auth().currentUser;
    if(user == null){
        var temp = 'To leave a review, login first!';
        alert(temp);
        return;
    }

    var ref = ref_root.child('review');
    var comment = document.getElementById("text_comment").value;
    var suggestion = document.getElementById("text_suggestion").value;
    if(comment.length == 0 && suggestion.length == 0){
        var temp = 'Write review before submit';
        alert(temp);
        return;
    }
    //var name = document.getElementById("input-name").value;
    var name = user.displayName;
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
    let ref_temp = ref.push();
    ref_temp.set(total);
    //close this review page
};

const OnClickReportHandler = (rout_key, rev_key) => {
    var user = firebase.auth().currentUser;
    //const { t, i18n } = useTranslation();
    if(user == null){
        alert('To report, login first!');
        return;
    }
    alert('Reported. We will check it right away!');
    var ref = firebase.database().ref().child('report');
    let temp = ref.push();
    temp.set({routine: rout_key, review: rev_key});
}   

const onClickDeleteHandler = (key, rootKey) => {
    alert('The review is deleted');
    var ref_root = firebase.database().ref().child('routine').child(rootKey).child('review').child(key);
    
    ref_root.remove();
}

//need toggle?
const onClickLikeHandler = (isComment,isLike,key, rootKey) => {
    var user = firebase.auth().currentUser;
    if(user == null){
        if(isLike){
            alert('To leave a like, login first!');
        }
        else{
            alert('To leave a dislike, login first!');
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
        
        ref.set(val+1);
    }else{
        let ref = isLike ? ref_root.child('suggestion').child('like') : ref_root.child('suggestion').child('dislike');
        var val;
        ref.on('value', snap => {
            val = snap.val();
        })
        ref.set(val+1);
    }
}

class ButtonToggle extends React.Component {
    constructor(props) {
      super(props);
      var temp_likePressed = false;
    var temp_dislikePressed = false;
       var user = firebase.auth().currentUser;
       
       var ref_pressed = null;
       
       if (user!=null){
           ref_pressed = firebase.database().ref().child('userinfo').child(user.displayName).child(this.props.keyval);
       } //need review key
        var ref_temp_press;
        if(ref_pressed != null){
            if(this.props.isComment){
                ref_temp_press = ref_pressed.child("comment");
            }else{
                ref_temp_press = ref_pressed.child("suggestion");
            }
        }
        if(ref_temp_press!=null){
            ref_temp_press.on('value',snap=>{
                var val = snap.val();
                if(val!=null){
                    //comment like pressed
                    temp_likePressed = val;
                    temp_dislikePressed = !temp_likePressed;
                }
            })
        }
        this.state = {
        isComment: this.props.isComment,
        keyval: this.props.keyval,
        likePressed : temp_likePressed,
        dislikePressed : temp_dislikePressed,
        userid : this.props.userid
      }
      this.render1 = this.render1.bind(this);
      this.onClickLikeHandler = this.onClickLikeHandler.bind(this);
    }
    
    onClickLikeHandler = (isLike) => {
        //const { t, i18n } = useTranslation();
        var user = firebase.auth().currentUser;
        if(user == null){
            if(isLike){
                alert('To leave a like, login first!');
            }
            else{
                alert('To leave a dislike, login first!');
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
        var user = firebase.auth().currentUser;
        var ref_pressed_root = null;
        if (user!=null){
           ref_pressed_root = firebase.database().ref().child('userinfo').child(user.displayName).child(this.props.keyval);
        } 
        var ref_pressed = null;
        if(ref_pressed_root != null)
            ref_pressed = this.state.isComment ? ref_pressed_root.child("comment") : ref_pressed_root.child("suggestion");
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
                if(ref_pressed!=null){
                    ref_pressed.remove()
                }
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
                ref_pressed.set(true)
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
                if(ref_pressed!=null){
                    ref_pressed.remove()
                }
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
                ref_pressed.set(false)
                this.setState({likePressed : false, dislikePressed : true});
            }
        }
    }

    componentDidUpdate(prevProps){
        console.log("button toggle did update");
        console.log(prevProps);
        console.log(this.props);
        console.log(this.state);
        var user = firebase.auth().currentUser;
        var ref_pressed = null;
        if (user!=null){
           ref_pressed = firebase.database().ref().child('userinfo').child(user.displayName).child(this.props.keyval);
        } //need review key
        var ref_temp_press;
        if(ref_pressed != null){
            if(this.props.isComment && ref_pressed != null){
                ref_temp_press = ref_pressed.child("comment");
            }else{
                ref_temp_press = ref_pressed.child("suggestion");
            }
        }
        if(prevProps !== this.props){
            if(ref_temp_press!=null){
                ref_temp_press.once('value').then(snap=>{
                    var val = snap.val();
                    console.log(val);
                    if(val!=null){
                        //comment like pressed
                        this.setState({ likePressed : val,
                        dislikePressed : !val, });
                    }else{
                        this.setState({ likePressed : false,
                        dislikePressed : false});
                    }
                })
            }
        }   
    }

    componentDidMount(){
        var user = firebase.auth().currentUser;
        var ref_pressed = null;
        if (user!=null){
           ref_pressed = firebase.database().ref().child('userinfo').child(user.displayName).child(this.props.keyval);
        } //need review key
        var ref_temp_press;
        if(ref_pressed != null){
        if(this.props.isComment && ref_pressed != null){
            ref_temp_press = ref_pressed.child("comment");
        }else{
            ref_temp_press = ref_pressed.child("suggestion");
        }}
        if(ref_temp_press!=null){
            ref_temp_press.on('value',snap=>{
                var val = snap.val();
                if(val!=null){
                    //comment like pressed
                    this.setState({ likePressed : val,
                    dislikePressed : !val, });
                }
            })
        }
    }

    render1() {
        var like_bg = this.state.likePressed ? "blue" : "";
        var dislike_bg = this.state.dislikePressed ? "red" : "";
        const { t, i18n } = useTranslation();
        return (
            <div>
                <a className="link mr-2" id="TooltipExample2"
                onClick={()=>this.onClickLikeHandler(true, this.props.rootKey)}
                style={{color: this.state.likePressed ? "blue" : ""}}>
                        <i className="mdi mdi-emoticon" />{this.props.likeval}
                    </a>
                    <Tooltip
                        placement="top"
                        isOpen={this.props.tooltipOpen2}
                        target="TooltipExample2"
                        toggle={this.props.toggle2}
                    >{t('Like')}</Tooltip>
                <a className="link mr-2" id="TooltipExample3"
                    onClick={()=>this.onClickLikeHandler(false, this.props.rootKey)}
                    style={{color: this.state.dislikePressed ? "red" : ""}}>
                            <i className="mdi mdi-emoticon-sad" />{-1*this.props.dislikeval}
                        </a>
                        <Tooltip
                            placement="top"
                            isOpen={this.props.tooltipOpen3}
                            target="TooltipExample3"
                            toggle={this.props.toggle3}
                        >{t('DisLike')}</Tooltip>
                </div>
        );
    }
    render(){
        return(<this.render1/>);
    } 
  }

const ReviewDisptab = (props) => {
    //var key = document.getElementById('input-key').value;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipOpen2, setTooltipOpen2] = useState(false);
    const [tooltipOpen3, setTooltipOpen3] = useState(false);
    const toggle = () => {
        setTooltipOpen(!tooltipOpen);
    }

    const toggle2 = () => {
        setTooltipOpen2(!tooltipOpen2);
    }

    const toggle3 = () => {
        setTooltipOpen3(!tooltipOpen3);
    }
    const { t, i18n } = useTranslation();
    return (
        <div className="ml-3 mr-3 align-items-center d-flex">
            {   
                props.sortop != 2 && props.comment.length>0? (
            
            
            <div className="input-group">
            <h5 className="mb-3">{t('Comment')}</h5>
                <textarea className="form-control" id="text_comment" rows="8" style={{resize: 'none'}} value={props.comment} readOnly></textarea>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <ButtonToggle 
                        tooltipOpen2={tooltipOpen2} toggle2={toggle2.bind(null)}
                        tooltipOpen3={tooltipOpen3} toggle3={toggle3.bind(null)}
                        likeval={props.clike} dislikeval={props.cdislike} keyval={props.keyval} isComment={true} rootKey={props.rout_key} userid={props.userid}/>
                        <a className="link mr-2" id="TooltipExample"
                         onClick={()=>OnClickReportHandler(props.rout_key,props.keyval)}>
                                    <i className="mdi mdi-alert-circle" />
                                </a>
                                <Tooltip
                                    placement="top"
                                    isOpen={tooltipOpen}
                                    target="TooltipExample"
                                    toggle={toggle.bind(null)}
                                >
                                    {t('Report')}
                        </Tooltip>
                    </span>
                </div>
            </div>
            ) : <div></div>
            }
            {
                props.sortop != 1 && props.suggestion.length>0? (
            
            <div className="input-group ml-5">
            <h5 className="mb-3">{t('Suggestion')}</h5>
                <textarea className="form-control" id="text_comment" rows="8" style={{resize: 'none'}} value={props.suggestion} readOnly></textarea>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                    <ButtonToggle 
                        tooltipOpen2={tooltipOpen2} toggle2={toggle2.bind(null)}
                        tooltipOpen3={tooltipOpen3} toggle3={toggle3.bind(null)}
                        likeval={props.slike} dislikeval={props.sdislike} keyval={props.keyval} isComment={false} rootKey={props.rout_key} userid={props.userid}/>
                        <a className="link mr-2" id="TooltipExample"
                         onClick={()=>OnClickReportHandler(props.rout_key,props.keyval)}>
                                    <i className="mdi mdi-alert-circle" />
                                </a>
                                <Tooltip
                                    placement="top"
                                    isOpen={tooltipOpen}
                                    target="TooltipExample"
                                    toggle={toggle.bind(null)}
                                >
                                    {t('Report')}
                        </Tooltip>
                    </span>
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
                                    <Button onClick={OnClickHandler}>{t('submit')}</Button>
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
                                    <Button onClick={OnClickHandler(props.refRoot)}>{t('submit')}</Button>
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
  class Review_Write extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            name : 'user',
            rate : [1,1,1,1,1],
            comment : '',
            suggestion : '',
            refRoot : null,
            userid : '',
        }
        this.reference = {};
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
        var user = firebase.auth().currentUser;
        if(user){
            this.state.name = user.displayName;
            this.state.userid = user.uid;
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
    
    render(){
        var refRoot = firebase.database().ref().child('routine').child(this.props.match.params.key);
        return (
            <div>
            {/* --------------------------------------------------------------------------------*/}
            {/* Row*/}
            {/* --------------------------------------------------------------------------------*/}
            <h5 className="mb-3">Write your own review</h5>
            <Card>
            <Row>
                <Col xs="12" md="4">
                    {/* --------------------------------------------------------------------------------*/}
                    {/* Card-1*/}
                    {/* --------------------------------------------------------------------------------*/}
                    <CardBody>
                    <CardTitle>Rating</CardTitle>
                    <Radar className="graph" id="radar-graph" data={Data(this.state.rate)} options={options} ref={(reference) => {this.reference = reference}}/>
                    </CardBody>
                </Col>
                <Col xs="12" md="2">
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
                    <div className='slider'>
                        <text className='slider-text'>Difficulty well set?</text>
                        <StepRangeSlider className='slider-slider' value={1} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[0]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>Was routine new?</text>
                        <StepRangeSlider className='slider-slider' value={1} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[1]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>Was it effective?</text>
                        <StepRangeSlider className='slider-slider' value={1} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[2]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>Post well written?</text>
                        <StepRangeSlider className='slider-slider' value={1} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[3]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    <div className='slider'>
                        <text className='slider-text'>Suggestable?</text>
                        <StepRangeSlider className='slider-slider' value={1} range={[{value: 1, step:1},{value: 5}]} onChange={value => {this.state.rate[4]=value; document.getElementById('input-rate').value = this.state.rate; document.getElementById('input-avgrate').value = this.state.rate.reduce(function(a, b){
                            return a + b;})/this.state.rate.length; let Chart = this.reference.chartInstance; Chart.update();}}/>
                    </div>
                    </CardBody>
                </Col>
                <Col xs="12" md="6">
                    <CardBody>
                        <div>
                            <input id="input-name" value={this.state.name} style={{display:"none"}}/>
                            <span><CardTitle id="username">{this.state.name}</CardTitle></span>
                        </div>
                        <Reviewtab refRoot={refRoot} comment={this.state.comment} suggestion={this.state.suggestion} editable={true} userid={this.state.userid}/>
                    </CardBody>
                </Col>
            </Row>
            </Card>
        </div>
    );
}
}

class AuthorReply extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false; 
        //get reply from firebase, review -> reviewuuid -> reply  
        //edit_flag = 1, means edit mode
        //if there's reply it's just showing or just write reply sign
        this.state = {
            edit_flag : this.props.edit_flag,
            reply : this.props.reply,
            isAuthor : this.props.isAuthor,
        }
        this.writeReplyHandler = this.writeReplyHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.render1 = this.render1.bind(this);
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    componentDidMount(){
        console.log("didmount");
        this._isMounted = true;
        var ref = firebase.database().ref().child('routine').child(this.props.rootKey).child('review').child(this.props.keyval).child('reply');
        var val;
        ref.on('value',snap => {
            var val = snap.val();
            if(val!=null & this._isMounted){
                this.setState({reply : val});
            }
        });
    }
    deleteHandler = () => {
        //const { t, i18n } = useTranslation();
        var ref = firebase.database().ref().child('routine').child(this.props.rootKey).child('review').child(this.props.keyval).child('reply');
        ref.remove();
        this.setState({edit_flag : false, reply : ""})
        alert('reply deleted');
    }
    writeReplyHandler = () => {
        this.setState({edit_flag : true});
        console.log(this.state.edit_flag);
    }
    cancelHandler = () => {
        this.setState({edit_flag : false});
    }
    submitHandler = () => {
        const { t, i18n } = useTranslation();
        var ref = firebase.database().ref().child('routine').child(this.props.rootKey).child('review').child(this.props.keyval);
        var reply = document.getElementById("text_reply").value;
        console.log(reply);
        if(reply.length == 0){
            alert('Write reply before submit');
            return;
        }
        ref.child('reply').set(reply);
        this.setState({edit_flag : false});
    }

    render1(){
        console.log("render triggered");
        /*
        if(this.state.reply != null && this.state.reply.length > 0){
            //it should be just shown with edit, delete button
            //edit button to edit mode
            //delete button delete from database
        }
        else {
            //it should be just write reply expands to edit mode
        }
        */
       const { t, i18n } = useTranslation();
        return(
            <div>
                {this.state.isAuthor == true ?
            (   this.state.edit_flag == true ? (
                <div className="input-group">
                    <div className="ml-4 mt-2">
                    <h5 className="mb-3"><i className='mdi mdi-reply mr-1' />{t('Reply')}</h5>
                    { this.state.reply != null && this.state.reply.length > 0 ? 
                    (<textarea className="form-control" id="text_reply" style={{resize: 'none'}} defaultValue={this.state.reply}></textarea>) : 
                    (<textarea className="form-control" id="text_reply" style={{resize: 'none'}}></textarea>)}
                    <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                    <div className='linked' onClick = {this.submitHandler}>
                    <i className='mdi mdi-check mr-1' />{t('Submit')}</div>   
                    <div className='linked ml-3' onClick = {this.cancelHandler}>
                    <i className='mdi mdi-keyboard-backspace mr-1' />{t('Cancel')}</div>
                        
                    </span>
                    </div> 
                    </div>
                    </div>
                    ) : (
                    <div className="input-group">
                        { this.state.reply != null && this.state.reply.length > 0 ? 
                        (<div className='ml-4 mt-2'><h5 className="mb-3"><i className='mdi mdi-reply mr-1' />{t('Reply')}</h5>
                        <textarea className="form-control" id="text_reply" style={{resize: 'none'}} defaultValue={this.state.reply} readOnly></textarea>
                        <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                        <div className='linked' onClick = {this.writeReplyHandler}>
                            <i className='mdi mdi-tooltip-edit mr-1' />{t('Edit')}</div>
                        <div class="pull-right">
                        <div className='linked' onClick = {this.deleteHandler}>
                            <i className='mdi mdi-delete ml-1' />{t('Delete')}</div>
                        
                        </div>
                        </span>
                        </div></div>):(
                            <h5 className='linked d-flex ml-3 mt-3' onClick = {this.writeReplyHandler}>
                                <i className='mdi mdi-tooltip-edit mr-1' />
                                {t('Write Reply')}
                            </h5>
                            )
                        }
                    </div>
                    )
            ) :
                (this.state.reply != null && this.state.reply.length > 0 ? 
                    (<div className='ml-4 mt-2'>
                    <h5 className="mb-3">
                    <i className='mdi mdi-reply mr-1' />{t('Reply')}</h5>
                    <textarea className="form-control" id="text_reply" style={{resize: 'none'}} defaultValue={this.state.reply} readOnly></textarea>
                </div>) : <div></div>)
            }
            </div>
        )
    }
    render(){
        return(<this.render1/>);
    } 
}
class Pin_Button extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            toggle : this.props.toggle,
            isAuthor : this.props.isAuthor,
            rootKey : this.props.rootKey,
            keyval : this.props.keyval,
        }
        this.onClickPinHandler = this.onClickPinHandler.bind(this);
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
        //get the data from firebase
        //given prop : empty, data, review id
        /*
        if(this.props.keyval){
            console.log("component did mount review card")
            var ref_root = firebase.database().ref().child('routine').child(this.props.rootKey);
            var ref_author = ref_root.child('name');
            ref_author.on('value', snap => {
                var val = snap.val();
                if(val!=null & this._isMounted){
                    this.state.author = val;
                }
            })
        }
        */
    }
    onClickPinHandler(){
        //console.log('before');
        //console.log(this.state.pins);
        console.log("onclickpinhandler");
        console.log(this.state.keyval)
        if(!this.state.toggle){ //add to pin
            console.log("add to pin");
            var ref = firebase.database().ref().child('routine').child(this.state.rootKey).child("review").child(this.state.keyval).child("pinned");
            /*
            ref.on('value', snap => {
                var val = snap.val();
                //console.log(this._isMounted);
                console.log(val);
                if(val!=null && this._isMounted){
                    pins = val;    
                }
                console.log(pins);
                if(!pins.includes(this.state.keyval))
                    pins.push(this.state.keyval);
            })
            */
            //console.log(pins);
            //this.state.pins = pins;
            //this.state.pins = pins;
            //console.log(this.props.data);
            //this.state.pin_datas.push(this.props.data);
            //this.state.pins = pins;
            ref.set(true);
            //var temp_tog = this.state.toggle;
            this.setState({toggle : true});
        }else{ //remove from pin
            console.log("remove from pin");
            var ref = firebase.database().ref().child('routine').child(this.state.rootKey).child("review").child(this.state.keyval).child('pinned');
            //var pins = [];
            //console.log(pins);
            /*
            ref.on('value', snap => {
                var val = snap.val();
                if(val!=null && this._isMounted){
                    pins = val;
                    //pins = pins.filter(n => n != this.state.keyval);
                }
                pins = pins.filter(n => n != this.state.keyval);
            })
            */
            //this.state.pins = pins;
            //var temp_idx = pins.indexOf(this.state.keyval);
            //this.state.pin_datas = this.state.pin_datas.splice(temp_idx,1);
            ref.remove();
            //this.setState({pins : pins});
            //this.state.pins = pins;
            //var temp_tog = this.state.toggle;
            this.setState({toggle : false});
        }
        //console.log('after');
        //console.log(this.state.pins);
    }
    render(){
        return(
            <div>
                {(this.props.isAuthor == true) ? 
                (this.props.toggle == true ? 
                    (<i className="mdi mdi-pin" onClick={() => this.onClickPinHandler()}/>) 
                : (<i className="mdi mdi-pin-off" onClick={() => this.onClickPinHandler()}/>)) 
                :
                (this.props.toggle == true ? (<i disabled={true} className="mdi mdi-pin" />) : <div></div>)}
            </div>
        )
    }

}

class Review_Card extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.image = this.image.bind(this);
        this.state = {
            img: 1
        }
        var temp_userid;
        if(firebase.auth().currentUser!=null){
            temp_userid = firebase.auth().currentUser.displayName;
        }
        this.state = {
            author : this.props.author,
            name : this.props.data.name,
            rate : this.props.data.rate,
            comment : this.props.data.comment,
            clike : this.props.data.clike,
            cdislike : this.props.data.cdislike,
            suggestion : this.props.data.suggestion,
            slike : this.props.data.slike,
            sdislike : this.props.data.sdislike,
            keyval : this.props.keyval,
            userid : temp_userid,
            //pins : this.props.pins,
            toggle : this.props.toggle,
            temp : false,
            date : this.props.date
        };
       //this.onClickPinHandler = this.onClickPinHandler.bind(this);
       this.onClickDeleteHandler = this.onClickDeleteHandler.bind(this);
       this.render1 = this.render1.bind(this);
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    onClickDeleteHandler(key, rootKey){
        //const { t, i18n } = useTranslation();
        alert('The review is deleted');
        var ref_root = firebase.database().ref().child('routine').child(rootKey).child('review').child(key);
        ref_root.remove();
        this.setState({temp : true});
    }
    
    
    componentDidMount(){
        this._isMounted = true;
        //get the data from firebase
        //given prop : empty, data, review id
        if(this.props.keyval){
            console.log("component did mount review card")
            console.log(this.props.keyval);
            var ref_root = firebase.database().ref().child('routine').child(this.props.rootKey);
            var ref_author = ref_root.child('name');
            ref_author.on('value', snap => {
                var val = snap.val();
                if(val!=null & this._isMounted){
                    this.state.author = val;
                }
            })
            /*
            var ref_pin = ref_root.child('pinned');
            var pins_array = [];
            ref_pin.on('value',snap=>{
                var val = snap.val();
                //console.log(val);
                if(val!=null & this._isMounted){
                    for(var key in val){
                        pins_array.push(val[key]);
                    }
                }
            })
            console.log(pins_array);
            if(pins_array.includes(this.props.keyval)){
                this.state.toggle = true;
            }else{
                this.state.toggle = false;
            }
            */
            var ref = ref_root.child('review').child(this.props.keyval);
            ref.on('value', snap => {
                var val = snap.val();
                if(val!=null & this._isMounted){
                    this.state.name = val.name;
                    this.state.rate = val.rate.split(',');
                    this.state.comment = val.comment.text;
                    this.state.suggestion = val.suggestion.text;
                    this.state.clike = val.comment.like;
                    this.state.cdislike = val.comment.dislike;
                    this.state.slike = val.suggestion.like;
                    this.state.sdislike = val.suggestion.dislike;
                    if(val.pinned == true){
                        this.state.toggle = true;
                    }
                    else{
                        this.state.toggle = false;
                    }
                }
            })
        }
    }
    image(name){
        if(name){
            var num = name.length % 6;
            if(num == 1) return img1;
        if(num == 2) return img2;
        if(num == 3) return img3;
        if(num == 0) return img4;
        if(num == 4) return img5;
        if(num == 5) return img6;
        }
        
        return img4;
    }
    render1(){
        const { t, i18n } = useTranslation();
        var temp_userid = '';
        if(firebase.auth().currentUser!=null){
            temp_userid = firebase.auth().currentUser.displayName;
        }
        var temp_2 = this.state.temp;
        this.state = {
            author : this.props.author,
            name : this.props.data.name,
            rate : this.props.data.rate,
            comment : this.props.data.comment,
            clike : this.props.data.clike,
            cdislike : this.props.data.cdislike,
            suggestion : this.props.data.suggestion,
            slike : this.props.data.slike,
            sdislike : this.props.data.sdislike,
            keyval : this.props.keyval,
            userid : temp_userid,
            //pins : this.props.pins,
            toggle : this.props.toggle,
            temp : temp_2,
            date : this.props.data.date
        };
        var shoulddisp = true;
        if (this.props.sortop == 1 && this.state.comment.length==0 && !this.props.empty){
            shoulddisp = false;
        }
        if (this.props.sortop == 2 && this.state.suggestion.length==0 && !this.props.empty){
            shoulddisp = false;
        }
        return(
            <div>
                {
                    !this.props.empty&&shoulddisp&&!this.state.temp? (
                    <Card>
                    <Row>
                        <Col xs="6" md="4">
                            {/* --------------------------------------------------------------------------------*/}
                            {/* Card-1*/}
                            {/* --------------------------------------------------------------------------------*/}
                            {/* does graph updates when data change occurs?*/}
                            <CardBody>
                            <CardTitle>
                    <div className="d-flex no-block align-items-center">
                        <div className="mr-2">
                            <img src={this.image(this.state.name)} alt="user" className="rounded-circle" width="45" /></div>
                        <div className="">
                            <h5 className="mb-0 font-16 font-medium">{this.state.name}</h5><span>{this.state.date}</span></div>
                        { temp_userid == this.state.name ? (
                            <div className = 'ml-2'>
                        <div className='linked' disabled="true">
                        <Link to={{ pathname : '/reviewWrite/'+this.props.rootKey+'/'+false,
                        state : {
                            rate : this.state.rate,
                            comment : this.state.comment,
                            suggestion : this.state.suggestion,
                            is_edit : true,
                            rev_key : this.state.keyval
                        }
                        }}>
                        <i className='mdi mdi-tooltip-edit' />{t('Edit')}</Link></div>                                    
                        <div className='linked' onClick={()=>{this.onClickDeleteHandler(this.props.keyval, this.props.rootKey)}}>
                        <i className='mdi mdi-delete' />{t('Delete')}</div>
                        </div>
                        )  : <div></div>  
                    }
                    </div>
                    </CardTitle>
                    <CardText>
                    {t('Rating')}
                    <Radar className="graph" data={Data(this.state.rate)} options={options}/>
                    </CardText>
                    </CardBody>               
                        </Col>
                        <Col xs="6" md="8">
                            <CardBody>
                                    {   temp_userid == this.state.name ? (
                                    <div>
                                        {(temp_userid == this.state.author) ? 
                                        <Pin_Button isAuthor = {true} toggle={this.state.toggle} keyval={this.props.keyval} rootKey = {this.props.rootKey}></Pin_Button> 
                                        : <Pin_Button isAuthor = {false} toggle={this.state.toggle} keyval={this.props.keyval} rootKey = {this.props.rootKey}></Pin_Button>}
                                    </div>
                                    ) :  ((this.state.author == temp_userid) ? 
                                        <Pin_Button isAuthor = {true} toggle={this.state.toggle} keyval={this.props.keyval} rootKey = {this.props.rootKey}></Pin_Button> 
                                        : <Pin_Button isAuthor = {false} toggle={this.state.toggle} keyval={this.props.keyval} rootKey = {this.props.rootKey}></Pin_Button>)}
                            <ReviewDisptab comment={this.state.comment} userid={this.props.userid} sortop={this.props.sortop} rout_key={this.props.rootKey} keyval={this.state.keyval} clike={this.state.clike} cdislike={this.state.cdislike} suggestion={this.state.suggestion} slike={this.state.slike} sdislike={this.state.sdislike}/>
                            {  this.state.author == temp_userid ? 
                                <AuthorReply isAuthor ={true} reply= {this.state.reply} keyval ={this.props.keyval} rootKey = {this.props.rootKey}/>
                                : <AuthorReply isAuthor = {false} reply= {this.state.reply} keyval ={this.props.keyval} rootKey = {this.props.rootKey}/>
                            }
                            </CardBody>
                        </Col>
                    </Row>
                    </Card>
                    ) : ( !shoulddisp||this.state.temp? <div></div> : (
                    <Card>
                        <Row>
                            <Col xs="12" md="12">
                                <CardBody>
                                <CardTitle>{t('There\'s no review yet')}.</CardTitle>
                                <CardText>{t('How about writing yours')}?</CardText>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>)
                    )
                }
            </div>
        )
    }
    render(){
        return(<this.render1/>);
    } 
}

const SortCondition = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    const toggle1 = () => setDropdownOpen1(prevState => !prevState);
    const { t, i18n } = useTranslation();
    return (
        <div className='input-group-append'>
    <Dropdown className='mr-1' isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        {t('Filter by')}
        </DropdownToggle>
      <DropdownMenu>      
        <DropdownItem onClick={()=>window.globalHandler(props.sortop, 1)}>{t('Only comment')}</DropdownItem>
        <DropdownItem onClick={()=>window.globalHandler(props.sortop, 2)}>{t('Only suggestion')}</DropdownItem>
        <DropdownItem onClick={()=>window.globalHandler(props.sortop, 0)}>{t('Show all')}</DropdownItem>
      </DropdownMenu>
    </Dropdown>

        <Dropdown className='ml-1' isOpen={dropdownOpen1} toggle={toggle1}>
        <DropdownToggle caret>
        {t('Sort by')}
        </DropdownToggle>
        <DropdownMenu> 
        <DropdownItem onClick={()=>window.globalMethodHandler(props.method, 0)}>{t('Newest')}</DropdownItem>
        <DropdownItem onClick={()=>window.globalMethodHandler(props.method, 1)}>{t('Most Upvote')}</DropdownItem>
        <DropdownItem onClick={()=>window.globalMethodHandler(props.method, 2)}>{t('Highest Rating')}</DropdownItem>
        </DropdownMenu>
        </Dropdown>
        </div>
    );
};

//the lists of reviews
class Review_List extends React.Component{
    constructor(props){
        console.log("constructor review list");
        super(props);
        this._isMounted = false;
        this.state = {
            keys : this.props.myreviews,
            datas : this.props.mydatas,
            //pins : this.props.mypins,
            //pin_datas : this.props.mypindatas,
            sort : 0,
            method : 0,
            author : "",
        }
        //sort 1 : only comment. sort 2 : only suggestion
        this.onClickSortHandler = this.onClickSortHandler.bind(this);
        this.onClickSortMethodhandler = this.onClickSortMethodhandler.bind(this);
        window.globalHandler = this.onClickSortHandler;
        window.globalMethodHandler = this.onClickSortMethodhandler;
        this.render1 = this.render1.bind(this);
    }

    onClickSortHandler = (cur_op, new_op) => {
        if (cur_op != new_op){
            this.setState({sort : new_op});
        }else{
            this.setState({sort : 0});
        }
    };
    
    onClickSortMethodhandler = (cur_method, new_method) =>{
        if(cur_method != new_method){
            this.setState({method : new_method});
        }else{
            this.setState({method : 0});
        }
    }

    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
        var ref = firebase.database().ref().child('routine').child(this.props.rootKey).child('review');
        var ref_author = firebase.database().ref().child('routine').child(this.props.rootKey).child('name');
        //var ref_pin = firebase.database().ref().child('routine').child(this.props.rootKey).child('pinned');
        ref.on('value', snap => {
            var val = snap.val();
            var keys = [];
            var datas = [];
            console.log(val);
            if(val!=null && this._isMounted){
                for(var key in val){
                    keys.push(key);
                    datas.push(val[key]); 
                }
                this.setState({
                    keys: keys,
                    datas: datas
                })
            }
        })
        
        ref_author.on('value',snap => {
            var val = snap.val();
            console.log(val);
            if(val!=null && this._isMounted){
                this.setState({
                    author: val
                })
            }
        })
        //pressed list
        
    }

    render1(){
        //for reviews in the review array
        //consider case when there is no review
        var sorted_arr=[];
        var pin_arr = [];
        const { t, i18n } = useTranslation();
        if(this.state.keys.length > 0){
            sorted_arr = this.state.keys.map((key, index)=> [key, this.state.datas[index]]);
            pin_arr = sorted_arr.filter(n => n[1].pinned == true).reverse();
            sorted_arr = sorted_arr.filter(n=>{console.log(n[1].pinned); return n[1].pinned != true;}).reverse();
            console.log(pin_arr);
            console.log(sorted_arr);
            if(sorted_arr.length > 0){
                var a = sorted_arr[0];
                console.log(a, eval(a[1].rate.split(',').join('+'))/5);
            }
        }
        if(this.state.method == 1 && this.state.keys != null && sorted_arr.length > 1){
            if(this.state.sort == 0){
                sorted_arr.sort((a, b) => (a[1].comment.like+a[1].suggestion.like-a[1].comment.dislike-a[1].suggestion.dislike)>(b[1].comment.like+b[1].suggestion.like-b[1].comment.dislike-b[1].suggestion.dislike) ? -1 : 1);
            }else if(this.state.sort == 1){
                sorted_arr.sort((a, b) => (a[1].comment.like-a[1].comment.dislike)>(b[1].comment.like-b[1].comment.dislike) ? -1 : 1);
            }else{
                sorted_arr.sort((a, b) => (a[1].suggestion.like-a[1].suggestion.dislike)>(b[1].suggestion.like-b[1].suggestion.dislike) ? -1 : 1);
            }   
        }
        if(this.state.method == 2 && this.state.keys!=null && sorted_arr.length > 1){
            sorted_arr.sort((a, b) => (eval(a[1].rate.split(',').join('+'))/5)>(eval(b[1].rate.split(',').join('+'))/5) ? -1 : 1);
        }
        var rating = <h6 className="ml-3">{t('Average Rating')} : {this.props.avg}</h6>;
        if(this.props.avg == null) rating = null;
        var empty = false;
        if(sorted_arr.length == 0 && pin_arr.length == 0)
            empty = true;
        return(
            <div>
                { empty ? <div></div>: (
                <h5 className="mb-3 d-flex">
                    {t('Reviews of this routine')}{rating}
                    <div className="ml-auto">
                    <SortCondition sortop={this.state.sort} method={this.state.method}/>
                    </div>
                </h5>
                )
                }
                <div>
                    {
                        pin_arr.length >0 ? (
                        pin_arr.map((data, index)=>{
                            let key = data[0];
                            console.log(key);
                            let temp = data[1];
                            console.log(temp);
                            var temp2 = {
                                name : temp.name,
                                date : temp.date,
                                rate : temp.rate.split(','),
                                comment : temp.comment.text,
                                clike : temp.comment.like,
                                cdislike : temp.comment.dislike,
                                suggestion : temp.suggestion.text,
                                slike : temp.suggestion.like,
                                sdislike : temp.suggestion.dislike
                            };
                            return(<Review_Card toggle = {true} keyval={key} rootKey={this.props.rootKey} data={temp2} empty={false} userid={this.props.userid} sortop={this.state.sort} author={this.state.author}/>)})) 
                        : <div></div>
                        }
                    {
                        sorted_arr.length>0 ? (
                        sorted_arr.map((data, index) => { 
                            let key = data[0];
                            let temp = data[1];
                            var temp2 = {
                                name : temp.name,
                                date : temp.date,
                                rate : temp.rate.split(','),
                                comment : temp.comment.text,
                                clike : temp.comment.like,
                                cdislike : temp.comment.dislike,
                                suggestion : temp.suggestion.text,
                                slike : temp.suggestion.like,
                                sdislike : temp.suggestion.dislike
                            };
                            return(<Review_Card toggle = {false} keyval={key} rootKey={this.props.rootKey} data={temp2} empty={false} userid={this.props.userid} sortop={this.state.sort} author={this.state.author}/>)}) 
                        )
                        : (pin_arr.length > 0 ? <div></div> : <Review_Card data={[]} empty={true} userid={this.props.userid} rootKey={this.props.rootKey}/>)                  
                }
                </div>
            </div>
        )
    }
    render(){
        return(<this.render1/>);
    } 
}

class Cards extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        var temp_userid = '';
        this.state = {
            myreview : [],
            mydatas : [],
            mypin : [],
            mypindatas : [],
            datasall : [],
            userid : temp_userid,
        }
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
        //get review informations from the firebase
        //get the review of the routine(given by routine ID).
        var ref_root = firebase.database().ref().child('routine').child(this.props.match.params.key);
    }
    //if I am the review writter, add comment writing space. (editable)
    render(){
        return(
            <Row>
                <Col sm={12} lg={12}>
                <Projects props={this.props.match.params.key} detail={true} my={this.props.match.params.my}/>
                </Col>
                <Col sm={12} lg={12}>
                <Review_List rootKey={this.props.match.params.key} myreviews={this.state.myreview} mydatas={this.state.mydatas} userid={this.state.userid} avg={this.state.avg}/>
                </Col>
            </Row>
                    )
    }

}


export default Cards;
