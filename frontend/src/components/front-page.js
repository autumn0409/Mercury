import React, { Component } from 'react';

import { BrowserRouter as Router} from "react-router-dom";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  NavLink
} from 'reactstrap';

import mj_1 from '../images/mj (1).jpg'
import mj_2 from "../images/mj (2).jpg"
import mj_3 from '../images/mj (3).jpg'
import gossiping_img from'../images/gossip.jpg'
import sport_img from '../images/sports.jpg'
import news_img from '../images/media.jpg'
import react_img from '../images/react.png'
import beauty_img from '../images/beauty.jpg'
import trump_img from '../images/donaldTrump.jpg'
import MEGA_img from '../images/MEGA.jpg'


const items = [
    {
      src: gossiping_img,
      altText: 'Slide 1',
      caption: 'Gossiping'
    },

    {
      src: news_img,
      altText: 'Slide 3',
      caption: 'News'
    },
    {
      src: react_img,
      altText: 'Slide 4',
      caption: 'React'
    },
    {
      src: mj_1,
      altText: 'Slide 5',
      caption: 'Music'
    },
    {
      src: beauty_img,
      altText: 'Slide 6',
      caption: 'Beauty'
    },
    {
      src: trump_img,
      altText: 'Slide 7',
      caption: 'DonaldTrumpSupporters'
    },
    {
      src: MEGA_img,
      altText: 'Slide 8',
      caption: 'MEGA'
    }


  ];

class FrontPage extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    

    const slides = items.map((item) => {
      const caption = (<a href={"/sub/"+item.caption}
                          style={{color:"white"}} >{item.caption}</a>)
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <img src={item.src} alt={item.altText} href={"/"+item.caption} style={{ width:"100%"}}/>
          <CarouselCaption  captionText={caption} captionHeader={caption} ></CarouselCaption>
        </CarouselItem>
 
      );
    });

    return (
        <Router>
              <Carousel
                activeIndex={activeIndex}
                next={this.next}
                previous={this.previous}
            >
                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
               
                {slides}
                
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
            </Carousel>
        </Router>
    
    );
  }
}


export default FrontPage;