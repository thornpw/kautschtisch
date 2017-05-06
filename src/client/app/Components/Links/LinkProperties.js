import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// LinkProperties
// =============================================================================
// React component to display the class Link. It is used to add and edit objects
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
// -URL                 link URL
// -Info                description of the URL
// -IsPicture           flag to determine that the link is a picture
// -IsVideo             flag to determine that the link is a video

//
// Model (state)
// *****************************************************************************
// Name                 name of the link
// URL                  link URL
// Info                 description of the URL
// IsPicture            flag to determine that the link is a picture
// IsVideo              flag to determine that the link is a video
//
// Functions
// *****************************************************************************
// onNameChange               callback for typing the name and put it into the state
// onInfoChange               callback for typing the description and put it into the state
// onURLChange                callback for typing the URL and put it into the state
// onIsPictureChange          callback for switching the IsPicutre flag and put it into the state
// onIsVideoChange            callback for switching the IsVideo flag and put it into the state
// componentWillReceiveProps  get data from the parent
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

class LinkProperties extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      Name: '',
      URL: '',
      Info: '',
      IsPicture:false,
      IsVideo:false,
    }
  }

  onNameChange(e) {
    console.log(e.target.value)
    this.setState({Name: e.target.value});
    if(this.props.update_parent) {
      this.props.update_parent(e.target.value,this.state.URL,this.state.Info,this.state.IsPicture,this.state.IsVideo)
    }
  }

  onURLChange(e) {
    this.setState({URL: e.target.value});
    if(this.props.update_parent) {
      this.props.update_parent(this.state.Name,e.target.value,this.state.Info,this.state.IsPicture,this.state.IsVideo)
    }
  }

  onInfoChange(e) {
    this.setState({Info: e.target.value});
    if(this.props.update_parent) {
      this.props.update_parent(this.state.Name,this.state.URL,e.target.value,this.state.IsPicture,this.state.IsVideo)
    }
  }

  onIsPictureChange() {
    this.setState({IsPicture: !this.state.IsPicture});
    if(this.props.update_parent) {
      this.props.update_parent(this.state.Name,this.state.URL,this.state.Info,!this.state.IsPicture,this.state.IsVideo)
    }
  }

  onIsVideoChange() {
    this.setState({IsVideo: !this.state.IsVideo});
    if(this.props.update_parent) {
      this.props.update_parent(this.state.Name,this.state.URL,this.state.Info,this.state.IsPicture,!this.state.IsVideo)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data != null) {
      this.setState({
        'Name': nextProps.data.Name,
        'URL': nextProps.data.URL,
        'Info': nextProps.data.Info,
        'IsPicture': nextProps.data.IsPicture,
        'IsVideo': nextProps.data.IsVideo
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
        <FormGroup controlId="URL">
          <Col componentClass={ControlLabel} sm={2}>
            URL
          </Col>
          <Col sm={10}>
            <FormControl onChange={this.onURLChange.bind(this)} value= {this.state.URL}  />
          </Col>
        </FormGroup>
        <FormGroup controlId="Info">
          <Col componentClass={ControlLabel} sm={2}>
            Info
          </Col>
          <Col sm={10}>
            <FormControl onChange={this.onInfoChange.bind(this)} value= {this.state.Info}  />
          </Col>
        </FormGroup>
        <FormGroup controlId="IsPicture">
          <Col componentClass={ControlLabel} sm={2}>
            Link is a picture
          </Col>
          <Col sm={10}>
            <input
              type="checkbox"
              checked={this.state.IsPicture}
              onChange={this.onIsPictureChange.bind(this)}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="IsVideo">
          <Col componentClass={ControlLabel} sm={2}>
            Link is a video
          </Col>
          <Col sm={10}>
            <input type="checkbox"
              checked={this.state.IsVideo}
              onChange={this.onIsVideoChange.bind(this)}
            />
          </Col>
        </FormGroup>
      </div>
    )
  }
}

export {
  LinkProperties
}
