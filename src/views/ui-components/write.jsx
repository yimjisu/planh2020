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
import {useTranslation} from 'react-i18next';


class Alerts extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.handleWrite = this.handleWrite.bind(this);
        this.addTag = this.addTag.bind(this);
        this.addAction = this.addAction.bind(this);
        this.handleCommonChange = this.handleCommonChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.render1 = this.render1.bind(this);
        this.state = {
            commonState : {title:'', time:'', level:''},

            tagState : ['',],
            actionState : [{},],

            title: null,
            level: null,
            time: null,
            promises: [],
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
        var title='', level='', time='', tagState=['',], actionState=[{},];
        var body = {'arm': false, 'shoulder': false, 'back': false, 'chest': false, 'leg':false, 'abdominal':false};
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
                if(document.getElementById(key)) document.getElementById(key).checked = body[key];
            }
            if(level && document.getElementById('level-'+level)){
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
        newaction.push({});
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
           [e.target.name] : [e.target.value]
       });
    }

    handleTagChange(e){

    }

    handleActionChange(e){
    }

    handleImageChange(e){
        console.log(e);
        var currentUid = firebase.auth().currentUser.uid;
        var i = e.target.id;
        var action = document.getElementById(`action-${i}`).value;
        const storage = firebase.storage();
        var imageFile = e.target.files[0];
        var imageName = currentUid + '-' + action + '-' + i;
        console.log(imageFile);
        var promises = this.state.promises;
        var actionState = this.state.actionState;
        if(imageFile){
            const uploadTask = storage.ref(`/images/${imageName}`).put(imageFile);
            const pending = new Promise(function(resolve, reject) {
                uploadTask.on("state_changed", console.log, console.error, () => {
                    storage
                        .ref("images")
                        .child(imageName)
                        .getDownloadURL()
                        .then((url) => {
                            console.log(url);
                            actionState[i]['imageUrl'] = url;
                            resolve();
                        });
                    
                });
            })

            promises.push(pending);
            this.setState({
                actionState: actionState,
                promises: promises
            })
        }
    }

    handleWrite(e){
        e.preventDefault();
        const { t, i18n } = useTranslation();
        var user = firebase.auth().currentUser;
        var title = document.getElementById('routineTitle').value;
        var level;
        var time = document.getElementById('routineTime').value;

        var levelkey = ['low', 'middle', 'high'];
        for(var i=0; i<3; i++)
        if(document.getElementById('level-'+levelkey[i]).checked) level = levelkey[i];
        

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
        
        var actionState = this.state.actionState;
        const promises = this.state.promises;
        for(var i=0; i<this.state.actionState.length; i++){
            var action = document.getElementById(`action-${i}`).value;
            var info = document.getElementById(`info-${i}`).value;
            var routinetime = document.getElementById(`time-${i}`).value;
            var routinetimeUnit = document.getElementById(`timeunit-${i}`).value;
            var video = document.getElementById(`video-${i}`).value;
            console.log(video, i);
            if(video == '') video = null;
            
            var url = null;
            if(this.state.actionState[i] && 'imageUrl' in this.state.actionState[i])
                url = this.state.actionState[i].imageUrl;
            console.log(url, video);
            actionState[i] = {
                action : action,
                time: routinetime,
                timeUnit: routinetimeUnit,
                info : info,
                imageUrl : url,
                videoUrl : video
            };           
        }
        pushRef.child('tag').set({
            level: level,
            time: time,
            tag: tagState,
            bodypart: bodystate
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
    

    render1(){
        var time = this.state.time;
        var title = this.state.title;
        var level = this.state.level;
        var tagState = this.state.tagState;
        var actionState = this.state.actionState;
        var body = this.state.body;
        const { t, i18n } = useTranslation();
    return (
        
        <div>  
            <Form onSubmit={(e) => this.handleWrite(e)}>
                <FormGroup>
                    <Label for="title">{t('write_title')}</Label>
                    <Input type="text" name="title"  defaultValue={title} id="routineTitle" placeholder={t('write_title_placeholder')} onChange={(e) => this.handleCommonChange(e)}/>
                </FormGroup>
                <FormGroup>
                    <Label for="level">{t('write_level')}</Label>
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
                    <Label for="time">{t('write_time')}</Label>
                    <div className='d-flex'>
                    <Input type="number" name="time"  step='1' 
                    defaultValue={time} id="routineTime" 
                    placeholder={t('write_time_placeholder')}
                    onChange={(e) => this.handleCommonChange(e)}/>
                    <p className='mt-2 mb-0'>min</p></div>
                </FormGroup>
                <FormGroup>
                    <Label for="body">{t('write_body')}</Label>
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
                <h4>{t('write_tag_main')}</h4>
                {
                    tagState.map((val, idx) => {
                        const tagId = `tag-${idx}`;
                        return (
                            <div key={`tag-${idx}`}>
                              <Label htmlFor={tagId}>{t('write_tag')}{` #${idx + 1}`}</Label>
                              <Input
                                type="text"
                                name={tagId}
                                data-idx={idx}
                                id={tagId}
                                className="tag"
                                placeholder = {t('write_tag_add')}
                                defaultValue={val}
                                onChange={(e) => this.handleTagChange(e)}
                              />
                              <br></br>
                            </div>
                            
                          );   
                    })
                }
                <Input type="button" value={t('write_tag_add')} onClick={() => this.addTag()}/>
                </FormGroup>
                <br></br><br></br>
                <FormGroup>
                <h4>{t('write_action_main')}</h4>
                
                {
                    actionState.map((val, idx) => {
                        const actionId = `action-${idx}`;
                        const infoId = `info-${idx}`;
                        const timeId = `time-${idx}`;
                        const timeUnitId = `timeunit-${idx}`;
                        const imageId = idx;
                        const videoId = `video-${idx}`;
                        return (
                            <div key={`action-${idx}`}>
                              <Label htmlFor={actionId}>{t('write_action')}{` #${idx + 1}`}</Label>
                              <Input
                                type="text"
                                name="action"
                                data-idx={idx}
                                id={actionId}
                                placeholder = {t('write_action_placeholder')}
                                defaultValue={val['action']}
                                onChange={(e) => this.handleActionChange(e)}
                              />
                                <Label htmlFor={infoId}>{t('write_action_steps')}{` #${idx + 1}`}</Label>
                                <Input
                                type="textarea"
                                rows={Math.round(6)}
                                name="info"
                                data-idx={idx}
                                id={infoId}
                                placeholder = {t('write_action_steps_placeholder')}
                                defaultValue={val['info']}
                                />
                                <Label htmlFor={timeId}>{t('write_time')}{` #${idx + 1}`}</Label>
                                <div className='d-flex'>
                                <Input
                                    type="number"
                                    name="time"
                                    step="1"
                                    data-idx={idx}
                                    id={timeId}
                                    placeholder = {t('write_time_placeholder')}
                                    defaultValue={val['time']}
                                />
                                <Input
                                    type='select'
                                    name="time"
                                    style={{width: '100px'}}
                                    data-idx={idx}
                                    id={timeUnitId}
                                    defaultValue={val['timeUnit']}
                                ><option>min</option>
                                <option>sec</option>
                                <option>times</option></Input>
                                </div>
                                {t('write_upload')}
                                <Input
                                    type="file"
                                    name="image"
                                    data-idx={idx}
                                    id={imageId}
                                    placeholder={t('write_upload_placeholder')}
                                    onChange={(e) => this.handleImageChange(e)}
                                /> 
                                <img src={val['imageUrl']} alt=""/>
                                {t('write_video')}
                                <Input
                                    type="text"
                                    name="video"
                                    data-idx={idx}
                                    id={videoId}
                                    placeholder = {t('write_video_placeholder')}
                                    defaultValue={val['videoUrl']}

                                />
                                <br></br><br></br>
                            </div>
                          );   
                    })
                }
                <Input type="button" value={t('write_action_add')} onClick={() => this.addAction()}/>
                </FormGroup>

                <h4>{t('write_submit_text')}</h4>
                <Input type="submit" value={t('write_submit_button')} />
            </Form>

     
           

            {/* --------------------------------------------------------------------------------*/}
            {/* End Inner Div*/}
            {/* --------------------------------------------------------------------------------*/}
        </div>
    );}

    render(){
        return(<this.render1/>);
    } 
}

export default Alerts;