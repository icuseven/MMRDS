function app_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render) {


    p_result.push("<section id='app_summary'>");

    /* The Intro */
    p_result.push("<div tabindex='-1'>");
    p_result.push("<h1 class='content-intro-title h2'>Line Listing Summary</h1>");
    p_result.push("<div class='row no-gutters align-items-center'>");
        p_result.push("<button type='button' id='add-new-case' class='btn btn-primary' onclick='init_inline_loader(g_ui.add_new_case)'>Add New Case</button>");
        p_result.push("<span class='spinner-container spinner-inline ml-2'><span class='spinner-body text-primary'><span class='spinner'></span></span>");
    p_result.push("</div>");
    p_result.push("</div> <!-- end .content-intro -->");

    p_result.push(`<hr class="border-top mt-4 mb-4" />`);

    p_result.push("<div class='mb-4'>");
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
    
    // p_result.push(`
    //     <button type="button"
    //             class="btn btn-secondary mr-1"
    //             alt="search"
    //             onclick="init_inline_loader(() => { get_case_set(render_sort_by_include_in_export(p_ui.case_view_request)) })">
    //         Apply Filters
    //     </button>
    //     <button type="button"
    //             class="btn btn-secondary"
    //             alt="search"
    //             id="search_command_button"
    //             onclick="init_inline_loader(() => { clear_case_search() })">
    //         Clear
    //     </button>
    // `);
    p_result.push("</div>");

    p_result.push("<div class='form-inline mb-2'>");
        p_result.push("<label for='search_sort_by' class='mr-2'>Sort:</label>");
        p_result.push("<select id='search_sort_by' class='custom-select' onchange='g_ui.case_view_request.sort = this.options[this.selectedIndex].value;'>");
            p_result.push(`
                ${render_sort_by_include_in_export(p_ui.case_view_request)}
            `);
            // if (p_ui.case_view_request.sort == "by_date_created") 
            // {
            //     p_result.push("<option selected>date_created</option>");
            // }
            // else 
            // {
            //     p_result.push("<option selected>date_created</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_jurisdiction_id") 
            // {
            //     p_result.push("<option>jurisdiction_id</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>jurisdiction_id</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_last_name") 
            // {
            //     p_result.push("<option>last_name</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>last_name</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_first_name") 
            // {
            //     p_result.push("<option>first_name</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>first_name</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_middle_name") 
            // {
            //     p_result.push("<option>middle_name</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>middle_name</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_state_of_death") 
            // {
            //     p_result.push("<option>state_of_death</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>state_of_death</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_record_id") 
            // {
            //     p_result.push("<option>record_id</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>record_id</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_year_of_death") 
            // {
            //     p_result.push("<option>year_of_death</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>year_of_death</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_month_of_death") 
            // {
            //     p_result.push("<option>month_of_death</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>month_of_death</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_committee_review_date") 
            // {
            //     p_result.push("<option>committee_review_date</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>committee_review_date</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_agency_case_id") 
            // {
            //     p_result.push("<option>agency_case_id</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>agency_case_id</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_created_by") 
            // {
            //     p_result.push("<option>created_by</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>created_by</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_last_updated_by") 
            // {
            //     p_result.push("<option>last_updated_by</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>last_updated_by</option>");
            // }

            // if (p_ui.case_view_request.sort == "by_date_last_updated") 
            // {
            //     p_result.push("<option>date_last_updated</option>");
            // }
            // else 
            // {
            //     p_result.push("<option>date_last_updated</option>");
            // }
        p_result.push("</select>");
    p_result.push("</div>");

    /* Records per page */
    p_result.push("<div class='form-inline mb-2'>");
        p_result.push("<label for='search_records_per_page' class='mr-2'>Records per page:</label>");
        p_result.push(`
            <select id="search_records_per_page"
                    class="custom-select"
                    onchange="g_ui.case_view_request.take = this.value;">
                ${render_filter_records_per_page(p_ui.case_view_request)}
            </select>
        `);
        // p_result.push("<select id='search_records_per_page' class='custom-select' onchange='g_ui.case_view_request.take = this.value;' >");
        //     if (p_ui.case_view_request.take == 25) 
        //     {
        //         p_result.push("<option selected>25</option>");
        //     }
        //     else 
        //     {
        //         p_result.push("<option>25</option>");
        //     }

        //     if (p_ui.case_view_request.take == 50) 
        //     {
        //         p_result.push("<option selected>50</option>");
        //     }
        //     else 
        //     {
        //         p_result.push("<option>50</option>");
        //     }

        //     if (p_ui.case_view_request.take == 100) 
        //     {
        //         p_result.push("<option selected>100</option>");
        //     }
        //     else 
        //     {
        //         p_result.push("<option>100</option>");
        //     }

        //     if (p_ui.case_view_request.take == 250) 
        //     {
        //         p_result.push("<option selected>250</option>");
        //     }
        //     else 
        //     {
        //         p_result.push("<option>250</option>");
        //     }

        //     if (p_ui.case_view_request.take == 500) 
        //     {
        //         p_result.push("<option selected>500</option>");
        //     }
        //     else 
        //     {
        //         p_result.push("<option>500</option>");
        //     }
        // p_result.push("</select>");
    p_result.push("</div>");

    /* Descending Order */
    p_result.push("<div class='form-inline mb-3'>");
        p_result.push("<label for='sort_descending' class='mr-2'>Descending order:</label>");
        p_result.push(`
            <input id="sort_descending" type="checkbox" onchange="g_ui.case_view_request.descending = this.checked" ${p_ui.case_view_request.descending && 'checked'} />
        `);
        // p_result.push("<input id='sort_descending' type='checkbox' onchange='g_ui.case_view_request.descending = this.checked;' ");
        // if (p_ui.case_view_request.descending) 
        // {
        //     p_result.push(" checked='true' ");
        // }
        // p_result.push(" />");
    p_result.push("</div>");

    p_result.push("<div class='form-inline'>");
        p_result.push("<button type='button' class='btn btn-secondary' alt='search' onclick='init_inline_loader(function(){ get_case_set() })'>Apply Filters</button>&nbsp;");
        p_result.push("<button type='button' class='btn btn-secondary' alt='search' id='search_command_button' onclick='init_inline_loader(function(){ clear_case_search() })'>Clear</button>");
        p_result.push("<span class='spinner-container spinner-inline ml-2'><span class='spinner-body text-primary'><span class='spinner'></span></span></span>");
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

    // p_result.push("<table class='table mb-0'>");
    // p_result.push("<thead class='thead'>");
    // p_result.push("<tr class='tr bg-tertiary'>");
    // p_result.push("<th class='th h4' colspan='4' scope='colgroup'>Case Listing</th>");
    // p_result.push("</tr>");
    // p_result.push("</thead>");
    // p_result.push("<thead class='thead'>");
    // p_result.push("<tr class='tr'>");
    // p_result.push("<th class='th' scope='col'>Case Information</th>");
    // p_result.push("<th class='th' scope='col'>Date Created</th>");
    // p_result.push("<th class='th' scope='col'>Last Updated</th>");
    // p_result.push("<th class='th' scope='col'>Actions</th>");
    // p_result.push("</tr>");
    // p_result.push("</thead>");

    // /*
    //     by_date_created
    //     by_date_last_updated
    //     by_last_name
    //     by_first_name
    //     by_middle_name
    //     by_year_of_death
    //     by_month_of_death
    //     by_committee_review_date
    //     by_created_by
    //     by_last_updated_by
    //     by_state_of_death

    // */
    // p_result.push("<tbody class='tbody'>");
    // for (var i = 0; i < p_ui.case_view_list.length; i++) 
    // {
    //     var item = p_ui.case_view_list[i];

    //     if (i % 2) 
    //     {
    //         p_result.push('<tr class="tr" path="');
    //     }
    //     else 
    //     {
    //         p_result.push('<tr class="tr" path="');
    //     }
    //     p_result.push(item.id);
    //     p_result.push('">');

    //     p_result.push("<td class='td'>");
    //     p_result.push("<a href='#/")
    //     p_result.push(i);
    //     p_result.push("/home_record' role='button' class='btn-purple'>");
    //     p_result.push(item.value.jurisdiction_id); p_result.push("  :");
    //     p_result.push(item.value.last_name); p_result.push(", ");
    //     p_result.push(item.value.first_name); p_result.push(" ");
    //     p_result.push(item.value.middle_name);
    //     if (item.value.record_id)
    //     {
    //         p_result.push(" - (");
    //         p_result.push(item.value.record_id);
    //         p_result.push(" )");
    //     }
    //     if (item.value.agency_case_id) 
    //     {
    //         p_result.push("  ac_id: ");
    //         p_result.push(item.value.agency_case_id)
    //     }
    //     p_result.push("</a>");
    //     p_result.push("</td>");

    //     p_result.push("<td class='td'>");
    //     p_result.push(item.value.date_created);
    //     p_result.push("</td>");
        
    //     p_result.push("<td class='td'>");
    //     p_result.push(item.value.last_updated_by);
    //     p_result.push(" ");
    //     p_result.push(item.value.date_last_updated);
    //     p_result.push("</td>");

    //     p_result.push("<td class='td' width='200'>");
    //         // p_result.push("&nbsp;");
    //         // p_result.push(" <input type='button' value='delete' onclick='delete_record(" + i + ")'/> ");
    //         // p_result.push("<label for='id_for_record_" + i + "'>press twice to delete =></label>");
    //         p_result.push("<button type='button' id='id_for_record_" + i + "' class='btn btn-primary' onclick='delete_record(" + i + ")'>Click twice to delete</button>");
    //         // p_result.push("<input type='button3' id='id_for_record_" + i + "' class='btn btn-primary' value='delete' onclick='delete_record(" + i + ")'/>");
    //     p_result.push("</td>");


    //     p_result.push('</tr>');

    // }
    // p_result.push("</tbody>");
    // p_result.push('</table>');
    p_result.push(`
      <table class="table mb-0">
          <thead class='thead'>
              <tr class='tr bg-tertiary'>
                  <th class='th h4' colspan='4' scope='colgroup'>Case Listing</th>
              </tr>
          </thead>
          <thead class='thead'>
              <tr class='tr'>
                  <th class='th' scope='col'>Case Information</th>
                  <th class='th' scope='col'>Created By / Date Created</th>
                  <th class='th' scope='col'>Last Updated By / Last Updated</th>
                  <th class='th' scope='col' width='1'>Actions</th>
              </tr>
          </thead>
          <tbody class="tbody">
              ${p_ui.case_view_list.map((item, i) => {
                  return (`
                      <tr class="tr" path="${item.id}">
                          <td class="td">
                              <a href="#/${i}/home_record">
                                  / :${item.value.last_name}, ${item.value.first_name}
                                  ${item.value.record_id && ' - (' + item.value.record_id + ')'}
                                  ${item.value.agency_case_id && ' ac_id: ' + item.value.agency_case_id}
                              </a>
                          </td>
                          <td class="td">
                            ${item.value.created_by} / ${item.value.date_created}
                          </td>
                          <td class="td">
                            ${item.value.last_updated_by} / ${item.value.date_last_updated}
                          </td>
                          <td class="td">
                                <button type="button" id="id_for_record_${i}" class="btn btn-primary d-flex align-items-center" onclick="init_delete_dialog(${i})">
                                    <span class="btn-icon x20 fill-w cdc-icon-trash mr-1"></span>
                                    <span>Delete</span>
                                </button>
                          </td>
                      </tr>
                  `);
              }).join('')}
          </tbody>
      </table>
    `);

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


function render_sort_by_include_in_export(p_sort)
{
	// Not sure how to retrieve these keys so creating them statically
	// TODO: Get with James to make this more dynamic
	const sort_list = [
		'by_date_created',
        'by_date_last_updated',
        'by_last_name',
        'by_first_name',
        'by_middle_name',
        'by_year_of_death',
        'by_month_of_death',
        'by_committee_review_date',
        'by_created_by',
        'by_last_updated_by',
        'by_state_of_death'
	];
	// Empty string to push dynamically created options into
    const f_result = [];

	// <option value="date_created" selected="">date_created</option><option value="jurisdiction_id">jurisdiction_id</option><option value="last_name">last_name</option><option value="first_name">first_name</option><option value="middle_name">middle_name</option><option value="state_of_death">state_of_death</option><option value="record_id">record_id</option><option value="year_of_death">year_of_death</option><option value="month_of_death">month_of_death</option><option value="committee_review_date">committee_review_date</option><option value="agency_case_id">agency_case_id</option><option value="created_by">created_by</option><option value="last_updated_by">last_updated_by</option><option value="date_last_updated">date_last_updated</option>

	// Using the trusty ole' .map method instead of for loop
	sort_list.map((item) => {
		// Ternary: if sort = current item, add selected attr
		// Also remove underscores then capitalize first letter in UI, but not value as that it important for sort
        f_result.push(`<option value="${item}" ${item === p_sort.sort ? 'selected' : ''}>${capitalizeFirstLetter(item).replace(/_/g, ' ')}</option>`);
    });

	return f_result.join(''); // .join('') removes trailing comma in array interation
}


function render_filter_records_per_page(p_sort)
{
    const sort_list = [25, 50, 100, 250, 500];
    const f_result = [];

    sort_list.map((item) => {
        f_result.push(`<option value="${item}" ${item === p_sort.take ? 'selected' : ''}>${item}</option>`)
    });

    return f_result.join('');
}


function clear_case_search() {
    g_ui.case_view_request.search_key = '';
    g_ui.case_view_request.sort = 'by_date_created';
    g_ui.case_view_request.descending = true;

    get_case_set();
}
