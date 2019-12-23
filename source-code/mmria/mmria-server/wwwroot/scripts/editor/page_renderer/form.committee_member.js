function form_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
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
                    p_result.push("<div class='row no-gutters align-items-start'>");
                    p_result.push("<h2 class='construct__title text-primary h1'>");
                    p_result.push(g_data.home_record.last_name);
                    p_result.push(", ");
                    p_result.push(g_data.home_record.first_name);
                    p_result.push("</h2>");
                    p_result.push("</div>");
                }

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
                p_result.push('<input path="" type="button" class="btn btn-primary" value="Add New ');
                p_result.push(p_metadata.prompt.replace(/"/g, "\\\""));
                p_result.push(' form" onclick="add_new_form_click(\'' + p_metadata_path + '\',\'' + p_object_path + '\')" />');
            p_result.push("</header> <!-- end .construct__header -->");

            // The 'Records' Table
            p_result.push('<div class="construct__table row no-gutters search_wrapper">');
                p_result.push('<table class="table">');

                    p_result.push(`
                        <thead class="thead">
                            <tr class="tr bg-tertiary">
                                <th class="th h4" colspan="99"  scope="colgroup">List of Records</th>
                            </tr>
                        </thead>
                    `);

                    //~~ birth_certificate_infant_fetal_section
                    if (p_metadata.name === 'birth_certificate_infant_fetal_section')
                    {
                        p_result.push(`
                            <thead class="thead">
                                <tr class="tr">
                                    <th class="th" scope="col">Record #</th>
                                    <th class="th" scope="col">Record Type</th>
                                    <th class="th" scope="col">Birth Order</th>
                                    <th class="th" scope="col">Time of Delivery</th>
                                    <th class="th" width="120" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="tbody">
                        `);
                        for(let i = 0; i < p_data.length; i++)
                        {
                            let item = p_data[i];
                            let url = `${window.location.pathname}#${p_ui.url_state.path_array.join("/")}`; // /Case#0/birth_certificate_infant_fetal_section/
                            let recordType = g_value_to_display_lookup[`/${p_metadata.name}/record_type`][g_data[p_metadata.name][i].record_type]; // lookup

                            p_result.push(`
                                <tr class="tr">
                                    <td class="td">
                                        <a href="${url}/${i}">View Record ${i+1}</a>
                                    </td>
                                    <td class="td">${recordType}</td>
                                    <td class="td">${item.birth_order}</td>
                                    <td class="td">${item.record_identification.time_of_delivery}</td>
                                    <td class="td"><button class="btn btn-primary" onclick="g_delete_record_item('${p_object_path}[${i}]', '${p_metadata_path}', '${i}')">Delete Record</button></td>
                                </tr>
                            `);
                        }
                    }

                    //~~ er_visit_and_hospital_medical_records
                    else if (p_metadata.name === 'er_visit_and_hospital_medical_records')
                    {
                        p_result.push(`
                            <thead class="thead">
                                <tr class="tr">
                                    <th class="th" scope="col">Record #</th>
                                    <th class="th" scope="col">Date of Arrival</th>
                                    <th class="th" scope="col">Discharge Pregnancy Status</th>
                                    <th class="th" width="120" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="tbody">
                        `);
                        for(let i = 0; i < p_data.length; i++)
                        {
                            let item = p_data[i];
                            let url = `${window.location.pathname}#${p_ui.url_state.path_array.join("/")}`; // /Case#0/birth_certificate_infant_fetal_section/
                            let arrivalMonth = g_value_to_display_lookup[`/${p_metadata.name}/basic_admission_and_discharge_information/date_of_arrival/month`][g_data[p_metadata.name][i].basic_admission_and_discharge_information.date_of_arrival.month];
                            let arrivalDay = g_value_to_display_lookup[`/${p_metadata.name}/basic_admission_and_discharge_information/date_of_arrival/day`][g_data[p_metadata.name][i].basic_admission_and_discharge_information.date_of_arrival.day];
                            let arrivalYear = g_value_to_display_lookup[`/${p_metadata.name}/basic_admission_and_discharge_information/date_of_arrival/year`][g_data[p_metadata.name][i].basic_admission_and_discharge_information.date_of_arrival.year];
                            let pregStatus = g_value_to_display_lookup[`/${p_metadata.name}/basic_admission_and_discharge_information/discharge_pregnancy_status`][g_data[p_metadata.name][i].basic_admission_and_discharge_information.discharge_pregnancy_status];

                            p_result.push(`
                                <tr class="tr">
                                    <td class="td">
                                        <a href="${url}/${i}">View Record ${i+1}</a>
                                    </td>
                                    <td class="td">
                                        ${
                                            !isNullOrUndefined(arrivalMonth) && arrivalMonth !== '(blank)' &&
                                            !isNullOrUndefined(arrivalDay) && arrivalDay !== '(blank)' &&
                                            !isNullOrUndefined(arrivalYear) && arrivalYear !== '(blank)' ?
                                            `${arrivalMonth}/${arrivalDay}/${arrivalYear}` : ''
                                        }
                                    </td>
                                    <td class="td">${pregStatus}</td>
                                    <td class="td"><button class="btn btn-primary" onclick="g_delete_record_item('${p_object_path}[${i}]', '${p_metadata_path}', '${i}')">Delete Record</button></td>
                                </tr>
                            `);
                        }
                    }

                    //~~ other_medical_office_visits
                    else if (p_metadata.name === 'other_medical_office_visits')
                    {
                        p_result.push(`
                            <thead class="thead">
                                <tr class="tr">
                                    <th class="th" scope="col">Record #</th>
                                    <th class="th" scope="col">Date of Medical Office Visit</th>
                                    <th class="th" scope="col">Visit Type</th>
                                    <th class="th" scope="col">Provider Type</th>
                                    <th class="th" scope="col">Pregnancy Status</th>
                                    <th class="th" width="120" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="tbody">
                        `);
                        for(let i = 0; i < p_data.length; i++)
                        {
                            let item = p_data[i];
                            let url = `${window.location.pathname}#${p_ui.url_state.path_array.join("/")}`; // /Case#0/birth_certificate_infant_fetal_section/
                            let visitMonth = g_value_to_display_lookup[`/${p_metadata.name}/visit/date_of_medical_office_visit/month`][g_data[p_metadata.name][i].visit.date_of_medical_office_visit.month];
                            let visitDay = g_value_to_display_lookup[`/${p_metadata.name}/visit/date_of_medical_office_visit/day`][g_data[p_metadata.name][i].visit.date_of_medical_office_visit.day];
                            let visitYear = g_value_to_display_lookup[`/${p_metadata.name}/visit/date_of_medical_office_visit/year`][g_data[p_metadata.name][i].visit.date_of_medical_office_visit.year];
                            let visitType = g_value_to_display_lookup[`/${p_metadata.name}/visit/visit_type`][g_data[p_metadata.name][i].visit.visit_type];
                            let providerType = g_value_to_display_lookup[`/${p_metadata.name}/medical_care_facility/provider_type`][g_data[p_metadata.name][i].medical_care_facility.provider_type];
                            let pregnancyStatus = g_value_to_display_lookup[`/${p_metadata.name}/medical_care_facility/pregnancy_status`][g_data[p_metadata.name][i].medical_care_facility.pregnancy_status];

                            p_result.push(`
                                <tr class="tr">
                                    <td class="td">
                                        <a href="${url}/${i}">View Record ${i+1}</a>
                                    </td>
                                    <td class="td">
                                        ${
                                            !isNullOrUndefined(visitMonth) && visitMonth !== '(blank)' &&
                                            !isNullOrUndefined(visitDay) && visitDay !== '(blank)' &&
                                            !isNullOrUndefined(visitYear) && visitYear !== '(blank)' ?
                                            `${visitMonth}/${visitDay}/${visitYear}` : ''
                                        }
                                    </td>
                                    <td class="td">${visitType}</td>
                                    <td class="td">${providerType}</td>
                                    <td class="td">${pregnancyStatus}</td>
                                    <td class="td"><button class="btn btn-primary" onclick="g_delete_record_item('${p_object_path}[${i}]', '${p_metadata_path}', '${i}')">Delete Record</button></td>
                                </tr>
                            `);
                        }
                    }

                    //~~ medical_transport
                    if (p_metadata.name === 'medical_transport')
                    {
                        p_result.push(`
                            <thead class="thead">
                                <tr class="tr">
                                    <th class="th" scope="col">Record #</th>
                                    <th class="th" scope="col">Date of Transport</th>
                                    <th class="th" scope="col" width="600">Reason for Transport</th>
                                    <th class="th" width="120" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="tbody">
                        `);
                        for(let i = 0; i < p_data.length; i++)
                        {
                            let item = p_data[i];
                            let url = `${window.location.pathname}#${p_ui.url_state.path_array.join("/")}`; // /Case#0/medical_transport/
                            let transportMonth = g_value_to_display_lookup[`/${p_metadata.name}/date_of_transport/month`][g_data[p_metadata.name][i].date_of_transport.month];
                            let transportDay = g_value_to_display_lookup[`/${p_metadata.name}/date_of_transport/day`][g_data[p_metadata.name][i].date_of_transport.day];
                            let transportYear = g_value_to_display_lookup[`/${p_metadata.name}/date_of_transport/year`][g_data[p_metadata.name][i].date_of_transport.year];

                            p_result.push(`
                                <tr class="tr">
                                    <td class="td">
                                        <a href="${url}/${i}">View Record ${i+1}</a>
                                    </td>
                                    <td class="td">
                                        ${
                                            !isNullOrUndefined(transportMonth) && transportMonth !== '(blank)' &&
                                            !isNullOrUndefined(transportDay) && transportDay !== '(blank)' &&
                                            !isNullOrUndefined(transportYear) && transportYear !== '(blank)' ?
                                            `${transportMonth}/${transportDay}/${transportYear}` : ''
                                        }
                                    </td>
                                    <td class="td">${item.reason_for_transport}</td>
                                    <td class="td"><button class="btn btn-primary" onclick="g_delete_record_item('${p_object_path}[${i}]', '${p_metadata_path}', '${i}')">Delete Record</button></td>
                                </tr>
                            `);
                        }
                    }

                    //~~ informant_interviews
                    if (p_metadata.name === 'informant_interviews')
                    {
                        p_result.push(`
                            <thead class="thead">
                                <tr class="tr">
                                    <th class="th" scope="col">Record #</th>
                                    <th class="th" scope="col">Date of Interview</th>
                                    <th class="th" scope="col">Interview Type</th>
                                    <th class="th" scope="col">Relationship to Deceased</th>
                                    <th class="th" width="120" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="tbody">
                        `);
                        for(let i = 0; i < p_data.length; i++)
                        {
                            let item = p_data[i];
                            let url = `${window.location.pathname}#${p_ui.url_state.path_array.join("/")}`; // /Case#0/informant_interviews/
                            let interviewMonth = g_value_to_display_lookup[`/${p_metadata.name}/date_of_interview/month`][g_data[p_metadata.name][i].date_of_interview.month];
                            let interviewDay = g_value_to_display_lookup[`/${p_metadata.name}/date_of_interview/day`][g_data[p_metadata.name][i].date_of_interview.day];
                            let interviewYear = g_value_to_display_lookup[`/${p_metadata.name}/date_of_interview/year`][g_data[p_metadata.name][i].date_of_interview.year];
                            let interviewType = g_value_to_display_lookup[`/${p_metadata.name}/interview_type`][g_data[p_metadata.name][i].interview_type];
                            let relationshipToDeceased = g_value_to_display_lookup[`/${p_metadata.name}/relationship_to_deceased`][g_data[p_metadata.name][i].relationship_to_deceased];

                            p_result.push(`
                                <tr class="tr">
                                    <td class="td">
                                        <a href="${url}/${i}">View Record ${i+1}</a>
                                    </td>
                                    <td class="td">
                                        ${
                                            !isNullOrUndefined(interviewMonth) && interviewMonth !== '(blank)' &&
                                            !isNullOrUndefined(interviewDay) && interviewDay !== '(blank)' &&
                                            !isNullOrUndefined(interviewYear) && interviewYear !== '(blank)' ?
                                            `${interviewMonth}/${interviewDay}/${interviewYear}` : ''
                                        }
                                    </td>
                                    <td class="td">${interviewType}</td>
                                    <td class="td">${relationshipToDeceased}</td>
                                    <td class="td"><button class="btn btn-primary" onclick="g_delete_record_item('${p_object_path}[${i}]', '${p_metadata_path}', '${i}')">Delete Record</button></td>
                                </tr>
                            `);
                        }
                    }
                    
                    // for(var i = 0; i < p_data.length; i++)
                    // {
                    //     var item = p_data[i];
                    //     if(item)
                    //     {
                    //         if(i % 2)
                    //         {
                    //             p_result.push('<tr class=tr"><td class="td"><a href="#/');
                    //         }
                    //         else
                    //         {
                    //             p_result.push('<tr class="tr"><td class="td"><a href="#/');
                    //         }
                    //         p_result.push(p_ui.url_state.path_array.join("/"));
                    //         p_result.push("/");
                    //         p_result.push(i);
                    //         p_result.push("\">");
                    //         p_result.push('View Record ');
                    //         p_result.push(i + 1);
                    //         p_result.push('</a></td>');
                    //     }

                    // }
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
                p_result.push("' class='form construct'>");
                p_result.push("<div class='construct__header'>");
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
                p_result.push("</header> <!-- end .construct__header -->");

                p_result.push("<div class='construct__body'>");


                    let height_attribute = get_form_height_attribute_height(p_metadata, p_dictionary_path);
                    p_result.push(`<div class='construct-output' style='height:${height_attribute}'>`);
                        for(var i = 0; form_item && i < p_metadata.children.length; i++)
                        {
                            var child = p_metadata.children[i];
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
                        }
                    p_result.push("</div>");
                p_result.push("</div> <!-- end .construct__body -->");
            p_result.push("</section>");
       }
   }
   else
   {
       p_result.push("<section id='");
       p_result.push(p_metadata.name);
       p_result.push("_id' class='construct' ");
       p_result.push(" style='' class='construct'>");
       p_result.push("<div class='construct__header row no-gutters align-items-start'>");
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
                p_result.push("</p>");
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
            Array.prototype.push.apply(p_result, page_render(child, p_data[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));
        }
        
        //~~~ # CASE NARRATIVE FORM
        if(g_data && p_metadata.name == "case_narrative")
        {
            let noteTitle = null;
            let noteUrl = null;
            let notes = null;
            
            //~~~ Introduction text
            p_result.push(`
                <p class="mt-5">The Reviewer’s Notes below come from each individual form. This content is included for reference in order to complete the Case Narrative at the top of the page.</p>
            `);

            //~~~~~~~ LOOPS through each key and prints out data unique to that form
            for (let key in g_data) 
            {
                //~~~ death_certificate
                if (key === 'death_certificate') 
                {
                    noteTitle = 'Death Certificate';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteUrl}">Case Form</a></p>
                        <p>${notes.reviewer_note.length < 1 ? '<em>No data entered</em>' : notes.reviewer_note}</p>
                    `);
                }

                //~~~ birth_fetal_death_certificate_parent
                else if (key === 'birth_fetal_death_certificate_parent')
                {
                    noteTitle = 'Birth/Fetal Death Certificate- Parent Section';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteUrl}">Case Form</a></p>
                        <p>${notes.reviewer_note.length < 1 ? '<em>No data entered</em>' : notes.reviewer_note}</p>
                    `);
                }

                //~~~ birth_certificate_infant_fetal_section
                else if (key === 'birth_certificate_infant_fetal_section') 
                {
                    noteTitle = 'Birth/Fetal Death Certificate- Infant/Fetal Section';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <ul class="list-unstyled">
                    `);

                    for (let i = 0; i < notes.length; i++) 
                    {
                        let recordType = g_value_to_display_lookup[`/${key}/record_type`][g_data[key][i].record_type];
                        let birthOrder = g_data[key][i].birth_order;
                        let timeOfDelivery = g_data[key][i].record_identification.time_of_delivery;

                        p_result.push(`
                            <li>
                                <p class="mb-2 font-weight-bold">
                                    Reviewer's Notes from <a href="${noteUrl}/${i}">Case Form</a>: Record ${i + 1}
                                    ${ !isNullOrUndefined(recordType) ? `– ${recordType}` : '' }
                                    ${ !isNullOrUndefined(birthOrder) ? `– ${birthOrder}` : '' }
                                    ${ !isNullOrUndefined(timeOfDelivery) ? `– ${timeOfDelivery}` : '' }
                                </p>
                                <p>${!notes[i].reviewer_note ? '<em>No data entered</em>' : notes[i].reviewer_note}</p>
                            </li>
                        `);
                    }
                    
                    p_result.push(`
                        </ul>
                    `);
                }

                //~~~ autopsy_report
                else if (key === 'autopsy_report') 
                {
                    noteTitle = 'Autopsy Report';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteUrl}">Case Form</a></p>
                        <p>${notes.reviewer_note.length < 1 ? '<em>No data entered</em>' : notes.reviewer_note}</p>
                    `);
                }

                //~~~ prenatal
                else if (key === 'prenatal') 
                {
                    noteTitle = 'Prenatal Care Record';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteUrl}">Case Form</a></p>
                        <p>${notes.reviewer_note.length < 1 ? '<em>No data entered</em>' : notes.reviewer_note}</p>
                    `);
                }

                //~~~ er_visit_and_hospital_medical_records
                else if (key === 'er_visit_and_hospital_medical_records') 
                {
                    noteTitle = 'ER Visits and Hospitalizations';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <ul class="list-unstyled">
                    `);

                    for (let i = 0; i < notes.length; i++) 
                    {
                        let month = g_value_to_display_lookup[`/${key}/basic_admission_and_discharge_information/date_of_arrival/month`][g_data[key][i].basic_admission_and_discharge_information.date_of_arrival.month];
                        let day = g_value_to_display_lookup[`/${key}/basic_admission_and_discharge_information/date_of_arrival/day`][g_data[key][i].basic_admission_and_discharge_information.date_of_arrival.day];
                        let year = g_value_to_display_lookup[`/${key}/basic_admission_and_discharge_information/date_of_arrival/year`][g_data[key][i].basic_admission_and_discharge_information.date_of_arrival.year];
                        let dischargeStatus = g_value_to_display_lookup[`/${key}/basic_admission_and_discharge_information/discharge_pregnancy_status`][g_data[key][i].basic_admission_and_discharge_information.discharge_pregnancy_status];

                        p_result.push(`
                            <li>
                                <p class="mb-2 font-weight-bold">
                                    Reviewer's Notes from <a href="${noteUrl}/${i}">Case Form</a>: Record ${i + 1}
                                    ${
                                        !isNullOrUndefined(month) &&
                                        !isNullOrUndefined(day) &&
                                        !isNullOrUndefined(year) &&
                                        month != '(blank)' &&
                                        day != '(blank)' &&
                                        year != '(blank)' ?
                                        `– ${month}/${day}/${year}` : ''
                                    }
                                    ${!isNullOrUndefined(dischargeStatus) && dischargeStatus !== '(blank)' ? `– ${dischargeStatus}` : ''}
                                </p>
                                <p>${!notes[i].reviewer_note ? '<em>No data entered</em>' : notes[i].reviewer_note}</p>
                            </li>
                        `);
                    }

                    p_result.push(`
                        </ul>
                    `);
                }

                //~~ other_medical_office_visits
                else if (key === 'other_medical_office_visits') 
                {
                    noteTitle = 'Other Medical Office Visits';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <ul class="list-unstyled">
                    `);

                    for (let i = 0; i < notes.length; i++) 
                    {
                        let month = g_value_to_display_lookup[`/${key}/visit/date_of_medical_office_visit/month`][g_data[key][i].visit.date_of_medical_office_visit.month];
                        let day = g_value_to_display_lookup[`/${key}/visit/date_of_medical_office_visit/day`][g_data[key][i].visit.date_of_medical_office_visit.day];
                        let year = g_value_to_display_lookup[`/${key}/visit/date_of_medical_office_visit/year`][g_data[key][i].visit.date_of_medical_office_visit.year];
                        let visitType = g_value_to_display_lookup[`/${key}/visit/visit_type`][g_data[key][i].visit.visit_type];
                        let providerType = g_value_to_display_lookup[`/${key}/medical_care_facility/provider_type`][g_data[key][i].medical_care_facility.provider_type];
                        let pregnancyStatus = g_value_to_display_lookup[`/${key}/medical_care_facility/pregnancy_status`][g_data[key][i].medical_care_facility.pregnancy_status];

                        p_result.push(`
                            <li>
                                <p class="mb-2 font-weight-bold">
                                    Reviewer's Notes from <a href="${noteUrl}/${i}">Case Form</a>: Record ${i + 1}
                                    ${
                                        !isNullOrUndefined(month) &&
                                        !isNullOrUndefined(day) &&
                                        !isNullOrUndefined(year) &&
                                        month != '(blank)' &&
                                        day != '(blank)' &&
                                        year != '(blank)' ?
                                        `– ${month}/${day}/${year}` : ''
                                    }
                                    ${!isNullOrUndefined(visitType) && visitType !== '(blank)' ? `– ${visitType}` : ''}
                                    ${!isNullOrUndefined(providerType) && providerType !== '(blank)' ? `– ${providerType}` : ''}
                                    ${!isNullOrUndefined(pregnancyStatus) && pregnancyStatus !== '(blank)' ? `– ${pregnancyStatus}` : ''}
                                </p>
                                <p>${!notes[i].reviewer_note ? '<em>No data entered</em>' : notes[i].reviewer_note}</p>
                            </li>
                        `);
                    }

                    p_result.push(`
                        </ul>
                    `);
                }

                else if (key === 'medical_transport')
                {
                    noteTitle = 'Medical Transport';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <ul class="list-unstyled">
                    `);

                    for (let i = 0; i < notes.length; i++) {
                        let month = g_value_to_display_lookup[`/${key}/date_of_transport/month`][g_data[key][i].date_of_transport.month];
                        let day = g_value_to_display_lookup[`/${key}/date_of_transport/day`][g_data[key][i].date_of_transport.day];
                        let year = g_value_to_display_lookup[`/${key}/date_of_transport/year`][g_data[key][i].date_of_transport.year];
                        let reasonForTransport = g_data[key][i].reason_for_transport;

                        p_result.push(`
                            <li>
                                <p class="mb-2 font-weight-bold">
                                    Reviewer's Notes from <a href="${noteUrl}/${i}">Case Form</a>: Record ${i + 1}
                                    ${
                                        !isNullOrUndefined(month) &&
                                        !isNullOrUndefined(day) &&
                                        !isNullOrUndefined(year) &&
                                        month != '(blank)' &&
                                        day != '(blank)' &&
                                        year != '(blank)' ?
                                        `– ${month}/${day}/${year}` : ''
                                    }
                                    ${!isNullOrUndefined(reasonForTransport) ? `– ${reasonForTransport}` : ''}
                                </p>
                                <p>${!notes[i].reviewer_note ? '<em>No data entered</em>' : notes[i].reviewer_note}</p>
                            </li>
                        `);
                    }

                    p_result.push(`
                        </ul>
                    `);
                }

                else if (key === 'social_and_environmental_profile')
                {
                    noteTitle = 'Social and Environmental Profile';
                    noteUrl = window.location.hash.replace(p_metadata.name, key);
                    notes = g_data[key];

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteUrl}">Case Form</a></p>
                        <p>${notes.reviewer_note.length < 1 ? '<em>No data entered</em>' : notes.reviewer_note}</p>
                    `);
                }

                else if (key === 'mental_health_profile')
                {
                    noteTitle = 'Social and Environmental Profile';
                    notes = g_data[key];
                    noteUrl = window.location.hash.replace(p_metadata.name, key);

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <p class="mb-2 font-weight-bold">Reviewer's Notes from <a href="${noteUrl}">Case Form</a></p>
                        <p>${notes.reviewer_note.length < 1 ? '<em>No data entered</em>' : notes.reviewer_note}</p>
                    `);
                }

                else if (key === 'informant_interviews')
                {
                    noteTitle = 'Informant Interviews';
                    noteUrl = window.location.hash.replace(p_metadata.name, key); // replace 'case_narrative' with 'informant_interviews'
                    notes = g_data[key]; // array of forms

                    p_result.push(`
                        <h3 class="font-weight-bold mb-2">${noteTitle}</h3>
                        <ul class="list-unstyled">
                    `);

                    for (let i = 0; i < notes.length; i++) {
                        let month = g_value_to_display_lookup[`/${key}/date_of_interview/month`][g_data[key][i].date_of_interview.month];
                        let day = g_value_to_display_lookup[`/${key}/date_of_interview/day`][g_data[key][i].date_of_interview.day];
                        let year = g_value_to_display_lookup[`/${key}/date_of_interview/year`][g_data[key][i].date_of_interview.year];
                        let interviewType = g_value_to_display_lookup[`/${key}/interview_type`][g_data[key][i].interview_type];
                        let relationshipToDeceased = g_value_to_display_lookup[`/${key}/relationship_to_deceased`][g_data[key][i].relationship_to_deceased];

                        p_result.push(`
                            <li>
                                <p class="mb-2 font-weight-bold">
                                    Reviewer's Notes from <a href="${noteUrl}/${i}">Case Form</a>: Record ${i + 1}
                                    ${
                                        !isNullOrUndefined(month) &&
                                        !isNullOrUndefined(day) &&
                                        !isNullOrUndefined(year) &&
                                        month != '(blank)' &&
                                        day != '(blank)' &&
                                        year != '(blank)' ?
                                        `– ${month}/${day}/${year}` : ''
                                    }
                                    ${!isNullOrUndefined(interviewType) && interviewType !== '(blank)' ? `– ${interviewType}` : ''}
                                    ${!isNullOrUndefined(relationshipToDeceased) && relationshipToDeceased !== '(blank)' ? `– ${relationshipToDeceased}` : ''}
                                </p>
                                <p>${!notes[i].reviewer_note ? '<em>No data entered</em>' : notes[i].reviewer_note}</p>
                            </li>
                        `);
                    }

                    p_result.push(`
                        </ul>
                    `);
                }
            }
        }

        p_result.push("</div> <!-- end .construct-output -->");     
        p_result.push("</div> <!-- end .construct__body -->");
        
        p_result.push("</section>");
   }
}
