import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

const organisation_initial_offset = 0;
const organisation_initial_limit = 2;
const organisation_initial_filter = '';


var organisation_filter = ''

var organisation_offset = organisation_initial_offset;
var organisation_limit = organisation_initial_limit;

function get_organisation_initial_offset() {
  return organisation_initial_offset;
}

function get_organisation_offset() {
  return organisation_offset;
}

function set_organisation_offset(value) {
  organisation_offset=parseInt(value);
}

function get_organisation_initial_limit() {
  return organisation_initial_limit;
}

function get_organisation_limit() {
  return organisation_limit;
}

function set_organisation_limit(value) {
  organisation_limit=parseInt(value);
}

function get_organisation_filter() {
  return organisation_filter;
}

function set_organisation_filter(value) {
  organisation_filter=value;
}

function get_organisation_initial_filter() {
  return organisation_initial_filter;
}

function get_organisation_initial_filter_string() {
  return '';
}

function get_organisation_filter_string() {
  var _filter = get_organisation_filter();
  var _temp_filter = ''

  if(_filter == '') {
    _temp_filter = '°'
  } else {
    _temp_filter = _filter
  }

  console.log("&filter=where|Name|like|'°"+_filter+"'")

  return "&filter=where|Name|like|'°"+_filter+"°'";
}

export {
  get_organisation_initial_offset,
  get_organisation_offset,
  get_organisation_initial_limit,
  get_organisation_limit,
  set_organisation_offset,
  set_organisation_limit,
  get_organisation_filter,
  get_organisation_initial_filter,
  get_organisation_filter_string,
  get_organisation_initial_filter_string,
  set_organisation_filter
};


// Organisation
// -----------------------------------------------------------------------------
var Organisation = React.createClass({
    render: function() {
        return (
          <tr className="organisation">
          <td className="border">
            <Button bsStyle="danger" onClick={this.props.handleDelete.bind(null,this.props.organisation.UID)}><img src="media/gfx/delete.png"/></Button>
          </td>
          <td width="100%" className="border">
              <Link to={"/EditOrganisation/" + this.props.organisation.UID}> {this.props.organisation.Name}</Link>
            </td>
          </tr>
        );
    }
});

// Organisation List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      organisations: [],
      max_page:0,
      activePage:1,
      total_rows:0,
      new_filter:''
    };
  },
  onFilterChange: function(e) {
    this.setState({offset:0});
    set_organisation_offset(0);
    set_organisation_filter(this.state.new_filter);
    this.load_organisations();
  },
  onFilterClear: function(e) {
    this.setState({offset:0,new_filter:''});
    set_organisation_offset(0);
    set_organisation_filter('');
    this.load_organisations();
  },
  onNewFilterChange: function(e) {
    this.setState({new_filter: e.target.value});
  },
  load_organisations: function() {
    $.ajax({
      url: sprintf("http://localhost:3300/api/db/search/KOrganisation?offset=%s&limit=%s%s",get_organisation_offset(),get_organisation_limit(),get_organisation_filter_string()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data.amount),max_page:Math.floor(parseInt(data.amount) / get_organisation_limit()),organisations: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({activePage:Math.floor(get_organisation_offset() / get_organisation_limit())+1})
  },
  componentWillReceiveProps: function(nextProps) {
    // test if filter was changed in the filter edit component
    if(!(get_organisation_filter == this.state.new_filter)) {
        this.setState({new_filter:get_organisation_filter()});
        this.load_organisations();
    }

    // test if the offet,limit,filter properties changed
    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_organisation_offset(nextProps.params.offset);
      this.load_organisations();
    }
    if(!(nextProps.params.limit==this.props.params.limit)) {
      set_organisation_limit(nextProps.params.limit);
      this.load_organisations();
    }
    if(!(nextProps.params.filter==this.props.params.filte)) {
      set_organisation_filter(nextProps.params.filter);
      this.load_organisations();
    }
  },
  componentDidMount: function() {
    this.load_organisations();
  },
  createOrganisation: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Organisation key={i} organisation={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_organisation_offset((parseInt(eventKey)-1)*get_organisation_limit());
    this.load_organisations();
  },
  handleDelete: function(uid_to_delete) {
    $.ajax({
      url: "http://localhost:3300/api/db/KOrganisation/" + uid_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_organisations();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/organisation/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Organisations">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Link to='/AddOrganisation'><Button bsStyle="success" type="submit"><img src="media/gfx/add.png"/></Button></Link>
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
            {this.createOrganisation(this.state.organisations)}
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
            items={Math.ceil(this.state.total_rows / get_organisation_limit())}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </ul>
        <div className="form-group">
          &nbsp;
        </div>
      </Panel>
      </div>
    );
  }
});
