function view_user_renderer(p_user)
{

    let role_user_name = p_user;
    if(p_user.indexOf(":") > -1)
    {
        role_user_name =  p_user.split(":")[1];
    }

    $("#manage_user_label").html('View User');
    const user_role_jurisdiction = g_user_role_jurisdiction.filter(jurisdiction => jurisdiction.user_id === role_user_name);
    
    return `
        <div class="d-flex mt-4">
            <div>
                <h2 class="h4">User Info</h2>
            </div>
            <div class="ml-auto">
                <button class="btn primary-button">Enable Edit</button>
                <button disabled aria-disabled="true" class="btn primary-button">Save User Edits</button>
                <button disabled aria-disabled="true" class="btn primary-button">Undo</button>
            </div>
        </div>
        <div class="d-flex">
            <div class="vertical-control required col-4 pl-0">
                <label>Username (i.e., Email Address)</label>
                <input disabled aria-disabled="true" value="${role_user_name}" autocomplete="off" class="form-control" type="text" id="new_user_email">
            </div>
        </div>
        <div class="d-flex flex-column mt-4">
            <div>
                <h2 class="h4">Assigned Roles</h2>
            </div>
            <table class="table mt-3">
                <thead>
                    <tr class="header-level-2">
                        <th>Role Name</th>
                        <th>Case Folder Access</th>
                        <th>Active Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        user_role_jurisdiction.map(jurisdiction => {
                            return user_assigned_role_renderer(jurisdiction)
                        })
                    }
                </tbody>
            </table>
            <div id="add_new_role_container" class="d-none ml-auto mt-2">
                <button class="btn secondary-button col-12 hidden" aria-label="Add new role" onclick="add_new_role()">
                    Add New Role
                </button>
            </div>
        </div>
        <div class="d-flex mt-4">
            <div>
                <h2 class="h4">Account History</h2>
            </div>
        </div>
        <div class="d-flex">
            <div class='vertical-control mb-3 mt-3 pl-0 col-md-3'><div class='input-group'>
                <input autocomplete='off' class='form-control' type='text' placeholder='Search'>
                <div class='input-group-append'><button class='btn btn-outline-secondary'><img src='./img/icon_search.svg'></button></div>
                </div>
            </div>
            <div class="d-flex ml-auto">
                ${render_account_history_table_navigation()}
            </div>
        </div>
        <div>
            <table class='table table-layout-fixed align-cell-top'><caption class='table-caption'>User account history table</caption>
                <thead>
                    <tr class='header-level-2'>
                        <th width='150' scope='colgroup'>Date/Time</th>
                        <th width="225">Editor</th>
                        <th width='150' scope='colgroup;'>Action</th>
                        <th>Field</th>
                        <th width="150">Old Value</th>
                        <th width="150">New Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>07/15/2022 10:42:00</td>
                        <td>abcd@cdc.gov</td>
                        <td>Edit Role</td>
                        <td>Assigned Roles / Data Analyst / Active Status</td>
                        <td>Active</td>
                        <td>Inactive</td>
                    </tr>
                    <tr>
                        <td>03/05/2022 07:42:00</td>
                        <td>abcd@cdc.gov</td>
                        <td>Edit Role</td>
                        <td>Assigned Roles / Abstractor</td>
                        <td>Abstractor</td>
                        <td>Data Analyst</td>
                    </tr>
                    <tr>
                        <td>01/01/2022 15:42:00</td>
                        <td>abcd@cdc.gov</td>
                        <td>Add User</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

}

function delete_role(role_to_delete)
{
    //To-Do: delete role
    console.log(`Deleting role ${role_to_delete}`);
}

function add_new_role()
{
    //To-Do: add role
    console.log(`Adding role`);
}

function render_account_history_table_navigation()
{
    const result = [`
        <div class='d-flex mb-2 mt-2'>
            <div class='ml-auto mr-3 d-flex'>
                <div class='d-flex align-items-center'>
                    <div>Showing 1-10 of 30 cases</div>
                    <div class='row ml-2'>
                        <button disabled='' aria-disabled='true' class='icon-button btn-tab-navigation reverse'><span class='x24 fill-p cdc-icon-chevron-double-right'></span></button>
                        <button disabled='' aria-disabled='true' class='icon-button btn-tab-navigation reverse'><span class='x24 fill-p cdc-icon-chevron-right'></span></button>
                        <button class='icon-button btn-tab-navigation'>1</button>
                        <button class='icon-button pt-1 btn-tab-navigation'><span class='x24 fill-p cdc-icon-chevron-right'></span></button>
                        <button class='icon-button pt-1 btn-tab-navigation'><span class='x24 fill-p cdc-icon-chevron-double-right'></span></button>
                    </div>
                </div>
            </div>
        </div>
    `];

    return result.join("");
}

function user_assigned_role_renderer(p_user_jurisdiction)
{
    const role_set = get_role_list();
    const temp_result = [];
    role_set.forEach(role => {
        if(role !== "")
        {
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

    })
    const result = `
        <tr>
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select aria-label="Select Role" class="form-select form-control" aria-label="Select user role">
                    ${temp_result.join("")}
                    </select>
                </div>
            </td>
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select aria-label="Select folder" class="form-select form-control" aria-label="Select case access folder">
                        ${user_role_jurisdiction_render(g_jurisdiction_tree, p_user_jurisdiction.jurisdiction_id, 0, p_user_jurisdiction.user_id).join("")}
                    </select>
                </div>
            </td>
            <td>
                <div class="vertical-control col-md-12">
                    <fieldset>
                        <legend class="accessible-hide">Active Status</legend>
                        <div class="form-check">
                            <input ${p_user_jurisdiction.is_active ? "checked" : ""} class="form-check-input big-radio" name="${p_user_jurisdiction.role_name}_active_status" type="radio" value="" id="${p_user_jurisdiction.role_name}_active_status_true">
                            <label class="form-check-label" for="${p_user_jurisdiction.role_name}_active_status_true">
                                Active
                            </label>
                        </div>
                        <div class="form-check">
                            <input ${p_user_jurisdiction.is_active ? "" : "checked"} class="form-check-input big-radio" type="radio" value="" name="${p_user_jurisdiction.role_name}_active_status" id="${p_user_jurisdiction.role_name}_active_status_false">
                            <label class="form-check-label" for="${p_user_jurisdiction.role_name}_active_status_false">
                                Inactive
                            </label>
                        </div>
                    </fieldset>
                </div>
            </td>
            <td class="d-flex pt-3 justify-content-center border-none">
                <button class="btn delete-button col-12" aria-label="Delete role" onclick="delete_role('test')">
                    Delete Role
                </button>
            </td>
        </tr>
    `;
    return result;
}