import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

import {
  SUBS_QUERY,
  CREATE_POST_MUTATION,
  POSTS_SUBSCRIPTION,
} from '../lib/graphql'

import Author from './Author'
import classes from '../containers/App/App.module.css'

let unsubscribe = null

class CreatePost extends Component {
  state = {
    formTitle: '',
    formBody: '',
    dropdownOpen: false,
    dropdownSub: '',
    subList: []
  }

  setUsers = (subs) => {
    console.log("set Subs",subs)
    this.setState({
      subList: subs.map(sub => ({
        id: sub.id,
        name: sub.name,
      }))
    });
  }

  nameToId = (name) => {
    const targetSub = this.state.subList.find(sub => {
      return sub.name === name;
    });
    return targetSub.id;
  }

  handleFormSubmit = e => {
    e.preventDefault()

    const { formTitle, formBody, dropdownSub} = this.state

    if (!formTitle || !formBody || !dropdownSub) return
    this.createPost({
      variables: {
        title: formTitle,
        body: formBody,
        published: true,
        sub: this.nameToId(dropdownSub)
      }
    })

    console.log(formTitle,formBody,true,this.nameToId(dropdownSub))

    this.setState({
      formTitle: '',
      formBody: ''
    })
  }

  handleDropdownToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handleDropdownSelect = (subName) => {
    this.setState({
      dropdownSub: subName,
      dropdownOpen: false,
    });
  }

  render() {
    const { subList } = this.state;
    const subMenu = subList.map((sub, id) => (
      <DropdownItem
        key={id}
        onClick={() => { this.handleDropdownSelect(sub.name) }}>
        {sub.name}
      </DropdownItem>
    ));

    return (
      <Container  >
        <Row>
          <Col xs="6" className={classes.form}>
            <Mutation mutation={CREATE_POST_MUTATION}>
              {createPost => {
                this.createPost = createPost
                return (
                  <Form onSubmit={this.handleFormSubmit}>
                     <FormGroup row>
                      <Label for="sub" sm={2}>
                        Sub
                      </Label>
                      <Col sm={10}>
                        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.handleDropdownToggle}>
                          <DropdownToggle caret outline>
                            {this.state.dropdownSub === '' ?
                              'Select an sub' : this.state.dropdownSub}
                          </DropdownToggle>
                          <DropdownMenu>
                            {subMenu}
                          </DropdownMenu>
                        </ButtonDropdown>
                      </Col>
                    </FormGroup>
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
                      Post!
                    </Button>
                  </Form>
                )
              }}
            </Mutation>
          </Col>
          <Col>
          <Query query={SUBS_QUERY} onCompleted={data =>this.setUsers(data.subs)}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(((</p>;
     //             console.log("data",data)
                
                const authors = data.subs.map((sub) => (
                  <Author {...sub} key={sub.id} />
                ))

                if (!unsubscribe)
                  unsubscribe = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;

                      const NewPost = subscriptionData.data.post.data;

                      const NewUsers = prev.users.map(user => {
                        if (user.name === NewPost.author.name) {
                          return {
                            ...user,
                            posts: [NewPost, ...(user.posts)],
                          };
                        }
                        else
                          return user;
                      });

                      return {
                        users: NewUsers,
                      };
                    }
                  })

                return <div></div>
              }}
            </Query>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default CreatePost
