import React from 'react';
//import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { withRouter } from 'react-router-dom'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

class Subs extends React.Component {

    state = {
        isOpen: false,
    }

    onSelect = (selected) => {
        let to = '/sub/' + selected;

        if (selected === "Home") {
            to = '/frontPage';
        }

        if (window.location.pathname !== to) {
            this.props.history.push(to);
        }
        this.setState({
            isOpen: false
        })
    }

    handleToggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        return (
            <div>
                <SideNav
                    style={{background: "black",height:"200%" }}
                    onSelect={this.onSelect}
                    expanded={this.state.isOpen}
                    onToggle={this.handleToggle}
                >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="Home">
                        <NavItem eventKey="Home">
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Home
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="Gossiping">
                            <NavIcon>
                                <i className="fa fa-fw fa-comments" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Gossiping
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="News">
                            <NavIcon>
                                <i className="fa fa-fw fa-newspaper" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                News
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="React">
                            <NavIcon>
                                <i className="fab fa-fw fa-react" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                React
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="Music">
                            <NavIcon>
                                <i className="fa fa-fw fa-music" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText>
                                Music
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="Beauty">
                            <NavIcon>
                                <i className="fas fa-grin-hearts" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                Beauty
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="ImGoingToHellForThis">
                            <NavIcon>
                                <i class="fas fa-skull-crossbones" style={{ fontSize: '1.75em' }} ></i>

                            </NavIcon>
                            <NavText>
                                ImGoingToHellForThis
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="DigiCurrency">
                            <NavIcon>
                                <i class="fab fa-btc" style={{ fontSize: '1.75em' }} ></i>

                            </NavIcon>
                            <NavText>
                                DigiCurrency
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="DonaldTrumpSupporters">
                            <NavIcon>
                                <i className="fas fa-fist-raised" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                DonaldTrumpSupporters
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="MEGA">
                            <NavIcon>
                                <i className="fas fa-flag-usa" style={{ fontSize: '1.75em' }}></i>
                            </NavIcon>
                            <NavText>
                                MEGA
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>

            </div>
        );
    }
}

export default withRouter(Subs);