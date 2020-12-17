import React from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Nav,
    NavItem,
    NavLink,
    Navbar,
    NavbarBrand,
    Collapse,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    Input,
    Button,
    Badge
} from 'reactstrap';
import firebase from 'firebase';
import { Link } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logodarkicon from '../../assets/images/logo-icon.png';
import logolighticon from '../../assets/images/logo-light-icon.png';
import logodarktext from '../../assets/images/logo-text.png';
import logolighttext from '../../assets/images/logo-light-text.png';

import defaultimage from '../../assets/images/users/default-user-image.png';
import img1 from '../../assets/images/users/1.jpg';
import img2 from '../../assets/images/users/2.jpg';
import img3 from '../../assets/images/users/3.jpg';
import img4 from '../../assets/images/users/4.jpg';
import img5 from '../../assets/images/users/5.jpg';
import img6 from '../../assets/images/users/6.jpg';


import recomm_tag from '../../assets/images/search/recomm_tag.png';
import recomm_lev from '../../assets/images/search/recomm_lev.png';
import { useTranslation } from 'react-i18next'

class BadgeList extends React.Component{
    constructor(props) {
        super(props)
    }

    render () {
        return(
            <div className="taglist" >
                {this.props.query_tag.map((key, index) => {
                    return(
                        <Badge tag={key} className="mx-1" color="info" pill >
                            <i className="mdi mdi-dots-horizontal" /> {key}
                        </Badge>
                    )
                })}
            </div>
        )
    }
}


class RecommTag extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tag: this.props.tag,
            num: 0
        }
    }

    sendTags = (e) => {
        e.preventDefault();
        this.props.function(this.state.tag);
    }

    render() {
        return(
            <Button className="recommtag" onClick={this.sendTags}>{this.state.tag}</Button>
        )
    }
}


class RecommList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            sendthis: 'ddiyong'
        }
    }

    sendTags = (getTag) => {
        this.props.function(getTag);
    }

    getDetection = (getTag) => {
        this.sendTags(getTag);
    }

    render() {
        return(
            <div className="recommlist">
                {this.props.recomm_tags.map((key, index) => {
                    return(
                        <RecommTag tag={key} function={this.getDetection}/>
                    )
                })}
            </div>
        )

    }
}

var STATE = {LOGIN: 0, LOGOUT: 1, CREATE: 2};
class Header extends React.Component{
    constructor (props){
        super(props);
        this.render1 = this.render1.bind(this);
        this._isMounted = false;
        this.loginBtn = this.loginBtn.bind(this);
        this.logoutBtn = this.logoutBtn.bind(this);
        this.createBtn = this.createBtn.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.turnback = this.turnback.bind(this);
        this.login = this.login.bind(this);
        this.submitCreateAccount = this.submitCreateAccount.bind(this);
		this._isMounted = false;
		this.state = {
            mintime: null,
            maxtime: null,
            level: null,
            recomm_tags: [],
            query_tag: [],
            result_tag: '',
            tothenext: false,
            profilephoto: defaultimage,
            text : 'login',
            title_query: null,
            shoulder: false,
            arms: false,
            back: false,
            chest: false,
            abdominals: false,
            legs: false,
            finished: false,
            state: null,
            i18n: null
        }
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }
    image(name){
        if(name){
            var num = name.length % 6;
            console.log(num);
            if(num == 1) return img1;
        if(num == 2) return img2;
        if(num == 3) return img3;
        if(num == 0) return img4;
        if(num == 4) return img5;
        if(num == 5) return img6;
        }
        return img4;
    }
    componentDidMount() {
        this._isMounted = true;
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                var image = this.image(user.displayName);

                this.setState({
                    profilephoto : image,
                    text : 'logout'
                })
                if(this._isMounted){
                    this.setState({
                        state: STATE.LOGOUT
                    })
                }
                var user = firebase.auth().currentUser;
                if(user != null){
                    var name = user.displayName;
                    if(name == null) name = '';
                    if(document.getElementById("user_para")) document.getElementById("user_para").innerHTML = 'Welcome! ' + name;
                }
                var rootRef = firebase.database().ref().child('games');
                rootRef.transaction(function(game){
                    if(game){
                        game.state = user.uid;
                    }
                    return game;
                })
            }
            else{
                if(this._isMounted) {this.setState({
                    state: STATE.LOGIN
                })}
                if(document.getElementById("login-menu")) document.getElementById("login-menu").innerHTML = 'Login';
                this.setState({
                    profilephoto : defaultimage,
                    text : 'login'
                })
            }}
        )
    }

    languageBtn(){
        const { t, i18n } = useTranslation();
        const changelanguageToKo = () => i18n.changeLanguage('ko');
        const changelanguageToEn = () => i18n.changeLanguage('en');

        return (
            <div className='mt-4 d-flex'>
            <a className='mr-1 language'  href={t('href')}>{t('Tutorial')}</a>
            <p className='language' onClick={changelanguageToKo}>한글</p>
            <p className='language ml-1 mr-1'> | </p>
            <p className='language' onClick={changelanguageToEn}>English</p>  
            </div>
        )
    }
    showMobilemenu = () => {
        document.getElementById('main-wrapper').classList.toggle('show-sidebar');
    }

    /*--------------------------------------------------------------------------------*/
    /*To open Search Bar                                                              */
    /*--------------------------------------------------------------------------------*/
    toggleMenu = () => {
        document.getElementById('search').classList.toggle('show-search');
    }

    onChangeMinTime = (e) => {
        this.setState({
            mintime: e.target.value
        })
    }

    onChangeMaxTime = (e) => {
        this.setState({
            maxtime: e.target.value
        })
    }

    onClickShoulder = () => {
        if (this.state.shoulder){
            this.setState({
                shoulder: false
            })
        }else{
            this.setState({
                shoulder: true
            })
        }
    }

    onClickArms = () => {
        if (this.state.arms){
            this.setState({
                arms: false
            })
        }else{
            this.setState({
                arms: true
            })
        }
    }

    onClickBack = () => {
        if (this.state.back){
            this.setState({
                back: false
            })
        }else{
            this.setState({
                back: true
            })
        }
    }

    onClickChest = () => {
        if (this.state.chest){
            this.setState({
                chest: false
            })
        }else{
            this.setState({
                chest: true
            })
        }
    }

    onClickAbdominals = () => {
        if (this.state.abdominals){
            this.setState({
                abdominals: false
            })
        }else{
            this.setState({
                abdominals: true
            })
        }
    }

    onClickLegs = () => {
        if (this.state.legs){
            this.setState({
                legs: false
            })
        }else{
            this.setState({
                legs: true
            })
        }
    }

    onClickLow = () => {
        if (this.state.level === 'low'){
            this.setState({
                level: null
            })
        }else{
            this.setState({
                level: 'low'
            })
        }
    }

    onClickMid = () => {
        if (this.state.level === 'middle'){
            this.setState({
                level: null
            })
        }else{
            this.setState({
                level: 'middle'
            })
        }
    }

    onClickHigh = () => {
        if (this.state.level === 'high'){
            this.setState({
                level: null
            })
        }else{
            this.setState({
                level: 'high'
            })
        }
    }

    onChangeSearch = (e) => {
        var ref = firebase.database().ref().child('tag');
        var inthebox = e.target.value;
        
        this.setState({
            recomm_tags: []
        })

        ref.once('value', snap=>{
            var val = snap.val();
            var tags = [];
            if (inthebox != '' & val != null & this._isMounted){
                for (var key in val){
                    if (key.includes(inthebox)) {
                        tags.push(key)
                    }
                }
            }

            this.setState({
                recomm_tags: tags
            })

        })
    }

    onChangeTitleSearch = (e) => {
        this.setState({
            title_query: e.target.value
        })
    }


    pushTags = (newTag) => {
        if (!this.state.query_tag.includes(newTag) & newTag != null){
            var temp = this.state.query_tag;
            temp.push(newTag);
    
            this.setState(prevState => ({
                query_tag: temp,
                result_tag: this.state.result_tag + "&" + newTag,
                recomm_tags: []
            }));

            document.getElementById("tag-input").reset();
        }
    }

    removeTag = (target) => {
        var temp = this.state.query_tag.filter(x => x != target)

        this.setState({
            query_tag: temp
        })
    }

    resetSearch = (e) => {
        this.setState({
            mintime: null,
            maxtime: null,
            level: null,
            recomm_tags: [],
            query_tag: [],
            result_tag: '',
            bodypart: [],
            title_query: null
        })

        document.getElementById("search").reset();
        this.props.history.replace('/');
    }

    startSearch = (e) => {
        var query_text = this.state.mintime + '&' + this.state.maxtime + '&' + this.state.level + '&' + this.state.bodypart + '&' + this.state.title_query + this.state.result_tag;

        this.setState({
            mintime: null,
            maxtime: null,
            level: null,
            recomm_tags: [],
            query_tag: [],
            result_tag: '',
            bodypart: [],
            title_query: null
        })
        document.getElementById("search").reset();
        this.props.history.replace('/querier/' + query_text);
    }

    login(e){
        e.preventDefault();
        var userEmail = document.querySelector("#email_field");
        var userPass = document.querySelector("#password_field");
        
        document.getElementById("email_field").innerHTML = '';
        document.getElementById("password_field").innerHTML = '';
        firebase.auth().signInWithEmailAndPassword(userEmail.value, userPass.value).catch(function(error){
    
            var errorCode = error.code;
            var errorMessage = error.message;
    
            window.alert("Error : "+errorMessage);
        });
        this.props.history.replace('/');
    }
    turnback(e){
        e.preventDefault();
        if(this._isMounted) {this.setState({
            state: STATE.LOGIN
        })}
    }
    createAccount(e){
        e.preventDefault();
        if(this._isMounted) {this.setState({
            state: STATE.CREATE
        })}
    }

    login(e){
        e.preventDefault();
        var userEmail = document.querySelector("#email_field");
        var userPass = document.querySelector("#password_field");
        
        document.getElementById("email_field").innerHTML = '';
        document.getElementById("password_field").innerHTML = '';
        firebase.auth().signInWithEmailAndPassword(userEmail.value, userPass.value).catch(function(error){
    
            var errorCode = error.code;
            var errorMessage = error.message;
    
            window.alert("Error : "+errorMessage);
        });
        this.props.history.replace('/');
    }
    turnback(e){
        e.preventDefault();
        if(this._isMounted) {this.setState({
            state: STATE.LOGIN
        })}
    }
    createAccount(e){
        e.preventDefault();
        if(this._isMounted) {this.setState({
            state: STATE.CREATE
        })}
    }

    submitCreateAccount(e){
        e.preventDefault();
        var displayName = document.querySelector("#entry-displayname");
        var email = document.querySelector("#entry-email");
        var password = document.querySelector("#entry-password");
        if(true){
            document.getElementById("entry-displayname").innerHTML = '';
            document.getElementById("entry-email").innerHTML = '';
            document.getElementById("entry-password").innerHTML = '';
            console.log(displayName, email, password);
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(){
                var user = firebase.auth().currentUser;
                user.updateProfile({displayName: displayName.value});
            });
            this.props.history.replace('/');
        }else{
            window.alert('password가 일치하지 않습니다')
        }
    }

    logout(e){
        e.preventDefault();
        firebase.auth().signOut();
    }

    loginBtn(){
        return(
            <Card>
                <CardBody>
                    <h2>Login</h2>
                    <input id="email_field" type="email" placeholder="email..."/>
                    <input id="password_field" type="password" placeholder="password..."/>
                    <Button className="button" onClick={this.login}>Sign In</Button>
                    <Button className="button" onClick={this.createAccount} style={{marginLeft:'20px'}}>Sign Up</Button>
                </CardBody>
            </Card>
        );
    }

    createBtn(){
        return(
        <Card>
            <CardBody>

            
        <h2>Create Account</h2>
        <input id="entry-displayname" type="text" placeholder="name..."/>
        <input id="entry-email" type="email" placeholder="email address..."/>
        <input id="entry-password" type="password" placeholder="password..."/>
        <Button className="button" onClick={this.turnback}>Back</Button>
        <Button className="button" onClick={this.submitCreateAccount} style={{marginLeft:'10px'}}>Sign Up</Button>
        
        </CardBody>
        </Card>);
    }

    logoutBtn(){
        return(
            <div>
            <div id="user_para">Welcome User</div>
            <DropdownItem onClick={this.logout}>
            <i className="fa fa-power-off mr-1 ml-1" />LogOut
        </DropdownItem>
        </div>
        )
    }
    render1() {
        const { t, i18n } = useTranslation();
        var text = this.state.text;
        var profilephoto = this.state.profilephoto;
        var btn = null;
        var state = this.state.state;
        
        if(state == STATE.LOGIN){
            btn = <this.loginBtn/>
        }else if(state == STATE.LOGOUT){
            btn = <this.logoutBtn/>
        }else if(state == STATE.CREATE){
            btn = <this.createBtn/>
        }
        if (this.state.tothenext) {
            return (
                <Card />
            )
        }else{
            
            return (
                <header className="topbar navbarbg" data-navbarbg="skin4">
                    <Navbar className="top-navbar" dark expand="md">
                        <div className="navbar-header" id="logobg" data-logobg="skin4">
                            {/*--------------------------------------------------------------------------------*/}
                            {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
                            {/*--------------------------------------------------------------------------------*/}
                            <NavbarBrand href="/">
                                <b className="logo-icon">
                                    <img src={logodarkicon} alt="homepage" className="dark-logo" />
                                    <img
                                        src={logolighticon}
                                        alt="homepage"
                                        className="light-logo"
                                    />
                                </b>
                                <span className="logo-text">
                                    <img src={logodarktext} alt="homepage" className="dark-logo" />
                                    <img
                                        src={logolighttext}
                                        className="light-logo"
                                        alt="homepage"
                                    />
                                </span>
                            </NavbarBrand>
                            {/*--------------------------------------------------------------------------------*/}
                            {/* Mobile View Toggler  [visible only after 768px screen]                         */}
                            {/*--------------------------------------------------------------------------------*/}
                            <button
                                className="btn-link nav-toggler d-block d-md-none text-white"
                                onClick={this.showMobilemenu}
                            >
                                <i className="ti-menu ti-close" />
                            </button>
                        </div>
                        <Collapse
                            className="navbarbg"
                            navbar
                            data-navbarbg="skin4"
                        >
                            <Nav className="float-left" navbar>
                                {/*--------------------------------------------------------------------------------*/}
                                {/* Start Search-box toggle                                                        */}
                                {/*--------------------------------------------------------------------------------*/}
                                <NavItem className="hidden-sm-down search-box">
                                        <div>
                                            <NavLink
                                                href="#"
                                                className="hidden-sm-down"
                                                onClick={this.toggleMenu.bind(null)}
                                            >
                                                <i className="ti-search" />
                                            </NavLink>
                                            <Form className="app-search" id="search">
                                                    <button className="btn-link srh-btn" onClick={() => {this.resetSearch() ; this.toggleMenu.bind(null)}}>
                                                        <i className="ti-close" />
                                                    </button>
                                                <br />
                                                <div>   
                                                    <CardTitle className="time-fnt">{t('header_time')}</CardTitle>
                                                    <Input className="time-input" type="number" onChange={this.onChangeMinTime} />
                                                    <CardText className="time-fnt2">{t('header_min')}</CardText>
                                                    <CardText className="time-fnt3">to</CardText>
                                                    <Input className="time-input2" type="number" onChange={this.onChangeMaxTime} />
                                                    <CardText className="time-fnt4">{t('header_min')}</CardText>
                                                </div>
                                                <div>   
                                                    <CardTitle className="level-fnt">{t('header_level')}</CardTitle>
                                                    {this.state.level === "low" ? <Button className="low-btn-act" onClick={this.onClickLow}>{t('low')}</Button> : <Button className="low-btn" onClick={this.onClickLow}>{t('low')}</Button>}
                                                    {this.state.level === "middle" ? <Button className="mid-btn-act" onClick={this.onClickMid}>{t('middle')}</Button> : <Button className="mid-btn" onClick={this.onClickMid}>{t('middle')}</Button>}
                                                    {this.state.level === "high" ? <Button className="high-btn-act" onClick={this.onClickHigh}>{t('high')}</Button> : <Button className="high-btn" onClick={this.onClickHigh}>{t('high')}</Button>}
                                                </div>
                                                <div>   
                                                    <CardTitle className="bodypart-fnt">{t('header_bodypart')}</CardTitle>
                                                    {this.state.shoulder ? <Button className="shoulder-btn-act" onClick={this.onClickShoulder}>{t('shoulder')}</Button> : <Button className="shoulder-btn" onClick={this.onClickShoulder}>{t('shoulder')}</Button>}
                                                    {this.state.arms ? <Button className="arms-btn-act" onClick={this.onClickArms}>{t('arm')}</Button> : <Button className="arms-btn" onClick={this.onClickArms}>{t('arm')}</Button>}
                                                    {this.state.back ? <Button className="back-btn-act" onClick={this.onClickBack}>{t('back')}</Button> : <Button className="back-btn" onClick={this.onClickBack}>{t('back')}</Button>}
                                                    {this.state.abdominals ? <Button className="abdo-btn-act" onClick={this.onClickAbdominals}>{t('abdominal')}</Button> : <Button className="abdo-btn" onClick={this.onClickAbdominals}>{t('abdominal')}</Button>}
                                                    {this.state.chest ? <Button className="chest-btn-act" onClick={this.onClickChest}>{t('chest')}</Button> : <Button className="chest-btn" onClick={this.onClickChest}>{t('chest')}</Button>}
                                                    {this.state.legs ? <Button className="legs-btn-act" onClick={this.onClickLegs}>{t('leg')}</Button> : <Button className="legs-btn" onClick={this.onClickLegs}>{t('leg')}</Button>}
                                                </div>
                                                <div>   
                                                    <CardTitle className="title-query-fnt">{t('header_title')}</CardTitle>
                                                    <Form id="title-input">
                                                        <Input className="title-query-input" type="text" onChange={this.onChangeTitleSearch} placeholder={t('Type here...')}/>
                                                    </Form>
                                                </div>
                                                <div>   
                                                    <CardTitle className="tag-fnt">{t('header_tag')}</CardTitle>
                                                    {this.state.query_tag.length >= 1 ? <BadgeList query_tag={this.state.query_tag} function={this.removeTag} /> : null}
                                                    <Form id="tag-input">
                                                        <Input className="tag-input" type="text" onChange={this.onChangeSearch} placeholder={t('Type here...')}/>
                                                    </Form>
                                                    {this.state.recomm_tags.length >= 1 ? <RecommList recomm_tags={this.state.recomm_tags} function={this.pushTags}/> : null}
                                                </div>
                                                
                                                <Link to={"/querier/" + this.state.mintime + "&" + this.state.maxtime + "&" + this.state.level + "&" + this.state.title_query + "&" + this.state.shoulder + "&" + this.state.arms + "&" + this.state.back + "&" + this.state.abdominals + "&" + this.state.chest + "&" + this.state.legs + this.state.result_tag}>
                                                    <button className="btn-link search-btn" onClick={this.toggleMenu.bind(null)}>
                                                        <i className="ti-search" />
                                                    </button>
                                                </Link>
                                            </Form>
                                        </div>
                                </NavItem>
                                {/*--------------------------------------------------------------------------------*/}
                                {/* End Search-box toggle                                                          */}
                                {/*--------------------------------------------------------------------------------*/}
                            </Nav>
                            <Nav className="ml-auto float-right" navbar>
                                
                                {/*--------------------------------------------------------------------------------*/}
                                {/* Start Profile Dropdown                                                         */}
                                {/*--------------------------------------------------------------------------------*/}
                                <this.languageBtn/> 
                                <UncontrolledDropdown nav inNavbar>
                                
                                    <DropdownToggle nav caret className="pro-pic">
                                        <img
                                            src={profilephoto}
                                            alt="user"
                                            className="rounded-circle"
                                            width="31"
                                        />
                                    </DropdownToggle>
                                    
                                    <DropdownMenu right className="user-dd">
                                        {/* 
                                        <DropdownItem>
                                            <i className="ti-user mr-1 ml-1" /> My Account
                        </DropdownItem>
                                        <DropdownItem>
                                            <i className="ti-wallet mr-1 ml-1" /> My Balance
                        </DropdownItem>
                                        <DropdownItem className="border-bottom">
                                            <i className="ti-email mr-1 ml-1" /> Inbox
                        </DropdownItem>
                                        <DropdownItem className="border-bottom">
                                            <i className="ti-settings mr-1 ml-1" /> Account Settings
                                        </DropdownItem>*/}
                                        
                        <div className="main-div">{btn}</div>
                                    </DropdownMenu>
                                    
                                </UncontrolledDropdown>
                                {/*--------------------------------------------------------------------------------*/}
                                {/* End Profile Dropdown                                                           */}
                                {/*--------------------------------------------------------------------------------*/}
                            </Nav>
                        </Collapse>
                    </Navbar>
                </header>
            );
        }
    }

    render() {
        return (<this.render1/>);
    }
}
export default Header;
