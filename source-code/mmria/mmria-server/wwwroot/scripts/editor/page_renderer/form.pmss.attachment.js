function attachment_render(
	p_result,
	p_metadata,
	p_data,
	p_ui,
	p_metadata_path,
	p_object_path,
	p_dictionary_path,
	p_is_grid_context,
	p_post_html_render,
	p_search_ctx,
	p_ctx
) {
	//~~~~~ START SETUP Concurrent Edit
	/*
        Concurrent Edit for Abstractors
        - By default, cases are read only
        - Cases becomes editable once a user checks out the case
        - Once a case is checked out by a user, that particular case is locked for 'other' users
    */
	let currently_locked_by_html = "";
	let enable_edit_disable_attribute = "";
	let undo_disable_attribute = " disabled='disabled' ";
	let save_and_continue_disable_attribute = " disabled='disabled' ";
	let save_and_finish_disable_attribute = " disabled='disabled' ";
	let delete_disable_attribute = " disabled='disabled' ";

	let case_is_locked = is_case_locked(g_data);

	if (case_is_locked) 
    {
		// do nothing for now
	} 
    else if (g_is_data_analyst_mode == null) 
    {
		//if case is checked out by ANYONE
		if (g_data_is_checked_out) 
        {
			// console.log('anyone has locked it out')
			enable_edit_disable_attribute = " disabled='disabled' "; //disabled enable edit btn
			undo_disable_attribute = ""; //enable undo btn
			save_and_continue_disable_attribute = ""; //enable save and continue btn
			save_and_finish_disable_attribute = ""; //enable save and finish btn
			delete_disable_attribute = "";
			currently_locked_by_html =
				"<i>(Currently Locked By: <b>" + g_user_name + "</b>)</i>"; //show user locked info
		}

		//if case is checked out by YOU
		if 
        (
			!is_checked_out_expired(g_data) &&
			g_data.last_checked_out_by === g_user_name
		) 
        {
			// console.log('you')
			enable_edit_disable_attribute = " disabled "; //disable enable edit btn
			currently_locked_by_html = ""; //hide user locked info
			delete_disable_attribute = "";
		}

		//if case is checked out by SOMEONE ELSE
		if 
        (
			!is_checked_out_expired(g_data) &&
			g_data.last_checked_out_by !== g_user_name
		) 
        {
			enable_edit_disable_attribute = " disabled "; //disable enable edit btn
			currently_locked_by_html =
				"<i>(Currently Locked By: <b>" +
				g_data.last_checked_out_by +
				"</b>)</i>"; //show user locked info
		}
	}
	//~~~~~ END SETUP Concurrent Edit

    p_result.push("<section id='attachment_id' class='construct' ");
    p_result.push(" style='' class='construct'>");
    p_result.push("<div data-header='single-form' class='construct__header'>");

    render_validation_error_summary(
        p_result,
        p_metadata,
        p_data,
        p_ui,
        p_metadata_path,
        p_object_path,
        p_dictionary_path,
        p_is_grid_context,
        p_post_html_render,
        p_search_ctx,
        p_ctx
    );

    p_result.push("<div class='construct__header-main position-relative row no-gutters align-items-start'>");
    p_result.push("<div class='col-4 position-static'>");
    if (g_data) 
    {
        p_result.push("<p class='construct__title h1 text-primary single-form-title' tabindex='-1'>");
        p_result.push(get_header_name(g_data.tracking.admin_info.jurisdiction));
        p_result.push(`</p>`);
    }

    p_result.push(`<p><button type="button"  onclick="show_audit_click('${g_data._id}')">View Audit Log</button></p>`);

    p_result.push(" <p class='construct__info mb-0'><strong>Case Folder:</strong> ")
    if(g_data.tracking.admin_info.case_folder == "/")
    {
        p_result.push("Top Folder");
    }
    else
    {
        p_result.push(g_data.tracking.admin_info.case_folder);

    }
    if (g_data.tracking.admin_info.pmssno) 
    {
        p_result.push
        (
            "&nbsp;&nbsp;&nbsp;<strong>PMSS#:</strong> " + g_data.tracking.admin_info.pmssno
        );
        
    }
    p_result.push("</p>");

    p_result.push("<p class='construct__subtitle'");
    if (p_metadata.description && p_metadata.description.length > 0) {
        p_result.push("rel='tooltip' data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "\\'"));
        p_result.push("'>");
    } else {
        p_result.push(">");
    }
    p_result.push(p_metadata.prompt);
    p_result.push("</p>");

    if (g_data.host_state && !isNullOrUndefined(g_data.host_state)) {
        p_result.push(`<p class='construct__info mb-0'>Reporting state: <span>${g_data.host_state}</span></p>`);
    }

    if (
        g_data.tracking.case_status &&
        !isNullOrUndefined(g_data.tracking.case_status.overall_case_status)
    ) {
        let current_value = g_data.tracking.case_status.overall_case_status;
        let look_up = get_metadata_value_node_by_mmria_path(
            g_metadata,
            "/tracking/case_status/overall_case_status",
            ""
        );
        let label = current_value;
        for (let i = 0; i < look_up.values.length; i++) {
            let item = look_up.values[i];
            if (item.value == current_value) {
                label = item.display;
                break;
            }
        }

        p_result.push(
            `<p class='construct__info mb-0'>Case Status: <span>${label}</span></p>`
        );
    }

    if (g_data.date_created && !isNullOrUndefined(g_data.date_created)) {
        let date_part_display_value = convert_datetime_to_local_display_value(g_data.date_created);

        p_result.push(
            `<p class='construct__info mb-0'>Date created: <span>${
                g_data.created_by && g_data.created_by
            } ${date_part_display_value}</span></p>`
        );
    }

    if (
        g_data.date_last_updated &&
        !isNullOrUndefined(g_data.date_last_updated)
    ) {
        let date_part_display_value = convert_datetime_to_local_display_value(
            g_data.date_last_updated
        );

        p_result.push(
            `<p class='construct__info mb-0'>Last server save: <span id='last_updated_span'>${
                g_data.last_updated_by && g_data.last_updated_by
            } ${date_part_display_value}</span></p>`
        );
    }

    p_result.push("</div>");
    p_result.push(
        "<div class='construct__controller col-8 row no-gutters justify-content-end'>"
    );
    p_result.push(
        "<div class='row no-gutters align-items-center justify-content-end'>"
    );
    p_result.push(
        "<span class='spinner-container spinner-inline mr-2'><span class='spinner-body text-primary'><span class='spinner'></span></span></span>"
    );

    if (!(g_is_data_analyst_mode || case_is_locked)) {
        p_result.push(
            `${currently_locked_by_html}
            <input type="button" class="btn btn-primary ml-3" value="Enable Edit" onclick="init_inline_loader(function() { enable_edit_click() })" ${enable_edit_disable_attribute} />
            <input type="button" class="btn btn-primary ml-3" value="Save & Continue" onclick="init_inline_loader(function() { save_form_click() })" ${save_and_continue_disable_attribute} />
            <input type="button" class="btn btn-primary ml-3" value="Save & Finish" onclick="init_inline_loader(function() { save_and_finish_click() })" ${save_and_finish_disable_attribute} />`
        );
    }
    p_result.push("</div>");
    p_result.push("<div class='mt-4 row no-gutters justify-content-end'>");
    render_print_form_control(p_result, p_ui, p_metadata);
    p_result.push("</div>");
    p_result.push("<div class='mt-4 row no-gutters justify-content-end'>");
    if (!(g_is_data_analyst_mode || case_is_locked)) {
        p_result.push(
            `<input type='button' class='btn btn-primary' value='Undo' onclick='init_inline_loader(function() { undo_click() })' ${undo_disable_attribute}/>`
        );
    }
    p_result.push("</div>");
    p_result.push("</div>");
    p_result.push("</div> <!-- end .construct__controller -->");
    p_result.push("</div>");
    p_result.push("</div> <!-- end .construct__header -->");

    p_result.push(
        `<span class="spinner-container spinner-content mb-3">
            <span class="spinner-body text-primary">
            <span class="spinner" aria-hidden="true"></span>
            <span class="spinner-info">Loading...</span>
            </span>
        </span>`
    );

    p_result.push("<div class='construct__body' tabindex='-1'>");

    p_result.push(
        `<div class='construct-output' style='height:800px'>`
    );


       p_result.push(`
        
        <h3>Attachment Area:</h3>
        
        
        `);
    
    

    p_result.push("</div> <!-- end .construct-output -->");
    p_result.push("</div> <!-- end .construct__body -->");
    p_result.push(
        "<div class='construct__footer row no-gutters align-items-center justify-content-start'>"
    );
    if (!(g_is_data_analyst_mode || case_is_locked)) {
        p_result.push(
            `<input type='button' class='btn btn-primary ml-3' value='Save & Continue' onclick='init_inline_loader(save_form_click)' ${save_and_continue_disable_attribute} />
            <input type='button' class='btn btn-primary ml-3' value='Save & Finish' onclick='init_inline_loader(save_and_finish_click)' ${save_and_finish_disable_attribute} />
            <input type='button' class='btn btn-primary ml-3' value='Undo' onclick='init_inline_loader(undo_click)' ${undo_disable_attribute} />`
        );
    }
    p_result.push(`<span class="spinner-container spinner-inline ml-2"><span class="spinner-body text-primary"><span class="spinner"></span></span></span>`);
    p_result.push(`</div> <!-- end .construct__footer -->`);
    p_result.push(`</section>`);

}

function render_validation_error_summary(
	p_result,
	p_metadata,
	p_data,
	p_ui,
	p_metadata_path,
	p_object_path,
	p_dictionary_path,
	p_is_grid_context,
	p_post_html_render,
	p_search_ctx
) {
	p_result.push(
        `<div id="validation_summary" class="construct__header-alert row no-gutters p-2" style="display: none">
            <span class="left-col x32 fill-p cdc-icon-alert_02"></span>
            <div class="right-col pl-3">
                <p class="mb-1">Please correct errors below:</p>
                <ul id="validation_summary_list" class="mb-0">
                    <!-- place alerts here -->
                </ul>
            </div>
        </div>`
    );
}

function quick_edit_header_render(
	p_result,
	p_metadata,
	p_data,
	p_ui,
	p_metadata_path,
	p_object_path,
	p_dictionary_path,
	p_is_grid_context,
	p_post_html_render,
	p_search_ctx
) {
	p_result.push(`<div data-header='quick-edit' class='construct__header'>`);

	let save_and_continue_disable_attribute = " disabled='disabled' ";
	if (!p_search_ctx.is_read_only) {
		save_and_continue_disable_attribute = "";
	}

	render_validation_error_summary(
		p_result,
		p_metadata,
		p_data,
		p_ui,
		p_metadata_path,
		p_object_path,
		p_dictionary_path,
		p_is_grid_context,
		p_post_html_render,
		p_search_ctx
	);

	p_result.push("<div class='construct__header-main row no-gutters'>");
	p_result.push("<div class='col col-8'>");
	if (g_data) 
    {
		p_result.push(
			"<h1 class='construct__title text-primary h1' tabindex='-1'>"
		);
		p_result.push(get_header_name(g_data.tracking.admin_info.jurisdiction));
		p_result.push("</h1>"); 

        
	}
    p_result.push(`<p><button type="button"  onclick="show_audit_click('${g_data._id}')">View Audit Log</button></p>`);
    
    p_result.push(" <p class='construct__info mb-0'><strong>Case Folder:</strong> ")
    if(g_data.tracking.admin_info.case_folder == "/")
    {
        p_result.push("Top Folder");
    }
    else
    {
        p_result.push(g_data.tracking.admin_info.case_folder);

    }
	if (g_data.tracking.admin_info.pmssno) 
    {
		p_result.push
        (
			"&nbsp;&nbsp;&nbsp;<strong>PMSS#:</strong> " + g_data.tracking.admin_info.pmssno
		);
		
	}
    p_result.push("</p>");

	p_result.push("<p class='construct__subtitle'");
	if (p_metadata.description && p_metadata.description.length > 0) {
		p_result.push("rel='tooltip' data-original-title='");
		p_result.push(p_metadata.description.replace(/'/g, "\\'"));
		p_result.push("'>");
	} else {
		p_result.push(">");
	}

	if (g_data.host_state && !isNullOrUndefined(g_data.host_state)) {
		p_result.push(`<p class='construct__info mb-0'>Reporting state: <span>${g_data.host_state}</span></p>`);
	}

	p_result.push(
		"Quick edit results for: <em>" +
			p_search_ctx.search_text +
			"</em><br/><br/>"
	);
	p_result.push("</p>");
	p_result.push("</div>");
	p_result.push("<div class='col col-4 text-right'>");
	if (!p_search_ctx.is_read_only) {
		p_result.push(` <input type='button' class='btn btn-secondary' value='Undo' onclick='undo_click()'/>
                 <input type='button' class='btn btn-primary' value='Save' onclick='save_form_click()' ${save_and_continue_disable_attribute}/>`);
	}
	p_result.push("</div>");
	p_result.push("</div>");
	p_result.push("</div> <!-- end .construct__header -->");
	p_result.push(`
        <span class="spinner-container spinner-content">
            <span class="spinner-body text-primary">
            <span class="spinner" aria-hidden="true"></span>
            <span class="spinner-info">Loading...</span>
            </span>
        </span>
    `);
}

function render_print_form_control(p_result, p_ui, p_metadata, p_data) {
	if (parseInt(p_ui.url_state.path_array[0]) >= 0) {
		p_result.push('<label for="print_case_id" class="sr-only">Print version</label>');
		p_result.push('<select id="print_case_id" onchange="enable_print_button(event)" class="form-control" style="width:280px">');
		p_result.push('<option value="">Select a form to print</option>');
		p_result.push('<optgroup label="Current form">');

		const path_to_check_multi_form = parseInt(p_ui.url_state.path_array[2]);
		const recordNumber = path_to_check_multi_form + 1;

		if (!isNaN(path_to_check_multi_form)) {
			// Render options for specific 'Record Number'
			p_result.push(
				'<option value="' +
					p_metadata.name +
					'" data-record="' +
					recordNumber +
					'">'
			);
			p_result.push(p_metadata.prompt + " (Record " + recordNumber + ")");
			p_result.push("</option>");
		} else if (!isNullOrUndefined(p_data) && isNaN(path_to_check_multi_form)) {
			// Render options for 'Multi Forms'
			p_result.push('<option value="' + p_metadata.name + '">');
			p_result.push("All " + p_metadata.prompt);
			p_result.push("</option>");
		} else {
			// Render print options for 'Single Forms'
			p_result.push('<option value="' + p_metadata.name + '">');
			p_result.push(p_metadata.prompt);
			p_result.push("</option>");
		}
		p_result.push("</optgroup>");

		if
		(
			role_set.size == 1 &&
			role_set.has('vro') 
		)
		{
			// do nothing
		}
		else
		{
			p_result.push('<optgroup label="Other">');
			//p_result.push('<option value="core-summary">Core Elements Only</option>');
			//p_result.push('<option value="all">All Case Forms</option>');
			p_result.push('<option value="all_hidden">All Case Forms</option>');
			p_result.push("</optgroup>");
		}
		p_result.push("</select>");

		p_result.push(`<input type="button" id="print-case-form" class="btn btn-primary ml-3" value="View" onclick="print_case_onclick(event)" disabled="true" />`);
		p_result.push(`<input type="button" id="pdf-case-view-form" class="btn btn-primary ml-3" value="View PDF" onclick="pdf_case_onclick(event, 'view')" disabled="true" />`);
		p_result.push(`<input type="button" id="pdf-case-save-form" class="btn btn-primary ml-3" value="Save PDF" onclick="pdf_case_onclick(event, 'save')" disabled="true" />`);
	}
}

function get_metadata_value_node_by_mmria_path
(
	p_metadata,
	p_search_path,
	p_path
) 
{
	let result = null;
	switch (p_metadata.type.toLowerCase()) {
		case "app":
		case "form":
		case "group":
		case "grid":
			for (let i = 0; i < p_metadata.children.length; i++) {
				let child = p_metadata.children[i];
				result = get_metadata_value_node_by_mmria_path(
					child,
					p_search_path,
					p_path + "/" + child.name
				);
				if (result != null) {
					break;
				}
			}
			break;
		default:
			if (p_search_path == p_path) {
				result = p_metadata;
			}
			break;
	}
	return result;
}


function show_audit_click(p_id)
{
    window.open('./_audit/' + p_id + '/1', '_audit');
   //window.open('./_audit/' + p_id, '_audit');
}

function get_header_name(p_value)
{
	const metadata_value_list = eval(convert_dictionary_path_to_lookup_object("lookup/state"));
	let display_name = p_value;
	for(const element of metadata_value_list)
	{
		if( element.value == p_value)
		{
			const start_index = element.display.indexOf("(");
			const last_index = element.display.indexOf(")");

			display_name = element.display.substring(start_index + 1, last_index);

			break;
		}
	}	
	
	return `${display_name} - ${g_data.tracking.admin_info.track_year} - ${g_data.tracking.death_certificate_number}`;
}