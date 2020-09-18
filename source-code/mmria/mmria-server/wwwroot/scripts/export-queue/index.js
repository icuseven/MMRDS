var g_metadata = null;
var g_standard_de_identified_list = null;
var g_look_up = {};
var g_data = null;
var g_copy_clip_board = null;
var g_delete_value_clip_board = null;
var g_delete_attribute_clip_board = null;
var g_delete_node_clip_board = null;
var g_current_version = null;
var g_all_de_identified_paths = [];
var g_toggle_can_select_all = true;

var g_ui = { is_collapsed: [] };
var g_filter = {
  date_of_death: {
    year: ['all'],
    month: ['all'],
    day: ['all'],
  },
  date_range: [
    {
      from: 'all',
      to: 'all',
    },
  ],
  case_status: ['all'],
  case_jurisdiction: ['/all'],
  selected_form: '',
  search_text: '',
};

var selected_dictionary = {};
var selected_metadata_dictionary = {};

var answer_summary = {
  all_or_core: 'all',
  grantee_name: location.host,
  is_encrypted: 'no',
  zip_key: '',
  is_for_cdc: 'no',
  de_identified_selection_type: 'none',
  de_identified_field_set: [],
  is_de_identify_standard_fields: false,
  case_filter_type: 'all',
  case_set: [],
};

['all', 'csv', 'none', location.host];

$(function () {
  //http://www.w3schools.com/html/html_layout.asp
  'use strict';
  document.getElementById('form_content_id').innerHTML = '';
  get_standard_de_identified_list();

  //update_queue_interval_id = window.setInterval(update_queue_task, 10000);
});

function load_data() {
  var url = location.protocol + '//' + location.host + '/api/export_queue';

  $.ajax({
    url: url,
  }).done(function (response) {
    g_data = [];
    for (var i = 0; i < response.length; i++) {
      if (response[i].status != 'Deleted' && response[i].status != 'expunged') {
        g_data.push(response[i]);
      }
    }

    get_metadata();

    //document.getElementById('generate_report_button').disabled = false;
    //process_rows();
    //document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

    //document.getElementById('form_content_id').innerHTML = aggregate_report_render(g_ui, "", g_ui).join("");
  });
}

function render() {
  g_data.sort(function (a, b) {
    return b.date_created - a.date_created;
  });
  document.getElementById('form_content_id').innerHTML = export_queue_render(
    g_data,
    answer_summary,
    g_filter
  ).join('');
  // render_answer_summary();
}

function create_queue_item(
  p_export_type,
  p_all_or_core,
  p_grantee_name,
  p_is_encrypted,
  p_zip_key,
  p_de_identified_selection_type,
  p_de_identified_field_set,
  p_case_filter_type,
  p_case_set,
  p_de_identify_standard_fields
) {
  var new_date = new Date().toISOString();
  var result = {
    _id: new_date.replace(/:/g, '-') + '.zip',
    date_created: new_date,
    created_by: '',
    date_last_updated: new_date,
    last_updated_by: '',
    file_name: new_date.replace(/:/g, '-') + '.zip',
    export_type: p_export_type,
    status: 'Confirmation Required',
    all_or_core: p_all_or_core,
    grantee_name: p_grantee_name,
    is_encrypted: p_is_encrypted,
    zip_key: p_zip_key,
    de_identified_selection_type: p_de_identified_selection_type,
    de_identified_field_set: p_de_identified_field_set,
    case_filter_type: p_case_filter_type,
    case_set: p_case_set,
  };

  if (result.all_or_core == 'core') {
    result.export_type = 'Core CSV';
  }

  if (
    p_de_identify_standard_fields ||
    result.de_identified_selection_type == 'standard'
  ) {
    for (let i in g_standard_de_identified_list.paths) {
      let item = g_standard_de_identified_list.paths[i];

      result.de_identified_field_set.push(item);
    }
  }

  return result;
}

function custom_field_click() {
  alert('you clicked to open the custom field interface. ');
}

function add_new_all_export_item() {
  if (answer_summary.de_identify_standard_fields) {
  }

  let queue_item = create_queue_item(
    'All CSV',
    answer_summary.all_or_core,
    answer_summary.grantee_name,
    answer_summary.is_encrypted,
    answer_summary.zip_key,
    answer_summary.de_identified_selection_type,
    answer_summary.de_identified_field_set,
    answer_summary.case_filter_type,
    answer_summary.case_set,
    answer_summary.is_de_identify_standard_fields
  );

  g_data.push(queue_item);

  confirm_export_item(queue_item._id);

  //render();
}

function find_export_item(p_id) {
  var result = null;
  for (var i = 0; i < g_data.length; i++) {
    if (g_data[i]._id == p_id) {
      result = g_data[i];
      break;
    }
  }

  return result;
}

function confirm_export_item(p_id) {
  // submit queue item
  var item = find_export_item(p_id);
  if (item) {
    item.status = 'In Queue...';
    item.date_last_updated = new Date().toISOString();
    item.last_updated_by = '';

    var export_queue_url =
      location.protocol + '//' + location.host + '/api/export_queue';

    $.ajax({
      url: export_queue_url,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(item),
      type: 'POST',
      /*,

				beforeSend: function (request)
				{
					request.setRequestHeader("AuthSession", $mmria.getCookie("AuthSession"));
				}/*/
    }).done(function (response) {
      render();

      if (update_queue_interval_id == null) {
        update_queue_interval_id = window.setInterval(update_queue_task, 10000);
        update_queue_interval_count = 1;
      } else {
        update_queue_interval_count += 1;
      }

      //g_metadata = response;
      //load_data(g_uid, $mmria.getCookie("pwd"));
    });
  }
}

function cancel_export_item(p_id) {
  for (var i = 0; i < g_data.length; i++) {
    if (g_data[i]._id == p_id) {
      g_data.splice(i, 1);
      break;
    }
  }
  render();
}

function download_export_item(p_id) {
  var item = find_export_item(p_id);
  if (item) {
    var download_url =
      location.protocol + '//' + location.host + '/api/zip/' + p_id;
    window.open(download_url, '_zip');
    load_data();

    if (update_queue_interval_id != null && update_queue_interval_count > 0) {
      update_queue_interval_count -= 1;

      if (update_queue_interval_count == 0) {
        clearInterval(update_queue_interval_id);
        update_queue_interval_id = null;
      }
    }
    window.setTimeout(update_queue_task, 2000);
    render();
  }
}

function delete_export_item(p_id) {
  var item = find_export_item(p_id);
  if (item) {
    item.status = 'Deleted';
    item.date_last_updated = new Date().toISOString();
    item.last_updated_by = '';
    //item._deleted = true;
    var export_queue_url =
      location.protocol + '//' + location.host + '/api/export_queue';

    $.ajax({
      url: export_queue_url,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(item),
      type: 'POST',
      beforeSend: function (request) {
        request.setRequestHeader(
          'AuthSession',
          $mmria.getCookie('AuthSession')
        );
      }, //,
    }).done(function (response) {
      //g_metadata = response;
      load_data();
    });
  }
}

let update_queue_interval_id = null;
let update_queue_interval_count = 0;

function update_queue_task() 
{
  var temp = [];

  if (g_data == null) 
  {
    return;
  }

  for (var i = 0; i < g_data.length; i++) 
  {
    if (g_data[i].status == 'Confirmation Required') 
    {
      temp.push(g_data[i]);
    }
  }

  var url = location.protocol + '//' + location.host + '/api/export_queue';

  $.ajax
  ({
    url: url,
  })
    .done(function (response) 
    {
      g_data = [];
      for (var i = 0; i < response.length; i++) 
      {
        if 
        (
          response[i].status != 'Deleted' &&
          response[i].status != 'expunged'
        ) 
        {
          g_data.push(response[i]);
        }
      }

      for (var i = 0; i < temp.length; i++) 
      {
        g_data.push(temp[i]);
      }

      render();

      //document.getElementById('generate_report_button').disabled = false;
      //process_rows();
      //document.getElementById('navigation_id').innerHTML = navigation_render(g_user_list, 0, g_ui).join("");

      //document.getElementById('form_content_id').innerHTML = aggregate_report_render(g_ui, "", g_ui).join("");
    })
    .fail(function (jqXHR, textStatus, errorThrown) 
    {
        switch(jqXHR.status)
        {
            case 503: // service unavailable
            case 504: // gateway time-out
                if (update_queue_interval_id != null) 
                {
                  update_queue_interval_count = 0;
                  clearInterval(update_queue_interval_id);
                  update_queue_interval_id = null;
                }
                
                //let interval_of_10_second = 10000;
                let interval_of_30_second = 30000;
                
                update_queue_interval_id = window.setInterval(update_queue_task, interval_of_30_second);
                update_queue_interval_count = 1;

                break;
            default:
                if (update_queue_interval_id != null) 
                {
                  update_queue_interval_count = 0;
                  clearInterval(update_queue_interval_id);
                  update_queue_interval_id = null;
                }
                break;
        }

      /*
		switch(errorThrown)
		{

		}*/
    });
}

function zip_key_changed(p_value) {
  answer_summary.zip_key = p_value;
}

function setAnswerSummary(event) {
  return new Promise((resolve, reject) => {
    const target = event.target;
    const val = target.value;
    // @TODO remove all datasets from html
    const prop = target.dataset.prop;
    if (prop) {
      if (prop.indexOf('/') < 0) {
        answer_summary[prop] = val;
      } else {
        const path = prop.split('/');
        switch (path[1]) {
          case 'date_of_death':
            // path[2] === 'year' || 'month' || 'day'
            answer_summary['filter']['date_of_death'][path[2]][0] = val;
            break;
          case 'case_status':
          case 'case_jurisdiction':
            let case_opts = target.options;
            let options = [];
            case_opts.forEach((opt) => {
              if (opt.selected) options.push(opt.value);
            });
            // set answer_summary to new options
            answer_summary['filter'][path[1]] = options;
            break;
          default:
            reject('Summary type Unavailable');
        }
      }
      resolve();
    } else {
      reject('Error');
    }
  });
}

function getDeIdentifiedPaths(children, path = '') {
  return children
    .map((child) => {
      if (['app', 'group', 'grid', 'form'].includes(child.type)) {
        return getDeIdentifiedPaths(child.children, '/' + child.name);
      } else {
        return path + '/' + child.name;
      }
    })
    .flat();
}

function get_metadata() {
  $.ajax({
    url: location.protocol + '//' + location.host + '/api/metadata',
  }).done(function (response) {
    g_metadata = response;
    g_all_de_identified_paths = getDeIdentifiedPaths(response.children);
    for (var i in g_metadata.lookup) {
      var child = g_metadata.lookup[i];

      g_look_up['lookup/' + child.name] = child.values;
    }

    render();

    update_queue_task();
  });
}

function get_standard_de_identified_list() {
  $.ajax({
    url:
      location.protocol +
      '//' +
      location.host +
      '/api/de_identified_list?id=export',
  }).done(function (response) {
    g_standard_de_identified_list = response;

    load_data();
  });
}

function get_latest_version() {
  $.ajax({
    url: location.protocol + '//' + location.host + `/api/version/latest`,
  }).done(function (response) {
    g_current_version = response;
  });
}
