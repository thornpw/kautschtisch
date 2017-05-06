import React from 'react';

import { Link } from 'react-router';
import { Button,ButtonGroup,ButtonToolbar,Form,FormGroup,FormControl,Table,Pagination,Thumbnail,Panel } from 'react-bootstrap';

import { Selection } from "./Select"
import { TaggedPicture } from "./Pictures/TaggedPicture"
import { TaggedLink } from "./Links/TaggedLink"
import { TaggedFile } from "./Files/TaggedFile"
import { ContextPicture } from "./Pictures/ContextPicture"
import { ContextFile } from "./Files/ContextFile"
import { URLLink } from "./Links/URLLink"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'
import { ObjectList } from "./Lists/ObjectList"
import { ListColumn } from "./Lists/ListColumn"
import { buildConditionFromFilters } from "../Utils/filter_utils"

import { createStore } from 'redux'
import { addPagination,setNewFilter,setFilter,clearFilter,changeOffset,setAmountOfRows,resetContextPagination } from '../Redux/actions/pagination_actions'
import { r_pagination } from '../Redux/reducers/pagination_reducers'
import { pagination_store} from '../Redux/store/pagination_store'

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
// data
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

// array for dynamic row data components
// the calling component give in the string and the array return the component
// *****************************************************************************
var MediaComponents = {
  "ContextPicture":ContextPicture,
  "URLLink":URLLink,
  "ContextFile":ContextFile
}

var TaggedComponents = {
  "TaggedPicture":TaggedPicture,
  "TaggedLink":TaggedLink,
  "TaggedFile":TaggedFile
}

export class PagedMediaTable2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:'',
      offset:0,
    }

    this.redux_state = pagination_store.getState().paginations[this.props.object_type]
  }

  componentDidMount() {
    pagination_store.dispatch(resetContextPagination())
    this.load_data()
  }

  createRows(){
    var output = [];
    var items = this.state.data
    var DynamicComponent = MediaComponents[this.props.row_type];

    for(var i = 0; i < items.length; i++) {
      output.push(<DynamicComponent key={i} data={items[i]} doParentRedraw={this.load_data}/>);
    }
    return output;
  }

  createTaggedComponent() {
    var output = [];
    var DynamicComponent = TaggedComponents[this.props.tagged_component];
    output.push(<DynamicComponent key={0} doParentRedraw={this.load_data.bind(this)} uid_object={this.props.uid_object} object_filter={this.props.object_filter} media_type={this.props.media_type}/>);
    return output;
  }

  load_data() {
    var _uid_object = "'" + this.props.uid_object + "'"
    console.log(this.redux_state.filters)
    $.ajax({
      url: encodeURI(sprintf("http://localhost:3300/api/db/search/%s?offset=%s&limit=%s%s;and|ObjectUID|eq|%s",this.props.view_name,this.redux_state.offset,this.redux_state.limit,buildConditionFromFilters(this.redux_state.filters,this.redux_state.filter_columns),_uid_object)),
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log(data.amount)
        pagination_store.dispatch(setAmountOfRows(this.props.object_type,data.amount))
        this.setState({data: data.data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("PagedMediaTable", status, err.toString());
      }.bind(this)
    })
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<Thumbnail src={imagePreviewUrl} />);
    }

    return (
      <div>
        <ObjectList
          add_link=""
          createObject={this.createRows.bind(this)}
          object_type={this.props.object_type}
          update_data={this.load_data.bind(this)}
        >
          <ListColumn object_type={this.props.object_type} column_number={0} display_name="Name" update_data={this.load_data.bind(this)}/>
          <ListColumn object_type={this.props.object_type} column_number={1} display_name="URL" update_data={this.load_data.bind(this)}/>
        </ObjectList>
        {this.createTaggedComponent()}
      </div>
    )
  }
}
