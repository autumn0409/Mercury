import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from 'reactstrap'

import {
    FIND_POST_QUERY,
    UPDATE_POST_MUTATION,
} from '../lib/graphql'

import classes from '../containers/App/App.module.css'

class EditPost extends Component {
    state = {
        formTitle: '',
        formBody: '',
    }

    setEditForm = originalPost => {
        const { title, body } = originalPost;
        this.setState({
            formTitle: title,
            formBody: body,
        })
    }

    handleFormSubmit = e => {
        e.preventDefault()

        const { formTitle, formBody } = this.state;
        const { history } = this.props;
        const { postId } = this.props.match.params;

        this.updatePost({
            variables: {
                id: postId,
                title: formTitle,
                body: formBody,
            }
        }).then(() => {
            this.setState({
                formTitle: '',
                formBody: ''
            })

            history.goBack()
        })
    }

    render() {
        const { postId } = this.props.match.params;

        return (
            <Container>
                <Row>
                    <Col xs="6" className={classes.form}>
                        <Mutation mutation={UPDATE_POST_MUTATION}>
                            {updatePost => {
                                this.updatePost = updatePost
                                return (
                                    <Form onSubmit={this.handleFormSubmit}>
                                        <FormGroup row>
                                            <Label for="title" sm={2}>
                                                Title
                                            </Label>
                                            <Col sm={10}>
                                                <Input
                                                    name="title"
                                                    value={this.state.formTitle}
                                                    id="title"
                                                    placeholder="Post title..."
                                                    onChange={e =>
                                                        this.setState({ formTitle: e.target.value })
                                                    }
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="body">Content:</Label>
                                            <Input
                                                type="textarea"
                                                name="body"
                                                value={this.state.formBody}
                                                id="body"
                                                placeholder="Post body..."
                                                onChange={e =>
                                                    this.setState({ formBody: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                        <Button type="submit" color="primary">
                                            Edit!
                                        </Button>
                                    </Form>
                                )
                            }}
                        </Mutation>
                    </Col>
                </Row>
                <Query
                    query={FIND_POST_QUERY}
                    variables={{ id: postId }}
                    fetchPolicy={"cache-and-network"}
                    onCompleted={data => this.setEditForm(data.findPostById)}
                    children={() => { return null }} />
            </Container>
        )
    }
}

export default withRouter(EditPost)
