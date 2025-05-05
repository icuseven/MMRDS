function view_user_renderer()
{
    let role_user_name = g_current_user_id;
    if(role_user_name.indexOf(":") > -1)
    {
        role_user_name =  role_user_name.split(":")[1];
    }
    const user_role_jurisdiction = g_user_role_jurisdiction.filter(jurisdiction => jurisdiction.user_id === role_user_name);
    const result = `
        <div class="d-flex mt-4">
            <div>
                <h2 class="h4">User Info</h2>
            </div>
            <div class="ml-auto">
                <button class="btn primary-button" onclick="edit_user_click('${g_current_user_id}')">Enable Edit</button>
                <button disabled aria-disabled="true" class="btn primary-button">Save User Edits</button>
                <button disabled aria-disabled="true" class="btn primary-button">Undo</button>
            </div>
        </div>
        <div class="d-flex">
            <div class="vertical-control col-4 pl-0">
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
                    <tr class="header-level-2 sticky-header z-index-top">
                        <th>Role Name</th>
                        <th>Case Folder Access</th>
                        <th>Effective Start Date</th>
                        <th>Effective End Date</th>
                        <th>Active Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                        user_role_jurisdiction && user_role_jurisdiction.length > 0
                            ? render_read_only_role_rows(user_role_jurisdiction)
                            : '<tr class="text-center"><td colspan="6">No roles assigned.</td></tr>'
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
                <div class='input-group-append'><button class='btn btn-outline-secondary'><img src='./img/icon_search.svg' alt=""></button></div>
                </div>
            </div>
            <div class="d-flex ml-auto">
                ${render_account_history_table_navigation_view()}
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
    show_hide_user_management_back_button(true);
    set_page_title("View User");
    document.getElementById("form_content_id").innerHTML = result;
}

function render_account_history_table_navigation_view()
{
    const result = [`
        <div class='d-flex mb-2 mt-2'>
            <div class='ml-auto mr-3 d-flex'>
                <div class='d-flex align-items-center'>
                    <div>Showing 1-10 of 30 cases</div>
                    <div class='row ml-2'>
                        <button disabled='' aria-disabled='true' class='icon-button btn-tab-navigation reverse'>
                            <span class='x24 cdc-icon-chevron-double-right'></span>
                        </button>
                        <button disabled='' aria-disabled='true' class='icon-button btn-tab-navigation reverse'>
                            <span class='x24 cdc-icon-chevron-right'></span>
                        </button>
                        <button class='icon-button btn-tab-navigation'>
                            1
                        </button>
                        <button class='icon-button pt-1 btn-tab-navigation'>
                            <span class='x24 cdc-icon-chevron-right'></span>
                        </button>
                        <button class='icon-button pt-1 btn-tab-navigation'>
                            <span class='x24 cdc-icon-chevron-double-right'></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `];
    return result.join("");
}

function render_read_only_role_rows(p_user_role_jurisdiction)
{
    const result = [];
    for(var i = 0; i < p_user_role_jurisdiction.length; i++)
    {
        const item = p_user_role_jurisdiction[i];
        result.push(user_assigned_role_renderer_view(item))
    }
    return result.join("");
}

function user_assigned_role_renderer_view(p_user_jurisdiction)
{
    const result = `
        <tr>
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select disabled aria-disabled="true" aria-label="Select Role" class="form-select form-control" aria-label="Select user role">
                    ${user_view_role_render(p_user_jurisdiction)}
                    </select>
                </div>
            </td>
            <td width="485">
                <div class="vertical-control p-0 mb-4 col-md-12">
                    <select disabled aria-disabled="true"  aria-label="Select folder" class="form-select form-control" aria-label="Select case access folder">
                        ${user_role_jurisdiction_render(g_jurisdiction_tree, p_user_jurisdiction.jurisdiction_id, 0, p_user_jurisdiction.user_id).join("")}
                    </select>
                </div>
            </td>
             <td>
                <input
                    disabled
                    aria-disabled="true"
                    id="${new_user_roles.length.toString()}_role_effective_start_date"
                    aria-label="Effective Start Date for role ${new_user_roles.length.toString()}"
                    value="${p_user_jurisdiction.effective_start_date != null ? format_date(p_user_jurisdiction.effective_start_date) : ""}"
                    autocomplete="off"
                    class="form-control mb-4"
                    type="date"
                    placeholder="MM/DD/YYYY"
                >
            </td>
            <td>
                <input
                    disabled aria-disabled="true"
                    id="${new_user_roles.length.toString()}_role_effective_end_date"
                    aria-label="Effective End Date for role ${new_user_roles.length.toString()}"
                    value="${p_user_jurisdiction.effective_end_date != null ? format_date(p_user_jurisdiction.effective_end_date.toString()) : ""}"
                    autocomplete="off"
                    class="form-control mb-4"
                    type="date"
                    placeholder="MM/DD/YYYY"
                >
            </td>
            <td>
                <div class="vertical-control col-md-12">
                    <fieldset>
                        <legend class="accessible-hide">Active Status</legend>
                        <div class="form-check">
                            <input
                                disabled aria-disabled="true"
                                ${p_user_jurisdiction.is_active ? "checked" : ""}
                                class="form-check-input big-radio"
                                name="${p_user_jurisdiction.role_name}_active_status"
                                type="radio" value=""
                                id="${p_user_jurisdiction.role_name}_active_status_true"
                            >
                            <label class="form-check-label" for="${p_user_jurisdiction.role_name}_active_status_true">
                                Active
                            </label>
                        </div>
                        <div class="form-check">
                            <input
                                disabled aria-disabled="true"
                                ${p_user_jurisdiction.is_active ? "" : "checked"}
                                class="form-check-input big-radio" type="radio"
                                value=""
                                name="${p_user_jurisdiction.role_name}_active_status"
                                id="${p_user_jurisdiction.role_name}_active_status_false"
                            >
                            <label class="form-check-label" for="${p_user_jurisdiction.role_name}_active_status_false">
                                Inactive
                            </label>
                        </div>
                    </fieldset>
                </div>
            </td>
            <td class="d-flex pt-3 justify-content-center border-none">
                <button disabled aria-disabled="true" class="btn delete-button col-12" aria-label="Delete role" onclick="delete_role('test')">
                    Delete Role
                </button>
            </td>
        </tr>
    `;
    return result;
}

function user_view_role_render(p_user_jurisdiction)
{
    const role_set = get_role_list();
    const result = [];
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
            result.push("<option ");
            if(p_user_jurisdiction.role_name === role)
                result.push( "selected ");
            result.push("value ='" + role + "'>");
            result.push(role_name.join(" "));
            result.push("</option>");
        }
    })
    return result.join("");
}