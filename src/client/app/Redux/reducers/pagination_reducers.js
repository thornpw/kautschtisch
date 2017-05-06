var paginations = [
  'links',
  'pictures',
  'files',
  'organisations',
  'picture_links',
  'file_links',
  'organisation_pictures',
  'organisation_links'
]

var context_paginations = [
  'picture_links',
  'file_links',
  'organisation_pictures',
  'organisation_links'
]

function r_pagination(state = {}, action){
  switch (action.type){
    // Check if action dispatched is
    // CREATE_BOOK and act on that
    case 'ADD_PAGINATION':
      return Object.assign({}, state, {
        paginations: action.paginations
      })
    case 'SET_NEWFILTER':
      var _state=state
      console.log(action.new_filter)
      _state.paginations[action.pagination].new_filters[action.number]=action.new_filter
      return Object.assign({}, state, {
        paginations: _state.paginations
      })
    case 'SET_FILTER':
      var _state=state
      _state.paginations[action.pagination].offset= 0
      _state.paginations[action.pagination].active_page= 1
      _state.paginations[action.pagination].filters[action.number]=_state.paginations[action.pagination].new_filters[action.number]
      return Object.assign({}, state, {
        paginations: _state.paginations
      })
    case 'CLEAR_FILTER':
      var _state=state

      _state.paginations[action.pagination].offset= 0
      _state.paginations[action.pagination].active_page= 1
      _state.paginations[action.pagination].new_filters[action.number]=''
      _state.paginations[action.pagination].filters[action.number]=''

      return Object.assign({}, state, {
        paginations: _state.paginations
      })
    case 'CHANGE_OFFSET':
      var _state=state
      _state.paginations[action.pagination].active_page= action.page
      _state.paginations[action.pagination].offset= (action.page-1) * _state.paginations[action.pagination].limit
      return Object.assign({}, state, {
        paginations: _state.paginations
      })
    case 'SET_AMOUNT_OF_ROWS':
      var _state=state
      _state.paginations[action.pagination].total_rows = parseInt(action.amount)
      _state.paginations[action.pagination].max_page = Math.floor(parseInt(action.amount) / _state.paginations[action.pagination].limit)
      return Object.assign({}, state, {
        paginations: _state.paginations
      })
    case 'RESET_PAGINATION':
      console.log("test")
      var _state=state

      for (var elem in paginations) {
        _state.paginations[paginations[elem]].offset = _state.paginations[paginations[elem]].initial_offset
        _state.paginations[paginations[elem]].active_page=1
        _state.paginations[paginations[elem]].filters = _state.paginations[paginations[elem]].initial_filters
      }
    case 'RESET_CONTEXT_PAGINATION':
      var _state=state

      for (var elem in context_paginations) {
        console.log("clear:"+elem)
        _state.paginations[paginations[elem]].offset = _state.paginations[paginations[elem]].initial_offset
        _state.paginations[paginations[elem]].active_page=1
        _state.paginations[paginations[elem]].filters = _state.paginations[paginations[elem]].initial_filters
      }

      return Object.assign({}, state, {
        paginations: _state.paginations
      })
    default:
      return state;
  }
};

export {
  r_pagination
}
