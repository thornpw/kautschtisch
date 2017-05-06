import React from 'react';

import { Link } from 'react-router';
import { Button,ButtonGroup,ButtonToolbar,Form,FormGroup,FormControl,Table,Pagination,Thumbnail,Panel } from 'react-bootstrap';

import { Selection } from "./Select"
import { TaggedPicture } from "./Pictures/TaggedPicture"
import { TaggedLink } from "./Links/TaggedLink"
import { ContextPicture } from "./Pictures/ContextPicture"
import { URLLink } from "./Links/URLLink"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

// Paged media table
// =============================================================================
// React component to display media content in a paged table
// *****************************************************************************
// Author: thorsten.butschke@googlemail.com
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// object_pagignation:
//    set_offset:      function to set the offset of row_datas
//    get_offset       function to get the offset
//    set_filter       function to set the filter of the row_datas
//    get_filter       function to get the filter
//    get_limit        function to get the number of media content objects to show
// max_buttons      number of max elements in the pagination band
// row_type         media type
// uid_object       uid of the main objects the media objects belongs to
//
// Model (state)
// *****************************************************************************
// row_datas
// max_page
// actual_page
// total_rows
// new_filter
// offset
// activePage
//
// Functions
// *****************************************************************************
// handleSelect: select pagination option
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// 1.1 Only a class is used as input in the props
// =============================================================================

// PagedMediaTable component
// =============================================================================
const PagedMediaTable = React.createClass({
  // array for dynamic row data components
  // the calling component give in the string and the array return the component
  // *****************************************************************************
  MediaComponents: {
    "ContextPicture":ContextPicture,
    "URLLink":URLLink
  },
  TaggedComponents: {
    "TaggedPicture":TaggedPicture,
    "TaggedLink":TaggedLink
  },
  getInitialState: function() {
    return {
      row_datas: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:'',
      offset:0,
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    this.props.object_pagignation.set_offset(0);
    this.props.object_pagignation.set_filter(this.state.new_filter);
    this.doRedraw()
  },
  onFilterClear: function(e) {
    this.setState({offset:0, new_filter:''});
    this.props.object_pagignation.set_offset(0);
    this.props.object_pagignation.set_filter('');
    this.doRedraw();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  // called in the load functions
  get_load_filter: function() {
    var _filter = this.props.object_pagignation.get_filter();

    if(_filter == '') {
      return "'°'";
    } else {
      return "'°"+_filter+"°'";
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(this.props.object_pagignation.get_filter() == this.state.new_filter)) {
        this.setState({new_filter:this.props.object_pagignation.get_filter()});
        this.doRedraw(this);
    }
    if(!(nextProps.object_pagignation.get_offset()==this.props.object_pagignation.get_offset())) {
      this.props.object_pagignation.set_offset(nextProps.get_offset());
      this.doRedraw(this)
    }
  },
  componentDidMount: function() {
    this.doRedraw()
  },
  createRows: function(items){
      var output = [];
      var DynamicComponent = this.MediaComponents[this.props.row_type];
      for(var i = 0; i < items.length; i++) {
        output.push(<DynamicComponent key={i} data={items[i]} table="KObject2MediaTag" update_parent_data={this.doRedraw}/>);
      }
      return output;
  },
  createTaggedComponent: function() {
    var output = [];
    var DynamicComponent = this.TaggedComponents[this.props.tagged_component];
    output.push(<DynamicComponent key={0} doParentRedraw={this.doRedraw} uid_object={this.props.uid_object} object_filter={this.props.object_filter} media_type={this.props.media_type}/>);
    return output;
  },
  handleSelect(eventKey) {
    this.props.object_pagignation.set_active_page(eventKey)
    this.props.object_pagignation.set_offset( (parseInt(eventKey) -1 ) * this.props.object_pagignation.get_limit());
    this.doRedraw(this)
  },
  doRedraw() {
    var _uid_object = "'" + this.props.uid_object + "'"
    $.ajax({
      url: encodeURI(sprintf("http://localhost:3300/api/db/search/%s?offset=%s&limit=%s&filter=where|Name|like|%s;and|ObjectUID|eq|%s",this.props.view_name,this.props.object_pagignation.get_offset(),this.props.object_pagignation.get_limit(),this.get_load_filter(),_uid_object)),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data.amount),max_page:Math.floor(parseInt(data.amount) / this.props.object_pagignation.get_limit())});
        this.setState({row_datas: data.data, actual_page:Math.floor(this.props.object_pagignation.get_offset() / this.props.object_pagignation.get_limit())})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("PagedMediaTable", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    <div/>
  },
  render2: function() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<Thumbnail src={imagePreviewUrl} />);
    }
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>
                <table>
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td width="4px"></td>
                      <td>
                          <FormControl type="text" placeholder="Search for" onChange={this.onNewFilterChange} value = {this.state.new_filter}/>
                      </td>
                      <td width="4px"></td>
                      <td>
                        <Button onClick={this.onFilterChange}><img src="media/gfx/search.png"/></Button>
                      </td>
                      <td width="4px"></td>
                      <td>
                        <Button onClick={this.onFilterClear}><img src="media/gfx/clear_filter.png"/></Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.createRows(this.state.row_datas)}
          </tbody>
        </Table>
        <ul className="pagination">
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={Math.ceil(this.state.total_rows / this.props.object_pagignation.get_limit())}
            maxButtons={this.props.max_buttons}
            activePage={this.props.object_pagignation.get_active_page()}
            onSelect={this.handleSelect}
          />
        </ul>
        <div className="form-group">
          &nbsp;
        </div>
        {this.createTaggedComponent()}
      </div>
    );
  }
});

module.exports = PagedMediaTable;
