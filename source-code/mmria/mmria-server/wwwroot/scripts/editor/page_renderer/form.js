function form_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    if(
        p_metadata.cardinality == "+" ||
        p_metadata.cardinality == "*"
   
   )
   {
       p_result.push("<section id='");
       p_result.push(p_metadata.name);
       p_result.push("_id' class='form'><h2 style='grid-column:1/-1;'");
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

       p_result.push(p_metadata.prompt);
       p_result.push("</h2>");

       if(g_data)
       {
           p_result.push("<h3  style='color: #341c54;grid-column:1/-1;'>");
           p_result.push(g_data.home_record.last_name);
           p_result.push(", ");
           p_result.push(g_data.home_record.first_name);
           if(g_data.home_record.record_id)
           {
               p_result.push("  - ");
               p_result.push(g_data.home_record.record_id);
           }
           p_result.push("</h3>");
       }


        p_result.push('<input path="" type="button" class="btn btn-primary" value="Add New ');
        p_result.push(p_metadata.prompt.replace(/"/g, "\\\""));
        p_result.push(' form" onclick="add_new_form_click(\'' + p_metadata_path + '\',\'' + p_object_path + '\')" />');
       
       p_result.push('<div class="search_wrapper">');
       for(var i = 0; i < p_data.length; i++)
       {
           var item = p_data[i];
           if(item)
           {
               if(i % 2)
               {
                   p_result.push('		  <div class="p_result_wrapper_grey"> <a href="#/');
               }
               else
               {
                   p_result.push('		  <div class="p_result_wrapper"> <a href="#/');
               }
               p_result.push(p_ui.url_state.path_array.join("/"));
               //p_result.push(p_metadata.name);
               p_result.push("/");
               p_result.push(i);
               p_result.push("\">");
               p_result.push('View Record ');
               p_result.push(i + 1);
   
               p_result.push('</a>&nbsp;|&nbsp;');
               
                p_result.push('<a onclick="g_delete_record_item(\'' + p_object_path + "[" + i + "]" + '\', \'' + p_metadata_path + '\')');
                p_result.push("\">");
                p_result.push('Delete Record ');
                p_result.push(i + 1);
                p_result.push('</a>');
               
               p_result.push('</div>');
           }

       }
       p_result.push('		</div>');
       p_result.push("</section>");

       if(p_ui.url_state.path_array.length > 2)
       {
           var data_index = parseInt(p_ui.url_state.path_array[2]);
           var form_item = p_data[data_index];

           p_result.push("<section id='");
           p_result.push(p_metadata.name);
           p_result.push("' class='form'><h2 style='grid-column:1/-1;' ");
           console.log(p_metadata);
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

           p_result.push(p_metadata.prompt);
           


            p_result.push(" <input type='button'  class='btn btn-primary' value='undo' onclick='undo_click()' />");
            p_result.push(" <input type='button'  class='btn btn-primary' value='save' onclick='save_form_click()' />");


           p_result.push("</h2><h4 style='grid-column:1/-1;'>");
           p_result.push(" record: ");
           p_result.push(data_index + 1);
           p_result.push("</h4>");
           
           
           if(g_data)
           {
               p_result.push("<h3  style='color: #341c54;grid-column:1/-1;'>");
               p_result.push(g_data.home_record.last_name);
               p_result.push(", ");
               p_result.push(g_data.home_record.first_name);
               if(g_data.home_record.record_id)
               {
                   p_result.push("  - ");
                   p_result.push(g_data.home_record.record_id);
               }
               p_result.push("</h3>");
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
                   Array.prototype.push.apply(p_result, page_render(child,form_item[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "[" + data_index + "]." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
               }
               else
               {
                   Array.prototype.push.apply(p_result, page_render(child, form_item[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "[" + data_index + "]." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
               }
               
               //p_result.push("</div>");
           }


            p_result.push(" <input type='button'  class='btn btn-primary' value='undo' onclick='undo_click()' />");
            p_result.push(" <input type='button'  class='btn btn-primary' value='save' onclick='save_form_click()' />");
           
           p_result.push("</section>");

       }

   }
   else
   {

       p_result.push("<section id='");
       p_result.push(p_metadata.name);
       p_result.push("_id' class='construct' ");
       
       //p_result.push(" display='grid' grid-template-columns='1fr 1fr 1fr' ");

       p_result.push(" style='' class='form'>");
       p_result.push("<div class='construct__header row no-gutters align-items-start'>");
            p_result.push("<div class='col col-8'>");
                if(g_data)
                {
                    p_result.push("<h2 class='construct__title text-primary h1'>");
                    p_result.push(g_data.home_record.last_name);
                    p_result.push(", ");
                    p_result.push(g_data.home_record.first_name);
                    // if(g_data.home_record.record_id)
                    // {
                    //     p_result.push("  - ");
                    //     p_result.push(g_data.home_record.record_id);
                    // }
                    p_result.push("</h2>");
                }
                if(g_data.home_record.record_id)
                {
                  p_result.push("<p class='construct__info'>");
                    p_result.push("<strong>Record ID:</strong> " + g_data.home_record.record_id);
                  p_result.push("</p>");
                }
                p_result.push("<p class='construct__subtitle'");
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

                    p_result.push(p_metadata.prompt);
                p_result.push("</p>");
            p_result.push("</div>");
            p_result.push("<div class='col col-4 text-right'>");
                p_result.push(" <input type='button' class='btn btn-secondary' value='Undo' onclick='undo_click()' />");
                p_result.push(" <input type='button' class='btn btn-primary' value='Save' onclick='save_form_click()' />");
            p_result.push("</div>");

       p_result.push("</div> <!-- end .construct__header -->"); 
       p_result.push("<div class='construct__body'>");
       p_result.push("<div class='construct-output'>");
       if(g_data && p_metadata.name == "case_narrative")
       {
           //death_certificate/reviewer_note
           p_result.push("<p><h3>Death Certificate</h3>");
           p_result.push("<label>Reviewer's Notes<br/><textarea cols=120 rows=7>");
           p_result.push(g_data.death_certificate.reviewer_note);
           p_result.push("</textarea></label></p>");

           //birth_fetal_death_certificate_parent/reviewer_note
           p_result.push("<p><h3>Birth/Fetal Death Certificate- Parent Section </h3>");
           p_result.push("<label>Reviewer's Notes<br/><textarea cols=120 rows=7>");
           p_result.push(g_data.birth_fetal_death_certificate_parent.reviewer_note);
           p_result.push("</textarea></label></p>");

           
           //birth_certificate_infant_fetal_section/reviewer_note
           p_result.push("<h3>Birth/Fetal Death Certificate- Infant/Fetal Section Reviewer's Notes</h3>");
           for(var i = 0; i < g_data.birth_certificate_infant_fetal_section.length; i++)
           {
               p_result.push("<p><label>Note: ");
               p_result.push(i+1);
               p_result.push("<br/>");
               p_result.push("<textarea cols=120 rows=7>");
               p_result.push(g_data.birth_certificate_infant_fetal_section[i].reviewer_note);
               p_result.push("</textarea></label>");
               p_result.push("</p>");
           }
           
           //autopsy_report/reviewer_note
           p_result.push("<p><h3>Autopsy Report </h3>");
           p_result.push("<label>Reviewer's Notes<br/><textarea cols=120 rows=7>");
           p_result.push(g_data.autopsy_report.reviewer_note);
           p_result.push("</textarea></label></p>");

           
           //prenatal/reviewer_note
           p_result.push("<p><h3>Prenatal Care Record </h3>");
           p_result.push("<label>Reviewer's Notes<br/><textarea cols=120 rows=7>");
           p_result.push(g_data.prenatal.reviewer_note);
           p_result.push("</textarea></label></p>");
           

           
           //er_visit_and_hospital_medical_records/reviewer_note
           p_result.push("<h3>ER Visits and Hospitalizations Reviewer's Notes</h3>");
           for(var i = 0; i < g_data.er_visit_and_hospital_medical_records.length; i++)
           {
               p_result.push("<p><label>Note: ");
               p_result.push(i+1);
               p_result.push("<br/>");
               p_result.push("<textarea cols=120 rows=7>");
               p_result.push(g_data.er_visit_and_hospital_medical_records[i].reviewer_note);
               p_result.push("</textarea></label>");
               p_result.push("</p>");
           }
           
           //other_medical_office_visits/reviewer_note
           p_result.push("<h3>Other Medical Office Visits Reviewer's Notes</h3>");
           for(var i = 0; i < g_data.other_medical_office_visits.length; i++)
           {
               p_result.push("<p><label>Note: ");
               p_result.push(i+1);
               p_result.push("<br/>");
               p_result.push("<textarea cols=120 rows=7>");
               p_result.push(g_data.other_medical_office_visits[i].reviewer_note);
               p_result.push("</textarea></label>");
               p_result.push("</p>");
           }
///medical_transport/transport_narrative_summary
           p_result.push("<h3>Medical Transport Reviewer's Notes</h3>");
           for(var i = 0; i < g_data.medical_transport.length; i++)
           {
               p_result.push("<p><label>Note: ");
               p_result.push(i+1);
               p_result.push("<br/>");
               p_result.push("<textarea cols=120 rows=7>");
               p_result.push(g_data.medical_transport[i].reviewer_note);
               p_result.push("</textarea></label>");
               p_result.push("</p>");
           }
           
           //social_and_environmental_profile/reviewer_note
           p_result.push("<p><h3>Social and Environmental Profile </h3>");
           p_result.push("<label>Reviewer's Notes<br/><textarea cols=120 rows=7>");
           p_result.push(g_data.social_and_environmental_profile.reviewer_note);
           p_result.push("</textarea></label></p>");


           p_result.push("<p><h3>Mental Health Profile </h3>");
           p_result.push("<label>Reviewer's Notes<br/><textarea cols=120 rows=7>");
           p_result.push(g_data.mental_health_profile.reviewer_note);
           p_result.push("</textarea></label></p>");

           p_result.push("<h3>Informant Interviews Reviewer's Notes</h3>");
           for(var i = 0; i < g_data.informant_interviews.length; i++)
           {
               p_result.push("<p><label>Note: ");
               p_result.push(i+1);
               p_result.push("<br/>");
               p_result.push("<textarea cols=120 rows=7>");
               p_result.push(g_data.informant_interviews[i].reviewer_note);
               p_result.push("</textarea></label>");
               p_result.push("</p>");
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
           Array.prototype.push.apply(p_result, page_render(child, p_data[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
       }

        p_result.push("</div> <!-- end .construct-output -->");     
        p_result.push("</div> <!-- end .construct__body -->");     
        p_result.push("<div class='construct__footer'>");
            p_result.push(" <input type='button' class='btn btn-secondary' value='Undo' onclick='undo_click()' />");
            p_result.push(" <input type='button' class='btn btn-primary' value='Save' onclick='save_form_click()' />");
        p_result.push("</div> <!-- end .construct__footer -->"); 
       
       p_result.push("</section>");
   }
}
