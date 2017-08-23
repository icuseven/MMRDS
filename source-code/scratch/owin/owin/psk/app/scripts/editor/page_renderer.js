function page_render(p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
	var stack = [];
	var result = [];


	switch(p_metadata.type.toLowerCase())
  {
    case 'grid':
		var is_grid_context = true;

		result.push("<table style='grid-column:1/-1'  id='");
		result.push(p_metadata_path);
		result.push("' class='grid'><tr><th colspan=");
		result.push(p_metadata.children.length + 1)
		result.push(">");
		result.push(p_metadata.prompt);
		result.push("</th></tr>");

		result.push('<tr>');
		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];
			result.push('<th>');
			result.push(child.prompt);
			result.push('</th>')

		}
		result.push('<th>&nbsp;</th></tr>');

		for(var i = 0; i < p_data.length; i++)
		{
			result.push('<tr>');
			for(var j = 0; j < p_metadata.children.length; j++)
			{
				var child = p_metadata.children[j];
				result.push("<td>");
				if(p_data[i][child.name] || p_data[child.name] == 0)
				{
					// do nothing 
				}
				else
				{
					p_data[i][child.name] = create_default_object(child, {})[child.name];
				}
				Array.prototype.push.apply(result, page_render(child, p_data[i][child.name], p_ui, p_metadata_path + ".children[" + j + "]", p_object_path + "[" + i + "]." + child.name, p_dictionary_path + "/" + child.name, is_grid_context, p_post_html_render));
				result.push("</td>");
			}
			result.push('<td> <input type="button" value="delete" id="delete_');
			result.push(p_object_path.replace(/\./g,"_") + "[" + i + "]");
			result.push('" onclick="g_delete_grid_item(\'');
			result.push(p_object_path + "[" + i + "]");
			result.push("', '");
			result.push(p_metadata_path);
			result.push('\')" /></td></tr>');
		}
    	result.push("<tr><td colspan=");
		result.push(p_metadata.children.length + 1);
		result.push(" align=right> <input type='button' value='Add Item' onclick='g_add_grid_item(\"");
		result.push(p_object_path);
		result.push("\", \"");
		result.push(p_metadata_path);
		result.push("\")' /></td></tr>");

		result.push("</table>");
		break;
    case 'group':
		result.push("<h3 style='grid-column:1/-1;' id='");
		result.push(p_metadata.name);
		result.push("_id' class='group'>");
		result.push(p_metadata.prompt);
		result.push("</h3>");

		var group_stack = [];

		for(var i = 0; i < p_metadata.children.length; i++)
		{
			var child = p_metadata.children[i];

			if(p_data[child.name] || p_data[child.name] == 0)
			{
				// do nothing 
			}
			else
			{
				p_data[child.name] = create_default_object(child, {})[child.name];
			}

			Array.prototype.push.apply(result, page_render(child, p_data[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));

		}
		break;
    case 'form':
		if(
			 p_metadata.cardinality == "+" ||
			 p_metadata.cardinality == "*"
		
		)
		{
			result.push("<section id='");
			result.push(p_metadata.name);
			result.push("_id' class='form'><h2 style='grid-column:1/-1;'");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}

			result.push(p_metadata.prompt);
			result.push("</h2>");

			if(g_data)
			{
				result.push("<h3  style='color: #341c54;grid-column:1/-1;'>");
				result.push(g_data.home_record.last_name);
				result.push(", ");
				result.push(g_data.home_record.first_name);
				if(g_data.home_record.record_id)
				{
					result.push("  - ");
					result.push(g_data.home_record.record_id);
				}
				result.push("</h3>");
			}


			if(g_source_db=="mmrds")
			{
				result.push('<input path="" style="grid-column:1/-1;" type="button" value="Add New ');
				result.push(p_metadata.prompt.replace(/"/g, "\\\""));
				result.push(' form" onclick="add_new_form_click(\'' + p_metadata_path + '\',\'' + p_object_path + '\')" />');
			}
			result.push('<div class="search_wrapper">');
			for(var i = 0; i < p_data.length; i++)
			{
				var item = p_data[i];
				if(item)
				{
					if(i % 2)
					{
						result.push('		  <div class="result_wrapper_grey"> <a href="#/');
					}
					else
					{
						result.push('		  <div class="result_wrapper"> <a href="#/');
					}
					result.push(p_ui.url_state.path_array.join("/"));
					//result.push(p_metadata.name);
					result.push("/");
					result.push(i);
					result.push("\">");
					result.push('View Record ');
					result.push(i + 1);
		
					result.push('</a>&nbsp;|&nbsp;');
					if(g_source_db=="mmrds")
					{
						result.push('<a onclick="g_delete_record_item(\'' + p_object_path + "[" + i + "]" + '\', \'' + p_metadata_path + '\')');
						result.push("\">");
						result.push('Delete Record ');
						result.push(i + 1);
						result.push('</a>');
					}
					result.push('</div>');
				}

			}
			result.push('		</div>');
			result.push("</section>");

			if(p_ui.url_state.path_array.length > 2)
			{
				var data_index = parseInt(p_ui.url_state.path_array[2]);
				var form_item = p_data[data_index];

				result.push("<section id='");
				result.push(p_metadata.name);
				result.push("' class='form'><h2 style='grid-column:1/-1;' ");
				if(p_metadata.description && p_metadata.description.length > 0)
				{
					result.push("rel='tooltip'  data-original-title='");
					result.push(p_metadata.description.replace(/'/g, "\\'"));
					result.push("'>");
				}
				else
				{
					result.push(">");
				}

				result.push(p_metadata.prompt);
				result.push("</h2><h4 style='grid-column:1/-1;'>");
				result.push(" record: ");
				result.push(data_index + 1);
				result.push("</h4>");
				
				
				if(g_data)
				{
					result.push("<h3  style='color: #341c54;grid-column:1/-1;'>");
					result.push(g_data.home_record.last_name);
					result.push(", ");
					result.push(g_data.home_record.first_name);
					if(g_data.home_record.record_id)
					{
						result.push("  - ");
						result.push(g_data.home_record.record_id);
					}
					result.push("</h3>");
				}

				for(var i = 0; form_item && i < p_metadata.children.length; i++)
				{
					var child = p_metadata.children[i];
					//var item = p_data[data_index][child.name];
					if(form_item[child.name])
					{

					}
					else
					{
						form_item[child.name] = create_default_object(child, {})[child.name];
					}

					if(child.type=="group")
					{
						Array.prototype.push.apply(result, page_render(child,form_item[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "[" + data_index + "]." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
					}
					else
					{
						Array.prototype.push.apply(result, page_render(child, form_item[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "[" + data_index + "]." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
					}
					
					//result.push("</div>");
				}
				result.push("</section>");

			}

		}
		else
		{

			result.push("<section id='");
			result.push(p_metadata.name);
			result.push("_id' ");

			//result.push(" display='grid' grid-template-columns='1fr 1fr 1fr' ");

			result.push(" class='form'><h2 style='grid-column:1/-1;' ");

			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}

			result.push(p_metadata.prompt);
			result.push("</h2>");
			if(g_data)
			{
				result.push("<h3  style='color: #341c54;grid-column:1/-1;'>");
				result.push(g_data.home_record.last_name);
				result.push(", ");
				result.push(g_data.home_record.first_name);
				if(g_data.home_record.record_id)
				{
					result.push("  - ");
					result.push(g_data.home_record.record_id);
				}
				result.push("</h3>");
			}
			

			if(g_data && p_metadata.name == "case_narrative")
			{
				//death_certificate/reviewer_note
				result.push("<h3>Death Certificate Reviewer's Notes</h3>");
				result.push("<textarea cols=80 rows=7>");
				result.push(g_data.death_certificate.reviewer_note);
				result.push("</textarea>");

				//birth_fetal_death_certificate_parent/reviewer_note
				result.push("<h3>Birth/Fetal Death Certificate- Parent Section Reviewer's Notes</h3>");
				result.push("<textarea cols=80 rows=7>");
				result.push(g_data.birth_fetal_death_certificate_parent.reviewer_note);
				result.push("</textarea>");

				
				//birth_certificate_infant_fetal_section/reviewer_note
				result.push("<h3>Birth/Fetal Death Certificate- Infant/Fetal Section Reviewer's Notes</h3>");
				for(var i = 0; i < g_data.birth_certificate_infant_fetal_section.length; i++)
				{
					result.push("<p>Note: ");
					result.push(i+1);
					result.push("<br/>");
					result.push("<textarea cols=80 rows=7>");
					result.push(g_data.birth_certificate_infant_fetal_section[i].reviewer_note);
					result.push("</textarea>");
				}
				
				//autopsy_report/reviewer_note
				result.push("<h3>Autopsy Report Reviewer's Notes</h3>");
				result.push("<textarea cols=80 rows=7>");
				result.push(g_data.autopsy_report.reviewer_note);
				result.push("</textarea>");

				
				//prenatal/reviewer_note
				result.push("<h3>Prenatal Care Record Reviewer's Notes</h3>");
				result.push("<textarea cols=80 rows=7>");
				result.push(g_data.prenatal.reviewer_note);
				result.push("</textarea>");
				

				
				//er_visit_and_hospital_medical_records/reviewer_note
				result.push("<h3>ER Visits and Hospitalizations Reviewer's Notes</h3>");
				for(var i = 0; i < g_data.er_visit_and_hospital_medical_records.length; i++)
				{
					result.push("<p>Note: ");
					result.push(i+1);
					result.push("<br/>");
					result.push("<textarea cols=80 rows=7>");
					result.push(g_data.er_visit_and_hospital_medical_records[i].reviewer_note);
					result.push("</textarea>");
					result.push("</p>");
				}
				
				//other_medical_office_visits/reviewer_note
				result.push("<h3>Other Medical Office Visits Reviewer's Notes</h3>");
				for(var i = 0; i < g_data.other_medical_office_visits.length; i++)
				{
					result.push("<p>Note: ");
					result.push(i+1);
					result.push("<br/>");
					result.push("<textarea cols=80 rows=7>");
					result.push(g_data.other_medical_office_visits[i].reviewer_note);
					result.push("</textarea>");
					result.push("</p>");
				}
///medical_transport/transport_narrative_summary
				result.push("<h3>Medical Transport Reviewer's Notes</h3>");
				for(var i = 0; i < g_data.medical_transport.length; i++)
				{
					result.push("<p>Note: ");
					result.push(i+1);
					result.push("<br/>");
					result.push("<textarea cols=80 rows=7>");
					result.push(g_data.medical_transport[i].reviewer_note);
					result.push("</textarea>");
					result.push("</p>");
				}
				
				//social_and_environmental_profile/reviewer_note
				result.push("<h3>Social and Environmental Profile Reviewer's Notes</h3>");
				result.push("<textarea cols=80 rows=7>");
				result.push(g_data.social_and_environmental_profile.reviewer_note);
				result.push("</textarea>");


				result.push("<h3>Mental Health Profile Reviewer's Notes</h3>");
				result.push("<textarea cols=80 rows=7>");
				result.push(g_data.mental_health_profile.reviewer_note);
				result.push("</textarea>");

				result.push("<h3>Informant Interviews Reviewer's Notes</h3>");
				for(var i = 0; i < g_data.informant_interviews.length; i++)
				{
					result.push("<p>Note: ");
					result.push(i+1);
					result.push("<br/>");
					result.push("<textarea cols=80 rows=7>");
					result.push(g_data.informant_interviews[i].reviewer_note);
					result.push("</textarea>");
					result.push("</p>");
				}

				
			}


			for(var i = 0; i < p_metadata.children.length; i++)
			{
				var child = p_metadata.children[i];
				if(p_data[child.name] || p_data[child.name] == 0)
				{
					// do nothing 
				}
				else
				{
					p_data[child.name] = create_default_object(child, {})[child.name];
				}
				Array.prototype.push.apply(result, page_render(child, p_data[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
			}
			result.push("</section>");
		}
		break;
    case 'app':
		if(profile.user_roles && profile.user_roles.length > 0 && profile.user_roles.indexOf("_admin") < 0)
        {
			result.push("<section id='app_summary'><h2>Line Listing Summary</h2>");
			if(g_source_db=="mmrds")
			{
				result.push("<input type='button'  class='btn-green' value='Add New Case' onclick='g_ui.add_new_case()' /><hr/>");
			}
		
		
			//result.push("<fieldset><legend>filter line listing</legend>");
			//result.push("<input type='text' id='search_text_box' value='' /> ");
			//result.push("<img src='/images/search.png' alt='search' height=8px width=8px valign=bottom class='btn-green' id='search_command_button'>");
			//result.push("</fieldset>");

			result.push('<div class="search_wrapper">');
			for(var i = 0; i < p_ui.data_list.length; i++)
			{
				var item = p_ui.data_list[i];

				if(i % 2)
				{
					result.push('		  <div class="result_wrapper_grey" path="');
				}
				else
				{
					result.push('		  <div class="result_wrapper" path="');
				}
				result.push(item._id);
				result.push('"><p class="result">');
				result.push(item.home_record.last_name);
				result.push(', ');
				result.push(item.home_record.first_name);
				result.push(' - ');
				result.push(item.home_record.record_id);
				result.push('	(');
				result.push(item.home_record.state_of_death);
				result.push('	) <a href="#/'+ i + '/home_record" role="button" class="btn-purple">select</a> <input type="button" value="delete" onclick="delete_record(' + i + ')"/></p>');
				result.push('</div>');
				
			}
			result.push('		</div>');


			result.push("</section>");

			if(p_ui.url_state.path_array.length > 1)
			{
				for(var i = 0; i < p_metadata.children.length; i++)
				{
					var child = p_metadata.children[i];
					if(child.type.toLowerCase() == 'form' && p_ui.url_state.path_array[1] == child.name)
					{
						if(p_data[child.name] || p_data[child.name] == 0)
						{
							// do nothing 
						}
						else
						{
							p_data[child.name] = create_default_object(child, {})[child.name];
						}

						Array.prototype.push.apply(result, page_render(child, p_data[child.name], p_ui, p_metadata_path  + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));				 		
						
					}
				}
			}

			result.push('<footer class="footer_wrapper">');
			result.push('<p>&nbsp;</p>');
			result.push('</footer>');
		}
       break;
     case 'label':
			result.push("<div class='label' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			result.push("'");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");


			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}

			result.push(p_metadata.prompt);
			result.push("</div>");
			break;
     case 'button':
	 		page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
/*
			result.push("<input class='button' type='button' id='");
			result.push(p_object_path);
			result.push("' ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("' value='");
			}
			else
			{
				result.push(" value='");
			}

			result.push(p_metadata.prompt);
			result.push("' />");*/
			break;
		case 'string':
			result.push("<div class='string' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			result.push("'");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("' ");
			}
			else
			{
				result.push(" ");
			}

			if(p_metadata.validation_description && p_metadata.validation_description.length > 0)
			{
				result.push(" validation-tooltip='");
				result.push(p_metadata.validation_description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}

			result.push("</span><br/>");
			page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
			result.push("</div>");
			
			
			break;
			   
	case 'address':
	case 'textarea':
				result.push("<div  class='textarea' id='");
				result.push(convert_object_path_to_jquery_id(p_object_path));
				result.push("'");

				result.push(" mpath='");
				result.push(p_metadata_path);
				result.push("' ");

				result.push(">");
				result.push("<span ");
				if(p_metadata.description && p_metadata.description.length > 0)
				{
					result.push("rel='tooltip'  data-original-title='");
					result.push(p_metadata.description.replace(/'/g, "\\'"));
					result.push("'>");
				}
				else
				{
					result.push(">");
				}
				
				if(p_is_grid_context && p_is_grid_context == true)
				{

				}
				else
				{
					result.push(p_metadata.prompt);
				}
				
				result.push("</span><br/>");
				page_render_create_textarea(result, p_metadata, p_data, p_metadata_path, p_object_path);
				result.push("</div>");
           break;
     case 'number':
			result.push("<div class='number' ");


			result.push(" id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			result.push("'");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}
			
			result.push("</span> ");
			page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
			result.push("</div>");
			
           break;
     case 'boolean':
			result.push("<div class='boolean' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			result.push("' ");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push(" <input type='checkbox' name='");
			result.push(p_metadata.name);
			if(p_data == true)
			{
				result.push("' checked='true'");
			}
			else
			{
				result.push("'  value='");
			}
			page_render_create_checkbox(result, p_metadata, p_data, p_metadata_path, p_object_path);

			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}
			result.push("</span></div>");

			
			
			result.push("</div>");

            break;
    case 'list':
			if(p_metadata.control_style && p_metadata.control_style.toLowerCase().indexOf("editable") > -1)
			{
				result.push("<div class='list' id='");
				result.push(convert_object_path_to_jquery_id(p_object_path));
				
				result.push("' ");
				result.push(" mpath='");
				result.push(p_metadata_path);
				result.push("' ");
				result.push(">");
				result.push("<span ");

				if(p_metadata.description && p_metadata.description.length > 0)
				{
					result.push("rel='tooltip'  data-original-title='");
					result.push(p_metadata.description.replace(/'/g, "\\'"));
					result.push("'>");
				}
				else
				{
					result.push(">");
				}
				
				if(p_is_grid_context && p_is_grid_context == true)
				{

				}
				else
				{
					result.push(p_metadata.prompt);
				}
				result.push("</span> <br/>");

				if(p_metadata.list_display_size && p_metadata.list_display_size!= "")
				{
					result.push(" <select size=");
					result.push(p_metadata.list_display_size);
					result.push(" name='");
				}
				else if(p_metadata.is_multiselect && p_metadata.is_multiselect == true)
				{
					
					if(p_metadata.values.length > 6)
					{
						result.push("<select size='6' name='");
					}
					else
					{
						result.push(" <select size=");
						result.push(p_metadata.values.length);
						result.push(" name='");
					}
					
				}
				else
				{
					result.push("<select size=");
					result.push(1);
					result.push(" name='");
				}

				result.push(p_metadata.name);
				result.push("'  onchange='g_set_data_object_from_path(\"");
				result.push(p_object_path);
				result.push("\",\"");
				result.push(p_metadata_path);
				result.push("\",this.value)'  ");

				if(p_metadata['is_multiselect'] && p_metadata.is_multiselect == true)
				{
					result.push(" multiple>");

					var metadata_value_list = p_metadata.values;

					if(p_metadata.path_reference && p_metadata.path_reference != "")
					{
						metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

						if(metadata_value_list == null)	
						{
							metadata_value_list = p_metadata.values;
						}
					}

					for(var i = 0; i < metadata_value_list.length; i++)
					{
						var item = metadata_value_list.values[i];
						if(p_data.indexOf(item.value) > -1)
						{
								result.push("<option value='");
								result.push(item.value.replace(/'/g, "&#39;"));
								result.push("' selected>");
								if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
								{
									result.push(item.description);
								}
								else
								{
									result.push(item.value);
								}
								result.push("</option>");
						}
						else
						{
								result.push("<option value='");
								result.push(item.value.replace(/'/g, "&#39;"));
								result.push("' >");
								if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
								{
									result.push(item.description);
								}
								else
								{
									result.push(item.value);
								}
								result.push("</option>");
						}
					}
					result.push("</select>");


				//if(p_metadata.list_display_size && p_metadata.list_display_size!="")
				//{
					result.push("<br/> <input placeholder='Specify Other' class='list' type='text' name='");
					result.push(p_metadata.name);
					result.push("' value='");
					result.push(p_data);
					result.push("' onblur='g_set_data_object_from_path(\"");
					result.push(p_object_path);
					result.push("\",\"");
					result.push(p_metadata_path);
					result.push("\",this.value)' /> <br/> ");
				//}

				}
				else
				{
					result.push(">");



					var metadata_value_list = p_metadata.values;

					if(p_metadata.path_reference && p_metadata.path_reference != "")
					{
						metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

						if(metadata_value_list == null)	
						{
							metadata_value_list = p_metadata.values;
						}
					}

					for(var i = 0; i < metadata_value_list.length; i++)
					{
						var item = metadata_value_list[i];
						if(p_data == item.value)
						{
							result.push("<option value='");
							result.push(item.value.replace(/'/g, "&#39;"));
							result.push("' selected>");
							if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
							{
								result.push(item.description);
							}
							else
							{
								result.push(item.value);
							}
							result.push("</option>");
						}
						else
						{
							result.push("<option value='");
							result.push(item.value.replace(/'/g, "&#39;"));
							result.push("' >");
							if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
							{
								result.push(item.description);
							}
							else
							{
								result.push(item.value);
							}
							result.push("</option>");
						}
					}
					result.push("</select> ");

				//if(p_metadata.list_display_size && p_metadata.list_display_size!="")
				//{
					result.push("<br/> <input placeholder='Specify Other' class='list' type='text' name='");
					result.push(p_metadata.name);
					result.push("' value='");
					result.push(p_data);
					result.push("' onblur='g_set_data_object_from_path(\"");
					result.push(p_object_path);
					result.push("\",\"");
					result.push(p_metadata_path);
					result.push("\",this.value)' /> </div> ");
				//}


				}
			}
			else
			{
				result.push("<div class='list' id='");
				result.push(convert_object_path_to_jquery_id(p_object_path));
				
				result.push("' ");
				result.push(" mpath='");
				result.push(p_metadata_path);
				result.push("' ");
				result.push(">");
				result.push("<span ");
				if(p_metadata.description && p_metadata.description.length > 0)
				{
					result.push("rel='tooltip'  data-original-title='");
					result.push(p_metadata.description.replace(/'/g, "&#39;"));
					result.push("'>");
				}
				else
				{
					result.push(">");
				}
				
				if(p_is_grid_context && p_is_grid_context == true)
				{

				}
				else
				{
					result.push(p_metadata.prompt);
				}
				result.push("</span> <br/> ");

				if(p_metadata.list_display_size && p_metadata.list_display_size!="")
				{
					result.push("<select size=");
					result.push(p_metadata.list_display_size);
					result.push(" name='");
				}
				else if(p_metadata.is_multiselect && p_metadata.is_multiselect == true)
				{
					
					if(p_metadata.values.length > 6)
					{
						result.push("<select size='6' name='");
					}
					else
					{
						result.push("<select size=");
						result.push(p_metadata.values.length);
						result.push(" name='");
					}
					
				}
				else
				{
					result.push("<select size=");
					result.push(1);
					result.push(" name='");
				}

				result.push(p_metadata.name);
				result.push("'  onchange='g_set_data_object_from_path(\"");
				result.push(p_object_path);
				result.push("\",\"");
				result.push(p_metadata_path);
				result.push("\",this.value)'  ");

				if(p_metadata['is_multiselect'] && p_metadata.is_multiselect == true)
				{
					result.push(" multiple>");
					var metadata_value_list = p_metadata.values;

					if(p_metadata.path_reference && p_metadata.path_reference != "")
					{
						metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

						if(metadata_value_list == null)	
						{
							metadata_value_list = p_metadata.values;
						}
					}

					for(var i = 0; i < metadata_value_list.length; i++)
					{
						var item = metadata_value_list[i];
						if(p_data && p_data.indexOf(item.value) > -1)
						{
								result.push("<option value='");
								result.push(item.value.replace(/'/g, "&#39;"));
								result.push("' selected>");
								if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
								{
									result.push(item.description);
								}
								else
								{
									result.push(item.value);
								}
								result.push("</option>");
						}
						else
						{
								result.push("<option value='");
								result.push(item.value.replace(/'/g, "&#39;"));
								result.push("' >");
								if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
								{
									result.push(item.description);
								}
								else
								{
									result.push(item.value);
								}
								result.push("</option>");
						}
					}
					result.push("</select></div>");
				}
				else
				{
					result.push(">");


					var metadata_value_list = p_metadata.values;

					if(p_metadata.path_reference && p_metadata.path_reference != "")
					{
						metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

						if(metadata_value_list == null)	
						{
							metadata_value_list = p_metadata.values;
						}
					}

					for(var i = 0; i < metadata_value_list.length; i++)
					{
						var item = metadata_value_list[i];
						if(p_data == item.value)
						{
							result.push("<option value='");
							result.push(item.value.replace(/'/g, "&#39;"));
							result.push("' selected>");
							if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
							{
								result.push(item.description);
							}
							else
							{
								result.push(item.value);
							}
							result.push("</option>");
						}
						else
						{
							result.push("<option value='");
							result.push(item.value.replace(/'/g, "&#39;"));
							result.push("' >");
							if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
							{
								result.push(item.description);
							}
							else
							{
								result.push(item.value);
							}
							result.push("</option>");
						}
					}
					result.push("</select></div>");
				}
			}

           break;
	case 'date':
	
			if(p_metadata.name == "date_of_screening")
			{
				console.log("break");
			}
			result.push("<div class='date' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			
			result.push("' ");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}

			/*
			result.push("</span><br/> <input  class='date' type='");
			//result.push(p_metadata.type.toLowerCase());
			result.push("text");
			result.push("' name='");
			result.push(p_metadata.name);
			result.push("' value='");
			result.push(p_data.toISOString().split("T")[0]);
			result.push("'  onblur='g_set_data_object_from_path(\"");
			result.push(p_object_path);
			result.push("\",\"");
			result.push(p_metadata_path);
			result.push("\",this.value)'  /></div>");
			*/
			result.push("</span> ");
			result.push("<div style='position:relative'>");
			page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
			result.push("</div>");
			result.push("</div>");

			p_post_html_render.push('flatpickr("#' + convert_object_path_to_jquery_id(p_object_path) + ' .date", {');
			p_post_html_render.push('	utc: true,');
			p_post_html_render.push('	defaultDate: "');
			p_post_html_render.push(p_data);
			p_post_html_render.push('",');
			p_post_html_render.push('	enableTime: false,');
			p_post_html_render.push('  onChange: function(selectedDates, p_value, instance)  ');
			p_post_html_render.push('  {');
			p_post_html_render.push('                g_set_data_object_from_path("' + p_object_path + '", "' + p_metadata_path + '", p_value);');
			p_post_html_render.push('  }');
			p_post_html_render.push('});');


			 break;	
	case 'datetime':
	/*
			if(typeof(p_data) == "string")
			{
				p_data = new Date(p_data);
			}*/
			result.push("<div class='datetime' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			result.push("' ");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			}
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}
			/*
			result.push("</span><br/> <input  class='datetime' type='");
			//result.push(p_metap_datadata.type.toLowerCase());
			result.push("text");
			result.push("'  name='");
			result.push(p_metadata.name);
			result.push("' value='");
			result.push(p_data.toISOString().split("T")[0]);
			result.push("'  onblur='g_set_data_object_from_path(\"");
			result.push(p_object_path);
			result.push("\",\"");
			result.push(p_metadata_path);
			result.push("\",this.value)'  /></div>");
			https://eonasdan.github.io/bootstrap-datetimepicker/

			http://xdsoft.net/jqplugins/datetimepicker/


			*/
			result.push("</span> ");
			result.push("<div style='position:relative'>");
			page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);

			
			p_post_html_render.push('$("#' + convert_object_path_to_jquery_id(p_object_path) + ' input.datetime").datetimepicker({');
			//p_post_html_render.push('	format:"YYYY-MM-DD hh:mm:ss", value: "');
			//p_post_html_render.push('	utc: true, defaultDate: "');
			p_post_html_render.push(' format:"Y-MM-D H:mm:ss",  defaultDate: "');
			//p_post_html_render.push(' defaultDate: "');
			p_post_html_render.push(p_data);
			p_post_html_render.push('"}');
			//p_post_html_render.push('}');
			p_post_html_render.push(');');

			result.push("</div>");	
			result.push("</div>");	
			 break;
		case 'time':
		/*
			if(typeof(p_data) == "string")
			{
				p_data = new Date(p_data);
			}*/
			result.push("<div  class='time' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			
			result.push("' ");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			} 
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}
			/*
			result.push("</span><br/> <input  class='time' type='text' name='");
			result.push(p_metadata.name);
			result.push("' value='");
			result.push(p_data.toISOString().split("T")[1].replace("Z",""));
			result.push("' onblur='g_set_data_object_from_path(\"");
			result.push(p_object_path);
			result.push("\",\"");
			result.push(p_metadata_path);
			result.push("\",this.value)'   /></div>");
			*/
			result.push("</span> ");
			result.push("<div style='position:relative'>");
			page_render_create_input(result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
			result.push("</div>");
			result.push("</div>");

			break;
		case 'chart':
			result.push("<div  class='chart' id='");
			result.push(convert_object_path_to_jquery_id(p_object_path));
			
			result.push("' ");
			result.push(" mpath='");
			result.push(p_metadata_path);
			result.push("' ");
			result.push(">");
			result.push("<span ");
			if(p_metadata.description && p_metadata.description.length > 0)
			{
				result.push("rel='tooltip'  data-original-title='");
				result.push(p_metadata.description.replace(/'/g, "\\'"));
				result.push("'>");
			}
			else
			{
				result.push(">");
			} 
			
			if(p_is_grid_context && p_is_grid_context == true)
			{

			}
			else
			{
				result.push(p_metadata.prompt);
			}
			result.push("</span>");
			result.push("</div>");


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

			break;			
     default:
          console.log("page_render not processed", p_metadata);
       break;
  }

	return result;

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
					res = val.match(/^\d\d\d\d-\d\d-\d\d[ T]?\d\d:\d\d:\d\d$/)
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
		return result.join("") + "]";;
	}
}

function convert_dictionary_path_to_array_field(p_path)
{

	//g_data.prenatal.routine_monitoring.systolic_bp
	//er_visit_and_hospital_medical_records/vital_signs/date_and_time
	//er_visit_and_hospital_medical_records[current_index]/vital_signs[]/date_and_time
	/* [
			er_visit_and_hospital_medical_records[current_index]/vital_signs,
			date_and_time
	 ]

	*/
	//g_data.er_visit_and_hospital_medical_records[current_index].vital_signs[].date_and_time
	//var temp = "g_data." + p_path.replace(new RegExp('/','gm'),".").replace(new RegExp('\\.(\\d+)\\.','gm'),"[$1].").replace(new RegExp('\\.(\\d+)$','g'),"[$1]");

	var result = []
	var temp = "g_data." + p_path.replace(new RegExp('/','gm'),".");
	
	var multi_form_check = temp.split(".") ;
	var check_path = eval(multi_form_check[0] + "." + multi_form_check[1]);
	if(Array.isArray(check_path))
	{
		var new_path = [];
		for(var i = 0; i < multi_form_check.length; i++)
		{
			
			if(i == 1)
			{
				new_path.push(multi_form_check[i] + "[" + $mmria.get_current_multiform_index() + "]");
			}
			else
			{
				new_path.push(multi_form_check[i]);
			}
		}
		var path = new_path.join('.');
		var index = path.lastIndexOf('.');
		result.push(path.substr(0, index));
		result.push(path.substr(index + 1, path.length - (index + 1)));
	}
	else
	{
		var index = temp.lastIndexOf('.');
		result.push(temp.substr(0, index));
		result.push(temp.substr(index + 1, temp.length - (index + 1)));
	}

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

function page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path)
{

	p_result.push("<input  class='");
	p_result.push(p_metadata.type.toLowerCase());
	
	if
	(
		p_metadata.type.toLowerCase() == "number" && 	
		p_metadata.decimal_precision && 
		p_metadata.decimal_precision != ""
	)
	{
				p_result.push(p_metadata.decimal_precision);
	}
	//result.push("'");
	
	p_result.push("' dpath='");
	p_result.push(p_dictionary_path.substring(1, p_dictionary_path.length));
	
	if(p_metadata.type=="button")
	{
		p_result.push("' type='button' name='");
		p_result.push(p_metadata.name);
		p_result.push("' value='");
		p_result.push(p_metadata.prompt.replace(/'/g, "\\'"));
		p_result.push("' ");

		if(p_metadata.type == "")
		{
			p_result.push("placeholder='");
			if(p_metadata.prompt.length > 25)
			{
				p_result.push(p_metadata.prompt.substring(0, 25).replace(/'/g, "\\'"));
			}
			else
			{
				p_result.push(p_metadata.prompt.replace(/'/g, "\\'"));
			}
			
			p_result.push("' ");
		}


		if(g_source_db=="mmrds")
		{
			var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
			if(path_to_onclick_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path)
			}
		}
	}
	else
	{
		p_result.push("' type='text' name='");
		p_result.push(p_metadata.name);
		p_result.push("' value='");
		if(p_data || p_data == 0)
		{ 
			if (typeof p_data === 'string' || p_data instanceof String)
			{
				p_result.push(p_data.replace(/'/g, "&apos;"));
			}
			else
			{
				p_result.push(p_data);
			}
			
		}
		p_result.push("' ");

		/*if
		(
			(
				p_metadata.type.toLowerCase()=="datetime" ||
				p_metadata.type.toLowerCase()=="time"
			) &&
			p_data &&
			p_data != ""
			
		)
		{
			var test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+$/);
			if
			(
				p_metadata.type.toLowerCase()=="time" &&
				test
			)
			{
				var temp_date = new Date(p_data);
				p_result.push(p_data + "Z");
			}
			else
			{
				p_result.push(p_data);
			}
		}
		else
		{*/
		//}
			

	

		if(g_source_db=="mmrds")
		{
			var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
			if(path_to_onfocus_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path)
			}

	/*
			if(
				p_metadata.type == "number" ||
				p_metadata.type == "datetime" ||
				p_metadata.type == "date" ||
				p_metadata.type == "time" 
			)
			{
				page_render_create_onchange_event(p_result, p_metadata, p_metadata_path, p_object_path)
			}
			else */
			f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
			if(path_to_onchange_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path)
			}
			
			f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
			if(path_to_onclick_map[p_metadata_path])
			{
				page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path)
			}
			
			page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path);
		}
	}
/*
	p_result.push("' onblur='g_set_data_object_from_path(\"");
	p_result.push(p_object_path);
	p_result.push("\",\"");
	p_result.push(p_metadata_path);
	p_result.push("\",this.value)' /></div>");*/

	p_result.push("/>");
	
}


function page_render_create_event(p_result, p_event_name, p_code_json, p_metadata_path, p_object_path)
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
	code_array.push(", this);");

	p_result.push(" ");
	p_result.push(p_event_name);
	p_result.push("='");
	p_result.push(code_array.join('').replace(/'/g,"\""));
	p_result.push("'");
	
}


function page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path)
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
	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ob";
	if(path_to_onblur_map[p_metadata_path])
	{
		//var source_code = escodegen.generate(p_metadata.onfocus);
		var code_array = [];
		
		
		code_array.push("(function x" + path_to_int_map[p_metadata_path].toString(16) + "_sob(p_control){\n");
		code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + "_ob");
		code_array.push(".call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", p_control);\n");
		
		code_array.push("g_set_data_object_from_path(\"");
		code_array.push(p_object_path);
		code_array.push("\",\"");
		code_array.push(p_metadata_path);
		code_array.push("\",p_control.value);\n}).call(");
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
		if(p_metadata.type=="boolean")
		{
			p_result.push("\",this.checked)'");
		}
		else
		{
			p_result.push("\",this.value)'");
		}
		
	}
	
}


function page_render_create_onchange_event(p_result, p_metadata, p_metadata_path, p_object_path)
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

	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
	if(path_to_onchange_map[p_metadata_path])
	{
		//var source_code = escodegen.generate(p_metadata.onfocus);
		var code_array = [];
		
		
		code_array.push("(function x" + path_to_int_map[p_metadata_path].toString(16) + "_sob(p_control){\n");
		code_array.push("x" + path_to_int_map[p_metadata_path].toString(16) + "_och");
		code_array.push(".call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", p_control);\n");
		
		code_array.push("g_set_data_object_from_path(\"");
		code_array.push(p_object_path);
		code_array.push("\",\"");
		code_array.push(p_metadata_path);
		code_array.push("\",p_control.value);\n}).call(");
		code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
		code_array.push(", event.target);");

		p_result.push(" onchange='");
		p_result.push(code_array.join('').replace(/'/g,"\""));
		p_result.push("'");
	}
	else
	{
		p_result.push(" onchange='g_set_data_object_from_path(\"");
		p_result.push(p_object_path);
		p_result.push("\",\"");
		p_result.push(p_metadata_path);
		if(p_metadata.type=="boolean")
		{
			p_result.push("\",this.checked)'");
		}
		else
		{
			p_result.push("\",this.value)'");
		}
		
	}
	
}

function page_render_create_checkbox(p_result, p_metadata, p_data, p_metadata_path, p_object_path)
{
	p_result.push("<input  class='checkbox' type='checkbox' name='");
	p_result.push(p_metadata.name);
	if(p_data == true)
	{
		p_result.push("' checked='true'");
	}
	else
	{
		p_result.push("'  value='");
	}
	p_result.push(p_data);
	p_result.push("' ");

	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
	if(path_to_onfocus_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path)
	}

	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
	if(path_to_onchange_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path)
	}
	
	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
	if(path_to_onclick_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path)
	}
	
	page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path);



	p_result.push("/>");
	
}


function page_render_create_textarea(p_result, p_metadata, p_data, p_metadata_path, p_object_path)
{

	p_result.push("<textarea  class='");
	p_result.push(p_metadata.type.toLowerCase());
	//hack
	if(p_metadata.name == "case_opening_overview")
	{
		p_result.push("'<textarea'  rows=5 cols=80 name='");
	}
	else
	{
		p_result.push("'<textarea'  rows=5 cols=40 name='");
	}
	p_result.push(p_metadata.name);
	p_result.push("' ");

	var f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_of";
	if(path_to_onfocus_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onfocus", p_metadata.onfocus, p_metadata_path, p_object_path)
	}

	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ochs";
	if(path_to_onchange_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path)
	}
	
	f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_ocl";
	if(path_to_onclick_map[p_metadata_path])
	{
		page_render_create_event(p_result, "onclick", p_metadata.onclick, p_metadata_path, p_object_path)
	}
	
	page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path);

	p_result.push(" >");
	p_result.push(p_data);
	p_result.push("</textarea>");
	
}

function convert_object_path_to_jquery_id(p_value)
{
	return p_value.replace(/\./g,"_").replace(/\[/g,"_").replace(/\]/g,"_")
}


function make_c3_date(p_value)
{
	//'%Y-%m-%d %H:%M:%S
	
	var date_time = new Date(p_value);

	var result = [];

	result.push(date_time.getFullYear());
	result.push("-");
	result.push(date_time.getMonth() + 1);
	result.push("-");
	result.push(date_time.getDate());

	result.push(" ");
	result.push(date_time.getHours());
	result.push(":");
	result.push(date_time.getMinutes());
	result.push(":");
	result.push(date_time.getSeconds());

	return result.join("");
}