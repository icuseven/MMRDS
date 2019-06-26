function datetime_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
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

			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				p_result.push(p_metadata.prompt);
			}
			/*
			p_result.push("</span><br/> <input  class='datetime' type='");
			//p_result.push(p_metap_datadata.type.toLowerCase());
			p_result.push("text");
			p_result.push("'  name='");
			p_result.push(p_metadata.name);
			p_result.push("' value='");
			p_result.push(p_data.toISOString().split("T")[0]);
			p_result.push("'  onblur='g_set_data_object_from_path(\"");
			p_result.push(p_object_path);
			p_result.push("\",\"");
			p_result.push(p_metadata_path);
			p_result.push("\",this.value)'  /></div>");
			https://eonasdan.github.io/bootstrap-datetimepicker/

			http://xdsoft.net/jqplugins/datetimepicker/


			*/
			p_result.push("</label> ");
			p_result.push("<div style='position:relative'>");
			page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);

			
			p_post_html_render.push('$("#' + convert_object_path_to_jquery_id(p_object_path) + ' input.datetime").datetimepicker({');
			//p_post_html_render.push('	format:"YYYY-MM-DD hh:mm:ss", value: "');
			//p_post_html_render.push('	utc: true, defaultDate: "');
			p_post_html_render.push(' format:"Y-MM-D H:mm:ss",  defaultDate: "');
			//p_post_html_render.push(' defaultDate: "');
			p_post_html_render.push(p_data);
			p_post_html_render.push('"}');
			//p_post_html_render.push('}');
			p_post_html_render.push(');');

			p_result.push("</div>");	
			
			p_result.push("</div>");	
}