import React from 'react';
import firebase from 'firebase';
import {
    Card,
    CardImg,
    CardImgOverlay,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardColumns,
    CardGroup,
    CardDeck,
    CardLink,
    CardHeader,
    CardFooter,
    Button,
    Row,
    Col
} from 'reactstrap';
var STATE = {LOGIN: 0, LOGOUT: 1, CREATE: 2};

class Session extends React.Component{
    constructor(props){
		super(props);
        this.loginBtn = this.loginBtn.bind(this);
        this.logoutBtn = this.logoutBtn.bind(this);
        this.createBtn = this.createBtn.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.turnback = this.turnback.bind(this);
		this._isMounted = false;
		this.state={
			state: null
		}
    }
    
    componentWillUnmount(){
        this._isMounted = false;
    }
    componentDidMount(){
        this._isMounted = true;
        var state;
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                if(document.getElementById("login-menu")) document.getElementById("login-menu").innerHTML = 'Logout';
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
            }else{
                if(this._isMounted) {this.setState({
                    state: STATE.LOGIN
                })}
                if(document.getElementById("login-menu")) document.getElementById("login-menu").innerHTML = 'Login';
            }
          });
          
        

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
        })
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
            <Row>
                <Col>
            <Card>
                <CardBody>
                <CardTitle>Login</CardTitle>
                    <CardColumns>
                    
                    </CardColumns>
                    <CardColumns>
                    <input type="email" placeholder="email address..."/>
                    <input type="password" placeholder="password..."/>
                    </CardColumns>
                    <CardColumns>
                      <Button className="button" onClick={this.login}>Sign In</Button>
                      <Button className="button" onClick={this.createAccount} style={{marginLeft:'10px'}}>Sign Up</Button>
                    </CardColumns>
                </CardBody>
                </Card>
                </Col>
            </Row>
        );
    }

    createBtn(){
        return(
        <Card>
            <CardBody>

            
        <CardTitle>Create Account</CardTitle>
        <input id="entry-displayname" type="text" placeholder="name..."/>
        <input id="entry-email" type="email" placeholder="email address..."/>
        <input id="entry-password" type="password" placeholder="password..."/>
        <ul>
            <Button className="button" onClick={this.turnback}>Back</Button>
          <Button className="button" onClick={this.submitCreateAccount} style={{marginLeft:'10px'}}>Sign Up</Button>
        </ul>
        </CardBody>
        </Card>);
    }

    logoutBtn(){
        return(
                <Card>
                    <CardBody>
                    <CardTitle id="user_para">Welcome User</CardTitle>
                        <Button onClick={this.logout}>Logout</Button>
                    </CardBody>
                    </Card>
        )
    }
    render(){
        var btn = null;
        var state = this.state.state;
        if(state == STATE.LOGIN){
            btn = <this.loginBtn/>
        }else if(state == STATE.LOGOUT){
            btn = <this.logoutBtn/>
        }else if(state == STATE.CREATE){
            btn = <this.createBtn/>
        }
        return(<div>{btn}</div>);
    }
}


export default Session;
