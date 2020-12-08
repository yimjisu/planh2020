import React, { useState } from 'react';
import {
    Alert,
    UncontrolledAlert,
    Card,
    CardBody,
    CardTitle,
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText
} from 'reactstrap';
import firebase from 'firebase';


class Alerts extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.handleWrite = this.handleWrite.bind(this);
        this.addTag = this.addTag.bind(this);
        this.addAction = this.addAction.bind(this);
        this.handleCommonChange = this.handleCommonChange.bind(this);
        this.state = {
            commonState : {title:'', time:'', level:''},

            tagState : ['',],
            actionState : ['',],

            title: null,
            level: null,
            time: null,
            body: {'arm': false, 'shoulder': false, 'back': false, 'chest': false, 'leg':false, 'abdominal':false}
        };
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){
        this._isMounted = true;
        const key = this.props.match.params.key;
        if(key == null) return;
        const ref = firebase.database().ref().child('routine').child(key);
        var title='', level='', time='', tagState=['',], actionState=['',];
        var body = '';
        ref.on('value', snap => {
            var val = snap.val();
            if(val!=null){
            if(val.title) title = val.title;
            if(val.tag.level)level = val.tag.level;
            if(val.tag.time)time = val.tag.time;
            if(val.tag.tag)tagState = val.tag.tag;
            if(val.routine) actionState = val.routine;
            if(val.tag.bodypart) body = val.tag.bodypart;
            for(var key in body){
            document.getElementById(key).checked = body[key];
            }
            if(level){
                document.getElementById('level-'+level).checked = true;
            }
            this.setState({
                title : title,
                level : level,
                time : time,
                commonState : [title, level, time],
                tagState : tagState,
                actionState : actionState,
                body: body
            });
            }
        }); 
              
    }
    addAction(){
        var newaction = this.state.actionState;
        newaction.push('');
        this.setState({
            actionState : newaction
        });
    }

    addTag(){
        var newtag = this.state.tagState;
        newtag.push('');
        this.setState({
            tagState : newtag
        });
    }

    handleCommonChange(e){
       this.setState({
           [e.targetname] : [e.target.value]
       });
    }

    handleTagChange(e){

    }

    handleActionChange(e){
    }

    handleWrite(e){
        e.preventDefault();

        var user = firebase.auth().currentUser;
        var title = document.getElementById('routineTitle').value;
        var level;
        var time = document.getElementById('routineTime').value;

        var levelkey = ['low', 'middle', 'high'];
        for(var i=0; i<3; i++)
        if(document.getElementById('level-'+levelkey[i]).checked) level = levelkey[i];
        const storage = firebase.storage();

        if(user == null){
            alert('login first!');
            return;
        }
         if(title == ''){
            alert('Fill in the title!');
            return;
        }
        if (time == ''){
            alert('Fill in the time!');
            return;
        }      
        var bodystate = this.state.body;
        for (var key in this.state.body){
            console.log(key);
            var check = document.getElementById(key).checked;
            bodystate[key] = check;
        }
        var tagState = [];  
        for(var i = 0; i < this.state.tagState.length; i++){
            var tag = document.getElementById(`tag-${i}`).value;
            if(tag == ''){
                alert('Fill in the tag!');
                return;
            }else{
                tagState.push(tag);
            }
        }
        if(level == null) level = 'low';

        var firebase_root = firebase.database().ref().child('routine');
        var pushRef = null;
        var key = this.props.match.params.key;
        if(key){
            pushRef = firebase_root.child(key);
        }else{        
        var pushed = firebase_root.push();
        pushRef = firebase_root.child(pushed.key);
        key = pushed.key
        }
        
        var currentUid = firebase.auth().currentUser.uid;
        var tagRef = firebase.database().ref().child('tag');
        
        for(var i = 0; i < tagState.length; i++){
            if(typeof tagState[i] == 'string') 
                tagRef.child(tagState[i]).push(key);
        }
        
        var actionState = [];
        const promises = [];
        for(var i=0; i<this.state.actionState.length; i++){
            var action = document.getElementById(`action-${i}`).value;
            var info = document.getElementById(`info-${i}`).value;
            var routinetime = document.getElementById(`time-${i}`).value;
            var video = document.getElementById(`video-${i}`).value;
            if(video == '') video = null;
            var imageFile = document.getElementById(`image-${i}`).files[0];
            var imageName = currentUid + '-' + action + '-' + i;

            if(imageFile){
                const uploadTask = storage.ref(`/images/${imageName}`).put(imageFile);
                const pending = new Promise(function(resolve, reject) {
                    uploadTask.on("state_changed", console.log, console.error, () => {
                        storage
                            .ref("images")
                            .child(imageName)
                            .getDownloadURL()
                            .then((url) => {
                                actionState.push({
                                    action : action,
                                    time: routinetime,
                                    info : info,
                                    imageUrl : url,
                                    videoUrl : video
                                });
                                resolve();
                            });
                        
                    });
                })  
                promises.push(pending);
            } else {
                var url = null;
                if(Object.keys(this.state.actionState[i]).includes('imageUrl'))
                    url = this.state.actionState[i].imageUrl;
                actionState.push({
                    action : action,
                    time: routinetime,
                    info : info,
                    imageUrl : url,
                    videoUrl : video
                });
            }            
        }
        pushRef.child('tag').set({
            level: level,
            time: time,
            bodypart: bodystate,
            tag: tagState
        });
        pushRef.child('img').set(1);
        pushRef.child('uid').set(currentUid);
        pushRef.child('title').set(title);
        pushRef.child('name').set(user.displayName);
        Promise.all(promises).then(tasks => {
            pushRef.child('routine').set(actionState);
            console.log("completed!");
            this.props.history.replace('/');
        })
        
    };
    
    render(){
        
        var time = this.state.time;
        var title = this.state.title;
        var level = this.state.level;
        var tagState = this.state.tagState;
        var actionState = this.state.actionState;
        var body = this.state.body;
    return (
        <div>  
            <Form onSubmit={(e) => this.handleWrite(e)}>
                <FormGroup>
                    <Label for="title">Title of your Routine</Label>
                    <Input type="text" name="title"  defaultValue={title} id="routineTitle" placeholder="Write the title of your Routine" onChange={(e) => this.handleCommonChange(e)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="level">Level of difficulty</Label>
                    <div className='d-flex'>
                    {['low', 'middle', 'high'].map((key, value) => {
                        return(
                        <div className='d-inline ml-5'>
                        <Input type="radio" name="level" id={'level-'+key}/> {key}
                        </div>);
                    })}
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for="time">Time needed for your routine</Label>
                    <Input type="number" name="time"  step='0.01' defaultValue={time} id="routineTime" placeholder="Write in minutes"onChange={(e) => this.handleCommonChange(e)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="body">Body part used in your routine</Label>
                    <div className='d-flex'>
                    {Object.entries(body).map(([key, value]) => {
                        return(
                        <div className='d-inline ml-5'>
                        <Input type="checkbox" name="body" id={key}/> {key}
                        </div>);
                    })}
                    </div>
                </FormGroup>
                <FormGroup>
                <h4>Add your tag</h4>
                {
                    tagState.map((val, idx) => {
                        const tagId = `tag-${idx}`;
                        return (
                            <div key={`tag-${idx}`}>
                              <Label htmlFor={tagId}>{`Tag #${idx + 1}`}</Label>
                              <Input
                                type="text"
                                name={tagId}
                                data-idx={idx}
                                id={tagId}
                                className="tag"
                                placeholder = "Enter tag name"
                                defaultValue={val}
                                onChange={(e) => this.handleTagChange(e)}
                              />
                              <br></br>
                            </div>
                            
                          );   
                    })
                }
                <Input type="button" value="Add a New Tag" onClick={() => this.addTag()}/>
                </FormGroup>
                <br></br><br></br>
                <FormGroup>
                <h4>Write your Routine</h4>
                
                {
                    actionState.map((val, idx) => {
                        const actionId = `action-${idx}`;
                        const infoId = `info-${idx}`;
                        const timeId = `time-${idx}`;
                        const imageId = `image-${idx}`;
                        const videoId = `video-${idx}`;
                        return (
                            <div key={`action-${idx}`}>
                              <Label htmlFor={actionId}>{`Name of action #${idx + 1}`}</Label>
                              <Input
                                type="text"
                                name="action"
                                data-idx={idx}
                                id={actionId}
                                placeholder = "Enter the name of your action"
                                defaultValue={val['action']}
                                onChange={(e) => this.handleActionChange(e)}
                              />
                                <Label htmlFor={infoId}>{`Specific steps of action #${idx + 1}`}</Label>
                                <Input
                                type="textarea"
                                rows={Math.round(6)}
                                name="info"
                                data-idx={idx}
                                id={infoId}
                                placeholder = "Describe the information needed to go through your action."
                                defaultValue={val['info']}
                                />
                                <Label htmlFor={timeId}>{`Time required for action #${idx + 1}`}</Label>
                                <Input
                                    type="number"
                                    name="time"
                                    step="0.01"
                                    data-idx={idx}
                                    id={timeId}
                                    placeholder = "Type time required for this action in minutes"
                                    defaultValue={val['time']}
                                />
                                Upload an image to describe your action.
                                <Input
                                    type="file"
                                    name="image"
                                    data-idx={idx}
                                    id={imageId}
                                    placeholder="Image file for explanation"
                                /> 
                                <img src={val['imageUrl']} alt=""/>
                                Video Url (Youtube)
                                <Input
                                    type="text"
                                    name="video"
                                    data-idx={idx}
                                    id={videoId}
                                    placeholder = "Type in url of the video you would like to upload starting with http"
                                    defaultValue={val['videoUrl']}

                                />
                                <br></br><br></br>
                            </div>
                          );   
                    })
                }
                <Input type="button" value="Add a New Action" onClick={() => this.addAction()}/>
                </FormGroup>

                <h4>Now your done! Submit now</h4>
                <Input type="submit" value="Submit" />
            </Form>

     
           

            {/* --------------------------------------------------------------------------------*/}
            {/* End Inner Div*/}
            {/* --------------------------------------------------------------------------------*/}
        </div>
    );}
}

export default Alerts;