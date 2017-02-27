import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const game_file_initial_offset = 0;
const game_file_initial_limit = 2;
var game_file_filter = ''

var game_file_offset = game_file_initial_offset;
var game_file_limit = game_file_initial_limit;

function get_game_file_initial_offset() {
  return game_file_initial_offset;
}

function get_game_file_offset() {
  return game_file_offset;
}

function set_game_file_offset(value) {
  game_file_offset=parseInt(value);
}

function get_game_file_initial_limit() {
  return game_file_initial_limit;
}

function get_game_file_limit() {
  return game_file_limit;
}

function set_game_file_limit(value) {
  game_file_limit=parseInt(value);
}

function get_game_file_filter() {
  return game_file_filter;
}

function set_game_file_filter(value) {
  game_file_filter=value;
}

export {
  get_game_file_initial_offset,
  get_game_file_offset,
  get_game_file_initial_limit,
  get_game_file_limit,
  set_game_file_offset,
  set_game_file_limit,
  get_game_file_filter,
  set_game_file_filter
};


// Game_file
// -----------------------------------------------------------------------------
var Game_file = React.createClass({
    render: function() {
        return (
          <tr className="game_file">
          <td className="border">
            <button className='button-cancel' onClick={this.props.handleDelete.bind(null,this.props.game_file.id)}>Delete</button>
          </td>
          <td width="100%" className="border">
              <Link to={'/EditGame_file/' + this.props.game_file.id}> {this.props.game_file.name}</Link>
            </td>
          </tr>
        );
    }
});

// Game_file List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      game_files: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_game_file_offset(0);
    set_game_file_filter(this.state.new_filter);
    this.load_number_of_game_files();
    this.load_game_files();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_game_file_offset(0);
    set_game_file_filter('');
    this.load_number_of_game_files();
    this.load_game_files();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_game_files() {
    $.ajax({
      url: encodeURI(sprintf('/api/game_file/count/%s',this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_game_file_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_game_file_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_game_files: function() {
    $.ajax({
      url: sprintf("/api/game_file/%s/%s/%s",get_game_file_offset(),get_game_file_limit(),this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({game_files: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_game_file_offset() / get_game_file_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_game_file_filter == this.state.new_filter)) {
        this.setState({new_filter:get_game_file_filter()});
        this.load_number_of_game_files();
        this.load_game_files();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_game_file_offset(nextProps.params.offset);
      this.load_number_of_game_files();
      this.load_game_files();
    }
  },
  componentDidMount: function() {
    this.load_number_of_game_files();
    this.load_game_files();
  },
  createGame_file: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Game_file key={i} game_file={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_game_file_offset((parseInt(eventKey)-1)*get_game_file_limit());
    this.load_number_of_game_files();
    this.load_game_files();
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "/api/db/KGame_file/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_game_files();
        this.load_game_files();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/game_file/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Game files">
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
            {this.createGame_file(this.state.game_files)}
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
            items={Math.ceil(this.state.total_rows / get_game_file_limit())}
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
            <Link to='/AddGame_file'><Button type="submit">Add new game_file</Button></Link>
          </ButtonGroup>
        </ButtonToolbar>
      </Panel>
      </div>
    );
  }
});
