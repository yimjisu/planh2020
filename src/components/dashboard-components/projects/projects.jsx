import React from "react";

import firebase from 'firebase'; 
import img1 from 'assets/images/users/1.jpg';
import dumbbell1 from 'assets/images/dumbbell.png';
import dumbbell2 from 'assets/images/dumbbell (1).png';
import img2 from 'assets/images/users/2.jpg';
import img3 from 'assets/images/users/3.jpg';
import img4 from 'assets/images/users/4.jpg';
import { Route, Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    CardFooter,
    Input,
    Button,
    Table,
    Row,
    Col,
    Badge
} from 'reactstrap';
class Projects extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.review = this.review.bind(this);
        this.noreview = this.noreview.bind(this);
        this.state = {
            title: null,
            name: null,
            rate: 1,
            time: 0,
            level: null,
            tags: [],
            routine: [],
            img: 1,
            reviewimg: 3
        };
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){
        this._isMounted = true;
        var ref = firebase.database().ref().child('routine');
        var routineRef = ref.child(this.props.props);
        console.log(routineRef);
        routineRef.on('value', snap=>{
            var val = snap.val();
            if(val!=null & this._isMounted){
                console.log(val.title, val.name, val.rating);
                var tags = [];
                for(var tag in val.tag['tag']){
                    tags.push(val.tag['tag'][tag]);
                }
                var routine = [];
                for(var t in val.routine){
                    routine.push(val.routine[t]);
                }
               this.setState({
                   title: val.title,
                   name: val.name,
                   rate: val.rating,
                   time: val.tag['time'],
                   level: val.tag['level'],
                   tags: tags,
                   routine: routine,
                   img: val.img
               });
               if(val.review != null){
                   var review = val.review;
                   var reviewname = '';
                   var reviewtext = '';
                   var score = -10000;
                   for(var key in review){
                    var r = review[key];
                    var arr = ['suggestion', 'comment'];
                    for(var i=0;i<2;i++){
                    let text = arr[i];
                    if(r[text]){
                    if(score < r[text]['like'] - r[text]['dislike']){
                        reviewname = r['name'];
                        reviewtext = r[text]['text'];
                        score = r[text]['like'] - r[text]['dislike'];
                        console.log('score', score);
                    }}
                   }}
                   this.setState({
                       reviewname : reviewname,
                       reviewtext : reviewtext
                   });
               }
            }
        });

    }

    image(num){
        if(num == 1) return img1;
        if(num == 2) return img2;
        if(num == 3) return img3;
        if(num == 4) return img4;
    }

    review(){
        let rate =this.state.rate;
        var reviewimg = this.state.reviewimg;
    var reviewname = this.state.reviewname;
    var reviewtext = this.state.reviewtext;
        return(
            <CardFooter body inverse color="info">
                        <CardTitle>
                        <div className="feed-item">
                            Review <span className="ml-3 font-12 text-muted">
                                Rating
                                {[...Array( Math.round(rate))].map((n, index) => {
                                    return(<img className="mx-sm-1" width="20px" src={dumbbell1} />
                                )})}
                                {[...Array( Math.round(5-rate))].map((n, index) => {
                                    return(<img className="mx-sm-1" width="20px" src={dumbbell2} />
                                )})}
                                {rate.toFixed(1)}
                                </span>
                        </div>
                        </CardTitle>
                        
                        <CardText>
                        
                                
                        <div className="d-flex no-block align-items-center">
                                    <div className="mr-2"><img src={this.image(reviewimg)} alt="user" className="rounded-circle" width="45" /></div>
                                    <div className="">
                                        <h5 className="mb-0 font-16 font-medium">{reviewname}</h5><span>{reviewtext}</span></div>
                                </div>
                                <div className="d-flex">
                            <div className="read d-flex mt-sm-3">  
                            <div>
                                <Link to={'/reviewRead/'+this.props.props} className="link font-medium">
                                <i className="mdi mdi-book-open-variant mr-1"/>
                                    Read More</Link> </div>
                            <div className="ml-4">
                                <Link to={'/reviewWrite/'+this.props.props} className="link font-medium">
                                <i className="mdi mdi-pencil mr-1"/>
                                    Write</Link></div>
                            </div></div>
                        </CardText>
                    </CardFooter>
        );
    }

    noreview(){
        return(
            <CardFooter body inverse color="info">
                
                <CardTitle>
                No Reviews

                <Link to={'/reviewWrite/'+this.props.props} 
                className="link font-small float-right">
                <i className="mdi mdi-pencil mr-1"/>
                    Write</Link>
                </CardTitle>
                
            </CardFooter>
        );
    }
    render(){
    let title = this.state.title;
    let username = this.state.name;
    
    let time = this.state.time;
    let level = this.state.level;
    let tags = this.state.tags;
    let routine = this.state.routine;
    let detail = "hidden";
    if(this.props.detail) detail = "no-wrap";

    var img = this.state.img;
    var reviewname = this.state.reviewname;
    var review = null;
    if(reviewname == null){
        review = <this.noreview/>
    }else{
        review = <this.review/>
    }
    
    return (
        /*--------------------------------------------------------------------------------*/
        /* Used In Dashboard-4 [General]                                                  */
        /*--------------------------------------------------------------------------------*/
                <Card>
                        <CardBody>
                        <div className="d-flex align-items-center">
                <div className="d-flex no-block align-items-center">
                    <div className="mr-2"><img src={this.image(img)} alt="user" className="rounded-circle" width="45" /></div>
                    <div className="">
                    <CardTitle>{title}</CardTitle>
                        <CardSubtitle>by {username}</CardSubtitle></div>
                </div>
                    <div className="ml-auto d-flex no-block align-items-center">
                        <div className="dl">
                         </div>
                    </div>
                </div>
                <div className="d-flex flex-sm-row">
                <Badge className="mx-1" color="primary" pill>
                <i className="mdi mdi-timer" />   {time}min
                  </Badge>
                  <Badge className="mx-1" color="secondary" pill>
                  <i className="mdi mdi-dumbbell" /> {level}
                  </Badge>
                  {tags.map((tag, index) => {
                      return(<Badge className="mx-1" color="info" pill>
                  <i className="mdi mdi-dots-horizontal"/> {tag}
                  </Badge>)})}
                  
                  </div>
                <Table className={detail + " v-middle"} responsive>
                    <thead>
                        <tr className="border-0">
                            <th className="border-0">Action</th>
                            <th className="border-0">Time</th>
                            <th className="border-0">Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routine.map((r, index) => {
                            return(
                            <tr>
                                <td>{r['action']}</td>
                                <td>{r['time']}</td>
                                <td>{r['info']}</td>
                            </tr>
                            )
                        })}
                        
                    </tbody>
                </Table>
                <div className="d-flex">
                    <div className="read">
                    <Link to={'/detail/'+this.props.props} className="link font-medium">
                                    Read More Details</Link>
                    </div>
                </div>
                </CardBody>
                {review}
                            
            </Card>
        
        
    );}
}

export default Projects;
