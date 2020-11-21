
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

const Alerts = () => {
    const blankTag = { tag: '' };
    const [tagState, setTagState] = useState([
        { tag: ''},
    ]);
    const addTag = () => {
        setTagState ([...tagState, {...blankTag}]);
    };

    return (
        <div>  
            <Form>
                <FormGroup>
                    <Label for="title">Title of your Routine</Label>
                    <Input type="text" name="title" id="routineTitle" placeholder="Write the title of your Routine" />
                </FormGroup>
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
                              />
                            </div>
                          );   
                    })
                }
                
                <FormGroup>
                    <Label for="exampleText">Text Area</Label>
                    <Input type="textarea" name="text" id="exampleText" />
                </FormGroup>
                <Input type="submit" value="Submit" />
            </Form>

     
           

            {/* --------------------------------------------------------------------------------*/}
            {/* End Inner Div*/}
            {/* --------------------------------------------------------------------------------*/}
        </div>
    );
}

export default Alerts;
