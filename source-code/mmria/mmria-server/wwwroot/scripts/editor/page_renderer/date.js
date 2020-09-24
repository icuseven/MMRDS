function date_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{

    p_result.push("<div id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    
    p_result.push("' ");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

    p_result.push(">");
        p_result.push("<label ");
        if(p_metadata.description && p_metadata.description.length > 0)
        {
            p_result.push("rel='tooltip'  data-original-title='");
            p_result.push(p_metadata.description.replace(/'/g, "\\'"));
            p_result.push("'");
        }

        var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
        
        if(style_object)
        {
            p_result.push(" style='");
            p_result.push(get_style_string(style_object.prompt.style));
            p_result.push("'");
        }
        p_result.push(">");

        p_result.push(p_metadata.prompt);

        p_result.push("</label> ");
        
        let is_valid = true;



        if(p_ctx && p_ctx.hasOwnProperty("is_valid_date_or_datetime"))
        {
          is_valid = p_ctx.is_valid_date_or_datetime;
          g_ui.broken_rules.push(`$('#validation_summary_list').append('<li><strong>${p_metadata.prompt} ${p_ctx.entered_date_or_datetime_value}:</strong> Date must be a valid calendar date between 1900-2100 <button class="btn anti-btn ml-1"><span class="sr-only">Remove Item</span><span class="x20 cdc-icon-close"></span></button></li>');`)
        }
        else if(p_data != null && p_data != "")
        {
            is_valid = is_valid_date(p_data);
        }

        let input_value = p_data;

        if
        (
            p_data!=null && 
            p_data!="" &&
            p_data.indexOf("-") > -1
        )
        {
            let date_part_array = p_data.split("");
            if(date_part_array.length > 2)
            {
                input_value = date_part_array[1] + "/" + date_part_array[0] +  "/" + date_part_array[2];
            }
        }
                
        page_render_create_input(p_result, p_metadata, input_value, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
        p_result.push(
          `<div class="input-group-addon">
            <span class="glyphicon glyphicon-th"></span>
          </div>`
        );

        p_post_html_render.push(`
          $('#g_data_home_record_case_status_case_locked_date input').hide();

          if (${
            g_data.home_record.case_status.case_locked_date !== null &&
            g_data.home_record.case_status.case_locked_date.length > 0 &&
            g_data.home_record.case_status.case_locked_date !== ''
            })
          {
            $('#g_data_home_record_case_status_case_locked_date input').show();
          }
        `);

        let validation_top = get_style_string(style_object.control.style).split('top:').pop().split('px;')[0];
        let validation_height = get_style_string(style_object.control.style).split('height:').pop().split('px;')[0];
        let validation_height_new = 'auto';
        let validation_top_new = parseInt(validation_top) + parseInt(validation_height) + 4;

        if(! is_valid)
        {
            p_result.push(`<small class="validation-msg text-danger" style="${get_style_string(style_object.control.style)}; height:${validation_height_new}; top:${validation_top_new}px">Invalid date</small>`);
        }
        
        p_post_html_render.push(`
          $("#${convert_object_path_to_jquery_id(p_object_path)} input").datetimepicker({
            format: 'MM/DD/YYYY',
            keepInvalid: true,
            useCurrent: false,
            icons: {
              time: "x24 cdc-icon-clock_01",
              date: "x24 cdc-icon-calendar_01",
              up: "x24 cdc-icon-chevron-double-right",
              down: "x24 cdc-icon-chevron-double-right",
              previous: 'x16 cdc-icon-chevron-double-right',
              next: 'x16 cdc-icon-chevron-double-right'
            }
          })
        `);

        p_post_html_render.push(`document.getElementById("${convert_object_path_to_jquery_id(p_object_path)}").onkeypress = date_field_key_press;`);


    p_result.push("</div>");
}

/*
document.getElementById("foo").onkeypress = function(e) {
    var chr = String.fromCharCode(e.which);
    if ("12345NOABC".indexOf(chr) < 0)
        return false;
};

*/

function date_field_key_press(e) 
{
    var chr = String.fromCharCode(e.which);
    if ("0123456789/".indexOf(chr) < 0)
    {
        return false;
    }
}