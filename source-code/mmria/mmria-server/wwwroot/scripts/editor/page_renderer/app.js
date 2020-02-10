function app_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render) {
    p_result.push("<section id='app_summary'>");

    /* The Intro */
    p_result.push("<div class='content-intro' tabindex='-1'>");
    p_result.push("<h1 class='content-intro-title h2'>Line Listing Summary</h1>");
    p_result.push("<div class='row align-items-center'>");
        p_result.push("<button type='button' id='add-new-case' class='btn btn-primary' onclick='init_inline_loader(g_ui.add_new_case)'>Add New Case</button>");
        p_result.push("<span class='spinner-container spinner-inline ml-2'><span class='spinner-body text-primary'><span class='spinner'></span></span>");
    p_result.push("</div>");
    p_result.push("</div> <!-- end .content-intro -->");

    p_result.push("<div class='content-intro'>");
    /* Custom Search */
    p_result.push("<div class='form-inline mb-2'>");
    p_result.push("<label for='search_text_box' class='mr-2'> Search for:</label>");
    p_result.push("<input type='text' class='form-control mr-2' id='search_text_box' onchange='g_ui.case_view_request.search_key=this.value;' value='");
    if (g_ui.case_view_request.search_key != null) 
    {
        p_result.push(p_ui.case_view_request.search_key.replace(/'/g, "&quot;"));
    }
    p_result.push("' />");
    p_post_html_render.push("$('#search_text_box').bind(\"enterKey\",function(e){");
    p_post_html_render.push("	get_case_set();");
    p_post_html_render.push(" });");
    p_post_html_render.push("$('#search_text_box').keyup(function(e){");
    p_post_html_render.push("	if(e.keyCode == 13)");
    p_post_html_render.push("	{");
    p_post_html_render.push("	$(this).trigger(\"enterKey\");");
    p_post_html_render.push("	}");
    p_post_html_render.push("});");
    p_result.push("<button type='button' class='btn btn-secondary' alt='search' onclick='init_inline_loader(get_case_set)'>Apply Filters</button>&nbsp; ");
    p_result.push(" <button type='button' class='btn btn-secondary' alt='search' id='search_command_button' onclick='g_ui.case_view_request.search_key = \"\";get_case_set();'>Clear</button>");
    p_result.push(" <span class='spinner-container spinner-inline ml-2'><span class='spinner-body text-primary'><span class='spinner'></span></span></span>");
    p_result.push("</div>");

    p_result.push("<div class='form-inline mb-2'>");
    p_result.push("<label for='search_sort_by' class='mr-2'>Sort by:</label>");
    p_result.push("<select id='search_sort_by' class='custom-select' onchange='g_ui.case_view_request.sort = \"by_\" + this.options[this.selectedIndex].value;'>");
    if (p_ui.case_view_request.sort == "by_date_created") 
    {
        p_result.push("<option selected>date_created</option>");
    }
    else 
    {
        p_result.push("<option selected>date_created</option>");
    }

    if (p_ui.case_view_request.sort == "by_jurisdiction_id") 
    {
        p_result.push("<option>jurisdiction_id</option>");
    }
    else 
    {
        p_result.push("<option>jurisdiction_id</option>");
    }

    if (p_ui.case_view_request.sort == "by_last_name") 
    {
        p_result.push("<option>last_name</option>");
    }
    else 
    {
        p_result.push("<option>last_name</option>");
    }

    if (p_ui.case_view_request.sort == "by_first_name") 
    {
        p_result.push("<option>first_name</option>");
    }
    else 
    {
        p_result.push("<option>first_name</option>");
    }

    if (p_ui.case_view_request.sort == "by_middle_name") 
    {
        p_result.push("<option>middle_name</option>");
    }
    else 
    {
        p_result.push("<option>middle_name</option>");
    }

    if (p_ui.case_view_request.sort == "by_state_of_death") 
    {
        p_result.push("<option>state_of_death</option>");
    }
    else 
    {
        p_result.push("<option>state_of_death</option>");
    }

    if (p_ui.case_view_request.sort == "by_record_id") 
    {
        p_result.push("<option>record_id</option>");
    }
    else 
    {
        p_result.push("<option>record_id</option>");
    }

    if (p_ui.case_view_request.sort == "by_year_of_death") 
    {
        p_result.push("<option>year_of_death</option>");
    }
    else 
    {
        p_result.push("<option>year_of_death</option>");
    }

    if (p_ui.case_view_request.sort == "by_month_of_death") 
    {
        p_result.push("<option>month_of_death</option>");
    }
    else 
    {
        p_result.push("<option>month_of_death</option>");
    }

    if (p_ui.case_view_request.sort == "by_committee_review_date") 
    {
        p_result.push("<option>committee_review_date</option>");
    }
    else 
    {
        p_result.push("<option>committee_review_date</option>");
    }

    if (p_ui.case_view_request.sort == "by_agency_case_id") 
    {
        p_result.push("<option>agency_case_id</option>");
    }
    else 
    {
        p_result.push("<option>agency_case_id</option>");
    }

    if (p_ui.case_view_request.sort == "by_created_by") 
    {
        p_result.push("<option>created_by</option>");
    }
    else 
    {
        p_result.push("<option>created_by</option>");
    }

    if (p_ui.case_view_request.sort == "by_last_updated_by") 
    {
        p_result.push("<option>last_updated_by</option>");
    }
    else 
    {
        p_result.push("<option>last_updated_by</option>");
    }

    if (p_ui.case_view_request.sort == "by_date_last_updated") 
    {
        p_result.push("<option>date_last_updated</option>");
    }
    else 
    {
        p_result.push("<option>date_last_updated</option>");
    }
    p_result.push("</select>");
    p_result.push("</div>");

    /* Records per page */
    p_result.push("<div class='form-inline mb-2'>");
    p_result.push("<label for='search_records_per_page' class='mr-2'>Records per page:</label>");
    p_result.push("<select id='search_records_per_page' class='custom-select' onchange='g_ui.case_view_request.take = this.value;' >");
    if (p_ui.case_view_request.take == 25) 
    {
        p_result.push("<option selected>25</option>");
    }
    else 
    {
        p_result.push("<option>25</option>");
    }

    if (p_ui.case_view_request.take == 50) 
    {
        p_result.push("<option selected>50</option>");
    }
    else 
    {
        p_result.push("<option>50</option>");
    }

    if (p_ui.case_view_request.take == 100) 
    {
        p_result.push("<option selected>100</option>");
    }
    else 
    {
        p_result.push("<option>100</option>");
    }

    if (p_ui.case_view_request.take == 250) 
    {
        p_result.push("<option selected>250</option>");
    }
    else 
    {
        p_result.push("<option>250</option>");
    }

    if (p_ui.case_view_request.take == 500) 
    {
        p_result.push("<option selected>500</option>");
    }
    else 
    {
        p_result.push("<option>500</option>");
    }
    p_result.push("</select>");
    p_result.push("</div>");

    /* Descending Order */
    p_result.push("<div class='form-inline mb-2'>");
    p_result.push("<label for='sort_decending' class='mr-2'>Descending order:</label>");
    p_result.push("<input id='sort_decending' type='checkbox' onchange='g_ui.case_view_request.descending = this.checked;' ");
    if (p_ui.case_view_request.descending) 
    {
        p_result.push(" checked='true' ");
    }
    p_result.push(" />");
    p_result.push("</div>");

    p_result.push("</div> <!-- end .content-intro -->");

    p_result.push("<div class='table-pagination row align-items-center no-gutters'>");
        p_result.push("<div class='col'>");
            p_result.push("<div class='row no-gutters'>");
                p_result.push("<p class='mb-0'>Total Records: ");
                    p_result.push("<strong>" + p_ui.case_view_request.total_rows + "</strong>");
                p_result.push("</p>");
                p_result.push("<p class='mb-0 ml-2 mr-2'>|</p>");
                p_result.push("<p class='mb-0'>Viewing Page(s): ");
                    p_result.push("<strong>" + p_ui.case_view_request.page + "</strong> ");
                    p_result.push("of ");
                    p_result.push("<strong>" + Math.ceil(p_ui.case_view_request.total_rows / p_ui.case_view_request.take) + "</strong>");
                p_result.push("</p>");
            p_result.push("</div>");
        p_result.push("</div>");
        p_result.push("<div class='col row no-gutters align-items-center justify-content-end'>");
            p_result.push("<p class='mb-0'>Select by page:</p>");
            for(var current_page = 1; (current_page - 1) * p_ui.case_view_request.take < p_ui.case_view_request.total_rows; current_page++)
            {
                p_result.push("<button type='button' class='table-btn-link btn btn-link' alt='select page " + current_page + "' onclick='g_ui.case_view_request.page=");
                    p_result.push(current_page);
                    p_result.push(";get_case_set();'>");
                    p_result.push(current_page);
                p_result.push("</button>");
            }
        p_result.push("</div>");
    p_result.push("</div>");

    p_result.push("<table class='table mb-0'>");
    p_result.push("<thead class='thead'>");
    p_result.push("<tr class='tr bg-tertiary'>");
    p_result.push("<th class='th h4' colspan='3' scope='colgroup'>Case Listing</th>");
    p_result.push("</tr>");
    p_result.push("</thead>");
    p_result.push("<thead class='thead'>");
    p_result.push("<tr class='tr'>");
    p_result.push("<th class='th' scope='col'>Case Information</th>");
    p_result.push("<th class='th' scope='col'>Last Updated </th>");
    p_result.push("<th class='th' scope='col'>Actions</th>");
    p_result.push("</tr>");
    p_result.push("</thead>");

    /*
        by_date_created
        by_date_last_updated
        by_last_name
        by_first_name
        by_middle_name
        by_year_of_death
        by_month_of_death
        by_committee_review_date
        by_created_by
        by_last_updated_by
        by_state_of_death

    */
    p_result.push("<tbody class='tbody'>");
    for (var i = 0; i < p_ui.case_view_list.length; i++) 
    {
        var item = p_ui.case_view_list[i];

        if (i % 2) 
        {
            p_result.push('<tr class="tr" path="');
        }
        else 
        {
            p_result.push('<tr class="tr" path="');
        }
        p_result.push(item.id);
        p_result.push('">');

        p_result.push("<td class='td'>");
        p_result.push("<a href='#/")
        p_result.push(i);
        p_result.push("/home_record' role='button' class='btn-purple'>");
        p_result.push(item.value.jurisdiction_id); p_result.push("  :");
        p_result.push(item.value.last_name); p_result.push(", ");
        p_result.push(item.value.first_name); p_result.push(" ");
        p_result.push(item.value.middle_name);
        if (item.value.record_id)
        {
            p_result.push(" - (");
            p_result.push(item.value.record_id);
            p_result.push(" )");
        }
        if (item.value.agency_case_id) 
        {
            p_result.push("  ac_id: ");
            p_result.push(item.value.agency_case_id)
        }
        p_result.push("</a>");
        p_result.push("</td>");

        p_result.push("<td class='td'>");
        p_result.push(item.value.last_updated_by);
        p_result.push(" ");
        p_result.push(item.value.date_last_updated);
        p_result.push("</td>");

        p_result.push("<td class='td' width='200'>");
            // p_result.push("&nbsp;");
            // p_result.push(" <input type='button' value='delete' onclick='delete_record(" + i + ")'/> ");
            // p_result.push("<label for='id_for_record_" + i + "'>press twice to delete =></label>");
            p_result.push("<button type='button' id='id_for_record_" + i + "' class='btn btn-primary' onclick='delete_record(" + i + ")'>Click twice to delete</button>");
            // p_result.push("<input type='button3' id='id_for_record_" + i + "' class='btn btn-primary' value='delete' onclick='delete_record(" + i + ")'/>");
        p_result.push("</td>");


        p_result.push('</tr>');

    }
    p_result.push("</tbody>");
    p_result.push('</table>');

    p_result.push("<div class='table-pagination row align-items-center no-gutters'>");
        p_result.push("<div class='col'>");
            p_result.push("<div class='row no-gutters'>");
                p_result.push("<p class='mb-0'>Total Records: ");
                    p_result.push("<strong>" + p_ui.case_view_request.total_rows + "</strong>");
                p_result.push("</p>");
                p_result.push("<p class='mb-0 ml-2 mr-2'>|</p>");
                p_result.push("<p class='mb-0'>Viewing Page(s): ");
                    p_result.push("<strong>" + p_ui.case_view_request.page + "</strong> ");
                    p_result.push("of ");
                    p_result.push("<strong>" + Math.ceil(p_ui.case_view_request.total_rows / p_ui.case_view_request.take) + "</strong>");
                p_result.push("</p>");
            p_result.push("</div>");
        p_result.push("</div>");
        p_result.push("<div class='col row no-gutters align-items-center justify-content-end'>");
            p_result.push("<p class='mb-0'>Select by page:</p>");
            for(var current_page = 1; (current_page - 1) * p_ui.case_view_request.take < p_ui.case_view_request.total_rows; current_page++) 
            {
                p_result.push("<button type='button' class='table-btn-link btn btn-link' alt='select page " + current_page + "' onclick='g_ui.case_view_request.page=");
                    p_result.push(current_page);
                    p_result.push(";get_case_set();'>");
                    p_result.push(current_page);
                p_result.push("</button>");
            }
        p_result.push("</div>");
    p_result.push("</div>");

    p_result.push("</section>");

    if (p_ui.url_state.path_array.length > 1) 
    {
        if(p_ui.url_state.path_array[1] == "field_search")
        {
            var search_text = p_ui.url_state.path_array[2].replace(/%20/g, " ");
            p_result.push("<section id='field_search_id'>");

            
            quick_edit_header_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, { search_text: search_text });
            
            var search_text_context = get_seach_text_context(p_result, [], p_metadata, p_data, p_dictionary_path, p_metadata_path, p_object_path, search_text);

            render_search_text(search_text_context);

//            p_post_html_render = search_text_context.post_html_render;
            Array.prototype.push.apply(p_post_html_render, search_text_context.post_html_render);
/*
            var search_ctx = { search_text: search_text, is_match: false };
            for (var i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i]

                if(child.type.toLowerCase() == "form")
                {
                    let child_data = p_data[child.name]
                
                    Array.prototype.push.apply(p_result, page_render(child, child_data, p_ui, p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render, search_ctx));
                }
            }
            
*/
            p_result.push("</section>");
        }
        else
        {

            for (var i = 0; i < p_metadata.children.length; i++) 
            {
            
                var child = p_metadata.children[i];
                if (child.type.toLowerCase() == 'form' && p_ui.url_state.path_array[1] == child.name) 
                {
                    if (p_data[child.name] || p_data[child.name] == 0) 
                    {
                        // do nothing 
                    }
                    else 
                    {
                        p_data[child.name] = create_default_object(child, {})[child.name];
                    }

                    Array.prototype.push.apply(p_result, page_render(child, p_data[child.name], p_ui, p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));

                }
            }
        }
    }


}
