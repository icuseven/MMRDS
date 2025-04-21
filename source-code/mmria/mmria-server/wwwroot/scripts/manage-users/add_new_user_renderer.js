var new_user_roles = [];
var audit_history = [];
var can_undo = false;
const ACTION_TYPE = {
    ADD_USER: 'add_user',
    ADD_ROLE: 'add_role',
    DELETE_ROLE: 'delete_role',
    EDIT_ROLE: 'edit_role',
    EDIT_PASSWORD: 'edit_password',
    EDIT_USERNAME: 'edit_username',
}

function add_new_user_render() {
    const result = `
        <div class="d-flex mt-4">
            <div>
                <h2 class="h4">User Info</h2>
            </div>
            <div class="ml-auto">
                <button onclick="save_new_user()" class="btn primary-button">Save New User</button>
                <button onclick="audit_history_undo()" id="audit_history_undo_button" ${can_undo === true ? '' : 'disabled'} aria-disabled="${can_undo ? 'false' : 'true'}" class="btn primary-button">Undo</button>
            </div>
        </div>
        <div class="d-flex">
            <div class="vertical-control required col-4 pl-0">
                <label>Username (i.e., Email Address)</label>
                <input autocomplete="off" class="form-control" type="text" id="new_user_email" value="${g_user.name}">
            </div>
            <div class="vertical-control required col-4 pl-0 pr-0">
                <label>Password</label>
                <div class="input-group">
                    <input type="password" autocomplete="off" class="form-control" id="new_user_password">
                    <div class="input-group-append">
                        <button id="show_hide_password"  aria-label="Show password" onclick="show_hide_password('new_user_password')" type="button" class="btn btn-inline-primary mr-3">
                            <span class="x22 fill-p cdc-icon-eye-solid"></span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="vertical-control required col-4 pl-0 pr-0">
                <label>Verify Password</label>
                <div class="input-group">
                    <input type="password" autocomplete="off" class="form-control" id="new_user_password_verify">
                    <div class="input-group-append">
                        <button id="show_hide_password_verify" aria-label="Show password verify" onclick="show_hide_password('new_user_password_verify')" type="button" class="btn btn-inline-primary">
                            <span class="x22 fill-p cdc-icon-eye-solid"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex">
            <div id="username_validation" class="col-4 pl-0 pr-2"></div>
            <div id="password_validation" class="col-4 pl-0 pr-2"></div>
            <div id="password_verify_validation" class="col-4 pl-0 pr-2"></div>
        </div>
        <div class="d-flex flex-column mt-4">
            <div>
                <h2 class="h4">Assigned Roles</h2>
            </div>
            <table class="table mt-3">
                <thead>
                    <tr class="header-level-2 sticky-header z-index-top">
                        <th>Role Name</th>
                        <th>Case Folder Access</th>
                        <th>Effective Start Date</th>
                        <th>Effective End Date</th>
                        <th>Active Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="new_user_roles">
                    ${add_assigned_role("")}
                </tbody>
            </table>
            <div class="d-flex ml-auto mt-2">
                <button class="btn secondary-button col-12" aria-label="Add new role" onclick="add_new_role()">
                    Add New Role
                </button>
            </div>
        </div>
    `;
    show_hide_user_management_back_button(true);
    set_page_title("Add New User");
    document.getElementById('form_content_id').innerHTML = result;
}

function show_hide_password(field_id) {
    const passwordField = document.getElementById(field_id);
    const button = passwordField.nextElementSibling.querySelector('button');
    const icon = button.querySelector('span');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('cdc-icon-eye-solid');
        icon.classList.remove('x22');
        icon.classList.add('x24');
        icon.classList.add('cdc-icon-minus');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('cdc-icon-minus');
        icon.classList.remove('x24');
        icon.classList.add('x22');
        icon.classList.add('cdc-icon-eye-solid');
    }
}

function add_assigned_role(p_user_jurisdiction) {
    const unique_guid = $mmria.get_new_guid();
    new_user_roles.push({
        _id: unique_guid,
        role_name : "",
        user_id: "",
        jurisdiction_id: "",
        effective_start_date: new Date(new Date().setHours(0,0,0,0)),
        effective_end_date: g_policy_values.default_days_in_effective_date_interval != null && parseInt(g_policy_values.default_days_in_effective_date_interval) >0? new Date(new Date().getTime() + parseInt(g_policy_values.default_days_in_effective_date_interval)*24*60*60*1000).setHours(0,0,0,0) : "",
        is_active: true,
        date_created: new Date(),
        created_by: g_current_u_id,
        date_last_updated: new Date(),
        last_updated_by: g_current_u_id,
        data_type:"user_role_jursidiction"
    });
    const role_set = get_role_list();
    const temp_result = [];
    temp_result.push("<option value=''>Select Role</option>");
    role_set.forEach(role => {
        if(role !== "") {
            var role_name = role.split('_');
            role_name = role_name.map(section => {
                if (section === 'steve' || section === 'mmria' || section === 'prams')
                    return section.toUpperCase();
                else
                    return section[0].toUpperCase() + section.slice(1);
            });
            temp_result.push("<option ");
            if(p_user_jurisdiction.role_name === role)
                temp_result.push( "selected ");
            temp_result.push("value ='" + role + "'>");
            temp_result.push(role_name.join(" "));
            temp_result.push("</option>");
        }
    });
    const result = `
        <tr id="${unique_guid}_role">
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select id="${unique_guid}_role_type" aria-label="Select Role" class="form-select form-control role-select-controls" aria-label="Select user role">
                        ${temp_result.join("")}
                    </select>
                    <span id="${unique_guid}_role_type_validation" class="col-12 data-cell-error-message pl-0 pr-0"></span>
                </div>
            </td>
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select id="${unique_guid}_role_jurisdiction_type" aria-label="Select folder" class="form-select form-control role-jursidiction-controls" aria-label="Select case access folder">
                        ${user_role_jurisdiction_render(g_jurisdiction_tree, p_user_jurisdiction.jurisdiction_id, 0, p_user_jurisdiction.user_id).join("")}
                    </select>
                    <span id="${unique_guid}_role_jurisdiction_validation" class="col-12 data-cell-error-message pl-0 pr-0"></span>
                </div>
            </td>
            <td>
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <input value="${format_date(new Date().toISOString())}" id="${unique_guid}_role_effective_start_date" aria-label="Effective Start Date for role ${unique_guid}" autocomplete="off" class="form-control mb-4" type="date" placeholder="MM/DD/YYYY">
                    <span id="${unique_guid}_role_start_date_validation" class="col-12 data-cell-error-message pl-0 pr-0"></span>
                </div>
            </td>
            <td>
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <input id="${unique_guid}_role_effective_end_date" aria-label="Effective End Date for role ${unique_guid}" autocomplete="off" class="form-control mb-4" type="date" placeholder="MM/DD/YYYY">
                    <span id="${unique_guid}_role_end_date_validation" class="col-12 data-cell-error-message pl-0 pr-0"></span>           
                </div>  
            </td>
            <td>
                <div class="vertical-control col-md-12">
                    <fieldset>
                        <legend class="accessible-hide">Active Status</legend>
                        <div class="form-check">
                            <input checked class="form-check-input big-radio" name="${unique_guid}_role_active_status" type="radio" value="true" id="${unique_guid}_role_active_status_true">
                            <label class="form-check-label" for="${unique_guid}_role_active_status_true">
                                Active
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input big-radio" type="radio" value="false" name="${unique_guid}_role_active_status" id="${unique_guid}_role_active_status_false">
                            <label class="form-check-label" for="${unique_guid}_role_active_status_false">
                                Inactive
                            </label>
                        </div>
                    </fieldset>
                </div>
            </td>
            <td class="d-flex pt-3 justify-content-center border-none">
                <button id="${unique_guid}_delete" class="btn delete-button col-12" aria-label="Delete role" onclick="delete_new_role('${unique_guid}')">
                    Delete Role
                </button>
            </td>
        </tr>
    `;
    return result;
}

function delete_new_role(p_role_id) {
    const p_role_index = new_user_roles.findIndex(role => role._id === p_role_id);
    if (p_role_index !== -1) {
        new_user_roles.splice(p_role_index, 1);
        $(`#${p_role_id}_role`).remove();
        console.log(new_user_roles);
        if (new_user_roles.length <= 0) {
            $("#new_user_roles").append('<tr id="no-roles-placeholder" class="text-center"><td colspan="6">No roles assigned.</td></tr>');
        }
    } else {
        console.error(`Role with id ${p_role_id} not found`);
    }
}

function add_new_role() {
    $("#no-roles-placeholder").remove();
    console.log("Adding new role");
    console.log(new_user_roles);
    $('#new_user_roles').append(add_assigned_role(""));
}

$(document).on('input', '#new_user_password, #new_user_password_verify', function() {
    checkPasswordsMatch();
});

$(document).on('change', 'input[type="text"], input[type="password"]', user_email_change);

function user_email_change() 
{
    const id = $(this).attr('id');
    const value = $(this).val();
    if(id.includes('password')) {
        add_to_audit_history(g_current_u_id, id, ACTION_TYPE.EDIT_PASSWORD, $(this).data('previousValue'), value);
    } else if (id.includes('new_user_email')) {
        add_to_audit_history(g_current_u_id, id, ACTION_TYPE.EDIT_USERNAME, $(this).data('previousValue'), value);
    }

    //g_render();
}


$(document).on('focus', 'input', function() {
    $(this).data('previousValue', $(this).val());
    console.log($(this).val());
});

// Event delegation for change event on radio buttons
$(document).on('change', 'input[type="radio"]', function() {
    const value = $(this).val();
    const role_id = $(this).attr('name').split('_')[0];
    const role = new_user_roles.find(role => role._id === role_id);
    role.is_active = value === 'true';
    console.log(`Role ${role_id} active status changed to: ${value}`);
    add_to_audit_history(g_current_u_id, `${role_id}_role_active_status`, ACTION_TYPE.EDIT_ROLE, value === "true" ? "false" : "true", value);
});

// Event delegation for change event on select inputs
$(document).on('change', 'select', function() {
    const selectedValue = $(this).val();
    console.log(`Select input changed to: ${selectedValue}`);
    const role_id = $(this).attr('id').split('_')[0];
    const role = new_user_roles.find(role => role._id === role_id);
    if($(this).attr('id').includes('role_type')) {
        role.role_name = selectedValue;
        add_to_audit_history(g_current_u_id, `${role_id}_role_type`, ACTION_TYPE.EDIT_ROLE, $(this).data('previousValue'), selectedValue);
    }
    else if($(this).attr('id').includes('role_jurisdiction_type')) {
        role.jurisdiction_id = selectedValue;
        add_to_audit_history(g_current_u_id, `${role_id}_role_jurisdiction_type`, ACTION_TYPE.EDIT_ROLE, $(this).data('previousValue'), selectedValue);
    }
    console.log(`Role ${role_id} jurisdiction changed to: ${selectedValue}`);
    assigned_roles_validation_check();
});

// Event delegation for change event on date inputs
$(document).on('blur', 'input[type="date"]', function() {
    const date = $(this).val();
    const role_id = $(this).attr('id').split('_')[0];
    const role = new_user_roles.find(role => role._id === role_id);
    if($(this).attr('id').includes('role_effective_start_date')) {
        role.effective_start_date = date === "" ? "" : new Date(date);
        if (!$(this)[0].validity.valid) {
            $(`#${role_id}_role_effective_start_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_start_date_validation`).text('Invalid Date').css('color', 'red');
        } else if (date === "") {
            $(`#${role_id}_role_effective_start_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_start_date_validation`).text('Start Date is required').css('color', 'red');
        } else if (role.effective_end_date && new Date(role.effective_end_date) < new Date(date)) {
            $(`#${role_id}_role_effective_end_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_end_date_validation`).text('Must be after Start Date').css('color', 'red');
        }
        if ($(this)[0].validity.valid) {
            $(`#${role_id}_role_effective_start_date`).removeClass('is-invalid').css('color', '');
            $(`#${role_id}_role_start_date_validation`).text('').css('color', '');
        }
        add_to_audit_history(g_current_u_id, `${role_id}_role_effective_start_date`, ACTION_TYPE.EDIT_ROLE, $(this).data('previousValue'), date);
    } else if($(this).attr('id').includes('role_effective_end_date')) {
        role.effective_end_date = date === "" ? "" : new Date(date);
        if (!$(this)[0].validity.valid) {
            $(`#${role_id}_role_effective_end_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_end_date_validation`).text('Invalid Date').css('color', 'red');
        } else if (new Date(date) < new Date(role.effective_start_date)) {
            $(`#${role_id}_role_effective_end_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_end_date_validation`).text('Must be after Start Date').css('color', 'red');
        } else if ($(this)[0].validity.valid && new Date(date) >= new Date(role.effective_start_date)) {
            $(`#${role_id}_role_effective_end_date`).removeClass('is-invalid').css('color', '');
            $(`#${role_id}_role_end_date_validation`).text('').css('color', '');
        }
        add_to_audit_history(g_current_u_id, `${role_id}_role_effective_end_date`, ACTION_TYPE.EDIT_ROLE, $(this).data('previousValue'), date);
    }
    console.log(`Role ${role_id} date changed to: ${date}`);
});

function checkPasswordsMatch() {
    const password = $('#new_user_password').val();
    const verifyPassword = $('#new_user_password_verify').val();

    if (password && verifyPassword) {
        if (password === verifyPassword) {
            $('#new_user_password').removeClass('is-invalid').css('color', 'green');
            $('#new_user_password_verify').removeClass('is-invalid').css('color', 'green');
            $('#show_hide_password').removeClass('is-invalid-button');
            $('#show_hide_password_verify').removeClass('is-invalid-button');
            $('#password_validation').text('');
            $('#password_verify_validation').text('');
        } else {
            $('#new_user_password').addClass('is-invalid').css('color', 'red');
            $('#new_user_password_verify').addClass('is-invalid').css('color', 'red');
            $('#show_hide_password').addClass('is-invalid-button');
            $('#show_hide_password_verify').addClass('is-invalid-button');
            $('#password_validation').text('Passwords do not match').css('color', 'red');
            $('#password_verify_validation').text('Passwords do not match').css('color', 'red');
        }
    } else {
        $('#new_user_password').removeClass('is-invalid').css('color', '');
        $('#new_user_password_verify').removeClass('is-invalid').css('color', '');
        $('#show_hide_password').removeClass('is-invalid-button');
        $('#show_hide_password_verify').removeClass('is-invalid-button');
        $('#password_validation').text('');
        $('#password_verify_validation').text('');
    }
}

// Function to save the new user
function save_new_user() {
    let is_valid = true;
    const new_user_email = $('#new_user_email').val();
    const new_user_password = $('#new_user_password').val();
    const new_user_password_verify = $('#new_user_password_verify').val();

    if(g_policy_values.sams_is_enabled.toLowerCase() == "True".toLowerCase())
    {
        new_user_password = $mmria.get_new_guid().replace("-","");
        new_user_password_verify = new_user_password;
    }

    if (!new_user_email) {
        $('#new_user_email').addClass('is-invalid').css('color', 'red');
        $('#username_validation').text('Username is required').css('color', 'red');
        is_valid = false;
    }
    if(!new_user_password) {
        $('#new_user_password').addClass('is-invalid').css('color', 'red');
        $('#password_validation').text('Password is required').css('color', 'red');
        $('#show_hide_password').addClass('is-invalid-button');
        is_valid = false;
    }
    if(!new_user_password_verify) {
        $('#new_user_password_verify').addClass('is-invalid').css('color', 'red');
        $('#password_verify_validation').text('Verify Password is required').css('color', 'red');
        $('#show_hide_password_verify').addClass('is-invalid-button');
        is_valid = false;
    }
    if (new_user_password !== new_user_password_verify) {
        $('#new_user_password').addClass('is-invalid').css('color', 'red');
        $('#new_user_password_verify').addClass('is-invalid').css('color', 'red');
        $('#show_hide_password').addClass('is-invalid-button');
        $('#show_hide_password_verify').addClass('is-invalid-button');
        $('#password_validation').text('Passwords do not match').css('color', 'red');
        $('#password_verify_validation').text('Passwords do not match').css('color', 'red');
        is_valid = false;
    }
    is_valid = assigned_roles_validation_check();
    if(is_valid_user_name(new_user_email))
        {
            if
            (
                new_user_password == new_user_password_verify &&
                is_valid_password(new_user_password)
            )
            {
                //check_if_existing_user(new_user_email, new_user_password);
            }
            else
            {
                $('#new_user_password').addClass('is-invalid').css('color', 'red');
                $('#new_user_password_verify').addClass('is-invalid').css('color', 'red');
                $('#show_hide_password').addClass('is-invalid-button');
                $('#show_hide_password_verify').addClass('is-invalid-button');
                $('#password_validation').text('Invalid password.').css('color', 'red');

                $('#password_verify_validation').text(`Invalid password.<br/>be sure that verify and password match,<br/> minimum length is: ${g_policy_values.minimum_length} and should only include characters [a-zA-Z0-9!@#$%?* ]`).css('color', 'red');
                is_valid = false;
            }
    
        }
        else
        {
            $('#new_user_email').addClass('is-invalid').css('color', 'red');
            $('#username_validation').text('Invalid user name. User name should be unique and at least 5 characters long').css('color', 'red');
            is_valid = false;
            console.log("got nothing.");
        }

    const new_user = {
        _id: $mmria.get_new_guid(),
        user_email: new_user_email,
        user_password: new_user_password,
        user_roles: new_user_roles,
        date_created: new Date(),
        created_by: g_current_u_id,
        date_last_updated: new Date(),
        last_updated_by: g_current_u_id,
        data_type: "user"
    };

    console.log(new_user);
    //$mmria.save_data(new_user);
}

function assigned_roles_validation_check(){
    let is_valid = true;
    $.each(new_user_roles, function(index, role) {
        const role_id = role._id;
        const role_type = $(`#${role_id}_role_type`).val();
        const role_jurisdiction = $(`#${role_id}_role_jurisdiction_type`).val();
        const role_effective_start_date = $(`#${role_id}_role_effective_start_date`).val();
        const role_effective_end_date = $(`#${role_id}_role_effective_end_date`).val();
        const matching_role_case = new_user_roles.filter(role => role.role_name === role_type && role.jurisdiction_id === role_jurisdiction);
        if (matching_role_case.length > 1) {
            $(`#${role_id}_role_type`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_type_validation`).text('Role/Case combo already exists').css('color', 'red');
            $(`#${role_id}_role_jurisdiction_type`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_jurisdiction_validation`).text('Role/Case combo already exists').css('color', 'red');
            $.each(matching_role_case, function(index, role) {
                $(`#${role._id}_role_type`).addClass('is-invalid').css('color', 'red');
                $(`#${role._id}_role_type_validation`).text('Role/Case combo already exists').css('color', 'red');
                $(`#${role._id}_role_jurisdiction_type`).addClass('is-invalid').css('color', 'red');
                $(`#${role._id}_role_jurisdiction_validation`).text('Role/Case combo already exists').css('color', 'red');
            });
            is_valid = false;
        }
        else {
            $(`#${role_id}_role_type`).removeClass('is-invalid').css('color', '');
            $(`#${role_id}_role_type_validation`).text('').css('color', '');
            $(`#${role._id}_role_jurisdiction_type`).removeClass('is-invalid').css('color', '');
            $(`#${role._id}_role_jurisdiction_validation`).text('').css('color', '');
        }
        if (!role_type) {
            $(`#${role_id}_role_type`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_type_validation`).text('Role is required').css('color', 'red');
            is_valid = false;
        }
        if (!role_jurisdiction) {
            $(`#${role_id}_role_jurisdiction_type`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_jurisdiction_validation`).text('Jurisdiction is required').css('color', 'red');
            is_valid = false;
        }
        if (!role_effective_start_date) {
            $(`#${role_id}_role_effective_start_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_start_date_validation`).text('Start Date is required').css('color', 'red');
            is_valid = false;
        }
        else {
            $(`#${role_id}_role_effective_start_date`).removeClass('is-invalid').css('color', '');
            $(`#${role_id}_role_start_date_validation`).text('').css('color', '');
        }
        if (role_effective_end_date && new Date(role_effective_end_date) < new Date(role_effective_start_date)) {
            //$(`#${role_id}_role_effective_start_date`).addClass('is-invalid').css('color', 'red');
            $(`#${role_id}_role_effective_end_date`).addClass('is-invalid').css('color', 'red');
            //$(`#${role_id}_role_start_date_validation`).text('End Date cannot be before Start Date').css('color', 'red');
            $(`#${role_id}_role_end_date_validation`).text('Must be after Start Date').css('color', 'red');
            //$(`#${role_id}_role_effective_end_date`).val('');
            //$(`#${role_id}_role_effective_start_date`).val('');
            is_valid = false;
        }
        else {
            //$(`#${role_id}_role_effective_start_date`).removeClass('is-invalid').css('color', '');
            $(`#${role_id}_role_effective_end_date`).removeClass('is-invalid').css('color', '');
            //$(`#${role_id}_role_start_date_validation`).text('').css('color', '');
            $(`#${role_id}_role_end_date_validation`).text('').css('color', '');
        }
    });
    return is_valid;
}

function add_to_audit_history(p_user_id, p_elem_id, p_action, p_prev_val, p_new_val){
    const new_audit = {
        _id: $mmria.get_new_guid(),
        user_id: p_user_id,
        action: p_action,
        element_id: p_elem_id,
        prev_value: p_prev_val,
        new_value: p_new_val,
        date_created: new Date(),
        created_by: g_current_u_id,
        date_last_updated: new Date(),
        last_updated_by: g_current_u_id,
        data_type: "audit_history"
    };
    audit_history.push(new_audit);
    $('#audit_history_undo_button').prop('disabled', false);
    $('#audit_history_undo_button').attr('aria-disabled', 'false');
    $(`#${p_elem_id}`).data('previousValue', p_new_val);
    console.log(audit_history);
}

function audit_history_undo() {
    const last_audit = audit_history.pop();
    if (last_audit) {
        const elem_id = last_audit.element_id;
        const prev_val = last_audit.prev_value;
        const new_val = last_audit.new_value;
        if(elem_id.includes('role_active_status')) {
            $(`input[name="${elem_id}"][value="${new_val}"]`).prop('checked', false);
            $(`input[name="${elem_id}"][value="${prev_val}"]`).prop('checked', true);
        }
        $(`#${elem_id}`).val(prev_val);
        $(`#${elem_id}`).data('previousValue', prev_val);
        can_undo = audit_history.length > 0;
        $('#audit_history_undo_button').prop('disabled', !can_undo);
        $('#audit_history_undo_button').attr('aria-disabled', can_undo ? 'false' : 'true');
        if (last_audit.action === ACTION_TYPE.EDIT_ROLE) {
            assigned_roles_validation_check();
        }
    }
    console.log(audit_history);
}