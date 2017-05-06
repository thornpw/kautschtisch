import React from 'react'
import { Link } from 'react-router'
import { Button,ButtonGroup,ButtonToolbar,Panel,Form,FormGroup,FormControl,Col,ControlLabel,Thumbnail } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// PictureProperties
// =============================================================================
// React component to display the class Picture. It is used to add and edit objects
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
// -Info                description of the URL
// -File                the picture file
//
//
// Model (state)
// *****************************************************************************
// Name                 name of the link
// Info                 description of the URL
// File                 the picture file
// imagePreviewUrl      the URL of the preview thumbnail
//
// Functions
// *****************************************************************************
// onNameChange               callback for typing the name and put it into the state
// onInfoChange               callback for typing the description and put it into the state
// onImageChange              callback for selcting a picture and put it into the state
// componentWillReceiveProps  get data from the parent
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class PictureProperties extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      Name: '',
      Info: '',
      File:'',
      imagePreviewUrl:''
    }
  }

  onNameChange(e) {
    this.setState({Name: e.target.value});
    if(this.props.update_parent) {
      this.props.update_parent(e.target.value,this.state.Info,this.state.File)
    }
  }

  onInfoChange(e) {
    this.setState({Info: e.target.value});
    if(this.props.update_parent) {
      this.props.update_parent(this.state.Name,e.target.value,this.state.File)
    }
  }

  onImageChange(e) {
    // read in the picture while when a file was selected
    // *************************************************************************
    e.preventDefault();

    let reader = new FileReader();
    let selected_file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        File: selected_file,
        imagePreviewUrl: reader.result
      });
    }
    if(e.target.files.length > 0) {
      reader.readAsDataURL(selected_file)
    }
    else {
      this.setState({File:undefined,imagePreviewUrl: ''})
    }
    if(this.props.update_parent) {
      if(e.target.files.length > 0) {
        this.props.update_parent(this.state.Name,this.state.Info,e.target.files[0])
      } else {
        this.props.update_parent(this.state.Name,this.state.Info,undefined)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data != null) {
      this.setState({
        'Name': nextProps.data.Name,
        'Info': nextProps.data.Info,
        'File': nextProps.data.File
      })
    }
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = undefined;
    if (imagePreviewUrl) {
      $imagePreview = (<Thumbnail src={imagePreviewUrl} />);
    }

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
        <FormGroup controlId="Info">
          <Col componentClass={ControlLabel} sm={2}>
            Info
          </Col>
          <Col sm={10}>
            <FormControl onChange={this.onInfoChange.bind(this)} value= {this.state.Info}  />
          </Col>
        </FormGroup>
        <FormGroup controlId="Picture">
          <Col componentClass={ControlLabel} sm={2}>
            Picture
          </Col>
          <Col sm={10}>
            {
              this.props.data != null && this.props.data.FileUUID != null && this.props.data.FileUUID != '' ?
                <Thumbnail key="b" src={this.props.data.FileUUID != '' ? "http://localhost:3300/uploads/"+this.props.data.FileUUID : null}/>
                : null
            }
            <input type="file" onChange={this.onImageChange.bind(this)} />
            <div className="imgPreview">
              {$imagePreview}
            </div>
          </Col>
        </FormGroup>
      </div>
    );
  }
};
