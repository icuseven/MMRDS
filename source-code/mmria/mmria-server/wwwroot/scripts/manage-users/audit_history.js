var g_audit_history = [];
const ACTION_TYPE = {
    ADD_USER: 'add_user',
    ADD_ROLE: 'add_role',
    DELETE_ROLE: 'delete_role',
    EDIT_ROLE: 'edit_role',
    EDIT_PASSWORD: 'edit_password',
    EDIT_USERNAME: 'edit_username',
}

function init_audit_history() 
{
    g_audit_history = [];
    $('#audit_history_undo_button').prop('disabled', true);
}

function add_to_audit_history(p_user_id, p_elem_id, p_action, p_prev_val, p_new_val)
{
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
    g_audit_history.push(new_audit);
    $('#audit_history_undo_button').prop('disabled', false);
    $('#audit_history_undo_button').attr('aria-disabled', 'false');
    $(`#${p_elem_id}`).data('previousValue', p_new_val);
    console.log(g_audit_history);
}

function audit_history_undo() 
{
    const last_audit = g_audit_history.pop();
    if (last_audit) {
        const role = new_user_roles.find(role => role._id === last_audit.element_id.split('_')[0]);
        switch (last_audit.action) {
            case ACTION_TYPE.ADD_ROLE:
                const removed_role = {
                    _id: last_audit.element_id,
                    html: document.getElementById(`${last_audit.element_id}_role`).outerHTML,
                    role: role
                };
                deleted_user_roles.push(removed_role);
                new_user_roles.splice(new_user_roles.findIndex(r => r._id === last_audit.element_id), 1);
                document.getElementById(`${last_audit.element_id}_role`).remove();
                if (new_user_roles.length <= 0) {
                    document.getElementById("user_roles").innerHTML = '<tr id="no-roles-placeholder" class="text-center"><td colspan="6">No roles assigned.</td></tr>';
                }
                break;
            case ACTION_TYPE.DELETE_ROLE:
                if (deleted_user_roles.length > 0) {
                    const restored_role = deleted_user_roles.pop();
                    new_user_roles.push(restored_role.role);
                    $('#user_roles').append(restored_role.html);
                    // $(`#${restored_role.role._id}_role`).removeAttr('id');
                    // $(`#${restored_role.role._id}_delete`).attr('onclick', `delete_new_role('${restored_role.role._id}')`);
                }
                break;
            case ACTION_TYPE.EDIT_ROLE:
                if (role) {
                    role.role_name = last_audit.prev_value;
                    $(`#${last_audit.element_id}`).val(last_audit.prev_value);
                    $(`#${last_audit.element_id}`).data('previousValue', last_audit.prev_value);
                    if(last_audit.element_id.includes('role_active_status')) {
                        $(`input[name="${last_audit.element_id}"][value="${last_audit.new_value}"]`).prop('checked', false);
                        $(`input[name="${last_audit.element_id}"][value="${last_audit.prev_value}"]`).prop('checked', true);
                    }
                }
                break;
            case ACTION_TYPE.EDIT_PASSWORD:
            case ACTION_TYPE.EDIT_USERNAME:
                $(`#${last_audit.element_id}`).val(last_audit.prev_value);
                $(`#${last_audit.element_id}`).data('previousValue', last_audit.prev_value);
                break;
        }
        can_undo = g_audit_history.length > 0;
        $('#audit_history_undo_button').prop('disabled', !can_undo);
        $('#audit_history_undo_button').attr('aria-disabled', can_undo ? 'false' : 'true');
        if (last_audit.action === ACTION_TYPE.EDIT_ROLE) {
            assigned_roles_validation_check();
        }
    }
    console.log(g_audit_history);
}