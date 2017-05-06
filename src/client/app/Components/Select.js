import React from 'react';

// Selection
// =============================================================================
// React component to display a select boyelect
// This is a woraround until a full blown select modal dialog is implemented
// *****************************************************************************
// Author: þorN
// *****************************************************************************
// Interface
// *****************************************************************************
// input (props)
// -----
// target:              Table or View
// uid_object           UID Object
// object_filter:       String with filters e.g. and|object_uid|eq|'0002'. Must start with and|or
// display_column       name of the column to compare in the search filter
// value                value of the sarch filter. Default "a" -> mapped to empty string
// change_function      Change function in the parent
//
// Model (state)
// *****************************************************************************
// search_filter:       search filter,
// childSelectValue:    selected value,
// url:                 search rest url
//
// Functions
// *****************************************************************************
// Select a entry from a list
// Filter enties in the list
//
// Versions
// *****************************************************************************
// 1.0 Initial redesign
// =============================================================================

export class Selection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search_filter: '',
      childSelectValue: undefined,
    }
  }
/*  componentWillReceiveProps: function(nextProps) {
    this.setState({'url': "http://localhost:3300/api/tagcontext/" + this.props.object_filter + "/" + this.props.uid_object + "?target=" + this.props.target + "&filter=where|" + this.props.display_column +"|like|'°" + this.state.search_filter + "°'"})
  },*/

  changeHandler(e) {
    this.setState({
      childSelectValue: e.target.value
    })
  }

  render() {
    return (
      <div>
        <InnerSelect
          uid_object={this.props.uid_object}
          display_column={this.props.display_column}
          object_filter={this.props.object_filter}
          media_type={this.props.media_type}
          target={this.props.target}
          value={this.state.childSelectValue}
          onChange={this.changeHandler.bind(this)}
          change_function={this.props.change_function}
        />
      </div>
    )
  }
}

// InnerSelect
// ==============================================================================
class InnerSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
      name: '',
      search_filter: '',
      id:''
    }
  }

  onSearchFilterChange(e) {
    this.setState({search_filter: e.target.value});
  }

  search() {
    // get your data
    this.setState({options: []})
    $.ajax({
      url: "http://localhost:3300/api/tagcontext/" + this.props.object_filter + "/" + this.props.media_type + "/" + this.props.uid_object + "?target=" + this.props.target + "&filter=" + this.state.search_filter + "",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.state.options.push(
            <option key={"null"} value=""></option>
        );
        for (var i = 0; i < data.data.length; i++) {
          var option = data.data[i];
          this.state.options.push(
              <option key={option.TagUID} value={option.TagUID}>{option[this.props.display_column]}</option>
          )
        }
        this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  }

  render() {
    return  (
      <div>
        {this.state.id}
        <input onChange={this.onSearchFilterChange.bind(this)} value= {this.state.search_filter} />
        <button type="button" onClick={this.search.bind(this)}>Search</button>
        <select onChange={this.props.change_function}>{this.state.options}</select>
      </div>
    )
  }
}
