function chart_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx, p_is_de_identified = false)
{
	var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
	
	p_result.push
	(
		`<div id='${convert_object_path_to_jquery_id(p_object_path)}'
		  mpath='id='${p_metadata_path}' 
		  style='${get_only_size_and_position_string(style_object.control.style)}'
		>
            <table>
            <tr align=center><th>${p_metadata.prompt}</th></tr>
            <tr align=center><td>
			<div id='${convert_object_path_to_jquery_id(p_object_path)}_chart'>
            
            </div>
            </td></tr>
            </table>
		</div>
		`
		
	);

	var chart_size = get_chart_size(style_object.control.style);
	var chart_gen_name = "chart_" + convert_object_path_to_jquery_id(p_object_path);

   let translate_x = "-30";
   if
   (
       p_metadata.x_type != null &&
       p_metadata.x_type.toLowerCase() == 'datetime'
   )
   {
        translate_x = "-25";
   }

   const computed_height = chart_size.height - 23;

	p_post_html_render.push(` g_charts['${chart_gen_name}'] = 
	  c3.generate({
		size: {
		height: ${computed_height}
		, width: ${chart_size.width}
      },
	  transition: {
	    duration: null
      },
      bindto: '#${convert_object_path_to_jquery_id(p_object_path)}_chart',
      onrendered: function()
      {
		const el = d3.select('#${convert_object_path_to_jquery_id(p_object_path)} svg').selectAll('g.c3-axis.c3-axis-x > g.tick > text');
        el.attr('transform', 'rotate(325)translate(${translate_x},0)');

      },`);


    if(p_metadata.x_axis && p_metadata.x_axis != "")
    {
        p_post_html_render.push("axis: {");
        p_post_html_render.push("x: {");
        p_post_html_render.push("type: 'timeseries',");
        p_post_html_render.push("localtime: true,");
        //p_post_html_render.push("label: {");

        //p_post_html_render.push(" position: 'outer-center',");
        //p_post_html_render.push("},");
        p_post_html_render.push("tick: {");
        if
        (
            p_metadata.x_type != null &&
            p_metadata.x_type.toLowerCase() == 'datetime'
        )
        {
		    p_post_html_render.push(" format: '%m/%d/%Y %H:%M:%S',");
        }
        else
        {
            p_post_html_render.push(" format: '%m/%d/%Y',");
        }
		p_post_html_render.push("},");
		p_post_html_render.push("height: 55");
		p_post_html_render.push("        }");

		if (p_metadata.name === "temperature_graph") {
			p_post_html_render.push(",y: {");
			p_post_html_render.push("  tick: {");
			p_post_html_render.push("   format: d3.format('.1f'),");
			p_post_html_render.push("  },");
			p_post_html_render.push("  min: 0,");
            p_post_html_render.push("  padding: {top: 0, bottom: 0},");
			p_post_html_render.push("},");
		}
		else {
			p_post_html_render.push(",y: {");
			p_post_html_render.push("  tick: {");
			p_post_html_render.push("   format: d3.format('.0f'),");
			p_post_html_render.push("  },");
			p_post_html_render.push("  min: 0,");
            p_post_html_render.push("  padding: {top: 0, bottom: 0},");
			p_post_html_render.push("},");
		}

		p_post_html_render.push("        },");
    }

    p_post_html_render.push("  data: {");

    if(p_metadata.x_axis && p_metadata.x_axis != "")
    {
        p_post_html_render.push("x: 'x', xFormat: '%Y-%m-%d %H:%M:%S',");
    }

    p_post_html_render.push("      columns: [");

    var y_axis_paths = p_metadata.y_axis.split(",");

    if( ! g_charts.has(p_metadata.x_axis))
    {
        g_charts.set(p_metadata.x_axis, new Set()); 
    }

    g_charts.get(p_metadata.x_axis).add(chart_gen_name); 

    const x_array = get_chart_x_range_from_path(p_metadata, p_metadata.x_axis, p_ui);
    const x_has_value = [];
    const y_has_value = [];
    if(x_array.length > 0)
    {
        for(const index in x_array)
        {
            if
            (
                x_array[index] != null &&
                x_array[index] != ''
            )
            {
                x_has_value [index] = true;
               
            }
            else
            {
                x_has_value[index] = false;
            }
        }
    }


    for(var y_index = 0; y_index < y_axis_paths.length; y_index++)
    {
        const y_axis_path = y_axis_paths[y_index].trim();

        if( ! g_charts.has(y_axis_path))
        {
            g_charts.set(y_axis_path, new Set()); 
        }

        g_charts.get(y_axis_path).add(chart_gen_name); 
       
        const y_array = get_chart_y_range_from_path(p_metadata, y_axis_path, p_ui)
        
        if(y_array.length > 0)
        {
            for(const index in y_array)
            {
                if
                (
                    y_array[index] != null && 
                    y_array[index] != '' &&
                    y_array[index] != 'null'
                )
                {
                    y_has_value [index] = true;
                }
                else
                {
                    y_has_value[index] = false;
                }
            }
        }
    }

    if(x_array.length > 0)
    {
        for(const index in x_array)
        {
            if
            (
                x_has_value [index] &&
                y_has_value [index]
            )
            {
                p_post_html_render.push(x_array[index]);
                if(index != x_array.length - 1)
                {
                    p_post_html_render.push(",")
                }
            }
        }

        p_post_html_render.push("],")
    }

        
    for(var y_index = 0; y_index < y_axis_paths.length; y_index++)
    {
        const y_axis_path = y_axis_paths[y_index].trim();
        
        const y_array = get_chart_y_range_from_path(p_metadata, y_axis_paths[y_index], p_ui)
        
        if(y_array.length > 0)
        {
            for(const index in y_array)
            {
                if
                (
                    y_has_value[index] && 
                    x_has_value[index]
                )
                {
                    p_post_html_render.push(y_array[index]);
                    if(index != y_array.length - 1)
                    {
                        p_post_html_render.push(",")
                    }
                }
            }
    
            p_post_html_render.push("],")
        }
    }
    




	g_chart_data.set
    (
        `${chart_gen_name}`, 
        {
            div_id: convert_object_path_to_jquery_id(p_object_path),
            p_result: p_result,
            p_metadata: p_metadata,
            p_ui: p_ui,
            p_metadata_path: p_metadata_path,
            p_object_path: p_object_path,
            p_dictionary_path: p_dictionary_path,
            p_is_grid_context: p_is_grid_context,
            p_post_html_render: p_post_html_render,
            p_search_ctx: p_search_ctx,
            p_ctx: p_ctx,
            style_object: style_object
    
        }
    );




    p_post_html_render.push("  ]");
    p_post_html_render.push("  },");
	p_post_html_render.push("  line: {");
	p_post_html_render.push("     connectNull: true");
	p_post_html_render.push("  }");
    p_post_html_render.push("  });");

    p_post_html_render.push(" d3.select('#" + convert_object_path_to_jquery_id(p_object_path) + " svg').append('text')");
    p_post_html_render.push("     .attr('x', d3.select('#" + convert_object_path_to_jquery_id(p_object_path) + " svg').node().getBoundingClientRect().width / 2)");
    p_post_html_render.push("     .attr('y', 16)");
    p_post_html_render.push("     .attr('text-anchor', 'middle')");
    p_post_html_render.push("     .style('font-size', '1.4em');");
	//p_post_html_render.push("     .text('" + p_metadata.prompt.replace(/'/g, "\\'") + "');");
	
}


function get_chart_x_range_from_path(p_metadata, p_metadata_path, p_ui)
{
	//prenatal/routine_monitoring/systolic_bp,prenatal/routine_monitoring/diastolic
	// p_ui.url_state.path_array.length
	let result = [];
	const array_field = eval(convert_dictionary_path_to_array_field(p_metadata_path));

	const array = eval(array_field[0]);
	if(array)
	{
		const field = array_field[1];


		result.push("['x'");
		// ['data2', 50, 20, 10, 40, 15, 25]
		//result.push(50, 20, 10, 40, 15, 25);

		//result = ['data2', 50, 20, 10, 40, 15, 25];
		for(let i = 0; i < array.length; i++)
		{
			const val = array[i][field];
			if(val)
			{
				const res = val.match(/^\d\d\d\d-\d\d?-\d+$/);
				if(res)
				{
					result.push("'" + make_c3_date(val) +"'");
				}
				else 
				{
					const res2 = val.match(/^\d\d\d\d-\d\d?-\d\d?[ T]?\d?\d:\d\d:\d\d(.\d\d\d)?[Z]?$/)
					if(res2)
					{
						//let date_time = new Date(val);
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
				result.push(null);
			}
			
		}

		//result[result.length-1] = result[result.length-1] + "]";
		//return result.join(",") + ",";
	}
	else
	{
		//return "";
	}

    return result;
}

function get_chart_y_range_from_path(p_metadata, p_metadata_path, p_ui, p_label)
{
	//prenatal/routine_monitoring/systolic_bp,prenatal/routine_monitoring/diastolic
	// p_ui.url_state.path_array.length
	const result = [];
	const array_field = eval(convert_dictionary_path_to_array_field(p_metadata_path));

	const array = eval(array_field[0]);

	const field = array_field[1];

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
		for(let i = 0; i < array.length; i++)
		{
			const val = array[i][field];
			if(val)
			{
				result.push(parseFloat(val).toFixed(2));
			}
			else
			{
				result.push('null');
			}
			
		}

		//result[result.length-1] = result[result.length-1] + "]";
		//return result.join(",");
	}
	else
	{
		//return result.join("") + "]";;
	}

    return result;
}


function update_charts(p_path)
{


    if
    (
        p_path != null &&
        ! g_charts.has(p_path.substring(1))
    )
    {
        return;
    }

    const chart_set = g_charts.get(p_path.substring(1));
    
    for (const chart of chart_set)
    {
        const chart_data = g_chart_data.get(chart);

        const p_result = [];
        const p_post_html_render = [];

        chart_render
        (
            p_result, 
            chart_data.p_metadata, 
            null, // undefined
            chart_data.p_ui, // g_ui
            chart_data.p_metadata_path, //"g_metadata.children[17].children[12]"
            chart_data.p_object_path, // "g_data.er_visit_and_hospital_medical_records[0].temperature_graph"
            chart_data.p_dictionary_path, // "/er_visit_and_hospital_medical_records/temperature_graph"
            chart_data.p_is_grid_context, // false
            p_post_html_render, 
            chart_data.p_search_ctx, // undefined
            chart_data.p_ctx // { form_index: 0, grid_index: null }
        );

        document.getElementById(chart_data.div_id).outerHTML = p_result.join('');
      
        if (p_post_html_render.length > 0) 
        {
          try
          {
            eval(p_post_html_render.join(''));
          } 
          catch (ex) 
          {
            console.log(ex);
          }
        }


           // console.log("here");

    }
}

function chart_onrendered()
{
    const el = d3.select('#${convert_object_path_to_jquery_id(p_object_path)} svg').selectAll('g.c3-axis.c3-axis-x > g.tick > text');

    el.attr('transform', 'rotate(325)translate(${translate_x},0)');
    el.innerText = '';
}