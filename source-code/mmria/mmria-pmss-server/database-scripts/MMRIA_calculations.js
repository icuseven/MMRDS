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

//CALCLATE BMI FROM HEIGHT (IN INCHES)AND WEIGHT (IN POUNDS)
function $calc_bmi(p_height, p_weight) 
{
    var bmi = null;
    var height = parseInt(p_height);
    var weight = parseInt(p_weight);
    height /= 39.3700787;
    weight /= 2.20462;
    bmi = Math.round(weight / Math.pow(height, 2) * 10) / 10;
    return bmi;
}

//CALCULATE NUMBER OF DAYS BETWEEN 2 DATES
function $calc_days
(
    start_date,
    end_date
)
{  
    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;  
    var utc1 = Date.UTC
    (
        start_date.getFullYear(),
        start_date.getMonth(),
        start_date.getDate()
    );

    var utc2 = Date.UTC
    (
        end_date.getFullYear(),
        end_date.getMonth(),
        end_date.getDate()
    ); 
     return Math.floor((utc2 - utc1) / MILLISECONDS_PER_DAY);
}

//CALCULATE NUMBER OF YEARS BETWEEN 2 DATES
function $calc_years
(
    p_start_date, 
    p_end_date
)
{
    var years = null;
    p_start_date = p_start_date.getTime() / 31557600000;
    p_end_date = p_end_date.getTime() / 31557600000;
    years = Math.trunc(p_end_date - p_start_date);
    return years;
}


//CALCULATE AGE IN YEARS (DOD - DOB)
function $update_age_difference
(
    start_month,
    start_day,
    start_year,
    end_month,
    end_day,
    end_year 
)
{
    let start_date = null
    let end_date = null

    if
    (
        start_month != null &&
        start_month != 9999 &&
        start_month != 99 &&
        start_day != null &&
        start_day != 9999 &&
        start_day != 99 &&
        start_year != null &&
        start_year != 9999 
    )
    {
        const new_date_string = `${start_year}-${start_month}-${start_day}`;
        const date_display = `${start_month}/${start_day}/${start_year}`;

        start_date = new Date(new_date_string);
    }
    else
    {
        // ;
    }

    if
    (
        end_month != null &&
        end_month != 9999 &&
        end_month != 99 &&
        end_day != null &&
        end_day != 9999 &&
        end_day != 99 &&
        end_year != null &&
        end_year != 9999 
    )
    {
        const new_date_string = `${end_year}-${end_month}-${end_day}`;
        const date_display = `${end_month}/${end_day}/${end_year}`;

        end_date = new Date(new_date_string);
    }
    else
    {
        // ;
    }

    if 
    (
        start_date != null && 
        end_date != null
    )
    {
        let age_difference = $global.calc_years
        (
            start_date,
            end_date
        );

        g_data.demographic.date_of_birth.agedif = age_difference;
        $mmria.set_control_value('demographic/date_of_birth/agedif', age_difference);
    }
    else
    {
        g_data.demographic.date_of_birth.agedif = '';
        $mmria.set_control_value('demographic/date_of_birth/agedif', '');
    }
}

//CALCULATE TERM IN DAYS (DOD - DTERM)
function $update_term_days
(
    start_month,
    start_day,
    start_year,
    end_month,
    end_day,
    end_year 
)
{
    let start_date = null
    let end_date = null

    if
    (
        start_month != null &&
        start_month != 9999 &&
        start_month != 99 &&
        start_day != null &&
        start_day != 9999 &&
        start_day != 99 &&
        start_year != null &&
        start_year != 9999 
    )
    {
        const new_date_string = `${start_year}-${start_month}-${start_day}`;
        const date_display = `${start_month}/${start_day}/${start_year}`;

        start_date = new Date(new_date_string);
    }
    else
    {
        // ;
    }

    if
    (
        end_month != null &&
        end_month != 9999 &&
        end_month != 99 &&
        end_day != null &&
        end_day != 9999 &&
        end_day != 99 &&
        end_year != null &&
        end_year != 9999 
    )
    {
        const new_date_string = `${end_year}-${end_month}-${end_day}`;
        const date_display = `${end_month}/${end_day}/${end_year}`;

        end_date = new Date(new_date_string);
    }
    else
    {
        // ;
    }

    if 
    (
        start_date != null && 
        end_date != null
    )
    {
        let term_days = $global.calc_days
        (
            start_date,
            end_date
        );
        
        g_data.outcome.dterm_grp.daydif = term_days;
        $mmria.set_control_value('outcome/dterm_grp/daydif', term_days);
    }
    else
    {
        g_data.outcome.dterm_grp.daydif = '';
        $mmria.set_control_value('outcome/dterm_grp/daydif', '');
    }
}

// UPDATE CONTROL: DOD
function $tracking_dod_update
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
    $global.tracking_dod_update
    (
        month,
        day,
        year
    );

    const start_month = g_data.demographic.date_of_birth.month;
    const start_day = g_data.demographic.date_of_birth.day;
    const start_year = g_data.demographic.date_of_birth.year;
    $global.update_age_difference
    (
        start_month,
        start_day,
        start_year,
        month,
        day,
        year 
    );

    const start2_month = g_data.outcome.dterm_grp.dterm_mo;
    const start2_day = g_data.outcome.dterm_grp.dterm_dy;
    const start2_year = g_data.outcome.dterm_grp.dterm_yr;
    $global.update_term_days
    (
        start2_month,
        start2_day,
        start2_year,
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
    $global.tracking_dod_update
    (
        month,
        day,
        year
    );

    const start_month = g_data.demographic.date_of_birth.month;
    const start_day = g_data.demographic.date_of_birth.day;
    const start_year = g_data.demographic.date_of_birth.year;
    $global.update_age_difference
    (
        start_month,
        start_day,
        start_year,
        month,
        day,
        year 
    );

    const start2_month = g_data.outcome.dterm_grp.dterm_mo;
    const start2_day = g_data.outcome.dterm_grp.dterm_dy;
    const start2_year = g_data.outcome.dterm_grp.dterm_yr;
    $global.update_term_days
    (
        start2_month,
        start2_day,
        start2_year,
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
    $global.tracking_dod_update
    (
        month,
        day,
        year
    );

    const start_month = g_data.demographic.date_of_birth.month;
    const start_day = g_data.demographic.date_of_birth.day;
    const start_year = g_data.demographic.date_of_birth.year;
    $global.update_age_difference
    (
        start_month,
        start_day,
        start_year,
        month,
        day,
        year 
    );

    const start2_month = g_data.outcome.dterm_grp.dterm_mo;
    const start2_day = g_data.outcome.dterm_grp.dterm_dy;
    const start2_year = g_data.outcome.dterm_grp.dterm_yr;
    $global.update_term_days
    (
        start2_month,
        start2_day,
        start2_year,
        month,
        day,
        year 
    );      
}


// UPDATE CONTROL: DOB
function $demographic_dob_update
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

        g_data.demographic.date_of_birth.dob = new_date_string;
        $mmria.set_control_value('demographic/date_of_birth/dob', date_display);
    }
    else
    {
        g_data.demographic.date_of_birth.dob = '';
        $mmria.set_control_value('demographic/date_of_birth/dob', '');
    }
}


/*
path=demographic/date_of_birth/month
event=onchange
*/
function demographic_date_of_birth_month_onchange(p_control) 
{
    const month = p_control.value;
    const day = g_data.demographic.date_of_birth.day;
    const year = g_data.demographic.date_of_birth.year;
    $global.demographic_dob_update
    (
        month,
        day,
        year
    );

    const end_month = g_data.tracking.date_of_death.month;
    const end_day = g_data.tracking.date_of_death.day;
    const end_year = g_data.tracking.date_of_death.year;
    $global.update_age_difference
    (
        month,
        day,
        year,
        end_month,
        end_day,
        end_year
    );
}


/*
path=demographic/date_of_birth/day
event=onchange
*/
function demographic_date_of_birth_day_onchange(p_control) 
{
    const month = g_data.demographic.date_of_birth.month;
    const day = p_control.value;
    const year = g_data.demographic.date_of_birth.year;
    $global.demographic_dob_update
    (
        month,
        day,
        year
    );

    const end_month = g_data.tracking.date_of_death.month;
    const end_day = g_data.tracking.date_of_death.day;
    const end_year = g_data.tracking.date_of_death.year;
    $global.update_age_difference
    (
        month,
        day,
        year,
        end_month,
        end_day,
        end_year
    );
}


/*
path=demographic/date_of_birth/year
event=onchange
*/
function demographic_date_of_birth_year_onchange(p_control) 
{
    const month = g_data.demographic.date_of_birth.month;
    const day = g_data.demographic.date_of_birth.day;
    const year = p_control.value;
    $global.demographic_dob_update
    (
        month,
        day,
        year
    );

    const end_month = g_data.tracking.date_of_death.month;
    const end_day = g_data.tracking.date_of_death.day;
    const end_year = g_data.tracking.date_of_death.year;
    $global.update_age_difference
    (
        month,
        day,
        year,
        end_month,
        end_day,
        end_year
    );
}


// UPDATE CONTROL: DTERM
function $outcome_dterm_update
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

        g_data.outcome.dterm_grp.dterm = new_date_string;
        $mmria.set_control_value('outcome/dterm_grp/dterm', date_display);
    }
    else
    {
        g_data.outcome.dterm_grp.dterm = '';
        $mmria.set_control_value('outcome/dterm_grp/dterm', '');
    }

}


/*
path=outcome/dterm_grp/dterm_mo
event=onchange
*/
function outcome_dterm_grp_dterm_mo_onchange(p_control) 
{
    const month = p_control.value;
    const day = g_data.outcome.dterm_grp.dterm_dy;
    const year = g_data.outcome.dterm_grp.dterm_yr;
    $global.outcome_dterm_update
    (
        month,
        day,
        year
    );

    const end_month = g_data.tracking.date_of_death.month;
    const end_day = g_data.tracking.date_of_death.day;
    const end_year = g_data.tracking.date_of_death.year;
    $global.update_term_days
    (
        month,
        day,
        year,
        end_month,
        end_day,
        end_year
    );
}


/*
path=outcome/dterm_grp/dterm_dy
event=onchange
*/
function outcome_dterm_grp_dterm_dy_onchange(p_control) 
{
    const month = g_data.outcome.dterm_grp.dterm_mo;
    const day = p_control.value;
    const year = g_data.outcome.dterm_grp.dterm_yr;
    $global.outcome_dterm_update
    (
        month,
        day,
        year
    );

    const end_month = g_data.tracking.date_of_death.month;
    const end_day = g_data.tracking.date_of_death.day;
    const end_year = g_data.tracking.date_of_death.year;
    $global.update_term_days
    (
        month,
        day,
        year,
        end_month,
        end_day,
        end_year
    );
}


/*
path=outcome/dterm_grp/dterm_yr
event=onchange
*/
function outcome_dterm_grp_dterm_yr_onchange(p_control) 
{
    const month = g_data.outcome.dterm_grp.dterm_mo;
    const day = g_data.outcome.dterm_grp.dterm_dy;
    const year = p_control.value;
    $global.outcome_dterm_update
    (
        month,
        day,
        year
    );

    const end_month = g_data.tracking.date_of_death.month;
    const end_day = g_data.tracking.date_of_death.day;
    const end_year = g_data.tracking.date_of_death.year;
    $global.update_term_days
    (
        month,
        day,
        year,
        end_month,
        end_day,
        end_year
    );
}


//CALCULATE BMI
function $update_bmi
(
    height,
    weight 
)
{
    let my_height = null
    let my_weight = null

    if
    (
        height != null &&
        height != 9999 
    )
    {
        my_height = height;
    }
    else
    {
        // ;
    }

    if
    (
        weight != null &&
        weight != 9999 
    )
    {
        my_weight = weight;
    }
    else
    {
        // ;
    }

    if 
    (
        my_height != null && 
        my_weight != null
    )
    {
        let my_bmi = $global.calc_bmi
        (
            my_height,
            my_weight
        );
        
        g_data.demographic.bmi = my_bmi;
        $mmria.set_control_value('demographic/bmi', my_bmi);
    }
    else
    {
        g_data.demographic.bmi = '';
        $mmria.set_control_value('demographic/bmi', '');
    }
}

/*
path=demographic/height
event=onchange
*/
function  demographic_height_onchange(p_control) 
{
    const height = p_control.value;
    const weight = g_data.demographic.wtpreprg;
    $global.update_bmi
    (
        height,
        weight
    );
}


/*
path=demographic/wtpreprg
event=onchange
*/
function  demographic_wtpreprg_onchange(p_control) 
{
    const height = g_data.demographic.height;
    const weight = p_control.value;
    $global.update_bmi
    (
        height,
        weight
    );
}


/*
path=tracking/q1/amssno
event=onchange
*/
function  tracking_q1_amsssno_onchange(p_control) 
{
    // tracking/q1/amssrel
    let controlId = 'g_data_tracking_q1_amssrel_control';

    const my_value = p_control.value;
    if 
    (
        my_value != null && 
        my_value != "00000"
    )
    {
        // Show field: tracking/q1/amssrel
        // $('label[for=' + controlId + '], #' + controlId).show();
    }
    else
    {
        g_data.tracking.q1.rel = 9999;
        $mmria.set_control_value('tracking/q1/amssrel', 9999);

        // Hide field: tracking/death_certificate_number
        // $('label[for=' + controlId + '], #' + controlId).hide();    
    }

    /*
    let controlId = 'g_data_home_record_overall_assessment_of_timing_of_death_number_of_days_after_end_of_pregnancey_control';
    let value = parseInt($('#g_data_home_record_overall_assessment_of_timing_of_death_abstrator_assigned_status_control').find(':selected').val());
    if (value === 9999
        || value === 0
        || value === 1
        || value === 4
        || value === 88
    ) {
        $('label[for=' + controlId + '], #' + controlId).hide();    
    }
    else {
        $('label[for=' + controlId + '], #' + controlId).show();
    }
    */
}


/* 
path=vro_case_determination/vro_update/vro_resolution_status
event=onchange
*/
function  vro_case_determination_vro_update_vro_resolution_status_onchange(p_control) 
{
    const my_value = p_control.value;
    if 
    (
        my_value != null && 
        my_value != "9999" && 
        my_value != "STEVE: Pending VRO Investigation"
    )
    {
        g_data.tracking.admin_info.status = "STEVE: Updated by VRO";
        // $mmria.set_control_value('tracking/admin_info/status', "STEVE-Transfer: Updated by VRO");
    }
    else
    {

    }
}


/* 
path=tracking/admin_info/status
event=onchange
*/
function  tracking_admin_info_status_onchange(p_control) 
{
    const my_value = p_control.value;
    if 
    (
        my_value == "STEVE: Pending VRO Investigation, Re-review Requested by CDC"
    )
    {
        g_data.vro_case_determination.vro_update.vro_resolution_status = "Pending VRO Investigation";
        // $mmria.set_control_value('tracking/admin_info/vro_resolution_status_mirror', "Pending VRO Investigation");
    }
    else
    {

    }
}
