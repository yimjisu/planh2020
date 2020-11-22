import React, {useState} from 'react';
import ReactDOM, { render } from 'react-dom'
import firebase from 'firebase';
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
} from 'reactstrap';
import classnames from 'classnames';
import StepRangeSlider from 'react-step-range-slider';
import img1 from 'assets/images/users/1.jpg';
import img2 from 'assets/images/users/2.jpg';
import img3 from 'assets/images/users/3.jpg';
import img4 from 'assets/images/users/4.jpg';
import { Radar } from "react-chartjs-2";

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

const data = (rate) => {
    return {
    labels: [
        "Difficulty well set?",
        "Was routine new?",
        "Was it effective?",
        "Post well written?",
        "Suggestable?",
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

const onClickHandler = () => {
    console.log('onclickhandler');
    /*
    var user = firebase.auth().currentUser;
    if(user == null){
        alert('To leave a review, login first!');
        return;
    }
    */
    var ref_root = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP');
    var ref = ref_root.child('review');
    var comment = document.getElementById("text_comment").value;
    var suggestion = document.getElementById("text_suggestion").value;
    var name = document.getElementById("input-name").value;
    //var name = user.displayName;
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
    let ref_temp = ref.push();
    ref_temp.set(total);
    //close this review page
};

const onClickReportHandler = (rout_key, rev_key) => {
    var user = firebase.auth().currentUser;
    if(user == null){
        alert('To report, login first!');
        return;
    }
    console.log('reporthandler');
    var ref = firebase.database().ref().child('report');
    let temp = ref.push();
    temp.set({routine: rout_key, review: rev_key});
}   

const onClickDeleteHandler = (key) => {
    var ref_root = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP').child('review').child(key);
    console.log('deletehandler');
    ref_root.remove();
}

//need toggle?
const onClickLikeHandler = (isComment,isLike,key) => {
    var user = firebase.auth().currentUser;
    if(user == null){
        if(isLike){
            alert('To leave a dislike, login first!');
        }
        else{
            alert('To leave a like, login first!');
        }
        return;
    }
    //check like/dislike list 
    var ref_root = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP').child('review').child(key);
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
    }
    
    onClickLikeHandler = (isLike) => {
        /*
        var user = firebase.auth().currentUser;
        if(user == null){
            if(isLike){
                alert('To leave a dislike, login first!');
            }
            else{
                alert('To leave a like, login first!');
            }
            return;
        }
        */
        //check like/dislike list 
        if(isLike){
            if(this.state.likePressed){
                this.setState({likePressed : false, dislikePressed : false});
            }else{
                this.setState({likePressed : true, dislikePressed : false});
            }
        }else{
            if(this.state.dislikePressed){
                this.setState({likePressed : false, dislikePressed : false});
            }else{
                this.setState({likePressed : false, dislikePressed : true});
            }
        }
        var ref_root = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP').child('review').child(this.state.keyval);
        if(this.state.isComment){
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

    render() {
        var like_bg = this.state.likePressed ? "red" : "";
        var dislike_bg = this.state.dislikePressed ? "red" : "";
        return (
            <div>
                <Button style={{backgroundColor: like_bg}} onClick={()=>this.onClickLikeHandler(true)}>like {this.props.likeval}</Button>
                <Button style={{backgroundColor: dislike_bg}} onClick={()=>this.onClickLikeHandler(false)}>dislike {-1*this.props.dislikeval}</Button>
            </div>
        );
    }
  }

const ReviewDisptab = (props) => {
    //var key = document.getElementById('input-key').value;
    console.log(props.keyval);
    console.log(props.comment);
    console.log(props.suggestion);
    console.log(props.sortop);
    return (
        <div>
            {   
                props.sortop != 2 ? (
            <div>
            <h5 className="mb-3">Comment</h5>
            <div className="input-group">
                <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} value={props.comment} readOnly></textarea>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <Button onClick={()=>onClickLikeHandler(true,true,props.keyval)}>like {props.clike}</Button>
                        <ButtonToggle likeval={props.clike} dislikeval={props.cdislike} keyval={props.keyval} isComment={true}/>
                        <Button onClick={()=>onClickLikeHandler(true,false,props.keyval)}>dislike {-1*props.cdislike}</Button>
                        <Button onClick={()=>onClickReportHandler(props.rout_key,props.keyval)}>report</Button>
                    </span>
                </div>
            </div>
            </div>
            ) : <div></div>
            }
            {
                props.sortop != 1 ? (
            <div>
            <h5 className="mb-3">Suggestion</h5>
            <div className="input-group">
                <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} value={props.suggestion} readOnly></textarea>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <Button onClick={()=>onClickLikeHandler(false,true, props.keyval)}>like {props.slike}</Button>
                        <Button onClick={()=>onClickLikeHandler(false,false, props.keyval)}>dislike {-1*props.sdislike}</Button>
                        <Button onClick={()=>onClickReportHandler(props.rout_key,props.keyval)}>report</Button>
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
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Comments
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Suggestions
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
                <Col sm="12">
                <div>
                    <label for="comment">Write your comment: </label>
                </div>
                {
                    props.editable ? (
                        <div className="input-group">
                            <textarea className="form-control" id="text_comment" rows="5" style={{resize: 'none'}} defaultValue={props.comment}></textarea>
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">
                                    <Button onClick={onClickHandler}>submit</Button>
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
                    <label for="suggestion">Write your suggestion: </label>
                </div>
                {
                    props.editable ? (
                        <div className="input-group">
                            <textarea className="form-control" id="text_suggestion" rows="5" style={{resize: 'none'}} defaultValue={props.suggestion}></textarea>
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">
                                    <Button onClick={onClickHandler}>submit</Button>
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
            comment : 'default comment',
            suggestion : 'default suggestion',
        }
        this.reference = {};
        console.log(this.state);
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
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
                    <Radar className="graph" id="radar-graph" data={data(this.state.rate)} options={options} ref={(reference) => {this.reference = reference}}/>
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
                        <Reviewtab comment={this.state.comment} suggestion={this.state.suggestion} editable={true}/>
                    </CardBody>
                </Col>
            </Row>
            </Card>
        </div>
    );
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
        /*
        this.state = {
            name : this.props.data.name,
            rate : this.props.data.rate,
            comment : this.props.data.comment,
            clike : this.props.data.clike,
            cdislike : this.props.data.cdislike,
            suggestion : this.props.data.suggestion,
            slike : this.props.data.slike,
            sdislike : this.props.data.sdislike,
            keyval : this.props.keyval,
        }
        */
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        this._isMounted = true;
        //get the data from firebase
        //given prop : empty, data, review id
        if(this.props.keyval){
            var ref = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP').child('review').child(this.props.keyval);
            ref.on('value', snap => {
                var val = snap.val();
                console.log(val);
                if(val!=null & this._isMounted){
                    console.log(val.suggestion.text);
                    console.log(val.comment.text);
                    this.state.name = val.name;
                    this.state.rate = val.rate.split(',');
                    this.state.comment = val.comment.text;
                    this.state.suggestion = val.suggestion.text;
                    this.state.clike = val.comment.like;
                    this.state.cdislike = val.comment.dislike;
                    this.state.slike = val.suggestion.like;
                    this.state.sdislike = val.suggestion.dislike;
                
                }
            })
        }
        console.log(this.state);
    }
    image(num){
        if(num == 1) return img1;
        if(num == 2) return img2;
        if(num == 3) return img3;
        if(num == 4) return img4;
    }
    render(){
        this.state = {
            name : this.props.data.name,
            rate : this.props.data.rate,
            comment : this.props.data.comment,
            clike : this.props.data.clike,
            cdislike : this.props.data.cdislike,
            suggestion : this.props.data.suggestion,
            slike : this.props.data.slike,
            sdislike : this.props.data.sdislike,
            keyval : this.props.keyval,
        }
        return(
            <div>
                {
                    !this.props.empty ? (
                    <Card>
                    <Row>
                        <Col xs="12" md="4">
                            {/* --------------------------------------------------------------------------------*/}
                            {/* Card-1*/}
                            {/* --------------------------------------------------------------------------------*/}
                            {/* does graph updates when data change occurs?*/}
                            <CardBody>
                            <CardTitle>
                    <div className="d-flex no-block align-items-center">
                        <div className="mr-2">
                            <img src={img4} alt="user" className="rounded-circle" width="45" /></div>
                        <div className="">
                            <h5 className="mb-0 font-16 font-medium">{this.state.name}</h5><span>2020-11-07</span></div>
                    </div>
                    </CardTitle>
                    </CardBody><CardBody>
                            <CardTitle>Rating</CardTitle>
                            <Radar className="graph" data={data(this.state.rate)} options={options}/>
                            </CardBody>
                        </Col>
                        <Col xs="12" md="8">
                            <CardBody>
                                    {   this.props.userid == this.state.name ? (
                                    <div class="pull-right">
                                        <Button>Modify</Button>                                    
                                        <Button onClick={()=>{onClickDeleteHandler(this.props.keyval)}}>Delete</Button>
                                    </div>
                                    ) : <div></div>}
                            </CardBody>
                            <ReviewDisptab comment={this.state.comment} sortop={this.props.sortop} rout_key='-MMZTiR3gBd4Fwd1i2cP' keyval={this.state.keyval} clike={this.state.clike} cdislike={this.state.cdislike} suggestion={this.state.suggestion} slike={this.state.slike} sdislike={this.state.sdislike}/>
                        </Col>
                    </Row>
                    </Card>
                    ) : (
                    <Card>
                        <Row>
                            <Col xs="12" md="12">
                                <CardTitle>There's no review yet.</CardTitle>
                                <CardBody>How about writing yours?</CardBody>
                                <Button>Write Review</Button>
                            </Col>
                        </Row>
                    </Card>
                    )
                }
            </div>
        )
    }
}

const SortCondition = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        Sort by
        </DropdownToggle>
      <DropdownMenu>      
        <DropdownItem onClick={()=>window.globalHandler(props.sortop, 1)}>Only comment</DropdownItem>
        <DropdownItem onClick={()=>window.globalHandler(props.sortop, 2)}>Only suggestion</DropdownItem>
        <DropdownItem onClick={()=>window.globalHandler(props.sortop, 0)}>Show all</DropdownItem>
        <DropdownItem divider/>
        <DropdownItem onClick={()=>window.globalMethodHandler(props.method, 0)}>Newest</DropdownItem>
        <DropdownItem onClick={()=>window.globalMethodHandler(props.method, 1)}>Most Upvote</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    );
};

//the lists of reviews
class Review_List extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            keys : this.props.myreviews,
            datas : this.props.mydatas,
            sort : 0,
            method : 0,
        }
        //sort 1 : only comment. sort 2 : only suggestion
        this.onClickSortHandler = this.onClickSortHandler.bind(this);
        this.onClickSortMethodhandler = this.onClickSortMethodhandler.bind(this);
        window.globalHandler = this.onClickSortHandler;
        window.globalMethodHandler = this.onClickSortMethodhandler;
    }

    onClickSortHandler = (cur_op, new_op) => {
        console.log('sorthandler');
        if (cur_op != new_op){
            this.setState({sort : new_op});
        }else{
            this.setState({sort : 0});
        }
    };
    
    onClickSortMethodhandler = (cur_method, new_method) =>{
        console.log('methodhandler');
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
        var ref = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP').child('review');
        ref.on('value', snap => {
            var val = snap.val();
            console.log(val);
            if(val!=null & this._isMounted){
                var keys = [];
                var datas = [];
                for(var key in val){
                    keys.push(key);
                    datas.push(val[key]);
                }
                this.state.keys = keys;
                this.state.datas = datas;
            }
        })
    }

    render(){
        //for reviews in the review array
        //consider case when there is no review
        console.log("list render");
        var sorted_arr=[];
        if(this.state.keys.length > 0){
            sorted_arr = this.state.keys.map((key, index)=> [key, this.state.datas[index]]);
        }
        if(this.state.method == 1 && this.state.keys.length > 1){
            if(this.state.sort == 0){
                sorted_arr.sort((a, b) => (a[1].comment.like+a[1].suggestion.like-a[1].comment.dislike-a[1].suggestion.dislike)>(b[1].comment.like+b[1].suggestion.like-b[1].comment.dislike-b[1].suggestion.dislike) ? -1 : 1);
            }else if(this.state.sort == 1){
                sorted_arr.sort((a, b) => (a[1].comment.like-a[1].comment.dislike)>(b[1].comment.like-b[1].comment.dislike) ? -1 : 1);
            }else{
                sorted_arr.sort((a, b) => (a[1].suggestion.like-a[1].suggestion.dislike)>(b[1].suggestion.like-b[1].suggestion.dislike) ? -1 : 1);
            }   
        }
        return(
            <div>
                <span>
                <h5 className="mb-3">Reviews of this routine
                    <text>/Average Rating : {this.props.avg}</text>
                    <div class="pull-right">
                        <SortCondition sortop={this.state.sort} method={this.state.method}/>
                    </div>
                </h5>
                </span>
                {
                    //sorting method, this.state.keys => sort with something and map with that.
                    sorted_arr.length>0 ? (
                        sorted_arr.map((data, index) => { 
                            console.log(data[0]);
                            console.log(data[1]);
                            let key = data[0];
                            let temp = data[1];
                            var temp2 = {
                                name : temp.name,
                                rate : temp.rate.split(','),
                                comment : temp.comment.text,
                                clike : temp.comment.like,
                                cdislike : temp.comment.dislike,
                                suggestion : temp.suggestion.text,
                                slike : temp.suggestion.like,
                                sdislike : temp.suggestion.dislike
                            };
                            console.log(this.state.sort);
                            console.log(this.state.method);
                            return(<Review_Card keyval={key} data={temp2} empty={false} userid={this.props.userid} sortop={this.state.sort}/>)}) 
                        )
                        : <Review_Card data={[]} empty={true} userid={this.props.userid}/>                   
                }
            </div>
        )
    }
}

class Cards extends React.Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            myreview : [],
            mydatas : [],
            userid : 'user'
        };
    }
    componentWillUnmount() {
		this._isMounted = false;
    }
    
    componentDidMount(){
        console.log("cards didmount");
        this._isMounted = true;
        //get review informations from the firebase
        //get the review of the routine(given by routine ID).
        var ref_root = firebase.database().ref().child('routine').child('-MMZTiR3gBd4Fwd1i2cP');
        var ref = ref_root.child('review');
        ref.on('value', snap => {
            var val = snap.val();
            console.log(val);
            if(val!=null & this._isMounted){
                var keys = [];
                var datas = [];
                for(var key in val){
                    keys.push(key);
                    datas.push(val[key]);
                }
                this.setState({myreview: keys, mydatas: datas});
            }
        })
        var ref_avg = ref_root.child('rating');
        ref_avg.on('value', snap => {
            var val = snap.val();
            if(val!=null & this._isMounted){
                let temp = val.toFixed(2);
                console.log(temp);
                this.setState({avg: temp});
            }
        })
    }

    render(){
        console.log('cards render');
        return(
            <div>
                <div>
                <Review_Write {...this.props}/>
                </div>
                <div>
                <Review_List myreviews={this.state.myreview} mydatas={this.state.mydatas} userid={this.state.userid} avg={this.state.avg}/>
                </div>
            </div>
        )
    }

}


export default Cards;