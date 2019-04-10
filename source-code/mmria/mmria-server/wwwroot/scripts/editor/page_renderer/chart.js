function chart_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div  class='chart' id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    
    p_result.push("' ");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

    p_result.push(" style='");
    if(p_metadata.grid_row && p_metadata.grid_row!= "")
    {
        p_result.push("grid-row:");
        p_result.push(p_metadata.grid_row);
        p_result.push(";");
    }


    if(p_metadata.grid_column && p_metadata.grid_column!= "")
    {
        p_result.push("grid-column:");
        p_result.push(p_metadata.grid_column);
        p_result.push(";");
    }

    if(p_metadata.grid_area && p_metadata.grid_area!= "")
    {
        p_result.push("grid-area:");
        p_result.push(p_metadata.grid_area);
        p_result.push(";");
    }
    p_result.push("' ");

    p_result.push(">");
    p_result.push("<span ");
    if(p_metadata.description && p_metadata.description.length > 0)
    {
        p_result.push("rel='tooltip'  data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "\\'"));
        p_result.push("'>");
    }
    else
    {
        p_result.push(">");
    } 
    
    if(p_is_grid_context && p_is_grid_context == true)
    {

    }
    else
    {
        p_result.push(p_metadata.prompt);
    }
    p_result.push("</span>");
    p_result.push("</div>");


    p_post_html_render.push("  c3.generate({");
    p_post_html_render.push("  size: {");
    p_post_html_render.push("  height: 240,");
    p_post_html_render.push("  width: 480");
    p_post_html_render.push("  },");
    p_post_html_render.push("  bindto: '#");
    p_post_html_render.push(convert_object_path_to_jquery_id(p_object_path));
    p_post_html_render.push("',");





/*


d3.select('#chart svg').append('text')
.attr('x', d3.select('#chart svg').node().getBoundingClientRect().width / 2)
.attr('y', 16)
.attr('text-anchor', 'middle')
.style('font-size', '1.4em')
.text('Title of this chart');
*/
    if(p_metadata.x_axis && p_metadata.x_axis != "")
    {
        p_post_html_render.push("axis: {");
        p_post_html_render.push("x: {");
        p_post_html_render.push("type: 'timeseries',");
        p_post_html_render.push("localtime: false,");
        p_post_html_render.push("tick: {");
        p_post_html_render.push(" format: '%Y-%m-%d %H:%M:%S'");
        p_post_html_render.push("}");
        p_post_html_render.push("        }},");
    }

    p_post_html_render.push("  data: {");

    if(p_metadata.x_axis && p_metadata.x_axis != "")
    {
        p_post_html_render.push("x: 'x', xFormat: '%Y-%m-%d %H:%M:%S',");
        //p_post_html_render.push("x: 'x', ");
    }

    p_post_html_render.push("      columns: [");

    if(p_metadata.x_axis && p_metadata.x_axis != "")
    {
        p_post_html_render.push(get_chart_x_range_from_path(p_metadata, p_metadata.x_axis, p_ui));
    }
    //p_post_html_render.push("  ['data1', 30, 200, 100, 400, 150, 250],");
    //p_post_html_render.push("['data2', 50, 20, 10, 40, 15, 25]")


    if(p_metadata.y_label && p_metadata.y_label != "")
    {
        var y_labels = p_metadata.y_label.split(",");
        var y_axis_paths = p_metadata.y_axis.split(",");
        for(var y_index = 0; y_index < y_axis_paths.length; y_index++)
        {
            p_post_html_render.push(get_chart_y_range_from_path(p_metadata, y_axis_paths[y_index], p_ui, y_labels[y_index]));
            if(y_index < y_axis_paths.length-1)
            {
                p_post_html_render.push(",");
            }
        }
    }
    else
    {

        var y_axis_paths = p_metadata.y_axis.split(",");
        for(var y_index = 0; y_index < y_axis_paths.length; y_index++)
        {
            p_post_html_render.push(get_chart_y_range_from_path(p_metadata, y_axis_paths[y_index], p_ui));
            if(y_index < y_axis_paths.length-1)
            {
                p_post_html_render.push(",");
            }
        }
    }


    
    p_post_html_render.push("  ]");
    p_post_html_render.push("  }");
    p_post_html_render.push("  });");

    p_post_html_render.push(" d3.select('#" + convert_object_path_to_jquery_id(p_object_path) + " svg').append('text')");
    p_post_html_render.push("     .attr('x', d3.select('#" + convert_object_path_to_jquery_id(p_object_path) + " svg').node().getBoundingClientRect().width / 2)");
    p_post_html_render.push("     .attr('y', 16)");
    p_post_html_render.push("     .attr('text-anchor', 'middle')");
    p_post_html_render.push("     .style('font-size', '1.4em')");
    p_post_html_render.push("     .text('" + p_metadata.prompt.replace(/'/g, "\\'") + "');");

}

function get_chart_x_ticks_from_path(p_metadata, p_metadata_path, p_ui)
{
	//prenatal/routine_monitoring/systolic_bp,prenatal/routine_monitoring/diastolic
	// p_ui.url_state.path_array.length
	var result = [];
	var array_field = eval(convert_dictionary_path_to_array_field(p_metadata_path));

	var array = eval(array_field[0]);

	if(array)
	{
		var field = array_field[1];

		result.push("[");
		//result.push("['x'");
		// ['data2', 50, 20, 10, 40, 15, 25]
		//result.push(50, 20, 10, 40, 15, 25);

		//result = ['data2', 50, 20, 10, 40, 15, 25];
		for(var i = 0; i < array.length; i++)
		{
			var val = array[i][field];
			if(val)
			{
				result.push(parseFloat(val));
			}
			else
			{
				result.push(0);
			}
			
		}

		result[result.length-1] = result[result.length-1] + "]";
		return result.join(",");
	}
	else
	{
		return "";
	}
	
}

function get_chart_x_range_from_path(p_metadata, p_metadata_path, p_ui)
{
	//prenatal/routine_monitoring/systolic_bp,prenatal/routine_monitoring/diastolic
	// p_ui.url_state.path_array.length
	var result = [];
	var array_field = eval(convert_dictionary_path_to_array_field(p_metadata_path));

	var array = eval(array_field[0]);
	if(array)
	{
		var field = array_field[1];


		result.push("['x'");
		// ['data2', 50, 20, 10, 40, 15, 25]
		//result.push(50, 20, 10, 40, 15, 25);

		//result = ['data2', 50, 20, 10, 40, 15, 25];
		for(var i = 0; i < array.length; i++)
		{
			var val = array[i][field];
			if(val)
			{
				var res = val.match(/^\d\d\d\d-\d\d-\d+$/);
				if(res)
				{
					result.push("'" + make_c3_date(val) +"'");
				}
				else 
				{
					res = val.match(/^\d\d\d\d-\d\d?-\d\d?[ T]?\d?\d:\d\d:\d\d[Z]?$/)
					if(res)
					{
						//var date_time = new Date(val);
						//result.push("'" + date_time.toISOString() + "'");
						result.push("'" + make_c3_date(val) +"'");
					}
					else
					{
						result.push(parseFloat(val));
					}
				}
			}
			else
			{
				result.push(0);
			}
			
		}

		result[result.length-1] = result[result.length-1] + "]";
		return result.join(",") + ",";
	}
	else
	{
		return "";
	}
}

function get_chart_y_range_from_path(p_metadata, p_metadata_path, p_ui, p_label)
{
	//prenatal/routine_monitoring/systolic_bp,prenatal/routine_monitoring/diastolic
	// p_ui.url_state.path_array.length
	var result = [];
	var array_field = eval(convert_dictionary_path_to_array_field(p_metadata_path));

	var array = eval(array_field[0]);

	var field = array_field[1];

	if(p_label)
	{
		result.push("['" + p_label + "'");
	}
	else
	{
		result.push("['" + array_field[1] + "'");
	}
	
	if(array)
	{
		// ['data2', 50, 20, 10, 40, 15, 25]
		//result.push(50, 20, 10, 40, 15, 25);

		//result = ['data2', 50, 20, 10, 40, 15, 25];
		for(var i = 0; i < array.length; i++)
		{
			var val = array[i][field];
			if(val)
			{
				/*
				var temp = parseFloat(val);
				var rounded = Math.round(temp * 100) / 100;
				result.push(rounded);
				*/
				result.push(parseFloat(val).toFixed(2));
			}
			else
			{
				result.push(0);
			}
			
		}

		result[result.length-1] = result[result.length-1] + "]";
		return result.join(",");
	}
	else
	{
		return result.join("") + "]";;
	}
}