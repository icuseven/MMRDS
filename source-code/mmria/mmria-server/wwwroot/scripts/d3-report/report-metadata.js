var indicator_map = new Map();
indicator_map.set
(
    1,
    {
        indicator_id : "mUndCofDeath",
        title:"Underlying cause of death",
        blank_field_id: "MUndCofDeath21",
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
        
    }
);
indicator_map.set
(
    7,
    {
        indicator_id : "mDeathsbyRaceEth",
        title:"Race/Ethnicity",
        blank_field_id: "MRaceEth20",
        field_id_list : [
            // { name: "MRaceEth1", title: "" },
            // { name: "MRaceEth2", title: "" },
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
    9,
    {
        indicator_id : "mEducation",
        title:"Education",
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
    11,
    {
        indicator_id : "mHxofEmoStress",
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
indicator_map.set
(
    12,
    {
        indicator_id : "mHomeless",
        title:"Living Arrangements",
        blank_field_id: "MHomeless5",
        field_id_list : [
        { name: "MHomeless1", title: "Never experienced homelessness" },
        { name: "MHomeless2", title: "In last 12 months (obsolete)" },
        { name: "MHomeless3", title: "More than 12 months ago (obsolete)" },
        { name: "MHomeless4", title: "Unknown" },
        { name: "MHomeless5", title: "(blank)" },
        { name: "MHomeless6", title: "More than 1 year prior to pregnancy" },
        { name: "MHomeless7", title: "Within 1 year prior to pregnancy" },
        { name: "MHomeless8", title: "During pregnancy" },
        { name: "MHomeless9", title: "After pregnancy" },
        ],
    }
);
indicator_map.set
(
    13,
    {
        indicator_id : "mHxofSubAbu",
        title:"",
        blank_field_id: "MHxSub3",
        field_id_list : [
        { name: "MHxSub1", title: "Yes" },
        { name: "MHxSub2", title: "No" },
        { name: "MHxSub3", title: "(Blank)" },
        { name: "MHxSub4", title: "Unknown" },
        ],
    }
);
indicator_map.set
(
    14,
    {
        indicator_id : "mIncarHx",
        title:"",
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
indicator_map.set("mLivingArrange",{
    title:"Living Arrangements"
});
indicator_map.set
(
    15,
    {
        indicator_id : "mMHTxTiming",
        title:"Mental health treatment among women who died by overdose",
        blank_field_id: "MMHTx4",
        field_id_list : [
        { name: "MMHTx1", title: "Before most recent pregnancy" },
        { name: "MMHTx2", title: "During most recent pregnancy" },
        { name: "MMHTx3", title: "After most recent pregnancy" },
        { name: "MMHTx4", title: "(Blank)" },
        ],
    }
);
indicator_map.set
(
    16,
    {
        indicator_id : "mDeathSubAbuseEvi",
        title:"",
        blank_field_id: "MEviSub3",
        field_id_list : [
        { name: "MEviSub1", title: "Yes" },
        { name: "MEviSub2", title: "No" },
        { name: "MEviSub3", title: "(Blank)" },
        { name: "MEviSub4", title: "Unknown" },
        ],
    }
);
indicator_map.set("mPregRelated",{
    title:"Pregnancy Relatedness"
});
indicator_map.set
(
    17,
    {
        indicator_id : "mPregRelated",
        title:"Pregnancy Relatedness",
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
indicator_map.set("mSubstAutop",{
    title:""
});
indicator_map.set("mTimingofDeath",{
    title:"Timing of Death"
});
indicator_map.set("mUndCofDeath",{
    title:"Primary Underlying Cause of Death"
});
indicator_map.set
(
    10,
    {
    indicator_id : "mDeathCause",
    blank_field_id: "MCauseD15",
    field_id_list : [
        { name: "MCauseD1", title: "MCauseD1" },
        { name: "MCauseD2", title: "MCauseD2" },
        { name: "MCauseD3", title: "MCauseD3" },
        { name: "MCauseD4", title: "MCauseD4" },
        { name: "MCauseD5", title: "MCauseD5" },
        { name: "MCauseD6", title: "MCauseD6" },
        { name: "MCauseD7", title: "MCauseD7" },
        { name: "MCauseD8", title: "MCauseD8" },
        { name: "MCauseD9", title: "MCauseD9" },
        { name: "MCauseD10", title: "MCauseD10" },
        { name: "MCauseD11", title: "MCauseD11" },
        { name: "MCauseD12", title: "MCauseD12" },
        { name: "MCauseD13", title: "MCauseD13" },
        { name: "MCauseD14", title: "MCauseD14" },
        { name: "MCauseD15", title: "MCauseD15" },
    ],
    title:"Committee Determinations"
});
indicator_map.set("mDeathPrevent",{
    title:"Preventability"
});
indicator_map.set("mOMBRaceRcd",{
    title:"OMB Race Recode"
});
indicator_map.set("mDeathbyRace",{
    title:"Race"
});


async function get_indicator_values(p_indicator_id)
{
    const get_data_response = await $.ajax
    ({

        url: `${location.protocol}//${location.host}/api/powerbi-measures/${p_indicator_id}`,
    });

    g_data = { total: 0, data: []};

    for(let i = 0; i < get_data_response.docs.length; i++)
    {
        for(let j = 0; j < get_data_response.docs[i].data.length; j++)
        {
            g_data.data.push(get_data_response.docs[i].data[j]);
            g_data.total +=1;
        }
    }
}