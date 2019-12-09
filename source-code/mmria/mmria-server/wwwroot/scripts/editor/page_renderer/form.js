function form_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{
    if(
        p_metadata.cardinality == "+" ||
        p_metadata.cardinality == "*"
    )
    {
        p_result.push("<section id='");
        p_result.push(p_metadata.name);
        p_result.push("_id' class='construct'>");

            p_result.push("<header class='construct__header content-intro'>");
                if(g_data)
                {
                    p_result.push("<div class='row no-gutters'>");
                        p_result.push("<div class='col col-8'>");
                            p_result.push("<h2 class='construct__title text-primary h1'>");
                            p_result.push(g_data.home_record.last_name);
                            p_result.push(", ");
                            p_result.push(g_data.home_record.first_name);
                            p_result.push("</h2>");
                            if(g_data.home_record.record_id)
                            {
                                p_result.push("<p class='construct__info mb-1'>");
                                p_result.push("<strong>Record ID:</strong> " + g_data.home_record.record_id);
                                p_result.push("</p>");
                            }

                            p_result.push("<p class='construct__subtitle' ");
                            if(p_metadata.description && p_metadata.description.length > 0)
                            {
                                p_result.push("rel='tooltip' data-original-title='");
                                p_result.push(p_metadata.description.replace(/'/g, "\\'"));
                                p_result.push("'>");
                            }
                            else
                            {
                                p_result.push(">");
                            }
                            p_result.push(p_metadata.prompt);
                            p_result.push("</p>");
                        
                            
                            p_result.push('<input path="" type="button" class="btn btn-primary mt-3" value="Add New ');
                            p_result.push(p_metadata.prompt.replace(/"/g, "\\\""));
                            p_result.push(' form" onclick="add_new_form_click(\'' + p_metadata_path + '\',\'' + p_object_path + '\')" />');
                        p_result.push("</div>");
                        p_result.push("<div class='col col-4 row no-gutters align-items-end'>");
                            render_print_form_control(p_result, p_ui, p_metadata);
                        p_result.push("</div>");
                    p_result.push("</div>");
                }
            p_result.push("</header> <!-- end .construct__header -->");
            
            // The 'Records' Table
            p_result.push('<div class="construct__table row no-gutters search_wrapper">');
                p_result.push('<table class="table">');
                    p_result.push('<thead class="thead">');
                        p_result.push('<tr class="tr bg-tertiary">');
                            p_result.push('<th class="th h4" colspan="2">');
                                p_result.push('List of Records');
                            p_result.push('</th>');
                        p_result.push('</tr>');
                    p_result.push('</thead>');
                    p_result.push('<thead class="thead">');
                        p_result.push('<tr class="tr">');
                            p_result.push('<th class="th">');
                                p_result.push('Record Number');
                            p_result.push('</th>');
                            p_result.push('<th class="th">');
                                p_result.push('Actions');
                            p_result.push('</th>');
                        p_result.push('</tr>');
                    p_result.push('</thead>');
                    p_result.push('<tbody class="tbody">');
                        for(var i = 0; i < p_data.length; i++)
                        {
                            var item = p_data[i];
                            if(item)
                            {
                                if(i % 2)
                                {
                                    p_result.push('<tr class=tr"><td class="td"><a href="#/');
                                }
                                else
                                {
                                    p_result.push('<tr class="tr"><td class="td"><a href="#/');
                                }
                                p_result.push(p_ui.url_state.path_array.join("/"));
                                p_result.push("/");
                                p_result.push(i);
                                p_result.push("\">");
                                p_result.push('View Record ');
                                p_result.push(i + 1);
                    
                                p_result.push('</a></td>');
                                
                                p_result.push('<td class="td td--25"><button class="btn btn-primary" onclick="g_delete_record_item(\'' + p_object_path + "[" + i + "]" + '\', \'' + p_metadata_path + '\',\'' + i + '\')');
                                p_result.push("\">");
                                p_result.push('Delete Record');
                                // p_result.push('Delete Record ');
                                // p_result.push(i + 1);
                                p_result.push('</button>');
                                
                                p_result.push('</td>');
                            }

                        }

                    p_result.push('</tbody>');
                p_result.push('</table>');



            p_result.push('</div>');
        p_result.push("</section> <!-- end.construct -->");

        if(p_ui.url_state.path_array.length > 2)
        {
            var data_index = parseInt(p_ui.url_state.path_array[2]);
            var form_item = p_data[data_index];

            p_result.push("<section id='");
            p_result.push(p_metadata.name);
            p_result.push("' class='construct'>");
            
            p_result.push("<header class='construct__header row no-gutters align-items'>");
                p_result.push("<div class='col col-8'>");
                    if(g_data)
                    {
                        p_result.push("<h2 class='construct__title text-primary h1'>");
                        p_result.push(g_data.home_record.last_name);
                        p_result.push(", ");
                        p_result.push(g_data.home_record.first_name);
                        p_result.push("</h2>");
                    }
                    if(g_data.home_record.record_id)
                    {
                        p_result.push("<p class='construct__info mb-1'>");
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
                        p_result.push(' <span>(Record ' + (data_index + 1) + ')<span>');
                    p_result.push("</p>");

                p_result.push("</div>");
                p_result.push("<div class='col col-4 text-right'>");
                    p_result.push("<div>");
                        p_result.push(" <input type='button' class='construct__btn btn btn-secondary' value='Undo' onclick='undo_click()' />");
                        p_result.push(" <input type='button' class='construct__btn btn btn-primary' value='Save' onclick='save_form_click()' />");
                        render_print_form_control(p_result, p_ui, p_metadata);
                    p_result.push("</div>");
                p_result.push("</div>");

            p_result.push("</header>");
            
            p_result.push("<div class='construct__body'>");
            let height_attribute = get_form_height_attribute_height(p_metadata, p_dictionary_path);
            p_result.push(`<div class='construct-output' style='height:${height_attribute}'>`);
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
                            Array.prototype.push.apply(p_result, page_render(child,form_item[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "[" + data_index + "]." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render, p_search_ctx));
                        }
                        else
                        {
                            Array.prototype.push.apply(p_result, page_render(child, form_item[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "[" + data_index + "]." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render, p_search_ctx));
                        }
                    }
                p_result.push("</div>");
            p_result.push("</div>");
            
            p_result.push("<div class='construct__footer'>");
            p_result.push(" <input type='button' class='construct__btn btn btn-primary' value='Save' onclick='save_form_click()' />");
                p_result.push(" <input type='button' class='construct__btn btn btn-secondary' value='Undo' onclick='undo_click()' />");
            p_result.push("</div>");
           
            p_result.push("</section>");
       }

   }
   else
   {
        p_result.push("<section id='");
        p_result.push(p_metadata.name);
        p_result.push("_id' class='construct' ");
        
        //p_result.push(" display='grid' grid-template-columns='1fr 1fr 1fr' ");

        p_result.push(" style='' class='construct'>");
        p_result.push("<div class='construct__header row no-gutters'>");
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
                p_result.push("<p class='construct__info mb-1'>");
                    p_result.push("<strong>Record ID:</strong> " + g_data.home_record.record_id);
                p_result.push("</p>");
                }
                p_result.push("<p class='construct__subtitle'");
                    if(p_metadata.description && p_metadata.description.length > 0)
                    {
                        p_result.push("rel='tooltip' data-original-title='");
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
            p_result.push("<div class='row no-gutters col col-4 justify-content-end'>");
                p_result.push("<div class='construct__controller row no-gutters justify-content-between'>");
                    p_result.push("<div class='row no-gutters justify-content-end mb-1'>");
                        p_result.push("<input type='button' class='construct__btn btn btn-secondary' value='Undo' onclick='undo_click()' />");
                        p_result.push("<input type='button' class='construct__btn btn btn-primary' value='Save' onclick='save_form_click()' />");
                    p_result.push("</div>");
                    render_print_form_control(p_result, p_ui, p_metadata);
                p_result.push("</div>");
            p_result.push("</div>");

        p_result.push("</div> <!-- end .construct__header -->");
        p_result.push("<div class='construct__body'>");

            let height_attribute = get_form_height_attribute_height(p_metadata, p_dictionary_path);
            p_result.push(`<div class='construct-output' style='height:${height_attribute}'>`);

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
                    Array.prototype.push.apply(p_result, page_render(child, p_data[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render, p_search_ctx));
                }

                //~~~ # CASE NARRATIVE FORM
                if(g_data && p_metadata.name == "case_narrative")
                {
                    let noteTitle = null;
                    let noteText = null;
                    let noteURL = null;
                    
                    //~~~ Introduction text
                    p_result.push(`
                        <p class="mt-5">The Reviewer’s Notes below come from each individual form. To make edits, navigate to each form. This content is included for reference in order to complete the Case Narrative at the top of the page.</p>
                    `);

                    //~~~ death_certificate/reviewer_note
                    for (let key in g_data) {
                        if (key == 'death_certificate') {
                            noteTitle = 'Death Certificate';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', 'death_certificate');

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}">Case Form</a></p>
                                <p>${noteText.reviewer_note.length < 1 ? '<em>No data entered</em>' : noteText.reviewer_note}</p>
                            `);
                        }
                    }
                    // p_result.push("<p><h3>Death Certificate</h3>");
                    // p_result.push("<label>Reviewer's Notes<br/><textarea cols=100 rows=7>");
                    // p_result.push(g_data.death_certificate.reviewer_note);
                    // p_result.push("</textarea></label></p>");

                    //~~~ birth_fetal_death_certificate_parent/reviewer_note
                    for (let key in g_data) {
                        if (key == 'birth_fetal_death_certificate_parent') {
                            noteTitle = 'Birth/Fetal Death Certificate- Parent Section';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}">Case Form</a></p>
                                <p>${noteText.reviewer_note.length < 1 ? '<em>No data entered</em>' : noteText.reviewer_note}</p>
                            `);
                        }
                    }
                    // p_result.push("<p><h3>Birth/Fetal Death Certificate- Parent Section </h3>");
                    // p_result.push("<label>Reviewer's Notes<br/><textarea cols=100 rows=7>");
                    // p_result.push(g_data.birth_fetal_death_certificate_parent.reviewer_note);
                    // p_result.push("</textarea></label></p>");

                    //~~~ birth_certificate_infant_fetal_section/reviewer_note
                    for (let key in g_data) {
                        if (key == 'birth_certificate_infant_fetal_section') {
                            let recordType = null; // g_data[key][i].record_type
                            let birthOrder = null; // g_data[key][i].birth_order
                            let timeOfDelivery = null; // g_data[key][i].record_identification.time_of_deliverys
                            noteTitle = 'Birth/Fetal Death Certificate- Infant/Fetal Section';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <ul class="list-unstyled">
                            `);

                            for (let i = 0; i < noteText.length; i++) {
                                recordType = g_data[key][i].record_type;
                                birthOrder = g_data[key][i].birth_order;
                                timeOfDelivery = g_data[key][i].record_identification.time_of_delivery;
                                
                                if (recordType == '0')
                                {
                                    recordType = 'Live Birth';
                                }
                                else if (recordType == '1')
                                {
                                    recordType = 'Fetal Death';
                                }
                                else
                                {
                                    recordType = null;
                                }

                                p_result.push(`
                                    <li>
                                        <p class="mb-2 font-weight-bold">
                                            Reviewer's Notes from <a href="${noteURL}/${i}">Case Form</a>: Record ${i + 1}
                                            ${!isNullOrUndefined(recordType) ? `– ${recordType}` : ''}
                                            ${!isNullOrUndefined(birthOrder) ? `– ${birthOrder}` : ''}
                                            ${!isNullOrUndefined(timeOfDelivery) ? `– ${timeOfDelivery}` : ''}
                                        </p>
                                        <p>${!noteText[i].reviewer_note ? '<em>No data entered</em>' : noteText[i].reviewer_note}</p>
                                    </li>
                                `);
                            }

                            p_result.push(`
                                </ul>
                            `);
                        }
                    }
                    // p_result.push("<h3>Birth/Fetal Death Certificate- Infant/Fetal Section Reviewer's Notes</h3>");
                    // for(var i = 0; i < g_data.birth_certificate_infant_fetal_section.length; i++)
                    // {
                    //     p_result.push("<p><label>Note: ");
                    //     p_result.push(i+1);
                    //     p_result.push("<br/>");
                    //     p_result.push("<textarea cols=100 rows=7>");
                    //     p_result.push(g_data.birth_certificate_infant_fetal_section[i].reviewer_note);
                    //     p_result.push("</textarea></label>");
                    //     p_result.push("</p>");
                    // }
                    
                    //~~~ autopsy_report/reviewer_note
                    for (let key in g_data) {
                        if (key == 'autopsy_report') {
                            noteTitle = 'Autopsy Report';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}">Case Form</a></p>
                                <p>${noteText.reviewer_note.length < 1 ? '<em>No data entered</em>' : noteText.reviewer_note}</p>
                            `);
                        }
                    }
                    // p_result.push("<p><h3>Autopsy Report </h3>");
                    // p_result.push("<label>Reviewer's Notes<br/><textarea cols=100 rows=7>");
                    // p_result.push(g_data.autopsy_report.autopsy_report);
                    // p_result.push("</textarea></label></p>");

                    //~~~ prenatal/reviewer_note
                    for (let key in g_data) {
                        if (key == 'prenatal') {
                            noteTitle = 'Prenatal Care Record';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}">Case Form</a></p>
                                <p>${noteText.reviewer_note.length < 1 ? '<em>No data entered</em>' : noteText.reviewer_note}</p>
                            `);
                        }
                    }
                    // p_result.push("<p><h3>Prenatal Care Record </h3>");
                    // p_result.push("<label>Reviewer's Notes<br/><textarea cols=100 rows=7>");
                    // p_result.push(g_data.prenatal.reviewer_note);
                    // p_result.push("</textarea></label></p>");
                    
                    //~~~ er_visit_and_hospital_medical_records/reviewer_note
                    for (let key in g_data) {
                        if (key == 'er_visit_and_hospital_medical_records') {
                            let arrivalMonth = null; // er_visit_and_hospital_medical_records[0].basic_admission_and_discharge_information.date_of_arrival.month
                            let arrivalDay = null; // er_visit_and_hospital_medical_records[0].basic_admission_and_discharge_information.date_of_arrival.day
                            let arrivalYear = null; // er_visit_and_hospital_medical_records[0].basic_admission_and_discharge_information.date_of_arrival.year
                            let dischargeStatus = null; // g_data.er_visit_and_hospital_medical_records[i].record_identification.time_of_deliverys
                            noteTitle = 'ER Visits and Hospitalizations';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <ul class="list-unstyled">
                            `);

                            for (let i = 0; i < noteText.length; i++) {
                                arrivalMonth = g_data[key][i].basic_admission_and_discharge_information.date_of_arrival.month;
                                arrivalDay = g_data[key][i].basic_admission_and_discharge_information.date_of_arrival.day;
                                arrivalYear = g_data[key][i].basic_admission_and_discharge_information.date_of_arrival.year;
                                dischargeStatus = g_data[key][i].basic_admission_and_discharge_information.discharge_pregnancy_status;

                                if (dischargeStatus == '0')
                                {
                                    dischargeStatus = 'Pregnant, released undelivered';
                                }
                                else if (dischargeStatus == '1')
                                {
                                    dischargeStatus = 'Pregnant, released postpartum';
                                }
                                else if (dischargeStatus == '2')
                                {
                                    dischargeStatus = 'Not pregnant, but pregnant within the last 12 months';
                                }
                                else if (dischargeStatus == '3')
                                {
                                    dischargeStatus = 'Not pregnant, prior 12 months unknown';
                                }
                                else if (dischargeStatus == '4')
                                {
                                    dischargeStatus = 'Not evaluated for pregnancy';
                                }
                                else if (dischargeStatus == '8888')
                                {
                                    dischargeStatus = 'Not Specified';
                                }
                                else 
                                {
                                    dischargeStatus = null;
                                }

                                p_result.push(`
                                    <li>
                                        <p class="mb-2 font-weight-bold">
                                            Reviewer's Notes from <a href="${noteURL}/${i}">Case Form</a>: Record ${i + 1}
                                            ${
                                                !isNullOrUndefined(arrivalMonth) &&
                                                !isNullOrUndefined(arrivalDay) &&
                                                !isNullOrUndefined(arrivalYear) &&
                                                arrivalMonth != '9999' &&
                                                arrivalDay != '9999' &&
                                                arrivalYear != '9999' ?
                                                `– ${arrivalMonth}/${arrivalDay}/${arrivalYear}` : ''
                                            }
                                            ${!isNullOrUndefined(dischargeStatus) ? `– ${dischargeStatus}` : ''}
                                        </p>
                                        <p>${!noteText[i].reviewer_note ? '<em>No data entered</em>' : noteText[i].reviewer_note}</p>
                                    </li>
                                `);
                            }

                            p_result.push(`
                                </ul>
                            `);
                        }
                    }
                    // p_result.push("<h3>ER Visits and Hospitalizations Reviewer's Notes</h3>");
                    // for(var i = 0; i < g_data.er_visit_and_hospital_medical_records.length; i++)
                    // {
                    //     p_result.push("<p><label>Note: ");
                    //     p_result.push(i+1);
                    //     p_result.push("<br/>");
                    //     p_result.push("<textarea cols=100 rows=7>");
                    //     p_result.push(g_data.er_visit_and_hospital_medical_records[i].reviewer_note);
                    //     p_result.push("</textarea></label>");
                    //     p_result.push("</p>");
                    // }
                    
                    //~~~ other_medical_office_visits/reviewer_note
                    for (let key in g_data) {
                        if (key == 'other_medical_office_visits') {
                            let month = null; // g_data[key][i].visit.date_of_medical_office_visit.month
                            let day = null; // g_data[key][i].visit.date_of_medical_office_visit.day
                            let year = null; // g_data[key][i].visit.date_of_medical_office_visit.year
                            let visitType = null; // g_data.g_data[key][i].visit.date_of_medical_office_visit.visit_type
                            let providerType = null; // g_data.g_data[key][i].medical_care_facility.provider_type
                            let pregnancyStatus = null; // g_data.g_data[key][i].medical_care_facility.pregnancy_status
                            noteTitle = 'Other Medical Office Visits';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <ul class="list-unstyled">
                            `);

                            for (let i = 0; i < noteText.length; i++) {
                                month = g_data[key][i].visit.date_of_medical_office_visit.month;
                                day = g_data[key][i].visit.date_of_medical_office_visit.day;
                                year = g_data[key][i].visit.date_of_medical_office_visit.year;
                                visitType = g_data[key][i].visit.visit_type;
                                providerType = g_data[key][i].medical_care_facility.provider_type;
                                pregnancyStatus = g_data[key][i].medical_care_facility.pregnancy_status;

                                if (visitType == '0')
                                {
                                    visitType = 'Initial';
                                }
                                else if (visitType == '1')
                                {
                                    visitType = 'Annual';
                                }
                                else if (visitType == '2')
                                {
                                    visitType = 'Follow Up';
                                }
                                else if (visitType == '3')
                                {
                                    visitType = 'Referral';
                                }
                                else if (visitType == '4')
                                {
                                    visitType = 'Post-Partum';
                                }
                                else if (visitType == '5')
                                {
                                    visitType = 'Other';
                                }
                                else if (visitType == '8888')
                                {
                                    visitType = 'Not Specified';
                                }
                                else 
                                {
                                    visitType = null;
                                }

                                if (providerType == '0')
                                {
                                    providerType = 'OBGYN';
                                }
                                else if (providerType == '1')
                                {
                                    providerType = 'MFM';
                                }
                                else if (providerType == '2')
                                {
                                    providerType = 'Family Practice';
                                }
                                else if (providerType == '3')
                                {
                                    providerType = 'Mental Health Specialist';
                                }
                                else if (providerType == '4')
                                {
                                    providerType = 'Pain Management Clinic';
                                }
                                else if (providerType == '5')
                                {
                                    providerType = 'Treatment Specialist';
                                }
                                else if (providerType == '6')
                                {
                                    providerType = 'Other Subspecialist';
                                }
                                else if (providerType == '7')
                                {
                                    providerType = 'Other';
                                }
                                else if (providerType == '7777')
                                {
                                    providerType = 'Unknown';
                                }
                                else 
                                {
                                    providerType = null;
                                }

                                if (pregnancyStatus == '0')
                                {
                                    pregnancyStatus = 'Pregnant';
                                }
                                else if (pregnancyStatus == '1')
                                {
                                    pregnancyStatus = 'Post-Partum';
                                }
                                else if (pregnancyStatus == '7777')
                                {
                                    pregnancyStatus = 'Unknown';
                                }
                                else 
                                {
                                    pregnancyStatus = null;
                                }

                                p_result.push(`
                                    <li>
                                        <p class="mb-2 font-weight-bold">
                                            Reviewer's Notes from <a href="${noteURL}/${i}">Case Form</a>: Record ${i + 1}
                                            ${
                                                !isNullOrUndefined(month) &&
                                                !isNullOrUndefined(day) &&
                                                !isNullOrUndefined(year) &&
                                                month != '9999' &&
                                                day != '9999' &&
                                                year != '9999' ?
                                                `– ${month}/${day}/${year}` : ''
                                            }
                                            ${!isNullOrUndefined(visitType) ? `– ${visitType}` : ''}
                                            ${!isNullOrUndefined(providerType) ? `– ${providerType}` : ''}
                                            ${!isNullOrUndefined(pregnancyStatus) ? `– ${pregnancyStatus}` : ''}
                                        </p>
                                        <p>${!noteText[i].reviewer_note ? '<em>No data entered</em>' : noteText[i].reviewer_note}</p>
                                    </li>
                                `);
                            }

                            p_result.push(`
                                </ul>
                            `);
                        }
                    }
                    // p_result.push("<h3>Other Medical Office Visits Reviewer's Notes</h3>");
                    // for(var i = 0; i < g_data.other_medical_office_visits.length; i++)
                    // {
                    //     p_result.push("<p><label>Note: ");
                    //     p_result.push(i+1);
                    //     p_result.push("<br/>");
                    //     p_result.push("<textarea cols=100 rows=7>");
                    //     p_result.push(g_data.other_medical_office_visits[i].reviewer_note);
                    //     p_result.push("</textarea></label>");
                    //     p_result.push("</p>");
                    // }

                    //~~~ medical_transport/transport_narrative_summary
                    for (let key in g_data) {
                        if (key == 'medical_transport') {
                            let month = null; // g_data[key][i].date_of_transport.month
                            let day = null; // g_data[key][i].date_of_transport.day
                            let year = null; // g_data[key][i].date_of_transport.year
                            let transportReason = null; // g_data.g_data[key][i].reason_for_transport
                            noteTitle = 'Medical Transport';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <ul class="list-unstyled">
                            `);

                            for (let i = 0; i < noteText.length; i++) {
                                month = g_data[key][i].date_of_transport.month;
                                day = g_data[key][i].date_of_transport.day;
                                year = g_data[key][i].date_of_transport.year;
                                transportReason = g_data[key][i].reason_for_transport

                                p_result.push(`
                                    <li>
                                        <p class="mb-2 font-weight-bold">
                                            Reviewer's Notes from <a href="${noteURL}/${i}">Case Form</a>: Record ${i + 1}
                                            ${
                                                !isNullOrUndefined(month) &&
                                                !isNullOrUndefined(day) &&
                                                !isNullOrUndefined(year) &&
                                                month != '9999' &&
                                                day != '9999' &&
                                                year != '9999' ?
                                                `– ${month}/${day}/${year}` : ''
                                            }
                                            ${!isNullOrUndefined(transportReason) ? `– ${transportReason}` : ''}
                                        </p>
                                        <p>${!noteText[i].reviewer_note ? '<em>No data entered</em>' : noteText[i].reviewer_note}</p>
                                    </li>
                                `);
                            }

                            p_result.push(`
                                </ul>
                            `);
                        }
                    }
                    // p_result.push("<h3>Medical Transport Reviewer's Notes</h3>");
                    // for(var i = 0; i < g_data.medical_transport.length; i++)
                    // {
                    // p_result.push("<p><label>Note: ");
                    // p_result.push(i+1);
                    // p_result.push("<br/>");
                    // p_result.push("<textarea cols=100 rows=7>");
                    // p_result.push(g_data.medical_transport[i].reviewer_note);
                    // p_result.push("</textarea></label>");
                    // p_result.push("</p>");
                    // }
                
                    //~~~ social_and_environmental_profile/reviewer_note
                    for (let key in g_data) {
                        if (key == 'social_and_environmental_profile') {
                            noteTitle = 'Social and Environmental Profile';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}">Case Form</a></p>
                                <p>${noteText.reviewer_note.length < 1 ? '<em>No data entered</em>' : noteText.reviewer_note}</p>
                            `);
                        }
                    }
                    // p_result.push("<p><h3>Social and Environmental Profile </h3>");
                    // p_result.push("<label>Reviewer's Notes<br/><textarea cols=100 rows=7>");
                    // p_result.push(g_data.social_and_environmental_profile.reviewer_note);
                    // p_result.push("</textarea></label></p>");

                    //~~~ mental_health_profile/reviewer_note
                    for (let key in g_data) {
                        if (key == 'mental_health_profile') {
                            noteTitle = 'Social and Environmental Profile';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}">Case Form</a></p>
                                <p>${noteText.reviewer_note.length < 1 ? '<em>No data entered</em>' : noteText.reviewer_note}</p>
                            `);
                        }
                    }
                    // p_result.push("<p><h3>Mental Health Profile </h3>");
                    // p_result.push("<label>Reviewer's Notes<br/><textarea cols=100 rows=7>");
                    // p_result.push(g_data.mental_health_profile.reviewer_note);
                    // p_result.push("</textarea></label></p>");

                    //~~~ informant_interviews/reviewer_note
                    for (let key in g_data) {
                        if (key == 'informant_interviews') {
                            let month = null; // g_data[key][i].date_of_interview.month
                            let day = null; // g_data[key][i].date_of_interview.day
                            let year = null; // g_data[key][i].date_of_interview.year
                            let interviewType = null; // g_data.g_data[key][i].interview_type
                            let relationshipToDeceased = null; // g_data.g_data[key][i].relationship_to_deceased
                            noteTitle = 'Informant Interviews';
                            noteText = g_data[key];
                            noteURL = window.location.hash.replace('case_narrative', key);

                            p_result.push(`
                                <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                                <ul class="list-unstyled">
                            `);

                            for (let i = 0; i < noteText.length; i++) {
                                month = g_data[key][i].date_of_interview.month;
                                day = g_data[key][i].date_of_interview.day;
                                year = g_data[key][i].date_of_interview.year;
                                interviewType = g_data[key][i].interview_type;
                                relationshipToDeceased = g_data[key][i].relationship_to_deceased;

                                if (interviewType == '0')
                                {
                                    interviewType = 'Family';
                                }
                                else if (interviewType == '1')
                                {
                                    interviewType = 'Neighbor';
                                }
                                else if (interviewType == '2')
                                {
                                    interviewType = 'Friend';
                                }
                                else if (interviewType == '3')
                                {
                                    interviewType = 'Witness';
                                }
                                else if (interviewType == '4')
                                {
                                    interviewType = 'Law Enforcement';
                                }
                                else if (interviewType == '5')
                                {
                                    interviewType = 'Healthcare Provider';
                                }
                                else if (interviewType == '6')
                                {
                                    interviewType = 'EMS Transport';
                                }
                                else if (interviewType == '7')
                                {
                                    interviewType = 'Coroner';
                                }
                                else if (interviewType == '8')
                                {
                                    interviewType = 'Medical Examiner';
                                }
                                else if (interviewType == '9')
                                {
                                    interviewType = 'Other';
                                }
                                else if (interviewType == '9999')
                                {
                                    interviewType = null;
                                }
                                else
                                {
                                    interviewType = null
                                }

                                if (relationshipToDeceased == '0')
                                {
                                    relationshipToDeceased = 'None';
                                }
                                else if (relationshipToDeceased == '1')
                                {
                                    relationshipToDeceased = 'Parent';
                                }
                                else if (relationshipToDeceased == '2')
                                {
                                    relationshipToDeceased = 'Grandparent';
                                }
                                else if (relationshipToDeceased == '3')
                                {
                                    relationshipToDeceased = 'Sister';
                                }
                                else if (relationshipToDeceased == '4')
                                {
                                    relationshipToDeceased = 'Brother';
                                }
                                else if (relationshipToDeceased == '5')
                                {
                                    relationshipToDeceased = 'Aunt';
                                }
                                else if (relationshipToDeceased == '6')
                                {
                                    relationshipToDeceased = 'Uncle';
                                }
                                else if (relationshipToDeceased == '7')
                                {
                                    relationshipToDeceased = 'Cousin';
                                }
                                else if (relationshipToDeceased == '8')
                                {
                                    relationshipToDeceased = 'Other';
                                }
                                else if (relationshipToDeceased == '9999')
                                {
                                    relationshipToDeceased = null
                                }
                                else
                                {
                                    relationshipToDeceased = null
                                }

                                p_result.push(`
                                    <li>
                                        <p class="mb-2 font-weight-bold">
                                            Reviewer's Notes from <a href="${noteURL}/${i}">Case Form</a>: Record ${i + 1}
                                            ${
                                                !isNullOrUndefined(month) &&
                                                !isNullOrUndefined(day) &&
                                                !isNullOrUndefined(year) &&
                                                month != '9999' &&
                                                day != '9999' &&
                                                year != '9999' ?
                                                `– ${month}/${day}/${year}` : ''
                                            }
                                            ${!isNullOrUndefined(interviewType) ? `– ${interviewType}` : ''}
                                            ${!isNullOrUndefined(relationshipToDeceased) ? `– ${relationshipToDeceased}` : ''}
                                        </p>
                                        <p>${!noteText[i].reviewer_note ? '<em>No data entered</em>' : noteText[i].reviewer_note}</p>
                                    </li>
                                `);
                            }

                            p_result.push(`
                                </ul>
                            `);
                        }
                    }
                            // noteTitle = 'Informant Interviews';
                            // noteText = g_data.informant_interviews;
                            // noteURL = window.location.hash.replace('case_narrative', 'informant_interviews');

                            // p_result.push(`
                            //     <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                            //     <ul class="list-unstyled">
                            //         ${noteText.map((note, i) => (`
                            //             <li>
                            //                 <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteURL}/${i}">${noteTitle}</a> - Record ${i + 1}</p>
                            //                 <p>${!note.reviewer_note ? '<em>No data entered</em>' : note.reviewer_note}</p>
                            //             </li>
                            //         `)).join("")}
                            //     </ul>
                            // `);
                    // p_result.push("<h3>Informant Interviews Reviewer's Notes</h3>");
                    // for(var i = 0; i < g_data.informant_interviews.length; i++)
                    // {
                    //     p_result.push("<p><label>Note: ");
                    //     p_result.push(i+1);
                    //     p_result.push("<br/>");
                    //     p_result.push("<textarea cols=100 rows=7>");
                    //     p_result.push(g_data.informant_interviews[i].reviewer_note);
                    //     p_result.push("</textarea></label>");
                    //     p_result.push("</p>");
                    // }
                }

                p_result.push("</div> <!-- end .construct-output -->");     
            p_result.push("</div> <!-- end .construct__body -->");     
            p_result.push("<div class='construct__footer'>");
                p_result.push(" <input type='button' class='construct__btn btn btn-secondary' value='Undo' onclick='undo_click()' />");
                p_result.push(" <input type='button' class='construct__btn btn btn-primary' value='Save' onclick='save_form_click()' />");
            p_result.push("</div> <!-- end .construct__footer -->"); 
        
        p_result.push("</section>");
    }
}


function quick_edit_header_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{
    p_result.push("<div class='construct__header row no-gutters'>");
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
          p_result.push("<p class='construct__info mb-1'>");
            p_result.push("<strong>Record ID:</strong> " + g_data.home_record.record_id);
          p_result.push("</p>");
        }
        p_result.push("<p class='construct__subtitle'");
            if(p_metadata.description && p_metadata.description.length > 0)
            {
                p_result.push("rel='tooltip' data-original-title='");
                p_result.push(p_metadata.description.replace(/'/g, "\\'"));
                p_result.push("'>");
            }
            else
            {
                p_result.push(">");
            }

            p_result.push("Quick edit results for: <em>" + p_search_ctx.search_text + "</em><br/><br/>");
            //p_result.push(p_metadata.prompt);
        p_result.push("</p>");
    p_result.push("</div>");
    p_result.push("<div class='col col-4 text-right'>");
        p_result.push(" <input type='button' class='construct__btn btn btn-secondary' value='Undo' onclick='undo_click()' />");
        p_result.push(" <input type='button' class='construct__btn btn btn-primary' value='Save' onclick='save_form_click()' />");
    p_result.push("</div>");

    p_result.push("</div> <!-- end .construct__header -->");

}


function render_print_form_control(p_result, p_ui, p_metadata)
{
    if(parseInt(p_ui.url_state.path_array[0]) >= 0)
    {
        // p_result.push('<div>');
            p_result.push('<label for="print_case" class="sr-only">Print version</label>');
            p_result.push('<select id="print_case_id" class="form-control mt-2" onChange="print_case_onchange()">');
                p_result.push('<option>Select to print a form</option>');
                p_result.push('<optgroup label="Current form">');
                    p_result.push('<option value="' + p_metadata.name + '">');
                    p_result.push('Print ' + p_metadata.prompt)
                    p_result.push('</option>');
                p_result.push('</optgroup>');
                p_result.push('<optgroup label="Other">');
                    p_result.push('<option value="core-summary">Print Core Elements Only</option>');
                    p_result.push('<option value="all">Print All</option>');  
                p_result.push('</optgroup>');
            p_result.push('</select>');
        // p_result.push('</div>');
    }
}