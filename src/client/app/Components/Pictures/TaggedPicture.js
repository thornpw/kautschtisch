import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel,Thumbnail } from 'react-bootstrap';

import { Selection } from "../Select.js"
import { PictureProperties } from "./PictureProperties.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

var http = require('http');

// Tagged picture
// =============================================================================
// React component to select a tag and a picture
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// uid_object:          {this.props.uid_object}
// filters:             string to filter the selectable tags
//                      syntax:     ({column name}|{filter value}[|])*
//                      no filter:  '-'
//                      example:    id_tag_category|8
// doParentReadraw:     function to redraw parent
//
// Model (state)
// *****************************************************************************
// name_tag:            name of selected tag
// uid_tag:             id of selected tag
// Name                 the name of the picture
// Info                 the description of the picture
// FileUUID             the uuid of the picture
// File:                the selected file
//
// Functions
// *****************************************************************************
// Add object2mediatag and a picture
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================
export class TaggedPicture extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      'name_tag': '',
      'uid_tag': -1,
      'Name': '',
      'Info':'',
      'FileUUID':'',
      'File':undefined,
    };
  }

  update_parent(_Name,_Info,_File) {
    this.setState({
      'Name': _Name,
      'Info': _Info,
      'File': _File,
    });
  }

  // Functions
  // ===========================================================================
  handleAdd() {
    // create new tagged picture
    // *************************************************************************
    // store the picture as formdata
    // -------------------------------------------------------------------------
    var photo =  new FormData()
    photo.append('photo', this.state.File);

    // get uuid via rest call
    // -------------------------------------------------------------------------
    $.ajax({
      url: encodeURI(sprintf('http://localhost:3300/api/uuid')),
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(data) {
        var _uuid = data.uuid;

        // create data for picture post
        // ---------------------------------------------------------------------
        var _edit = {
          "Name":this.state.Name,
          "Info":this.state.Info,
          'FileUUID': _uuid,
        };

        // post picture data
        // ---------------------------------------------------------------------
        $.ajax({
          url: 'http://localhost:3300/api/picture/',
          data: _edit,
          dataType: 'json',
          type: 'POST',
          success: function(data){
            var _edit_object2mediatag = {
              'TagUID': this.state.uid_tag,
              'ObjectUID': this.props.uid_object,
              'MediaUID': data.uid
            };
            // post object to media tag
            // -----------------------------------------------------------------
            $.ajax({
              url: 'http://localhost:3300/api/object2mediatag/',
              data: _edit_object2mediatag,
              dataType: 'json',
              type: 'POST',
              success: function(data){
                // post picture file
                // -------------------------------------------------------------
                $.ajax({
                  url: 'http://localhost:3300/api/picture/upload/'+ _uuid,
                  data: photo,
                  cache: false,
                  contentType: false,
                  processData: false,
                  type: 'POST',
                  success: function(data){
                    this.setState({
                      File: undefined
                    })
                    this.props.doParentRedraw();
                  }.bind(this),
                  error: function(xhr,status,err) {
                    console.error('http://localhost:3300/api/picture 1', status, err.toString());
                  }.bind(this)
                });
              }.bind(this),
              error: function(xhr,status,err) {
                console.error('http://localhost:3300/api/picture 2', status, err.toString());
              }.bind(this)
            });
          }.bind(this),
          error: function(xhr,status,err) {
            console.error('http://localhost:3300/api/picture 3', status, err.toString());
            // window.location.replace(sprintf("/#/ListEngines/0")); // %s ,getOffet()
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('http://localhost:3300/api/picture 4', status, err.toString());
      }.bind(this)
    });
  }

  onTagChange(e) {
    // set uid_tag and name_tag when tag was selectedIndex
    // *************************************************************************
    this.setState({uid_tag: e.target.value,name_tag: e.target.childNodes[e.target.selectedIndex].label});
  }

  render() {
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <td></td>
            <td width="100%">Add tagged picture</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {
                this.state.uid_tag != '' && this.state.Name != '' && this.state.File != undefined && this.state.File.size > 0 ?
                  <Button bsStyle="success" onClick={this.handleAdd}><img src="media/gfx/add.png"/></Button>
                  : <Button bsStyle="success" onClick={this.handleAdd} disabled><img src="media/gfx/add.png"/></Button>
              }
            </td>
            <td>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>Tag</td>
                    <td>
                      <Col sm={3}>
                        <FormControl disabled value = {this.state.name_tag} />
                      </Col>
                      <Col sm={7}>
                        <Selection
                          target="KAvailableSupportedObjectMediaTag"
                          uid_object={this.props.uid_object}
                          object_filter={this.props.object_filter}
                          media_type={this.props.media_type}
                          display_column="Name"
                          value="a"
                          change_function={this.onTagChange}/>
                      </Col>
                    </td>
                  </tr>
                  <tr>
                    <td>Picture</td>
                    <td>
                      <Col sm={10}>
                        <Form horizontal>
                          <PictureProperties update_parent={this.update_parent} data={this.state}/>
                        </Form>
                      </Col>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </td>
          </tr>
        </tbody>
      </Table>
    )
  }
}
