var Data = function(params) {
  if(!params || typeof(params) !== 'object') { params = {}; }
  var _noop = function() {};
  var _params = $.extend(
    true,
    {
      cachedData: '',
      url: '',
      type: 'GET',
      data: undefined,
      dataType: 'json',
      successFunction: _noop,
      errorFunction: _noop,
      transformRequest: _noop,
      transformResponse: _noop
    },
    params
  );

  var _ajax = function() {
    $.ajax({
      url: _params.url,
      type: _params.type,
      data: _params.data,
      dataType: _params.dataType,
      success: function(data) {
        _params.cachedData = (_params.transformResponse  === _noop) ? data : _params.transformResponse(data);
        _params.successFunction(_params.cachedData);
      },
      error: function(err) { _params.errorFunction(err); }
    });
  };

  return {
    setUrl: function(url) {
      if(typeof(url) === 'string') { _params.url = url; }
      return this;
    },
    setType: function(type) {
      if(typeof(type) === 'string') { _params.type = type; }
      return this;
    },
    setData: function(data) {
      if(typeof(data) === 'object') { _params.data = data; }
      return this;
    },
    setDataType: function(dataType) {
      if(typeof(dataType) === 'string') { _params.dataType = dataType; }
      return this;
    },
    setSuccessFunction: function(successFunction) {
      if(typeof(successFunction) === 'function') {
        _params.successFunction = successFunction;
      }
      return this;
    },
    setErrorFunction: function(errorFunction) {
      if(typeof(errorFunction) === 'function') {
        _params.errorFunction = errorFunction;
      }
      return this;
    },
    setTransformRequest: function(transformRequest) {
      if(typeof(transformRequest) === 'function') {
        _params.transformRequest = transformRequest;
      }
      return this;
    },
    setTransformResponse: function(transformResponse) {
      if(typeof(transformResponse) === 'function') {
        _params.transformResponse = transformResponse;
      }
      return this;
    },
    clearCachedData: function() {
      _params.cachedData = undefined;
      return this;
    },
    getCachedData: function() { return _params.cachedData; },
    ajax: function(params) {
      _params.transformRequest(this, params);
      _ajax();
    }
  };
}
