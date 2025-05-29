var new_user_roles = [];
var deleted_user_roles = [];
var can_undo = false;

var new_user = {
    "_id": '',
    "password": null,
    "iterations": 10,
    "name": '',
    "roles": [],
    "type": "user",
    "derived_key": "a1bb5c132df5b7df7654bbfa0e93f9e304e40cfe",
    "salt": "510427706d0deb511649021277b2c05d"
};

function add_new_user_render() {
    const result = `
        <div class="d-flex mt-4">
            <div>
                <h2 class="h4">User Info</h2>
            </div>
            <div class="ml-auto d-flex">
                <span id="new_user_save_status" role="status" class="mr-2 spinner-container spinner-content">
                    <span class="spinner-body text-primary">
                        <span class="spinner"></span>
                        <span class="sr-only">Saving new user...</span>
                    </span>
                </span>
                <button id="save_user_button" onclick="save_new_user()" class="btn primary-button">Save New User</button>
                <button id="undo_button" onclick="audit_history_undo()" id="audit_history_undo_button" ${can_undo === true ? '' : 'disabled'} aria-disabled="${can_undo ? 'false' : 'true'}" class="btn primary-button">Undo</button>
            </div>
        </div>
        <div class="d-flex">
            <div class="vertical-control required col-4 pl-0">
                <label>Username (i.e., Email Address)</label>
                <input autocomplete="off" class="form-control" type="text" id="new_user_email" value="${new_user.name}">
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
                <tbody id="user_roles">
                    <tr id="no-roles-placeholder" class="text-center"><td colspan="6">No roles assigned.</td></tr>
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
    //init_audit_history();
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

function add_assigned_role() {
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
    add_to_audit_history(g_current_u_id, unique_guid, ACTION_TYPE.ADD_ROLE, null, null);
    return result = `
        <tr id="${unique_guid}_role">
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select id="${unique_guid}_role_type" aria-label="Select Role" class="form-select form-control role-select-controls" aria-label="Select user role">
                        ${new_user_role_render()}
                    </select>
                    <span id="${unique_guid}_role_type_validation" class="col-12 data-cell-error-message pl-0 pr-0"></span>
                </div>
            </td>
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select id="${unique_guid}_role_jurisdiction_type" aria-label="Select folder" class="form-select form-control role-jursidiction-controls" aria-label="Select case access folder">
                        ${new_user_role_jurisdiction_render(g_jurisdiction_tree).join('')}
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
}

function new_user_role_render()
{
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
            temp_result.push("value ='" + role + "'>");
            temp_result.push(role_name.join(" "));
            temp_result.push("</option>");
        }
    });
    return temp_result.join('');
}

function new_user_role_jurisdiction_render(p_data, p_level)
{
    var p_level = p_level || 0;
	var result = [];
	if( p_data._id)
	{
		result.push("<option value=''>Select Case Folder</option>")
		p_level = 0;
	}
    let is_managed_jusisdiction = false;
    for (const key in g_managed_jurisdiction_set) 
    {
        if (g_managed_jurisdiction_set.hasOwnProperty(key)) 
        {
            if(p_data.name.indexOf(key) == 0)
            {
                is_managed_jusisdiction = true;
                break;
            }
        }
    }
    if(is_managed_jusisdiction)
    {
        result.push(`<option value="${p_data.name}"`);
        result.push(">");
        result.push(p_data.name == "/" ? "Top Folder" : p_data.name);
        result.push("</option>");
    }
    if(p_data.children != null)
    {
        for(var i = 0; i < p_data.children.length; i++)
        {
            var child = p_data.children[i];
            Array.prototype.push.apply(result, new_user_role_jurisdiction_render(child, p_level + 1));
            
        }
    }
	return result;
}

function delete_new_role(p_role_id) 
{
    const p_role_index = new_user_roles.findIndex(role => role._id === p_role_id);
    if (p_role_index !== -1) 
    {
        new_user_roles.splice(p_role_index, 1);
        add_to_audit_history(g_current_u_id, p_role_id, ACTION_TYPE.DELETE_ROLE, null, null);
        deleted_user_roles.push({
            _id: p_role_id,
            html: document.getElementById(`${p_role_id}_role`).outerHTML,
            role: new_user_roles[p_role_index]
        });
        const row = document.getElementById(`${p_role_id}_role`);
        if (row) row.remove();
        console.log(new_user_roles);
        if (new_user_roles.length <= 0) {
            const userRoles = document.getElementById("user_roles");
            if (userRoles) {
                const tr = document.createElement('tr');
                tr.id = "no-roles-placeholder";
                tr.className = "text-center";
                tr.innerHTML = '<td colspan="6">No roles assigned.</td>';
                userRoles.appendChild(tr);
            }
        }
    } 
    else 
    {
        console.error(`Role with id ${p_role_id} not found`);
    }
}

function add_new_role() 
{
    const noRolesPlaceholder = document.getElementById("no-roles-placeholder");
    if (noRolesPlaceholder) noRolesPlaceholder.remove();
    console.log("Adding new role");
    console.log(new_user_roles);
    const userRoles = document.getElementById('user_roles');
    if (userRoles) 
    {
        const temp = document.createElement('tbody');
        temp.innerHTML = add_assigned_role("");
        Array.from(temp.children).forEach(child => userRoles.appendChild(child));
    }
    const undoBtn = document.getElementById('audit_history_undo_button');
    if (undoBtn) undoBtn.disabled = false;
}

document.addEventListener('input', function(e) 
{
    if (e.target && (e.target.id === 'new_user_password' || e.target.id === 'new_user_password_verify')) 
    {
        check_passwords_match();
    }
});

document.addEventListener('change', function(e) 
{
    if (e.target && (e.target.type === 'text' || e.target.type === 'password')) 
    {
        user_email_change.call(e.target);
    }
});

function user_email_change() 
{
    const id = this.id;
    const value = this.value;
    if(id.includes('password')) 
    {
        add_to_audit_history(g_current_u_id, id, ACTION_TYPE.EDIT_PASSWORD, this.dataset.previousValue, value);
    } 
    else if (id.includes('new_user_email')) 
    {
        add_to_audit_history(g_current_u_id, id, ACTION_TYPE.EDIT_USERNAME, this.dataset.previousValue, value);
    }
}

document.addEventListener('focusin', function(e) 
{
    if (e.target && e.target.tagName === 'INPUT') 
    {
        e.target.dataset.previousValue = e.target.value;
        console.log(e.target.value);
    }
});

document.addEventListener('change', function(e) 
{
    if (e.target && e.target.type === 'radio') 
    {
        const value = e.target.value;
        const role_id = e.target.name.split('_')[0];
        const role = new_user_roles.find(role => role._id === role_id);
        role.is_active = value === 'true';
        console.log(`Role ${role_id} active status changed to: ${value}`);
        add_to_audit_history(g_current_u_id, `${role_id}_role_active_status`, ACTION_TYPE.EDIT_ROLE, value === "true" ? "false" : "true", value);
    }
});

document.addEventListener('change', function(e) 
{
    if (e.target && e.target.tagName === 'SELECT') 
    {
        const selectedValue = e.target.value;
        console.log(`Select input changed to: ${selectedValue}`);
        const role_id = e.target.id.split('_')[0];
        const role = new_user_roles.find(role => role._id === role_id);
        if(e.target.id.includes('role_type')) 
        {
            role.role_name = selectedValue;
            add_to_audit_history(g_current_u_id, `${role_id}_role_type`, ACTION_TYPE.EDIT_ROLE, e.target.dataset.previousValue, selectedValue);
        }
        else if(e.target.id.includes('role_jurisdiction_type')) 
        {
            role.jurisdiction_id = selectedValue;
            add_to_audit_history(g_current_u_id, `${role_id}_role_jurisdiction_type`, ACTION_TYPE.EDIT_ROLE, e.target.dataset.previousValue, selectedValue);
        }
        console.log(`Role ${role_id} jurisdiction changed to: ${selectedValue}`);
        assigned_roles_validation_check();
    }
});

document.addEventListener('blur', function(e) 
{
    if (e.target && e.target.type === 'date') 
    {
        const date = e.target.value;
        const role_id = e.target.id.split('_')[0];
        const role = new_user_roles.find(role => role._id === role_id);
        if(e.target.id.includes('role_effective_start_date')) 
        {
            role.effective_start_date = date === "" ? "" : new Date(date);
            if (!e.target.validity.valid) 
            {
                addInvalid(`${role_id}_role_effective_start_date`, `${role_id}_role_start_date_validation`, 'Invalid Date');
            } 
            else if (date === "") 
            {
                addInvalid(`${role_id}_role_effective_start_date`, `${role_id}_role_start_date_validation`, 'Start Date is required');
            } 
            else if (role.effective_end_date && new Date(role.effective_end_date) < new Date(date)) 
            {
                addInvalid(`${role_id}_role_effective_end_date`, `${role_id}_role_end_date_validation`, 'Must be after Start Date');
            }
            if (e.target.validity.valid) 
            {
                removeInvalid(`${role_id}_role_effective_start_date`, `${role_id}_role_start_date_validation`);
            }
            add_to_audit_history(g_current_u_id, `${role_id}_role_effective_start_date`, ACTION_TYPE.EDIT_ROLE, e.target.dataset.previousValue, date);
        } 
        else if(e.target.id.includes('role_effective_end_date')) 
        {
            role.effective_end_date = date === "" ? "" : new Date(date);
            if (!e.target.validity.valid) 
            {
                addInvalid(`${role_id}_role_effective_end_date`, `${role_id}_role_end_date_validation`, 'Invalid Date');
            } 
            else if (new Date(date) < new Date(role.effective_start_date)) 
            {
                addInvalid(`${role_id}_role_effective_end_date`, `${role_id}_role_end_date_validation`, 'Must be after Start Date');
            } 
            else if (e.target.validity.valid && new Date(date) >= new Date(role.effective_start_date)) 
            {
                removeInvalid(`${role_id}_role_effective_end_date`, `${role_id}_role_end_date_validation`);
            }
            add_to_audit_history(g_current_u_id, `${role_id}_role_effective_end_date`, ACTION_TYPE.EDIT_ROLE, e.target.dataset.previousValue, date);
        }
        console.log(`Role ${role_id} date changed to: ${date}`);
    }
}, true);

function check_passwords_match() 
{
    const password = document.getElementById('new_user_password').value;
    const verifyPassword = document.getElementById('new_user_password_verify').value;

    if (password && verifyPassword) 
    {
        if (password === verifyPassword) 
        {
            document.getElementById('new_user_password').classList.remove('is-invalid');
            document.getElementById('new_user_password').style.color = 'green';
            document.getElementById('new_user_password_verify').classList.remove('is-invalid');
            document.getElementById('new_user_password_verify').style.color = 'green';
            document.getElementById('show_hide_password').classList.remove('is-invalid-button');
            document.getElementById('show_hide_password_verify').classList.remove('is-invalid-button');
            document.getElementById('password_validation').textContent = '';
            document.getElementById('password_verify_validation').textContent = '';
        } 
        else 
        {
            document.getElementById('new_user_password').classList.add('is-invalid');
            document.getElementById('new_user_password').style.color = 'red';
            document.getElementById('new_user_password_verify').classList.add('is-invalid');
            document.getElementById('new_user_password_verify').style.color = 'red';
            document.getElementById('show_hide_password').classList.add('is-invalid-button');
            document.getElementById('show_hide_password_verify').classList.add('is-invalid-button');
            document.getElementById('password_validation').textContent = 'Passwords do not match';
            document.getElementById('password_validation').style.color = 'red';
            document.getElementById('password_verify_validation').textContent = 'Passwords do not match';
            document.getElementById('password_verify_validation').style.color = 'red';
        }
    } 
    else 
    {
        document.getElementById('new_user_password').classList.remove('is-invalid');
        document.getElementById('new_user_password').style.color = '';
        document.getElementById('new_user_password_verify').classList.remove('is-invalid');
        document.getElementById('new_user_password_verify').style.color = '';
        document.getElementById('show_hide_password').classList.remove('is-invalid-button');
        document.getElementById('show_hide_password_verify').classList.remove('is-invalid-button');
        document.getElementById('password_validation').textContent = '';
        document.getElementById('password_verify_validation').textContent = '';
    }
}

function save_new_user() 
{
    disable_save_undo_button();
    let is_valid = true;
    const new_user_email = document.getElementById('new_user_email').value;
    let new_user_password = document.getElementById('new_user_password').value;
    let new_user_password_verify = document.getElementById('new_user_password_verify').value;

    if(g_policy_values.sams_is_enabled.toLowerCase() == "true") 
    {
        new_user_password = $mmria.get_new_guid().replace("-","");
        new_user_password_verify = new_user_password;
    }

    if (!new_user_email) 
    {
        document.getElementById('new_user_email').classList.add('is-invalid');
        document.getElementById('new_user_email').style.color = 'red';
        document.getElementById('username_validation').textContent = 'Username is required';
        document.getElementById('username_validation').style.color = 'red';
        is_valid = false;
    }
    if(!new_user_password) 
    {
        document.getElementById('new_user_password').classList.add('is-invalid');
        document.getElementById('new_user_password').style.color = 'red';
        document.getElementById('password_validation').textContent = 'Password is required';
        document.getElementById('password_validation').style.color = 'red';
        document.getElementById('show_hide_password').classList.add('is-invalid-button');
        is_valid = false;
    }
    if(!new_user_password_verify) 
    {
        document.getElementById('new_user_password_verify').classList.add('is-invalid');
        document.getElementById('new_user_password_verify').style.color = 'red';
        document.getElementById('password_verify_validation').textContent = 'Verify Password is required';
        document.getElementById('password_verify_validation').style.color = 'red';
        document.getElementById('show_hide_password_verify').classList.add('is-invalid-button');
        is_valid = false;
    }
    if (new_user_password !== new_user_password_verify) 
    {
        document.getElementById('new_user_password').classList.add('is-invalid');
        document.getElementById('new_user_password').style.color = 'red';
        document.getElementById('new_user_password_verify').classList.add('is-invalid');
        document.getElementById('new_user_password_verify').style.color = 'red';
        document.getElementById('show_hide_password').classList.add('is-invalid-button');
        document.getElementById('show_hide_password_verify').classList.add('is-invalid-button');
        document.getElementById('password_validation').textContent = 'Passwords do not match';
        document.getElementById('password_validation').style.color = 'red';
        document.getElementById('password_verify_validation').textContent = 'Passwords do not match';
        document.getElementById('password_verify_validation').style.color = 'red';
        is_valid = false;
    }
    is_valid = assigned_roles_validation_check();
    if(is_valid_user_name(new_user_email) && is_valid) 
    {
        if (
            new_user_password == new_user_password_verify &&
            is_valid_password(new_user_password)
        ) 
        {
            check_if_existing_user(new_user_email, new_user_password);
        } 
        else 
        {
            document.getElementById('new_user_password').classList.add('is-invalid');
            document.getElementById('new_user_password').style.color = 'red';
            document.getElementById('new_user_password_verify').classList.add('is-invalid');
            document.getElementById('new_user_password_verify').style.color = 'red';
            document.getElementById('show_hide_password').classList.add('is-invalid-button');
            document.getElementById('show_hide_password_verify').classList.add('is-invalid-button');
            document.getElementById('password_validation').innerHTML = 'Invalid password.';
            document.getElementById('password_validation').style.color = 'red';
            document.getElementById('password_verify_validation').innerHTML = `Invalid password.<br/>be sure that verify and password match,<br/> minimum length is: ${g_policy_values.minimum_length} and should only include characters [a-zA-Z0-9!@#$%?* ]`;
            document.getElementById('password_verify_validation').style.color = 'red';
            is_valid = false;
        }
    } 
    else 
    {
        document.getElementById('new_user_email').classList.add('is-invalid');
        document.getElementById('new_user_email').style.color = 'red';
        document.getElementById('username_validation').textContent = 'Invalid user name. User name should be unique and at least 5 characters long';
        document.getElementById('username_validation').style.color = 'red';
        is_valid = false;
    }
    if (is_valid) disable_save_undo_button();
    else enable_save_undo_button();
}

function disable_save_undo_button()
{
    document.getElementById('new_user_save_status').classList.add('spinner-active');
    document.getElementById('save_user_button').disabled = true;
    document.getElementById('save_user_button').attributes['aria-disabled'] = 'true';
    document.getElementById('undo_button').disabled = true;
    document.getElementById('undo_button').attributes['aria-disabled'] = 'true';
}

function enable_save_undo_button()
{
    document.getElementById('new_user_save_status').classList.remove('spinner-active');
    document.getElementById('save_user_button').disabled = false;
    document.getElementById('save_user_button').attributes['aria-disabled'] = 'false';
    document.getElementById('undo_button').disabled = false;
    document.getElementById('undo_button').attributes['aria-disabled'] = 'false';
}

function assigned_roles_validation_check() {
    let is_valid = true;
    new_user_roles.forEach(function(role) {
        const role_id = role._id;
        const role_type = document.getElementById(`${role_id}_role_type`).value;
        const role_jurisdiction = document.getElementById(`${role_id}_role_jurisdiction_type`).value;
        const role_effective_start_date = document.getElementById(`${role_id}_role_effective_start_date`).value;
        const role_effective_end_date = document.getElementById(`${role_id}_role_effective_end_date`).value;
        const matching_role_case = new_user_roles.filter(r => r.role_name === role_type && r.jurisdiction_id === role_jurisdiction);

        if (matching_role_case.length > 1) {
            addInvalid(`${role_id}_role_type`, `${role_id}_role_type_validation`, 'Role/Case combo already exists');
            addInvalid(`${role_id}_role_jurisdiction_type`, `${role_id}_role_jurisdiction_validation`, 'Role/Case combo already exists');
            matching_role_case.forEach(function(r) {
                addInvalid(`${r._id}_role_type`, `${r._id}_role_type_validation`, 'Role/Case combo already exists');
                addInvalid(`${r._id}_role_jurisdiction_type`, `${r._id}_role_jurisdiction_validation`, 'Role/Case combo already exists');
            });
            is_valid = false;
        } else {
            removeInvalid(`${role_id}_role_type`, `${role_id}_role_type_validation`);
            removeInvalid(`${role_id}_role_jurisdiction_type`, `${role_id}_role_jurisdiction_validation`);
        }

        if (!role_type) {
            addInvalid(`${role_id}_role_type`, `${role_id}_role_type_validation`, 'Role is required');
            is_valid = false;
        }
        if (!role_jurisdiction) {
            addInvalid(`${role_id}_role_jurisdiction_type`, `${role_id}_role_jurisdiction_validation`, 'Jurisdiction is required');
            is_valid = false;
        }
        if (!role_effective_start_date) {
            addInvalid(`${role_id}_role_effective_start_date`, `${role_id}_role_start_date_validation`, 'Start Date is required');
            is_valid = false;
        } else {
            removeInvalid(`${role_id}_role_effective_start_date`, `${role_id}_role_start_date_validation`);
        }
        if (role_effective_end_date && new Date(role_effective_end_date) < new Date(role_effective_start_date)) {
            addInvalid(`${role_id}_role_effective_end_date`, `${role_id}_role_end_date_validation`, 'Must be after Start Date');
            is_valid = false;
        } else {
            removeInvalid(`${role_id}_role_effective_end_date`, `${role_id}_role_end_date_validation`);
        }
    });
    return is_valid;
}

function addInvalid(id, validationId, message) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('is-invalid');
        el.style.color = 'red';
    }
    const valEl = document.getElementById(validationId);
    if (valEl) {
        valEl.textContent = message;
        valEl.style.color = 'red';
    }
}
function removeInvalid(id, validationId) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('is-invalid');
        el.style.color = '';
    }
    const valEl = document.getElementById(validationId);
    if (valEl) {
        valEl.textContent = '';
        valEl.style.color = '';
    }
}

function check_if_existing_user(p_user_id, p_new_user_password)
{
    $.ajax({
        url: location.protocol + '//' + location.host + '/api/user/check-user/org.couchdb.user:' + p_user_id,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "GET"
    }).done(function(user_check_response) 
    {
        if(user_check_response)
        {
            let user = eval(user_check_response);
            let is_found = false;

            for(var i = 0; i < g_ui.user_summary_list.length; i++)
            {
                if(g_ui.user_summary_list[i]._id == user._id)
                {
                    is_found = true;
                    break;
                }
            }
            if(!is_found)
            {
                g_ui.user_summary_list.push(user);
                save_user(user._id);
            }
        }
        else
        {
			var new_user = create_new_user(p_user_id.toLowerCase(), p_new_user_password);
			user_id = new_user._id;
			g_ui.user_summary_list.push(new_user);
	
			$.ajax({
				url: location.protocol + '//' + location.host + '/api/user',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: JSON.stringify(new_user),
				type: "POST"
			}).done(function(response) 
			{
				var response_obj = eval(response);
				if(response_obj.ok)
				{
					for(var i = 0; i < g_ui.user_summary_list.length; i++)
					{
						if(g_ui.user_summary_list[i]._id == response_obj.id)
						{
							g_ui.user_summary_list[i]._rev = response_obj.rev; 
							break;
						}
					}
                if (new_user_roles.length > 0) 
                {
                    // TO-DO: save user roles
                }
                else
                {
                    view_user_click(user_id);
                }
				}
			});
        }
    });
}

function save_user(p_user_id)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user_index = i;
			break;
		}
	}
	if(user_index > -1)
	{
		var user = user_list[user_index];
        $.ajax({
            url: location.protocol + '//' + location.host + '/api/user',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(user),
            type: "POST"
        }).done(function(response) 
        {
            var response_obj = eval(response);
            if(response_obj.ok)
            {
                for(var i = 0; i < g_ui.user_summary_list.length; i++)
                {
                    if(g_ui.user_summary_list[i]._id == response_obj.id)
                    {
                        g_ui.user_summary_list[i]._rev = response_obj.rev; 
                        break;
                    }
                }
                g_render();
                create_status_message("user information saved", convert_to_jquery_id(user._id));
                console.log("password saved sent", response);
            }
        });
	}
}

function create_new_user(p_name, p_password)
{
    return {
    "_id": "org.couchdb.user:" + p_name,
    "password": p_password,
    "iterations": 10,
    "name": p_name,
    "roles": [  ],
    "type": "user",
    "derived_key": "a1bb5c132df5b7df7654bbfa0e93f9e304e40cfe",
    "salt": "510427706d0deb511649021277b2c05d"
    };
}