var indicator_map = new Map();
indicator_map.set
(
    1,
    {
        indicator_id : "mUndCofDeath",
        title:"Primary Underlying cause of death",
        description: "Underlying cause of death categories are created using the primary underlying cause of death PMSS-MM codes selected by the committee. Since these PMSS-MM underlying cause of death codes are only selected for deaths determined to be pregnancy-related, please use the filter function to restrict the data to pregnancy-related deaths.",
        
        chart_title:"Underlying Causes of Death",
        table_title:"Underlying Causes of Death",
        x_axis_title:"Number of Deaths",
        y_axis_title:"Underlying cause of Death",
        enabled: true,
        description: "Underlying cause of death categories are created using the primary underlying cause of death PMSS-MM codes selected by the committee. Since these PMSS-MM underlying cause of death codes are only selected for deaths determined to be pregnancy-related, please use the filter function to restrict the data to pregnancy-related deaths.",
        //blank_field_id: "MUndCofDeath21",
        blank_field_id: "",
        field_id_list : [
        { name: "MUndCofDeath1", title: "Hemorrhage (Excludes Aneurysms or CVA)" },
        { name: "MUndCofDeath2", title: "Infection" },
        { name: "MUndCofDeath3", title: "Embolism - Thrombotic (Non-Cerebral)" },
        { name: "MUndCofDeath4", title: "Amniotic Fluid Embolism" },
        { name: "MUndCofDeath5", title: "Hypertensive Disorders of Pregnancy" },
        { name: "MUndCofDeath6", title: "Anesthesia Complications" },
        { name: "MUndCofDeath7", title: "Cardiomyopathy" },
        { name: "MUndCofDeath8", title: "Hematologic" },
        { name: "MUndCofDeath9", title: "Collagen Vascular/Autoimmune Diseases" },
        { name: "MUndCofDeath10", title: "Conditions Unique to Pregnancy" },
        { name: "MUndCofDeath11", title: "Injury" },
        { name: "MUndCofDeath12", title: "Cancer" },
        { name: "MUndCofDeath13", title: "Cardiovascular Conditions" },
        { name: "MUndCofDeath14", title: "Pulmonary Conditions (Excludes ARDS)" },
        { name: "MUndCofDeath15", title: "Neurologic/Neurovascular Conditions (Excluding CVA)" },
        { name: "MUndCofDeath16", title: "Renal Diseases" },
        { name: "MUndCofDeath17", title: "Cerebrovascular Accident not Secondary to Hypertensive Disorders of Pregnancy" },
        { name: "MUndCofDeath18", title: "Metabolic/Endocrine" },
        { name: "MUndCofDeath19", title: "Gastrointestinal Disorders" },
        { name: "MUndCofDeath20", title: "Mental Health Conditions" },
        { name: "MUndCofDeath21", title: "Unknown Cause of Death" },
        ],
        enabled: true,       
    }
);
indicator_map.set
(
    2,
    {
        indicator_id : "mPregRelated",
        title:"Pregnancy Relatedness",
        chart_title:"Number of deaths by pregnancy relatedness",
        table_title:"Number of deaths by pregnancy relatedness",
        x_axis_title:"Pregnancy Relatedness",
        y_axis_title:"Number of Deaths",
        enabled: true,
        description:"Determined by Pregnancy-Relatedness entered on Committee Decisions form.",
        blank_field_id: "MPregRel5",
        field_id_list : [
        { name: "MPregRel1", title: "Pregnancy related" },
        { name: "MPregRel2", title: "Pregnancy associated but not related" },
        { name: "MPregRel3", title: "Pregnancy associated but unable to determine pregnancy relatedness" },
        { name: "MPregRel4", title: "Not pregnancy associated or related (false positive)" },
        { name: "MPregRel5", title: "(blank)" },
            ],
    }
);
indicator_map.set
(
    3,
    {
        indicator_id : "mDeathPrevent",
        title:"Preventability",
        chart_title:"Preventability",
        table_title:"Preventability",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description: "Deaths are considered preventable if the committee selected ‘yes’ for the question ‘Was this death preventable?’ on the Committee Decisions form or selected ‘some chance’ or ‘good chance’ for the ‘Chance to alter outcome’ field on the Committee Decisions form.",
        blank_field_id: "MDeathPrevent3",
        field_id_list : [
        { name: "MDeathPrevent1", title: "Preventable" },
        { name: "MDeathPrevent2", title: "Not Preventable" },
        { name: "MDeathPrevent3", title: "Unable to Determine" },
        ],
    }
);
indicator_map.set
(
    4,
    {
        indicator_id : "mMHTxTiming",
        title:"Timing of Death",
        chart_title:"Number of deaths by timing of death in relation to pregnancy",
        table_title:"Number of deaths by timing of death in relation to pregnancy",
        x_axis_title:"Timing of death in relation to pregnancy",
        y_axis_title:"Number of deaths",
        enabled: true,
        description:"The timing of death is determined by calculating the length of time between the date of death on the Home Record and the date of delivery on the Birth/Fetal Death Certificate form. If any elements of either date are missing (month, day, or year), the abstractor-assigned timing of death fields on the Home Record are used to assign the timing. If timing of death is still missing, the pregnancy checkbox on the Death Certificate form is used to assign timing of death in relation to pregnancy",
        blank_field_id: "MMHTx4",

        field_id_list : [
        { name: "MMHTx1", title: "During pregnancy" },
        { name: "MMHTx2", title: "Within 42 days of pregnancy" },
        { name: "MMHTx3", title: "Within 43 days to 1 year of pregnancy" },
        { name: "MMHTx4", title: "(Blank)" },
        ],
    }
);
indicator_map.set
(
    5,
    {
        indicator_id : "mOMBRaceRcd",
        title:"OMB Race Recode",
        chart_title:"OMB Race Recode",
        table_title:"OMB Race Recode",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race is ascertained from the Death Certificate.",
        blank_field_id: "MOMBRaceRcd10",
        field_id_list : [
        { name: "MOMBRaceRcd1", title: "White" },
        { name: "MOMBRaceRcd2", title: "Black" },
        { name: "MOMBRaceRcd3", title: "American Indian/Alaska Native" },
        { name: "MOMBRaceRcd4", title: "Pacific Islander" },
        { name: "MOMBRaceRcd5", title: "Asian" },
        { name: "MOMBRaceRcd6", title: "Bi-Racial" },
        { name: "MOMBRaceRcd7", title: "Multi-Racial" },
        { name: "MOMBRaceRcd8", title: "Other Race" },
        { name: "MOMBRaceRcd9", title: "Race Not Specified" },
        { name: "MOMBRaceRcd10", title: "(blank)" },
        ],
    }
);





indicator_map.set
(
    6,
    {
        indicator_id : "mDeathbyRace",
        title:"Race",
        chart_title:"Race",
        table_title:"Race",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race is ascertained from the Death Certificate. Decedents may have more than one race specified. Race categories do not sum to total number of deaths.",
        blank_field_id: "MDeathbyRace17",
        field_id_list : [
        { name: "MDeathbyRace1", title:"White" },
        { name: "MDeathbyRace2", title:"Black or African American" },
        { name: "MDeathbyRace3", title:"American Indian or Alaska Native" },
        { name: "MDeathbyRace4", title:"Native Hawaiian" },
        { name: "MDeathbyRace5", title:"Guamanian or Chamorro" },
        { name: "MDeathbyRace6", title:"Samoan" },
        { name: "MDeathbyRace7", title:"Other Pacific Islander" },
        { name: "MDeathbyRace8", title:"Asian Indian" },
        { name: "MDeathbyRace9", title:"Chinese" },
        { name: "MDeathbyRace10", title:"Filipino" },
        { name: "MDeathbyRace11", title:"Japanese" },
        { name: "MDeathbyRace12", title:"Korean" },
        { name: "MDeathbyRace13", title:"Vietnamese" },
        { name: "MDeathbyRace14", title:"Other Asian" },
        { name: "MDeathbyRace15", title:"Other Race" },
        { name: "MDeathbyRace16", title:"Race Not Specified" },
        { name: "MDeathbyRace17", title:"(blank)" },
                ]     

    }
);



indicator_map.set
(
    7,
    {
        indicator_id : "mDeathsbyRaceEth",
        title:"Race/Ethnicity",
        chart_title:"Race/Ethnicity",
        table_title:"Race/Ethnicity",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"To be included in one of these categories, both the race and Hispanic origin variables must be completed on the Birth/Fetal Death Certificate or Death Certificate. Priority is given to data entered on the Birth/Fetal Death Certificate because it is more likely to be self-reported, and if that is missing or incomplete, race/ethnicity is ascertained from the Death Certificate.",
        blank_field_id: "MRaceEth20",
        field_id_list : [

            { name: "MRaceEth3", title: "Hispanic" },
            { name: "MRaceEth4", title: "Non-Hispanic Black" },
            { name: "MRaceEth5", title: "Non-Hispanic White" },
            { name: "MRaceEth6", title: "American Indian / Alaska Native" },
            { name: "MRaceEth7", title: "Native Hawaiian" },
            { name: "MRaceEth8", title: "Guamanian or Chamorro" },
            { name: "MRaceEth9", title: "Samoan" },
            { name: "MRaceEth10", title: "Other Pacific Islander" },
            { name: "MRaceEth11", title: "Asian Indian" },
            { name: "MRaceEth12", title: "Filipino" },
            { name: "MRaceEth13", title: "Korean" },
            { name: "MRaceEth14", title: "Other Asian" },
            { name: "MRaceEth15", title: "Chinese" },
            { name: "MRaceEth16", title: "Japanese" },
            { name: "MRaceEth17", title: "Vietnamese" },
            { name: "MRaceEth18", title: "Other Race" },
            { name: "MRaceEth19", title: "Race Not Specified" },
            { name: "MRaceEth20", title: "(Blank)" },
        ],
    }
);



indicator_map.set
(
    8,
    {
        indicator_id : "mAgeatDeath",
        title:"Age",
        chart_title:"Age",
        table_title:"Age",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"Age is calculated using the date of death on the Home Record and the date of birth on the Death Certificate form. If this data is not available, age is calculated using the date of death on the Home Record and the date of mother’s birth from the Birth/Fetal Death Certificate- Parent Section form.",
        blank_field_id: "MAgeD8",
        field_id_list : [
        { name: "MAgeD1", title: "< 20" },
        { name: "MAgeD2", title: "20 to 24" },
        { name: "MAgeD3", title: "25 to 29" },
        { name: "MAgeD4", title: "30 to 34" },
        { name: "MAgeD5", title: "35 to 39" },
        { name: "MAgeD6", title: "40 to 44" },
        { name: "MAgeD7", title: "45+" },
        { name: "MAgeD8", title: "(blank)" },
        
        ],
    }
);


indicator_map.set
(
    9,
    {
        indicator_id : "mEducation",
        title:"Education",
        chart_title:"Education",
        table_title:"Education",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"Add To be included in one of these categories, education must be completed on the Birth/Fetal Death Certificate or Death Certificate. Priority is given to data entered on the Birth/Fetal Death Certificate because it is self-reported, and if that is missing or incomplete, education level is pulled from the Death Certificate.",
        blank_field_id: "MEduc5",
        field_id_list : [
        { name: "MEduc1", title: "High school diploma equivalent or less" },
        { name: "MEduc2", title: "Completed some college" },
        { name: "MEduc3", title: "Associate or bachelor degree" },
        { name: "MEduc4", title: "Completed advanced degree" },
        { name: "MEduc5", title: "(blank)" },
        ],
    }
);
indicator_map.set
(
    10,
    {
    indicator_id : "mDeathCause",
    title:"Cause of Death",
    chart_title:"Cause of Death",
    table_title:"Cause of Death",
    x_axis_title:"title not specified",
    y_axis_title:"title not specified",
    enabled: true,
    description:"This table is based on committee determination of factors surrounding the death from the first page of Committee Decisions form, including whether obesity, discrimination, mental health conditions and/or substance use disorder contributed to the death, and whether the death was a suicide or homicide.",
    blank_field_id: "MCauseD15",
    field_id_list : [
        { name: "MCauseD1", title: "Mental Health Conditions - Yes" },
        { name: "MCauseD2", title: "Mental Health Conditions - No" },
        { name: "MCauseD3", title: "Mental Health Conditions - Probably" },
        { name: "MCauseD4", title: "Mental Health Conditions - Unknown" },
        { name: "MCauseD5", title: "Mental Health Conditions - Blank" },
        { name: "MCauseD6", title: "Substance Use Disorder - Yes" },
        { name: "MCauseD7", title: "Substance Use Disorder - No" },
        { name: "MCauseD8", title: "Mental Health Conditions - Probably" },
        { name: "MCauseD9", title: "Mental Health Conditions - Unknown" },
        { name: "MCauseD10", title: "Substance Use Disorder" },
        { name: "MCauseD11", title: "Suicide - Yes" },
        { name: "MCauseD12", title: "Suicide - No" },
        { name: "MCauseD13", title: "Suicide - Probably" },
        { name: "MCauseD14", title: "Suicide - Unknown" },
        { name: "MCauseD15", title: "Suicide - Blank" },
    ],
    title:"Committee Determinations"
    }
);
indicator_map.set
(
    11,
    {
        indicator_id : "mHxofEmoStress",
        title: "Emotional Stress",
        chart_title:"Emotional Stress",
        table_title:"Emotional Stress",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"History of social and emotional stress is determined using the corresponding variable on the Social and Environmental Profile. Each person can have multiple stressors entered, and the graph reflects the number of persons with each stressor selected.",
        title:"Emotional Stress",
        blank_field_id: "MEmoStress12",
        field_id_list : [
        { name: "MEmoStress1", title: "History of domestic violence" },
        { name: "MEmoStress2", title: "History of psychiatric hospitalizations or treatment" },
        { name: "MEmoStress3", title: "Child Protective Services involvement" },
        { name: "MEmoStress4", title: "History of substance use" },
        { name: "MEmoStress5", title: "Unemployment" },
        { name: "MEmoStress6", title: "History of substance use treatment" },
        { name: "MEmoStress7", title: "Pregnancy unwanted" },
        { name: "MEmoStress8", title: "Recent trauma" },
        { name: "MEmoStress9", title: "History of childhood trauma" },
        { name: "MEmoStress10", title: "Prior suicide attempts" },
        { name: "MEmoStress11", title: "Other" },
        { name: "MEmoStress12", title: "Other" },
        { name: "MEmoStress13", title: "Unknown" },
        { name: "MEmoStress14", title: "None" },
        ],
    }
);
indicator_map.set(
    12,
    {
        indicator_id : "mLivingArrange",
        title:"Living Arrangements",
        chart_title:"Mother&apos;s living arranements at time of death.",
        table_title:"Mother&apos;s living arranements at time of death.",
        x_axis_title:"Mother&apos;s living arranements at time of death.",
        y_axis_title:"Number of deaths",
        enabled: true,
        description:"Living arrangements at time of death and history of homelessness are determined using the corresponding variables on the Social and Environmental Profile. For both variables, each person can be placed into only one category.",
        blank_field_id: "MLivD7",
        field_id_list : [
        { name: "MLivD1", title: "Own" },
        { name: "MLivD2", title: "Rent" },
        { name: "MLivD3", title: "Public housing" },
        { name: "MLivD4", title: "Live with relative" },
        { name: "MLivD5", title: "Homeless" },
        { name: "MLivD6", title: "Other or Unknown" },
        { name: "MLivD7", title: "(blank)" },
        ],
    }
);
indicator_map.set
(
    13,
    {
        indicator_id : "mHomeless",
        title:"Mother&apos;s experiences of homelessless in relation to pregnancy",
        chart_title:"Number of deaths by mother&apos;s experiences of homelessless in relation to pregnancy",
        table_title:"Mother&apos;s experiences of homelessless in relation to pregnancy",
        x_axis_title:"Mother&apos;s experiences of homelessless in relation to pregnancy",
        y_axis_title:"Number of Deaths",
        enabled: true,
        description:"description not specified",
        blank_field_id: "MHomeless5",
        field_id_list : [
        { name: "MHomeless6", title: "More than 1 year prior to pregnancy" },
        { name: "MHomeless7", title: "Within 1 year prior to pregnancy" },
        { name: "MHomeless8", title: "During pregnancy" },
        { name: "MHomeless9", title: "After pregnancy" },
        { name: "MHomeless2", title: "In last 12 months (obsolete)" },
        { name: "MHomeless3", title: "More than 12 months ago (obsolete)" },
        { name: "MHomeless1", title: "Never experienced homelessness" },
        { name: "MHomeless4", title: "Unknown" },
        { name: "MHomeless5", title: "(blank)" },

        ],
    }
);
indicator_map.set
(
    14,
    {
        indicator_id : "mIncarHx",
        title:"Incarceration",
        chart_title:"Incarceration",
        table_title:"Incarceration",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"description not specified",
        blank_field_id: "MHxIncar7",
        field_id_list : [
        { name: "MHxIncar1", title: "Never incarcerated" },
                // { name: "MHxIncar2", title: "" },
        { name: "MHxIncar3", title: "Before current pregnancy" },
        { name: "MHxIncar4", title: "During current pregnancy" },
        { name: "MHxIncar5", title: "After current pregnancy" },
                // { name: "MHxIncar6", title: "" },
        { name: "MHxIncar7", title: "(blank)" },
        { name: "MHxIncar8", title: "More than 1 year prior to pregnancy" },
        { name: "MHxIncar9", title: "Within 1 year prior to pregnancy" },
        { name: "MHxIncar10", title: "Unknown" },
        ],
    }
);
indicator_map.set
(
    16,
    {
        indicator_id : "mDeathSubAbuseEvi",
        title:"Substance Abuse Evidence",
        chart_title:"Substance Abuse Evidence",
        table_title:"Substance Abuse Evidence",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"description not specified",
        blank_field_id: "MEviSub3",
        field_id_list : [
        { name: "MEviSub1", title: "Yes" },
        { name: "MEviSub2", title: "No" },
        { name: "MEviSub3", title: "(Blank)" },
        { name: "MEviSub4", title: "Unknown" },
        ],
    }
);
indicator_map.set
(
    17,
    {
        indicator_id : "mHxofSubAbu",
        title:"title not specified",
        chart_title:"title not specified",
        table_title:"title not specified",
        x_axis_title:"title not specified",
        y_axis_title:"title not specified",
        enabled: true,
        description:"description not specified",
        blank_field_id: "MHxSub3",
        field_id_list : [
        { name: "MHxSub1", title: "Yes" },
        { name: "MHxSub2", title: "No" },
        { name: "MHxSub3", title: "(Blank)" },
        { name: "MHxSub4", title: "Unknown" },
        ],
    }
);
indicator_map.set("mSubstAutop",{
    title:""
});
indicator_map.set("mTimingofDeath",{
    title:"Timing of Death"
});
indicator_map.set("mUndCofDeath",{
    title:"Primary Underlying Cause of Death"
});
indicator_map.set("mDeathbyRace",{
    title:"Race"
});


async function get_indicator_values(p_indicator_id)
{
    const get_data_response = await $.ajax
    ({
        
        //url: `${location.protocol}//${location.host}/api/powerbi-measures/${p_indicator_id}`,
        url: `${location.protocol}//${location.host}/api/measure-indicator/${p_indicator_id}`,
    });

    g_data = { total: 0, data: []};

    for(let i = 0; i < get_data_response.length; i++)
    {
        const item = get_data_response[i];
        if(Can_Pass_Filter(item))
        {
            g_data.data.push(item);
            g_data.total +=1;
        }
        else
        {
            console.log("here");
        }
    }
    
    //if(g_filter.pregnancy_relatedness.indexOf(99) < 0)

    return g_data;
}

function Can_Pass_Filter(p_value)
{

    let pregnancy_relatedness = true;
    let date_of_review_begin = true;
    let date_of_review_end = true;
    let date_of_death_begin = true;
    let date_of_death_end = true;
    /*
    {
        "case_id": "0190e93e-a359-441e-b27d-43f83d946de4",
        "host_state": "test",
        "means_of_fatal_injury": 3,
        "year_of_death": 2009,
        "month_of_death": 9,
        "day_of_death": 22,
        "case_review_year": 2011,
        "case_review_month": 9,
        "case_review_day": 30,
        "pregnancy_related": 2,
        "indicator_id": "mPregRelated",
        "field_id": "MPregRel3",
        "value": 1,
        "jurisdiction_id": "/"
    }*/


    date_of_review_begin = is_greater_than_date
    (
        p_value.case_review_year,
        p_value.case_review_month,
        p_value.case_review_day,
        g_filter.date_of_review.begin
    )

    date_of_review_end = is_less_than_date
    (
        p_value.case_review_year,
        p_value.case_review_month,
        p_value.case_review_day,
        g_filter.date_of_review.end
    )

    date_of_death_begin = is_greater_than_date
    (
        p_value.year_of_death,
        p_value.month_of_death,
        p_value.day_of_death,
        g_filter.date_of_death.begin
    )

    date_of_death_end = is_less_than_date
    (
        p_value.year_of_death,
        p_value.month_of_death,
        p_value.day_of_death,
        g_filter.date_of_death.end
    )
/*
    g_filter.pregnancy_relatedness
    g_filter.date_of_review.begin
    g_filter.date_of_review.end
    g_filter.date_of_death.begin
    g_filter.date_of_death.end
    */
    if(g_filter.pregnancy_relatedness.length == 4)
    {
        pregnancy_relatedness = true;
    }
    else
    {
        pregnancy_relatedness = g_filter.pregnancy_relatedness.indexOf(p_value.pregnancy_related) > -1;
    }

    return pregnancy_relatedness && 
        date_of_review_begin && 
        date_of_review_end && 
        date_of_death_begin && 
        date_of_death_end;

}

function is_greater_than_date
(
    p_year,
    p_month,
    p_day,
    p_date
)
{
    let is_year = true;
    let is_month = true;
    let is_day = true;

    let year = 9999;
    let month = 9999;
    let day = 9999;

    if
    (
        p_year != null 
    )
    {
        year = p_year;
    }

    if
    (
        p_month != null
    )
    {
        month = p_month;
    }

    if
    (
        p_day != null
    )
    {
        day = p_day;
    }

    const filter_year = p_date.getFullYear();
    const filter_month = p_date.getMonth() + 1;
    const filter_day = p_date.getDate();

    if(year == 9999) return true;

    if(year != 9999)
    {
        if(year > filter_year)
        {
            return true;
        }
        is_year = year == filter_year;
    }

    if(is_year && month != 9999)
    {
        if(month > filter_month)
        {
            return true;
        }
        
        is_month = month == filter_month;
    }

    if(is_year && is_month && day != 9999)
    {
        is_day = day >= filter_day;
    }

    return is_year && is_month && is_day;
}

function is_less_than_date
(
    p_year,
    p_month,
    p_day,
    p_date
)
{
    let is_year = true;
    let is_month = true;
    let is_day = true;

    let year = 9999;
    let month = 9999;
    let day = 9999;

    if
    (
        p_year != null 
    )
    {
        year = p_year;
    }

    if
    (
        p_month != null
    )
    {
        month = p_month;
    }

    if
    (
        p_day != null
    )
    {
        day = p_day;
    }

    const filter_year = p_date.getFullYear();
    const filter_month = p_date.getMonth() + 1;
    const filter_day = p_date.getDate();


    if(year == 9999) return true;

    if(year != 9999)
    {
        if(year < filter_year)
        {
            return true;
        }

        is_year = year == filter_year;
    }

    if(is_year && month != 9999)
    {
        if(month < filter_month)
        {
            return true;
        }

        is_month = month < filter_month;
    }

    if(is_year && is_month && day != 9999)
    {
        is_day = day <= filter_day;
    }

    return is_year && is_month && is_day;
}