function datetime_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
	/*
	if(typeof(p_data) == "string")
	{
		p_data = new Date(p_data);
	}*/
	p_result.push("<div class='datetime form-control-outer' id='");
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
		p_result.push("</label>");

		p_result.push(`
			<div class="row no-gutters datetime-control"
				 style="${style_object && get_style_string(style_object.control.style)}"
				 dpath="${p_object_path}"
				 ${p_ctx && p_ctx.form_index != null ? `form_index="${p_ctx.form_index && p_ctx.form_index}"` : ''}
				 ${p_ctx && p_ctx.grid_index != null ? `grid_index="${p_ctx.grid_index && p_ctx.grid_index}"` : ''}
			>
		`);

			let disabled_html = " disabled = 'disabled' ";
			if(g_data_is_checked_out)
			{
				disabled_html = " ";
			}
			// console.log(g_data_is_checked_out);

			/*
        "is_valid_date_or_datetime": valid_date_or_datetime,
		"entered_date_or_datetime_value":entered_date_or_datetime_value
		*/

			let is_valid = true;
			if(p_ctx && p_ctx.hasOwnProperty("is_valid_date_or_datetime"))
			{
				is_valid = p_ctx.is_valid_date_or_datetime;
			}

			p_result.push(
				`<input class="datetime-date form-control w-50 h-100"
					    dpath="${p_object_path}"
					    ${p_ctx && p_ctx.form_index != null ? `form_index="${p_ctx.form_index && p_ctx.form_index}"` : ''}
					    ${p_ctx && p_ctx.grid_index != null ? `grid_index="${p_ctx.grid_index && p_ctx.grid_index}"` : ''}
					    type="date" name="${p_metadata.name}"
					    data-value="${p_data}"
					    value="${p_data.split(' ')[0]}"
						${disabled_html}`
			);
				if
				(
					!(
						p_metadata.mirror_reference &&
						p_metadata.mirror_reference.length > 0
					)
				)
				{
					let f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
					if(path_to_onfocus_map[p_metadata_path])
					{
						create_datetime_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
					}

					f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
					if(path_to_onchange_map[p_metadata_path])
					{
						create_datetime_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
					}
					
					f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
					if(path_to_onclick_map[p_metadata_path])
					{
						create_datetime_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
					}

					create_onblur_datetime_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
				}
				p_result.push(` min="1900-01-01" max="2100-12-31">`);
			p_result.push(
				`<input class="datetime-time form-control w-50 h-100 input-group bootstrap-timepicker timepicker"
				   dpath="${p_object_path}"
				   ${p_ctx && p_ctx.form_index != null ? `form_index="${p_ctx.form_index && p_ctx.form_index}"` : ''}
				   ${p_ctx && p_ctx.grid_index != null ? `grid_index="${p_ctx.grid_index && p_ctx.grid_index}"` : ''}
				   type="text" name="${p_metadata.name}"
				   data-value="${p_data}"
				   value="${p_data.split(' ')[1]}"
				   ${disabled_html}`
			);
				if
				(
					!(
						p_metadata.mirror_reference &&
						p_metadata.mirror_reference.length > 0
					)
				)
				{
					let f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
					if(path_to_onfocus_map[p_metadata_path])
					{
						create_datetime_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
					}

					f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
					if(path_to_onchange_map[p_metadata_path])
					{
						create_datetime_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
					}
					
					f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
					if(path_to_onclick_map[p_metadata_path])
					{
						create_datetime_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
					}

					create_onblur_datetime_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
				}
				p_result.push(`>`);

				//TODO: Future route to implement a fake time control for easier 'hh:mm:ss' placeholder
				//at the moment our plugin is not playing nicely with the time control
				// p_result.push(
				// 	`<input class="datetime-fauxtime form-control w-50 h-100 input-group bootstrap-timepicker timepicker"
				// 					placeholder="hh:mm:ss"
				// 					${disabled_html}
				// 					aria-hidden="true"
				// 					focusable="false">`
				// );

				let validation_top = get_style_string(style_object.control.style).split('top:').pop().split('px;')[0];
				let validation_height = get_style_string(style_object.control.style).split('height:').pop().split('px;')[0];
				let validation_height_new = 'auto';
				let validation_top_new = 'auto';
				let validation_bottom_new = '-24px';
				let validation_left_new = 'auto';

				p_result.push(`<small class="validation-msg text-danger" style="${get_style_string(style_object.control.style)}; height:${validation_height_new}; top: ${validation_top_new}; bottom: ${validation_bottom_new}; left: ${validation_left_new};">Invalid date and time</small>`);

				p_post_html_render.push(`
					//if validation passed
					if (${is_valid})
					{
						$('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date').removeClass('is-invalid'); //remove css error class
						$('#${convert_object_path_to_jquery_id(p_object_path)} .validation-msg').hide(); //hide message
						
						//if grid item
						if ($('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date')[0].hasAttribute('grid_index'))
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
						$("#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date").addClass('is-invalid'); //add css error class
						$("#${convert_object_path_to_jquery_id(p_object_path)} .validation-msg").show(); //show message
		
						//check if grid item
						if ($('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date')[0].hasAttribute('grid_index'))
						{
							let legend_label = $('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date').closest('.grid-control').find('legend')[0].innerText.split(' - ')[0];
							let grid_number = $('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date').attr('grid_index');
		
							//check if item error doesnt exist
							if ($('.construct__header-alert ul').find('li[data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}"][data-grid="'+grid_number+'"]').length < 1)
							{
								$('.construct__header-alert ul').append('<li data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}" data-grid="'+grid_number+'"><strong>'+legend_label+': ${p_metadata.prompt}, item '+(parseInt(grid_number)+1)+':</strong> Date must be a valid calendar date between 1900-2100 & Time must be valid (in 24-hour format)</li>');
							}
						}
						//if NOT grid item
						else
						{
							//check if item error doesnt exist
							if ($('.construct__header-alert ul').find('li[data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}"]').length < 1)
							{
								$('.construct__header-alert ul').append('<li data-path="${p_dictionary_path.substring(1, p_dictionary_path.length)}"><strong>${p_metadata.prompt}:</strong> Date must be a valid calendar date between 1900-2100 & Time must be valid (in 24-hour format)</li>')
							}
						}
		
						$('.construct__header-alert').show(); //show alert box
					}
				`);
		p_result.push("</div>");

		//Initialize the custom 'bootstrap timepicker'
		p_post_html_render.push(`
			$('#${convert_object_path_to_jquery_id(p_object_path)} .datetime-time').timepicker({
				defaultTime: false,
				minuteStep: 1,
				secondStep: 1,
				showMeridian: false,
				showSeconds: true,
				template: false,
				icons: {
					up: 'x24 fill-p cdc-icon-arrow-down',
					down: 'x24 fill-p cdc-icon-arrow-down'
				}
			});
		`);

		//helper fn to toggle disabled attr
		p_post_html_render.push(`
			function toggle_disabled(el, tar) {				
				if (isNullOrUndefined(el.val())) {
					tar.attr('disabled', true);
				}
				else
				{
					tar.attr('disabled', false);
				}
			}
		`);

		//On load, IF case has been checked out
		//we want to toggle disabled attr on time incase date is valid/invalid
		if (g_data_is_checked_out)
		{
			p_post_html_render.push(`
				toggle_disabled($('#${convert_object_path_to_jquery_id(p_object_path)} .datetime-date'), $('#${convert_object_path_to_jquery_id(p_object_path)} .datetime-time'));
			`);
		}

		// //Toggle disabled attr on time when changing date and value is valid/invalid
		// p_post_html_render.push(`
		// 	$('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-date').on('change', () => {
		// 		let date_value = $('#${convert_object_path_to_jquery_id(p_object_path)} .datetime-date').val();
				
		// 		//if date_value exists
		// 		if (!isNullOrUndefined(date_value))
		// 		{
		// 			toggle_disabled($('#${convert_object_path_to_jquery_id(p_object_path)} .datetime-date'), $('#${convert_object_path_to_jquery_id(p_object_path)} input.datetime-time'));
		// 		}
		// 	});
		// `);

		/*
			Tou Lee (7/17/2020): Commenting out due to new functionality but leaving for legacy purposes
		*/
		//Rendering old datetime control
		// page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
		//Init datetimepicker plugin on old datetimecontrol
		// p_post_html_render.push('$("#' + convert_object_path_to_jquery_id(p_object_path) + ' input").datetimepicker({');
		// 	p_post_html_render.push(' format: "Y-MM-D H:mm:ss", ');
		// 	p_post_html_render.push(' defaultDate: "' + p_data + '",');
		// 	p_post_html_render.push(`
		// 		icons: {
		// 			time: "x24 fill-p cdc-icon-clock_01",
		// 			date: "x24 fill-p cdc-icon-calendar_01",
		// 			up: "x24 fill-p cdc-icon-chevron-circle-up",
		// 			down: "x24 fill-p cdc-icon-chevron-circle-down",
		// 			previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
		// 			next: 'x24 fill-p cdc-icon-chevron-circle-right-light'
		// 		}`);
		// p_post_html_render.push('});');
	
	p_result.push("</div>");
}


//Custom function to create onblur event ONLY on datetime control
function create_onblur_datetime_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
{
	/*
		var path_to_int_map = [];
		var path_to_onblur_map = [];
		var path_to_onclick_map = [];
		var path_to_onfocus_map = [];
		var path_to_onchange_map = [];
		var path_to_source_validation = [];
		var path_to_derived_validation = [];
		var path_to_validation_description = [];
	*/
	var t_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ob";

	if(path_to_onblur_map[p_metadata_path])
	{
		//var source_code = escodegen.generate(p_metadata.onfocus);
		var code_array = [];
		
		code_array.push("(function x" + path_to_int_map[p_metadata_path].toString(16) + "_sob(p_control){\n");
		code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + "_ob");
		code_array.push(".call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", p_control");

		code_array.push(");\n");
		
		code_array.push("g_set_data_object_from_path(\"");
		code_array.push(p_object_path);
		code_array.push("\",\"");
		code_array.push(p_metadata_path);
		code_array.push("\",\"");
		code_array.push(p_dictionary_path);
		code_array.push("\",p_control.value, null");
		if(p_ctx!=null)
		{
			if(p_ctx.form_index != null)
			{
				code_array.push(", ");
				code_array.push(p_ctx.form_index);
			}
	
			if(p_ctx.grid_index != null)
			{
				code_array.push(", ");
				code_array.push(p_ctx.grid_index);
			}
		}
		code_array.push(");\n}).call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", event.target);");

		p_result.push(" onblur='");
		p_result.push(code_array.join('').replace(/'/g,"\""));
		p_result.push("'");
	}
	else //if(p_metadata.type!="number")
	{
		p_result.push(" onblur='g_set_data_object_from_path(\"");
		p_result.push(p_object_path);
		p_result.push("\",\"");
		p_result.push(p_metadata_path);
		p_result.push("\",\"");
		p_result.push(p_dictionary_path);
		if(p_metadata.type=="boolean")
		{
			p_result.push("\",this.checked");
		}
		else
		{
			p_result.push("\",this.value");
		}

		if(p_ctx!=null)
		{
			if(p_ctx.form_index != null)
			{
				p_result.push(", ");
				p_result.push(p_ctx.form_index);
			}
			else
			{
				p_result.push(", null");
			}
	
			if(p_ctx.grid_index != null)
			{
				p_result.push(", ");
				p_result.push(p_ctx.grid_index);
			}
			else
			{
				p_result.push(", null");
			}
		}
		p_result.push(", this.previousElementSibling");
		p_result.push(", this.nextElementSibling");
		p_result.push(")'");
	}
}



//Custom function to create events ONLY on datetime control
function create_datetime_event(p_result, p_event_name, p_code_json, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
{
	var post_fix = null;

	/*
		var path_to_int_map = [];
		var path_to_onblur_map = [];
		var path_to_onclick_map = [];
		var path_to_onfocus_map = [];
		var path_to_onchange_map = [];
		var path_to_source_validation = [];
		var path_to_derived_validation = [];
		var path_to_validation_description = [];
	*/

	switch(p_event_name)
	{
		case "onfocus":
			post_fix = "_of";
			break;
		case "onchange":
			post_fix = "_och";
			break;
		case "onclick":
			post_fix = "_ocl";
			break;
		default:
			console.log("page_render_create_event - missing case: " + p_event_name);
			break;
	}

	//var source_code = escodegen.generate(p_metadata.onfocus);
	var code_array = [];
	
	code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + post_fix);
	code_array.push(".call(");
	code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
	code_array.push(", this")
	if(p_ctx!=null)
	{
		if(p_ctx.form_index != null)
		{
			code_array.push(", ");
			code_array.push(p_ctx.form_index);
		}

		if(p_ctx.grid_index != null)
		{
			code_array.push(", ");
			code_array.push(p_ctx.grid_index);
		}
	}
	
	code_array.push(");")

	p_result.push(" ");
	p_result.push(p_event_name);
	p_result.push("='");
	p_result.push(code_array.join('').replace(/'/g,"\""));
	p_result.push("'");
}
