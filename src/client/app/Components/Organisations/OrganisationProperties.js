import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// OrganisationProperties
// =============================================================================
// React component to display the class Organisation. It is used to add and edit objects
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// update_parent        write the state attributes back to the parent
// data                 the attributes from the parent
// -Name                name of the link
//
// Model (state)
// *****************************************************************************
// Name                 name of the link
//
// Functions
// *****************************************************************************
// onNameChange               callback for typing the name and put it into the state
// componentWillReceiveProps  get data from the parent
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class OrganisationProperties extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      Name: '',
    }
  }

  onNameChange(e) {
    this.setState({Name: e.target.value});
    if(this.props.update_parent) {
      this.props.update_parent(e.target.value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data != null) {
      this.setState({
        'Name': nextProps.data.Name
      })
    }
  }

  render() {
    return (
      <div>
        <FormGroup controlId="Name">
          <Col componentClass={ControlLabel} sm={2}>
            Name
          </Col>
          <Col sm={10}>
            <FormControl onChange={this.onNameChange.bind(this)} value= {this.state.Name}  />
          </Col>
        </FormGroup>
      </div>
    )
  }
}
