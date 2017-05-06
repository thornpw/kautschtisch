export function buildConditionFromFilters(_filters,_filter_columns) {
  var _condition=''
  var _counter = 0

  for (var _filter in _filters) {
    var _operator='where'
    if(_counter>0) {
      _operator='and'
    }
    var _column = _filter_columns[_counter]
    var _value = "'°" + _filters[_filter] + "°'"

    _condition += _operator + "|" + _column + "|like|" + _value

    if(_counter < _filters.length-1) {
      _condition += ";"
    }

    _counter +=1
  }

  if(_counter!=0) {
    _condition = "&filter=" + _condition
  }
    return _condition
}
