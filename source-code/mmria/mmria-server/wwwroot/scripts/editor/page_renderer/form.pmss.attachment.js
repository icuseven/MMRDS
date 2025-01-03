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
        
        <ul>
            <li>Document One <input type="button" value="download" /> | <input type="button" value="delete"></li>
            <li>Document Two <input type="button" value="download" /> | <input type="button" value="delete"></li>
            <li>Document Three <input type="button" value="download" /> | <input type="button" value="delete"></li>
            <li>
                <label for="files" class="sr-only">Upload files</label>
                <input type="file" id="files" class="form-control p-1 h-auto" name="files[]" onchange="readmultifiles(event, this.files)" multiple />
  
                <input type="button" value="upload" />
            </li>
        </ul>
        
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

let g_file_stat_list = []
var attachment_openFile = function (event) 
{

    var input = event.target;


    var reader = new FileReader();
    reader.onload = function () {
        var dataURL = reader.result;
        var output = document.getElementById('output');
        output.value = dataURL;
    };
    reader.readAsText(input.files[0]);
};

function readmultifiles(event, files) 
{
    const self = $(event.target);
    let ul_list = [];
    g_file_stat_list = [];

    self.next('.spinner-inline').fadeIn();

    for (let i = 0; i < files.length; i++) 
    {
        let item = files[i];
        readFile(i);
        g_file_stat_list.push({ name: item.name, index: i })

    }

    function readFile(index) 
    {
        if (index >= files.length) return;

        var file = files[index];
        var reader = new FileReader();
        reader.onload = function (e) {
            // get file content  
            g_content_list[index] = e.target.result;
            // do sth with bin
            readFile(index + 1)
        }
        reader.readAsText(file);

        window.setTimeout(attachment_setup_file_list, 9000);
    }
}

async function attachment_setup_file_list() 
{

    if(g_is_setup_started) return;

    g_is_setup_started = true;

    var el = document.getElementById("files");
    el.disabled = "disabled";

    g_host_state = null;

    let result = false;

    let is_mor = false;
    let is_nat = false;
    let is_fet = false;

    let temp = [];
    let temp_contents = [];

    if (g_file_stat_list.length < 2) 
    {
        //g_validation_errors.add("need at least 2 IJE files. MOR and NAT or FET");
    }

    // process mor file 1st
    for (let i = 0; i < g_file_stat_list.length; i++) 
    {
        let item = g_file_stat_list[i];
        if (typeof item !== "undefined") 
        {
            if (item.name.toLowerCase().endsWith(".mor")) 
            {
                g_cdc_identifier_set = {};
                
                is_mor = true;
                temp[0] = item;
                temp_contents[0] = g_content_list[i];

                var patt = new RegExp("^[0-9]{4}_20[0-9]{2}_[0-2][0-9]_[0-3][0-9]_[A-Z,a-z]{2,9}.[mM][oO][rR]$");

                if (!patt.test(item.name.toLowerCase())) 
                {
                    g_validation_errors.add(`mor file name format incorrect. File name must be in ####_20##_Year_Month_Day_StateCode[2-9] format.\n(e.g. 2021_01_01_KS.mor)\nfound ${item.name}`);
                }

                if (!validate_length(g_content_list[i].split("\n"), mor_max_length)) 
                {
                    g_validation_errors.add("mor File Length !=" + mor_max_length);
                }
                else 
                {
                    var copy = g_content_list[i];
                    var morRows = copy.split("\n");
                    var listOfCdcIdentifier = [];
                    

                    for (var j = 0; morRows.length > j; j++) 
                    {
                        var cdcIdentifier = morRows[j].substring(190, 199);

                        listOfCdcIdentifier.push(cdcIdentifier.trim());
                        g_cdc_identifier_set[cdcIdentifier.trim()] = true;
                    }

                    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
                    var duplicates = findDuplicates(listOfCdcIdentifier)



                    if (duplicates.length > 0) 
                    {
                        var counts = {};
                        var duplicatesMessage = "";
                        duplicates.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

                        for (var k = 0; k < Object.keys(counts).length; k++) 
                        {
                            duplicatesMessage += "\n" + Object.keys(counts)[k] + ', ' + Object.values(counts)[k]
                        }

                        g_validation_errors.add("Duplicate CDC Identifier detected " + duplicatesMessage);
                    }
                }
            }
        }
    }

    for (let i = 0; i < g_file_stat_list.length; i++) 
    {
        let item = g_file_stat_list[i];
        if (typeof item !== "undefined") 
        {
            if (item.name.toLowerCase().endsWith(".mor")) 
            {
                continue;
            }
            else if (item.name.toLowerCase().endsWith(".nat")) 
            {
                is_nat = true;
                temp[1] = item;
                temp_contents[1] = g_content_list[i];

                g_content_list_array = g_content_list[i].split("\n");
                if (!validate_length(g_content_list_array, nat_max_length)) 
                {
                    g_validation_errors.add("nat File Length !=" + nat_max_length);
                }

               let Nat_Ids = validate_AssociatedNAT(g_content_list_array);
               for(let _i = 0;_i < Nat_Ids.length; _i++)
               {
                    let text = Nat_Ids[_i];

                    g_validation_errors.add(text);
                    
               }
            }
            else if (item.name.toLowerCase().endsWith(".fet")) 
            {
                is_fet = true;
                temp[2] = item;
                temp_contents[2] = g_content_list[i];

                g_content_list_array = g_content_list[i].split("\n");

                if (!validate_length(g_content_list_array, fet_max_length)) 
                {
                    g_validation_errors.add("fet File Length !=" + fet_max_length);
                }

                let Fet_Ids = validate_AssociatedFET(g_content_list_array);
                for(let _i = 0;_i < Fet_Ids.length; _i++)
                {
                    let text = Fet_Ids[_i];

                    g_validation_errors.add(text);
                    
                }
            }
        }
    }

    if (is_mor && (is_nat || is_fet)) 
    {
        if
            (!(

                get_state_from_file_name(g_file_stat_list[0].name) &&
                (typeof g_file_stat_list[1] === "undefined" || get_state_from_file_name(g_file_stat_list[1].name)) &&
                (typeof g_file_stat_list[2] === "undefined" || get_state_from_file_name(g_file_stat_list[2].name))
            )

        ) 
        {
            g_validation_errors.add("all IJE files must have same state");
        }
        else 
        {
            g_host_state = get_state_from_file_name(g_file_stat_list[0].name);
        }


    }
    else
    {
        g_host_state = get_state_from_file_name(g_file_stat_list[0].name);
        //g_validation_errors.add("need at least 2 IJE files. MOR and NAT or FET");
    }

    if (!is_mor) 
    {
        g_validation_errors.add("missing .MOR IJE file")
    }

    //if(!is_nat)
    //{
    //    g_validation_errors.add("missing .NAT IJE file")
    //}

    //if(!is_fet)
    //{
    //    g_validation_errors.add("missing .FET IJE file")
    //}
	g_my_roles = await $.ajax
    (
        {
            url: location.protocol + '//' + location.host + '/api/user_role_jurisdiction_view/my-roles',//&search_key=' + g_uid,
            headers: {          
            Accept: "text/plain; charset=utf-8",         
            "Content-Type": "text/plain; charset=utf-8"   
            } 
	    }
    )

    for(const i of g_my_roles.rows)
    {
        const role = i.value;
        if(role.is_active !== true) continue;
        if(role.role_name != "vital_importer") continue;
        
        highest_folder = role.jurisdiction_id;

        break;

    }


    g_jurisdiction_tree = await $.ajax
    (
        {
            url: location.protocol + '//' + location.host + '/vitals/GetJurisdictionTree?j=' + g_host_state,
            type: "GET"
        }
    );


    const case_folder_el = document.getElementById("case-folder");
    case_folder_el.remove(0);
    case_folder_el.removeAttribute("disabled");
    case_folder_el.removeAttribute("aria-disabled");

    if(highest_folder == "/")
    {
        g_case_folder_list.push("Top Folder")
        let newOption = new Option('Top Folder','/', true);
        case_folder_el.add(newOption);
    }

    for (let i = 0; i < g_jurisdiction_tree.children.length; i++) 
    {
        const val = g_jurisdiction_tree.children[i].name;
        if(val.startsWith(highest_folder))
        {
            g_case_folder_list.push(val);
            newOption = new Option(val,val);
            case_folder_el.add(newOption);
        }

    }
    
    g_file_stat_list = temp;
    g_content_list = temp_contents;


    render_file_list()

    return result;

}