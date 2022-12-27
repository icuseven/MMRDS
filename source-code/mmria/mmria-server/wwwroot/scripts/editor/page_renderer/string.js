function string_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
    let styleObject = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    let pDescription = p_metadata.description;
    let pValidationDescript = p_metadata.validation_description;

    let other_specify = g_other_specify_lookup[p_dictionary_path.substr(1)];

    let visibility_html = 'display:block;';

    if(other_specify!= null)
    {
        let object_path = `g_data.${other_specify.list.replace(/\//g,".")}`;
        let other_data = eval(object_path);

        if(Array.isArray(other_data))
        {
            if(other_data.indexOf(other_specify.value) > -1)
            {
                visibility_html = 'display:block;';
            }
            else
            {
                visibility_html = 'display:none;';
            }
        }
        else
        {
            if(other_specify.value == other_data)
            {
                visibility_html = 'display:block;';
            }
            else
            {
                visibility_html = 'display:none;';
            }
        }
    }


    p_result.push(`<div id="${convert_object_path_to_jquery_id(p_object_path)}" class="form-control-outer" mpath="${p_metadata_path}" style="${visibility_html}">`);
        p_result.push(`
            <label for="${convert_object_path_to_jquery_id(p_object_path)}_control"
                   ${styleObject ? `style="${get_style_string(styleObject.prompt.style)}"` : ''}
                   ${pDescription && pDescription.length > 0 ? `rel="tooltip" data-original-title="${pDescription.replace(/'/g, "\\'")}"` : ''}
                   ${pValidationDescript && pValidationDescript.length > 0 ? `validation-tooltip="${p_validation_description.replace(/'/g, "\\'")}"` : ''}>
                ${p_metadata.prompt}
                ${g_is_data_analyst_mode? render_data_analyst_dictionary_link
                    (
                        p_metadata, 
                        p_dictionary_path
                    ) : ""}
            </label>
        `);
/*
    p_result.push
    (
        render_data_analyst_dictionary_link
        (
            p_metadata, 
            convert_object_path_to_jquery_id(p_object_path),
            p_object_path
        )
    );*/
        page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);



        
    p_result.push(`</div>`);
    
}


function render_data_analyst_dictionary_link
(
    p_metadata,
    p_dictionary_path
)
{
    return `
<a 
	class="info-icon anti-btn x20 fill-p cdc-icon-info-circle-solid ml-1" 
	title="Dictionary look up for ${p_metadata.prompt} path: ${p_dictionary_path}."
    onclick="on_dictionary_lookup_click('${p_dictionary_path}')" >
</a>
`;

}


let g_release_version_specification = null;

async function on_dictionary_lookup_click(p_path)
{
    if(g_release_version_specification == null)
    {

        response = await $.ajax({
            url: `${location.protocol}//${location.host}/api/metadata/version_specification-${g_release_version}`
        });

        g_release_version_specification = response;
    }
	

    const result = []
    render_search_result(result, p_path);

    await $mmria.data_dictionary_dialog_show
    (
        `${selected_dictionary_info.form_name} - ${selected_dictionary_info.field_name}`,
        result.join("")
    );
}





function render_search_result(p_result, p_path)
{
	selected_dictionary_info = {};
	render_search_result_item(p_result, g_metadata, "", null, p_path.toLowerCase());
}




let last_form = null;
let selected_dictionary_info = {};

function render_search_result_item(p_result, p_metadata, p_path, p_selected_form, p_search_text)
{

    if(p_metadata.mirror_reference != null && p_metadata.mirror_reference != "")
    {
        return;
    }
	switch(p_metadata.type.toLowerCase())
	{
		case "form":			
			if(p_selected_form== null || p_selected_form=="")
			{
				for(let i = 0; i < p_metadata.children.length; i++)
				{
					let item = p_metadata.children[i];

					render_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
				}
			}
			else
			{
				if(p_metadata.name.toLowerCase() == p_selected_form.toLowerCase())
				{
					for(let i = 0; i < p_metadata.children.length; i++)
					{
						let item = p_metadata.children[i];

						render_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
					}
				}
			}
			break;

		case "app":
			let form_filter = "(any form)";
			let el = document.getElementById("form_filter");

			if(el)
			{
				form_filter = el.value;
			}

			for(let i = 0; i < p_metadata.children.length; i++)
			{
				let item = p_metadata.children[i];

				if(form_filter.toLowerCase() == "(any form)")
				{
					render_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
				}
				else if(item.type.toLowerCase() == "form")
				{
					render_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
				}
				
			}
			break;

		case "group":
		case "grid":
			for(let i = 0; i < p_metadata.children.length; i++)
			{
				let item = p_metadata.children[i];
				render_search_result_item(p_result, item, p_path + "/" + item.name, p_selected_form, p_search_text);
			}
			break;

        case "chart":
        case "label":
        case "button":
            break;

		default:
			let file_name = "";
			let field_name = "";
			let file_field_item = g_release_version_specification.path_to_csv_all[p_path];

			if(file_field_item)
			{
				file_name = file_field_item.file_name;
				field_name = file_field_item.field_name;
			}

			if(p_path != p_search_text)
			{
                return;
				let is_search_match = false;
				let search_array = p_search_text.trim().split(" ");
				
				for(let i = 0; i < search_array.length; i++)
				{
					let search_term = search_array[i].toLowerCase().trim();
					
					if
					(
						search_term == null || 
						search_term == ""
					)
					{
						continue;
                    }


					for(let j = 0; j < p_metadata.tags.length; j++)
					{
						let check_item = p_metadata.tags[j].toLowerCase();

                        if
                        (
                            check_item.indexOf(search_term) > -1

                        )
						{
							is_search_match = true;
							break;
						}
					}	
				}
				
				if
				(
					!is_search_match && 
					!(
						p_metadata.name.toLowerCase().indexOf(p_search_text.trim()) > -1 ||
						p_metadata.prompt.toLowerCase().indexOf(p_search_text.trim()) > -1 ||
                        (p_metadata.sass_export_name!= null && p_metadata.sass_export_name.toLowerCase().indexOf(p_search_text.trim()) > -1) ||
                        (file_name!=null && file_name.indexOf(p_search_text.trim()) > -1) ||
						(field_name!=null && field_name.indexOf(p_search_text.trim()) > -1)
					)
				
				)
				{
					return;
				}
			}

			let form_name = "(none)";
			let path_array = p_path.split('/');
			let description = "";
			let list_values = [];
			let data_type = p_metadata.type.toLowerCase();

			if
			(
				p_metadata.data_type != null &&
				p_metadata.data_type != ""
			)
			{
				data_type = p_metadata.data_type
			}

			if(path_array.length > 2)
			{
				form_name = path_array[1];
				form_name = convert_form_name(form_name);
			}


            selected_dictionary_info.form_name = form_name;
            selected_dictionary_info.field_name = p_metadata.prompt;

			if(p_metadata.description != null)
			{
				description = p_metadata.description;
			}

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
					<tr class="tr">
						<td class="td" width="140"></td>
						<td class="td p-0" colspan="5">
							<table class="table table--standard rounded-0 m-0">
								<thead class="thead">
									<tr class="tr bg-gray-l2">
										<th class="th" colspan="5" width="1080" scope="colgroup">List Values</th>
									</tr>
								</thead>
								<thead class="thead">
									<tr class="tr bg-gray-l2">
										<th class="th" width="140" scope="col">Value</th>
										<th class="th" width="680" scope="col">Display</th>
										<th class="th" width="260" scope="col">Description</th>
									</tr>
								</thead>
								<tbody class="tbody">	
				`);

					for(let i= 0; i < value_list.length; i++)
					{
						list_values.push(`
									<tr class="tr">
										<td class="td" width="140">${value_list[i].value}</td>
										<td class="td" width="680">${value_list[i].display}</td>
										<td class="td" width="260">${value_list[i].description}</td>
									</tr>
						`);
					}
				
				list_values.push(`
								</tbody>
							</table>
						</td>
						<td class="td" colspan="2"></td>
					</tr>
				`);
			}

			// Remove fields who do not have a form_name or if it doesn't exist
			// if (!form_name || form_name == '(none)' || form_name == '(blank)') {
			// if (!form_name || form_name.includes('none') || form_name.includes('blank')) {
			if (
				!form_name ||
				 form_name.indexOf('none') !== -1 ||
				 form_name == '(none)' ||
				 form_name.indexOf('blank') !== -1 ||
				 form_name == '(blank)'
			) {
				return;
			}

			// Adding a header per section
			if (last_form !== form_name) {
				last_form = form_name;
				p_result.push(`
					<thead class="thead">
						<tr class="tr bg-gray font-weight-bold" style="font-size: 17px">
							<th class="th" colspan="7" scope="colgroup">
								${form_name}
							</th>
						</tr>
					</thead>
					<thead class="thead">
						<tr class="tr bg-gray-l1 font-weight-bold">
							<th class="th" width="140" scope="col">MMRIA Form</th>
							<th class="th" width="140" scope="col">Export File Name</th>
							<th class="th" width="120" scope="col">Export Field</th>
							<th class="th" width="180" scope="col">Prompt</th>
							<th class="th" width="380" scope="col">Description</th>
							<th class="th" width="260" scope="col">Path</th>
							<th class="th" width="110" scope="col">Data Type</th>
						</tr>
					</thead>
				`);
			}

			p_result.push(`
				<tr class="tr">
					<td class="td" width="140">${form_name}</td>
					<td class="td" width="140">${file_name}</td>
					<td class="td" width="120">${field_name}</td>
					<td class="td" width="180">${p_metadata.prompt}</td>
					<td class="td" width="380">${description}</td>
					<td class="td" width="260">${p_path}</td>
					<td class="td" width="110">${(data_type.toLowerCase() == "textarea" || data_type.toLowerCase() == "jurisdiction")? "string": data_type}</td>
				</tr>
				${list_values.join("")}
			`);

			break;

	}
}


function convert_form_name(p_value)
{
	let lookup = {
		'(none)': '(none)',
		'home_record': 'Home Record',
		'death_certificate': 'Death Certificate',
		'birth_fetal_death_certificate_parent': 'Birth/Fetal Death Certificate - Parent Section',
		'birth_certificate_infant_fetal_section': 'Birth/Fetal Death Certificate - Infant/Fetal Section',
		'autopsy_report': 'Autopsy Report',
		'prenatal': 'Prenatal Care Record',
		'er_visit_and_hospital_medical_records': 'ER Visits & Hospitalizations',
		'other_medical_office_visits': 'Other Medical Office Visits',
		'medical_transport': 'Medical Transport',
		'social_and_environmental_profile': 'Social & Environment Profile',
		'mental_health_profile': 'Mental Health Profile',
		'informant_interviews': 'Informant Interviews',
		'case_narrative': 'Case Narrative',
		'committee_review': 'Committee Decisions',
        'cvs':'Community Vital Signs'
	}

	return lookup[p_value.toLowerCase()];
}