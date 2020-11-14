import React from 'react';
import {
    Row,
    Col
} from 'reactstrap';
import { SalesSummary, Projects, Feeds, SocialCards } from 'components/dashboard-components';

const Starter = () => {
    return (
        <div>
             <h5 className="mb-3">My Page</h5>
            <Row>
                <Col sm={6} lg={4}>
                    <Feeds />
                </Col>
                <Col sm={6} lg={4}>
                    <Projects />
                </Col>
            </Row>
            <h5 className="mb-3">Explore routines</h5>
            <SocialCards />
        </div>
    );
}

export default Starter;