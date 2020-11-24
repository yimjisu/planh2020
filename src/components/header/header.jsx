import React from 'react';
import {
    Card,
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
import profilephoto from '../../assets/images/users/1.jpg';

import recomm_tag from '../../assets/images/search/recomm_tag.png';
import recomm_lev from '../../assets/images/search/recomm_lev.png';


class BadgeList extends React.Component{
    constructor(props) {
        super(props)
    }

    sendTarget = (e) => {
        this.props.function(e.target.tag)
    }

    render () {
        return(
            <div className="taglist" >
                {this.props.query_tag.map((key, index) => {
                    return(
                        <Badge onClick={(e) => this.sendTarget(e)} tag={key} className="mx-1" color="info" pill >
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


class Header extends React.Component{
    constructor (props){
        super(props);
        this._isMounted = false;
        this.state = {
            mintime: null,
            maxtime: null,
            level: null,
            recomm_tags: [],
            query_tag: [],
            result_tag: '',
            tothenext: false
        }
    }

    componentWillUnmount() {
        this.__isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
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

    resetSearch = () => {
        this.setState({
            mintime: null,
            maxtime: null,
            level: null,
            recomm_tags: [],
            query_tag: [],
            result_tag: ''
        })
        document.getElementById("search").reset();
    }

    startSearch = () => {
        this.setState({
            tothenext: true
        })
    }

    render() {
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
                                    {!window.location.href.includes('queried') ?
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
                                                    <CardTitle className="time-fnt">Time</CardTitle>
                                                    <Input className="time-input" type="number" onChange={this.onChangeMinTime} />
                                                    <CardText className="time-fnt2">min</CardText>
                                                    <CardText className="time-fnt3">to</CardText>
                                                    <Input className="time-input2" type="number" onChange={this.onChangeMaxTime} />
                                                    <CardText className="time-fnt4">min</CardText>
                                                </div>
                                                <div>   
                                                    <CardTitle className="level-fnt">Level</CardTitle>
                                                    {this.state.level === "low" ? <Button className="low-btn-act" onClick={this.onClickLow}>Low</Button> : <Button className="low-btn" onClick={this.onClickLow}>Low</Button>}
                                                    {this.state.level === "middle" ? <Button className="mid-btn-act" onClick={this.onClickMid}>Middle</Button> : <Button className="mid-btn" onClick={this.onClickMid}>Middle</Button>}
                                                    {this.state.level === "high" ? <Button className="high-btn-act" onClick={this.onClickHigh}>High</Button> : <Button className="high-btn" onClick={this.onClickHigh}>High</Button>}
                                                </div>
                                                <div>   
                                                    <CardTitle className="tag-fnt">Tag</CardTitle>
                                                    {this.state.query_tag.length >= 1 ? <BadgeList query_tag={this.state.query_tag} function={this.removeTag} /> : null}
                                                    <Form id="tag-input">
                                                        <Input className="tag-input" type="text" onChange={this.onChangeSearch} placeholder="Type here..."/>
                                                    </Form>
                                                    {this.state.recomm_tags.length >= 1 ? <RecommList recomm_tags={this.state.recomm_tags} function={this.pushTags}/> : null}
                                                </div>
                                                <Link to={"/ui-components/queried?" + this.state.mintime + "&" + this.state.maxtime + "&" + this.state.level + this.state.result_tag}>
                                                    <button className="btn-link search-btn" onClick={this.toggleMenu.bind(null)}>
                                                        <i className="ti-search" />
                                                    </button>
                                                </Link>
                                            </Form>
                                        </div>
                                        :
                                        null
                                    }
                                    
                                </NavItem>
                                {/*--------------------------------------------------------------------------------*/}
                                {/* End Search-box toggle                                                          */}
                                {/*--------------------------------------------------------------------------------*/}
                            </Nav>
                            <Nav className="ml-auto float-right" navbar>
                                
                                {/*--------------------------------------------------------------------------------*/}
                                {/* Start Profile Dropdown                                                         */}
                                {/*--------------------------------------------------------------------------------*/}
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret className="pro-pic">
                                        <img
                                            src={profilephoto}
                                            alt="user"
                                            className="rounded-circle"
                                            width="31"
                                        />
                                    </DropdownToggle>
                                    {/*
                                    <DropdownMenu right className="user-dd">
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
                        </DropdownItem>
                                        <DropdownItem href="/pages/login">
                                            <i className="fa fa-power-off mr-1 ml-1" /> Logout
                        </DropdownItem>
                                    </DropdownMenu>
                                    */}
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
}
export default Header;
