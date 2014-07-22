 /*controlling back button for FAQ page */
(function($, window) {
  "use strict";
  var localStorageForm, defaults, pluginName, saveTimers, supports_html5_storage;
  pluginName = "Local Storage Form";
  defaults = {
    namespace: "localStorageForm",
    maxItems: 100,
    saveInterval: 1000,
    clearOnSubmit: false,
    saveOnChange: false,
    keyAttributes: ["tagName", "id", "name"]
  };


	localStorageForm = (function() {
    function localStorageForm(element, option) {
      var attr, storageArray;
      this.element = element;
      this._defaults = defaults;
      this._name = pluginName;
      this.$element = $(this.element);
      this.options = $.extend({}, defaults, (typeof option === "object" ? option : void 0));
      if (typeof option === "string") {
        this.action = option;
      }
      this.uri = window.location.host + window.location.pathname;
      storageArray = [this.options.namespace, this.uri].concat((function() {
        var _i, _len, _ref, _results;
        _ref = this.options.keyAttributes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          _results.push(this.element[attr]);
        }
        return _results;
      }).call(this));
      this.storageKey = storageArray.join(".");
      this.storageIndexKey = [this.options.namespace, "index", window.location.host].join(".");
      this.init();
    }

    localStorageForm.prototype.indexedItems = function() {
      return JSON.parse(localStorage[this.storageIndexKey]);
    };

    localStorageForm.prototype.remove = function() {
      var e, indexedItems;
      this.stop();
      localStorage.removeItem(this.storageKey);
      e = $.Event("phnx.removed");
      this.$element.trigger(e);
      indexedItems = this.indexedItems();
      indexedItems.slice($.inArray(this.storageKey, indexedItems), 1);
      localStorage[this.storageIndexKey] = JSON.stringify(indexedItems);
    };

    localStorageForm.prototype.updateIndex = function() {
      var indexedItems;
      indexedItems = this.indexedItems();
      if ($.inArray(this.storageKey, indexedItems) === -1) {
        indexedItems.push(this.storageKey);
        if (indexedItems.length > this.options.maxItems) {
          localStorage.removeItem(indexedItems[0]);
          indexedItems.shift();
        }
        localStorage[this.storageIndexKey] = JSON.stringify(indexedItems);
      }
    };

    localStorageForm.prototype.load = function() {
      var e, savedValue;
      savedValue = localStorage[this.storageKey];
      if (savedValue != null) {
        if (this.$element.is(":checkbox, :radio")) {
          this.element.checked = JSON.parse(savedValue);
        } else if (this.element.tagName === "SELECT") {
          this.$element.find("option").prop("selected", false);
          $.each(JSON.parse(savedValue), (function(_this) {
            return function(i, value) {
              return _this.$element.find("option[value='" + value + "']").prop("selected", true);
            };
          })(this));
        } else {
          this.element.value = savedValue;
        }
        e = $.Event("phnx.loaded");
        return this.$element.trigger(e);
      }
    };

    localStorageForm.prototype.save = function() {
      var e, selectedValues;
      localStorage[this.storageKey] = this.$element.is(":checkbox, :radio") ? this.element.checked : this.element.tagName === "SELECT" ? (selectedValues = $.map(this.$element.find("option:selected"), function(el) {
        return el.value;
      }), JSON.stringify(selectedValues)) : this.element.value;
      e = $.Event("phnx.saved");
      this.$element.trigger(e);
      return this.updateIndex();
    };

    localStorageForm.prototype.start = function() {
      var e, saveTimer;
      saveTimer = setInterval(((function(_this) {
        return function() {
          return _this.save();
        };
      })(this)), this.options.saveInterval);
      saveTimers.push(saveTimer);
      e = $.Event("phnx.started");
      return this.$element.trigger(e);
    };

    localStorageForm.prototype.stop = function() {
      var e;
      saveTimers.forEach(function(t) {
        return clearInterval(t);
      });
      e = $.Event("phnx.stopped");
      return this.$element.trigger(e);
    };

    localStorageForm.prototype.init = function() {


    return localStorageForm;

  })();
  supports_html5_storage = function() {
    try {
      return "localStorage" in window && window["localStorage"] !== null;
    } catch (_error) {
      return false;
    }
  };
  $.fn[pluginName] = function(option) {
    var pluginID;
    pluginID = "plugin_" + pluginName;
    return this.each(function() {
      if (!($.data(this, pluginID) && !supports_html5_storage())) {
        return $.data(this, pluginID, new localStorageForm(this, option));
      }
    });
  };
})(jQuery, window);


 if (window.history && window.history.pushState) {

     window.history.pushState('forward', null, 'index.php?r=supplier/#basic');
     $(window).on('popstate', function(e) {
         e.preventDefault();
         console.log("back button pressed ");
         if (localStorage) {
             if (localStorage.getItem(formToControl)) {

                 var boottext = "Please save your changes before you leave.";
                 bootbox.dialog({
                     message: boottext,
                     title: "There are some unsaved changes!",
                     buttons: {

                         danger: {
                             label: "Discard Changes",
                             className: "btn-danger ",
                             callback: function() {
                                 if (localStorage.getItem(formToControl))
                                     localStorage.removeItem(formToControl);

                                 var id = $("#components li:first a").attr("id");
                                 console.log("finsishes all tasks" + id);
                                 $("#" + id).trigger("click");
                                 // callback
                             }
                         },
                         success: {
                             label: "Save Changes",
                             className: "btn-success",
                             callback: function() {
                                 $("#" + formToControl).submit();
                             }
                         }

                     }
                 });
                 //window.history.pushState('forward', null, 'index.php?r=supplier/#faq');
             } else {
                 console.log("LocalStorage is not supported");
             }
         }

     });

 }
 // Check for LocalStorage support.
 if (localStorage) {
     if (localStorage.getItem(formToControl))
         renderform(localStorage.getItem(formToControl));

     console.log("LocalStorage is supported");
     $(" textarea,input[type=text]", "#" + formToControl).bind("change paste keyup", function() {
         localStorage.setItem(formToControl, JSON.stringify($("#" + formToControl).serializeArray()));
     });
 } else {
     alert("Please save your changes befor leaving this page!");
     console.log("LocalStorage is not supported");
 }
