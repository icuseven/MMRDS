function $case_status_confirm()
{
    g_target_case_status = null;
    g_is_confirm_for_case_lock = false;

    g_data.tracking.case_status.case_locked_date = new Date().toISOString().split("T")[0];
}


function $case_document_begin_edit()
{
    //console.log("begin edit");
}

function $tracing_dod_update
(
    month,
    day,
    year

)
{
    if
    (
        month != null &&
        month != 9999 &&
        month != 99 &&
        day != null &&
        day != 9999 &&
        day != 99 &&
        year != null &&
        year != 9999 
    )
    {
        const new_date_string = `${year}-${month}-${day}`;
        const date_display = `${month}/${day}/${year}`;

        g_data.tracking.date_of_death.dod = new_date_string;

        $mmria.set_control_value('tracking/date_of_death/dod', date_display);
    }
    else
    {
        g_data.tracking.date_of_death.dod = '';
        $mmria.set_control_value('tracking/date_of_death/dod', '');
    }

}


/*
path=tracking/date_of_death/month
event=onchange
*/
function tracking_date_of_death_month_onchange(p_control) 
{
    const month = p_control.value;
    const day = g_data.tracking.date_of_death.day;
    const year = g_data.tracking.date_of_death.year;

    $global.tracing_dod_update
    (
        month,
        day,
        year
    );
}

/*
path=tracking/date_of_death/day
event=onchange
*/
function tracking_date_of_death_day_onchange(p_control) 
{
    const month = g_data.tracking.date_of_death.month;
    const day = p_control.value;
    const year = g_data.tracking.date_of_death.year;

    $global.tracing_dod_update
    (
        month,
        day,
        year
    );
}

/*
path=tracking/date_of_death/year
event=onchange
*/
function tracking_date_of_death_year_onchange(p_control) 
{
    const month = g_data.tracking.date_of_death.month;
    const day = g_data.tracking.date_of_death.day;
    const year = p_control.value;

    $global.tracing_dod_update
    (
        month,
        day,
        year
    );
}


