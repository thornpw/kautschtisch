import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,HelpBlock } from 'react-bootstrap';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import { get_engine_offset } from './ListEngines';

export default React.createClass({
  getInitialState: function() {
    return {name: '',executable: '',id_system:'',name_system:''};
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  onExecutableChange: function(e) {
    this.setState({executable: e.target.value});
  },
  onSystemChange: function(e) {
    this.setState({id_system: e.target.value,name_system: e.target.childNodes[e.target.selectedIndex].label});
  },
  handleAdd: function(e) {
    e.preventDefault();
    // add new Engine to memory
    // -------------------------------------------------------------------------
    var _new = {'name':this.state.name, 'executable':this.state.executable,'id_system':this.state.id_system}

    // send new Engine to the db
    // -------------------------------------------------------------------------
    $.ajax({
      url: '/api/engine',
      dataType: 'json',
      type: 'POST',
      data: _new,
      success: function(data) {
        this.setState({'name':'','executable':'','id_system':''});
        window.location.replace(sprintf("/#/ListEngines/%s",get_engine_offset()));
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/api/engine', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <Panel header="Add new engine">
          <Form onSubmit={this.handleAdd} horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onNameChange} value= {this.state.name}  />
              </Col>
            </FormGroup>
            <FormGroup controlId="executable">
              <Col componentClass={ControlLabel} sm={2}>
                Executable
              </Col>
              <Col sm={10}>
                <FormControl onChange={this.onExecutableChange} value = {this.state.executable} />
              </Col>
            </FormGroup>
            <FormGroup controlId="system">
              <Col componentClass={ControlLabel} sm={2}>
                System
              </Col>
              <Col sm={4}>
                <Link to={sprintf('/EditSystem/%s',this.state.id_system)}>
                  <FormControl disabled onChange={this.onExecutableChange} value = {this.state.name_system} />
                </Link>
              </Col>
              <Col sm={6}>
                  <Selection target="system" filters='-' column="name" value="a" change_function={this.onSystemChange}/>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <ButtonGroup>
                    <Button type="submit" bsStyle="success"><img src="media/gfx/ok.png"/></Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Link to={sprintf('/ListEngines/%s',get_engine_offset())}><Button><img src="media/gfx/cancel.png"/></Button></Link>
                  </ButtonGroup>              
                </ButtonToolbar>
              </Col>
            </FormGroup>
          </Form>
        </Panel>
      </div>
    );
  }
});
