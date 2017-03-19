import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const game_initial_offset = 0;
const game_initial_limit = 2;
var game_filter = ''

var game_offset = game_initial_offset;
var game_limit = game_initial_limit;

function get_game_initial_offset() {
  return game_initial_offset;
}

function get_game_offset() {
  return game_offset;
}

function set_game_offset(value) {
  game_offset=parseInt(value);
}

function get_game_initial_limit() {
  return game_initial_limit;
}

function get_game_limit() {
  return game_limit;
}

function set_game_limit(value) {
  game_limit=parseInt(value);
}

function get_game_filter() {
  return game_filter;
}

function set_game_filter(value) {
  game_filter=value;
}

export {
  get_game_initial_offset,
  get_game_offset,
  get_game_initial_limit,
  get_game_limit,
  set_game_offset,
  set_game_limit,
  get_game_filter,
  set_game_filter
};


// Game
// -----------------------------------------------------------------------------
var Game = React.createClass({
    render: function() {
        return (
          <tr className="game">
          <td className="border">
            <button className='button-cancel' onClick={this.props.handleDelete.bind(null,this.props.game.id)}>Delete</button>
          </td>
          <td width="100%" className="border">
              <Link to={'/EditGame/' + this.props.game.id}> {this.props.game.name}</Link>
            </td>
          </tr>
        );
    }
});

// Game List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      games: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_game_offset(0);
    set_game_filter(this.state.new_filter);
    this.load_number_of_games();
    this.load_games();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_game_offset(0);
    set_game_filter('');
    this.load_number_of_games();
    this.load_games();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_games() {
    $.ajax({
      url: encodeURI(sprintf('http://localhost:3300/api/game/count/%s',this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_game_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_game_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_games: function() {
    $.ajax({
      url: sprintf("http://localhost:3300/api/game/%s/%s/%s",get_game_offset(),get_game_limit(),this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({games: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_game_offset() / get_game_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_game_filter == this.state.new_filter)) {
        this.setState({new_filter:get_game_filter()});
        this.load_number_of_games();
        this.load_games();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_game_offset(nextProps.params.offset);
      this.load_number_of_games();
      this.load_games();
    }
  },
  componentDidMount: function() {
    this.load_number_of_games();
    this.load_games();
  },
  createGame: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Game key={i} game={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_game_offset((parseInt(eventKey)-1)*get_game_limit());
    this.load_number_of_games();
    this.load_games();
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "http://localhost:3300/api/db/KGame/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_games();
        this.load_games();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/game/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Games">
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
            {this.createGame(this.state.games)}
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
            items={Math.ceil(this.state.total_rows / get_game_limit())}
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
            <Link to='/AddGame'><Button type="submit">Add new game</Button></Link>
          </ButtonGroup>
        </ButtonToolbar>
      </Panel>
      </div>
    );
  }
});
