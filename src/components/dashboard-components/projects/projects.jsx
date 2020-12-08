import React from "react";

import firebase from 'firebase'; 
import img1 from '../../../assets/images/users/1.jpg';
import dumbbell1 from '../../../assets/images/dumbbell.png';
import dumbbell2 from '../../../assets/images/dumbbell (1).png';
import img2 from '../../../assets/images/users/2.jpg';
import img3 from '../../../assets/images/users/3.jpg';
import img4 from '../../../assets/images/users/4.jpg';
import img5 from '../../../assets/images/users/5.jpg';
import img6 from '../../../assets/images/users/6.jpg';
import leg from '../../../assets/images/leg.png';
import arm from '../../../assets/images/arm.png';
import abdominal from '../../../assets/images/abdominal.png';
import shoulder from '../../../assets/images/shoulder.png';
import back from '../../../assets/images/back.png';
import chest from '../../../assets/images/chest.png';
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
            reviewimg: 3,
            body: []
        };
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){
        this._isMounted = true;
        var ref = firebase.database().ref().child('routine');
        var routineRef = ref.child(this.props.props);
        routineRef.on('value', snap=>{
            var val = snap.val();
            if(val!=null & this._isMounted){
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

               if(val.tag.bodypart){
                this.setState({body: val.tag['bodypart']});
               }
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

    review(){
        let rate =this.state.rate;
        var reviewimg = this.state.reviewimg;
    var reviewname = this.state.reviewname;
    var reviewtext = this.state.reviewtext;
    var writereview = null;
    if(this.props.my != true){
        writereview = <div className="ml-4">
        <Link to={'/reviewWrite/'+this.props.props+'/'+this.props.my} className="link font-medium">
        <i className="mdi mdi-pencil mr-1"/>
            Write</Link></div>;
    }
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
                                    <div className="mr-2"><img src={this.image(reviewname)} alt="user" className="rounded-circle" width="45" /></div>
                                    <div className="">
                                        <h5 className="mb-0 font-16 font-medium">{reviewname}</h5><span>{reviewtext}</span></div>
                                </div>
                                <div className="d-flex">
                            <div className="read d-flex mt-sm-3">  
                            <div>
                                <Link to={'/reviewRead/'+this.props.props+'/'+this.props.my} className="link font-medium">
                                <i className="mdi mdi-book-open-variant mr-1"/>
                                    Read More</Link> </div>
                            {writereview}
                            </div></div>
                        </CardText>
                    </CardFooter>
        );
    }

    noreview(){
    var writereview = null;
    if(this.props.my != true){
        writereview =
        <Link to={'/reviewWrite/'+this.props.props+'/'+this.props.my} 
                className="link font-small float-right">
                <i className="mdi mdi-pencil mr-1"/>
                    Write</Link>}
        return(
            <CardFooter body inverse color="info">
                
                <CardTitle>
                No Reviews
                {writereview}
                
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
    let body = this.state.body;
    let routine = this.state.routine;
    let detail = "hidden";
    
    if(this.props.detail) detail = "no-wrap";
    else{
        routine = routine.slice(0, 2);
    }
    console.log('props', this.props);
    var reviewname = this.state.reviewname;
    var review = null;
    if(this.props.review != true){
    if(reviewname == null){
        review = <this.noreview/>
    }else{
        review = <this.review/>
    }}
    var edit = null;
    if(this.props.my == true || this.props.my == "true"){
        edit = <div className="ml-auto no-block align-items-center">
         <div className="dl">
        <a className="link font-small float-right">
        <i className="mdi mdi-delete mr-1" 
        onClick={() => {
            if(window.confirm('Want to delete this routine?')){
                var ref = firebase.database().ref().child('routine');
                var routineRef = ref.child(this.props.props);
                routineRef.remove();
            }
        }
        }/>
    </a>
         </div>
        <div className="dl">
        <Link to={'/write/'+this.props.props} 
className="link font-small float-right">
<i className="mdi mdi-tooltip-edit mr-1"/>
    Edit</Link>
         </div>
    </div>;
    }

    var readdetail = null;
    if(this.props.detail != true){
        readdetail = <div className="d-flex">
        <div className="read">
        <Link to={'/detail/'+this.props.props+'/'+this.props.my} className="link font-medium">
                        Read More Details</Link>
        </div>
    </div>;
    }

    
    return (
        /*--------------------------------------------------------------------------------*/
        /* Used In Dashboard-4 [General]                                                  */
        /*--------------------------------------------------------------------------------*/
                <Card>
                        <CardBody>
                        <div className="d-flex align-items-center">
                <div className="d-flex no-block align-items-center">
                    <div className="mr-2"><img src={this.image(username)} alt="user" className="rounded-circle" width="45" /></div>
                    <div className="">
                    <CardTitle>{title}</CardTitle>
                        <CardSubtitle>by {username}</CardSubtitle></div>
                </div>
                    {edit}
                </div>
                <div className="d-block">
                <Badge className="mx-1" color="primary" pill>
                <i className="mdi mdi-timer" />   {time}min
                  </Badge>
                  <Badge className="mx-1" color="secondary" pill>
                  <i className="mdi mdi-dumbbell" /> {level}
                  </Badge>
                    {Object.entries(body).map(([key, value]) => {
                        var bodyimg = dumbbell1;
                        if(value == false) return null;
                        if(key == 'arm') bodyimg = arm;
                        if(key == 'shoulder') bodyimg = shoulder;
                        if(key == 'back') bodyimg = back;
                        if(key == 'chest') bodyimg = chest;
                        if(key == 'abdominal') bodyimg = abdominal;
                        if(key == 'leg') bodyimg = leg;
                        return(
                        <Badge className="mx-1" color="danger" pill>
                            <img height="13px" src={bodyimg} /> {key}
                        </Badge>
                        )
                    })}
                  

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
                        {routine.map((r, index) => 
                        
                        { 
                            var image = false;
                            var video = false;
                            var link = null;
                            var storage, httpsReference;
                            if(r['imageUrl'] != null && this.props.detail == true){
                                image = true;
                                storage = firebase.storage();
                                httpsReference = storage.refFromURL(r['imageUrl']);
                                httpsReference.getDownloadURL().then(function(url){
                                var img = document.getElementById('myimg');
                                img.src = url;
                                }).catch(function(error) {
                                    // Handle any errors
                                });
                            }
                            if(r['videoUrl'] != null && this.props.detail == true){
                                video = true;
                                var url = r['videoUrl'];
                                if(url.includes('embed')) link = url;
                                else link = "https://www.youtube.com/embed/"+url.split('?v=')[1];
                            }
                        if(image == true && video == true){
                            return(
                                <tr>
                                    <td>{r['action']}</td>
                                    <td>{r['time']}min</td>
                                    <td>{r['info']}
                                    <img className="d-block" id="myimg" height="150px"/>
                                    <iframe 
                                    className = 'd-block'
                                    width="560" height="315" 
                                    src={link}
                                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                    </td>

                                </tr>
                                );
                        }
                        if(image == true){
                            return(
                                <tr>
                                    <td>{r['action']}</td>
                                    <td>{r['time']}min</td>
                                    <td>{r['info']}
                                    <img className="d-block" id="myimg" height="150px"/></td>
                                </tr>
                            );
                        }if(video == true){
                            return(
                                <tr>
                                    <td>{r['action']}</td>
                                    <td>{r['time']}min</td>
                                    <td>{r['info']}
                                    <iframe 
                                    className = 'd-block'
                                    width="560" height="315" 
                                    src={link}
                                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                    </td>
                                </tr>
                                );
                        }
                        return(
                            <tr>
                                <td>{r['action']}</td>
                                <td>{r['time']}min</td>
                                <td>{r['info']}</td>
                            </tr>
                            )
                        }
                        )}
                        
                    </tbody>
                </Table>
                {readdetail}
                </CardBody>
                {review}
                            
            </Card>
        
        
    );}
}

export default Projects;
