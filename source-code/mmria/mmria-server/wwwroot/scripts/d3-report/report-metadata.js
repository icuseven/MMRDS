var indicator_map = new Map();
indicator_map.set(1,{
    indicator_id : "mUndCofDeath",
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
    title:"Underlying cause of death"
});
indicator_map.set("mDeathsbyRaceEth",{
    title:"Race/Ethnicity"
});
indicator_map.set("mDeathSubAbuseEvi",{
    title:""
});
indicator_map.set("mEducation",{
    title:"Education"
});
indicator_map.set("mHomeless",{
    title:"Living Arrangements"
});
indicator_map.set("mHxofEmoStress",{
    title:"Emotional Stress"
});
indicator_map.set("mHxofSubAbu",{
    title:""
});
indicator_map.set("mIncarHx",{
    title:""
});
indicator_map.set("mLivingArrange",{
    title:"Living Arrangements"
});
indicator_map.set("mMHTxTiming",{
    title:""
});
indicator_map.set("mPregRelated",{
    title:"Pregnancy Relatedness"
});
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