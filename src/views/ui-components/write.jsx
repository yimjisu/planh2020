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

const Alerts = () => {
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
        updatedTags[e.target.dataset.idx]["tag"] = e.target.value;
        setTagState(updatedTags);
    };
   
    const handleWrite = (e) => {
        e.preventDefault();
        console.log("submitted");
        console.log(tagState);
        console.log(commonState);
        console.log(actionState);
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
   
    return (
        <div>  
            <Form onSubmit={handleWrite}>
                <FormGroup>
                    <Label for="title">Title of your Routine</Label>
                    <Input type="text" name="title" id="routineTitle" placeholder="Write the title of your Routine" bsClass="" onChange={handleCommonChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="level">Level of hardness</Label>
                    <Input type="select" name="level" id="levelSelect" onChange={handleCommonChange}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="time">Time needed for your routine</Label>
                    <Input type="number" name="time" id="routineTitle" placeholder="Write in minutes" bsClass="" onChange={handleCommonChange}/>
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
                                bsClass=""
                                placeholder = "Enter the name of your action"
                                onChange={handleActionChange}
                              />
                                <Label htmlFor={infoId}>{`Specific steps of action #${idx + 1}`}</Label>
                                <Input
                                type="textarea"
                                rows={Math.round(6)}
                                name="info"
                                data-idx={idx}
                                bsClass=""
                                id={infoId}
                                placeholder = "Describe the information needed to go through your action."
                                onChange={handleActionChange}
                                />
                                <Label htmlFor={timeId}>{`Time required for action #${idx + 1}`}</Label>
                                <Input
                                    type="number"
                                    name="time"
                                    data-idx={idx}
                                    bsClass=""
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
