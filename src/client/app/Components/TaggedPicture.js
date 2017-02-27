import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel,Thumbnail } from 'react-bootstrap';

import Selection from "../Components/Select.js"

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
// id_tag:              id of selected tag
// imagePreviewUrl:     the preview of the file
// file:                the selected file
//
// Functions
// *****************************************************************************
// Add Tag and Picture as KPicture
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
      name_tag: '',
      id_tag: -1,
      imagePreviewUrl: '',
      file: null
    };
  },
  // Functions
  // ===========================================================================
  handleAdd: function() {
    // create new tagged picture
    // *************************************************************************
    // store the picture as formdata
    // -------------------------------------------------------------------------
    var photo =  new FormData()
    photo.append('photo', this.state.file);

    // get uuid via rest call
    // -------------------------------------------------------------------------
    $.ajax({
      url: encodeURI(sprintf('/api/uuid')),
      dataType: 'json',
      type: 'GET',
      cache: false,
      success: function(data) {
        var _uuid = data[0].uuid;

        // create data for picture post
        // ---------------------------------------------------------------------
        var _edit = {
          'id_tag': this.state.id_tag,
          'uid_object': this.props.uid_object,
          'uuid': _uuid
        };

        // post picture data
        // ---------------------------------------------------------------------
        $.ajax({
          url: '/api/picture/',
          data: _edit,
          dataType: 'json',
          type: 'POST',
          success: function(data){
            // post picture file
            // -----------------------------------------------------------------
            $.ajax({
              url: '/api/picture/upload/'+ _uuid,
              data: photo,
              cache: false,
              contentType: false,
              processData: false,
              type: 'POST',
              success: function(data){
                console.log("ok");
                this.setState({
                  id_tag:-1,
                  name_tag:'',
                  imagePreviewUrl:'',
                  file: null
                })
                this.props.doParentRedraw();
               }.bind(this),
              error: function(xhr,status,err) {
                console.error('/api/picture 1', status, err.toString());
                // window.location.replace(sprintf("/#/ListEngines/0")); // %s ,getOffet()
              }.bind(this)
            });
          }.bind(this),
          error: function(xhr,status,err) {
            console.error('/api/picture 1', status, err.toString());
            // window.location.replace(sprintf("/#/ListEngines/0")); // %s ,getOffet()
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  onTagChange: function(e) {
    // set id_tag and name_tag when tag was selectedIndex
    // *************************************************************************
    this.setState({id_tag: e.target.value,name_tag: e.target.childNodes[e.target.selectedIndex].label});
  },
  onImageChange(e) {
    // read in the picture while when a file was selected
    // *************************************************************************
    e.preventDefault();

    let reader = new FileReader();
    let selected_file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: selected_file,
        imagePreviewUrl: reader.result
      });
    }
    if(e.target.files.length > 0) {
      reader.readAsDataURL(selected_file)
    }
    else {
      this.setState({file:null,imagePreviewUrl: ''})
    }
  },
  render: function() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<Thumbnail src={imagePreviewUrl} />);
    }

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
                this.state.id_tag > 0 && this.state.file != null && this.state.file.size > 0 ?
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
                        <Selection target="tag" filters={this.props.filters} column="name" value="a" change_function={this.onTagChange}/>
                      </Col>
                    </td>
                  </tr>
                  <tr>
                    <td>Picture</td>
                    <td>
                      <Col sm={10}>
                        <input type="file" onChange={(e)=>this.onImageChange(e)} />
                        <div className="imgPreview">
                          {$imagePreview}
                        </div>
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
