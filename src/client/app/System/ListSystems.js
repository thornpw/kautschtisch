import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const system_initial_offset = 0;
const system_initial_limit = 2;
var system_filter = ''

var system_offset = system_initial_offset;
var system_limit = system_initial_limit;

function get_system_initial_offset() {
  return system_initial_offset;
}

function get_system_offset() {
  return system_offset;
}

function set_system_offset(value) {
  system_offset=parseInt(value);
}

function get_system_initial_limit() {
  return system_initial_limit;
}

function get_system_limit() {
  return system_limit;
}

function set_system_limit(value) {
  system_limit=parseInt(value);
}

function get_system_filter() {
  return system_filter;
}

function set_system_filter(value) {
  system_filter=value;
}

export {
  get_system_initial_offset,
  get_system_offset,
  get_system_initial_limit,
  get_system_limit,
  set_system_offset,
  set_system_limit,
  get_system_filter,
  set_system_filter
};


// System
// -----------------------------------------------------------------------------
var System = React.createClass({
    render: function() {
        return (
          <tr className="system">
          <td className="border">
            <button className='button-cancel' onClick={this.props.handleDelete.bind(null,this.props.system.id)}>Delete</button>
          </td>
          <td width="100%" className="border">
              <Link to={'/EditSystem/' + this.props.system.id}> {this.props.system.name}</Link>
            </td>
          </tr>
        );
    }
});

// System List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      systems: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_system_offset(0);
    set_system_filter(this.state.new_filter);
    this.load_number_of_systems();
    this.load_systems();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_system_offset(0);
    set_system_filter('');
    this.load_number_of_systems();
    this.load_systems();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_systems() {
    $.ajax({
      url: encodeURI(sprintf('http://localhost:3300/api/system/count/%s',this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_system_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_system_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_systems: function() {
    $.ajax({
      url: sprintf("http://localhost:3300/api/system/%s/%s/%s",get_system_offset(),get_system_limit(),this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({systems: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_system_offset() / get_system_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_system_filter == this.state.new_filter)) {
        this.setState({new_filter:get_system_filter()});
        this.load_number_of_systems();
        this.load_systems();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_system_offset(nextProps.params.offset);
      this.load_number_of_systems();
      this.load_systems();
    }
  },
  componentDidMount: function() {
    this.load_number_of_systems();
    this.load_systems();
  },
  createSystem: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<System key={i} system={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_system_offset((parseInt(eventKey)-1)*get_system_limit());
    this.load_number_of_systems();
    this.load_systems();
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "http://localhost:3300/api/db/KSystem/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_systems();
        this.load_systems();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/system/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Systems">
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
            {this.createSystem(this.state.systems)}
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
            items={Math.ceil(this.state.total_rows / get_system_limit())}
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
            <Link to='/AddSystem'><Button type="submit">Add new system</Button></Link>
          </ButtonGroup>
        </ButtonToolbar>
      </Panel>
      </div>
    );
  }
});
