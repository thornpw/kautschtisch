import React from 'react';

const Selection = React.createClass({
    getInitialState: function() {
        return {
            childSelectValue: undefined,
            url: "http://localhost:3300/api/" + this.props.target + "/search/" + this.props.filters +"/"
        }
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({'url': "http://localhost:3300/api/" + this.props.target + "/search/" + this.props.filters +"/"})
    },
    changeHandler: function(e) {
        this.setState({
            childSelectValue: e.target.value
        })
    },
    render: function() {
        return (
            <div>
                <InnerSelect
                    url={this.state.url}
                    column={this.props.column}
                    value={this.state.childSelectValue}
                    onChange={this.changeHandler}
                    change_function={this.props.change_function}
                />
            </div>
        )
    }
});

const InnerSelect = React.createClass({
    propTypes: function() {
        url: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            options: [],
            name: '',
            pattern: '',
            id:''
        }
    },
    onPatternChange: function(e) {
      this.setState({pattern: e.target.value});
    },
    successHandler: function(data) {
        this.state.options.push(
            <option key={"null"} value=""></option>
        );
        for (var i = 0; i < data.length; i++) {
            var option = data[i];
            this.state.options.push(
                <option key={option.id} value={option.id}>{option[this.props.column]}</option>
            );
        }
        this.forceUpdate();
    },
    search: function() {
        // get your data
        this.setState({options: []})
        $.ajax({
          url: this.props.url + this.props.column + "|" + this.state.pattern,
          success: this.successHandler
        })
    },
    render: function() {
        return  (
          <div>
            {this.state.id}
            <input onChange={this.onPatternChange} value= {this.state.pattern} />
            <button type="button" onClick={this.search}>Search</button>
            <select onChange={this.props.change_function}>{this.state.options}</select>
          </div>
        );
    }
});

module.exports = Selection;
