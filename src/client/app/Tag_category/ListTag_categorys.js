import React from 'react'
import { Link } from 'react-router'
import { Grid,Row,Col,Panel,ButtonToolbar,ButtonGroup,Button,Table,Pagination,Form,FormGroup,FormControl,ControlLabel } from 'react-bootstrap';

import sprintf from 'sprintf'
import vsprintf from 'sprintf'

import Search from "../Components/Search.js"
import TwoButtonDialog from "../Components/TwoButtonDialog.js"

const tag_category_initial_offset = 0;
const tag_category_initial_limit = 2;
var tag_category_name_filter = ''
var tag_category_description_filter = ''

var tag_category_offset = tag_category_initial_offset;
var tag_category_limit = tag_category_initial_limit;

function get_tag_category_initial_offset() {
  return tag_category_initial_offset;
}

function get_tag_category_offset() {
  return tag_category_offset;
}

function set_tag_category_offset(value) {
  tag_category_offset=parseInt(value);
}

function get_tag_category_initial_limit() {
  return tag_category_initial_limit;
}

function get_tag_category_limit() {
  return tag_category_limit;
}

function set_tag_category_limit(value) {
  tag_category_limit=parseInt(value);
}

function get_tag_category_name_filter() {
  return tag_category_name_filter;
}

function set_tag_category_name_filter(value) {
  tag_category_name_filter=value;
}

function get_tag_category_description_filter() {
  return tag_category_description_filter;
}

function set_tag_category_description_filter(value) {
  tag_category_description_filter=value;
}

export {
  get_tag_category_initial_offset,
  get_tag_category_offset,
  get_tag_category_initial_limit,
  get_tag_category_limit,
  set_tag_category_offset,
  set_tag_category_limit,
  get_tag_category_name_filter,
  set_tag_category_name_filter,
  get_tag_category_description_filter,
  set_tag_category_description_filter
};


// Tag_category
// -----------------------------------------------------------------------------
var Tag_category = React.createClass({
  getInitialState() {
    return { showDeleteModal: false };
  },
  close() {
    this.setState({ showDeleteModal: false });
  },
  open() {
    this.setState({ showDeleteModal: true });
  },
  render: function() {
    return (
      <tr className="tag_category">
        <td className="border">
          <Button style={{padding:'8px 35px 8px 35px'}} type="button" className="button-cancel" onClick={this.props.handleDelete.bind(null,this.props.tag_category.id)}>
            <span className="glyphicon glyphicon-remove"></span>
          </Button>
        </td>
        <td width="50%" className="border">
          <Link to={'/EditTag_category/' + this.props.tag_category.id}> {this.props.tag_category.name}</Link>
        </td>
        <td width="50%" className="border">
          {this.props.tag_category.description}
        </td>
      </tr>
    );
  }
});

// Tag_category List
// -----------------------------------------------------------------------------
export default React.createClass({
  getInitialState: function() {
    return {
      tag_categorys: [],
      max_page:0,
      actual_page:0,
      total_rows:0,
      input_name_filter:'',
      input_description_filter:''
    };
  },
  onInputNameFilterReset: function(e) {
    this.setState({input_name_filter: get_tag_category_name_filter()});
  },
  onInputNameFilterClear: function(e) {
    this.setState({input_name_filter:''});
  },
  onInputNameFilterChange: function(e) {
    this.setState({input_name_filter: e.target.value});
  },
  onInputDescriptionFilterReset: function(e) {
    this.setState({input_description_filter: get_tag_category_description_filter()});
  },
  onInputDescriptionFilterClear: function(e) {
    this.setState({input_description_filter:''});
  },
  onInputDescriptionFilterChange: function(e) {
    this.setState({input_description_filter: e.target.value});
  },
  onFilter: function(e) {
    this.setState({offset:0});
    set_tag_category_offset(0);
    set_tag_category_name_filter(this.state.input_name_filter);
    set_tag_category_description_filter(this.state.input_description_filter);
    this.load_number_of_tag_categorys();
    this.load_tag_categorys();
  },
  load_number_of_tag_categorys() {
    $.ajax({
      url: encodeURI(sprintf('/api/tag_category_count/|/%s',this.get_combined_filter())),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({total_rows: parseInt(data[0].number),max_page:Math.floor(parseInt(data[0].number) / get_tag_category_limit())});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  get_name_filter: function() {
    var _filter = get_tag_category_name_filter();

    if(_filter == '') {
      return '';
    } else {
      return 'name|' + _filter;
    }
  },
  get_description_filter: function() {
    var _filter = get_tag_category_description_filter();

    if(_filter == '') {
      return '';
    } else {
      return 'description|' + _filter;
    }
  },
  get_combined_filter: function() {
    var values = [];
    var found = false;
    var filter = ''

    values.push(this.get_name_filter());
    values.push(this.get_description_filter());

    values.forEach(function(elem, index, array) {
        if(!(elem == '')) {
          if(found) {
            filter += "|";
          }
          filter += elem;

          found = true;
        }
    });

    if(!found) {
      filter = '|';
    }

    console.log("filti:" + filter)

    return filter;
  },
  load_tag_categorys: function() {
    $.ajax({
      url: sprintf("/api/tag_category/%s/%s/|/%s",get_tag_category_offset(),get_tag_category_limit(),this.get_combined_filter()),
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({tag_categorys: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({actual_page:Math.floor(get_tag_category_offset() / get_tag_category_limit())})
  },
  componentWillReceiveProps: function(nextProps) {
    if(!(get_tag_category_name_filter == this.state.input_name_filter) || !(get_tag_category_description_filter == this.state.input_description_filter)) {
        this.setState({input_name_filter:get_tag_category_name_filter(),input_description_filter:get_tag_category_description_filter()});
        this.load_number_of_tag_categorys();
        this.load_tag_categorys();
    }

    if(!(nextProps.params.offset==this.props.params.offset)) {
      set_tag_category_offset(nextProps.params.offset);
      this.load_number_of_tag_categorys();
      this.load_tag_categorys();
    }
  },
  componentDidMount: function() {
    this.load_number_of_tag_categorys();
    this.load_tag_categorys();
  },
  createTag_category: function(items){
      var output = [];
      for(var i = 0; i < items.length; i++) {
        output.push(<Tag_category key={i} tag_category={items[i]} handleDelete={this.handleDelete}/>);
      }
      return output;
  },
  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    set_tag_category_offset((parseInt(eventKey)-1)*get_tag_category_limit());
    this.load_number_of_tag_categorys();
    this.load_tag_categorys();
  },
  handleDelete: function(id_to_delete) {
    $.ajax({
      url: "/api/db/KTag_category/" + id_to_delete,
      dataType: 'json',
      type: 'DELETE',
      cache: false,
      success: function(data) {
        this.load_number_of_tag_categorys();
        this.load_tag_categorys();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/tag_category/", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
      <Panel header="Tag categories">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <ButtonToolbar>
                  <ButtonGroup>
                  <Link to='/AddTag_category'>
                    <Button style={{'paddingTop':'9px','paddingLeft':'12px','paddingBottom':'9px','paddingRight':'12px'}} type="submit" className="button-ok">
                      <span className='glyphicon glyphicon-plus'/>
                    </Button>
                  </Link>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button className='glyphicon glyphicon-filter' onClick={this.onFilter}/>
                  </ButtonGroup>
                </ButtonToolbar>
              </th>
              <th>
                <Search
                  column_name="Name"
                  onFilterReset={this.onInputNameFilterReset}
                  onFilterClear={this.onInputNameFilterClear}
                  onFilterChange={this.onInputNameFilterChange}
                  input_filter={this.state.input_name_filter}
                  actual_filter={get_tag_category_name_filter()}
                />
              </th>
              <th>
                <Search
                  column_name="Description"
                  onFilterReset={this.onInputDescriptionFilterReset}
                  onFilterClear={this.onInputDescriptionFilterClear}
                  onFilterChange={this.onInputDescriptionFilterChange}
                  input_filter={this.state.input_description_filter}
                  actual_filter={get_tag_category_description_filter()}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {this.createTag_category(this.state.tag_categorys)}
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
            items={Math.ceil(this.state.total_rows / get_tag_category_limit())}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </ul>
      </Panel>
      <TwoButtonDialog showModal={this.state.showModal}/>
      </div>
    );
  }
});
