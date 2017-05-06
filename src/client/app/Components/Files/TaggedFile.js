import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel,Thumbnail } from 'react-bootstrap';

import Selection from "../Select.js"
import FileProperties from "./FileProperties.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

var http = require('http');

// Tagged file
// =============================================================================
// React component to select a tag and a file
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
// Name                 the name of the file
// Info                 the description of the file
// FileUUID             the uuid of the file
// File:                the selected file
//
// Functions
// *****************************************************************************
// Add object2mediatag and a file
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================
export default React.createClass({
  // Model
  // ===========================================================================
  getInitialState: function() {
    return {
      'name_tag': '',
      'uid_tag': -1,
      'Name': '',
      'Info':'',
      'FileUUID':'',
      'File':undefined,
    };
  },
  update_parent: function(_Name,_Info,_File) {
    this.setState({
      'Name': _Name,
      'Info': _Info,
      'File': _File,
    });
  },
  // Functions
  // ===========================================================================
  handleAdd: function() {
    // create new tagged file
    // *************************************************************************
    // store the file as formdata
    // -------------------------------------------------------------------------
    var file2upload =  new FormData()
    file2upload.append('file', this.state.File);

    // get uuid via rest call
    // -------------------------------------------------------------------------
    $.ajax({
      url: encodeURI(sprintf('http://localhost:3300/api/uuid')),
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(data) {
        var _uuid = data.uuid;

        // create data for file post
        // ---------------------------------------------------------------------
        var _edit = {
          "Name":this.state.Name,
          "Info":this.state.Info,
          'FileUUID': _uuid,
        };

        // post file data
        // ---------------------------------------------------------------------
        $.ajax({
          url: 'http://localhost:3300/api/file/',
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
                // post file file
                // -------------------------------------------------------------
                $.ajax({
                  url: 'http://localhost:3300/api/file/upload/'+ _uuid,
                  data: file2upload,
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
                    console.error('http://localhost:3300/api/file 1', status, err.toString());
                  }.bind(this)
                });
              }.bind(this),
              error: function(xhr,status,err) {
                console.error('http://localhost:3300/api/file 2', status, err.toString());
              }.bind(this)
            });
          }.bind(this),
          error: function(xhr,status,err) {
            console.error('http://localhost:3300/api/file 3', status, err.toString());
            // window.location.replace(sprintf("/#/ListEngines/0")); // %s ,getOffet()
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('http://localhost:3300/api/file 4', status, err.toString());
      }.bind(this)
    });
  },
  onTagChange: function(e) {
    // set uid_tag and name_tag when tag was selectedIndex
    // *************************************************************************
    this.setState({uid_tag: e.target.value,name_tag: e.target.childNodes[e.target.selectedIndex].label});
  },
  render: function() {
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <td></td>
            <td width="100%">Add tagged file</td>
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
                    <td>File</td>
                    <td>
                      <Col sm={10}>
                        <Form horizontal>
                          <FileProperties update_parent={this.update_parent} data={this.state}/>
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
    );
  }
});
