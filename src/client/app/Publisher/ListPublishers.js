import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const publisher_initial_offset = 0;
const publisher_initial_limit = 2;
var publisher_filter = ''

var publisher_offset = publisher_initial_offset;
var publisher_limit = publisher_initial_limit;

function get_publisher_initial_offset() {
  return publisher_initial_offset;
}

function get_publisher_offset() {
  return publisher_offset;
}

function set_publisher_offset(value) {
  publisher_offset=parseInt(value);
}

function get_publisher_initial_limit() {
  return publisher_initial_limit;
}

function get_publisher_limit() {
  return publisher_limit;
}

function set_publisher_limit(value) {
  publisher_limit=parseInt(value);
}

function get_publisher_filter() {
  return publisher_filter;
}

function set_publisher_filter(value) {
  publisher_filter=value;
}

export {
  get_publisher_initial_offset,
  get_publisher_offset,
  get_publisher_initial_limit,
  get_publisher_limit,
  set_publisher_offset,
  set_publisher_limit,
  get_publisher_filter,
  set_publisher_filter
};


// Publisher
// -----------------------------------------------------------------------------
var Publisher = React.createClass({
    render: function() {
        return (
          <tr className="publisher">
          <td className="border">
            <button className='button-cancel' onClick={this.props.handleDelete.bind(null,this.props.publisher.id)}>Delete</button>
          </td>
          <td width="100%" className="border">
              <Link to={'/EditPublisher/' + this.props.publisher.id}> {this.props.publisher.name}</Link>
            </td>
          </tr>
        );
    }
});

// Publisher List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      publishers: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_publisher_offset(0);
    set_publisher_filter(this.state.new_filter);
    this.load_number_of_publishers();
    this.load_publishers();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_publisher_offset(0);
    set_publisher_filter('');
    this.load_number_of_publishers();
    this.load_publishers();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_publishers() {
    $.ajax({
      url: encodeURI(sprintf('/api/publisher/count/%s',this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_publisher_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_publisher_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_publishers: function() {
    $.ajax({
      url: sprintf("/api/publisher/%s/%s/%s",get_publisher_offset(),get_publisher_limit(),this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({publishers: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_publisher_offset() / get_publisher_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_publisher_filter == this.state.new_filter)) {
        this.setState({new_filter:get_publisher_filter()});
        this.load_number_of_publishers();
        this.load_publishers();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_publisher_offset(nextProps.params.offset);
      this.load_number_of_publishers();
      this.load_publishers();
    }
  },
  componentDidMount: function() {
    this.load_number_of_publishers();
    this.load_publishers();
  },
  createPublisher: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Publisher key={i} publisher={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_publisher_offset((parseInt(eventKey)-1)*get_publisher_limit());
    this.load_number_of_publishers();
    this.load_publishers();
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "/api/db/KPublisher/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_publishers();
        this.load_publishers();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/publisher/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Publishers">
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
            {this.createPublisher(this.state.publishers)}
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
            items={Math.ceil(this.state.total_rows / get_publisher_limit())}
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
            <Link to='/AddPublisher'><Button type="submit">Add new publisher</Button></Link>
          </ButtonGroup>
        </ButtonToolbar>
      </Panel>
      </div>
    );
  }
});
