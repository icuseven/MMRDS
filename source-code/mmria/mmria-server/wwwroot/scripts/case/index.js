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
var g_name_to_value_lookup = {};
var g_display_to_value_lookup = {};
var g_value_to_index_number_lookup = {};
var g_name_to_value_lookup = {};
var g_is_confirm_for_case_lock = false;
var g_target_case_status = null;
var g_previous_case_status = null;
var g_other_specify_lookup = {};
var g_record_id_list = {};
var g_charts = {};
var g_chart_data = {};
var g_case_narrative_is_updated = false;
var g_case_narrative_is_updated_date = null;
var g_case_narrative_original_value = null;


async function g_set_data_object_from_path
(
  p_object_path,
  p_metadata_path,
  p_dictionary_path,
  value,
  p_form_index,
  p_grid_index,
  p_date_object,
  p_time_object
) 
{
  var is_search_result = false;
  var search_text = null;

  if 
  (
    g_ui.url_state.selected_id &&
    g_ui.url_state.selected_id == 'field_search'
  ) 
  {
    is_search_result = true;
    search_text = g_ui.url_state.path_array[2].replace(/%20/g, ' ');
  }

  var current_value = eval(p_object_path);

  if (g_validator_map[p_metadata_path]) 
  {
    if (g_validator_map[p_metadata_path](value)) 
    {
      var metadata = eval(p_metadata_path);


        if(metadata.name == "case_narrative")
        {
            //value = textarea_control_strip_html_attributes(value);
        }
        
      

      if (metadata.type.toLowerCase() == 'boolean') 
      {
        eval(p_object_path + ' = ' + value);
      } 
      else 
      {
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
        _id: g_data._id,
        _rev: g_data._rev,
        object_path: p_object_path,
        metadata_path: p_metadata_path,
        old_value: Array.isArray (current_value)?JSON.stringify(current_value) : current_value,
        new_value: value,
        dictionary_path: p_dictionary_path,
        metadata_type: metadata.type,
        prompt: metadata.prompt,
        date_created: new Date().toISOString(),
        user_name: g_user_name
      });

      await autorecalculate(p_dictionary_path);
      /*
      if (g_ui.broken_rules.hasOwnProperty(p_object_path)) 
      {
        delete g_ui.broken_rules[p_object_path];
      }*/

        set_local_case
        (
            g_data, 
            function () 
            {
                var post_html_call_back = [];

                document.getElementById
                (
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
                if (post_html_call_back.length > 0) 
                {
                    eval(post_html_call_back.join(''));
                }

                apply_validation();
            }
        );
    } 
    else 
    {
        // do nothing for now
      //g_ui.broken_rules[p_object_path] = true;
      //console.log("didn't pass validation");
    }
  } 
  else 
  {
    var metadata = eval(p_metadata_path);
    var current_value = eval(p_object_path);
    var valid_date_or_datetime = true;
    var entered_date_or_datetime_value = value;

    if 
    (
      metadata.type.toLowerCase() == 'list' &&
      metadata['is_multiselect'] &&
      metadata.is_multiselect == true
    ) 
    {
      var item = eval(p_object_path);

      if (item.indexOf(value) > -1) 
      {
        item.splice(item.indexOf(value), 1);
      } 
      else 
      {
        item.push(value);
      }
    } 
    else if (metadata.type.toLowerCase() == 'boolean') 
    {
      eval(p_object_path + ' = ' + value);
    }
    else if (metadata.type.toLowerCase() == 'date') 
    {


      if (!is_valid_date(value)) 
      {
        valid_date_or_datetime = false;
        eval(
            p_object_path +
                ' = ""'
            );
      }
      else
      {
          if(value!= null && value!="")
          {
            let save_datetime = new Date(value);
            eval(
                p_object_path +
                ' = "' +
                convert_date_to_storage_format(save_datetime).replace(/"/g, '\\"').replace(/\n/g, '\\n') +
                '"'
            );
          }
          else
          {
            eval(
                p_object_path +
                    ' = ""'
                );
          }

      }
    } 
    else if (metadata.type.toLowerCase() == 'datetime') 
    {
      if (!is_valid_datetime(value)) 
      {
        valid_date_or_datetime = false;
        eval(
            p_object_path +
                ' = ""'
            );
      }
      else
      {

        if(value!= null && value!="")
        {
            let save_datetime = new Date(value);
            eval(
                p_object_path +
                ' = "' +
                save_datetime.toISOString().replace(/"/g, '\\"').replace(/\n/g, '\\n') +
                '"'
            );
        }
        else
        {
            eval(
                p_object_path +
                    ' = ""'
                );
        }
      }
    } 
    else 
    {
      eval(
        p_object_path +
          ' = "' +
          value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
          '"'
      );
    }

    g_change_stack.push({
        _id: g_data._id,
        _rev: g_data._rev,
      object_path: p_object_path,
      metadata_path: p_metadata_path,
      old_value: Array.isArray (current_value)?JSON.stringify(current_value) : current_value,
      new_value: value,
      dictionary_path: p_dictionary_path,
      metadata_type: metadata.type,
      prompt: metadata.prompt,
      date_created: new Date().toISOString(),
      user_name: g_user_name
    });

    g_data.date_last_updated = new Date();
    //g_data.last_updated_by = g_uid;

    await autorecalculate(p_dictionary_path, p_form_index, p_grid_index);

if
(
    metadata.type.toLowerCase() == 'date' &&
    valid_date_or_datetime
)
{
    set_local_case
    (
        g_data,
        function () 
        {
            gui_remove_broken_rule_click(convert_object_path_to_jquery_id(p_object_path));
        }
    );
}
else if
(
    metadata.type.toLowerCase() == 'datetime' &&
    valid_date_or_datetime
)
{
    set_local_case
    (
        g_data,
        function () 
        {
            if(value == null || value == "")
            {
                document.getElementById(convert_object_path_to_jquery_id(p_object_path) + '-time').setAttribute('disabled', 'disabled');
            }
            else
            {
                document.getElementById(convert_object_path_to_jquery_id(p_object_path) + '-time').removeAttribute('disabled');
            } 
            
            gui_remove_broken_rule_click(convert_object_path_to_jquery_id(p_object_path));
        }
    );
}
else
    set_local_case
    (
        g_data, 
        function () 
        {
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
                false,
                ctx.form_index,
                ctx.grid_index,
                valid_date_or_datetime,
                entered_date_or_datetime_value
                );

                render_search_text(new_context);

                var new_html = new_context.result.join('');
                let result = $('#' + convert_object_path_to_jquery_id(p_object_path));

                if (result.length) 
                {
                result[0].outerHTML = new_html;
                } 
                else 
                {
                result.replaceWith(new_html);
                }
                //$("#" + convert_object_path_to_jquery_id(p_object_path))[0].outerHTML = new_html;
            }
            else if (metadata.type.toLowerCase() == 'textarea') 
            {
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
            } 
            else 
            {
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

            switch (metadata.type.toLowerCase()) 
            {
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

                case 'date':
                  $(`#${convert_object_path_to_jquery_id(p_object_path)} input`).datetimepicker({
                    format: 'MM/DD/YYYY',
                    keepInvalid: true,
                    useCurrent: false,
                    useStrict: true,
                    icons: {
                      time: "x24 cdc-icon-clock_01",
                      date: "x24 cdc-icon-calendar_01",
                      up: "x24 cdc-icon-chevron-double-right",
                      down: "x24 cdc-icon-chevron-double-right",
                      previous: 'x16 cdc-icon-chevron-double-right',
                      next: 'x16 cdc-icon-chevron-double-right'
                    }
                  });
                  
                  // flatpickr("#" + convert_object_path_to_jquery_id(p_object_path) + " input.date", {
                  //     utc: true,
                  //     enableTime: false,
                  //     defaultDate: value,
                  //     onChange: function(selectedDates, p_value, instance) {
                  //         g_set_data_object_from_path(p_object_path, p_metadata_path, p_dictionary_path, p_value);
                  //     }
                  // });

                  break;

                case 'datetime':
                  $(`#${convert_object_path_to_jquery_id(p_object_path)}-date`).datetimepicker({
                    format: 'MM/DD/YYYY',
                    keepInvalid: true,
                    useCurrent: false,
                    useStrict: true,
                    icons: {
                      up: "x16 cdc-icon-chevron-circle-up-light",
                      down: "x16 cdc-icon-chevron-circle-down-light",
                      previous: 'x16 cdc-icon-chevron-double-right',
                      next: 'x16 cdc-icon-chevron-double-right'
                    }
                  });

                  $(`#${convert_object_path_to_jquery_id(p_object_path)}-time`).datetimepicker({
                    format: 'HH:mm:ss',
                    keepInvalid: true,
                    useCurrent: false,
                    icons: {
                      up: "x16 cdc-icon-chevron-circle-up-light",
                      down: "x16 cdc-icon-chevron-circle-down-light",
                      previous: 'x16 cdc-icon-chevron-double-right',
                      next: 'x16 cdc-icon-chevron-double-right'
                    }
                  });


                 // post_html_call_back.push(`findNextTabStop(document.getElementById('${p_object_path}-date')).focus();`);

                 if (!isNullOrUndefined(p_date_object)) 
                 {
                  post_html_call_back.push(
                    `$('#${convert_object_path_to_jquery_id(
                        p_object_path
                    )}-time').focus();`
                    );
                 }
                 
                 /*
                 else
                 {
                    post_html_call_back.push(`findNextTabStop(document.getElementById('${p_object_path}-time')).focus();`);
                 }
*/

 /*
                if(!is_valid_datetime(value))
                {
                    post_html_call_back.push(
                        `$('#${convert_object_path_to_jquery_id(
                            p_object_path
                        )}-date').focus();`
                        );
                }
                else 
                if (!isNullOrUndefined(p_date_object)) 
                {
                    post_html_call_back.push(`findNextTabStop(document.getElementById('${p_object_path}-date')).focus();`);
                } */
/*               else if (!isNullOrUndefined(p_time_object)) 
                {
                    // console.log('b2', p_time_object.value);
                    post_html_call_back.push(
                    `$('#${convert_object_path_to_jquery_id(
                        p_object_path
                    )} input.datetime-time').focus();`
                    );
                }*/
                break;

                case 'date':

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

                break;

                case 'list':
                if 
                (
                    metadata.control_style != null &&
                    metadata.control_style == 'radio'
                ) 
                {
                    //console("bubba");
                    post_html_call_back.push
                    (
                        `$('#${convert_object_path_to_jquery_id(
                            p_object_path
                        )}${value}').focus()`
                    );
                }
                break;
            }

            if (post_html_call_back.length > 0) 
            {
                eval(post_html_call_back.join(''));
            }

            apply_validation();


        }
    );
  }
update_charts();
}



function g_add_grid_item(p_object_path, p_metadata_path, p_dictionary_path) 
{
  let metadata = eval(p_metadata_path);
  let new_line_item = create_default_object(metadata, {}, true);
  let grid = eval(p_object_path);

  grid.push(new_line_item[metadata.name][0]);
  set_local_case(g_data, function () {
    let post_html_call_back = [];
    let render_result = page_render(
      metadata,
      eval(p_object_path),
      g_ui,
      p_metadata_path,
      p_object_path,
      p_dictionary_path,
      false,
      post_html_call_back
    ).join('');

    let element = document.getElementById(p_metadata_path);
    element.outerHTML = render_result;

    apply_tool_tips();

    let jump_value = 9999;
    
    post_html_call_back.push
    (
      `document.getElementById("${p_metadata_path}").children[1].scrollTop = ${jump_value};
      set_focus_on_first_grid_item("${p_metadata_path}");`
    );

    if (post_html_call_back.length > 0) 
    {
      eval(post_html_call_back.join(''));
    }
  });

  update_charts();
}


function set_focus_on_first_grid_item(p_metadata_path)
{

    var element = document.getElementById(p_metadata_path);
    let li_list = element.querySelectorAll("ul li");
    var lastchild = li_list[li_list.length-1];
    lastchild.querySelector("input, select, textarea").focus();
}

function g_delete_grid_item
(
	p_object_path,
	p_metadata_path,
    p_dictionary_path,
    p_metadata_prompt,
    p_data_length,
	p_index
) 
{
    var record_number = new Number(p_index) + new Number(1);

    const modal = build_delete_grid_dialog(record_number, p_object_path, p_metadata_path, p_dictionary_path, p_index, p_metadata_prompt, p_data_length);
    const box = $("#content");

    box.append(modal[0]);
    $(`#case_modal_${p_index}`).modal("show");
    $(`#case_modal_${p_index} .modal-footer .modal-cancel`).focus();
	
}

function g_delete_grid_item_action
    (
        p_object_path,
        p_metadata_path,
        p_dictionary_path,
        p_index
    )
{
	var metadata = eval(p_metadata_path);
	var index = p_object_path
		.match(new RegExp("\\[\\d+\\]$"))[0]
		.replace("[", "")
		.replace("]", "");
	var object_string = p_object_path.replace(new RegExp("(\\[\\d+\\]$)"), "");

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
		).join("");
		var element = document.getElementById(p_metadata_path);
		element.outerHTML = render_result;
		if (post_html_call_back.length > 0) {
			eval(post_html_call_back.join(""));
		}
    });
    update_charts();

}

function g_delete_record_item(p_object_path, p_metadata_path, p_index) 
{
		var metadata = eval(p_metadata_path);
		var index = p_object_path
			.match(new RegExp("\\[\\d+\\]$"))[0]
			.replace("[", "")
			.replace("]", "");
		var object_string = p_object_path.replace(new RegExp("(\\[\\d+\\]$)"), "");

		eval(object_string).splice(index, 1);
		set_local_case(g_data, function () {
			var post_html_call_back = [];
			document.getElementById(metadata.name + "_id").innerHTML = page_render(
				metadata,
				eval(object_string),
				g_ui,
				p_metadata_path,
				object_string,
				"",
				false,
				post_html_call_back
			).join("");
			if (post_html_call_back.length > 0) {
				eval(post_html_call_back.join(""));
			}
		});
}

var g_ui = {
  url_state: {
    selected_form_name: null,
    selected_id: null,
    selected_child_id: null,
    path_array: [],
  },

  data_list: [],

  broken_rules: {},

  set_value: function (p_path, p_value) 
  {
    //console.log('g_ui.set_value: ', p_path, p_value);
    //console.log('value: ', p_value.value);
    //console.log('get_eval_string(p_path): ', g_ui.get_eval_string(p_path));

    eval
    (
      g_ui.get_eval_string
      (
        p_path + ' = "' + p_value.value.replace('"', '\\"') + '"'
      )
    );
  },

  get_eval_string: function (p_path) 
  {
    var result =
      'g_data' +
      p_path
        .replace(new RegExp('/', 'gm'), '.')
        .replace(new RegExp('\\.(\\d+)\\.', 'g'), '[$1]\\.')
        .replace(new RegExp('\\.(\\d+)$', 'g'), '[$1]');

    return result;
  },

  add_new_case: function (
    p_first_name,
    p_middle_name,
    p_last_name,
    p_month_of_death,
    p_day_of_death,
    p_year_of_death,
    p_state_of_death
  ) 
  {
    if (g_autosave_interval != null) 
    {
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
    result.home_record.case_status.abstraction_begin_date = convert_date_to_storage_format(new Date());

    if (g_jurisdiction_list.length > 0) 
    {
      result.home_record.jurisdiction_id = g_jurisdiction_list[0];
    } 
    else 
    {
      result.home_record.jurisdiction_id = '/';
    }

    result.home_record.last_name = p_last_name;
    result.home_record.first_name = p_first_name;
    result.home_record.middle_name = p_middle_name;
    result.home_record.state_of_death_record = p_state_of_death;
    result.home_record.date_of_death.year = p_year_of_death;
    result.home_record.date_of_death.month = p_month_of_death;
    result.home_record.date_of_death.day = p_day_of_death;

    let reporting_state = sanitize_encodeHTML(window.location.host.split("-")[0]);

    if 
    (
        (
            !result.home_record.record_id || 
            result.home_record.record_id == ''
        ) && 
        result.home_record.state_of_death_record && 
        result.home_record.state_of_death_record != '' && 
        result.home_record.date_of_death.year && 
        parseInt(result.home_record.date_of_death.year) > 999 && 
        parseInt(result.home_record.date_of_death.year) < 2500
    ) 
    {
        
        let new_record_id = reporting_state.trim() + '-' + result.home_record.date_of_death.year.trim() + '-' + $mmria.getRandomCryptoValue().toString().substring(2, 6);
        while(g_record_id_list[new_record_id] != null)
        {
            new_record_id = reporting_state.trim() + '-' + result.home_record.date_of_death.year.trim() + '-' + $mmria.getRandomCryptoValue().toString().substring(2, 6);
        }

        result.home_record.record_id = new_record_id.toUpperCase();
    }

    var new_data = [];

    for (var i in g_ui.case_view_list) 
    {
      new_data.push(g_ui.case_view_list[i]);
    }

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

        record_id: result.home_record.record_id,
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

    set_local_case
    (
        g_data,
        function () 
        {
            save_case(g_data, function () 
            {
                var url =
                location.protocol +
                '//' +
                location.host +
                '/Case#/' +
                g_ui.selected_record_index +
                '/home_record';

                window.location = url;
            }, "add_new_case");
        }
    );

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
    case_status: "all",
    field_selection: "all",
    pregnancy_relatedness:"all",
    get_query_string: function () {
      var result = [];
      result.push('?skip=' + (this.page - 1) * this.take);
      result.push('take=' + this.take);
      result.push('sort=' + this.sort);
      result.push('descending=' + this.descending);
      result.push('case_status=' + this.case_status);
      result.push('field_selection=' + this.field_selection);
      result.push('pregnancy_relatedness=' + this.pregnancy_relatedness);
      
      if (this.search_key)
      {
        result.push(
          'search_key=' +
          //encodeURIComponent(this.search_key.replace(/"/g, '\\"').replace(/\n/g, '\\n'))
          encodeURIComponent(this.search_key)
        );
      }

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

$(function () 
{
  $(document).keydown(function (evt) 
  {
    if (evt.keyCode == 90 && evt.ctrlKey) 
    {
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

  if 
  (
    default_local_storage_limit - get_local_storage_space_usage_in_kilobytes() <
    working_space
  ) 
  {
    let case_index = create_local_storage_index();
    let case_index_array = convert_local_storage_index_to_array(case_index);
    let is_update_case_index = false;
    let space_removed = 0;

    for 
    (
      let index = 0;
      index < case_index_array.length && space_removed < working_space;
      index++
    ) 
    {
      let item = case_index_array[index];
      let key = item._id;

      try 
      {
        delete case_index[key];
        space_removed += item.size_in_kilobytes;
        is_update_case_index = true;
        localStorage.removeItem('case_' + key);
      } 
      catch (ex) 
      {
        //console.log("remove this");
      }
    }

    if (is_update_case_index) 
    {
      window.localStorage.setItem('case_index', JSON.stringify(case_index));
    }
  }

  if (window.location.pathname == '/analyst-case') 
  {
    g_is_data_analyst_mode = 'da';
  }


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

  window.setTimeout(load_and_set_data, 0);
});


function Get_Record_Id_List(p_call_back) 
{
  $.ajax
  ({
    url: location.protocol + '//' + location.host + '/api/case_view/record-id-list',
  })
  .done
  (
    function (response) 
    {
        if(response!= null)
        {
            for(var i = 0; i < response.length; i++)
            {
                let item = response[i];
                g_record_id_list[item] = true;
            }

            if(p_call_back!= null)
            {
                p_call_back();
            }
        }
    }
  );
}

async function load_and_set_data() 
{
    const metadata_url = `${location.protocol}//${location.host}/api/jurisdiction_tree`;

    const jurisdiction_tree = await $.ajax
    ({
        url: metadata_url,
    });


    g_jurisdiction_tree = jurisdiction_tree;

    const my_user_response = await $.ajax
    ({
        url: location.protocol + '//' + location.host + '/api/user/my-user',
    });

    
    g_user_name = my_user_response.name;


    const my_role_list_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/user_role_jurisdiction_view/my-roles`, //&search_key=' + g_uid,
    });
    
    g_user_role_jurisdiction_list = [];
    for (let i in my_role_list_response.rows) 
    {
        let value = my_role_list_response.rows[i].value;
        if(value.role_name=="abstractor")
        {
            g_user_role_jurisdiction_list.push(value.jurisdiction_id);
        }
    }

    create_jurisdiction_list(g_jurisdiction_tree);

    $('#landing_page').hide();
    $('#logout_page').hide();
    $('#footer').hide();
    $('#root').removeClass('header');

    const release_version = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/version/release-version`,
    });
    
    
    g_release_version = release_version;

    const default_ui_specification = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/version/${g_release_version}/ui_specification`,
    });
  
    g_default_ui_specification = default_ui_specification;
    

    document.getElementById('form_content_id').innerHTML = '<h4>Fetching data from database.</h4><h5>Please wait a few moments...</h5>';

    const metadata_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/version/${g_release_version}/metadata`,
    });

    g_metadata = metadata_response;
    metadata_summary(g_metadata_summary, g_metadata, 'g_metadata', 0, 0);
    default_object = create_default_object(g_metadata, {});

    build_other_specify_lookup(g_other_specify_lookup, g_metadata);

    set_list_lookup
    (
      g_display_to_value_lookup,
      g_value_to_display_lookup,
      g_value_to_index_number_lookup,
      g_metadata,
      ''
    );

    for (let i in g_metadata.lookup) 
    {
      const child = g_metadata.lookup[i];

      g_look_up['lookup/' + child.name] = child.values;
    }

    get_case_set();

    g_ui.url_state = url_monitor.get_url_state(window.location.href);
    if (window.onhashchange) 
    {
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    } 
    else 
    {
      window.onhashchange = window_on_hash_change;
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    }

    window.onbeforeunload = navigation_away;
}
  

function create_jurisdiction_list(p_data) 
{
  for (var i = 0; i < g_user_role_jurisdiction_list.length; i++) 
  {
    var jurisdiction_regex = new RegExp('^' + g_user_role_jurisdiction_list[i]);
    var match = p_data.name.match(jurisdiction_regex);

    if (match) 
    {
      g_jurisdiction_list.push(p_data.name);
      break;
    }
  }

  if (p_data.children != null) 
  {
    for (var i = 0; i < p_data.children.length; i++) 
    {
      var child = p_data.children[i];

      create_jurisdiction_list(child);
    }
  }
}

var update_session_timer_interval_id = null;

function get_case_set(p_call_back) 
{
  var case_view_url =
    location.protocol +
    '//' +
    location.host +
    '/api/case_view' +
    g_ui.case_view_request.get_query_string();

  $.ajax({
    url: case_view_url,
  })
  .done
  (
    function (case_view_response) 
    {
        g_ui.case_view_list = [];
        g_ui.case_view_request.total_rows = case_view_response.total_rows;

        for (var i = 0; i < case_view_response.rows.length; i++) 
        {
            g_ui.case_view_list.push(case_view_response.rows[i]);
        }

        if (p_call_back) 
        {
            p_call_back();
        } 
        else 
        {
            var post_html_call_back = [];

            document.getElementById('navbar').innerHTML = navigation_render
            (
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

            if (post_html_call_back.length > 0) 
            {
                eval(post_html_call_back.join(''));
            }

            var section_list = document.getElementsByTagName('section');

            for (var i = 0; i < section_list.length; i++) 
            {
                var section = section_list[i];

                if (section.id == 'app_summary') 
                {
                    section.style.display = 'block';
                } 
                else 
                {
                    section.style.display = 'block';
                }
            }
        }
    });
}





function get_metadata() 
{
  document.getElementById('form_content_id').innerHTML =
    '<h4>Fetching data from database.</h4><h5>Please wait a few moments...</h5>';

  $.ajax({
    url:
      location.protocol +
      '//' +
      location.host +
      `/api/version/${g_release_version}/metadata`,
  })
  .done
  (
    function (response) 
    {
    g_metadata = response;
    metadata_summary(g_metadata_summary, g_metadata, 'g_metadata', 0, 0);
    default_object = create_default_object(g_metadata, {});

    build_other_specify_lookup(g_other_specify_lookup, g_metadata);

    set_list_lookup(
      g_display_to_value_lookup,
      g_value_to_display_lookup,
      g_value_to_index_number_lookup,
      g_metadata,
      ''
    );

    for (var i in g_metadata.lookup) 
    {
      var child = g_metadata.lookup[i];

      g_look_up['lookup/' + child.name] = child.values;
    }

    get_case_set();

    g_ui.url_state = url_monitor.get_url_state(window.location.href);
    if (window.onhashchange) 
    {
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    } 
    else 
    {
      window.onhashchange = window_on_hash_change;
      window.onhashchange({ isTrusted: true, newURL: window.location.href });
    }

    window.onbeforeunload = navigation_away;
  });
}

function window_on_hash_change(e) 
{

  if (g_data) 
  {
    if (e.isTrusted) 
    {
      var new_url = e.newURL || window.location.href;
      g_ui.url_state = url_monitor.get_url_state(new_url);

      if 
      (
        g_ui.url_state.path_array &&
        g_ui.url_state.path_array.length > 0 &&
        parseInt(g_ui.url_state.path_array[0]) >= 0
      ) 
      {

        g_apply_sort(g_metadata, g_data, "","", "");
        var case_id = g_data._id;

        if( g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id != case_id)
        {
            g_ui.broken_rules = {};
            g_charts = {};
            g_chart_data = {};
            if(g_data_is_checked_out)
            {
                save_case(g_data, function () 
                {
                get_specific_case(
                    g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id
                );
                }, "hash_change");
            }
            else
            {
                get_specific_case(
                    g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id
                );
            }

        }
        else
        {
            g_charts = {};
            g_chart_data = {};
            if(g_data_is_checked_out)
            {
                save_case(g_data, function () 
                {
                    g_render();
                }, "hash_change");
            }
            else
            {
                g_render();
            }
        }
      } 
      else 
      {
        if(g_data_is_checked_out)
        {
            g_data.date_last_checked_out = null;
            g_data.last_checked_out_by = null;
            g_data_is_checked_out = false;

            g_apply_sort(g_metadata, g_data, "","", "");

            save_case(g_data, function () {
            g_data = null;
            get_case_set(function () {
                g_render();
            });
            }, "hash_change");
        }
        else
        {
            g_data = null;
            get_case_set(function () {
                g_render();
            });
        }
      }
    }
  } 
  else if (e.isTrusted) 
  {
    var new_url = e.newURL || window.location.href;

    g_ui.url_state = url_monitor.get_url_state(new_url);

    if 
    (
      g_ui.url_state.path_array &&
      g_ui.url_state.path_array.length > 0 &&
      parseInt(g_ui.url_state.path_array[0]) >= 0
    ) 
    {
        
      if (g_ui.case_view_list.length > 0) 
      {
        g_ui.broken_rules = {};
        g_charts = {};
        g_chart_data = {};
        get_specific_case
        (
          g_ui.case_view_list[parseInt(g_ui.url_state.path_array[0])].id
        );
      } 
      else 
      {
        g_render();
      }
    
    } 
    else 
    {

      g_render();
    }
  } 
  else 
  {
    // do nothing for now
  }
}

function get_specific_case(p_id) 
{
  var case_url =
    location.protocol + '//' + location.host + '/api/case?case_id=' + p_id;

  $.ajax({
    url: case_url,
  })
    .done(function (case_response) 
    {
      if (case_response) 
      {
        g_case_narrative_original_value = case_response.case_narrative.case_opening_overview;
        var local_data = get_local_case(p_id);

        if (local_data) 
        {
          if (local_data._rev && local_data._rev == case_response._rev) 
          {
            g_data = local_data;
            g_data_is_checked_out = is_case_checked_out(g_data);
          } 
          else 
          {
            local_data = case_response;
            set_local_case(local_data);
            g_data = local_data;
            g_data_is_checked_out = is_case_checked_out(g_data);
          }

          if (g_autosave_interval != null && g_data_is_checked_out == false) 
          {
            window.clearInterval(g_autosave_interval);
            g_autosave_interval = null;
          }

          g_render();
        } 
        else 
        {
          g_data = case_response;
          g_data_is_checked_out = is_case_checked_out(g_data);

          if (g_autosave_interval != null && g_data_is_checked_out == false) 
          {
            window.clearInterval(g_autosave_interval);
            g_autosave_interval = null;
          }
        }

        
        g_render();
      } 
      else 
      {
        g_render();
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) 
    {
      console.log('get_specific_case:', textStatus, errorThrown);
      g_data = get_local_case(p_id);
      g_data_is_checked_out = is_case_checked_out(g_data);
    });
}

function save_case(p_data, p_call_back, p_note) 
{
  if (p_data.host_state == null || p_data.host_state == '') 
  {
    p_data.host_state = window.location.host.split('-')[0];
  }

  if (g_is_data_analyst_mode == null) 
  {

    let save_case_request = { 
            Change_Stack:{
                _id: $mmria.get_new_guid(),
                case_id: g_data._id,
                case_rev: g_data._rev,
                date_created: new Date().toISOString(),
                user_name: g_user_name, 
                items: g_change_stack,
                metadata_version: g_release_version,
                note: (p_note != null)? p_note : ""

            },
            Case_Data:p_data
        };

    if(g_case_narrative_is_updated)
    {
        save_case_request.Change_Stack.items.push({
            _id: g_data._id,
            _rev: g_data._rev,
          object_path: "g_data.case_narrative.case_opening_overview",
          metadata_path: "/case_narrative/case_opening_overview",
          old_value: g_case_narrative_original_value,
          new_value: g_data.case_narrative.case_opening_overview,
          dictionary_path: "/case_narrative/case_opening_overview",
          metadata_type: "textarea",
          prompt: 'Case Narrative',
          date_created: g_case_narrative_is_updated_date.toISOString(),
          user_name: g_user_name
        });
    }

    $.ajax({
      url: location.protocol + '//' + location.host + '/api/case',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(save_case_request),
      type: 'POST',
    })
      .done(function (case_response) 
      {
        //console.log('save_case: success');

        g_change_stack = [];
        g_case_narrative_is_updated = false;
        g_case_narrative_is_updated_date = null;

        if (g_data && g_data._id == case_response.id) 
        {
          g_data._rev = case_response.rev;
          g_data_is_checked_out = is_case_checked_out(g_data);
          g_case_narrative_original_value = g_data.case_narrative.case_opening_overview;
          set_local_case(g_data);
          //console.log('set_value save finished');
        }

        if (p_call_back) 
        {
          p_call_back();
        }
      })
      .fail(function (xhr, err) 
      {
        alert(`server save_case: failed\n${err}\n${xhr.responseText}`);
        if (xhr.status == 401) 
        {
          let redirect_url = location.protocol + '//' + location.host;
          window.location = redirect_url;
        }
        else if (xhr.status == 200 && xhr.responseText.length >= 49000) 
        {
          let redirect_url = location.protocol + '//' + location.host;
          window.location = redirect_url;
        }
      });
  } 
  else 
  {
    if (p_call_back) 
    {
      p_call_back();
    }
  }
}

function delete_case(p_id, p_rev) 
{
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
    .done(function (case_response) 
    {
      //console.log('delete_case: success');

      try 
      {
        localStorage.removeItem('case_' + p_id);
      } 
      catch (ex) 
      {
        // do nothing for now
      }
      get_case_set();
    })
    .fail(function (xhr, err) 
    {
      console.log('delete_case: failed', err);
    });
}

function g_render() 
{
  var post_html_call_back = [];

  document.getElementById('navbar').innerHTML = navigation_render
  (
    g_metadata,
    0,
    g_ui
  ).join('');

  $('[data-toggle="tooltip"]').tooltip({
    classes: {
      'ui-tooltip': 'custom-tooltip'
    },
    position: {
      my: "left-10 top", //position from top of tooltip
      at: "bottom+10" //at bottom of element
    }
  });

  document.getElementById('form_content_id').innerHTML = page_render
  (
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

  if (post_html_call_back.length > 0) 
  {
    try
    {
      eval(post_html_call_back.join(''));
    } 
    catch (ex) 
    {
      console.log(ex);
    }
  }

  var section_list = document.getElementsByTagName('section');

  if (g_ui.url_state.path_array[0] == 'summary') 
  {
    for (var i = 0; i < section_list.length; i++) 
    {
      var section = section_list[i];

      if (section.id == 'app_summary') 
      {
        section.style.display = 'block';
        //section.style.display = "grid";
        //section.style["grid-template-columns"] = "1fr 1fr 1fr";
      } 
      else 
      {
        section.style.display = 'none';
      }
    }
  } 
  else if 
  (
    g_ui.url_state.path_array.length >= 2 &&
    g_ui.url_state.path_array[1] == 'field_search'
  ) 
  {
    for (var i = 0; i < section_list.length; i++) 
    {
      var section = section_list[i];

      if (section.id == 'field_search_id') 
      {
        section.style.display = 'block';
        //section.style.display = "grid";
        //section.style["grid-template-columns"] = "1fr 1fr 1fr";
      } 
      else 
      {
        section.style.display = 'none';
      }
    }
  } 
  else 
  {
    if 
    (
      g_ui.url_state.path_array.length > 2 &&
      parseInt(g_ui.url_state.path_array[0]) >= 0
    ) 
    {
      for (var i = 0; i < section_list.length; i++) 
      {
        var section = section_list[i];

        if (section.id == g_ui.url_state.path_array[1]) 
        {
          section.style.display = 'block';
          //section.style.display = "grid";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
        } 
        else 
        {
          section.style.display = 'none';
        }
      }
    } 
    else 
    {
      for (var i = 0; i < section_list.length; i++) 
      {
        var section = section_list[i];

        if (section.id == g_ui.url_state.path_array[1] + '_id') 
        {
          section.style.display = 'block';
          //section.style.display = "grid";
          //section.style["grid-template-columns"] = "1fr 1fr 1fr";
        }
        else 
        {
          section.style.display = 'none';
        }
      }
    }
  }

  apply_validation();
  
}

function show_print_version() 
{
  window.open('./print-version', '_print_version');
}

function show_data_dictionary() 
{
  window.open('./data-dictionary', '_data_dictionary');
}

function show_user_administration() 
{
  window.open('./_users', '_users');
}

function apply_tool_tips() 
{
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


  apply_validation();
}

function apply_validation() 
{

    let list_has_items = false;
    let validation_summary = [];

    for (let key in g_ui.broken_rules) 
    {
        
        if(g_ui.broken_rules[key]!= null)
        {
            list_has_items = true;
            validation_summary.push(g_ui.broken_rules[key]);
        }
        
    }

    if(list_has_items)
    {
      validation_summary.unshift("$('#validation_summary_list').empty();")
      validation_summary.push("$('#validation_summary').css('display','');")
    }
    else
    {
        validation_summary.unshift("$('#validation_summary_list').empty();")
        validation_summary.push("$('#validation_summary').css('display','none');")
    }

  eval(validation_summary.join(""));

}

function init_delete_dialog(p_index, callback) 
{
    const case_list = g_ui.case_view_list;
	const modal = build_delete_dialog(case_list[p_index], p_index);
	const box = $("#content");

	box.append(modal[0]);
	$(`#case_modal_${p_index}`).modal("show");
	$(`#case_modal_${p_index} .modal-footer .modal-cancel`).focus();
}

function build_delete_dialog(p_values, p_index) 
{
    const modal_ui        = [];
    const hostState       = p_values.value.host_state;
    const jurisdictionID  = p_values.value.jurisdiction_id;
    const lastName        = p_values.value.last_name;
    const firstName       = p_values.value.first_name;
    const lastUpdatedBy   = p_values.value.last_updated_by;

    const dateLastUpdated = new Date(p_values.value.date_last_updated);
    const mm              = (dateLastUpdated.getMonth() + 1).toString().length === 1 ? `0${dateLastUpdated.getMonth() + 1}` : dateLastUpdated.getMonth() + 1;
    const dd              = dateLastUpdated.getDate().toString().length === 1 ? `0${dateLastUpdated.getDate()}` : dateLastUpdated.getDate();
    const yyyy            = dateLastUpdated.getFullYear().toString().length === 1 ? `0${dateLastUpdated.getFullYear()}` : dateLastUpdated.getFullYear();
    const hhmmss          = get24HourFormat(dateLastUpdated.toLocaleTimeString());

    modal_ui.push(`
        <div id="case_modal_${p_index}" class="modal modal-${p_index}" tabindex="-1" role="dialog" aria-labelledby="case_modal_label_${p_index}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                    <h5 id="case_modal_label_${p_index}" class="modal-title">Confirm Delete Case</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body row no-gutters">
                    <div class="modal-icons col" style="max-width: 40px;">
                        <span class="x40 fill-amber-p cdc-icon-alert_02" aria-hidden="true"></span>
                        <span class="spinner-container spinner-inline" style="display: none">
                        <span class="spinner-body text-primary">
                            <span class="spinner"></span>
                        </span>
                        </span>
                    </div>
                    <div class="modal-messages col pl-3">
                        <p>Are you sure you want to delete this case?</p>
                        <p>
                            <strong>
                                <span style="display: none;">${hostState ? `${hostState} ` : ''}${jurisdictionID ? `${jurisdictionID}:` : ''}</span>
                                ${lastName ? lastName : ''}${firstName ? `, ${firstName}` : ''}
                            </strong>
                        </p>
                        <p>
                            Last updated: 
                            ${lastUpdatedBy} 
                            ${`${mm}/${dd}/${yyyy} ${hhmmss}`}
                        </p>
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

function build_delete_grid_dialog(p_number, p_object_path, p_metadata_path, p_dictionary_path, p_index, p_metadata_prompt, p_data_length) {
    const modal_ui = [];

    modal_ui.push(`
        <div id="case_modal_${p_index}" class="modal modal-${p_index}" tabindex="-1" role="dialog" aria-labelledby="case_modal_label_${p_index}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                    <h5 id="case_modal_label_${p_index}" class="modal-title">Confirm Delete ${p_metadata_prompt} Item</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body row no-gutters">
                    <div class="modal-icons col" style="max-width: 40px;">
                        <span class="x40 fill-amber-p cdc-icon-alert_02" aria-hidden="true"></span>
                        <span class="spinner-container spinner-inline" style="display: none">
                        <span class="spinner-body text-primary">
                            <span class="spinner"></span>
                        </span>
                        </span>
                    </div>
                    <div class="modal-messages col pl-3">
                        <p>Are you sure you want to delete <strong>${p_metadata_prompt} item ${p_number} of ${p_data_length}</strong>?</p>
                    </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="modal-cancel btn btn btn-outline-secondary flex-order-2 mr-0" data-dismiss="modal" onclick="dispose_all_modals()">Cancel</button>
                    <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2" onclick="update_delete_dialog(${p_index}, () => { g_delete_grid_item_action('${p_object_path}', '${p_metadata_path}', '${p_dictionary_path}', ${p_index}) })">Delete</button>
                    <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2" style="display: none" onclick="dispose_all_modals()">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    return modal_ui;
}

function update_delete_dialog(p_index, callback) 
{
  const modal = $(`#case_modal_${p_index}`);
  const modal_msgs = modal.find('.modal-messages p');
  const modal_icons = modal.find('.modal-icons > span');
  const modal_btns = modal.find('.modal-footer button');

  $(modal_msgs[0]).text('Deleting...');
  $(modal_msgs[2]).hide();
  $(modal_icons[0]).hide();
  $(modal_icons[1]).show();
//   modal_msgs.first().text('Deleting...');
//   modal_msgs.last().hide();
//   modal_icons.first().hide();
//   modal_icons.last().show();

  setTimeout(() => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().length === 1 ? '0' + date.getFullYear().toString() : date.getFullYear().toString();
    const hour = date.getHours().toString().length === 1 ? '0' + date.getHours().toString() : date.getHours().toString();
    const min = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
    const second = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
    const user_name = document.getElementById('user_logged_in').innerText;

    //callback to actually delete the record
    callback();

    modal_icons.parent().hide();
    modal_msgs.first().css({color: '#8f0000', fontWeight: 'bold'});
    $(modal_msgs[0]).text(`Deleted ${user_name && 'by ' + user_name} ${month}/${day}/${year} ${hour}:${min}:${second}`).show();
    $(modal_msgs[1]).find('span').show();
    $(modal_msgs[2]).hide();
    modal_btns.hide().last().show();

    // modal_icons.parent().hide();
    // modal_msgs.first().text(`Deleted ${user_name && 'by ' + user_name} ${month}/${day}/${year} ${hour}:${min}:${second}`);
    // modal_msgs.first().css({
    //   color: '#8f0000',
    //   fontWeight: 'bold',
    // });
    // modal_msgs.last().hide();
    // modal_btns.hide();
    // modal_btns.last().show();
  }, 500);
}

function init_multirecord_delete_dialog(p_object_path, p_metadata_path, p_index) {
    const oPath = p_object_path;
    const mPath = p_metadata_path;
    const index = p_index;
    const gData = g_data;
    const modal = build_multirecord_delete_dialog(oPath, mPath, index, gData);
    const box = $('#content');

    box.append(modal[0]);
    $(`#record_modal_${index}`).modal("show");
	$(`#record_modal_${index} .modal-footer .modal-cancel`).focus();
}

function build_multirecord_delete_dialog(p_object_path, p_metadata_path, p_index, p_data) {
    const modal_ui        = [];
    const displayIndex    = parseInt(p_index) + 1;
    const lastUpdatedBy   = p_data.last_updated_by;
    
    const dateLastUpdated = new Date(p_data.date_last_updated);
    const mm              = (dateLastUpdated.getMonth() + 1).toString().length === 1 ? `0${dateLastUpdated.getMonth() + 1}` : dateLastUpdated.getMonth() + 1;
    const dd              = dateLastUpdated.getDate().toString().length === 1 ? `0${dateLastUpdated.getDate()}` : dateLastUpdated.getDate();
    const yyyy            = dateLastUpdated.getFullYear().toString().length === 1 ? `0${dateLastUpdated.getFullYear()}` : dateLastUpdated.getFullYear();
    const hhmmss          = get24HourFormat(dateLastUpdated.toLocaleTimeString());

    modal_ui.push(`
        <div id="record_modal_${p_index}" class="modal modal-${p_index}" tabindex="-1" role="dialog" aria-labelledby="record_modal_label_${p_index}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 id="record_modal_label_${p_index}" class="modal-title">Confirm Delete Record</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body row no-gutters">
                        <div class="modal-icons col" style="max-width: 40px">
                            <span class="x40 fill-amber-p cdc-icon-alert_02" aria-hidden="true"></span>
                            <span class="spinner-container spinner-inline" style="display: none">
                                <span class="spinner-body text-primary">
                                <span class="spinner"></span>
                                </span>
                            </span>
                        </div>
                        <div class="modal-messages col pl-3">
                            <p>Are you sure you want to delete this record?</p>
                            <p style="font-size: 18px"><strong>Record ${displayIndex}</strong></p>
                            <p>
                                Last updated: 
                                ${lastUpdatedBy} 
                                ${`${mm}/${dd}/${yyyy} ${hhmmss}`}
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="modal-cancel btn btn btn-outline-secondary flex-order-2 mr-0" data-dismiss="modal" onclick="dispose_all_modals()">Cancel</button>
                        <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2" onclick="update_multirecord_delete_dialog(${p_index}, () => { g_delete_record_item('${p_object_path}', '${p_metadata_path}', '${p_index}') })">Delete</button>
                        <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2" style="display: none" onclick="dispose_all_modals()">OK</button>
                    </div>
                </div>
            </div>
        </div>`
    );

    return modal_ui;
}

function update_multirecord_delete_dialog(p_index, callback) 
{
    const modal = $(`#record_modal_${p_index}`);
    const modal_msgs = modal.find('.modal-messages p');
    const modal_icons = modal.find('.modal-icons > span');
    const modal_btns = modal.find('.modal-footer button');

    modal_msgs.first().text('Deleting...');
    modal_msgs.last().hide();
    modal_icons.first().hide();
    modal_icons.last().show();

    setTimeout(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear().toString().length === 1 ? '0' + date.getFullYear().toString() : date.getFullYear().toString();
        const hour = date.getHours().toString().length === 1 ? '0' + date.getHours().toString() : date.getHours().toString();
        const min = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
        const second = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
        const user_name = document.getElementById('user_logged_in').innerText;

        //callback to actually delete the record
        callback();

        modal_icons.parent().hide();
        modal_msgs.first().text(`Deleted ${user_name && 'by ' + user_name} ${month}/${day}/${year} ${hour}:${min}:${second}`);
        modal_msgs.first().css({
            color: '#8f0000',
            fontWeight: 'bold',
        });
        modal_msgs.last().hide();
        modal_btns.hide();
        modal_btns.last().show();
    }, 500);
}

function dispose_all_modals() 
{
  $('.modal').modal('hide');
  $('.modal').remove();
  $('.modal-backdrop').remove();
}

function delete_record(p_index) 
{
    var data = g_ui.case_view_list[p_index];

    g_selected_delete_index = null;

    $.ajax({
      url:
        location.protocol +
        '//' +
        location.host +
        '/api/case?case_id=' +
        data.id,
    }).done(function (case_response) 
    {
      delete_case(case_response._id, case_response._rev);
    });

}

var save_interval_id = null;
var save_queue = [];

function enable_print_button(event) 
{
  const { value } = event.target;
  //duplicate print buttons being rendered
  //targetting next sibling instead
  const printButton = event.target.nextSibling; 
  // const printButton = document.getElementById('print-case-form');
  printButton.disabled = !value; // if there is a value it will be enabled.
  const pdfButton = printButton.nextSibling;
  pdfButton.disabled = !value;
//   console.log('pdfButton: ', pdfButton);
//   console.log('enable_print_button: ', printButton );
//   console.log('event: ', event);
}


let tab_number = 0;
function pdf_case_onclick(event) 
{
  const btn = event.target;
  // const dropdown = document.getElementById('print_case_id');
  const dropdown = btn.previousSibling.previousSibling;		// Need to go back 2 fields to get the dropdown value
  // get value of selected option
  let section_name = dropdown.value;
  //await print_pdf( section_name );

//   tab_number+= 1;

  if (section_name) 
  {
    if (section_name == 'core-summary') 
    {

        window.setTimeout(function()
        {
            openTab('./pdf-version', `_pdf_print_version${tab_number}`, section_name);
        }, 1000);	

      
    } 
    else 
    {
        // data-record of selected option
        const selectedOption = dropdown.options[dropdown.options.selectedIndex];
        const record_number = selectedOption.dataset.record;
        let tabName = section_name === 'all' ? '_all' : '_pdf_print_version';

        if(section_name == "all_hidden")
        {
            tabName = '_all';
            section_name = 'all';

            window.setTimeout(function()
            {
                openTab('./pdf-version',  `_pdf_print_version${tab_number}`, section_name, record_number, true);
            }, 1000);	
        }
        else
        {
            window.setTimeout(function()
            {
                openTab('./pdf-version',  `_pdf_print_version${tab_number}`, section_name, record_number);
            }, 1000);	
        }
      
    }
  }

}

function print_case_onclick(event) 
{
	const btn = event.target;
	const dropdown = btn.previousSibling;
	// const dropdown = document.getElementById('print_case_id');
	// get value of selected option
	let section_name = dropdown.value;
  
	if (section_name) 
	{
	  if (section_name == 'core-summary') 
	  {
  
		  window.setTimeout(function()
		  {
			  openTab('./core-elements', '_core_summary', 'all');
		  }, 1000);	
  
		
	  } 
	  else 
	  {
		// data-record of selected option
		const selectedOption = dropdown.options[dropdown.options.selectedIndex];
		const record_number = selectedOption.dataset.record;
		let tabName = section_name === 'all' ? '_all' : '_print_version';
  
        if(section_name == "all_hidden")
        {
            tabName = '_all';
            section_name = 'all';

            window.setTimeout(function()
            {
                openTab('./print-version',  tabName, section_name, record_number, true);
            }, 1000);	
        }
        else
        {
  
            window.setTimeout(function()
            {
                openTab('./print-version', tabName, section_name, record_number);
            }, 1000);	
        }
		
	  }
	}
  
}

function openTab(pageRoute, tabName, p_section, p_number, p_show_hidden) 
{
	console.log('in openTab');
	console.log('pageRoute: ', pageRoute);
	console.log('tabName: ', tabName);
	console.log('g_metadata: ', g_metadata);
	console.log('g_data: ', g_data);
	console.log('p_section: ', p_section);
	console.log('p_number: ', p_number);

  // check if a WindowProxy object has already been created.
  if (!window[tabName] || window[tabName].closed) 
  {
    window[tabName] = window.open(pageRoute, tabName, null, false);
    window[tabName].addEventListener('load', () => {
      window[tabName].create_print_version(
        g_metadata,
        g_data,
        p_section,
        p_number,
        g_metadata_summary,
        p_show_hidden
      );
    });
  } 
  else 
  {
    // if the WindowProxy Object already exists then just call the function on it
    window[tabName].create_print_version(
      g_metadata,
      g_data,
      p_section,
      p_number,
      g_metadata_summary,
      p_show_hidden
    );
  }
}

function add_new_form_click(p_metadata_path, p_object_path, p_dictionary_path) 
{
  //console.log('add_new_form_click: ' + p_metadata_path + ' , ' + p_object_path);

  var metadata = eval(p_metadata_path);
  var form_array = eval(p_object_path);
  var new_form = create_default_object(metadata, {}, true);
  var item = new_form[metadata.name][0];

  form_array.push(item);

  g_apply_sort(metadata, form_array, p_metadata_path, p_object_path, p_dictionary_path);

    save_case
    (
        g_data,
        function () 
        {
            var post_html_call_back = [];
            document.getElementById(metadata.name + '_id').innerHTML = page_render
            (
                metadata,
                form_array,
                g_ui,
                p_metadata_path,
                p_object_path,
                '',
                false,
                post_html_call_back
            ).join('');
            if (post_html_call_back.length > 0) 
            {
                eval(post_html_call_back.join(''));
            }
        }
    );
}

function enable_edit_click() 
{
  if (g_data) 
  {
    let new_date = new Date();

    g_change_stack.push({
        _id: g_data._id,
        _rev: g_data._rev,
      object_path: 'g_data.date_last_checked_out',
      metadata_path: '/date_last_checked_out',
      old_value: g_data.date_last_checked_out,
      new_value: new_date.toISOString(),
      dictionary_path: '/date_last_checked_out',
      metadata_type: 'datetime',
      prompt: 'date_last_checked_out',
      date_created: new_date.toISOString(),
      user_name: g_user_name
    });

    g_data.date_last_updated = new_date;
    g_data.date_last_checked_out = new_date;
    g_data.last_checked_out_by = g_user_name;
    g_data_is_checked_out = true;
    save_case(g_data, create_save_message, "enable_edit");
    g_autosave_interval = window.setInterval(autosave, 10000);

    g_render();

    if ($global.case_document_begin_edit != null) 
    {
        $global.case_document_begin_edit();
    }
  }
}

function save_form_click() 
{
    
    save_case(g_data, create_save_message, 'save_form_click');
}

function save_and_finish_click() 
{
  g_data.date_last_updated = new Date();
  g_data.date_last_checked_out = null;
  g_data.last_checked_out_by = null;
  g_data_is_checked_out = false;
  g_apply_sort(g_metadata, g_data, "","", "");
  save_case(g_data, create_save_message, 'save_and_finish_click');
  g_render();
  window.clearInterval(g_autosave_interval);
  g_autosave_interval = null;
}

function create_save_message() 
{
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

function clear_nav_status_area() 
{
  document.getElementById('nav_status_area').innerHTML = '<div>&nbsp;</div>';
}

function set_local_case(p_data, p_call_back) 
{
  let local_storage_index = get_local_storage_index();

  if (local_storage_index == null) 
  {
    local_storage_index = create_local_storage_index();
  }

  local_storage_index[p_data._id] = create_local_storage_index_item(p_data);
  window.localStorage.setItem
  (
    'case_index',
    JSON.stringify(local_storage_index)
  );

  window.localStorage.setItem('case_' + p_data._id, JSON.stringify(p_data));

  if (p_call_back) 
  {
    p_call_back();
  }
}

function create_local_storage_index() 
{
  let result = {};

  for (let key in window.localStorage) 
  {
    if (key == 'case_index') 
    {
      continue;
    }

    if (window.localStorage.hasOwnProperty(key)) 
    {
      let item_string = window.localStorage[key];
      let item_object = JSON.parse(item_string);

      result[item_object._id] = create_local_storage_index_item(item_object);
    }
  }

  window.localStorage.setItem('case_index', JSON.stringify(result));

  return result;
}

function get_local_storage_space_usage_in_kilobytes() 
{
  let allStrings = '';

  for (let key in window.localStorage)
   {
    if (window.localStorage.hasOwnProperty(key)) 
    {
      allStrings += window.localStorage[key];
    }
  }
  return allStrings ? 3 + (allStrings.length * 16) / (8 * 1024) : 0;
}

function calc_local_storage_space_usage_in_kilobytes(p_string) 
{
  return p_string ? 3 + (p_string.length * 16) / (8 * 1024) : 0;
}

function convert_local_storage_index_to_array(p_case_index) 
{
  let result = [];

  for (let key in p_case_index) 
  {
    if (p_case_index.hasOwnProperty(key)) 
    {
      let item = p_case_index[key];
      let item_object = JSON.parse(window.localStorage['case_' + key]);

      if (!(item.date_last_updated instanceof Date)) 
      {
        item.date_last_updated = new Date(item.date_last_updated);
      }

      item.size_in_kilobytes = calc_local_storage_space_usage_in_kilobytes
      (
        JSON.stringify(item_object)
      );

      result.push(item);
    }
  }

  //result.sort(function(p1, p2){return p1.size_in_kilobytes-p2.size_in_kilobytes});
  result.sort(function (p1, p2) 
  {
    return p1.date_last_updated - p2.date_last_updated;
  });

  return result;
}

function get_local_storage_index() 
{
  let result = JSON.parse(window.localStorage.getItem('case_index'));

  if (result == null) 
  {
    result = create_local_storage_index();
  } 
  else if 
  (
    Object.keys(result).length === 0 &&
    result.constructor === Object &&
    window.localStorage.length > 0
  ) 
  {
    result = create_local_storage_index();
  }

  return result;
}

function create_local_storage_index_item(p_data) 
{
  return {
    _id: p_data._id,
    _rev: p_data._rev,
    date_created: p_data.date_created,
    created_by: p_data.created_by,
    date_last_updated: p_data.date_last_updated,
    last_updated_by: p_data.last_updated_by,
  };
}

function get_local_case(p_id) 
{
  var result = null;

  result = JSON.parse(window.localStorage.getItem('case_' + p_id));

  return result;
}

function undo_click() 
{
  var current_change = g_change_stack.pop();

  if (current_change) 
  {
    var metadata = eval(current_change.metadata_path);

    if 
    (
      metadata.type.toLowerCase() == 'list' &&
      metadata['is_multiselect'] &&
      metadata.is_multiselect == true
    ) 
    {
      var item = eval(current_change.object_path);

      if (item.indexOf(current_change.old_value) > -1) 
      {
        item.splice(item.indexOf(current_change.old_value), 1);
      } 
      else 
      {
        item.push(current_change.old_value);
      }
    } 
    else if (metadata.type.toLowerCase() == 'boolean') 
    {
      eval(current_change.object_path + ' = ' + current_change.old_value);
    } 
    else 
    {
      eval
      (
        current_change.object_path +
          ' = "' +
          current_change.old_value.replace(/"/g, '\\"').replace(/\n/g, '\\n') +
          '"'
      );
    }
  }

  g_render();
}

function autosave() 
{
  let split_one = window.location.href.split('#');

  if (split_one.length > 1) 
  {
    let split_two = split_one[0].split('/');

    if (split_two.length > 3 && split_two[3].toLocaleLowerCase() == 'case')
    {
      let split_three = split_one[1].split('/');

      if
      (
        split_three.length > 1 &&
        split_three[1].toLocaleLowerCase() != 'summary'
      ) 
      {
        if (g_data) 
        {
          let dt1 = new Date(g_data.date_last_updated);
          let dt2 = new Date();
          let number_of_minutes = diff_minutes(dt1, dt2);

          if (number_of_minutes > 2) 
          {
            g_data.date_last_updated = new Date();
            save_case(g_data, null, 'autosave');
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
        p_case.home_record &&
        p_case.home_record.case_status &&
        p_case.home_record.case_status.overall_case_status &&
        p_case.home_record.case_status.overall_case_status != ""
    )
    {
        selected_value = new Number(p_case.home_record.case_status.overall_case_status);
    }
    
    if
    (
        p_case.home_record &&
        p_case.home_record.case_status &&
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

function diff_minutes(dt1, dt2) 
{
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;

  diff /= 60;
  return Math.abs(Math.round(diff));
}

function g_textarea_oninput
(
    p_object_path,
    p_metadata_path,
    p_dictionary_path,
    value
) 
{
    var metadata = eval(p_metadata_path);

    g_case_narrative_is_updated = true;
    g_case_narrative_is_updated_date = new Date()

    eval
    (
        `${p_object_path}="${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
    );
  

    set_local_case(g_data, null);
}

function navigation_away() 
{
  if (g_data_is_checked_out && g_data) 
  {
    g_data.date_last_updated = new Date();
    g_data.date_last_checked_out = null;
    g_data.last_checked_out_by = null;
    g_data_is_checked_out = false;

    for (let i = 0; i < g_ui.case_view_list.length; i++) 
    {
      let item = g_ui.case_view_list[i];
      if (item.id == g_data._id) 
      {
        item.date_last_checked_out = null;
        item.last_checked_out_by = null;
        break;
      }
    }

    save_case(g_data, null, 'navigation_away');
    window.clearInterval(g_autosave_interval);
    g_autosave_interval = null;
  }
}


function render_summary_validation
(
    p_metadata, 
    p_data, 
    p_path,  
    p_object_path,
    p_result, 
    p_form_index, 
    p_grid_index
)
{
    switch(p_metadata.type.toLocaleLowerCase())
    {
        case "app":
            
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                if
                (
                    p_data && 
                    p_data[child.name] &&
                    child.type.toLocaleLowerCase() == "form" &&
                    g_ui.url_state &&
                    g_ui.url_state.selected_id &&
                    g_ui.url_state.selected_id == child.name
                )
                {
                    render_summary_validation(child, p_data[child.name], p_path + "/" + child.name, p_object_path + "." + child.name, p_result, p_form_index, p_grid_index);
                }
            }
            break;
        case "form":
            if(p_metadata.cardinality == "1" || p_metadata.cardinality == "?")
            {
                for(let i = 0; i < p_metadata.children.length; i++)
                {
                    let child = p_metadata.children[i];

                    if(p_data && p_data[child.name])
                    {
                        render_summary_validation(child, p_data[child.name], p_path + "/" + child.name, p_object_path + "." + child.name, p_result, p_form_index, p_grid_index);
                    }
                    
                }
            }
            else // multiform
            {

                for(let form_index = 0; form_index < p_data.length; form_index++)
                {
                    let row_data = p_data[form_index]
                    for(let i = 0; i < p_metadata.children.length; i++)
                    {
                        let child = p_metadata.children[i];
    
                        if(row_data)
                        {
                            render_summary_validation(child, row_data, p_path + "/" + child.name, p_object_path + "[" + form_index + "]." + child.name, p_result, form_index, p_grid_index);
                        }
                        
                    }
                }
            }
            break;
        case "group":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                if(p_data)
                {
                    render_summary_validation(child, p_data[child.name], p_path + "/" + child.name, p_object_path + "." + child.name, p_result, p_form_index, p_grid_index);
                }
            }
            break;
        case "grid":
            for(let i = 0; i < p_data.length; i++)
            {
                let row_item = p_data[i];
                for(let j = 0; j <p_metadata.children.length; j++)
                {
                    let child = p_metadata.children[j];
                    render_summary_validation(child, row_item[child.name], p_path + "/" + child.name, p_object_path + "[" + i + "]." + child.name, p_result, p_form_index, i);
                }
            
            }
            break;
        case "string":
        case "number":
        case "time":
                // do nothing for now
            break;
        case "date":
            if (!is_valid_date(p_data)) 
            {
                //p_result.push('<li data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}" data-grid="'+ p_grid_index +'"><strong>'+legend_label+': ${p_metadata.prompt}, item '+(parseInt(p_grid_index)+1)+':</strong> Date must be a valid calendar date between 1900-2100</li>');
                p_result.push(`$('#validation_summary_list').append('<li><strong>${p_metadata.prompt} ${p_data}:</strong> Date must be a valid calendar date between 1900-2100 <button class="btn anti-btn ml-1"><span class="sr-only">Remove Item</span><span class="x20 cdc-icon-times-solid"></span></button></li>');`);
                
            }
            break;
        case "datetime":
            if (!is_valid_datetime(p_data)) 
            {
                //p_result.push('<li data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}" data-grid="'+p_grid_index+'"><strong>'+legend_label+': ${p_metadata.prompt}, item '+(parseInt(p_grid_index)+1)+':</strong> Date must be a valid calendar date between 1900-2100</li>');
                p_result.push(`$('.construct__header-alert ul').append('<li><strong>${p_metadata.prompt} ${p_data}:</strong> Date must be a valid calendar date between 1900-2100 <button class="btn anti-btn ml-1"><span class="sr-only">Remove Item</span><span class="x20 cdc-icon-times-solid"></span></button></li>');`);
                
            }
            break;
        case "list":
            // do nothing for now
            break;
        case "textarea":
            // do nothing for now
            break;
    }
}

function gui_remove_broken_rule_click(p_object_id)
{
    gui_remove_broken_rule(p_object_id);
    apply_validation();

}

function gui_remove_broken_rule(p_object_id)
{
    if(g_ui.broken_rules.hasOwnProperty(p_object_id))
    {
        g_ui.broken_rules[p_object_id] = null;
        delete g_ui.broken_rules[p_object_id];
    }

    let item = document.getElementById(`${p_object_id}-inline-validation-message`);
    if(item != null)
    {
        item.style.display = 'none';
    }

    //remove validation error from date control
    $(`#${p_object_id} .date-control`).removeClass('is-invalid');
    //remove validation error from datetime control
    $(`#${p_object_id}-innerdiv`).removeClass('is-invalid');
}



function add_new_case_button_click(p_input)
{
    let state = document.getElementById("add_new_state");

    if(state == null)
    {
        let el = document.getElementById("app_summary");
        let state_list = [];
        let month_list = [];
        let day_list = [];
        let year_list = [];
        let state_html = [];
        let month_html = [];
        let day_html = [];
        let year_html = [];

        for(let i = 0; i < g_metadata.lookup.length; i++)
        {
            let item = g_metadata.lookup[i];
            switch(item.name.toLowerCase())
            {
                case "state":
                    state_list = item;
                    break;
                case "month":
                    month_list = item;
                    break;
                case "day":
                    day_list = item;
                    break;
                case "year":
                    year_list = item;
                    break;
            }
        }

        for(let i = 0; i < state_list.values.length; i++)
        {
            let item = state_list.values[i];

            state_html.push(`<option value='${item.value}'>${item.display}</option>`)
        }

        for(let i = 0; i < month_list.values.length; i++)
        {
            let item = month_list.values[i];
            month_html.push(`<option value='${item.value}'>${item.display}</option>`)
        }


        for(let i = 0; i < day_list.values.length; i++)
        {
            let item = day_list.values[i];
            day_html.push(`<option value='${item.value}'>${item.display}</option>`)
        }

        for(let i = 0; i < year_list.values.length; i++)
        {
            let item = year_list.values[i];
            year_html.push(`<option value='${item.value}'>${item.display}</option>`)
        }

        let result = [];

        result.push(`
            <input type="hidden" id="add_new_state" value="init" />

            <h1 class="h2">Add New Case - Generate MMRIA Record ID#</h1>

            <div id="new_validation_message_area">
                <p><span class="info-icon x20 fill-p cdc-icon-info-circle-solid ml-1"></span> All fields are required to generate record id number except Decedent's Middle Name.</p>
            </div>

            <div>
                <div class="form-row">
                    <div class="col mb-3">
                        <label for="new_first_name">Decedent's First Name*</label>
                        <input id="new_first_name" class="form-control w-100" type="text" value="" />
                    </div>

                    <div class="col mb-3">
                        <label for="new_middle_name">Decedent's Middle Name</label>
                        <input id="new_middle_name" class="form-control w-100" type="text" value="" />
                    </div>
                    
                    <div class="col mb-3">
                        <label for="new_last_name">Decedent's Last Name*</label>
                        <input id="new_last_name" class="form-control w-100" type="text" value="" />
                    </div>
                </div>

                <div class="form-row align-items-end">
                    <div class="col-8 mb-3 batch" style="margin-top: 36px">
                        <fieldset class="batch__body">
                            <legend class="batch__title">Date of Death*</legend>
                            <div class="form-row">
                                <div class="col-4">
                                    <label for="new_month_of_death">Month*</label>
                                    <select id="new_month_of_death" class="form-control">${month_html.join("")}</select>
                                </div>

                                <div class="col-4">
                                    <label for="new_day_of_death">Day*</label>
                                    <select id="new_day_of_death" class="form-control">${day_html.join("")}</select>
                                </div>
                                
                                <div class="col-4">
                                    <label for="new_year_of_death">Year*</label>
                                    <select id="new_year_of_death" class="form-control">${year_html.join("")}</select>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="col-4 mb-3" style="padding-bottom: 10px">
                        <label for="new_state_of_death">State of Death Record*</label>
                        <select id="new_state_of_death" class="form-control">${state_html.join("")}</select>
                    </div>
                </div>

                <div class="form-row mt-3">
                    <button class="btn btn-primary mr-2" onclick="add_new_case_button_click()">Generate Record ID & Continue</button>
                    <button class="btn btn-light" onclick="g_render();">Cancel</button>
                </div>
                
            </div>

            <dialog id="add_new_confirm_dialog" class="set-radius p-0" role="dialog" tabindex="-1" aria-describedby="mmria_dialog" aria-labelledby="ui-id-1"></dialog>
        `);


        el.innerHTML = result.join("");
    }
    else if(state.value == "init")
    {
        let new_validation_message_area = document.getElementById("new_validation_message_area");
        let new_first_name = document.getElementById("new_first_name");
        let new_middle_name = document.getElementById("new_middle_name");
        let new_last_name = document.getElementById("new_last_name");
        let new_month_of_death = document.getElementById("new_month_of_death");
        let new_day_of_death = document.getElementById("new_day_of_death");
        let new_year_of_death = document.getElementById("new_year_of_death");
        let new_state_of_death = document.getElementById("new_state_of_death");

        if(
            new_first_name.value == null ||
            new_last_name.value == null ||
            new_month_of_death.value == null ||
            new_day_of_death.value == null ||
            new_year_of_death.value == null ||
            new_state_of_death.value == null ||
            new_first_name.value.length < 1 ||
            new_last_name.value.length < 1 ||
            new_month_of_death.value == 9999 ||
            new_day_of_death.value == 9999 ||
            new_year_of_death.value == 9999 ||
            new_state_of_death.value == 9999
        )
        {
            new_validation_message_area.innerHTML = `
                <div class="construct__header-alert row no-gutters p-2 mb-3">
                    <span class="left-col x32 fill-p cdc-icon-alert_02"></span>
                    <div class="right-col pl-3">
                        <p>Please enter data for the required fields below and try again:</p>
                        <ul id="validation_summary_list" class="mb-0">
                            <li><strong>Decedent's Last Name</strong></li>
                            <li><strong>Decedent's First Name</strong></li>
                            <li><strong>Date of Death (MM, DD, YYYY)</strong></li>
                            <li><strong>State of Death Record</strong></li>
                        </ul>
                        <p>The only field not required to create a new case form is <strong>Decedent's Middle Name</strong>.</p>
                    </div>
                </div>
            `;
        }
        else
        {
            add_new_case_check_for_duplicate(
                new_first_name.value, 
                new_last_name.value, 
                new_month_of_death.value, 
                new_day_of_death.value, 
                new_year_of_death.value, 
                new_state_of_death.value
            );

        } 
        
        
    }
    else if(state.value =="preconfirm")
    {
        
        state.value = "confirm";

        let add_new_confirm_dialog = document.getElementById("add_new_confirm_dialog");
        add_new_confirm_dialog.innerHTML = `
            <div class="ui-dialog-titlebar modal-header bg-primary ui-widget-header ui-helper-clearfix">
                <span id="ui-id-1" class="ui-dialog-title">Generate Record ID?</span>
                <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="add_new_case_button_click('no')"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
            </div>
            <div id="mmria_dialog" style="width: auto; min-height: 101px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content">
                <div class="modal-body">
                    <p><strong>Decedent’s Name (First, Middle, Last):</strong> ${new_first_name.value} ${new_middle_name.value} ${new_last_name.value}</p>
                    <p><strong>Date of Death:</strong> ${new_month_of_death.value== 9999? "(blank)" :new_month_of_death.value}/${new_day_of_death.value == 9999? "(blank)":new_day_of_death.value}/${new_year_of_death.value == 9999? "(blank)": new_year_of_death.value}</p>
                    <p><strong>State of Death Record:</strong> ${new_state_of_death.value==9999? "(blank)": new_state_of_death.value}</p>
                    <p class="d-flex align-items-start mb-0">
                        <span class="info-icon x20 fill-p cdc-icon-info-circle-solid mt-1 mr-2"></span>
                        <span>After you generate the MMRIA Record ID#, you will <strong>not</strong> be able to edit the Year of Death.</span>
                    </p>
                </div>
                <footer class="modal-footer">
                    <button class="btn btn-primary mr-1" onclick="add_new_case_button_click('yes')">OK</button>
                    <button class="btn btn-light" onclick="add_new_case_button_click('no')">Cancel</button>
                </footer>
            </div>
        `;
        add_new_confirm_dialog.showModal();
    }
    else if(state.value == "duplicate_name")
    {
        document.getElementById("add_new_state").value = "init";

        let add_new_confirm_dialog = document.getElementById("add_new_confirm_dialog");
        add_new_confirm_dialog.innerHTML = `
            <div class="ui-dialog-titlebar modal-header bg-primary ui-widget-header ui-helper-clearfix">
                <span id="ui-id-1" class="ui-dialog-title">Duplicate Name Found</span>
                <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="×" onclick="add_new_case_button_click('no')"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>×</button>
            </div>
            <div id="mmria_dialog" style="width: auto; min-height: 101px; max-height: none; height: auto;" class="ui-dialog-content ui-widget-content">
                <div class="modal-body">
                    <p><strong>Decedent’s Name (First, Middle, Last):</strong> ${new_first_name.value} ${new_middle_name.value} ${new_last_name.value}</p>
                    <p><strong>Date of Death:</strong> ${new_month_of_death.value== 9999? "(blank)" :new_month_of_death.value}/${new_day_of_death.value == 9999? "(blank)":new_day_of_death.value}/${new_year_of_death.value == 9999? "(blank)": new_year_of_death.value}</p>
                    <p><strong>State of Death Record:</strong> ${new_state_of_death.value==9999? "(blank)": new_state_of_death.value}</p>
                    <p class="d-flex align-items-start mb-0">
                        <span class="info-icon x20 fill-p cdc-icon-info-circle-solid mt-1 mr-2"></span>
                        <span>Duplicate: A Record with the same information was found.  Please check your information again.</span>
                    </p>
                </div>
                <footer class="modal-footer">
                    <button class="btn btn-light" onclick="add_new_confirm_dialog.close()">Cancel</button>
                </footer>
            </div>
        `;
        add_new_confirm_dialog.showModal();
    }
    else if(state.value == "confirm")
    {
        let add_new_confirm_dialog = document.getElementById("add_new_confirm_dialog");
        add_new_confirm_dialog.close();
        if(p_input == "yes")
        {
            state.value = "generate_record";
            new_validation_message_area.innerHTML = "generate confirmed";

            Get_Record_Id_List(

            function () {
                g_ui.add_new_case(
                new_first_name.value,
                new_middle_name.value,
                new_last_name.value,
                new_month_of_death.value,
                new_day_of_death.value,
                new_year_of_death.value,
                new_state_of_death.value);
            });
        }
        else
        {
            //new_validation_message_area.innerHTML = "cancelled generate";
            new_validation_message_area.innerHTML = `
                <p><span class="info-icon x20 fill-p cdc-icon-info-circle-solid"></span> All fields are required to generate record id number except Decedent's Middle Name.</p>
            `;
            state.value = "init";
        }
        
    }
    else if("generate_record")
    {

    }
}


function add_new_case_check_for_duplicate
(
    pFirstName, 
    pLastName, 
    pMonthOfDeath, 
    pDayOfDeath, 
    pYearOfDeath, 
    pStateOfDeath
) 
{

    let data = { 
        FirstName: pFirstName, 
        LastName: pLastName, 
        MonthOfDeath: pMonthOfDeath, 
        DayOfDeath: pDayOfDeath, 
        YearOfDeath: pYearOfDeath, 
        StateOfDeath: pStateOfDeath
    };
    
  $.ajax({
    url:
      location.protocol + '//' + location.host + '/api/isDuplicateCase',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      type: 'POST',
  }).done(function (response) {
      let is_duplicate_response = true;
      if(response == is_duplicate_response)
      {
        document.getElementById("add_new_state").value = "duplicate_name";
      }
      else
      {
        document.getElementById("add_new_state").value = "preconfirm";
      }
      add_new_case_button_click();
  });
}


function build_other_specify_lookup(p_result, p_metadata, p_path = "")
{
    switch(p_metadata.type.toLocaleLowerCase())
    {
        case "app":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];

                build_other_specify_lookup(p_result, child, `${child.name}`);
            }
            break;
        case "form":
        case "group":
        case "grid":

                for(let i = 0; i < p_metadata.children.length; i++)
                {
                    let child = p_metadata.children[i];

                    build_other_specify_lookup(p_result, child, `${p_path}/${child.name}`);
                }
            break;
        case "list":
            let other_specify_list_key = [];
            let other_specify_list_path = [];

            if
            (
                p_metadata.other_specify_list != null && 
                p_metadata.other_specify_list.trim().length > 0
            )
            {
                let item_list = p_metadata.other_specify_list.split(',');
                for(let i = 0; i < item_list.length; i++)
                {
                    let kvp = item_list[i].split(' ');
                    if
                    (
                        kvp.length > 1 &&
                        kvp[0] != null &&
                        kvp[0].trim().length > 0 &&
                        kvp[1] != null &&
                        kvp[1].trim().length > 0
                    )
                    {
                        let key = kvp[0].trim();
                        let path = kvp[1].trim();

                        p_result[path] = { list: `${p_path}`, value: key }
                        
                    }
                }
            }


            for(let i = 0; i < other_specify_list_key.length; i++)
            {
                let item = other_specify_list_key[i];
                let object_path = `g_data.${other_specify_list_path[i].replace(/\//g,".")}`;
                
            }
        break;
        case "string":
        case "number":
        case "time":
        case "date":
        case "datetime":
        case "textarea":
        default:
            break;
    }
}

function update_charts()
{
    for (let chart in g_charts)
    {
        let item = g_charts[chart];
        let p_metadata = g_chart_data[chart];
        let columns_data = [];
        let x_columns_data = [];
        let convertedArray = [];
        let xconvertedArray = [];

        if (p_metadata.y_label && p_metadata.y_label != "") 
        {
            var y_labels = p_metadata.y_label.split(",");
            var y_axis_paths = p_metadata.y_axis.split(",");
            for (var y_index = 0; y_index < y_axis_paths.length; y_index++) 
            {
                columns_data.push(get_chart_y_range_from_path(p_metadata, y_axis_paths[y_index], p_ui, y_labels[y_index]).replace("['", "").replace("]", "").replace("'", "").split(",").map(String));
            }
        }
        else 
        {
            var y_axis_paths = p_metadata.y_axis.split(",");
            for (var y_index = 0; y_index < y_axis_paths.length; y_index++) 
            {
                columns_data.push(get_chart_y_range_from_path(p_metadata, y_axis_paths[y_index], g_ui).replace("['", "").replace("]", "").replace("'", "").split(",").map(String));
            }
        }

        if (p_metadata.x_axis && p_metadata.x_axis != "") 
        {
            x_columns_data.push(get_chart_x_range_from_path(p_metadata, p_metadata.x_axis, g_ui).replace("['", "").replace("]", "").replace("'", "").slice(0, -1).split(",").map(String));
        }

        columns_data.forEach
        (function (item, index) {
            var output = {};

            if (!item) return;

            output[item[0]] = item.slice(1, item.length);

            convertedArray.push(output);

        });

        x_columns_data.forEach
        (function (item, index) {
            var output = {};

            if (!item) return;

            output[item[0]] = item.slice(1, item.length);

            xconvertedArray.push(output);

        });

        let xdata;

        Object.values(xconvertedArray).forEach
        (function (obj, index) {
            var key = Object.keys(obj)[0];
            var data = [key];
            xdata = data.concat(obj[key]).map(function (x) { return x.replace("'", "",).replace("'", ""); });
        });

        Object.values(convertedArray).forEach
        (function (obj, index)  {
            var key = Object.keys(obj)[0];
            var data = [key];

            data = data.concat(obj[key]);

            item.load({
                unload: ['x'],
                columns: [
                    xdata,
                    data
                ]
            });

        });
        item.flush();
    }
}


const independent_autocalc_niosh_set = new Set();

independent_autocalc_niosh_set.add("/death_certificate/demographics/occupation_business_industry");
independent_autocalc_niosh_set.add("/death_certificate/demographics/primary_occupation");
independent_autocalc_niosh_set.add("/birth_fetal_death_certificate_parent/demographic_of_Father/occupation_business_industry");
independent_autocalc_niosh_set.add("/birth_fetal_death_certificate_parent/demographic_of_Father/primary_occupation");
independent_autocalc_niosh_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry");
independent_autocalc_niosh_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation");
independent_autocalc_niosh_set.add("/social_and_environmental_profile/socio_economic_characteristics/occupation");

const independent_autocalc_gestation_event_set = new Set();


independent_autocalc_gestation_event_set.add("/prenatal/other_lab_tests/date_and_time");
independent_autocalc_gestation_event_set.add("/prenatal/current_pregnancy.date_of_1st_prenatal_visit");
independent_autocalc_gestation_event_set.add("/prenatal/current_pregnancy/date_of_last_prenatal_visit");
independent_autocalc_gestation_event_set.add("/prenatal/routine_monitoring/date_and_time");
independent_autocalc_gestation_event_set.add("/prenatal/diagnostic_procedures/date");
independent_autocalc_gestation_event_set.add("/prenatal/problems_identified_grid/date_1st_noted");
independent_autocalc_gestation_event_set.add("/prenatal/medications_and_drugs_during_pregnancy/date");
independent_autocalc_gestation_event_set.add("/prenatal/pre_delivery_hospitalizations_details/date");
independent_autocalc_gestation_event_set.add("/prenatal/medical_referrals/date");
independent_autocalc_gestation_event_set.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival");
independent_autocalc_gestation_event_set.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission");
independent_autocalc_gestation_event_set.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge");
independent_autocalc_gestation_event_set.add("/other_medical_office_visits/visit/date_of_medical_office_visit");
independent_autocalc_gestation_event_set.add("/medical_transport/date_of_transport");
independent_autocalc_gestation_event_set.add("/medical_transport/transport_vital_signs/date_and_time");
independent_autocalc_gestation_event_set.add("/mental_health_profile/were_there_documented_mental_health_conditions/date_of_screening");


const independent_autocalc_list = new Set()

independent_autocalc_list.add("/prenatal/current_pregnancy/estimated_date_of_confinement/month");
independent_autocalc_list.add("/prenatal/current_pregnancy/estimated_date_of_confinement/day");
independent_autocalc_list.add("/prenatal/current_pregnancy/estimated_date_of_confinement/year");
independent_autocalc_list.add("/prenatal/current_pregnancy/date_of_last_normal_menses/month");
independent_autocalc_list.add("/prenatal/current_pregnancy/date_of_last_normal_menses/day");
independent_autocalc_list.add("/prenatal/current_pregnancy/date_of_last_normal_menses/year");


const dependent_autocalc_list = new Set();
dependent_autocalc_list.add("/prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_days");
dependent_autocalc_list.add("/prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit");
dependent_autocalc_list.add("/prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit_days");
dependent_autocalc_list.add("/prenatal/routine_monitoring/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/routine_monitoring/gestational_age_days");
dependent_autocalc_list.add("/prenatal/other_lab_tests/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/other_lab_tests/gestational_age_days");
dependent_autocalc_list.add("/prenatal/diagnostic_procedures/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/diagnostic_procedures/gestational_age_days");
dependent_autocalc_list.add("/prenatal/problems_identified_grid/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/problems_identified_grid/gestational_age_days");
dependent_autocalc_list.add("/prenatal/medications_and_drugs_during_pregnancy/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/medications_and_drugs_during_pregnancy/gestational_age_days");
dependent_autocalc_list.add("/prenatal/pre_delivery_hospitalizations_details/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/pre_delivery_hospitalizations_details/gestational_age_days");
dependent_autocalc_list.add("/prenatal/medical_referrals/gestational_age_weeks");
dependent_autocalc_list.add("/prenatal/medical_referrals/gestational_age_days");
dependent_autocalc_list.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_weeks");
dependent_autocalc_list.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_days");
dependent_autocalc_list.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_weeks");
dependent_autocalc_list.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_days");
dependent_autocalc_list.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_weeks");
dependent_autocalc_list.add("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_days");
dependent_autocalc_list.add("/other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_weeks");
dependent_autocalc_list.add("/other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_days");
dependent_autocalc_list.add("/medical_transport/date_of_transport/gestational_age_weeks");
dependent_autocalc_list.add("/medical_transport/date_of_transport/gestational_age_days");
dependent_autocalc_list.add("/medical_transport/transport_vital_signs/gestational_weeks");
dependent_autocalc_list.add("/medical_transport/transport_vital_signs/gestational_days");
dependent_autocalc_list.add("/mental_health_profile/were_there_documented_mental_health_conditions/gestational_weeks");
dependent_autocalc_list.add("/mental_health_profile/were_there_documented_mental_health_conditions/gestational_days");


async function autorecalculate
(
    p_independent_variable_mmria_path,
    p_form_index,
    p_grid_index
)
{
    if(independent_autocalc_list.has(p_independent_variable_mmria_path))
    {
        return await autorecalculate_all_gestation();
    }

    if(autocalc_map.has(p_independent_variable_mmria_path))
    {
        return autocalc_map.get(p_independent_variable_mmria_path)(p_form_index);
    }

    if(independent_autocalc_gestation_event_set.has(p_independent_variable_mmria_path))
    {

        const edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
        const edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
        const edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
        const lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
        const lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
        const lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);
    
        const edd_date = new Date(edd_year, edd_month - 1, edd_day);
        const lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);
    
        let is_edd = false;
        let is_lmp = false;
    
        if 
        (
            //$global.isValidDate(event_year, event_month, event_day) == true && 
            $global.isValidDate(edd_year, edd_month, edd_day) == true
        )
        {
            is_edd = true;
    
        }
        else if 
        (
            //$global.isValidDate(event_year, event_month, event_day) == true && 
            $global.isValidDate(lmp_year, lmp_month, lmp_day) == true
        )
        {
            is_lmp = true;
        }
        else
        {
            return;
        }

        let ga = [];
        switch(p_independent_variable_mmria_path)
        {
            case "/prenatal/other_lab_tests/date_and_time":
                ga = autorecalculate_get_event_date("/prenatal/other_lab_tests/date_and_time", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.other_lab_tests.gestational_age_weeks = ga[0];
                    g_data.prenatal.other_lab_tests.gestational_age_days = ga[1];
                }
            break;
            case "/prenatal/current_pregnancy/date_of_1st_prenatal_visit":
                ga = autorecalculate_get_event_date("/prenatal/current_pregnancy.date_of_1st_prenatal_visit", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_weeks.gestational_age_weeks = ga[0];
                    g_data.prenatal.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_weeks.gestational_age_days = ga[1];
                }
            break;
            case "/prenatal/current_pregnancy/date_of_last_prenatal_visit":
                ga = autorecalculate_get_event_date("/prenatal/current_pregnancy/date_of_last_prenatal_visit", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit.gestational_age_at_last_prenatal_visit = ga[0];
                    g_data.prenatal.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit_days = ga[1];
                }

            break;
            case "/prenatal/routine_monitoring/date_and_time":
                ga = autorecalculate_get_event_date("/prenatal/routine_monitoring/date_and_time", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.routine_monitoring.gestational_age_weeks.gestational_age_weeks = ga[0];
                    g_data.prenatal.routine_monitoring.gestational_age_weeks.gestational_age_days = ga[1];
                }
            break;
            case "/prenatal/diagnostic_procedures/date":
                ga = autorecalculate_get_event_date("/prenatal/diagnostic_procedures/date", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.diagnostic_procedures.gestational_age_weeks = ga[0];
                    g_data.prenatal.diagnostic_procedures.gestational_age_days = ga[1];
                }
            
            break;
            case "/prenatal/problems_identified_grid/date_1st_noted":
                ga = autorecalculate_get_event_date("/prenatal/problems_identified_grid/date_1st_noted", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g.data.prenatal.problems_identified_grid.gestational_age_weeks = ga[0];
                    g.data.prenatal.problems_identified_grid.gestational_age_days = ga[1];
                }
            break;
            case "/prenatal/medications_and_drugs_during_pregnancy/date":
                ga = autorecalculate_get_event_date("/prenatal/medications_and_drugs_during_pregnancy/date", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.medications_and_drugs_during_pregnancy.gestational_age_weeks = ga[0];
                    g_data.prenatal.medications_and_drugs_during_pregnancy.gestational_age_days = ga[1];
                }
            break;
            case "/prenatal/pre_delivery_hospitalizations_details/date":
                ga = autorecalculate_get_event_date("/prenatal/pre_delivery_hospitalizations_details/date", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.pre_delivery_hospitalizations_details.gestational_age_weeks = ga[0];
                    g_data.prenatal.pre_delivery_hospitalizations_details.gestational_age_days = ga[1];
                }
            break;
            case "/prenatal/medical_referrals/date":
                ga = autorecalculate_get_event_date("/prenatal/medical_referrals/date", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.prenatal.medical_referrals.gestational_age_weeks = ga[0];
                    g_data.prenatal.medical_referrals.gestational_age_days = ga[1];
                }
            break;
            case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival":
                ga = autorecalculate_get_event_date("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.er_visit_and_hospital_medical_records[p_form_index].basic_admission_and_discharge_information.date_of_arrival.gestational_age_weeks = ga[0];
                    g_data.er_visit_and_hospital_medical_records[p_form_index].basic_admission_and_discharge_information.date_of_arrival.gestational_age_days = ga[1];
                }
            break;
            case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission":
                ga = autorecalculate_get_event_date("/er_visit_and_hospital_medical_records.basic_admission_and_discharge_information/date_of_hospital_admission", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.er_visit_and_hospital_medical_records[p_form_index].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_weeks = ga[0];
                    g_data.er_visit_and_hospital_medical_records[p_form_index].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_days = ga[1];
                }
            break;
            case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge":
                ga = autorecalculate_get_event_date("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.er_visit_and_hospital_medical_records[p_form_index].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_weeks = ga[0];
                    g_data.er_visit_and_hospital_medical_records[p_form_index].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_days = ga[1];
                }
            break;
            case "/other_medical_office_visits/visit/date_of_medical_office_visit":
                
                ga = autorecalculate_get_event_date("/other_medical_office_visits/visit/date_of_medical_office_visit", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.other_medical_office_visits[p_form_index].visit.date_of_medical_office_visit.gestational_age_weeks = ga[0];
                    g_data.other_medical_office_visits[p_form_index].visit.date_of_medical_office_visit.gestational_age_days = ga[1];
                }
    
            break;
            case "/medical_transport/date_of_transport":
                ga = autorecalculate_get_event_date("/medical_transport/date_of_transport", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.medical_transport[p_form_index].date_of_transport.gestational_age_weeks = ga[0];
                    g_data.medical_transport[p_form_index].date_of_transport.gestational_age_days = ga[1];
                }
            break;
            case "/medical_transport/transport_vital_signs/date_and_time":
                ga = autorecalculate_get_event_date("/medical_transport/transport_vital_signs/date_and_time", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.medical_transport[p_form_index].transport_vital_signs.gestational_weeks = ga[0];
                    g_data.medical_transport[p_form_index].transport_vital_signs.gestational_days = ga[1];
                }
            break;
            case "/mental_health_profile/were_there_documented_mental_health_conditions/date_of_screening":
                ga = autorecalculate_get_event_date("/mental_health_profile/were_there_documented_mental_health_conditions/date_of_screening", is_edd, edd_date, is_lmp, lmp_date)
                if (ga.length > 1) 
                {
                    g_data.mental_health_profile.were_there_documented_mental_health_conditions.gestational_weeks = ga[0];
                    g_data.mental_health_profile.were_there_documented_mental_health_conditions.gestational_days = ga[1];              
                }
            break;
        }
        
    }

    if(independent_autocalc_niosh_set.has(p_independent_variable_mmria_path))
    {
        let niosh_result = {};
        switch(p_independent_variable_mmria_path)
        {
            case "/death_certificate/demographics/occupation_business_industry":
            case "/death_certificate/demographics/primary_occupation":
                niosh_result = await get_niosh_codes
                (
                    g_data.death_certificate.demographics.primary_occupation,
                    g_data.death_certificate.demographics.occupation_business_industry
                )

                if(niosh_result.industry.length > 0)
                g_data.death_certificate.demographics.dc_m_industry_code_1 = niosh_result.industry[0].code;
                if(niosh_result.industry.length > 1)
                g_data.death_certificate.demographics.dc_m_industry_code_2 = niosh_result.industry[1].code;
                if(niosh_result.industry.length > 2)
                g_data.death_certificate.demographics.dc_m_industry_code_3 = niosh_result.industry[2].code;
                if(niosh_result.occupation.length > 0)
                g_data.death_certificate.demographics.dc_m_occupation_code_1 = niosh_result.occupation[0].code;
                if(niosh_result.occupation.length > 1)
                g_data.death_certificate.demographics.dc_m_occupation_code_2 = niosh_result.occupation[1].code;
                if(niosh_result.occupation.length > 2)
                g_data.death_certificate.demographics.dc_m_occupation_code_3 = niosh_result.occupation[2].code;


            break;
            case "/birth_fetal_death_certificate_parent/demographic_of_Father/occupation_business_industry":
            case "/birth_fetal_death_certificate_parent/demographic_of_Father/primary_occupation":


                niosh_result = await get_niosh_codes
                (
                    g_data.birth_fetal_death_certificate_parent.demographic_of_Father.occupation_business_industry,
                    g_data.birth_fetal_death_certificate_parent.demographic_of_Father.primary_occupation
                )
            

                if(niosh_result.industry.length > 0)             
                g_data.birth_fetal_death_certificate_parent.demographic_of_father.bcdcp_f_industry_code_1 = niosh_result.industry[0].code;
                if(niosh_result.industry.length > 1)
                niosh_result.g_data.birth_fetal_death_certificate_parent.demographic_of_father.bcdcp_f_industry_code_2 = niosh_result.industry[1].code;
                if(niosh_result.industry.length > 2)
                niosh_result.g_data.birth_fetal_death_certificate_parent.demographic_of_father.bcdcp_f_industry_code_3 = niosh_result.industry[2].code;
                if(niosh_result.occupation.length > 0)
                niosh_result.g_data.birth_fetal_death_certificate_parent.demographic_of_father.bcdcp_f_occupation_code_1 = niosh_result.occupation[0].code;
                if(niosh_result.occupation.length > 1)
                niosh_result.g_data.birth_fetal_death_certificate_parent.demographic_of_father.bcdcp_f_occupation_code_2 = niosh_result.occupation[1].code;
                if(niosh_result.occupation.length > 2)
                niosh_result.g_data.birth_fetal_death_certificate_parent.demographic_of_father.bcdcp_f_occupation_code_3 = niosh_result.occupation[2].code;

            break;
            case "/birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry":
            case "/birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation":
                niosh_result = await get_niosh_codes
                (
                    g_data.birth_fetal_death_certificate_parent.demographic_of_mother.occupation_business_industry,
                    g_data.birth_fetal_death_certificate_parent.demographic_of_mother.primary_occupation
                )    
            
                if(niosh_result.industry.length > 0)
                g_data.birth_fetal_death_certificate_parent.demographic_of_mother.bcdcp_m_industry_code_1 = niosh_result.industry[0].code;
                if(niosh_result.industry.length > 1)
                g_data.birth_fetal_death_certificate_parent.demographic_of_mother.bcdcp_m_industry_code_2 = niosh_result.industry[1].code;
                if(niosh_result.industry.length > 2)
                g_data.birth_fetal_death_certificate_parent.demographic_of_mother.bcdcp_m_industry_code_3 = niosh_result.industry[2].code;
                if(niosh_result.occupation.length > 0)
                g_data.birth_fetal_death_certificate_parent.demographic_of_mother.bcdcp_m_occupation_code_1 = niosh_result.occupation[0].code;
                if(niosh_result.occupation.length > 1)
                g_data.birth_fetal_death_certificate_parent.demographic_of_mother.bcdcp_m_occupation_code_2 = niosh_result.occupation[1].code;
                if(niosh_result.occupation.length > 2)
                g_data.birth_fetal_death_certificate_parent.demographic_of_mother.bcdcp_m_occupation_code_3 = niosh_result.occupation[2].code;

            break;
            case "/social_and_environmental_profile/socio_economic_characteristics/occupation":
                niosh_result = await get_niosh_codes
                (
                    g_data.social_and_environmental_profile.socio_economic_characteristics.occupation,
                    null
                )
 

                if(niosh_result.industry.length > 0)
                g_data.social_and_environmental_profile.socio_economic_characteristics.sep_m_occupation_code_1 = niosh_result.industry[0].code;
                if(niosh_result.industry.length > 1)
                g_data.social_and_environmental_profile.socio_economic_characteristics.sep_m_occupation_code_2 = niosh_result.industry[1].code;
                if(niosh_result.industry.length > 2)
                g_data.social_and_environmental_profile.socio_economic_characteristics.sep_m_occupation_code_3 = niosh_result.industry[2].code;
                if(niosh_result.occupation.length > 0)
                g_data.social_and_environmental_profile.socio_economic_characteristics.sep_m_industry_code_1 = niosh_result.occupation[0].code;
                if(niosh_result.occupation.length > 1)
                g_data.social_and_environmental_profile.socio_economic_characteristics.sep_m_industry_code_2 = niosh_result.occupation[1].code;
                if(niosh_result.occupation.length > 2)
                g_data.social_and_environmental_profile.socio_economic_characteristics.sep_m_industry_code_3 = niosh_result.occupation[2].code;


            break;
        }
    }

}

async function autorecalculate_all_gestation()
{
    const edd_year = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.year);
    const edd_month = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.month);
    const edd_day = parseInt(g_data.prenatal.current_pregnancy.estimated_date_of_confinement.day);
    const lmp_year = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.year);
    const lmp_month = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.month);
    const lmp_day = parseInt(g_data.prenatal.current_pregnancy.date_of_last_normal_menses.day);

    const edd_date = new Date(edd_year, edd_month - 1, edd_day);
    const lmp_date = new Date(lmp_year, lmp_month - 1, lmp_day);

    let is_edd = false;
    let is_lmp = false;

    if 
    (
        //$global.isValidDate(event_year, event_month, event_day) == true && 
        $global.isValidDate(edd_year, edd_month, edd_day) == true
    )
    {
        is_edd = true;

    }
    else if 
    (
        //$global.isValidDate(event_year, event_month, event_day) == true && 
        $global.isValidDate(lmp_year, lmp_month, lmp_day) == true
    )
    {
        is_lmp = true;
    }
    else
    {
        return;
    }
/*

    is_edd
    edd_date
    is_lmp
    lmp_date


    var event_year = parseInt(this.year);
    var event_month = parseInt(this.month);
    var event_day = parseInt(this.day);
    var event_date = autorecalculate_get_event_date();
    const result = new Date(event_year, event_month - 1, event_day);

    ga = $global.calc_ga_edd(event_date, edd_date);
    ga = $global.calc_ga_lmp(lmp_date, event_date);
    */

    let ga = [];

    ga = autorecalculate_get_event_date("/prenatal/current_pregnancy/date_of_last_prenatal_visit", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit.gestational_age_at_last_prenatal_visit = ga[0];
        g_data.prenatal.current_pregnancy.date_of_last_prenatal_visit.gestational_age_at_last_prenatal_visit_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal.current_pregnancy/date_of_1st_prenatal_visit", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_weeks.gestational_age_weeks = ga[0];
        g_data.prenatal.current_pregnancy.date_of_1st_prenatal_visit.gestational_age_weeks.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/routine_monitoring/date_and_time", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.routine_monitoring.gestational_age_weeks.gestational_age_weeks = ga[0];
        g_data.prenatal.routine_monitoring.gestational_age_weeks.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/other_lab_tests/date_and_time", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.other_lab_tests.gestational_age_weeks = ga[0];
        g_data.prenatal.other_lab_tests.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/diagnostic_procedures/date", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.diagnostic_procedures.gestational_age_weeks = ga[0];
        g_data.prenatal.diagnostic_procedures.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/problems_identified_grid/date_1st_noted", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g.data.prenatal.problems_identified_grid.gestational_age_weeks = ga[0];
        g.data.prenatal.problems_identified_grid.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/medications_and_drugs_during_pregnancy/date", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.medications_and_drugs_during_pregnancy.gestational_age_weeks = ga[0];
        g_data.prenatal.medications_and_drugs_during_pregnancy.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/pre_delivery_hospitalizations_details/date", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.pre_delivery_hospitalizations_details.gestational_age_weeks = ga[0];
        g_data.prenatal.pre_delivery_hospitalizations_details.gestational_age_days = ga[1];
    }

    ga = autorecalculate_get_event_date("/prenatal/medical_referrals/date", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.prenatal.medical_referrals.gestational_age_weeks = ga[0];
        g_data.prenatal.medical_referrals.gestational_age_days = ga[1];
    }

    //er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_weeks
    g_data.er_visit_and_hospital_medical_records.forEach
    (
        function (item, index) 
        {
            ga = autorecalculate_get_event_date("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival", is_edd, edd_date, is_lmp, lmp_date)
            if (ga.length > 1) 
            {
                g_data.er_visit_and_hospital_medical_records[index].basic_admission_and_discharge_information.date_of_arrival.gestational_age_weeks = ga[0];
                g_data.er_visit_and_hospital_medical_records[index].basic_admission_and_discharge_information.date_of_arrival.gestational_age_days = ga[1];
            }

            ga = autorecalculate_get_event_date("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission", is_edd, edd_date, is_lmp, lmp_date)
            if (ga.length > 1) 
            {
                g_data.er_visit_and_hospital_medical_records[index].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_weeks = ga[0];
                g_data.er_visit_and_hospital_medical_records[index].basic_admission_and_discharge_information.date_of_hospital_admission.gestational_age_days = ga[1];
            }

            ga = autorecalculate_get_event_date("/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge", is_edd, edd_date, is_lmp, lmp_date)
            if (ga.length > 1) 
            {
                g_data.er_visit_and_hospital_medical_records[index].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_weeks = ga[0];
                g_data.er_visit_and_hospital_medical_records[index].basic_admission_and_discharge_information.date_of_hospital_discharge.gestational_age_days = ga[1];
            }
        }
    );

    g_data.other_medical_office_visits.forEach
    (
        function (item, index) 
        {
            ga = autorecalculate_get_event_date("/other_medical_office_visits/visit/date_of_medical_office_visit", is_edd, edd_date, is_lmp, lmp_date)
            if (ga.length > 1) 
            {
                g_data.other_medical_office_visits[index].visit.date_of_medical_office_visit.gestational_age_weeks = ga[0];
                g_data.other_medical_office_visits[index].visit.date_of_medical_office_visit.gestational_age_days = ga[1];
            }
        }
    );

    g_data.medical_transport.forEach
    (
        function (item, index) 
        {
            ga = autorecalculate_get_event_date("/medical_transport/date_of_transport", is_edd, edd_date, is_lmp, lmp_date)
            if (ga.length > 1) 
            {
                g_data.medical_transport[index].date_of_transport.gestational_age_weeks = ga[0];
                g_data.medical_transport[index].date_of_transport.gestational_age_days = ga[1];
            }

            ga = autorecalculate_get_event_date("/medical_transport/transport_vital_signs/date_and_time", is_edd, edd_date, is_lmp, lmp_date)
            if (ga.length > 1) 
            {
                g_data.medical_transport[index].transport_vital_signs.gestational_weeks = ga[0];
                g_data.medical_transport[index].transport_vital_signs.gestational_days = ga[1];
            }
        }
    )

    ga = autorecalculate_get_event_date("/mental_health_profile/were_there_documented_mental_health_conditions/date_of_screening", is_edd, edd_date, is_lmp, lmp_date)
    if (ga.length > 1) 
    {
        g_data.mental_health_profile.were_there_documented_mental_health_conditions.gestational_weeks = ga[0];
        g_data.mental_health_profile.were_there_documented_mental_health_conditions.gestational_days = ga[1];              
    }
        
}



function autorecalculate_get_event_date
(
    p_mmria_path,
    p_is_edd,
    p_edd_date,
    p_is_lmp,
    p_lmp_date,
    p_index
)
{
    let result = [];

    let event_date = null;

    switch(p_mmria_path)
    {
        
        case "/prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_weeks":
        case "/prenatal/current_pregnancy/date_of_1st_prenatal_visit/gestational_age_days":
            event_date = autorecalculate_get_event_date_separate(g_data.prenatal.current_pregnancy.date_of_1st_prenatal_visit);
        break;
        case "/prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit":
        case "/prenatal/current_pregnancy/date_of_last_prenatal_visit/gestational_age_at_last_prenatal_visit_days":
            event_date = autorecalculate_get_event_date_separate(g_data.prenatal.current_pregnancy.date_of_last_prenatal_visit);
        break;
        case "/prenatal/routine_monitoring/gestational_age_weeks":
        case "/prenatal/routine_monitoring/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.routine_monitoring.date_and_time);
        break;
        case "/prenatal/other_lab_tests/gestational_age_weeks":
        case "/prenatal/other_lab_tests/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.other_lab_tests.date_and_time);
        break;
        case "/prenatal/diagnostic_procedures/gestational_age_weeks":
        case "/prenatal/diagnostic_procedures/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.diagnostic_procedures.date)
        break;
        case "/prenatal/problems_identified_grid/gestational_age_weeks":
        case "/prenatal/problems_identified_grid/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.problems_identified_grid.date_1st_noted)
        break;
        case "/prenatal/medications_and_drugs_during_pregnancy/gestational_age_weeks":
        case "/prenatal/medications_and_drugs_during_pregnancy/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.medications_and_drugs_during_pregnancy.date)
        break;
        case "/prenatal/pre_delivery_hospitalizations_details/gestational_age_weeks":
        case "/prenatal/pre_delivery_hospitalizations_details/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.pre_delivery_hospitalizations_details.date)
        break;
        case "/prenatal/medical_referrals/gestational_age_weeks":
        case "/prenatal/medical_referrals/gestational_age_days":
            event_date = autorecalculate_get_event_date_combined(g_data.prenatal.medical_referrals.date)
        break;
        case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_weeks":
        case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/gestational_age_days":
            event_date = autorecalculate_get_event_date_separate(g_data.er_visit_and_hospital_medical_records[p_index].basic_admission_and_discharge_information.date_of_arrival)
        break;
        case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_weeks":
        case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/gestational_age_days":
            event_date = autorecalculate_get_event_date_separate(g_data.er_visit_and_hospital_medical_records[p_index].basic_admission_and_discharge_information.date_of_hospital_admission)
        break;
        case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_weeks":
        case "/er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/gestational_age_days":
            event_date = autorecalculate_get_event_date_separate(g_data.er_visit_and_hospital_medical_records[p_index].basic_admission_and_discharge_information.date_of_hospital_discharge)
        break;
        case "/other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_weeks":
        case "/other_medical_office_visits/visit/date_of_medical_office_visit/gestational_age_days":
            event_date = autorecalculate_get_event_date_separate(g_data.other_medical_office_visits[p_index].visit.date_of_medical_office_visit)
        break;
        case "/medical_transport/date_of_transport/gestational_age_weeks":
        case "/medical_transport/date_of_transport/gestational_age_days":
            event_date = autorecalculate_get_event_date_separate(g_data.medical_transport[p_index].date_of_transport)
        break;
        case "/medical_transport/transport_vital_signs/gestational_weeks":
        case "/medical_transport/transport_vital_signs/gestational_days":
            event_date = autorecalculate_get_event_date_combined(g_data.medical_transport[p_index].transport_vital_signs.date_and_time)
        break;
        case "/mental_health_profile/were_there_documented_mental_health_conditions/gestational_weeks":
        case "/mental_health_profile/were_there_documented_mental_health_conditions/gestational_days":
            event_date = autorecalculate_get_event_date_combined(g_data.mental_health_profile.were_there_documented_mental_health_conditions.date_of_screening);
        break;
        
    }

    if(p_is_edd)
    {
        ga = $global.calc_ga_edd(event_date, p_edd_date);
    }
    else if(p_is_lmp)
    {
        ga = $global.calc_ga_lmp(p_lmp_date, event_date);
    }

    return result;
}

function autorecalculate_get_event_date_separate(p_value)
{
    const event_year = parseInt(p_value.year);
    const event_month = parseInt(p_value.month);
    const event_day = parseInt(p_value.day);

    const result = new Date(event_year, event_month - 1, event_day);


    return result;
}

function autorecalculate_get_event_date_combined(p_value)
{
    const event_year = parseInt(p_value.year);
    const event_month = parseInt(p_value.month);
    const event_day = parseInt(p_value.day);

    const result = new Date(event_year, event_month - 1, event_day);


    return result;
}




/*
/death_certificate/demographics/occupation_business_industry
/death_certificate/demographics/primary_occupation

/birth_fetal_death_certificate_parent/demographic_of_Father/occupation_business_industry
/birth_fetal_death_certificate_parent/demographic_of_Father/primary_occupation

/birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry
/birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation

/social_and_environmental_profile/socio_economic_characteristics/occupation

*/

const niosh_autocalc_set = new Set();

/*

 Industry and Occupation Code 1-3

NIOSH Industry and Occupation Computerized Coding System (NIOCCS)
 - Mother’s Occupation Code #1 on SEP. 
 See (external link) 
 https://csams.cdc.gov/nioccs/HelpWebService.aspx and 
 https://csams.cdc.gov/nioccs/HelpCodingSchemes.aspx for value descriptions.
*/


//death_certificate/demographics/occupation_business_industry
//death_certificate/demographics/primary_occupation
niosh_autocalc_set.add("/death_certificate/demographics/dc_m_industry_code_1");
niosh_autocalc_set.add("/death_certificate/demographics/dc_m_industry_code_2");
niosh_autocalc_set.add("/death_certificate/demographics/dc_m_industry_code_3");
niosh_autocalc_set.add("/death_certificate/demographics/dc_m_occupation_code_1");
niosh_autocalc_set.add("/death_certificate/demographics/dc_m_occupation_code_2");
niosh_autocalc_set.add("/death_certificate/demographics/dc_m_occupation_code_3");

//birth_fetal_death_certificate_parent/demographic_of_Father/occupation_business_industry
//birth_fetal_death_certificate_parent/demographic_of_Father/primary_occupation

niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_father/bcdcp_f_industry_code_1");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_father/bcdcp_f_industry_code_2");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_father/bcdcp_f_industry_code_3");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_father/bcdcp_f_occupation_code_1");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_father/bcdcp_f_occupation_code_2");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_father/bcdcp_f_occupation_code_3");

//birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry
//birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation

niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/bcdcp_m_industry_code_1");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/bcdcp_m_industry_code_2");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/bcdcp_m_industry_code_3");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/bcdcp_m_occupation_code_1");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/bcdcp_m_occupation_code_2");
niosh_autocalc_set.add("/birth_fetal_death_certificate_parent/demographic_of_mother/bcdcp_m_occupation_code_3");

//social_and_environmental_profile/socio_economic_characteristics/occupation


niosh_autocalc_set.add("/social_and_environmental_profile/socio_economic_characteristics/sep_m_occupation_code_1");
niosh_autocalc_set.add("/social_and_environmental_profile/socio_economic_characteristics/sep_m_occupation_code_2");
niosh_autocalc_set.add("/social_and_environmental_profile/socio_economic_characteristics/sep_m_occupation_code_3");
niosh_autocalc_set.add("/social_and_environmental_profile/socio_economic_characteristics/sep_m_industry_code_1");
niosh_autocalc_set.add("/social_and_environmental_profile/socio_economic_characteristics/sep_m_industry_code_2");
niosh_autocalc_set.add("/social_and_environmental_profile/socio_economic_characteristics/sep_m_industry_code_3");


async function get_niosh_codes(p_occupation, p_industry)
{
    let result = { Industry:[], Occupation:[] };
    const builder = [ `${location.protocol}//${location.host}/api/niosh?` ];
    let has_occupation = false;
    let has_industry = false;

    if(p_occupation && p_occupation.length > 0)
    {
        has_occupation = true;
        builder.push(`o=${p_occupation}`);
    }

    if(p_industry && p_industry.length > 0)
    {
        has_industry = true;

        if(has_occupation)
        {
            builder.push(`i=${p_industry}`);
        }
        else
        {
            builder.push(`&i=${p_industry}`);
        }
    }

    if(has_occupation || has_industry)
    {
        const niosh_url = builder.join("");

        try
        {
            result = await $.ajax
            ({
                url: niosh_url,
            });
        }
        catch(e)
        {
            // do nothing for now
        }
    }
    //{"Industry": [{"Code": "611110","Title": "Elementary and Secondary Schools","Probability": "9.999934E-001"},{"Code": "611310","Title": "Colleges, Universities, and Professional Schools","Probability": "2.598214E-006"},{"Code": "009990","Title": "Insufficient information","Probability": "2.312557E-006"}],"Occupation": [{"Code": "00-9900","Title": "Insufficient Information","Probability": "9.999897E-001"},{"Code": "11-9032","Title": "Education Administrators, Elementary and Secondary School","Probability": "6.550550E-006"},{"Code": "53-3022","Title": "Bus Drivers, School or Special Client","Probability": "4.932875E-007"}],"Scheme": "NAICS 2012 and SOC 2010"}
    return result;

}




const autocalc_map = new Map([
    [ "/birth_fetal_death_certificate_parent/maternal_biometrics/height_feet", arc_prepregnancy_bmi],
    [ "/birth_fetal_death_certificate_parent/maternal_biometrics/height_inches", arc_prepregnancy_bmi],
    [ "/birth_fetal_death_certificate_parent/maternal_biometrics/pre_pregnancy_weight", arc_prepregnancy_bmi],

    [ "/autopsy_report.biometrics/mother/height/feet", arc_autopsy_bmi ],
    [ "/autopsy_report.biometrics/mother/height/inches", arc_autopsy_bmi ],
    [ "/autopsy_report.biometrics/mother/weight", arc_autopsy_bmi ],

    [ "/prenatal/current_pregnancy/height/feet", arc_prenatal_bmi ],
    [ "/prenatal/current_pregnancy/height/inches", arc_prenatal_bmi ],
    [ "/prenatal/current_pregnancy/pre_pregnancy_weight", arc_prenatal_bmi ],
    
    [ "/er_visit_and_hospital_medical_records/maternal_biometrics/height/feet", arc_er_hosp_bmi ],
    [ "/er_visit_and_hospital_medical_records/maternal_biometrics/height/inches", arc_er_hosp_bmi ],
    [ "/er_visit_and_hospital_medical_records/maternal_biometrics/admission_weight", arc_er_hosp_bmi ],
    
]
);


//$calc_bmi(p_height, p_weight) 

//CALCULATE PRE-PREGNANCY BMI ON BC
/*
path=birth_fetal_death_certificate_parent/maternal_biometrics/bmi
event=onfocus

birth_fetal_death_certificate_parent/maternal_biometrics/bmi
birth_fetal_death_certificate_parent/maternal_biometrics/height_feet
birth_fetal_death_certificate_parent/maternal_biometrics/height_inches
birth_fetal_death_certificate_parent/maternal_biometrics/pre_pregnancy_weight
*/
function arc_prepregnancy_bmi() 
{
    var bmi = null;
    var height_feet = parseFloat(g_data.birth_fetal_death_certificate_parent.maternal_biometrics.height_feet);
    var height_inches = parseFloat(g_data.birth_fetal_death_certificate_parent.maternal_biometrics.height_inches);
    var weight = parseFloat(g_data.birth_fetal_death_certificate_parent.maternal_biometrics.pre_pregnancy_weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) 
    {
        var bmi = $global.calc_bmi(height, weight);
        g_data.birth_fetal_death_certificate_parent.maternal_biometrics.bmi = bmi;
        
    }
}
//CALCULATE BMI FOR AUTOPSY
/*
path=autopsy_report/biometrics/mother/bmi
event=onfocus
*/
function arc_autopsy_bmi() 
{
    var bmi = null;
    var height_feet = parseFloat(g_data.autopsy_report.biometrics.mother.height.feet);
    var height_inches = parseFloat(g_data.autopsy_report.biometrics.mother.height.inches);
    var weight = parseFloat(g_data.autopsy_report.biometrics.mother.weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) 
    {
        var bmi = $global.calc_bmi(height, weight);
        g_data.autopsy_report.biometrics.mother.bmi = bmi;
    }
}
//CALCULATE BMI FOR PRENATAL CARE RECORD
/*
path=prenatal/current_pregnancy/bmi
event=onfocus

prenatal/current_pregnancy/height/feet
prenatal/current_pregnancy/height/inches
prenatal/current_pregnancy/pre_pregnancy_weight
arc_prenatal_bmi
*/
function arc_prenatal_bmi() 
{
    var bmi = null;
    var height_feet = parseFloat(g_data.prenatal.current_pregnancy.height.feet);
    var height_inches = parseFloat(g_data.prenatal.current_pregnancy.height.inches);
    var weight = parseFloat(g_data.prenatal.current_pregnancy.pre_pregnancy_weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) 
    {
        var bmi = $global.calc_bmi(height, weight);
        g_data.prenatal.current_pregnancy.bmi = bmi;
    }
}
//CALCULATE BMI FOR ER VISIT OR HOSPITALIZATION MEDICAL RECORD
/*
path=er_visit_and_hospital_medical_records/maternal_biometrics/height/bmi
event=onfocus

er_visit_and_hospital_medical_records/maternal_biometrics
/er_visit_and_hospital_medical_records/maternal_biometrics/height/feet
/er_visit_and_hospital_medical_records/maternal_biometrics/height/inches
/er_visit_and_hospital_medical_records/maternal_biometrics/admission_weight

arc_er_hosp_bmi
g_data.er_visit_and_hospital_medical_records[p_form_index].maternal_biometrics

*/
function arc_er_hosp_bmi(p_form_index) 
{
    var bmi = null;
    var height_feet = parseFloat(g_data.er_visit_and_hospital_medical_records[p_form_index].maternal_biometrics.height.feet);
    var height_inches = parseFloat(g_data.er_visit_and_hospital_medical_records[p_form_index].maternal_biometrics.height.inches);

    var weight = parseFloat(g_data.er_visit_and_hospital_medical_records[p_form_index].maternal_biometrics.admission_weight);
    var height = height_feet * 12 + height_inches;
    if (height > 24 && height < 108 && weight > 50 && weight < 800) 
    {
        var bmi = $global.calc_bmi(height, weight);
        g_data.er_visit_and_hospital_medical_records[p_form_index].maternal_biometrics.height.bmi = bmi;

    }
}


//CALCULATE WEIGHT GAIN DURING PREGNANCY ON BC
/*
path=birth_fetal_death_certificate_parent/maternal_biometrics/weight_gain
event=onfocus
*/
function weight_gain(p_control) 
{
    var weight_del = parseFloat(this.weight_at_delivery);
    var weight_pp = parseFloat(this.pre_pregnancy_weight);
    if (weight_del > 50 && weight_del < 800 && weight_pp > 50 && weight_pp < 800) 
    {
        var gain = weight_del - weight_pp;
        this.weight_gain = gain;
        p_control.value = this.weight_gain;
    }
}
//CALCULATE WEIGHT GAIN DURING PREGNANCY ) ON PC
/*
path=prenatal/current_pregnancy/weight_gain
event=onfocus
*/
function weight_gain(p_control) {
    var weight_del = parseFloat(this.weight_at_last_visit);
    var weight_pp = parseFloat(this.pre_pregnancy_weight);
    if (weight_del > 50 && weight_del < 800 && weight_pp > 50 && weight_pp < 800) 
    {
        var gain = weight_del - weight_pp;
        this.weight_gain = gain;
        p_control.value = this.weight_gain;
    }
}
//CALCULATE INTER-BIRTH INTERVAL IN MONTHS ON BC
/*
path=birth_fetal_death_certificate_parent/pregnancy_history/live_birth_interval
event=onfocus
*/
function birth_interval(p_control) 
{
    var interval = null;
    var start_year = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.year);
    var start_month = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.month);
    var start_day = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.day);
    var event_year = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var event_month = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var event_day = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(event_year, event_month, event_day) == true) 
    {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var event_date = new Date(event_year, event_month - 1, event_day);
        interval = Math.trunc($global.calc_days(start_date, event_date) / 30.4375);
        this.live_birth_interval = interval;
        p_control.value = this.live_birth_interval;
    }
}
//CALCULATE INTER-PREGNANCY INTERVAL IN MONTHS ON BC
/*
path=birth_fetal_death_certificate_parent/pregnancy_history/pregnancy_interval
event=onfocus
*/
function pregnancy_interval(p_control) 
{
    var interval = null;
    var fd_year = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.year);
    var fd_month = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.month);
    var fd_day = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.day);
    var lb_year = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.year);
    var lb_month = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.month);
    var lb_day = parseFloat(g_data.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.day);
    var event_year = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var event_month = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var event_day = parseFloat(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    if ($global.isValidDate(fd_year, fd_month, fd_day) == true && $global.isValidDate(event_year, event_month, event_day) == true) 
    {
        var fd_date = new Date(fd_year, fd_month - 1, fd_day);
        var event_date = new Date(event_year, event_month - 1, event_day);
        interval = Math.trunc($global.calc_days(fd_date, event_date) / 30.4375);
        this.pregnancy_interval = interval;
        p_control.value = this.pregnancy_interval;
    } 
    else if ($global.isValidDate(lb_year, lb_month, lb_day) == true && $global.isValidDate(event_year, event_month, event_day) == true) 
    {
        var lb_date = new Date(lb_year, lb_month - 1, lb_day);
        var event_date = new Date(event_year, event_month - 1, event_day);
        interval = Math.trunc($global.calc_days(lb_date, end_date) / 30.4375);
        this.pregnancy_interval = interval;
        p_control.value = this.pregnancy_interval;
    }
}


//CALCULATE DAYS BETWEEN BIRTH OF CHILD AND DEATH OF MOM
/*
path=birth_fetal_death_certificate_parent/cmd_length_between_child_birth_and_death_of_mother
event=onclick
*/
function birth_2_death(p_control) 
{
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(g_data.home_record.date_of_death.year);
    var end_month = parseInt(g_data.home_record.date_of_death.month);
    var end_day = parseInt(g_data.home_record.date_of_death.day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true) 
    {
        var start_date = new Date(start_year, start_month - 1, start_day);
        var end_date = new Date(end_year, end_month - 1, end_day);
        var days = $global.calc_days(start_date, end_date);
        this.length_between_child_birth_and_death_of_mother = days;
        $mmria.save_current_record();
        $mmria.set_control_value('birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother', this.length_between_child_birth_and_death_of_mother);
    }
}

//CALCULATE POST-PARTUM DAYS ON ER-HOSPITAL FORM AT ARRIVAL
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_arrival/days_postpartum
event=onfocus
*/
function eha_days_postpartum(p_control) 
{
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) 
    {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE POST-PARTUM DAYS ON ER-HOSPITAL FORM AT ADMISSION
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_admission/days_postpartum
event=onfocus
*/
function eha_days_postpartum(p_control) 
{
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) 
    {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE POST-PARTUM DAYS ON ER-HOSPITAL FORM AT DISCHARGE
/*
path=er_visit_and_hospital_medical_records/basic_admission_and_discharge_information/date_of_hospital_discharge/days_postpartum
event=onfocus
*/
function ehd_days_postpartum(p_control) 
{
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) 
    {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE DAYS POST-PARTUM ON OFFICE VISIT FORM
/*
path=other_medical_office_visits/visit/date_of_medical_office_visit/days_postpartum
event=onfocus
*/
function ehd_days_postpartum(p_control) 
{
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) 
    {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE DAYS POST-PARTUM IN MEDICAL TRANSPORT FORM 
/*
path=medical_transport/date_of_transport/days_postpartum
event=onfocus
*/
function mt_days_postpartum(p_control) 
{
    var days = null;
    var end_year = parseInt(this.year);
    var end_month = parseInt(this.month);
    var end_day = parseInt(this.day);
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    var end_date = new Date(end_year, end_month - 1, end_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && $global.isValidDate(end_year, end_month, end_day) == true && start_date <= end_date) 
    {
        days = $global.calc_days(start_date, end_date);
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}
//CALCULATE DAYS POST-PARTUM IN MENTAL HEALTH FORM IN MENTAL HEALTH CONDITIONS GRID
/*
path=mental_health_profile/were_there_documented_mental_health_conditions/days_postpartum
event=onfocus
*/
function mh_days_postpartum(p_control) 
{
    var days = null;
    var start_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
    var start_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
    var start_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
    var start_date = new Date(start_year, start_month - 1, start_day);
    if ($global.isValidDate(start_year, start_month, start_day) == true && this.date_of_screening != null && this.date_of_screening != '') 
    {
        if (this.date instanceof Date && start_date <= this.date_of_screening) 
        {
            days = $global.calc_days(start_date, this.date_of_screening);
        } 
        else 
        {
            var end_date = new Date(this.date_of_screening);
            if (start_date <= end_date) 
            {
                days = $global.calc_days(start_date, end_date);
            }
        }
        this.days_postpartum = days;
        p_control.value = this.days_postpartum;
    }
}

//CALCULATE TIME BETWEEN ONSET OF LABOR AND ARRIVAL AT HOSPITAL
/*
path=er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/cmd_duration_of_labor_prior_to_arrival
event=onclick
*/
function duration_of_labor(p_control)
{
    var hours = null;
    var current_dol_index = $global.get_current_multiform_index();
    var onset_year = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.year);
    var onset_month = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.month);
    var onset_day = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.day);
	
	var onset_time = null;
    if (g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.time_of_onset_of_labor instanceof Date) 
	{
		onset_time = g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.time_of_onset_of_labor;
    }
	else
	{
        onset_time = new Date('January 1, 1900 ' + g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.time_of_onset_of_labor);
    }
	
    var arrival_year = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.year);
    var arrival_month = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.month);
    var arrival_day = parseInt(g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.day);
	
	var arrival_time = null;
    if (g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival instanceof Date) 
	{
        arrival_time = g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival;
    } 
	else 
	{
        arrival_time = new Date('January 1, 1900 ' + g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival);
    }
    if ($global.isValidDate(onset_year, onset_month, onset_day) == true && $global.isValidDate(arrival_year, arrival_month, arrival_day) == true && (g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.time_of_onset_of_labor != '' || g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.time_of_onset_of_labor != null) && (g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival != '' || g_data.er_visit_and_hospital_medical_records[current_dol_index].basic_admission_and_discharge_information.date_of_arrival.time_of_arrival_time != null)) {
        var onset_date = new Date(onset_year, onset_month - 1, onset_day, onset_time.getHours(), onset_time.getMinutes());
        var arrival_date = new Date(arrival_year, arrival_month - 1, arrival_day, arrival_time.getHours(), arrival_time.getMinutes());
        var hours = Math.round((arrival_date - onset_date) / 3600000 * 100) / 100;
        if (hours > 1) 
        {
            g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.duration_of_labor_prior_to_arrival = hours;
            $mmria.save_current_record();
            $mmria.set_control_value('er_visit_and_hospital_medical_records/onset_of_labor/date_of_onset_of_labor/duration_of_labor_prior_to_arrival', g_data.er_visit_and_hospital_medical_records[current_dol_index].onset_of_labor.date_of_onset_of_labor.duration_of_labor_prior_to_arrival);
        }
    }
}



// OMB RACE RECODE FOR CASE ON DC FORM
/*
path=death_certificate/race/race
event=onclick
*/
function omb_race_recode_dc(p_control) 
{
    var race_recode = null;
    var race = this.race;
    race_recode = $global.calculate_omb_recode(race);
    this.omb_race_recode = race_recode;
    $mmria.save_current_record();
    $mmria.set_control_value('death_certificate/race/omb_race_recode', this.omb_race_recode);
}


// OMB RACE RECODE FOR MOM ON BC FORM
/*
path=birth_fetal_death_certificate_parent/race/race_of_mother
event=onclick
*/
function omb_mrace_recode_bc(p_control) 
{
    var race_recode = null;
    var race = this.race_of_mother;
    race_recode = $global.calculate_omb_recode(race);
    this.omb_race_recode = race_recode;
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/race/omb_race_recode', this.omb_race_recode);
}
// OMB RACE RECODE FOR DAD ON BC FORM
/*
path=birth_fetal_death_certificate_parent/demographic_of_father/race/race_of_father
event=onclick
*/
function omb_frace_recode_bc(p_control) 
{
    var race_recode = null;
    var race = this.race_of_father;
    race_recode = $global.calculate_omb_recode(race);
    this.omb_race_recode = race_recode;
    $mmria.save_current_record();
    $mmria.set_control_value('birth_fetal_death_certificate_parent/demographic_of_father/race/omb_race_recode', this.omb_race_recode);
}



/*
path=medical_transport/destination_information/address/calculated_distance
event=onclick
*/
function medical_transport_destination_information_address_calculated_distance(p_control) 
{
    let dist = null;
    var current_mt_index = $global.get_current_multiform_index();
    let res_lat = parseFloat(g_data.medical_transport[current_mt_index].origin_information.address.latitude);
    let res_lon = parseFloat(g_data.medical_transport[current_mt_index].origin_information.address.longitude);
    let hos_lat = parseFloat(this.latitude);
    let hos_lon = parseFloat(this.longitude);
    if (res_lat >= -90 && res_lat <= 90 && res_lon >= -180 && res_lon <= 180 && hos_lat >= -90 && hos_lat <= 90 && hos_lon >= -180 && hos_lon <= 180) 
    {
        dist = $global.calc_distance(res_lat, res_lon, hos_lat, hos_lon);
        this.estimated_distance = dist;
        $mmria.save_current_record();
        $mmria.set_control_value('medical_transport/destination_information/address/estimated_distance', this.estimated_distance);
    }
}



