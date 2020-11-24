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


const Alerts = (props) => {
    const [commonState, setCommonState] = useState({
        title: '',
        time: '',
        level: '',
    });

    const handleCommonChange = (e) => setCommonState({
        ...commonState,
        [e.target.name]: [e.target.value],
    })

    const blankTag = { tag: '' };
    const [tagState, setTagState] = useState([
        { ...blankTag },
    ]);
    const addTag = () => {
        setTagState ([...tagState, {...blankTag}]);
    };

    const handleTagChange = (e) => {
        const updatedTags = [...tagState];
        updatedTags[e.target.dataset.idx] = e.target.value;
        setTagState(updatedTags);
    };
    

    const blankAction = {};
    const [actionState, setActionState] = useState([
        { ...blankAction },
    ]);
    const addAction = () => {
        setActionState ([...actionState, {...blankAction}]);
    };

    const handleActionChange = (e) => {
        const updatedActions = [...actionState];
        updatedActions[e.target.dataset.idx][e.target.name] = e.target.value;
        setActionState(updatedActions);
    };


    const handleWrite = (e) => {
        e.preventDefault();
        var firebase_root = firebase.database().ref().child('routine');
        var pushed = firebase_root.push();
        var pushRef = firebase_root.child(pushed.key);
        if(firebase.auth().currentUser == null){
            alert('login first!');
            return;
        }
        var currentUid = firebase.auth().currentUser.uid;
        var tagRef = firebase.database().ref().child('tag');
        
        console.log(tagState);
        for(var i = 0; i < tagState.length; i++){
            tagRef.child(tagState[i]).push(pushed.key);
        }
        var commonValues = ['level', 'time', 'title'].map(el => commonState[el]);
        pushRef.child('tag').set({
            level: commonValues[0][0],
            time: commonValues[1][0],
            tag: tagState
        });


        console.log(commonState["level"]);
        pushRef.child('img').set(1);
        pushRef.child('uid').set(currentUid);
        pushRef.child('title').set(commonValues[2][0]);
        pushRef.child('routine').set(actionState);
        pushRef.child('name').set("Exercise Noob");
        console.log("Pushed");
        props.history.replace('/');
        //window.open("/");
    };
   
    
    return (
        <div>  
            <Form onSubmit={handleWrite}>
                <FormGroup>
                    <Label for="title">Title of your Routine</Label>
                    <Input type="text" name="title" id="routineTitle" placeholder="Write the title of your Routine" onChange={handleCommonChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="level">Level of hardness</Label>
                    <Input type="select" name="level" id="levelSelect" onChange={handleCommonChange}>
                    <option>low</option>
                    <option>middle</option>
                    <option>high</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="time">Time needed for your routine</Label>
                    <Input type="number" name="time" id="routineTitle" placeholder="Write in minutes" onChange={handleCommonChange}/>
                </FormGroup>
                <FormGroup>
                <Input type="button" value="Add a New Tag" onClick={addTag}/>
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
                                onChange={handleTagChange}
                              />
                              <br></br>
                            </div>
                            
                          );   
                    })
                }
                </FormGroup>
                <br></br><br></br>
                <Input type="button" value="Add a New Action" onClick={addAction}/>
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
                                onChange={handleActionChange}
                              />
                                <Label htmlFor={infoId}>{`Specific steps of action #${idx + 1}`}</Label>
                                <Input
                                type="textarea"
                                rows={Math.round(6)}
                                name="info"
                                data-idx={idx}
                                id={infoId}
                                placeholder = "Describe the information needed to go through your action."
                                onChange={handleActionChange}
                                />
                                <Label htmlFor={timeId}>{`Time required for action #${idx + 1}`}</Label>
                                <Input
                                    type="number"
                                    name="time"
                                    data-idx={idx}
                                    id={timeId}
                                    placeholder = "Type time required for this action in minutes"
                                    onChange={handleActionChange}
                                />
                                <br></br><br></br>
                            </div>
                          );   
                    })
                }
                <Input type="submit" value="Submit" />
            </Form>

     
           

            {/* --------------------------------------------------------------------------------*/}
            {/* End Inner Div*/}
            {/* --------------------------------------------------------------------------------*/}
        </div>
    );
}

export default Alerts;