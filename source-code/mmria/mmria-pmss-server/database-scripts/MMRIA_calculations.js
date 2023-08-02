

function $case_status_confirm()
{
    g_target_case_status = null;
    g_is_confirm_for_case_lock = false;

    g_data.tracking.case_status.case_locked_date = new Date().toISOString().split("T")[0];
  
}


function $case_document_begin_edit(value)
{
    console.log(value);
}
