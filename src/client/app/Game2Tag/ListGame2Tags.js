import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import Selection from "../Components/Select.js"

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const game2tag_initial_offset = 0;
const game2tag_initial_limit = 2;
var game2tag_filter = ''

var game2tag_offset = game2tag_initial_offset;
var game2tag_limit = game2tag_initial_limit;

function get_game2tag_initial_offset() {
  return game2tag_initial_offset;
}

function get_game2tag_offset() {
  return game2tag_offset;
}

function set_game2tag_offset(value) {
  game2tag_offset=parseInt(value);
}

function get_game2tag_initial_limit() {
  return game2tag_initial_limit;
}

function get_game2tag_limit() {
  return game2tag_limit;
}

function set_game2tag_limit(value) {
  game2tag_limit=parseInt(value);
}

function get_game2tag_filter() {
  return game2tag_filter;
}

function set_game2tag_filter(value) {
  game2tag_filter=value;
}

export {
  get_game2tag_initial_offset,
  get_game2tag_offset,
  get_game2tag_initial_limit,
  get_game2tag_limit,
  set_game2tag_offset,
  set_game2tag_limit,
  get_game2tag_filter,
  set_game2tag_filter
};

// Game2Tag
// -----------------------------------------------------------------------------
var Game2Tag = React.createClass({
  render: function() {
    return (
      <tr className="game2tag">
        <td className="border">
          <button className='button-cancel' onClick={this.props.handleDelete.bind(null,this.props.game2tag.id)}>Delete</button>
        </td>
        <td width="100%" className="border">
          {this.props.game2tag.tag_name}
        </td>
      </tr>
    );
  }
});

// Game2Tag List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      game2tags: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      new_filter:'',
      offset: 0,
      name_tag: '',
      id_tag: 0,
      filters: 'id_game|' + this.props.id_game,
      new_tag:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_game2tag_offset(0);
    set_game2tag_filter(this.state.new_filter);
    this.load_number_of_game2tags(this.props.id_game);
    this.load_game2tags(this.props.id_game);
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_game2tag_offset(0);
    set_game2tag_filter('');
    this.load_number_of_game2tags(this.props.id_game);
    this.load_game2tags(this.props.id_game);
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_number_of_game2tags(id_game) {
    $.ajax({
      url: encodeURI(sprintf('/api/game2tag/count/%s/%s',id_game,this.get_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_game2tag_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_filter: function() {
    var _filter = get_game2tag_filter();

    if(_filter == '') {
      return '<EMPTY>';
    } else {
      return _filter;
    }
  },
  load_game2tags: function(id_game) {
    $.ajax({
      url: sprintf("/api/game2tag/%s/%s/%s/%s",get_game2tag_offset(),get_game2tag_limit(),id_game,this.get_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({game2tags: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_game2tag_offset() / get_game2tag_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({'filters': '-'})
    if(!(get_game2tag_filter == this.state.new_filter)) {
        this.setState({new_filter:get_game2tag_filter()});
        this.load_number_of_game2tags(nextProps.id_game);
        this.load_game2tags(nextProps.id_game);
    }

    if(!(nextProps.offset==this.props.offset)) {
      set_game2tag_offset(nextProps.params.offset);
      this.load_number_of_game2tags(this.props.id_game);
      this.load_game2tags(this.props.id_game);
    }
  },
  createGame2Tag: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Game2Tag key={i} game2tag={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_game2tag_offset((parseInt(eventKey)-1)*get_game2tag_limit());
    this.load_number_of_game2tags(this.props.id_game);
    this.load_game2tags(this.props.id_game);
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "/api/db/KGame2Tag/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_game2tags(this.props.id_game);
        this.load_game2tags(this.props.id_game);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/game2tag/", status, err.toString());
      }.bind(this)
    });
  },
  connectGame2Tag: function() {
    var _new = {'id_game':this.props.id_game,'id_tag':this.state.id_tag};

    $.ajax({
      url: "/api/game2tag",
      dataType: 'json',
      type: 'POST',
      cache: false,
      data: _new,
      success: function(data) {
        this.load_number_of_game2tags(this.props.id_game);
        this.load_game2tags(this.props.id_game);
        this.setState({'name_tag':''})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/game2tag/", status, err.toString());
      }.bind(this)
    });
  },
  addNewTag: function() {
    var _new_tag= {'name':this.state.new_tag};

    $.ajax({
      url: "/api/tag",
      dataType: 'json',
      type: 'POST',
      cache: false,
      data: _new_tag,
      success: function(data) {
        var _new_game2tag = {'id_game':this.props.id_game,'id_tag':data.id};

        $.ajax({
          url: "/api/game2tag",
          dataType: 'json',
          type: 'POST',
          cache: false,
          data: _new_game2tag,
          success: function(data) {
            this.load_number_of_game2tags(this.props.id_game);
            this.load_game2tags(this.props.id_game);
            this.setState({'new_tag':''})
          }.bind(this),
          error: function(xhr, status, err) {
            console.error("/api/game2tag/", status, err.toString());
          }.bind(this)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/game2tag/", status, err.toString());
      }.bind(this)
    });
  },
  onTagChange: function(e) {
    this.setState({id_tag: e.target.value,name_tag: e.target.childNodes[e.target.selectedIndex].label});
  },
  onNewTagChange: function(e) {
    this.setState({new_tag: e.target.value});
  },
  render: function() {
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
          {this.createGame2Tag(this.state.game2tags)}
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
          items={Math.ceil(this.state.total_rows / get_game2tag_limit())}
          maxButtons={5}
          activePage={this.state.activePage}
          onSelect={this.handleSelect}
        />
      </ul>
      <div className="form-group">
        &nbsp;
      </div>
        <Form horizontal>
          <FormGroup controlId="system">
            <Col sm={2}>
              <Button onClick={this.connectGame2Tag} type="submit">Add tag</Button>
            </Col>
            <Col sm={3}>
              <FormControl disabled value = {this.state.name_tag} />
            </Col>
            <Col sm={7}>
              <Selection target="tag" filters={this.state.filters} column="name" value="a" change_function={this.onTagChange}/>
            </Col>
          </FormGroup>
        </Form>
        <Form horizontal>
          <FormGroup controlId="system">
            <Col sm={2}>
              <Button onClick={this.addNewTag} type="submit">Add new tag</Button>
            </Col>
            <Col sm={3}>
              <FormControl onChange={this.onNewTagChange} value = {this.state.new_tag} />
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
});
