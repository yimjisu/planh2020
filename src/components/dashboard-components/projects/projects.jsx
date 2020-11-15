import React from "react";

import img1 from 'assets/images/users/1.jpg';
import img2 from 'assets/images/users/2.jpg';
import img3 from 'assets/images/users/3.jpg';
import img4 from 'assets/images/users/4.jpg';

import {
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    CardFooter,
    Input,
    Button,
    Table,
    Row,
    Col,
    Badge
} from 'reactstrap';

const Projects = () => {
    let title = 'Got Chair?';
    let username = 'Exercise Noob';
    let rate = 3;
    let time = 30;
    let level = 'Middle';
    let tags = ['chair', 'leg'];

    return (
        /*--------------------------------------------------------------------------------*/
        /* Used In Dashboard-4 [General]                                                  */
        /*--------------------------------------------------------------------------------*/
        <Card>
                        <CardBody>
                        <div className="d-flex align-items-center">
                <div className="d-flex no-block align-items-center">
                    <div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
                    <div className="">
                    <CardTitle>{title}</CardTitle>
                        <CardSubtitle>by {username}</CardSubtitle></div>
                </div>
                    <div className="ml-auto d-flex no-block align-items-center">
                        <div className="dl">
                         </div>
                    </div>
                </div>
                <div className="d-flex flex-sm-row">
                <Badge className="mx-1" color="primary" pill>
                <i className="mdi mdi-timer" />   {time}min
                  </Badge>
                  <Badge className="mx-1" color="secondary" pill>
                  <i className="mdi mdi-dumbbell" /> {level}
                  </Badge>
                  {tags.map((tag, index) => {
                      return(<Badge className="mx-1" color="info" pill>
                  <i className="mdi mdi-dots-horizontal"/> {tag}
                  </Badge>)})}
                  
                  </div>
                <Table className="no-wrap v-middle" responsive>
                    <thead>
                        <tr className="border-0">
                            <th className="border-0">Action</th>
                            <th className="border-0">Time</th>
                            <th className="border-0">Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Walk</td>
                            <td>5 min</td>
                            <td>
                                info
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <div className="d-flex">
                            <div className="read">
                                <a href="/" className="link font-medium">
                                    Read More Details
                  </a>
                            </div></div>
                        </CardBody>
                            <CardFooter body inverse color="info">
                        <CardTitle>
                        <div className="feed-item">
                            Review <span className="ml-3 font-12 text-muted">
                                Rating
                                {[...Array(rate)].map((n, index) => {
                                    return(
                                        <img className="mx-sm-1" width="20px" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQzOHB0IiB2aWV3Qm94PSIwIC0xMTAgNDM4IDQzNyIgd2lkdGg9IjQzOHB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xNDAuMTcxODc1IDcwLjA4NTkzOGgxNTcuNjU2MjV2NzcuNzAzMTI0aC0xNTcuNjU2MjV6bTAgMCIvPjxwYXRoIGQ9Im00MTUuMTAxNTYyIDQ4Ljk1MzEyNWgtMTAuOTM3NXYxMTQuNTg1OTM3aDEwLjkzNzVjMTIuNjQwNjI2LS4wMTU2MjQgMjIuODg2NzE5LTEwLjI1NzgxMiAyMi44OTg0MzgtMjIuOTAyMzQzdi02OC43ODkwNjNjLS4wMTU2MjUtMTIuNjQwNjI1LTEwLjI2MTcxOS0yMi44ODI4MTItMjIuODk4NDM4LTIyLjg5NDUzMXptMCAwIi8+PHBhdGggZD0ibTM2MS4yNjU2MjUuNWgtNDMuNDM3NXYyMTYuODc1aDQzLjQzNzVjMTIuNjQwNjI1LS4wMTU2MjUgMjIuODg2NzE5LTEwLjI1NzgxMiAyMi44OTg0MzctMjIuODk4NDM4di0xNzEuMDc4MTI0Yy0uMDExNzE4LTEyLjY0MDYyNi0xMC4yNTc4MTItMjIuODgyODEzLTIyLjg5ODQzNy0yMi44OTg0Mzh6bTAgMCIvPjxwYXRoIGQ9Im01My44MzU5MzggMjMuMzk4NDM4djE3MS4wNzgxMjRjLjAxMTcxOCAxMi42NDA2MjYgMTAuMjU3ODEyIDIyLjg4NjcxOSAyMi44OTg0MzcgMjIuODk4NDM4aDQzLjQzNzV2LTIxNi44NzVoLTQzLjQzNzVjLTEyLjY0MDYyNS4wMTU2MjUtMjIuODg2NzE5IDEwLjI1NzgxMi0yMi44OTg0MzcgMjIuODk4NDM4em0wIDAiLz48cGF0aCBkPSJtMCA3MS44NTE1NjJ2NjguNzg1MTU3Yy4wMTE3MTg4IDEyLjY0NDUzMSAxMC4yNTc4MTIgMjIuODg2NzE5IDIyLjg5ODQzOCAyMi45MDIzNDNoMTAuOTM3NXYtMTE0LjU4NTkzN2gtMTAuOTM3NWMtMTIuNjQwNjI2LjAxMTcxOS0yMi44ODI4MTMgMTAuMjU3ODEzLTIyLjg5ODQzOCAyMi44OTg0Mzd6bTAgMCIvPjwvc3ZnPg==" />
                                   )})}
                                {[...Array(5-rate)].map((n, index) => {
                                    return(
                                    <img className="mx-sm-1" width="20px" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQ3OHB0IiB2aWV3Qm94PSIwIC0xMTEgNDc4IDQ3OCIgd2lkdGg9IjQ3OHB0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im00MzUuMTAxNTYyIDQ4LjQ1MzEyNWgtMTAuOTM3NXYtNS41NTQ2ODdjLS4wMjczNDMtMjMuNjc5Njg4LTE5LjIxODc1LTQyLjg3MTA5NDItNDIuODk4NDM3LTQyLjg5ODQzOGgtNTMuNDM3NWMtNS41MjM0MzcgMC0xMCA0LjQ3NjU2Mi0xMCAxMHY1OS41ODU5MzhoLTE1Ny42NTYyNXYtNTkuNTg1OTM4YzAtNS41MjM0MzgtNC40NzY1NjMtMTAtMTAtMTBoLTUzLjQzNzVjLTIzLjY3OTY4Ny4wMjczNDM4LTQyLjg3MTA5NCAxOS4yMTg3NS00Mi44OTg0MzcgNDIuOTAyMzQ0djUuNTUwNzgxaC0xMC45Mzc1Yy0yMy42Nzk2ODguMDI3MzQ0LTQyLjg3MTA5NDIgMTkuMjE4NzUtNDIuODk4NDM4IDQyLjkwMjM0NHY2OC43ODUxNTZjLjAyNzM0MzggMjMuNjc5Njg3IDE5LjIxODc1IDQyLjg3MTA5NCA0Mi44OTg0MzggNDIuODk4NDM3aDEwLjkzNzV2MTAuOTM3NWMuMDI3MzQzIDIzLjY3OTY4OCAxOS4yMTg3NSA0Mi44NzEwOTQgNDIuODk4NDM3IDQyLjg5ODQzOGg1My40Mzc1YzUuNTIzNDM3IDAgMTAtNC40NzY1NjIgMTAtMTB2LTU5LjU4NTkzOGgxNTcuNjU2MjV2NTkuNTg5ODQ0YzAgNS41MTk1MzIgNC40NzY1NjMgMTAgMTAgMTBoNTMuNDM3NWMyMy42Nzk2ODctLjAyNzM0NCA0Mi44NzEwOTQtMTkuMjE4NzUgNDIuODk4NDM3LTQyLjkwMjM0NHYtMTAuOTM3NWgxMC45Mzc1YzIzLjY3OTY4OC0uMDI3MzQzIDQyLjg3MTA5NC0xOS4yMTg3NSA0Mi44OTg0MzgtNDIuODk4NDM3di02OC43OTI5NjljLS4wMjczNDQtMjMuNjc5Njg3LTE5LjIxODc1LTQyLjg2NzE4Ny00Mi44OTg0MzgtNDIuODk0NTMxem0tMzkyLjIwMzEyNCAxMzQuNTg1OTM3Yy0xMi42NDA2MjYtLjAxNTYyNC0yMi44ODI4MTMtMTAuMjU3ODEyLTIyLjg5ODQzOC0yMi44OTg0Mzd2LTY4Ljc5Mjk2OWMuMDExNzE5LTEyLjY0MDYyNSAxMC4yNTc4MTItMjIuODg2NzE4IDIyLjg5ODQzOC0yMi44OTg0MzdoMTAuOTM3NXYxMTQuNTg5ODQzem05Ny4yNzM0MzcgNTMuODM1OTM4aC00My40Mzc1Yy0xMi42NDA2MjUtLjAxNTYyNS0yMi44ODY3MTktMTAuMjU3ODEyLTIyLjg5ODQzNy0yMi45MDIzNDR2LTE3MS4wNzQyMThjLjAxMTcxOC0xMi42NDA2MjYgMTAuMjU3ODEyLTIyLjg4MjgxMyAyMi44OTg0MzctMjIuODk4NDM4aDQzLjQzNzV6bTIwLTY5LjU4OTg0NHYtNzcuNjk5MjE4aDE1Ny42NTYyNXY3Ny42OTkyMTh6bTI0My45OTIxODcgNDYuNjkxNDA2Yy0uMDExNzE4IDEyLjY0MDYyNi0xMC4yNTc4MTIgMjIuODgyODEzLTIyLjg5ODQzNyAyMi44OTg0MzhoLTQzLjQzNzV2LTIxNi44NzVoNDMuNDM3NWMxMi42NDA2MjUuMDE1NjI1IDIyLjg4NjcxOSAxMC4yNTc4MTIgMjIuODk4NDM3IDIyLjkwMjM0NHptNTMuODM1OTM4LTUzLjgzNTkzN2MtLjAxMTcxOSAxMi42NDA2MjUtMTAuMjU3ODEyIDIyLjg4NjcxOS0yMi44OTg0MzggMjIuODk4NDM3aC0xMC45Mzc1di0xMTQuNTg1OTM3aDEwLjkzNzVjMTIuNjQwNjI2LjAxMTcxOSAyMi44ODY3MTkgMTAuMjU3ODEzIDIyLjg5ODQzOCAyMi44OTg0Mzd6bTAgMCIvPjwvc3ZnPg==" />
                                    )})}
                                {rate}
                                </span>
                        </div>
                        </CardTitle>
                        
                        <CardText>
                        
                                
                        <div className="d-flex no-block align-items-center">
                                    <div className="mr-2"><img src={img1} alt="user" className="rounded-circle" width="45" /></div>
                                    <div className="">
                                        <h5 className="mb-0 font-16 font-medium">Anonymouse Jedi</h5><span>Love the detail but too simple</span></div>
                                </div>
                                <div className="d-flex">
                            <div className="read mt-sm-3">
                                <a href="/" className="link font-medium">
                                    Read More Reviews
                  </a>
                            </div></div>
                        </CardText>
                    </CardFooter>
            </Card>
        
        
    );
}

export default Projects;
