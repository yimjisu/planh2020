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
            tagState : [],
            actionState : [],
            title: null,
            level: null,
            time: null
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
        var title='', level='', time='', tagState=[], actionState=[];
        ref.on('value', snap => {
            var val = snap.val();
            if(val!=null){
            if(val.title) title = val.title;
            if(val.tag.level)level = val.tag.level;
            if(val.tag.time)time = val.tag.time;
            if(val.tag.tag)tagState = val.tag.tag;
            if(val.routine) actionState = val.routine;
            this.setState({
                title : title,
                level : level,
                time : time,
                commonState : [title, level, time],
                tagState : tagState,
                actionState : actionState
            }) 
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
        var level = document.getElementById('levelSelect').value;
        var time = document.getElementById('routineTime').value;

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
        for(var i=0; i<this.state.actionState.length; i++){
            var action = document.getElementById(`action-${i}`).value;
            var info = document.getElementById(`info-${i}`).value;
            var routinetime = document.getElementById(`time-${i}`).value;
            actionState.push({
                action : action,
                time: routinetime,
                info : info
            })
        }
        pushRef.child('tag').set({
            level: level,
            time: time,
            tag: tagState
        });
        pushRef.child('img').set(1);
        pushRef.child('uid').set(currentUid);
        pushRef.child('title').set(title);
        pushRef.child('routine').set(actionState);
        pushRef.child('name').set(user.displayName);
        this.props.history.replace('/');
    };
    
    render(){
        
        var time = this.state.time;
        var title = this.state.title;
        var level = this.state.level;
        var tagState = this.state.tagState;
        var actionState = this.state.actionState;
    return (
        <div>  
            <Form onSubmit={(e) => this.handleWrite(e)}>
                <FormGroup>
                    <Label for="title">Title of your Routine</Label>
                    <Input type="text" name="title"  defaultValue={title} id="routineTitle" placeholder="Write the title of your Routine" onChange={(e) => this.handleCommonChange(e)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="level">Level of hardness</Label>
                    <Input type="select" name="level" id="levelSelect"  defaultValue={level} onChange={(e) => this.handleCommonChange(e)}>
                    <option>low</option>
                    <option>middle</option>
                    <option>high</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="time">Time needed for your routine</Label>
                    <Input type="number" name="time"  defaultValue={time} id="routineTime" placeholder="Write in minutes"onChange={(e) => this.handleCommonChange(e)}/>
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
                                    data-idx={idx}
                                    id={timeId}
                                    placeholder = "Type time required for this action in minutes"
                                    defaultValue={val['time']}
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