

function dictionary_render(p_metadata, p_path)
{
	var result = [];


	let de_identified_search_result = [];
	render_de_identified_search_result(de_identified_search_result, g_filter);



result.push(`<div id="de_identify_filter" class="p-3 mt-3 bg-gray-l3" data-prop="de_identified_selection_type" style="display: block; border: 1px solid #bbb;">
<div class="form-inline mb-2">
	<label for="de_identify_search_text" class="mr-2"> Search for:</label>
	<input type="text"
				 class="form-control mr-2"
				 id="de_identify_search_text"
				 value="" onchange="de_identify_search_text_change(this.value)"/>
	<select id="de_identify_form_filter" class="custom-select mr-2">
		${render_de_identify_form_filter(g_filter)}
	</select>
	<select id="metadata_version_filter" class="custom-select mr-2">
		<option value="">Select Metadata Version</option>
		<option value="19.10.17">19.10.17</option>
	</select>
	<button type="button" class="btn btn-tertiary" alt="clear search" onclick="de_identified_search_click()">Search</button>
</div>
<!--div class="form-group form-check mb-1">
	<input type="checkbox" class="form-check-input" id="exclude_pii">
	<label class="form-check-label font-weight-normal" for="exclude_pii">Deidentify PII tagged fields</label>
</div-->

<div class="mt-3" style="border: 1px solid #bbbbbb; overflow:hidden; overflow-y: auto;">
	<table class="table table--plain mb-0">
		<thead class="thead">
			<tr class="tr bg-tertiary">
				<th class="th" colspan="2">
					<span class="row no-gutters justify-content-between">
						<span>Fields for version {version number}</span>
						<!-- <button class="anti-btn" onclick="fooBarSelectAll()">Select All</button> -->
					</span>
				</th>
			</tr>
		</thead>
		<tbody class="tbody" id="de_identify_search_result_list">
			${de_identified_search_result.join("")}
		</tbody>
	</table>
</div>`);


	return result;
}

function dictionary_render_header()
{
	var result = [];

	result.push(`
		<tr class="tr bg-gray-l3">
			<th class="th">path</th>
			<th class="th">name</th>
			<th class="th">type</th>
			<th class="th">prompt</th>
			<th class="th">control_style</th>
			<th class="th">description</th>
			<th class="th">is_save_value_display_description</th>
			<th class="th">values</th>
			<th class="th">is_core_summary</th>
			<th class="th">is_required</th>
			<th class="th">is_multiselect</th>
			<th class="th">is_read_only</th>
			<th class="th">default_value</th>
			<th class="th">regex_pattern</th>
			<th class="th">pre_fill</th>
			<th class="th">max_value</th>
			<th class="th">min_value</th>	
			<th class="th">validation</th>
			<th class="th">validation_description</th>
			<th class="th">onfocus</th>
			<th class="th">onchange</th>
			<th class="th">onblur</th>
			<th class="th">onclick</th>
		</tr>
	`);

	return result;
}

function dictionary_render_row(p_metadata, p_path)
{
	var result = [];

	result.push('<tr class="tr">');
		result.push('<td class="td">' + p_path + '</td>');
		result.push('<td class="td">' + ((p_metadata['name'])? p_metadata['name']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['type'])? p_metadata['type']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['prompt'])? p_metadata['prompt']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['control_style'])? p_metadata['control_style']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['description'])? p_metadata['description']: "&nbsp;") + '</td>');
		
		if(p_metadata.type.toLowerCase() == "list")
		{
			result.push('<td class="td">')
			if
			(
				p_metadata['is_save_value_display_description'] &&
				p_metadata['is_save_value_display_description'] == true
			)
			{
				result.push("saves the value, displays the <strong>description</strong> in list.");
			}
			else
			{
				result.push("saves value, displays value.");
			}
				
			result.push('</td>');
		}
		else
		{
			result.push("<td class='td'>&nbsp;</td>");
		}

		if(p_metadata.values)
		{
			result.push('<td class="td"><table class="table"><tr class="tr bg-secondary"><th class="th">value</th><th class="th">description</th></tr>');

			let value_list = p_metadata.values;

			if(p_metadata.path_reference && p_metadata.path_reference != "")
			{
				value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
		
				if(value_list == null)	
				{
					value_list = p_metadata.values;
				}
			}

			for(var i = 0; i < value_list.length; i++)
			{
				var child = value_list[i];
				if(i % 2)
				{
					result.push("<tr class='tr bg-gray-l3'><td>");
				}
				else
				{
					result.push("<tr class='tr'><td class='td'>");
				}
				if(child.value == "")
				{
					result.push("(blank)");
				}
				else
				{
					result.push(child.value);
				}
				
				result.push("</td><td class='td'>")
				if(child.display == "")
				{
					result.push("(blank)");
				}
				else
				{
					result.push(child.display);
				}
				result.push('</td></tr>');
			}
			result.push('</table></td>');
		}
		else
		{
			result.push('<td class="td">&nbsp;</td>');
		}

		result.push('<td class="td">' + ((p_metadata['is_core_summary'])? p_metadata['is_core_summary']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['is_required'])? p_metadata['is_required']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['is_multiselect'])? p_metadata['is_multiselect']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['is_read_only'])? p_metadata['is_read_only']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['default_value'])? p_metadata['default_value']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['regex_pattern'])? p_metadata['regex_pattern']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['pre_fill'])? p_metadata['pre_fill']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['max_value'])? p_metadata['max_value']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['min_value'])? p_metadata['min_value']: "&nbsp;") + '</td>');	
		result.push('<td class="td">' + ((p_metadata['validation'])? p_metadata['validation']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['validation_description'])? p_metadata['validation_description']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onfocus'])? p_metadata['onfocus']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onchange'])? p_metadata['onchange']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onblur'])? p_metadata['onblur']: "&nbsp;") + '</td>');
		result.push('<td class="td">' + ((p_metadata['onclick'])? p_metadata['onclick']: "&nbsp;") + '</td>');

	result.push('</tr>');

	return result;

}


function convert_dictionary_path_to_lookup_object(p_path)
{
	//g_data.prenatal.routine_monitoring.systolic_bp
	var result = null;
	var temp_result = []
	var temp = "g_metadata." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");
	var index = temp.lastIndexOf('.');
	temp_result.push(temp.substr(0, index));
	temp_result.push(temp.substr(index + 1, temp.length - (index + 1)));

	var lookup_list = eval(temp_result[0]);

	for(var i = 0; i < lookup_list.length; i++)
	{
		if(lookup_list[i].name == temp_result[1])
		{
			result = lookup_list[i].values;
			break;
		}
	}

	return result;
}


function render_de_identify_form_filter(p_filter)
{
	let result = [];

	result.push(`<option value="">(Any Form)</option>`)

	for(let i = 0; i < g_metadata.children.length; i++)
	{
		let item = g_metadata.children[i];

		if(item.type.toLowerCase() == "form")
		{

			if(p_filter.selected_form == item.name)
			{
				result.push(`<option value="${item.name}" selected>${item.prompt}</option>`)
			}
			else
			{
				result.push(`<option value="${item.name}">${item.prompt}</option>`)
			}
			
		}
		
	}

	return result.join("");
}


function de_identified_search_click()
{
	g_filter.selected_form = document.getElementById("de_identify_form_filter").value;

	let de_identify_search_result_list = document.getElementById("de_identify_search_result_list");

	let result = [];
	render_de_identified_search_result(result, g_filter);

	de_identify_search_result_list.innerHTML = result.join("");
	
}

function render_de_identified_search_result(p_result, p_filter)
{

	render_de_identified_search_result_item(p_result, g_metadata, "", p_filter.selected_form, p_filter.search_text);

	
}

function render_de_identified_search_result_item(p_result, p_metadata, p_path, p_selected_form, p_search_text)
{

	switch(p_metadata.type.toLowerCase())
	{
		case "form":
				if(p_selected_form== null || p_selected_form=="")
				{
					for(let i = 0; i < p_metadata.children.length; i++)
					{
						let item = p_metadata.children[i];
						render_de_identified_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
					}
				}
				else
				{
					if(p_metadata.name.toLowerCase() == p_selected_form.toLowerCase())
					{
						for(let i = 0; i < p_metadata.children.length; i++)
						{
							let item = p_metadata.children[i];
							render_de_identified_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
						}
					}
				}
				
				break;
		case "app":
		case "group":
		case "grid":
			for(let i = 0; i < p_metadata.children.length; i++)
			{
				let item = p_metadata.children[i];
				render_de_identified_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
			}
			break;
		default:

		if(p_search_text != null && p_search_text !="")
		{
			if
			(
				!(
					p_metadata.name.indexOf(p_search_text) > -1 ||
					p_metadata.prompt.indexOf(p_search_text) > -1 
				)
			
			)
			{
				return;
			}
		}
		let form_name = "(none)";
		let path_array = p_path.split('/');
		if(path_array.length > 2)
		{
			form_name = path_array[1];
		}

		let description = "";

		if(p_metadata.description != null)
		{
			description = p_metadata.description;
		}

		let list_values = [];

		if(p_metadata.type.toLowerCase() == "list")
		{
			let value_list = p_metadata.values;

			if(p_metadata.path_reference && p_metadata.path_reference != "")
			{
				value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
		
				if(value_list == null)	
				{
					value_list = p_metadata.values;
				}
			}

			list_values.push(`
			<tr>
				<td colspan="6">
					<table class="table table--plain mb-0">
						<tr class="tr bg-gray-l3">
							<th class="th" colspan=3>List Values</th>
						</tr>
						<tr class="tr">
							<th class="th">value</th>
							<th class="th">display</th>
							<th class="th">description</th>
			</tr>`);

			for(let i= 0; i < value_list.length; i++)
			{
				list_values.push(`<tr>
						<th class="th">${value_list[i].value}</th>
						<th class="th">${value_list[i].display}</th>
						<th class="th">${value_list[i].description}</th>
					</tr>`);
			}
			
			list_values.push(`</table>
			</td>
			</tr>`);
		}

		p_result.push(`
			<tr class="tr">
				<td class="td">
					<table class="table table--plain mb-0">
						<thead class="thead">
							<tr class="tr">
								<th class="th" colspan="6">
									<strong>MMRIA Path:</strong> ${p_path}
								</th>
							</tr>
						</thead>
						<thead class="thead">
							<tr class="tr bg-white" data-show="search--${p_path}" style="display: table-row">
								<th class="th">Form</th>
								<th class="th">Export File</th>
								<th class="th">Export Field</th>
								<th class="th">Name</th>
								<th class="th">Type</th>
								<th class="th">Prompt</th>
							</tr>
						</thead>
						<tbody class="tbody">
							<tr class="tr" data-show="search--${p_path}" style="display: table-row">
								<td class="td">${form_name}</td>
								<td class="td">Export File</td>
								<td class="td">Export Field</td>
								<td class="td">${p_metadata.name}</td>
								<td class="td">${p_metadata.type}</td>
								<td class="td">${p_metadata.prompt}</td>
							</tr>
							<tr class="tr">
								<td class="td" colspan="6">
									<strong>Description:</strong> ${description}
								</td>
							</tr>
							${list_values.join("")}
						</tbody>
					</table>
				</td>
			</tr>
		`);
		break;
	}
}

function handleElementDisplay(event, str)
{
	const prop = event.target.dataset.prop;
	const tars = document.querySelectorAll(`[data-show='${prop}']`);

	return new Promise ((resolve, reject) =>
	{
		if (!isNullOrUndefined(tars)) {
			for (let i = 0; i < tars.length; i++) {
				if (tars[i].style.display === 'none') {
					tars[i].style.display = str;
				} else {
					tars[i].style.display = 'none';
				}
			}
		} else {
			// target doesn't exist, reject
			reject('Target(s) do not exist');
		}
	})

	// tars.forEach((el) =>
	// {
	// 	if (el.style.display == 'none') {
	// 		el.style.display == str;
	// 		console.log('a');
	// 	} else {
	// 		el.style.display == 'none';
	// 		console.log('b');
	// 	}
	// });
}

function convert_dictionary_path_to_lookup_object(p_path)
{

	//g_data.prenatal.routine_monitoring.systolic_bp
	var result = null;
	var temp_result = []
	var temp = "g_metadata." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");
	var index = temp.lastIndexOf('.');
	temp_result.push(temp.substr(0, index));
	temp_result.push(temp.substr(index + 1, temp.length - (index + 1)));

	var lookup_list = eval(temp_result[0]);

	for(var i = 0; i < lookup_list.length; i++)
	{
		if(lookup_list[i].name == temp_result[1])
		{
			result = lookup_list[i].values;
			break;
		}
	}


	return result;
}