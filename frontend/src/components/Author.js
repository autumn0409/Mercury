import React from 'react'

import {
  Card,
  CardBody,
  Collapse,
} from 'reactstrap'

import Post from './Post';

import './Author.css'

class Author extends React.Component {
  state = {
    collapseOpen: false,
  }

  handleAuthorToggle = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    })
  }

  render() {
    const { name, posts } = this.props;

    const authorPosts = posts.map((post) => (
      <Post {...post} key={post.id} />
    ));

    return (
      <Card
        style={{ margin: '30px auto', width: '400px' }}
        outline color='secondary'>
        <CardBody className='d-flex justify-content-between author-name' onClick={this.handleAuthorToggle}>
          <div>{name}</div>
          <div>{`Post number: ${posts.length}`}</div>
        </CardBody>
        <Collapse isOpen={this.state.collapseOpen}>
          {authorPosts}
        </Collapse>
      </Card>
    )
  }
}

export default Author
