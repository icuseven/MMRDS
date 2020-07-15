function datetime_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
	/*
			if(typeof(p_data) == "string")
			{
				p_data = new Date(p_data);
			}*/
			p_result.push("<div class='datetime' id='");
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

			page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
			p_post_html_render.push('$("#' + convert_object_path_to_jquery_id(p_object_path) + ' input").datetimepicker({');
				p_post_html_render.push(' format: "Y-MM-D H:mm:ss", ');
				p_post_html_render.push(' defaultDate: "' + p_data + '",');
				p_post_html_render.push(`
					icons: {
						time: "x24 fill-p cdc-icon-clock_01",
						date: "x24 fill-p cdc-icon-calendar_01",
						up: "x24 fill-p cdc-icon-chevron-circle-up",
            down: "x24 fill-p cdc-icon-chevron-circle-down",
            previous: 'x24 fill-p fill-p cdc-icon-chevron-circle-left-light',
            next: 'x24 fill-p cdc-icon-chevron-circle-right-light'
					}`);
			p_post_html_render.push('});');

			// p_result.push(`
			// 	<div class="form-inline datetime-control"
			// 		style="${ style_object && get_style_string(style_object.prompt.style)}">
			// 		<div class="form-group">
			// 			<input type="date" id="datetime-date" class="form-control input-small" value="2000-03-24">
			// 		</div>
			// 		<div class="form-group input-group bootstrap-timepicker timepicker">
			// 			<input type="text" id="datetime-time" class="form-control input-small" value="21:04:37">
			// 			<button class="input-group-addon time-icon-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg></button>
			// 		</div>
			// 	</div>
			// `);

			// p_post_html_render.push(`
			// 	$('#datetime-time').timepicker({
			// 		minuteStep: 1,
			// 		secondStep: 1,
			// 		showMeridian: false,
			// 		showSeconds: true,
			// 		icons: {
			// 			up: 'x24 fill-p cdc-icon-arrow-down',
			// 			down: 'x24 fill-p cdc-icon-arrow-down'
			// 		}
			// 	});
			// `);
			
			p_result.push("</div>");	
}
