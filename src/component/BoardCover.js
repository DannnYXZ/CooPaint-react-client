import React from "react";
import "./Button.css"
import "./BoardCover.css"
import Button from "./Button";
import Drop from "./Drop";

class BoardCover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOptionsOpened: false};
  }

  render() {
    return (
        <div className="board-cover">
          <div className="board-img" onClick={this.props.onClick}>
            <img src={this.props.img}/>
          </div>
          <div className="board-info">
            <span>{this.props.name}</span>
            <Button className="rnd-btn" style={{width: 25, height: 25}}
                    onClick={() => this.setState({isOptionsOpened: !this.state.isOptionsOpened})}>
              <img className="btn-img" src="dots.svg"/>
              <Drop isOpened={this.state.isOptionsOpened} style={{right: 4}}>
                {[<Button onClick={() => {
                  this.props.onDelete();
                  this.setState({isOptionsOpened: false})
                }}>Delete</Button>]}
              </Drop>
            </Button>
          </div>
        </div>
    );
  }
}

export default BoardCover;