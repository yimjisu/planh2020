import React from "react";

import firebase from 'firebase'; 
import img1 from 'assets/images/users/1.jpg';
import dumbbell1 from 'assets/images/dumbbell.png';
import dumbbell2 from 'assets/images/dumbbell (1).png';
import img2 from 'assets/images/users/2.jpg';
import img3 from 'assets/images/users/3.jpg';
import img4 from 'assets/images/users/4.jpg';

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
        this.state = {
            title: null,
            name: null,
            rate: 1,
            time: 0,
            level: null,
            tags: [],
            routine: []
        };
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){
        this._isMounted = true;
        var ref = firebase.database().ref();
        if(this.props.my){
            ref = ref.child('myroutine')
        }else{
            ref = ref.child('routine');
        }
        var routineRef = ref.child(this.props.props);
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
                   routine: routine
               })
            }
        });

    }

    render(){
    let title = this.state.title;
    let username = this.state.name;
    let rate = this.state.rate;
    let time = this.state.time;
    let level = this.state.level;
    let tags = this.state.tags;
    let routine = this.state.routine;
    let detail = "hidden";
    if(this.props.detail) detail = "no-wrap";
    return (
        /*--------------------------------------------------------------------------------*/
        /* Used In Dashboard-4 [General]                                                  */
        /*--------------------------------------------------------------------------------*/
                <Card>
                        <CardBody>
                        <div className="d-flex align-items-center">
                <div className="d-flex no-block align-items-center">
                    <div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
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
                                <a className="link font-medium">
                                    Read More Details
                  </a>
                            </div></div>
                        </CardBody>
                            <CardFooter body inverse color="info">
                        <CardTitle>
                        <div className="feed-item">
                            Review <span className="ml-3 font-12 text-muted">
                                Rating
                                {[...Array(rate)].map((n, index) => {
                                    return(<img className="mx-sm-1" width="20px" src={dumbbell1} />
                                )})}
                                {[...Array(5-rate)].map((n, index) => {
                                    return(<img className="mx-sm-1" width="20px" src={dumbbell2} />
                                )})}
                                {rate}
                                </span>
                        </div>
                        </CardTitle>
                        
                        <CardText>
                        
                                
                        <div className="d-flex no-block align-items-center">
                                    <div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
                                    <div className="">
                                        <h5 className="mb-0 font-16 font-medium">Anonymouse Jedi</h5><span>Love the detail but too simple</span></div>
                                </div>
                                <div className="d-flex">
                            <div className="read mt-sm-3">
                                <a href="/" className="link font-medium">
                                    Read More Reviews
                  </a>
                            </div></div>
                        </CardText>
                    </CardFooter>
            </Card>
        
        
    );}
}

export default Projects;
