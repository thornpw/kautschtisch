import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const tag_initial_offset = 0;
const tag_initial_limit = 2;
var tag_filter = ''

var tag_offset = tag_initial_offset;
var tag_limit = tag_initial_limit;

function get_tag_initial_offset() {
  return tag_initial_offset;
}

function get_tag_offset() {
  return tag_offset;
}

function set_tag_offset(value) {
  tag_offset=parseInt(value);
}

function get_tag_initial_limit() {
  return tag_initial_limit;
}

function get_tag_limit() {
  return tag_limit;
}

function set_tag_limit(value) {
  tag_limit=parseInt(value);
}

function get_tag_filter() {
  return tag_filter;
}

function set_tag_filter(value) {
  tag_filter=value;
}

export {
  get_tag_initial_offset,
  get_tag_offset,
  get_tag_initial_limit,
  get_tag_limit,
  set_tag_offset,
  set_tag_limit,
  get_tag_filter,
  set_tag_filter
};


// Tag
// -----------------------------------------------------------------------------
var Tag = React.createClass({
    render: function() {
        return (
          <tr className="tag">
          <td className="border">
            <button className='button-cancel' onClick={this.props.handleDelete.bind(null,this.props.tag.id)}>Delete</button>
          </td>
          <td width="100%" className="border">
              <Link to={'/EditTag/' + this.props.tag.id}> {this.props.tag.name}</Link>
            </td>
          </tr>
        );
    }
});

// Tag List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      tags: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_tag_offset(0);
    set_tag_filter(this.state.new_filter);
    this.load_number_of_tags();
    this.load_tags();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_tag_offset(0);
    set_tag_filter('');
    this.load_number_of_tags();
    this.load_tags();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_tags() {
    $.ajax({
      url: encodeURI(sprintf('/api/tag/count/%s',this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_tag_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_tag_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_tags: function() {
    $.ajax({
      url: sprintf("/api/tag/%s/%s/%s",get_tag_offset(),get_tag_limit(),this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({tags: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_tag_offset() / get_tag_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_tag_filter == this.state.new_filter)) {
        this.setState({new_filter:get_tag_filter()});
        this.load_number_of_tags();
        this.load_tags();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_tag_offset(nextProps.params.offset);
      this.load_number_of_tags();
      this.load_tags();
    }
  },
  componentDidMount: function() {
    this.load_number_of_tags();
    this.load_tags();
  },
  createTag: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Tag key={i} tag={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_tag_offset((parseInt(eventKey)-1)*get_tag_limit());
    this.load_number_of_tags();
    this.load_tags();
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "/api/db/KTag/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_tags();
        this.load_tags();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/tag/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Tags">
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
                        <Button onClick={this.onFilterChange}>Search</Button>
                      </td>
                      <td width="4px"></td>
                      <td>
                        <Button onClick={this.onFilterClear}>Clear</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.createTag(this.state.tags)}
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
            items={Math.ceil(this.state.total_rows / get_tag_limit())}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </ul>
        <div className="form-group">
          &nbsp;
        </div>
        <ButtonToolbar>
          <ButtonGroup>
            <Link to='/AddTag'><Button type="submit">Add new tag</Button></Link>
          </ButtonGroup>
        </ButtonToolbar>
      </Panel>
      </div>
    );
  }
});
