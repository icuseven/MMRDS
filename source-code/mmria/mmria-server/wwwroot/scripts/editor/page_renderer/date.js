function date_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
/*
    if(g_validator_map[p_metadata_path])
    {
      if(g_validator_map[p_metadata_path](value))
      {
        var metadata = eval(p_metadata_path);
  
        if(metadata.type.toLowerCase() == "boolean")
        {
          eval(p_object_path + ' = ' + value);
        }
    }
*/
    
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
        }
        /*
        if(is_valid_date_or_datetime(p_data) || p_data.length === 0)
        {
            //validation passed
            // console.log('~~~~~ valid');
            is_valid = true;
        }
        else if (!is_valid_date_or_datetime(p_data))
        {
            //validation failed, show validation message
            // console.log('~~~~~ invalid');
            is_valid = false;
        }*/
        
        page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);

        let validation_top = get_style_string(style_object.control.style).split('top:').pop().split('px;')[0];
        let validation_height = get_style_string(style_object.control.style).split('height:').pop().split('px;')[0];
        let validation_fontsize_new = '12px';
        let validation_height_new = 'auto';
        let validation_top_new = parseInt(validation_top) + parseInt(validation_height) + 8;

        p_result.push(`<small class="validation-msg text-danger" style="${get_style_string(style_object.control.style)}; font-size: ${validation_fontsize_new}; height:${validation_height_new}; top:${validation_top_new}px">Invalid date</small>`);

        p_post_html_render.push(`
            //if validation passed
            if (${is_valid})
            {
                $('#${convert_object_path_to_jquery_id(p_object_path)} input').removeClass('is-invalid'); //remove css error class
                $('#${convert_object_path_to_jquery_id(p_object_path)} .validation-msg').hide(); //hide message
                
                //if grid item
                if ($('#${convert_object_path_to_jquery_id(p_object_path)} input')[0].hasAttribute('grid_index'))
                {
                    let grid_number = $('#${convert_object_path_to_jquery_id(p_object_path)} input').attr('grid_index');

                    //remove specific grid item error
                    $('.construct__header-alert ul').find('li[data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}"][data-grid="'+grid_number+'"]').remove();
                }
                else
                {
                    //remove specific error
                    $('.construct__header-alert ul').find('li[data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}"]').remove();
                }

                //if no error items
                if ($('.construct__header-alert ul').find('li').length < 1)
                {
                    $('.construct__header-alert ul').html(''); //clear the html
                    $('.construct__header-alert').hide(); //then hide alert box
                }
            }
            else
            {
                $("#${convert_object_path_to_jquery_id(p_object_path)} input").addClass('is-invalid'); //add css error class
                $("#${convert_object_path_to_jquery_id(p_object_path)} .validation-msg").show(); //show message

                //check if grid item
                if ($('#${convert_object_path_to_jquery_id(p_object_path)} input')[0].hasAttribute('grid_index'))
                {
                    let legend_label = $('#${convert_object_path_to_jquery_id(p_object_path)} input').closest('.grid-control').find('legend')[0].innerText.split(' - ')[0];
                    let grid_number = $('#${convert_object_path_to_jquery_id(p_object_path)} input').attr('grid_index');

                    //check if item error doesnt exist
                    if ($('.construct__header-alert ul').find('li[data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}"][data-grid="'+grid_number+'"]').length < 1)
                    {
                        $('.construct__header-alert ul').append('<li data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}" data-grid="'+grid_number+'"><strong>Invalid date ('+legend_label+': ${p_metadata.prompt}, item '+(parseInt(grid_number)+1)+'):</strong> Date must be a valid calendar date between 1900-2100</li>');
                    }
                }
                //if NOT grid item
                else
                {
                    $('.construct__header-alert ul').append('<li><strong>Invalid date (${p_metadata.prompt}):</strong> Date must be a valid calendar date between 1900-2100</li>')
                }

                $('.construct__header-alert').show(); //show alert box
            }
        `);
        
        /*
            START datetimepicker() init and options
            TODO: Comment out when going to test
                ~ 7/6/20: Removed datepicker plugin, using browser supported 'type="date"' attribute
        */
        // p_post_html_render.push('$("#' + convert_object_path_to_jquery_id(p_object_path) + ' input").datetimepicker({');
        // p_post_html_render.push(' format: "Y-MM-DD", ');
        // p_post_html_render.push(' defaultDate: "' + p_data + '",');
        // p_post_html_render.push(`
        //     icons: {
        //         time: "x24 fill-p cdc-icon-clock_01",
        //         date: "x24 fill-p cdc-icon-calendar_01",
        //         up: "x24 fill-p cdc-icon-chevron-circle-up",
        //         down: "x24 fill-p cdc-icon-chevron-circle-down",
        //         previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
        //         next: 'x24 fill-p cdc-icon-chevron-circle-right-light'
        //     }
        // `);
        // p_post_html_render.push('});');
        /* END datetimepicker() */

    p_result.push("</div>");
}
