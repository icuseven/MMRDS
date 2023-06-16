

function $case_status_confirm()
{
    g_target_case_status = null;
    g_is_confirm_for_case_lock = false;

    g_data.home_record.case_status.case_locked_date = new Date().toISOString().split("T")[0];
  
}

