
var g_policy_values = null;
var g_jurisdiction_tree = null;
var g_user_role_jurisdiction = null;
var g_current_u_id = null;
var g_jurisdiction_list = [];
var g_current_user_id = null;
var g_form_name = '';

var g_first_index  = 0;
var g_last_index = 10;
var g_current_page_number = 1;
var g_total_users = 0;
var g_total_users_per_page = 10;


let g_managed_jurisdiction_set = {}

g_user_set = new Set();


var g_user = null;
var g_current_user_role_jurisdiction = null;


const g_ui = { 
	user_summary_list:[],
	user_list:[],
    audit_history: [
    {
        "_id": "a0caf458-f560-461e-a25c-99883e99b576",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_effective_start_date",
        "prev_value": "2025-05-01",
        "value": "2025-05-01",
        "date_created": "2025-07-02T01:53:47.403Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:47.403Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "effective_start_date",
        "data_type": "audit_history"
    },
    {
        "_id": "5b509616-7cd0-42f5-a9e3-922ee6b689c7",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_effective_end_date",
        "prev_value": "",
        "value": "2025-07-25",
        "date_created": "2025-07-02T01:53:40.721Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:40.721Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "effective_end_date",
        "data_type": "audit_history"
    },
    {
        "_id": "8c11d160-58c8-404b-9ebb-b1863a1bc01b",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_jurisdiction_type",
        "prev_value": "",
        "value": "/",
        "date_created": "2025-07-02T01:53:36.111Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:36.111Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "7e7077fa-effc-488d-9749-aee3025341d2",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_type",
        "prev_value": "",
        "value": "data_analyst",
        "date_created": "2025-07-02T01:53:35.095Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:35.095Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "080d079f-8181-4bbe-979c-ef67013247c3",
        "user_id": "absanl",
        "action": "add_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T01:53:33.077Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:33.077Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "c4b1ec0f-dc57-4118-aeea-bd504f510225",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_active_status",
        "prev_value": true,
        "value": "false",
        "date_created": "2025-07-02T01:53:32.461Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:32.461Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "is_active",
        "data_type": "audit_history"
    },
    {
        "_id": "281cab4c-a9ff-42d4-8798-452e55a07f9a",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_jurisdiction_type",
        "prev_value": "/",
        "value": "/Philadelphia",
        "date_created": "2025-07-02T01:53:31.713Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:31.713Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "aca46d1c-f7e1-497a-8efe-f941e000671f",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_type",
        "prev_value": "data_analyst",
        "value": "committee_member",
        "date_created": "2025-07-02T01:53:30.556Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:30.556Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "a0caf458-f560-461e-a25c-99883e99b576",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_effective_start_date",
        "prev_value": "2025-05-01",
        "value": "2025-05-01",
        "date_created": "2025-07-02T01:53:47.403Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:47.403Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "effective_start_date",
        "data_type": "audit_history"
    },
    {
        "_id": "5b509616-7cd0-42f5-a9e3-922ee6b689c7",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_effective_end_date",
        "prev_value": "",
        "value": "2025-07-25",
        "date_created": "2025-07-02T01:53:40.721Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:40.721Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "effective_end_date",
        "data_type": "audit_history"
    },
    {
        "_id": "8c11d160-58c8-404b-9ebb-b1863a1bc01b",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_jurisdiction_type",
        "prev_value": "",
        "value": "/",
        "date_created": "2025-07-02T01:53:36.111Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:36.111Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "7e7077fa-effc-488d-9749-aee3025341d2",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_type",
        "prev_value": "",
        "value": "data_analyst",
        "date_created": "2025-07-02T01:53:35.095Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:35.095Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "080d079f-8181-4bbe-979c-ef67013247c3",
        "user_id": "absanl",
        "action": "add_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T01:53:33.077Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:33.077Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "c4b1ec0f-dc57-4118-aeea-bd504f510225",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_active_status",
        "prev_value": true,
        "value": "false",
        "date_created": "2025-07-02T01:53:32.461Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:32.461Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "is_active",
        "data_type": "audit_history"
    },
    {
        "_id": "281cab4c-a9ff-42d4-8798-452e55a07f9a",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_jurisdiction_type",
        "prev_value": "/",
        "value": "/Philadelphia",
        "date_created": "2025-07-02T01:53:31.713Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:31.713Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "aca46d1c-f7e1-497a-8efe-f941e000671f",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_type",
        "prev_value": "data_analyst",
        "value": "committee_member",
        "date_created": "2025-07-02T01:53:30.556Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:30.556Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "a0caf458-f560-461e-a25c-99883e99b576",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_effective_start_date",
        "prev_value": "2025-05-01",
        "value": "2025-05-01",
        "date_created": "2025-07-02T01:53:47.403Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:47.403Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "effective_start_date",
        "data_type": "audit_history"
    },
    {
        "_id": "5b509616-7cd0-42f5-a9e3-922ee6b689c7",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_effective_end_date",
        "prev_value": "",
        "value": "2025-07-25",
        "date_created": "2025-07-02T01:53:40.721Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:40.721Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "effective_end_date",
        "data_type": "audit_history"
    },
    {
        "_id": "8c11d160-58c8-404b-9ebb-b1863a1bc01b",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_jurisdiction_type",
        "prev_value": "previous value",
        "value": "/",
        "date_created": "2025-07-02T01:53:36.111Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:36.111Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "7e7077fa-effc-488d-9749-aee3025341d2",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700_role_type",
        "prev_value": "",
        "value": "data_analyst",
        "date_created": "2025-07-02T01:53:35.095Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:35.095Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "080d079f-8181-4bbe-979c-ef67013247c3",
        "user_id": "absanl",
        "action": "add_role",
        "element_id": "8f73dde7-918c-43a2-834e-b3d2d0ab1700",
        "prev_value": "hahasha",
        "value": "",
        "date_created": "2025-07-02T01:53:33.077Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:33.077Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "c4b1ec0f-dc57-4118-aeea-bd504f510225",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_active_status",
        "prev_value": true,
        "value": "false",
        "date_created": "2025-07-02T01:53:32.461Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:32.461Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "is_active",
        "data_type": "audit_history"
    },
    {
        "_id": "281cab4c-a9ff-42d4-8798-452e55a07f9a",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_jurisdiction_type",
        "prev_value": "/",
        "value": "/can you see me?",
        "date_created": "2025-07-02T01:53:31.713Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:31.713Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "aca46d1c-f7e1-497a-8efe-f941e000671f",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "11dbedaa-32f8-468b-ba74-8aeff6e3a772_role_type",
        "prev_value": "data_analyst",
        "value": "committee_member",
        "date_created": "2025-07-02T01:53:30.556Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T01:53:30.556Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "0e310034-4904-48cc-950c-1077b7f48ea1",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "4a66dffe-b902-455a-ae9a-eeef748e6c6c_role_active_status",
        "prev_value": "true",
        "value": "false",
        "date_created": "2025-07-02T18:09:47.211Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:09:47.211Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "is_active",
        "data_type": "audit_history"
    },
    {
        "_id": "94762f88-1293-43cd-8d1a-63dd44ad8ab4",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "4a66dffe-b902-455a-ae9a-eeef748e6c6c_role_jurisdiction_type",
        "prev_value": "",
        "value": "/",
        "date_created": "2025-07-02T18:09:46.243Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:09:46.243Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "999a83e2-570e-400c-b4f8-e89e31cb1293",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "4a66dffe-b902-455a-ae9a-eeef748e6c6c_role_type",
        "prev_value": "",
        "value": "committee_member",
        "date_created": "2025-07-02T18:09:44.693Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:09:44.693Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "33f5ecd5-c77c-4f85-ae42-44d849b4e7b4",
        "user_id": "absanl",
        "action": "add_role",
        "element_id": "4a66dffe-b902-455a-ae9a-eeef748e6c6c",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T18:09:42.702Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:09:42.702Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "0aedafb8-2812-4f20-9151-56eedc765199",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "c793fe22-68b1-49ac-9a03-eeed8c8566be_role_jurisdiction_type",
        "prev_value": "/",
        "value": "/Committee_Review",
        "date_created": "2025-07-02T18:09:41.351Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:09:41.351Z",
        "last_updated_by": "user5",
        "parent_id": "abstractor",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "df035975-fb52-4ce7-b083-fb8062125adf",
        "user_id": "absanl",
        "action": "edit_password",
        "element_id": "user_password",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T18:09:36.578Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:09:36.578Z",
        "last_updated_by": "user5",
        "parent_id": "",
        "data_id": "password",
        "data_type": "audit_history"
    },
    {
        "_id": "7b1f4f2e-df48-46fc-9db1-28dfacb77ea2",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "5825d70a-dd02-4635-a427-1d2ffb8a9277_role_active_status",
        "prev_value": false,
        "value": "false",
        "date_created": "2025-07-02T18:14:50.013Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:14:50.013Z",
        "last_updated_by": "user5",
        "parent_id": "vital_importer",
        "data_id": "is_active",
        "data_type": "audit_history"
    },
    {
        "_id": "4abc77d2-2fc2-4f79-bc81-20fc835140e2",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "5825d70a-dd02-4635-a427-1d2ffb8a9277_role_jurisdiction_type",
        "prev_value": "/Philadelphia",
        "value": "/Philadelphia",
        "date_created": "2025-07-02T18:14:48.365Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:14:48.365Z",
        "last_updated_by": "user5",
        "parent_id": "vital_importer",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "ad335b71-91d1-4bb3-8253-5867e8c5ee23",
        "user_id": "absanl",
        "action": "edit_role",
        "element_id": "5825d70a-dd02-4635-a427-1d2ffb8a9277_role_type",
        "prev_value": "vital_importer",
        "value": "vital_importer",
        "date_created": "2025-07-02T18:14:46.188Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:14:46.188Z",
        "last_updated_by": "user5",
        "parent_id": "vital_importer",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "ec645642-585e-4d05-947a-230b04c081d2",
        "user_id": "absanl",
        "action": "add_role",
        "element_id": "5825d70a-dd02-4635-a427-1d2ffb8a9277",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T18:14:44.341Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:14:44.341Z",
        "last_updated_by": "user5",
        "parent_id": "vital_importer",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "23bfa9b2-77e1-4261-919c-01e692e44829",
        "user_id": "absanl",
        "action": "add_user",
        "element_id": "add_user",
        "prev_value": "",
        "value": "absanl",
        "date_created": "2025-07-02T18:14:33.027Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T18:14:33.027Z",
        "last_updated_by": "user5",
        "parent_id": "",
        "data_id": "add_user",
        "data_type": "audit_history"
    },
    {
        "_id": "b464036b-6d5e-41dc-b173-413855e542e5",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "e7c30ad9-2f3f-4d96-b27e-202ce0a7f63c_role_jurisdiction_type",
        "prev_value": "",
        "value": "/Philadelphia",
        "date_created": "2025-07-02T20:16:47.548Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:47.548Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "b6fc3d1c-b4f9-400f-9cee-bd2bcc504504",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "e7c30ad9-2f3f-4d96-b27e-202ce0a7f63c_role_active_status",
        "prev_value": "",
        "value": "false",
        "date_created": "2025-07-02T20:16:44.795Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:44.795Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "is_active",
        "data_type": "audit_history"
    },
    {
        "_id": "deac4f06-aa58-4e91-9e15-a3b45452d558",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "e7c30ad9-2f3f-4d96-b27e-202ce0a7f63c_role_type",
        "prev_value": "",
        "value": "committee_member",
        "date_created": "2025-07-02T20:16:43.231Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:43.231Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "81ded66d-9980-41fd-adcb-046066be7c08",
        "user_id": "audit_test",
        "action": "add_role",
        "element_id": "e7c30ad9-2f3f-4d96-b27e-202ce0a7f63c",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T20:16:41.473Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:41.473Z",
        "last_updated_by": "user5",
        "parent_id": "committee_member",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "d9ee1a03-0c8b-4023-96ae-a1a44260b08f",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "aa27d9de-47d6-439c-8a0b-318c0b47d830_role_jurisdiction_type",
        "prev_value": "",
        "value": "/",
        "date_created": "2025-07-02T20:16:40.560Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:40.560Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "1898555b-5fd5-43d5-9f59-5f1d94579a9b",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "aa27d9de-47d6-439c-8a0b-318c0b47d830_role_type",
        "prev_value": "",
        "value": "data_analyst",
        "date_created": "2025-07-02T20:16:39.222Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:39.222Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "853956d7-73b0-4cac-9086-1d84b9c85e46",
        "user_id": "audit_test",
        "action": "add_role",
        "element_id": "aa27d9de-47d6-439c-8a0b-318c0b47d830",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T20:16:37.920Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:37.920Z",
        "last_updated_by": "user5",
        "parent_id": "data_analyst",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "9adfdd35-7a78-4af8-8772-7dd83ffab333",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "7eb39186-862b-4fff-89fa-9d3a307f80d6_role_jurisdiction_type",
        "prev_value": "",
        "value": "/",
        "date_created": "2025-07-02T20:16:36.987Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:36.987Z",
        "last_updated_by": "user5",
        "parent_id": "abstractor",
        "data_id": "jurisdiction_id",
        "data_type": "audit_history"
    },
    {
        "_id": "6ac94f82-56b7-4534-a359-e1f292123bc3",
        "user_id": "audit_test",
        "action": "edit_role",
        "element_id": "7eb39186-862b-4fff-89fa-9d3a307f80d6_role_type",
        "prev_value": "",
        "value": "abstractor",
        "date_created": "2025-07-02T20:16:36.137Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:36.137Z",
        "last_updated_by": "user5",
        "parent_id": "abstractor",
        "data_id": "role_name",
        "data_type": "audit_history"
    },
    {
        "_id": "82e8d42c-f99f-4f56-967e-ef13796cdfea",
        "user_id": "audit_test",
        "action": "add_role",
        "element_id": "7eb39186-862b-4fff-89fa-9d3a307f80d6",
        "prev_value": "",
        "value": "",
        "date_created": "2025-07-02T20:16:34.809Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:34.809Z",
        "last_updated_by": "user5",
        "parent_id": "abstractor",
        "data_id": "add_role",
        "data_type": "audit_history"
    },
    {
        "_id": "4e396322-2afe-4caf-8eaf-fdad78505ff8",
        "user_id": "audit_test",
        "action": "add_user",
        "element_id": "add_user",
        "prev_value": "",
        "value": "audit_test",
        "date_created": "2025-07-02T20:16:19.737Z",
        "created_by": "user5",
        "date_last_updated": "2025-07-02T20:16:19.737Z",
        "last_updated_by": "user5",
        "parent_id": "",
        "data_id": "add_user",
        "data_type": "audit_history"
    }
],
	data:null,
	url_state: {
        selected_form_name: null,
        selected_id: null,
        selected_child_id: null,
        path_array : []
  }
};

var $$ = {
 is_id: function(value){
   // 2016-06-12T13:49:24.759Z
    if(value)
    {
      let test = value.match(/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/);
      return (test)? true : false;
    }
    else
    {
        return false;
    }
  }
};



window.onload = main;

async function main()
{
  'use strict';
	window.onhashchange = on_hash_change;
	await load_values();
}


async function on_hash_change(e)
{
    if(e.isTrusted)
    {
        var new_url = e.newURL || window.location.href;
        g_ui.url_state = url_monitor.get_url_state(new_url);
        //console.log(g_ui.url_state);
        g_render();
    }
}


async function load_values()
{

    $('#form_content_id').html(
        `
        <span class="spinner-container spinner-content spinner-active">
            <span class="spinner-body text-primary">
                <span class="spinner"></span>
                <span class="spinner-info">Loading...</span>
            </span>
        </span>
  `
    );
    //window.location.href = set_url_hash(``);

    const get_initial_data_response = await get_http_get_response('manage-users/GetInitialData')

    //onsole.log(get_initial_data_response);


    g_policy_values = get_initial_data_response.policy_values;

    for(let i = 0; i < get_initial_data_response.my_roles.rows.length; i++)
    {
        
        let value = get_initial_data_response.my_roles.rows[i].value;
        g_current_u_id = value.user_id
        break;
    }

    
    g_jurisdiction_list = []
    for(let i in get_initial_data_response.my_roles.rows)
    {
        var current_date = new Date();
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var value = get_initial_data_response.my_roles.rows[i].value;
        var diffDays = 0;
        var effective_start_date = "";
        var effective_end_date = "never";
        if(value.effective_start_date && value.effective_start_date != "")
        {
            effective_start_date = value.effective_start_date.split('T')[0];
        }
        if(value.effective_end_date && value.effective_end_date != "")
        {
            effective_end_date = value.effective_end_date.split('T')[0];
            diffDays = Math.round((new Date(value.effective_end_date).getTime() - current_date.getTime())/(oneDay));
        }
        if(diffDays < 0)
        {
            //role_list_html.push("<td class='td'>false</td>");
        }
        else
        {
            g_jurisdiction_list.push(value);
            if
            (
                value.role_name == "jurisdiction_admin" 
            )
            {
                g_managed_jurisdiction_set[value.jurisdiction_id] = true;
            }
            else if
            (
                value.role_name == "installation_admin"
            )
            {
                if(value.jurisdiction_id == null)
                {
                    g_managed_jurisdiction_set["/"] = true;
                }
                else
                {
                    g_managed_jurisdiction_set[value.jurisdiction_id] = true;
                }
            }
        }


    }  
    
    console.log(get_initial_data_response);
    g_jurisdiction_tree = get_initial_data_response.jurisdiction_tree;

    g_user_role_jurisdiction = [];

    //g_user_role_jurisdiction = get_initial_data_response.user_role_jurisdiction;
    for(let i = 0; i < get_initial_data_response.user_role_jurisdiction.rows.length; i++)
    {
        const item = get_initial_data_response.user_role_jurisdiction.rows[i];
        item.value._id = item.id;
        g_user_role_jurisdiction.push(item.value);
    }

    

    let temp = [];
    for(let i = 0; i < get_initial_data_response.user_list.rows.length; i++)
    {
        temp.push(get_initial_data_response.user_list.rows[i].doc);
    }

    g_ui.user_summary_list = temp;


    
    
/*
    let temp = [];
    for(let i = 0; i < get_initial_data_response.user_role_jurisdiction.rows.length; i++)
    {
        const item = get_initial_data_response.user_role_jurisdiction.rows[i].value;
        if(item.user_id != null)
        {
            temp.push(item);
            g_user_set.add(item.user_id) 
        }
        
    }

    g_ui.user_summary_list = temp;
*/
    g_ui.url_state = url_monitor.get_url_state(window.location.href);


    //document.getElementById('form_content_id').innerHTML = user_render(g_ui, g_current_u_id).join("");
    g_render();

    //await get_all_user_role_jurisdiction();

}




async function server_save(p_user)
{
	console.log("server save");
	//var current_auth_session = profile.get_auth_session_cookie();

	if(current_auth_session)
	{ 
        const response = await get_http_post_response("api/user", p_user)

        const response_obj = eval(response);
        if(response_obj.ok)
        {
            g_user_list._rev = response_obj.rev; 
            document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "").join("");
        }
        //{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
        console.log("metadata sent", response);

	}

}

function add_new_user_click()
{
    g_user = {
        "_id": "org.couchdb.user:new_user",
        "iterations": 10,
        "name": "new_user",
        "roles": [],
        "type": "user",
        "derived_key": "eb257ea6d2195f72b3f48b3802d7118220ad1d6a",
        "salt": "78b006be78ba51262287320a123e61f0",
        "is_active": false,
        "is_enabled": false,
        "app_prefix_list": {
          "__no_prefix__": true
        },
        "password_scheme": "pbkdf2"
      };

    g_current_user_role_jurisdiction = [
        {
            "_id": null,
            "_rev": null,
            "parent_id": null,
            "role_name": "vital_importer",
            "user_id": "new_user",
            "jurisdiction_id": "/",
            "application_namespace": null,
            "effective_start_date": "2024-03-27T04:00:00Z",
            "effective_end_date": null,
            "is_active": true,
            "date_created": "2024-03-27T10:32:17.043Z",
            "created_by": "user1",
            "date_last_updated": "2024-03-27T10:32:17.043Z",
            "last_updated_by": "user1",
            "data_type": "user_role_jurisdiction"
        }
    ]
    //console.log("add new user clicked");
    window.location.href = set_url_hash('add-new-user');
}

function export_user_list_click()
{
    console.log("export user list clicked");
    //window.location.href = set_url_hash('view-user');
}

function view_audit_log_click()
{
    console.log("view audit log clicked");
    window.location.href = set_url_hash('audit-log');
}

function view_user_click(p_user_id)
{
    console.log(`view ${p_user_id} clicked`);
    //console.log(`edit ${p_user_id} clicked`);
    window.location.href = set_url_hash(`view-user?${p_user_id}`);
}

function edit_user_click(p_user_id)
{
    console.log(`edit ${p_user_id} clicked`);
    window.location.href = set_url_hash(`edit-user?${p_user_id}`);
}

async function delete_user_click(p_user_id, p_rev)
{
    console.log(`delete user ${p_user_id} clicked with rev: ${p_rev}`);
    if(p_user_id && p_rev)
    { 
        const response = await get_http_delete_response(`api/user_role_jurisdiction?_id=${p_user_id}&rev=${p_rev}`);

        $mmria.confirm_user_delete_dialog_close();
        if(response.ok)
        {
            for(var i in g_ui.user_summary_list)
            {
                if(g_ui.user_summary_list[i]._id == response.id)
                {
                    g_ui.user_summary_list.splice(i,1)
                    break;
                }
            }
            g_render();
        }
    }

        
}

function set_roles_inactive_for_user_click(p_user_id)
{
    console.log(`set roles inactive for ${p_user_id} clicked`);
    //window.location.href = set_url_hash('add-new-user');
}

function back_to_landing_clicked()
{
    window.location.href = set_url_hash(`summary`);
}

function set_url_hash(new_hash)
{
    const current_url = new URL(window.location.href);
    current_url.hash = new_hash;
    return current_url;
}

function show_hide_user_management_back_button(shouldShow)
{
    if(shouldShow)
    {
        $("#navigate_back_to_landing").html(
            `
                <button class="btn btn-link pl-0" onclick="back_to_landing_clicked()">
                    <span class="x16 cdc-icon-chevron-circle-left"></span> Back to user Management
                </button>
            `
        )
    }
    else
    {
        $("#navigate_back_to_landing").html("");
    }
}


function add_new_user_save()
{
	var new_user_name = document.getElementById('new_user_name').value.trim();
	var new_user_password = null;
	var new_user_verify= null;

	if(g_policy_values.sams_is_enabled.toLowerCase() == "True".toLowerCase())
	{
		new_user_password = $mmria.get_new_guid().replace("-","");
		new_user_verify = new_user_password;
	}
	else
	{
		new_user_password = document.getElementById('new_user_password').value;
		new_user_verify= document.getElementById('new_user_verify').value;
	}
	var user_id = null;
	if(is_valid_user_name(new_user_name))
	{
		if
		(
			new_user_password == new_user_verify &&
			is_valid_password(new_user_password)
		)
		{
            check_if_existing_user(new_user_name, new_user_password);
		}
		else
		{
			create_status_warning("invalid password.<br/>be sure that verify and password match,<br/> minimum length is: " + g_policy_values.minimum_length + " and should only include characters [a-zA-Z0-9!@#$%?* ]", "new_user");
		}
	}
	else
	{
		create_status_warning("invalid user name. user name should be unique and at least 5 characters long. ", "new_user");
		console.log("got nothing.");
	}
}

async function change_password_user_click(p_user_id)
{
	
	var new_user_password = document.querySelector('[role="confirm_1"][path="' + p_user_id + '"]').value;
	var new_confirm_password = document.querySelector('[role="confirm_2"][path="' + p_user_id + '"]').value;

	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	var user = null;
	for(var i = 0; i < user_list.length; i++)
	{
		if(user_list[i]._id == p_user_id)
		{
			user = user_list[i];
			break;
		}
	}


	if(
		new_user_password == new_confirm_password &&
		is_valid_password(new_user_password)
	)
	{



		if(user)
		{
			user.password = new_user_password;

            const response = await get_http_post_response('/api/user', user)

            const response_obj = eval(response);
            if(response_obj.ok)
            {
                for(let i = 0; i < g_ui.user_summary_list.length; i++)
                {
                    if(g_ui.user_summary_list[i]._id == response_obj.id)
                    {
                        g_ui.user_summary_list[i]._rev = response_obj.rev; 
                        break;
                    }
                }

                if(response_obj.auth_session)
                {
                    //profile.auth_session = response_obj.auth_session;
                    $mmria.addCookie("AuthSession", response_obj.auth_session);
                }

                create_status_message("user information saved", convert_to_jquery_id(user._id));
                console.log("password saved sent", response);
            }
		}
		else
		{
			g_render();
		}
	}
	else
	{

		create_status_warning("invalid password.<br/>be sure that verify and password match,<br/>  minimum length is: " + g_policy_values.minimum_length + " and should only include characters [a-zA-Z0-9!@#$%?* ]", convert_to_jquery_id(user._id));
		//create_status_warning("invalid password and confirm", convert_to_jquery_id(user._id));
		console.log("got nothing.");
	}
}


function is_valid_user_name(p_value)
{
	var result = true;

	if(
		p_value && 
		p_value.length > 4
	)
	{
		//console.log("greatness awaits.");
	}
	else
	{
		result = false;
	}


	for(var i in g_ui.user_summary_list)
	{
		if(g_ui.user_summary_list[i]._id.toLowerCase() == "org.couchdb.user:" + p_value.toLowerCase())
		{
			result = false;
			break;
		}
	}

	return result;
}

function is_valid_password(p_value)
{
	var result = true;

    var valid_character_re = /^[a-zA-Z0-9!@#$\%\?\* \-]+$/g;


	if(
		p_value &&
		p_value.length >= g_policy_values.minimum_length &&
		p_value.match(valid_character_re)
	)
	{
		//console.log("greatness awaits.");
	}
	else
	{
		result = false;
	}

	return result;
	
}

function add_role(p_user_id, p_created_by)
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

		var temp_user_role = user_role_jurisdiction_add
		(
			"",
			user.name,
			"",
			new Date(new Date().setHours(0,0,0,0)),
			g_policy_values.default_days_in_effective_date_interval != null && parseInt(g_policy_values.default_days_in_effective_date_interval) >0? new Date(new Date().getTime() + parseInt(g_policy_values.default_days_in_effective_date_interval)*24*60*60*1000).setHours(0,0,0,0) : "",
			true,
			p_created_by
		);

		g_user_role_jurisdiction.push(temp_user_role);

		var role_list_for_ = document.getElementById("role_list_for_" + user.name);


		var opt = document.createElement('option');
		var option_text = [];
		option_text.push(temp_user_role.user_id);
		option_text.push(" ");
		option_text.push(temp_user_role.role_name);
		option_text.push(" ");
		option_text.push(temp_user_role.jurisdiction_id);
		option_text.push(" ");

		if(temp_user_role.effective_start_date instanceof Date)
		{
			option_text.push(temp_user_role.effective_start_date.toISOString());
		}
		else
		{
			option_text.push(temp_user_role.effective_start_date);
		}
		
		option_text.push(" ");
		if(temp_user_role.effective_end_date instanceof Date)
		{
			if(user_role.effective_end_date != "Invalid Date")
			{
				option_text.push(temp_user_role.effective_end_date.toISOString());
			}
			else
			{
				option_text.push(temp_user_role.effective_end_date);
			}
			
		}
		else
		{
			option_text.push(temp_user_role.effective_end_date);
		}		
		option_text.push(" ");
		option_text.push(temp_user_role.is_active);

		opt.value = temp_user_role._id;
		opt.selected = true;
		opt.innerHTML = option_text.join("");

		role_list_for_.appendChild(opt);

	
		var render_result = user_role_edit_render(user, temp_user_role, p_created_by);
		var selected_user_role_for_ = document.getElementById("selected_user_role_for_" + user.name);
		selected_user_role_for_.outerHTML = render_result.join("");

	}

}


function update_role(p_user_role_jurisdiction_id, p_user_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_jurisdiction_id)
		{
			user_role_index = i;
			break;
		}
	}
	if(user_role_index > -1)
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i].name ==  g_user_role_jurisdiction[user_role_index].user_id)
			{
				user_index = i;
				break;
			}
		}
		if(user_index > -1)
		{
			var user_role = g_user_role_jurisdiction[user_role_index];
			var user = user_list[user_index];
			var selected_user_role_for_ = null;
			var role = document.getElementById("selected_user_role_for_" + user_role.user_id + "_role");
			var jurisdiction = document.getElementById("selected_user_role_for_" + user_role.user_id+ "_jurisdiction");
			var effective_start_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_start_date");
			var effective_end_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_end_date");
			var is_active = document.getElementById("selected_user_role_for_" + user_role.user_id + "_is_active");
			user_role.role_name = role.value;
			user_role.jurisdiction_id = jurisdiction.value;
			user_role.effective_start_date = new Date(effective_start_date.value);
			if(effective_end_date.value != null && effective_end_date.value != "")
			{
				user_role.effective_end_date = new Date(effective_end_date.value);
			}
			else
			{
				user_role.effective_end_date = null;
			}
			user_role.is_active = (is_active.value == "true")? true: false;
			user_role.last_updated_by = p_user_id;
			if(user_role.jurisdiction_id && user_role.role_name)
			{
				document.getElementById(convert_to_jquery_id(user._id) + "_status_area").innerHTML = "";
				document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
				save_user_role_jurisdiction(user_role, user, p_user_id);
			}
			else
			{
				create_status_warning("invalid jusidiction or role name", convert_to_jquery_id(user._id));
			}
		}
	}
}

async function remove_role(p_user_role_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_id)
		{
			user_role_index = i;
			break;
		}
	}

	if(user_role_index > -1)
	{
		var user_role = g_user_role_jurisdiction[user_role_index];

		var retVal = null
		
		if(user_role._rev)
		{
			retVal = prompt("Confirm role removal for user " + user_role.user_id + " by entering [" + user_role.role_name + "]: ", "enter role name here");
		}

		if(retVal && retVal.toLocaleLowerCase() == user_role.role_name && user_role._rev)
		{ 
            const response = await get_http_delete_response(`api/user_role_jurisdiction?_id=${user_role._id}&rev=${user_role._rev}`);
            if(response.ok)
            {
                g_user_role_jurisdiction.splice(user_role_index, 1);

                
                for(let i = 0; i < g_ui.user_summary_list.length; i++)
                {
                    if(g_ui.user_summary_list[i].name == user_role.user_id)
                    {
                        let escaped_id =  convert_to_jquery_id(g_ui.user_summary_list[i]._id);
                        $( "#" + escaped_id).replaceWith( user_entry_render(g_ui.user_summary_list[i], i, g_current_u_id).join("") );
                        break;
                    }
                }
                document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
                document.getElementById(convert_to_jquery_id("org.couchdb.user:" + user_role.user_id) + "_status_area").innerHTML = "";
            }

		}
		else
		{
				
			

		}
	}
}

function change_password(p_user_id, p_role)
{
	var user_index = -1;
	var user_list = g_ui.user_summary_list;
	var escaped_id =  convert_to_jquery_id(p_user_id);
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
		var role_index = user.roles.indexOf(p_role);
		if(role_index > -1)
		{
			user.roles.splice(role_index, 1);
			g_ui.user_summary_list[user_index] = user;
			$( "#" + escaped_id).replaceWith( user_entry_render(user,  0, g_current_u_id).join("") );
			create_status_message("user information saved", convert_to_jquery_id(user._id));
		}
	}
}

function convert_to_jquery_id(p_value)
{
	return p_value.replace('@', 'ATT').replace(':','COL').replace(/\./g,'DOT');
}

function create_status_message(p_message, p_div_id)
{
	var result = [];

	//result.push('<div class="alert alert-success alert-dismissible">');
	result.push('<div>');
	//result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	// result.push('<strong>Info!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById(p_div_id + "_status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function create_status_warning(p_message, p_div_id)
{
	var result = [];

	//result.push('<div class="alert alert-danger">');
	result.push('<div>');
	//result.push('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>');
	result.push('<strong>Warning!</strong> ');
	result.push(p_message);
	result.push('</div>');

	document.getElementById(p_div_id + "_status_area").innerHTML = result.join("");

	window.setTimeout(clear_status, 30000);
}

function clear_status()
{
	document.getElementById("status_area").innerHTML = "<div>&nbsp;</div>";
}

function jurisdiction_add_child_click(p_parent_id, p_name, p_user_id)
{
	var parent = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
	var new_child  = null;

	if(parent)
	{
		if(parent.name == "/")
		{
			new_child  = jurisdiction_add(p_parent_id, "/" + p_name, p_user_id);
		}
		else
		{
			new_child  = jurisdiction_add(p_parent_id, parent.name + "/" + p_name, p_user_id);
		}
		
	}
	else
	{
		new_child  = jurisdiction_add(p_parent_id, p_name, p_user_id);
	}
	
	
	if
	(
		p_name != null && 
		p_name != "" && 
		p_name.match(/\W/) == null && 
		get_jurisdiction(new_child.id, g_jurisdiction_tree) == null
	)
	{
		var node_to_add_to = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
		if(node_to_add_to)
		{
			node_to_add_to.children.push(new_child);
			g_jurisdiction_tree.date_last_updated = new Date();
			g_jurisdiction_tree.last_updated_by = p_user_id;
			var x = jurisdiction_render(node_to_add_to);

			var y=document.getElementById(p_parent_id.replace("/","_"));

			y.outerHTML = x.join("");
			
		}

	}
	
}

function jurisdiction_remove_child_click(p_parent_id, p_node_id, p_user_id)
{

	if(p_node_id != "jurisdiction_tree")
	{
		remove_jurisdiction(p_node_id, g_jurisdiction_tree)
		g_jurisdiction_tree.date_last_updated = new Date();
		g_jurisdiction_tree.last_updated_by = p_user_id;
		var node_to_add_to = get_jurisdiction(p_parent_id, g_jurisdiction_tree);
		if(node_to_add_to)
		{
			var x = jurisdiction_render(node_to_add_to);

			var y=document.getElementById(p_parent_id.replace("/","_"));

			y.outerHTML = x.join("");
			
		}

	}
	
}

function get_jurisdiction(p_search_id, p_node)
{
	var result = null;

	if(p_node._id && p_node._id == p_search_id)
	{
		return p_node;
	}

	if(p_node.id && p_node.id == p_search_id)
	{
		return p_node;
	}

	if(p_node.children != null)
	{
		for(var i = 0; i < p_node.children.length; i++)
		{
			var child = p_node.children[i];
			result = get_jurisdiction(p_search_id, child);
			if(result != null)
			{
				return result;
			}
		}
	}

	return result;
}

function remove_jurisdiction(p_search_id, p_node)
{
	if(p_node._id && p_node._id == p_search_id)
	{
		return;
	}

	if(p_node.children != null)
	{
		for(var i = 0; i < p_node.children.length; i++)
		{
			var child = p_node.children[i];
			if(p_node.children[i].id == p_search_id)
			{
				p_node.children.splice(i, 1);
				return;
			}
			else
			{
				remove_jurisdiction(p_search_id, child)
			}
		}
	}

	return;
}

function jurisdiction_add(p_parent_id, p_name, p_user_id)
{
	var result = {
		id: p_parent_id + "/" + p_name,
		name: p_name,
		date_created: new Date(),
		created_by: p_user_id,
		date_last_updated: new Date(),
		last_updated_by: p_user_id,
		is_active: true,
		is_enabled: true,
		children:[],
		parent_id: p_parent_id
	}

	return result;
}

function jurisdiction_update()
{
	
}


function jurisdiction_delete()
{
	
}


function user_role_jurisdiction_add
(
	p_role_name,
	p_user_id,
	p_jurisdiction_id,
	p_effective_start_date,
	p_effective_end_date,
	p_is_active,
	p_created_by
)
{
	var result = {
		_id: $mmria.get_new_guid(),
		role_name : p_role_name,
		user_id: p_user_id,
		jurisdiction_id: p_jurisdiction_id,

		effective_start_date: p_effective_start_date,
		effective_end_date: p_effective_end_date,
		is_active: p_is_active,
		date_created: new Date(),
		created_by: p_created_by,
		date_last_updated: new Date(),
		last_updated_by: p_created_by,
		data_type:"user_role_jursidiction"
	}

	return result;
}

function g_render()
{
    set_current_page_state();
    switch(g_form_name)
    {
        case "view-user":
            view_user_renderer();
            break;
        case "edit-user":
            edit_user_renderer();
            break;
        case "add-new-user":
            add_new_user_render();
            break;
        case "audit-log":
            audit_log_renderer();
            break;
        case "summary":
        default:
            summary_render();
    }
}

function set_current_page_state()
{
    g_form_name = g_ui.url_state.selected_form_name;
    let path_array = [];
    if(g_form_name != null && g_form_name.indexOf("?") > -1)
    {
        path_array = g_ui.url_state.path_array[0].split("?");
        g_form_name = path_array[0];
    }
    g_current_user_id = path_array[1] ? path_array[1] : null; 
}

function set_page_title(p_title)
{
    document.getElementById('manage_user_label').innerHTML = p_title;
}

async function set_all_roles_active_state(p_user_id)
{
    const user_roles = g_user_role_jurisdiction.filter(user => user.user_id === p_user_id);
    user_roles.forEach(user_role => {
        user_role.last_updated_by = p_user_id;
        user_role.date_last_updated = new Date();
        user_role.is_active = false;
    });

    await bulk_save_user_role_jurisdiction(user_roles, p_user_id); 
}

function update_role(p_user_role_jurisdiction_id, p_user_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_jurisdiction_id)
		{
			user_role_index = i;
			break;
		}
	}
	if(user_role_index > -1)
	{
		var user_index = -1;
		var user_list = g_ui.user_summary_list;
		for(var i = 0; i < user_list.length; i++)
		{
			if(user_list[i].name ==  g_user_role_jurisdiction[user_role_index].user_id)
			{
				user_index = i;
				break;
			}
		}
		if(user_index > -1)
		{
			var user_role = g_user_role_jurisdiction[user_role_index];
			var user = user_list[user_index];
			var selected_user_role_for_ = null;
			var role = document.getElementById("selected_user_role_for_" + user_role.user_id + "_role");
			var jurisdiction = document.getElementById("selected_user_role_for_" + user_role.user_id+ "_jurisdiction");
			var effective_start_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_start_date");
			var effective_end_date = document.getElementById("selected_user_role_for_" + user_role.user_id + "_effective_end_date");
			var is_active = document.getElementById("selected_user_role_for_" + user_role.user_id + "_is_active");
			user_role.role_name = role.value;
			user_role.jurisdiction_id = jurisdiction.value;
			user_role.effective_start_date = new Date(effective_start_date.value);
			if(effective_end_date.value != null && effective_end_date.value != "")
			{
				user_role.effective_end_date = new Date(effective_end_date.value);
			}
			else
			{
				user_role.effective_end_date = null;
			}
			user_role.is_active = (is_active.value == "true")? true: false;
			user_role.last_updated_by = p_user_id;
			if(user_role.jurisdiction_id && user_role.role_name)
			{
				document.getElementById(convert_to_jquery_id(user._id) + "_status_area").innerHTML = "";
				document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
				save_user_role_jurisdiction(user_role, user, p_user_id);
			}
			else
			{
				create_status_warning("invalid jusidiction or role name", convert_to_jquery_id(user._id));
			}
		}
	}
}

async function remove_role(p_user_role_id)
{
	var user_role_index = -1;
	for(var i = 0; i < g_user_role_jurisdiction.length; i++)
	{
		if(g_user_role_jurisdiction[i]._id == p_user_role_id)
		{
			user_role_index = i;
			break;
		}
	}
	if(user_role_index > -1)
	{
		var user_role = g_user_role_jurisdiction[user_role_index];
		var retVal = null
		if(user_role._rev)
		{
			retVal = prompt("Confirm role removal for user " + user_role.user_id + " by entering [" + user_role.role_name + "]: ", "enter role name here");
		}
		if(retVal && retVal.toLocaleLowerCase() == user_role.role_name && user_role._rev)
		{ 
            const response = await get_http_delete_response(`api/user_role_jurisdiction?_id=${user_role._id}&rev=${user_role._rev}`);
            if(response.ok)
            {
                g_user_role_jurisdiction.splice(user_role_index, 1);
                for(let i = 0; i < g_ui.user_summary_list.length; i++)
                {
                    if(g_ui.user_summary_list[i].name == user_role.user_id)
                    {
                        let escaped_id =  convert_to_jquery_id(g_ui.user_summary_list[i]._id);
                        $( "#" + escaped_id).replaceWith( user_entry_render(g_ui.user_summary_list[i], i, g_current_u_id).join("") );
                        break;
                    }
                }
                document.getElementById("selected_user_role_for_" + user_role.user_id).innerHTML = '';
                document.getElementById(convert_to_jquery_id("org.couchdb.user:" + user_role.user_id) + "_status_area").innerHTML = "";
            }
		}
		else
		{

		}
	}
}

async function save_user_role_jurisdiction(p_user_role, p_user, p_user_id)
{
	if(p_user_role && p_user_id)
	{ 
        const response = await get_http_post_response(`api/user_role_jurisdiction`, p_user_role);

        if(response)
        {
            var response_obj = eval(response);
            if(response_obj.ok)
            {
                
                for(var i in g_user_role_jurisdiction)
                {
                    if(g_user_role_jurisdiction[i]._id == response_obj.id)
                    {
                        g_user_role_jurisdiction[i]._rev = response_obj.rev; 
                        //document.getElementById('form_content_id').innerHTML = editor_render(g_user_list, "", g_ui).join("");

                        var render_result = render_role_list_for(p_user, p_user_id);
                        var role_list_for_ = document.getElementById("role_list_for_" + p_user.name);
                        role_list_for_.outerHTML = render_result.join("");

                        break;
                    }
                }
            }
                //{ok: true, id: "2016-06-12T13:49:24.759Z", rev: "3-c0a15d6da8afa0f82f5ff8c53e0cc998"}
            console.log("jurisdiction_tree sent", response);
        }
        else
        {
            alert("You are not authorized to make this change.");
        }
	}
}

async function bulk_save_user_role_jurisdiction(p_user_role_list, p_user_id) 
{

    if (p_user_role_list == null || p_user_role_list.length == 0 || p_user_id == null  || p_user_id == "") return;

    const response = await get_http_post_response
    (
        "api/user_role_jurisdiction/bulk",
        p_user_role_list
    );

    response.forEach
    (  
        (response_obj) => {
            if (response_obj.ok) 
            {
                const current_urj = g_user_role_jurisdiction.find(urj => urj._id == response_obj.id);
                if(current_urj) 
                {
                    current_urj._rev = response_obj.rev;
                }
                update_roles_ui(p_user_id);
            }
        }
    );
}

function update_roles_ui(p_user_id)
{
    const role_section = document.getElementById("role_results_" + p_user_id);
    role_section.innerHTML = role_section.innerHTML.replaceAll("Active", "Inactive");
    Array.from(role_section.children).forEach(child => {
        child.classList.add('inactive-role');
    });
}

function format_date(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


async function get_http_post_response
(
    p_url_suffix,
    p_data
)
{
    let response = {};

    const url = `${location.protocol}//${location.host}/${p_url_suffix}`
    try
    {
        const response_promise = await fetch(url, {
            method: "post",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'dataType': 'json',
            },
            body: JSON.stringify(p_data)
        });

        mmria_check_if_need_to_redirect(response_promise);
        
        response = await response_promise.json();
    }  
    catch(xhr) 
    {
        $mmria.unstable_network_dialog_show(xhr, xhr.status);
        if (xhr.status == 401) 
        {
            let redirect_url = location.protocol + '//' + location.host;
            window.location = redirect_url;
        }
        else if (xhr.status == 200 && xhr.responseText.length >= 49000) 
        {
            let redirect_url = location.protocol + '//' + location.host;
            window.location = redirect_url;
        }
    }

    return response;
}

async function get_http_get_response
(
    p_url_suffix
)
{
    let response = {};

    const url = `${location.protocol}//${location.host}/${p_url_suffix}`
    try
    {
        const response_promise = await fetch(url, {
            method: "get",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'dataType': 'json',
            }
        });

        mmria_check_if_need_to_redirect(response_promise);
        
        response = await response_promise.json();
    }  
    catch(xhr) 
    {
        $mmria.unstable_network_dialog_show(xhr, xhr.status);
        if (xhr.status == 401) 
        {
            let redirect_url = location.protocol + '//' + location.host;
            window.location = redirect_url;
        }
        else if (xhr.status == 200 && xhr.responseText.length >= 49000) 
        {
            let redirect_url = location.protocol + '//' + location.host;
            window.location = redirect_url;
        }
    }

    return response;
}

async function get_http_delete_response
(
    p_url_suffix
)
{
    let response = {};

    const url = `${location.protocol}//${location.host}/${p_url_suffix}`
    try
    {
        const response_promise = await fetch(url, {
            method: "delete",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'dataType': 'json',
            }
        });

        mmria_check_if_need_to_redirect(response_promise);
        
        response = await response_promise.json();
    }  
    catch(xhr) 
    {
        $mmria.unstable_network_dialog_show(xhr, xhr.status);
        if (xhr.status == 401) 
        {
            let redirect_url = location.protocol + '//' + location.host;
            window.location = redirect_url;
        }
        else if (xhr.status == 200 && xhr.responseText.length >= 49000) 
        {
            let redirect_url = location.protocol + '//' + location.host;
            window.location = redirect_url;
        }
    }

    return response;
}

async function get_all_user_role_jurisdiction()
{
    const response = await get_http_get_response("api/user_role_jurisdiction");
    g_user_role_jurisdiction = [];

    for(let i = 0; i < response.length; i++)
    {
        const item = response[i];
        g_user_role_jurisdiction.push(item);
    }

}

function sort_list(a, b)
{
    return ('' + a.role_name).localeCompare(b.role_name)
}

function role_id_to_proper_case(p_string)
{
    if (!p_string || p_string.length <= 0) return "";
    var role_name = p_string.toString().split('_');
    role_name = role_name.map(section => {
        if (section === 'steve' || section === 'mmria' || section === 'prams')
            return section.toUpperCase();
        else
            return section[0].toUpperCase() + section.slice(1)
    });
    return role_name.join(" ");
}

function get_role_list()
{
    let result = [];

    if(g_is_pmss_enhanced)
    {
        if
        (
            g_is_installation_admin && 
            g_is_installation_admin.toLowerCase() == "true"
        )
        {
            result = [
                '',
                'abstractor',
                'data_analyst',
                'committee_member',
                'cdc_admin',
                'cdc_analyst',
                'form_designer',
                'jurisdiction_admin',
                'installation_admin',
                'steve_mmria',
                'steve_prams',
                'vital_importer',
                "vro"
            ];
        }
        else if(g_jurisdiction_list.find(f => f.role_name == "cdc_admin"))
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin','steve_mmria', 'steve_prams', 'vital_importer', "vro"];
        }
        else
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin', "vro"];
        }
    }
    else
    {
        if
        (
            g_is_installation_admin && 
            g_is_installation_admin.toLowerCase() == "true"
        )
        {
            result = [
                '',
                'abstractor',
                'data_analyst',
                'committee_member',
                'cdc_admin','cdc_analyst',
                'form_designer',
                'jurisdiction_admin',
                'installation_admin',
                'steve_mmria',
                'steve_prams',
                'vital_importer',
                'vital_importer_state'
            ];
        }
        else if(g_jurisdiction_list.find(f => f.role_name == "cdc_admin"))
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin','steve_mmria', 'steve_prams', 'vital_importer'];
        }
        else
        {
            result = [ '', 'abstractor','data_analyst', 'committee_member', 'jurisdiction_admin'];
        }
    }
    
    result.sort();

    return result;
}