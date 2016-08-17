var DATA_XHRS = {};
var DATA_XHR_INDEX = 0;
// gives the ability to abort all of the xhrs that have passed through
// the Data.ajax method
var clearAllXHRs = function() {
  $.each(Object.keys(DATA_XHRS), function(i, key) {
    DATA_XHRS[key].abort();
    delete DATA_XHRS[key];
  });
};

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
      dataType: 'text',
      success: _noop,
      error: _noop,
      transformRequest: _noop,
      transformResponse: _noop
    },
    params
  );

  var _ajax = function() {
    var dataXHRIndex = DATA_XHR_INDEX++;
    DATA_XHRS[dataXHRIndex] = $.ajax({
      url: _params.url,
      type: _params.type,
      data: _params.data,
      dataType: _params.dataType,
      dataXHRIndex: dataXHRIndex,
      success: function(data) {
        _params.cachedData = (_params.transformResponse  === _noop) ? data : _params.transformResponse(data);
        _params.success(_params.cachedData);
        delete DATA_XHRS[dataXHRIndex];
      },
      error: function(err) {
        _params.error(err);
        delete DATA_XHRS[dataXHRIndex];
      }
    });
  };

  return {
    getParams: function() { return _params; },
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
    setSuccess: function(success) {
      if(typeof(success) === 'function') {
        _params.success = success;
      }
      return this;
    },
    setError: function(error) {
      if(typeof(error) === 'function') {
        _params.error = error;
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
