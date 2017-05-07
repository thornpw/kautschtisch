import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel,Thumbnail } from 'react-bootstrap';

import { Selection } from "../Select"
import { LinkProperties } from "./LinkProperties"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

var http = require('http');

// Tagged link
// =============================================================================
// React component to select a tag and a link
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
// doParentReload       reload the parent data
//
// Model (state)
// *****************************************************************************
// name_tag:            name of selected tag
// uid_tag:             id of selected tag
// Name:                name of the link
// URL:                 URL of the link
// Info:                description of the link
// IsPicture:           flag if the link is a picture
// IsVideo:             flag if the link is a video
//
// Functions
// *****************************************************************************
// Creates a object2mediatag and a Link
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class TaggedLink extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name_tag: '',
      uid_tag: undefined,
      Name: '',
      URL:'',
      Info:'',
      IsPicture:false,
      IsVideo:false,
    }
  }

  // Functions
  // ===========================================================================
  update_parent(_Name,_URL,_Info,_IsPicture,_IsVideo) {
    this.setState({
      Name: _Name,
      URL: _URL,
      Info: _Info,
      IsPicture: _IsPicture,
      IsVideo: _IsVideo
    });
  }

  handleAdd() {
    // create new tagged link
    // *************************************************************************
    // post link
    // ---------------------------------------------------------------------
    var _edit = {
      "Name":this.state.Name,
      "URL":this.state.URL,
      "Info":this.state.Info,
      "IsPicture":this.state.IsPicture,
      "IsVideo":this.state.IsVideo
    };

    $.ajax({
      url: 'http://localhost:3300/api/link/',
      data: _edit,
      dataType: 'json',
      type: 'POST',
      success: function(data){
        // post object2mediatag
        // -----------------------------------------------------------------
        var _edit_object2mediatag = {
          'TagUID': this.state.uid_tag,
          'ObjectUID': this.props.uid_object,
          'MediaUID': data.uid
        };

        $.ajax({
          url: 'http://localhost:3300/api/object2mediatag/',
          data: _edit_object2mediatag,
          dataType: 'json',
          type: 'POST',
          success: function(data){
            this.setState({
              Name: '',
              URL: '',
              Info: '',
              IsPicture: false,
              IsVideo:  false
            })
            this.props.doParentReload();
          }.bind(this),
          error: function(xhr,status,err) {
            console.error('http://localhost:3300/api/link 1', status, err.toString());
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr,status,err) {
        console.error('http://localhost:3300/api/link 2', status, err.toString());
        // window.location.replace(sprintf("/#/ListEngines/0")); // %s ,getOffet()
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
            <td width="100%">Add tagged link</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {
                this.state.uid_tag != '' && this.state.Name != '' && this.state.URL != '' ?
                  <Button bsStyle="success" onClick={this.handleAdd.bind(this)}><img src="media/gfx/add.png"/></Button>
                  : <Button bsStyle="success" onClick={this.handleAdd.bind(this)} disabled><img src="media/gfx/add.png"/></Button>
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
                          display_column="Name" value="a"
                          change_function={this.onTagChange.bind(this)}
                        />
                      </Col>
                    </td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td>
                      <div>
                        <Form horizontal>
                          <LinkProperties update_parent={this.update_parent.bind(this)} data={this.state}/>
                        </Form>
                      </div>
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
