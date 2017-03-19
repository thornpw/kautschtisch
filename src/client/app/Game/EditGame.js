import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,PanelGroup,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';
import request from 'superagent';

import Selection from "../Components/Select.js"
import ListGame2Tags from "../Game2Tag/ListGame2Tags.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_game_offset } from './ListGames';

function logChange(val) {
    console.log("Selected: " + val);
}

export default React.createClass({
  getInitialState: function() {
    return {
      name: '',
      activeTagKey:1,
    };
  },
  componentDidMount: function() {
    this.loadGame();
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  loadGame: function() {
    // load new game from the DB
    // -------------------------------------------------------------------------
    $.ajax({
      url: 'http://localhost:3300/api/db/KGame/'+this.props.params.id,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({'id_game': data[0].id,'name':data[0].name});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('http://localhost:3300/api/game', status, err.toString());
      }.bind(this)
    });
  },
  handleEdit: function() {
    // edit game
    // -------------------------------------------------------------------------
    var _edit = {"name":this.state.name}
    var _id = this.props.params.id;

    $.ajax({
      url: 'http://localhost:3300/api/game/'+_id,
      contentType: 'application/json; charset=UTF-8',
      type: 'PUT',
      data: JSON.stringify(_edit),
      success: function(data) {
        console.log("ok")
        window.location.replace(sprintf("/#/ListGames/%s",get_game_offset()));
      },
      error: function(xhr, status, err) {
        console.log(status,xhr,err);
        console.error('/api/game', status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Edit game">
          <Form horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onNameChange} value= {this.state.name}  />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button onClick={this.handleEdit}>Ok</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf('/ListGames/%s',get_game_offset())}><Button>Cancel</Button></Link>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
          <PanelGroup activeKey={this.state.activeGame2TagKey} onSelect={this.handleGame2TagSelect} accordion>
            <Panel header="Tags" eventKey="1">
              <ListGame2Tags id_game={this.state.id_game} offset='0'/>
            </Panel>
          </PanelGroup>
        </Panel>
      </div>
    );
  }
});
