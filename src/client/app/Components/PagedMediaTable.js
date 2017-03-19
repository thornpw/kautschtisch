import React from 'react';

import { Link } from 'react-router';
import { Button,ButtonGroup,ButtonToolbar,Form,FormGroup,FormControl,Table,Pagination,Thumbnail,Panel } from 'react-bootstrap';

import Selection from "./Select.js"
import TaggedPicture from "./TaggedPicture.js"
import MediaPicture from "./MediaPicture.js"

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
// set_offset:      function to set the offset of row_datas
// get_offset       function to get the offset
// set_filter       function to set the filter of the row_datas
// get_filter       function to get the filter
// get_limit        function to get the number of media content objects to show
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
// =============================================================================

// PagedMediaTable component
// =============================================================================
const PagedMediaTable = React.createClass({
  // array for dynamic row data components
  // the calling component give in the string and the array return the component
  // *****************************************************************************
  MediaComponents: {
    "MediaPicture":MediaPicture
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
    this.props.set_offset(0);
    this.props.set_filter(this.state.new_filter);
    this.doReadraw()
  },
  onFilterClear: function(e) {
    this.setState({offset:0, new_filter:''});
    this.props.set_offset(0);
    this.props.set_filter('');
    this.doReadraw();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  // called in the load functions
  get_load_filter: function() {
    var _filter = this.props.get_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(this.props.get_filter() == this.state.new_filter)) {
        this.setState({new_filter:this.props.get_filter()});
        this.doRedraw(this);
    }
    if(!(nextProps.get_offset()==this.props.get_offset())) {
      this.props.set_offset(nextProps.get_offset());
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
        output.push(<DynamicComponent key={i} data={items[i]} doParentRedraw={this.doRedraw}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    this.props.set_offset( (parseInt(eventKey) -1 ) * this.props.get_limit());
    this.doRedraw(this)
  },
  doRedraw() {
    console.log("get number of game pictures")
    $.ajax({
      url: encodeURI(sprintf('http://localhost:3300/api/picture/count/%s',this.get_load_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / this.props.get_limit())});
        console.log("get game pictures")
        $.ajax({
          url: sprintf("http://localhost:3300/api/picture/%s/%s/%s",this.props.get_offset(),this.props.get_limit(),this.get_load_filter()),
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({row_datas: data, actual_page:Math.floor(this.props.get_offset() / this.props.get_limit())})
          }.bind(this),
          error: function(xhr, status, err) {
            console.error("PagedMediaTable", status, err.toString());
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("PagedMediaTable", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
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
            items={Math.ceil(this.state.total_rows / this.props.get_limit())}
            maxButtons={this.props.max_buttons}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </ul>
        <div className="form-group">
          &nbsp;
        </div>
        <TaggedPicture doParentRedraw={this.doRedraw} uid_object={this.props.uid_object} filters={this.props.tag_filter}/>
      </div>
    );
  }
});

module.exports = PagedMediaTable;
