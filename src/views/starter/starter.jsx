import React from 'react';
import {
    Row,
    Col
} from 'reactstrap';
import { SalesSummary, Projects, Feeds, SocialCards } from '../../components/dashboard-components';
import firebase from 'firebase';
import ThemeRoutes from '../../routes/routing.jsx';
import { useTranslation } from 'react-i18next'
class Starter extends React.Component {
    constructor(props){
        super(props);
        this._isMounted = false;
        this.mypage = this.mypage.bind(this);
        this.render1 = this.render1.bind(this);
        this.state = {keys:[], myroutine:[]};
    }
    componentWillUnmount() {
		this._isMounted = false;
	 }
    componentDidMount(){

        this._isMounted = true;
        var ref = firebase.database().ref().child('routine');
        var uid = null;
        
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                uid = user.uid;
            }else{
                uid = null;
            }
            ref.on('value', snap => {
                var val = snap.val();
                if(val!=null & this._isMounted){
                    var keys = [];
                    var myroutine = [];
                    for(var key in val){
                        if(val[key]['uid'] == uid){
                                myroutine.push(key);
                        }
                        else{
                            keys.push(key)
                        }
                    }
                    this.setState({keys: keys, myroutine: myroutine});
                }
            })
        });
        

        
    }

    mypage(){
        const { t, i18n } = useTranslation();
        return(
            <div>
            <h5 className="mb-3">{t('My Page')}</h5>
            <Row>
                {this.state.myroutine.map((key, index) => {
                    return(
                        <Col sm={6} lg={4}><Projects props={key} detail={false} my={true}/></Col>)
                })}
            </Row>
            </div>
        );
    }
    render(){
        return(<this.render1/>);
    }
    render1(){
        const { t, i18n } = useTranslation();
        var user = firebase.auth().currentUser;
        var mypage = null;
        if (user != null && this.state.myroutine.length > 0){
            mypage = <this.mypage/>;
        }

    return (
        <div>
            {mypage}
            <h5 className="mb-3">{t('Explore routines')}</h5>
            <Row>
                {this.state.keys.map((key, index) => {
                    return(
                <Col sm={6} lg={4}>
                    <Projects props={key} detail={false} my={false}/>
                </Col>
                )})}
            </Row>
        </div>
    )}
}

export default Starter;