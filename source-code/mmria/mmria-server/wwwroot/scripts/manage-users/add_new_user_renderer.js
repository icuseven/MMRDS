function add_new_user_render()
{
    $("#manage_user_label").html('Add New User');
    return `
        <div class="d-flex mt-4">
            <div>
                <h2 class="h4">User Info</h2>
            </div>
            <div class="ml-auto">
                <button class="btn primary-button">Save New User</button>
                <button class="btn primary-button">Undo</button>
            </div>
        </div>
        <div class="d-flex">
            <div class="vertical-control required col-4 pl-0">
                <label>Username (i.e., Email Address)</label>
                <input autocomplete="off" class="form-control" type="text" id="new_user_email">
            </div>
            <div class="vertical-control required col-4 pl-0">
                <label>Password</label>
                <input autocomplete="off" class="form-control" type="text" id="new_user_password">
            </div>
            <div class="vertical-control required col-4 pl-0 pr-0">
                <label>Verify Password</label>
                <input autocomplete="off" class="form-control" type="text" id="new_user_password_verify">
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
                    <tr>
                        <td width="485">
                            <div class="vertical-control p-0 mb-4 col-md-12">
                                <select aria-label="Select Role" class="form-select form-control" aria-label="Select user role">
                                <option selected="">Select role</option>
                                <option value="1">Item1</option>
                                <option value="2">Item2</option>
                                <option value="3">Item3</option>
                                </select>
                            </div>
                        </td>
                        <td width="485">
                            <div class="vertical-control p-0 mb-4 col-md-12">
                                <select aria-label="Select folder" class="form-select form-control" aria-label="Select case access folder">
                                <option selected="">Select role</option>
                                <option value="1">Item1</option>
                                <option value="2">Item2</option>
                                <option value="3">Item3</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div class="vertical-control col-md-12">
                                <fieldset>
                                    <legend class="accessible-hide">Active Status</legend>
                                    <div class="form-check">
                                        <input checked="" aria-checked="true" class="form-check-input big-radio" name="active_status" type="radio" value="" id="active_status_true">
                                        <label class="form-check-label" for="active_status">
                                            Active
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input big-radio" type="radio" value="" name="active_status" id="active_status_false">
                                        <label class="form-check-label" for="active_status">
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
                </tbody>
            </table>
            <div class="d-flex ml-auto mt-2">
                <button class="btn secondary-button col-12" aria-label="Add new role" onclick="add_new_role()">
                    Add New Role
                </button>
            </div>
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