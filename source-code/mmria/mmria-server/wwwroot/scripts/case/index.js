'use strict';

var g_metadata = null;
var g_user_name = null;
var g_is_data_analyst_mode = null;
var g_data_is_checked_out = false;
var g_data = null;
var g_source_db = null;
var g_jurisdiction_list = [];
var g_user_role_jurisdiction_list = [];
var g_jurisdiction_tree = [];
var g_metadata_path = [];
var g_validator_map = [];
var g_event_map = [];
var g_validation_description_map = [];
var g_selected_index = null;
var g_selected_delete_index = null;
var g_couchdb_url = null;
var g_localDB = null;
var g_remoteDB = null;
var g_metadata_summary = [];
var default_object = null;
var g_change_stack = [];
var g_default_ui_specification = null;
var g_use_position_information = true;
var g_look_up = {};
var g_release_version = null;
var g_autosave_interval = null;
var g_value_to_display_lookup = {};
var g_display_to_value_lookup = {};
var g_is_confirm_for_case_lock = false;
var g_target_case_status = null;
var g_previous_case_status = null;


function g_set_data_object_from_path(
  p_object_path,
  p_metadata_path,
  p_dictionary_path,
  value,
  p_form_index,
  p_grid_index,
  p_date_object,
  p_time_object
) {
  var is_search_result = false;
  var search_text = null;

  if (
    g_ui.url_state.selected_id &&
    g_ui.url_state.selected_id == 'field_search'
  ) {
    is_search_result = true;
    search_text = g_ui.url_state.path_array[2].replace(/%20/g, ' ');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    NOTE:
      With date controls, 'value' param is actually the 'this' html node object
      I know this is confusing... But hear me out.
      We are not renaming because 'value' param is used EVERYWHERE on this file

    TODO:
      Consider renaming to something more explicit, ie. 'dateObject'
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  //check if date and value isnt falsey
  if (eval(p_metadata_path).type === 'date')
  {
    const elementObject = value; //grab the current element
    const elementValue = elementObject.value; //get date value
    const elementDataValue = elementObject.dataset.value; //get data-value value

    //if date value is blank
    if (elementObject.value.length < 1) {
      value = ''; //set it to nothing (will revert back to mm/dd/yyyy in the UI OR 'blank')
    }
    //check if there is time in historical data
    //we will want to keep it
    //historical dates below validaton requirements will still persist UNTIL validation is done
    else if (elementDataValue.split('T')[1])
    {
      //reassign value(this) object to a string of current 'yyyy-mm-dd' value + 'HH:MM:SS.sss' value
      //new value string will then be converted to ISO format for validating
      value = new Date(`${elementValue} ${elementDataValue.split('T')[1]}`).toISOString();
    }
    //no time stored
    //set it to current value
    else if (!elementDataValue.split('T')[1])
    {      
      value = elementValue;
    }
  }
  //With datetime control, the below logic concats the extra param value to the orginal value passed in
  //the param value are either 'p_date_object' or 'p_time_object'
  else if (eval(p_metadata_path).type === 'datetime') {
    if (p_date_object) {
      const timeValue = value;
      const hour = timeValue.split(':')[0].length < 2 ? `0${timeValue}` : timeValue;

      value = p_date_object.value + 'T' + hour + 'Z'; // param + ' ' + value
    } else if (p_time_object) {
      const timeValue = p_time_object.value;
      const hour = timeValue.split(':')[0].length < 2 ? `0${timeValue}` : timeValue;

      //check if value null, set to blank else convert to ISO format
      value = !value ? '' : value + 'T' + p_time_object.value + 'Z'; // value + ' ' + param
    }
  }

  var current_value = eval(p_object_path);

  //if(current_value != value)
  //{
  if (g_validator_map[p_metadata_path]) {
    if (g_validator_map[p_metadata_path](value)) {
      var metadata = eval(p_metadata_path);

      if (metadata.type.toLowerCase() == 'boolean') {
        eval(p_object_path + ' = ' + value);
      } else {
        eval(
          p_object_path +
            ' = "' +
            value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
            '"'
        );
      }
      g_data.date_last_updated = new Date();

      //g_data.last_updated_by = g_uid;

      g_change_stack.push({
        object_path: p_object_path,
        metadata_path: p_metadata_path,
        old_value: current_value,
        new_value: value,
      });

      if (g_ui.broken_rules[p_object_path]) {
        g_ui.broken_rules[p_object_path] = false;
      }

      set_local_case(g_data, function () {
        var post_html_call_back = [];

        document.getElementById(
          convert_object_path_to_jquery_id(p_object_path)
        ).innerHTML = page_render(
          metadata,
          eval(p_object_path),
          g_ui,
          p_metadata_path,
          p_object_path,
          '',
          false,
          post_html_call_back
        ).join('');
        if (post_html_call_back.length > 0) {
          eval(post_html_call_back.join(''));
        }

        apply_validation();
      });
    } else {
      g_ui.broken_rules[p_object_path] = true;
      //console.log("didn't pass validation");
    }
  } else {
    var metadata = eval(p_metadata_path);
    var current_value = eval(p_object_path);
    var valid_date_or_datetime = true;
    var entered_date_or_datetime_value = value;

    if (
      metadata.type.toLowerCase() == 'list' &&
      metadata['is_multiselect'] &&
      metadata.is_multiselect == true
    ) {
      var item = eval(p_object_path);

      if (item.indexOf(value) > -1) {
        item.splice(item.indexOf(value), 1);
      } else {
        item.push(value);
      }
    } else if (metadata.type.toLowerCase() == 'boolean') {
      eval(p_object_path + ' = ' + value);
    } else if (metadata.type.toLowerCase() == 'date') {
      if (is_valid_date(value)) {
        eval(
          p_object_path +
            ' = "' +
            value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
            '"'
        );
      } else {
        eval(p_object_path + ' = ""');
        valid_date_or_datetime = false;
      }
    } else if (metadata.type.toLowerCase() == 'datetime') {
      if (is_valid_datetime(value)) {
        eval(
          p_object_path +
            ' = "' +
            value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
            '"'
        );
      } else {
        eval(p_object_path + ' = ""');
        valid_date_or_datetime = false;
      }
    } else {
      eval(
        p_object_path +
          ' = "' +
          value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
          '"'
      );
    }

    g_change_stack.push({
      object_path: p_object_path,
      metadata_path: p_metadata_path,
      old_value: current_value,
      new_value: value,
    });

    g_data.date_last_updated = new Date();
    //g_data.last_updated_by = g_uid;

    set_local_case(g_data, function () {
      var post_html_call_back = [];

      let ctx = {
        form_index: p_form_index,
        grid_index: p_grid_index,
        is_valid_date_or_datetime: valid_date_or_datetime,
        entered_date_or_datetime_value: entered_date_or_datetime_value,
      };

      if (is_search_result) 
      {
        let new_context = get_seach_text_context
        (
          [],
          post_html_call_back,
          metadata,
          eval(p_object_path),
          p_dictionary_path,
          p_metadata_path,
          p_object_path,
          search_text,

          ctx.form_index,
          ctx.grid_index,
           valid_date_or_datetime,
         entered_date_or_datetime_value
        );

        render_search_text(new_context);

        var new_html = new_context.result.join('');
        let result = $('#' + convert_object_path_to_jquery_id(p_object_path));

        if (result.length) {
          result[0].outerHTML = new_html;
        } else {
          result.replaceWith(new_html);
        }
        //$("#" + convert_object_path_to_jquery_id(p_object_path))[0].outerHTML = new_html;
      } else if (metadata.type.toLowerCase() == 'textarea') {
        var new_html = page_render(
          metadata,
          eval(p_object_path),
          g_ui,
          p_metadata_path,
          p_object_path,
          p_dictionary_path,
          false,
          post_html_call_back,
          null,
          ctx
        ).join('');

        $(
          '#' + convert_object_path_to_jquery_id(p_object_path)
        )[0].outerHTML = new_html;
      } else {
        var new_html = page_render(
          metadata,
          eval(p_object_path),
          g_ui,
          p_metadata_path,
          p_object_path,
          p_dictionary_path,
          false,
          post_html_call_back,
          null,
          ctx
        ).join('');

        $('#' + convert_object_path_to_jquery_id(p_object_path)).replaceWith(
          new_html
        );
        //$("#" + convert_object_path_to_jquery_id(p_object_path))[0].outerHTML = new_html;
      }

      switch (metadata.type.toLowerCase()) {
        case 'time':
          $(
            '#' + convert_object_path_to_jquery_id(p_object_path) + ' input'
          ).datetimepicker({
            format: 'LT',
            icons: {
              time: 'x24 fill-p cdc-icon-clock_01',
              date: 'x24 fill-p cdc-icon-calendar_01',
              up: 'x24 fill-p cdc-icon-chevron-circle-up',
              down: 'x24 fill-p cdc-icon-chevron-circle-down',
              previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
              next: 'x24 fill-p cdc-icon-chevron-circle-right-light',
            },
          });
          break;

        /*
          case 'date':
          flatpickr("#" + convert_object_path_to_jquery_id(p_object_path) + " input.date", {
            utc: true,
            enableTime: false,
            defaultDate: value,
            onChange: function(selectedDates, p_value, instance) {
                g_set_data_object_from_path(p_object_path, p_metadata_path, p_dictionary_path, p_value);
            }
          });

          break;
          */
        case 'datetime':
          $(
            `#${convert_object_path_to_jquery_id(
              p_object_path
            )} input.datetime-time`
          ).timepicker({
            defaultTime: '00:00:00',
            minuteStep: 1,
            secondStep: 1,
            showMeridian: false,
            showSeconds: true,
            template: false,
            icons: {
              up: 'x24 fill-p cdc-icon-arrow-down',
              down: 'x24 fill-p cdc-icon-arrow-down',
            },
          });
          // $("#" + convert_object_path_to_jquery_id(p_object_path) + " input").datetimepicker(
          //   {
          //     format:"Y-MM-D H:mm:ss",
          //     defaultDate: value,
          //     icons: {
          //       time: "x24 fill-p cdc-icon-clock_01",
          //       date: "x24 fill-p cdc-icon-calendar_01",
          //       up: "x24 fill-p cdc-icon-chevron-circle-up",
          //       down: "x24 fill-p cdc-icon-chevron-circle-down",
          //       previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
          //       next: 'x24 fill-p cdc-icon-chevron-circle-right-light'
          //     }
          //   });

          if (!isNullOrUndefined(p_date_object)) {
            // console.log('a2', p_date_object.value);
            // do stuff
          } else if (!isNullOrUndefined(p_time_object)) {
            // console.log('b2', p_time_object.value);
            post_html_call_back.push(
              `$('#${convert_object_path_to_jquery_id(
                p_object_path
              )} input.datetime-time').focus()`
            );
          }
          break;

        case 'date':
          // $("#" + convert_object_path_to_jquery_id(p_object_path) + " input").datetimepicker(
          //   {
          //     format:"Y-MM-DD",
          //     defaultDate: value,
          //     icons: {
          //       time: "x24 fill-p cdc-icon-clock_01",
          //       date: "x24 fill-p cdc-icon-calendar_01",
          //       up: "x24 fill-p cdc-icon-chevron-circle-up",
          //       down: "x24 fill-p cdc-icon-chevron-circle-down",
          //       previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
          //       next: 'x24 fill-p cdc-icon-chevron-circle-right-light'
          //     }
          //   });
          break;

        case 'number':
          //$("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").numeric();
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number'
          ).numeric();
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number0'
          ).numeric({ decimal: false });
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number1'
          ).numeric({ decimalPlaces: 1 });
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number2'
          ).numeric({ decimalPlaces: 2 });
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number3'
          ).numeric({ decimalPlaces: 3 });
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number4'
          ).numeric({ decimalPlaces: 4 });
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number5'
          ).numeric({ decimalPlaces: 5 });
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number'
          ).attr('size', '15');
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number0'
          ).attr('size', '15');
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number1'
          ).attr('size', '15');
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number2'
          ).attr('size', '15');
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number3'
          ).attr('size', '15');
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number4'
          ).attr('size', '15');
          $(
            '#' +
              convert_object_path_to_jquery_id(p_object_path) +
              ' input.number5'
          ).attr('size', '15');

          /*
              $("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").TouchSpin({
                              verticalbuttons: true,
                              decimals: 3,
                              min: 0,
                              max: 10000,
                              step: 1,
                              maxboostedstep: 10
                          });*/

          //$("#" + convert_object_path_to_jquery_id(p_object_path) + " input.number").attr("size", "15");
          break;

        case 'list':
          if (
            metadata.control_style != null &&
            metadata.control_style == 'radio'
          ) {
            //console("bubba");
            post_html_call_back.push(
              `$('#${convert_object_path_to_jquery_id(
                p_object_path
              )}${value}').focus()`
            );
          }
          break;
      }

      if (post_html_call_back.length > 0) {
        eval(post_html_call_back.join(''));
      }

      apply_validation();
    });
  }
}

//fn to validate date controls
function is_valid_date(p_value) {
  let result = false; //flag set false by default, we will validate against this

  //return true if blank
  if (p_value.length === 0 || p_value === '') {
    result = true;
  } else {
    let year = p_value.split('T')[0]; //get year and convert to a number
    year = parseInt(year);

    //only validating year, check if between 1900 or 2100
    if (year >= 1900 && year <= 2100) result = true;
  }

  return result;
}

//fn to validate datetime controls
function is_valid_datetime(p_value) {
  p_value = p_value.split('T')[0]; //strip the time if it is available
  let result = false; //flagged as false by default
  let year = null;

  //if date is missing OR blank
  if (p_value === '' || p_value.length === 0) {
    result = true;
  } else {
    year = p_value.split('-')[0]; //get year
    year = parseInt(year); //convert year to a number

    //only validating year
    //check if between 1900 or 2100
    if (year >= 1900 && year <= 2100) {
      result = true;
    }
  }

  return result;
}

function g_add_grid_item(p_object_path, p_metadata_path, p_dictionary_path) {
  var metadata = eval(p_metadata_path);
  var new_line_item = create_default_object(metadata, {}, true);
  let grid = eval(p_object_path);

  grid.push(new_line_item[metadata.name][0]);
  set_local_case(g_data, function () {
    var post_html_call_back = [];
    var render_result = page_render(
      metadata,
      eval(p_object_path),
      g_ui,
      p_metadata_path,
      p_object_path,
      p_dictionary_path,
      false,
      post_html_call_back
    ).join('');
    var element = document.getElementById(p_metadata_path);
    element.outerHTML = render_result;

    apply_tool_tips();

    let jump_value = 9999;

    post_html_call_back.push(
      `document.getElementById("${p_metadata_path}").children[1].scrollTop = ${jump_value};`
    );

    if (post_html_call_back.length > 0) {
      eval(post_html_call_back.join(''));
    }
  });
}

function g_delete_grid_item(
  p_object_path,
  p_metadata_path,
  p_dictionary_path,
  p_index
) {
  var record_number = new Number(p_index) + new Number(1);
  var index_check = prompt(
    'Please confirm delete request of record ' +
      record_number +
      ' by entering the record number:',
    '-1'
  );

  if (index_check != null && record_number == new Number(index_check)) {
    var metadata = eval(p_metadata_path);
    var index = p_object_path
      .match(new RegExp('\\[\\d+\\]$'))[0]
      .replace('[', '')
      .replace(']', '');
    var object_string = p_object_path.replace(new RegExp('(\\[\\d+\\]$)'), '');

    eval(object_string).splice(index, 1);

    set_local_case(g_data, function () {
      var post_html_call_back = [];

      var render_result = page_render(
        metadata,
        eval(object_string),
        g_ui,
        p_metadata_path,
        object_string,
        p_dictionary_path,
        false,
        post_html_call_back
      ).join('');
      var element = document.getElementById(p_metadata_path);
      element.outerHTML = render_result;
      if (post_html_call_back.length > 0) {
        eval(post_html_call_back.join(''));
      }
    });
  }
}

function g_delete_record_item(p_object_path, p_metadata_path, p_index) {
  var record_number = new Number(p_index) + new Number(1);
  var index_check = prompt(
    'Please confirm delete request of record ' +
      record_number +
      ' by entering the record number:',
    '-1'
  );

  if (index_check != null && record_number == new Number(index_check)) {
    var metadata = eval(p_metadata_path);
    var index = p_object_path
      .match(new RegExp('\\[\\d+\\]$'))[0]
      .replace('[', '')
      .replace(']', '');
    var object_string = p_object_path.replace(new RegExp('(\\[\\d+\\]$)'), '');

    eval(object_string).splice(index, 1);
    set_local_case(g_data, function () {
      var post_html_call_back = [];
      document.getElementById(metadata.name + '_id').innerHTML = page_render(
        metadata,
        eval(object_string),
        g_ui,
        p_metadata_path,
        object_string,
        '',
        false,
        post_html_call_back
      ).join('');
      if (post_html_call_back.length > 0) {
        eval(post_html_call_back.join(''));
      }
    });
  }
}

var g_ui = {
  url_state: {
    selected_form_name: null,
    selected_id: null,
    selected_child_id: null,
    path_array: [],
  },

  data_list: [],

  broken_rules: [],

  set_value: function (p_path, p_value) {
    console.log('g_ui.set_value: ', p_path, p_value);
    console.log('value: ', p_value.value);
    console.log('get_eval_string(p_path): ', g_ui.get_eval_string(p_path));

    eval(
      g_ui.get_eval_string(
        p_path + ' = "' + p_value.value.replace('"', '\\"') + '"'
      )
    );

    //var target = eval(g_ui.get_eval_string(p_path));
  },

  get_eval_string: function (p_path) {
    var result =
      'g_data' +
      p_path
        .replace(new RegExp('/', 'gm'), '.')
        .replace(new RegExp('\\.(\\d+)\\.', 'g'), '[$1]\\.')
        .replace(new RegExp('\\.(\\d+)$', 'g'), '[$1]');
    //return an  array with 2 parts.
    // g_data['attribute'].attribute...

    return result;
  },

  add_new_case: function () {
    if (g_autosave_interval != null) {
      window.clearInterval(g_autosave_interval);
    }

    g_autosave_interval = window.setInterval(autosave, 10000);

    var result = create_default_object(g_metadata, {});

    result.date_created = new Date();
    result.created_by = g_user_name;
    result.date_last_updated = new Date();
    result.last_updated_by = g_user_name;
    result.date_last_checked_out = new Date();
    result.last_checked_out_by = g_user_name;
    result.version = g_release_version;
    result.home_record.case_status.overall_case_status = 1;
    result.home_record.case_status.abstraction_begin_date = new Date()
      .toISOString()
      .split('T')[0];

    if (g_jurisdiction_list.length > 0) {
      result.home_record.jurisdiction_id = g_jurisdiction_list[0];
    } else {
      result.home_record.jurisdiction_id = '/';
    }

    result.home_record.last_name = 'new-last-name';
    result.home_record.first_name = 'new-first-name';

    var new_data = [];

    for (var i in g_ui.case_view_list) {
      new_data.push(g_ui.case_view_list[i]);
    }

    var new_record_id = new Date().toISOString();

    new_data.push({
      id: result._id,
      key: result._id,
      value: {
        first_name: result.home_record.first_name,
        middle_name: result.home_record.middle_name,
        last_name: result.home_record.last_name,
        date_of_death_year: result.home_record.date_of_death.year,
        date_of_death_month: result.home_record.date_of_death.month,

        date_created: result.date_created,
        created_by: result.created_by,
        date_last_updated: result.date_last_updated,
        last_updated_by: result.last_updated_by,

        record_id: result.record_id,
        agency_case_id: result.agency_case_id,
        date_of_committee_review: result.committee_review.date_of_review,
      },
    });

    g_ui.case_view_list = new_data;
    g_data = result;
    g_data_is_checked_out = true;
    g_change_stack = [];
    g_ui.selected_record_id = result._id;
    g_ui.selected_record_index = g_ui.case_view_list.length - 1;

    set_local_case(g_data, function () {
      save_case(g_data, function () {
        var url =
          location.protocol +
          '//' +
          location.host +
          '/Case#/' +
          g_ui.selected_record_index +
          '/home_record';

        window.location = url;
      });
    });

    return result;
  },

  case_view_list: [],

  case_view_request: {
    total_rows: 0,
    page: 1,
    skip: 0,
    take: 100,
    sort: 'by_date_last_updated',
    search_key: null,
    descending: true,
    get_query_string: function () {
      var result = [];
      result.push('?skip=' + (this.page - 1) * this.take);
      result.push('take=' + this.take);
      result.push('sort=' + this.sort);

      if (this.search_key) {
        result.push(
          'search_key="' +
            this.search_key.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
            '"'
        );
      }

      result.push('descending=' + this.descending);

      return result.join('&');
    },
  },
};

var $$ = {
  is_id: function (value) {
    // 2016-06-12T13:49:24.759Z
    if (value) {
      var test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/);
      return test ? true : false;
    } else {
      return false;
    }
  },
};

$(function () {
  $(document).keydown(function (evt) {
    if (evt.keyCode == 90 && evt.ctrlKey) {
      evt.preventDefault();
      undo_click();
    }
  });

  let working_space = 1000; // 1GB
  let default_local_storage_limit = 5000; // 5GB

  /*
  let working_space = 100;
  let default_local_storage_limit = 300; */


  $('#profile_form2').on('submit', navigation_away);

  if (
    default_local_storage_limit - get_local_storage_space_usage_in_kilobytes() <
    working_space
  ) {
    let case_index = create_local_storage_index();
    let case_index_array = convert_local_storage_index_to_array(case_index);
    let is_update_case_index = false;
    let space_removed = 0;

    for (
      let index = 0;
      index < case_index_array.length && space_removed < working_space;
      index++
    ) {
      let item = case_index_array[index];
      let key = item._id;

      try {
        delete case_index[key];
        space_removed += item.size_in_kilobytes;
        is_update_case_index = true;
        localStorage.removeItem('case_' + key);
      } catch (ex) {
        //console.log("remove this");
      }
    }

    if (is_update_case_index) {
      window.localStorage.setItem('case_index', JSON.stringify(case_index));
    }
  }

  if (window.location.pathname == '/analyst-case') {
    g_is_data_analyst_mode = 'da';
  }

  /*
        // Get the modal
        var modal = document.getElementById('myModal');

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");
    
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
    
        // When the user clicks on the button, open the modal
        btn.onclick = function() {
            modal.style.display = "block";
        }
    
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
    
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        } 

  */

  // https://pure-essence.net/2010/02/14/jquery-session-timeout-countdown/
  // create the warning window and set autoOpen to false
  var sessionTimeoutWarningDialog = $('#sessionTimeoutWarningDiv');

  $('#sessionTimeoutOkButton').click(function () {
    // close dialog

    clearInterval(timer);
    running = false;
    $('#sessionTimeoutWarningDiv').dialog('close');
    profile.update_session_timer();
  });

  //$(sessionTimeoutWarningDialog).html(initialSessionTimeoutMessage);
  $(sessionTimeoutWarningDialog).dialog({
    title: 'Session Expiration Warning',
    autoOpen: false, // set this to false so we can manually open it
    closeOnEscape: false,
    draggable: false,
    width: 600,
    minHeight: 50,
    backgroundColor: 0xadc71a, // rgb(173, 199, 26),
    modal: true,
    beforeclose: function () {
      // bind to beforeclose so if the user clicks on the "X" or escape to close the dialog, it will work too
      // stop the timer
      clearInterval(timer);

      // stop countdown
      running = false;
    },
    buttons: {
      OK: function () {
        // close dialog

        clearInterval(timer);
        running = false;
        $(this).dialog('close');
        profile.update_session_timer();
      },
    },
    resizable: false,
    open: function () {
      // scrollbar fix for IE
      $('#sessionTimeoutWarningDiv').css('display', 'block');
      $('body').css('overflow', 'hidden');
      $('#sessionTimeoutExpiredId').hide();
      $('#sessionTimeoutPendingId').css('display', 'block');
    },
    close: function () {
      // reset overflow
      $('body').css('overflow', 'auto');
      clearInterval(timer);
      running = false;
      $(this).dialog('close');
      profile.update_session_timer();
    },
  });
  // end of dialog

  // start the idle timer
  //$.idleTimer(idleTime);

  // bind to idleTimer's idle.idleTimer event
  $(document).bind('sessionWarning', function () {
    $(sessionTimeoutWarningDialog).show();
    // if the user is idle and a countdown isn't already running
    //if($.data(document,'idleTimer') === 'idle' && !running)
    if (!running) {
      var counter = redirectAfter;
      running = true;

      // intialisze timer
      $('#' + sessionTimeoutCountdownId).html(redirectAfter);
      // open dialog
      $(sessionTimeoutWarningDialog).dialog('open');

      // create a timer that runs every second
      timer = setInterval(function () {
        counter -= 1;

        // if the counter is 0, redirect the user
        if (counter === 0) {
          //$(sessionTimeoutWarningDialog).html(expiredMessage);
          $('#sessionTimeoutExpiredId').show();
          $('#sessionTimeoutPendingId').css('display', 'none');
          $(sessionTimeoutWarningDialog).dialog('disable');
          //window.location = redirectTo;
          running = false;
          clearInterval(timer);
          clearInterval(session_warning_interval_id);
          profile.logout();
        } else {
          $('#' + sessionTimeoutCountdownId).html(counter);
        }
      }, 1000);
    }
  });

  //set_session_warning_interval();

  $.datetimepicker.setLocale('en');

  load_jurisdiction_tree();
});

function load_values() {
  $.ajax({
    url: location.protocol + '//' + location.host + '/api/values',
  }).done(function (response) {
    g_couchdb_url = response.couchdb_url;
    load_jurisdiction_tree();
  });
}

function load_jurisdiction_tree() {
  var metadata_url =
    location.protocol + '//' + location.host + '/api/jurisdiction_tree';

  $.ajax({
    url: metadata_url,
  }).done(function (response) {
    g_jurisdiction_tree = response;

    load_my_user();
    //document.getElementById('navigation_id').innerHTML = navigation_render(g_jurisdiction_list, 0, g_ui).join("");
  });
}

function load_my_user() {
  /*            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
            */

  $.ajax({
    url: location.protocol + '//' + location.host + '/api/user/my-user',
  }).done(function (response) {
    g_user_name = response.name;

    load_user_role_jurisdiction();
  });
}

function load_user_role_jurisdiction() {
  /*            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
            */

  $.ajax({
    url:
      location.protocol +
      '//' +
      location.host +
      '/api/user_role_jurisdiction_view/my-roles', //&search_key=' + g_uid,
  }).done(function (response) {
    g_user_role_jurisdiction_list = [];
    for (var i in response.rows) {
      var value = response.rows[i].value;
      //if(value.user_id == g_uid && value.role_name == "abstractor")
      //{
      g_user_role_jurisdiction_list.push(value.jurisdiction_id);
      //}
    }

    create_jurisdiction_list(g_jurisdiction_tree);

    $('#landing_page').hide();
    $('#logout_page').hide();
    $('#footer').hide();
    $('#root').removeClass('header');

    get_release_version();

    //load_profile();
  });
}

function create_jurisdiction_list(p_data) {
  for (var i = 0; i < g_user_role_jurisdiction_list.length; i++) {
    var jurisdiction_regex = new RegExp('^' + g_user_role_jurisdiction_list[i]);
    var match = p_data.name.match(jurisdiction_regex);

    if (match) {
      g_jurisdiction_list.push(p_data.name);
      break;
    }
  }

  if (p_data.children != null) {
    for (var i = 0; i < p_data.children.length; i++) {
      var child = p_data.children[i];

      create_jurisdiction_list(child);
    }
  }
}

var update_session_timer_interval_id = null;

function load_profile() {
  profile.on_login_call_back = function () {
    $('#landing_page').hide();
    $('#logout_page').hide();
    $('#footer').hide();
    $('#root').removeClass('header');

    get_release_version();
  };

  profile.on_logout_call_back = function (p_user_name, p_password) {
    if (update_session_timer_interval_id != null) {
      window.clearInterval(update_session_timer_interval_id);
      update_session_timer_interval_id = null;
    }

    //$("#landing_page").show();
    $('#root').addClass('header');
    $('#footer').show();
    if (
      profile.user_roles &&
      profile.user_roles.length > 0 &&
      profile.user_roles.indexOf('_admin') < 0 &&
      profile.user_roles.indexOf('committee_member') < 0
    ) {
      //replicate_db_and_log_out(p_user_name, p_password);
    }

    document.getElementById('navbar').innerHTML = '<p>testtestTestTEST</p>';
    document.getElementById('form_content_id').innerHTML = '';

    var url = location.protocol + '//' + location.host + '/';

    window.location.href = url;
  };

  profile.initialize_profile();
}

function get_case_set(p_call_back) {
  var case_view_url =
    location.protocol +
    '//' +
    location.host +
    '/api/case_view' +
    g_ui.case_view_request.get_query_string();

  $.ajax({
    url: case_view_url,
  }).done(function (case_view_response) {
    //console.log(case_view_response);
    g_ui.case_view_list = [];
    g_ui.case_view_request.total_rows = case_view_response.total_rows;

    for (var i = 0; i < case_view_response.rows.length; i++) {
      g_ui.case_view_list.push(case_view_response.rows[i]);
    }

    if (p_call_back) {
      // Useful to do somethings after I get/set cases
      // Example usage is setting search filter on Case Listing page
      p_call_back();
    } else {
      var post_html_call_back = [];

      document.getElementById('navbar').innerHTML = navigation_render(
        g_metadata,
        0,
        g_ui
      ).join('');
      document.getElementById('form_content_id').innerHTML =
        '<h4>Fetching data from database.</h4><h5>Please wait a few moments...</h5>';
      document.getElementById('form_content_id').innerHTML = page_render(
        g_metadata,
        default_object,
        g_ui,
        'g_metadata',
        'default_object',
        '',
        false,
        post_html_call_back
      ).join('');

      if (post_html_call_back.length > 0) {
        eval(post_html_call_back.join(''));
      }

      var section_list = document.getElementsByTagName('section');

      for (var i = 0; i < section_list.length; i++) {
        var section = section_list[i];

        if (section.id == 'app_summary') {
          section.style.display = 'block';
        } else {
          section.style.display = 'block';
        }
      }
    }
  });
}

function get_ui_specification() {
  $.ajax({
    url:
      location.protocol +
      '//' +
      location.host +
      `/api/version/${g_release_version}/ui_specification`,
  }).done(function (response) {
    g_default_ui_specification = response;
    get_metadata();
  });
}

function get_release_version() {
  $.ajax({
    url:
      location.protocol + '//' + location.host + '/api/version/release-version',
  }).done(function (response) {
    g_release_version = response;
    get_ui_specification();
  });
}

function get_metadata() {
  document.getElementById('form_content_id').innerHTML =
    '<h4>Fetching data from database.</h4><h5>Please wait a few moments...</h5>';

  $.ajax({
    //url: location.protocol + '//' + location.host + '/api/metadata',
    url:
      location.protocol +
      '//' +
      location.host +
      `/api/version/${g_release_version}/metadata`,
  }).done(function (response) {
    g_metadata = response;
    metadata_summary(g_metadata_summary, g_metadata, 'g_metadata', 0, 0);
    default_object = create_default_object(g_metadata, {});

    set_list_lookup(
      g_display_to_value_lookup,
      g_value_to_display_lookup,
      g_metadata,
      ''
    );

    for (var i in g_metadata.lookup) {
      var child = g_metadata.lookup[i];

      g_look_up['lookup/' + child.name] = child.values;
    }

    //create_validator_map(g_validator_map, g_validation_description_map, g_metadata, "g_metadata");
    function create_validator(p_metadata, p_path) {
      let result = null;
      //create_validator_map(g_validator_map, g_validation_description_map, g_metadata, "g_metadata");
      /*

        default_value
        validation
        validation_description
        min_value
        max_value
        max_length
        regex_pattern

        is_required




      */
      switch (p_metadata.type.toLowerCase()) {
        case 'boolean':

        case 'string':
        case 'number':
        case 'hidden':
        case 'list':
        case 'textarea':
        case 'time':
        case 'date':
        case 'datetime':
          break;
      }

      return result;
    }

    //window.location.href = location.protocol + '//' + location.host;

    get_case_set();

    g_ui.url_state = url_monitor.get_url_state(window.location.href);
    if (window.onhashchange) {
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    } else {
      window.onhashchange = window_on_hash_change;
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    }

    window.onbeforeunload = navigation_away;
  });
}

function window_on_hash_change(e) {
  /*
  e = HashChangeEvent
  {
    isTrusted: true,
    oldURL: "http://localhost:12345/react-test/#/",
    newURL: "http://localhost:12345/rea
  }*/

  if (g_data) {
    if (e.isTrusted) {
      var new_url = e.newURL || window.location.href;
      g_ui.url_state = url_monitor.get_url_state(new_url);

      if (
        g_ui.url_state.path_array &&
        g_ui.url_state.path_array.length > 0 &&
        parseInt(g_ui.url_state.path_array[0]) >= 0
      ) {
        /*
        if(g_data._id != g_ui.data_list[parseInt(g_ui.url_state.path_array[0])]._id)
        {
            save_queue.push(g_data._id);
        }*/

        var case_id = g_data._id;
        save_case(g_data, function () {
          get_specific_case(
            g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id
          );
        });
      } else {
        g_data.date_last_checked_out = null;
        g_data.last_checked_out_by = null;
        g_data_is_checked_out = false;

        save_case(g_data, function () {
          g_data = null;
          get_case_set(function () {
            g_render();
          });
        });
      }
    }

    // g_data_access.set_data(g_data);
  } else if (e.isTrusted) {
    var new_url = e.newURL || window.location.href;

    g_ui.url_state = url_monitor.get_url_state(new_url);

    if (
      g_ui.url_state.path_array &&
      g_ui.url_state.path_array.length > 0 &&
      parseInt(g_ui.url_state.path_array[0]) >= 0
    ) {
      if (g_ui.case_view_list.length > 0) {
        get_specific_case(
          g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id
        );
        //g_data = g_ui.data_list[parseInt(g_ui.url_state.path_array[0])];
      } else {
        g_render();
      }
      //
    } else {
      /*
      if(g_data && !(save_queue.indexOf(g_data._id) > -1))
      {
        save_queue.push(g_data._id);
      }*/
      //save_case(g_data);
      //g_data = null;

      g_render();
    }
  } else {
    // do nothing for now
  }
}

function get_specific_case(p_id) {
  var case_url =
    location.protocol + '//' + location.host + '/api/case?case_id=' + p_id;

  $.ajax({
    url: case_url,
  })
    .done(function (case_response) {
      if (case_response) {
        var local_data = get_local_case(p_id);

        if (local_data) {
          if (local_data._rev && local_data._rev == case_response._rev) {
            g_data = local_data;
            g_data_is_checked_out = is_case_checked_out(g_data);
          } else {
            /*
            console.log( "get_specific_case potential conflict:",  local_data._id, local_data._rev, case_response._rev);
            var date_difference = local_data.date_last_updated.diff(case_response.date_last_updated);
            if(date_difference.days > 3)
            {*/

            local_data = case_response;
            /*}
            else
            {
              local_data._rev = case_response._rev;
            }*/

            set_local_case(local_data);
            g_data = local_data;
            g_data_is_checked_out = is_case_checked_out(g_data);
          }

          if (g_autosave_interval != null && g_data_is_checked_out == false) {
            window.clearInterval(g_autosave_interval);
            g_autosave_interval = null;
          }

          g_render();
        } else {
          g_data = case_response;
          g_data_is_checked_out = is_case_checked_out(g_data);

          if (g_autosave_interval != null && g_data_is_checked_out == false) {
            window.clearInterval(g_autosave_interval);
            g_autosave_interval = null;
          }
        }
        g_render();
      } else {
        g_render();
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log('get_specific_case:', textStatus, errorThrown);
      g_data = get_local_case(p_id);
      g_data_is_checked_out = is_case_checked_out(g_data);
    });
}

function save_case(p_data, p_call_back) {
  if (p_data.host_state == null || p_data.host_state == '') {
    p_data.host_state = window.location.host.split('-')[0];
  }

  if (g_is_data_analyst_mode == null) {
    $.ajax({
      url: location.protocol + '//' + location.host + '/api/case',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(p_data),
      type: 'POST',
    })
      .done(function (case_response) {
        console.log('save_case: success');

        g_change_stack = [];

        if (g_data && g_data._id == case_response.id) {
          g_data._rev = case_response.rev;
          g_data_is_checked_out = is_case_checked_out(g_data);
          set_local_case(g_data);
          //console.log('set_value save finished');
        }

        if (p_call_back) {
          p_call_back();
        }
      })
      .fail(function (xhr, err) {
        console.log('server save_case: failed', err);
        if (xhr.status == 401) {
          let redirect_url = location.protocol + '//' + location.host;
          window.location = redirect_url;
        }
      });
  } else {
    if (p_call_back) {
      p_call_back();
    }
  }
}

function delete_case(p_id, p_rev) {
  $.ajax({
    url:
      location.protocol +
      '//' +
      location.host +
      '/api/case?case_id=' +
      p_id +
      '&rev=' +
      p_rev,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    //data: JSON.stringify(p_data),
    type: 'DELETE',
  })
    .done(function (case_response) {
      console.log('delete_case: success');

      try {
        localStorage.removeItem('case_' + p_id);
      } catch (ex) {
        // do nothing for now
      }
      get_case_set();
    })
    .fail(function (xhr, err) {
      console.log('delete_case: failed', err);
    });
}

function g_render() {
  var post_html_call_back = [];

  document.getElementById('navbar').innerHTML = navigation_render(
    g_metadata,
    0,
    g_ui
  ).join('');
  document.getElementById('form_content_id').innerHTML = page_render(
    g_metadata,
    g_data,
    g_ui,
    'g_metadata',
    'g_data',
    '',
    false,
    post_html_call_back
  ).join('');

  apply_tool_tips();

  if (post_html_call_back.length > 0) {
    try {
      eval(post_html_call_back.join(''));
    } catch (ex) {
      console.log(ex);
    }
  }

  var section_list = document.getElementsByTagName('section');

  if (g_ui.url_state.path_array[0] == 'summary') {
    for (var i = 0; i < section_list.length; i++) {
      var section = section_list[i];

      if (section.id == 'app_summary') {
        section.style.display = 'block';
        //section.style.display = "grid";
        //section.style["grid-template-columns"] = "1fr 1fr 1fr";
      } else {
        section.style.display = 'none';
      }
    }
  } else if (
    g_ui.url_state.path_array.length >= 2 &&
    g_ui.url_state.path_array[1] == 'field_search'
  ) {
    for (var i = 0; i < section_list.length; i++) {
      var section = section_list[i];

      if (section.id == 'field_search_id') {
        section.style.display = 'block';
        //section.style.display = "grid";
        //section.style["grid-template-columns"] = "1fr 1fr 1fr";
      } else {
        section.style.display = 'none';
      }
    }
  } else {
    if (
      g_ui.url_state.path_array.length > 2 &&
      parseInt(g_ui.url_state.path_array[0]) >= 0
    ) {
      for (var i = 0; i < section_list.length; i++) {
        var section = section_list[i];

        if (section.id == g_ui.url_state.path_array[1]) {
          section.style.display = 'block';
          //section.style.display = "grid";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
        } else {
          section.style.display = 'none';
        }
      }
    } else {
      for (var i = 0; i < section_list.length; i++) {
        var section = section_list[i];

        if (section.id == g_ui.url_state.path_array[1] + '_id') {
          section.style.display = 'block';
          //section.style.display = "grid";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
        } else {
          section.style.display = 'none';
        }
      }
    }
  }
}

function show_print_version() {
  window.open('./print-version', '_print_version');
}

function show_data_dictionary() {
  window.open('./data-dictionary', '_data_dictionary');
}

function show_user_administration() {
  window.open('./_users', '_users');
}

function apply_tool_tips() {
  $('[rel=tooltip]').tooltip();
  $('.time').datetimepicker({
    format: 'LT',
    icons: {
      time: 'x24 fill-p cdc-icon-clock_01',
      date: 'x24 fill-p cdc-icon-calendar_01',
      up: 'x24 fill-p cdc-icon-chevron-circle-up',
      down: 'x24 fill-p cdc-icon-chevron-circle-down',
      previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
      next: 'x24 fill-p cdc-icon-chevron-circle-right-light',
    },
  });
  //$( "[metadata_type='date']" ).datetimepicker();
  /*
  flatpickr(" .date", {
    utc: true,
    //defaultDate: "2016-12-27T00:00:00.000Z",
    enableTime: false,
    onSelect: function(p_value,evnt) 
    {
                  g_set_data_object_from_path(p_object_path, p_metadata_path, p_dictionary_path, p_value);
    }
  });*/

  //$( ".datetime" ).datetimepicker();

  $('input.number').numeric();
  $('input.number0').numeric({ decimal: false });
  $('input.number1').numeric({ decimalPlaces: 1 });
  $('input.number2').numeric({ decimalPlaces: 2 });
  $('input.number3').numeric({ decimalPlaces: 3 });
  $('input.number4').numeric({ decimalPlaces: 4 });
  $('input.number5').numeric({ decimalPlaces: 5 });
  $('input.number').attr('size', '15');
  $('input.number0').attr('size', '15');
  $('input.number1').attr('size', '15');
  $('input.number2').attr('size', '15');
  $('input.number3').attr('size', '15');
  $('input.number4').attr('size', '15');
  $('input.number5').attr('size', '15');

  /*
  $("input.number").TouchSpin({
                  verticalbuttons: true,
          decimals: 3,
                  min: 0,
                  max: 10000,
                  step: 1,
                  maxboostedstep: 10
              });*/

  //$("input.number").mask("#,##0[.00", {reverse: true});

  apply_validation();
}

function apply_validation() {
  for (var i in g_ui.broken_rules) {
    var element = document.getElementById(i);

    if (g_ui.broken_rules[i] == true) {
      if (element && element.className.indexOf('failed-validation') < 0) {
        element.className += ' failed-validation';
        /*
         var validation_text = element.getAttribute('validation-tooltip');
         if(validation_text)
         {
          var span_node = document.createElement("span");
          span_node.setAttribute('class', 'tooltip-content');
          span_node.innerText = element.getAttribute('validation-tooltip');
          element.appendChild(span_node);
         }
         */
      }
    } else {
      if (element && element.className.indexOf('failed-validation') > 0) {
        var class_array = element.className.split(' ');

        class_array.splice(class_array.indexOf('failed-validation'), 1);
        element.className = class_array.join(' ');
      }
    }
  }
}

// First
function init_delete_dialog(p_index, callback) {
  const case_list = g_ui.case_view_list;
  const modal = build_delete_dialog(case_list[p_index], p_index);
  const box = $('#content');

  box.append(modal[0]);

  $('#case_modal_' + p_index).modal('show');
}

// Second
function update_delete_dialog(p_index, callback) {
  const modal = $(`#case_modal_${p_index}`);
  const modal_msgs = modal.find('.modal-messages p');
  const modal_icons = modal.find('.modal-icons > span');
  const modal_btns = modal.find('.modal-footer button');

  modal_icons.first().hide();
  modal_icons.last().show();

  setTimeout(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const min = date.getMinutes();
    const second = date.getSeconds();
    const user_name = document.getElementById('user_logged_in').innerText;

    callback();

    modal_icons.parent().hide();
    modal_msgs
      .first()
      .text(
        `Deleted ${
          user_name && 'by ' + user_name
        } ${month}/${day}/${year} ${hour}:${min}:${second}`
      );
    modal_msgs.first().css({
      color: 'red',
      fontWeight: 'bold',
    });
    modal_msgs.last().hide();
    modal_btns.hide();
    modal_btns.last().show();
  }, 2500);
}

function build_delete_dialog(p_values, p_index) {
  const modal_ui = [];

  modal_ui.push(`
    <div id="case_modal_${p_index}" class="modal modal-${p_index}" tabindex="-1" role="dialog" aria-labelledby="case_modal_label_${p_index}" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header bg-primary">
                <h5 id="case_modal_label_${p_index}" class="modal-title">Confirm Delete Case</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              </div>
              <div class="modal-body modal-body-1 row no-gutters">
                <div class="modal-icons">
                  <span class="x40 fill-p cdc-icon-alert_02" aria-hidden="true"></span>
                  <span class="spinner-container spinner-inline" style="display: none">
                    <span class="spinner-body text-primary">
                      <span class="spinner"></span>
                    </span>
                  </span>
                </div>
                <div class="modal-messages">
                  <p>Are you sure you want to delete this case?</p>
                  <p>
                    <strong>
                      ${
                        p_values.value.jurisdiction_id &&
                        `${p_values.value.jurisdiction_id} : `
                      }
                      ${
                        p_values.value.last_name &&
                        `${p_values.value.last_name}`
                      }
                      ${
                        p_values.value.first_name &&
                        ` , ${p_values.value.first_name}`
                      }
                      ${
                        p_values.value.record_id &&
                        ` - ${p_values.value.record_id}`
                      }
                      ${
                        p_values.value.agency_case_id &&
                        ` ac_id: ${p_values.value.agency_case_id}`
                      }
                    </strong>
                  </p>
                  <p>Last updated ${p_values.value.date_last_updated} by ${
    p_values.value.last_updated_by
  }</p>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="modal-cancel btn btn btn-outline-secondary flex-order-2 mr-0" data-dismiss="modal" onclick="dispose_all_modals()">Cancel</button>
                <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2" onclick="update_delete_dialog(${p_index}, () => { delete_record(${p_index}) })">Delete</button>
                <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2" style="display: none" onclick="dispose_all_modals()">OK</button>
              </div>
          </div>
      </div>
    </div>
  `);

  return modal_ui;
}

function dispose_all_modals() {
  $('.modal').remove();
  $('.modal-backdrop').remove();
  $('body').removeClass('modal-open').removeAttr('class');
  $('body').removeAttr('style');
}

function delete_record(p_index) {
  if (p_index == g_selected_delete_index) {
    var data = g_ui.case_view_list[p_index];

    g_selected_delete_index = null;

    $.ajax({
      url:
        location.protocol +
        '//' +
        location.host +
        '/api/case?case_id=' +
        data.id,
    }).done(function (case_response) {
      delete_case(case_response._id, case_response._rev);
    });
  } else {
    if (g_selected_delete_index != null && g_selected_delete_index > -1) {
      var old_id = g_ui.case_view_list[g_selected_delete_index].id;

      $("tr[path='" + old_id + "']").css('background', '');
    }

    g_selected_delete_index = p_index;

    var id = g_ui.case_view_list[p_index].id;

    $("tr[path='" + id + "']").css('background', '#ffd54f');
  }
}

var save_interval_id = null;
var save_queue = [];

function enable_print_button(event) {
  const { value } = event.target;
  //duplicate print buttons being rendered
  //targetting next sibling instead
  const printButton = event.target.nextSibling; 
  // const printButton = document.getElementById('print-case-form');
  printButton.disabled = !value; // if there is a value it will be enabled.
}

function print_case_onclick(event) {
  const btn = event.target;
  const dropdown = btn.previousSibling;
  // const dropdown = document.getElementById('print_case_id');
  // get value of selected option
  const section_name = dropdown.value;

  if (section_name) {
    if (section_name == 'core-summary') {
      openTab('./core-elements', '_core_summary', 'all');
    } else {
      // data-record of selected option
      const selectedOption = dropdown.options[dropdown.options.selectedIndex];
      const record_number = selectedOption.dataset.record;
      const tabName = section_name === 'all' ? '_all' : '_print_version';
      openTab('./print-version', tabName, section_name, record_number);
    }
  }
}

function openTab(pageRoute, tabName, p_section, p_number) {
  // check if a WindowProxy object has already been created.
  if (!window[tabName] || window[tabName].closed) {
    window[tabName] = window.open(pageRoute, tabName, null, false);
    window[tabName].addEventListener('load', () => {
      window[tabName].create_print_version(
        g_metadata,
        g_data,
        p_section,
        p_number
      );
    });
  } else {
    // if the WindowProxy Object already exists then just call the function on it
    window[tabName].create_print_version(
      g_metadata,
      g_data,
      p_section,
      p_number
    );
  }
}

function add_new_form_click(p_metadata_path, p_object_path) {
  console.log('add_new_form_click: ' + p_metadata_path + ' , ' + p_object_path);

  var metadata = eval(p_metadata_path);
  var form_array = eval(p_object_path);
  var new_form = create_default_object(metadata, {}, true);
  var item = new_form[metadata.name][0];

  form_array.push(item);

  save_case(g_data, function () {
    var post_html_call_back = [];
    document.getElementById(metadata.name + '_id').innerHTML = page_render(
      metadata,
      form_array,
      g_ui,
      p_metadata_path,
      p_object_path,
      '',
      false,
      post_html_call_back
    ).join('');
    if (post_html_call_back.length > 0) {
      eval(post_html_call_back.join(''));
    }
  });
}

function enable_edit_click() {
  if (g_data) {
    g_data.date_last_updated = new Date();
    g_data.date_last_checked_out = new Date();
    g_data.last_checked_out_by = g_user_name;
    g_data_is_checked_out = true;
    save_case(g_data, create_save_message);
    g_autosave_interval = window.setInterval(autosave, 10000);
    g_render();
  }
}

function save_form_click() {
  save_case(g_data, create_save_message);
}

function save_and_finish_click() {
  g_data.date_last_updated = new Date();
  g_data.date_last_checked_out = null;
  g_data.last_checked_out_by = null;
  g_data_is_checked_out = false;
  save_case(g_data, create_save_message);
  g_render();
  window.clearInterval(g_autosave_interval);
  g_autosave_interval = null;
}

function create_save_message() {
  var result = [];

  result.push(`
    <div class="alert alert-success alert-dismissible">
      <button class="close" data-dismiss="alert" aria-label="close">&times;</button>
      <p>Case information has been saved</p>
    </div>
  `);

  document.getElementById('nav_status_area').innerHTML = result.join('');

  window.setTimeout(clear_nav_status_area, 5000);
}

function clear_nav_status_area() {
  document.getElementById('nav_status_area').innerHTML = '<div>&nbsp;</div>';
}

function set_local_case(p_data, p_call_back) {
  let local_storage_index = get_local_storage_index();

  if (local_storage_index == null) {
    local_storage_index = create_local_storage_index();
  }

  local_storage_index[p_data._id] = create_local_storage_index_item(p_data);
  window.localStorage.setItem(
    'case_index',
    JSON.stringify(local_storage_index)
  );

  window.localStorage.setItem('case_' + p_data._id, JSON.stringify(p_data));

  if (p_call_back) {
    p_call_back();
  }
}

function create_local_storage_index() {
  let result = {};

  for (let key in window.localStorage) {
    if (key == 'case_index') {
      continue;
    }

    if (window.localStorage.hasOwnProperty(key)) {
      let item_string = window.localStorage[key];
      let item_object = JSON.parse(item_string);

      result[item_object._id] = create_local_storage_index_item(item_object);
    }
  }

  window.localStorage.setItem('case_index', JSON.stringify(result));

  return result;
}

function get_local_storage_space_usage_in_kilobytes() {
  let allStrings = '';

  for (let key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      allStrings += window.localStorage[key];
    }
  }
  return allStrings ? 3 + (allStrings.length * 16) / (8 * 1024) : 0;
}

function calc_local_storage_space_usage_in_kilobytes(p_string) {
  return p_string ? 3 + (p_string.length * 16) / (8 * 1024) : 0;
}

function convert_local_storage_index_to_array(p_case_index) {
  let result = [];

  for (let key in p_case_index) {
    if (p_case_index.hasOwnProperty(key)) {
      let item = p_case_index[key];
      let item_object = JSON.parse(window.localStorage['case_' + key]);

      if (!(item.date_last_updated instanceof Date)) {
        item.date_last_updated = new Date(item.date_last_updated);
      }

      item.size_in_kilobytes = calc_local_storage_space_usage_in_kilobytes(
        JSON.stringify(item_object)
      );

      result.push(item);
    }
  }

  //result.sort(function(p1, p2){return p1.size_in_kilobytes-p2.size_in_kilobytes});
  result.sort(function (p1, p2) {
    return p1.date_last_updated - p2.date_last_updated;
  });

  return result;
}

function get_local_storage_index() {
  let result = JSON.parse(window.localStorage.getItem('case_index'));

  if (result == null) {
    result = create_local_storage_index();
  } else if (
    Object.keys(result).length === 0 &&
    result.constructor === Object &&
    window.localStorage.length > 0
  ) {
    result = create_local_storage_index();
  }

  return result;
}

function create_local_storage_index_item(p_data) {
  return {
    _id: p_data._id,
    _rev: p_data._rev,
    date_created: p_data.date_created,
    created_by: p_data.created_by,
    date_last_updated: p_data.date_last_updated,
    last_updated_by: p_data.last_updated_by,
  };
}

function get_local_case(p_id) {
  var result = null;

  result = JSON.parse(window.localStorage.getItem('case_' + p_id));

  return result;
}

function undo_click() {
  var current_change = g_change_stack.pop();

  if (current_change) {
    var metadata = eval(current_change.metadata_path);

    if (
      metadata.type.toLowerCase() == 'list' &&
      metadata['is_multiselect'] &&
      metadata.is_multiselect == true
    ) {
      var item = eval(current_change.object_path);

      if (item.indexOf(current_change.old_value) > -1) {
        item.splice(item.indexOf(current_change.old_value), 1);
      } else {
        item.push(current_change.old_value);
      }
    } else if (metadata.type.toLowerCase() == 'boolean') {
      eval(current_change.object_path + ' = ' + current_change.old_value);
    } else {
      eval(
        current_change.object_path +
          ' = "' +
          current_change.old_value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
          '"'
      );
    }
  }

  g_render();
}

function autosave() {
  let split_one = window.location.href.split('#');

  if (split_one.length > 1) {
    let split_two = split_one[0].split('/');

    if (split_two.length > 3 && split_two[3].toLocaleLowerCase() == 'case') {
      let split_three = split_one[1].split('/');

      if (
        split_three.length > 1 &&
        split_three[1].toLocaleLowerCase() != 'summary'
      ) {
        if (g_data) {
          let dt1 = new Date(g_data.date_last_updated);
          let dt2 = new Date();
          let number_of_minutes = diff_minutes(dt1, dt2);

          if (number_of_minutes > 2) {
            g_data.date_last_updated = new Date();
            save_case(g_data, null);
          }
        }
      }
    }
  }
}

function is_case_view_locked(p_case)
{
    let result = false;

    let selected_value = 9999;
    
    if
    (
        p_case.case_status &&
        p_case.case_status != ""
    )
    {
        selected_value = new Number(p_case.case_status);
    }
    
    if
    (
        p_case.case_status &&
        p_case.case_locked_date != "" &&
        (
            selected_value == 4 ||
            selected_value == 5 ||
            selected_value == 6
        )
    )
    {
        if (! g_is_confirm_for_case_lock)
        {
            result = true;
        }
    }

    return result;
}



function is_case_locked(p_case)
{
    let result = false;

    let selected_value = 9999;
    
    if
    (
        p_case.home_record.case_status.overall_case_status &&
        p_case.home_record.case_status.overall_case_status != ""
    )
    {
        selected_value = new Number(p_case.home_record.case_status.overall_case_status);
    }
    
    if
    (
        p_case.home_record.case_status &&
        p_case.home_record.case_status.case_locked_date != "" &&
        (
            selected_value == 4 ||
            selected_value == 5 ||
            selected_value == 6
        )
    )
    {
        if (! g_is_confirm_for_case_lock)
        {
            result = true;
        }
    }

    return result;
}



function is_case_checked_out(p_case) 
{
  let is_checked_out = false;

  let checked_out_html = '';

  let current_date = new Date();

  if 
  (
    p_case.date_last_checked_out != null &&
    p_case.date_last_checked_out != ''
  ) 
  {
    let try_date = null;
    let is_date = false;
    if (!(p_case.date_last_checked_out instanceof Date)) 
    {
      try_date = new Date(p_case.date_last_checked_out);
    } 
    else 
    {
      try_date = p_case.date_last_checked_out;
    }

    if 
    (
      diff_minutes(try_date, current_date) <= 120 &&
      p_case.last_checked_out_by.toLowerCase() == g_user_name.toLowerCase()
    ) 
    {
      is_checked_out = true;
    }
  }

  return is_checked_out;
}

function is_checked_out_expired(p_case) 
{
  let is_expired = true;

  let current_date = new Date();

  if 
  (
    p_case.date_last_checked_out != null &&
    p_case.date_last_checked_out != ''
  ) 
  {
    let try_date = null;
    if (!(p_case.date_last_checked_out instanceof Date)) 
    {
      try_date = new Date(p_case.date_last_checked_out);
    } 
    else 
    {
      try_date = p_case.date_last_checked_out;
    }

    if (diff_minutes(try_date, current_date) < 120) 
    {
      is_expired = false;
    }
  }

  return is_expired;
}

function diff_minutes(dt1, dt2) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;

  diff /= 60;
  return Math.abs(Math.round(diff));
}

function g_textarea_oninput(
  p_object_path,
  p_metadata_path,
  p_dictionary_path,
  value
) {
  var metadata = eval(p_metadata_path);

  if (
    metadata.type.toLowerCase() == 'list' &&
    metadata['is_multiselect'] &&
    metadata.is_multiselect == true
  ) {
    var item = eval(p_object_path);

    if (item.indexOf(value) > -1) {
      item.splice(item.indexOf(value), 1);
    } else {
      item.push(value);
    }
  } else if (metadata.type.toLowerCase() == 'boolean') {
    eval(p_object_path + ' = ' + value);
  } else {
    eval(
      p_object_path +
        ' = "' +
        value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
        '"'
    );
  }

  set_local_case(g_data, null);
}

function navigation_away() {
  if (g_data) {
    g_data.date_last_updated = new Date();
    g_data.date_last_checked_out = null;
    g_data.last_checked_out_by = null;
    g_data_is_checked_out = false;

    for (let i = 0; i < g_ui.case_view_list.length; i++) {
      let item = g_ui.case_view_list[i];
      if (item.id == g_data._id) {
        item.date_last_checked_out = null;
        item.last_checked_out_by = null;
        break;
      }
    }

    save_case(g_data);
    window.clearInterval(g_autosave_interval);
    g_autosave_interval = null;
  }
}
