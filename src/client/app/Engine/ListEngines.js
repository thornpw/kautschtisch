import React from 'react'
import { Link} from 'react-router'

import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const engine_initial_offset = 0;
const engine_initial_limit = 2;
var engine_filter = ''

var engine_offset = engine_initial_offset;
var engine_limit = engine_initial_limit;

function get_engine_initial_offset() {
  return engine_initial_offset;
}

function get_engine_offset() {
  return engine_offset;
}

function set_engine_offset(value) {
  engine_offset=parseInt(value);
}

function get_engine_initial_limit() {
  return engine_initial_limit;
}

function get_engine_limit() {
  return engine_limit;
}

function set_engine_limit(value) {
  engine_limit=parseInt(value);
}

function get_engine_filter() {
  return engine_filter;
}

function set_engine_filter(value) {
  engine_filter=value;
}

export {
  get_engine_initial_offset,
  get_engine_offset,
  get_engine_initial_limit,
  get_engine_limit,
  set_engine_offset,
  set_engine_limit,
  get_engine_filter,
  set_engine_filter
};

// Engine
// -----------------------------------------------------------------------------
var Engine = React.createClass({
    render: function() {
        return (
          <tr className="engine">
          <td className="border">
            <Button bsStyle="danger" onClick={this.props.handleDelete.bind(null,this.props.engine.id)}><img src="media/gfx/delete.png"/></Button>
          </td>
          <td width="100%" className="border">
              <Link to={'/EditEngine/' + this.props.engine.id}> {this.props.engine.name}</Link>
            </td>
          </tr>
        );
    }
});

// Engine List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      engines: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:'',
      activePage: 1
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_engine_offset(0);
    set_engine_filter(this.state.new_filter);
    this.load_number_of_engines();
    this.load_engines();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_engine_offset(0);
    set_engine_filter('');
    this.load_number_of_engines();
    this.load_engines();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_engines() {
    $.ajax({
      url: encodeURI(sprintf('/api/engine/count/%s',this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_engine_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_engine_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_engines: function() {
    $.ajax({
      url: sprintf("/api/engine/%s/%s/%s",get_engine_offset(),get_engine_limit(),this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({engines: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_engine_offset() / get_engine_limit())})
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_engine_offset((parseInt(eventKey)-1)*get_engine_limit());
    this.load_number_of_engines();
    this.load_engines();
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_engine_filter == this.state.new_filter)) {
        this.setState({new_filter:get_engine_filter()});
        this.load_number_of_engines();
        this.load_engines();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_engine_offset(nextProps.params.offset);
      this.load_number_of_engines();
      this.load_engines();
    }
  },
  componentDidMount: function() {
    this.load_number_of_engines();
    this.load_engines();
  },
  createEngine: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Engine key={i} engine={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "/api/db/KEngine/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_engines();
        this.load_engines();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/engine/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Engines">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Link to='/AddEngine'><Button bsStyle="success" type="submit"><img src="media/gfx/add.png"/></Button></Link>
              </th>
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
            {this.createEngine(this.state.engines)}
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
            items={Math.ceil(this.state.total_rows / get_engine_limit())}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </ul>
      </Panel>
      </div>
    );
  }
});
