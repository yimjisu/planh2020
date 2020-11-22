
import React from 'react';
import {
    Row,
    Col
} from 'reactstrap';
import { SalesSummary, Projects, Feeds, SocialCards } from 'components/dashboard-components';

class Detail extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
    console.log(this.props.match.params.key);
    return (
        <div>
            <Row>
                <Col sm={12}>
                    <Projects props={this.props.match.params.key} detail={true} my={false}/>
                </Col>
            </Row>
        </div>
    );}
}

export default Detail;