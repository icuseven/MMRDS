using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace mmria_pmss_client.Models.IJE;
public sealed class MOR_Specification
{
    public const int Size = 5000; 
    public Layout this[string i]
    {
        get { return data[i]; }
    }
    ImmutableDictionary<string, Layout> data = ImmutableDictionary.CreateRange
    (
        new KeyValuePair<string,Layout>[] 
        {
            KeyValuePair.Create(, ),


    [Layout(0, 4)]
    [MMRIA_Path("home_record/date_of_death/Year", "hrdod_year")]
    [IJE_Name("DOD_YR")]
    public string hrdod_year;

KeyValuePair.Create(, ),
    [Layout(4, 2)]
    [MMRIA_Path("/home_record/state_of_death_record", "hr_sod_recor")]
    [IJE_Name("DSTATE")]
    public string hr_sod_recor;

KeyValuePair.Create(, ),
    [Layout(6, 6)]
    [MMRIA_Path("death_certificate/certificate_identification/state_file_number", "dcci_sf_numbe")]
    [IJE_Name("FILENO")]
    public string dcci_sf_numbe;


KeyValuePair.Create(, ),
    [Layout(13, 12)]
    [MMRIA_Path("death_certificate/certificate_identification/local_file_number", "dcci_lf_numbe")]
    [IJE_Name("AUXNO")]
    public string dcci_lf_numbe;

KeyValuePair.Create(, ),
    [Layout(26, 50)]
    [MMRIA_Path("home_record/first_name", "hr_f_name")]
    [IJE_Name("GNAME")]
    public string hr_f_name;

KeyValuePair.Create(, ),
    [Layout(77, 50)]
    [MMRIA_Path("home_record/last_name", "hr_l_name")]
    [IJE_Name("LNAME")]
    public string hr_l_name;

KeyValuePair.Create(, ),
    [Layout(200, 3)]
    [MMRIA_Path("death_certificate/demographics/age", "dcd_age")]
    [IJE_Name("AGE ")]
    public string dcd_age;

KeyValuePair.Create(, ),
    [Layout(204, 4)]
    [MMRIA_Path("death_certificate/demographics/date_of_birth/year", "dcddob_year")]
    [IJE_Name("DOB_YR")]
    public string dcddob_year;

KeyValuePair.Create(, ),
    [Layout(208, 2)]
    [MMRIA_Path("death_certificate/demographics/date_of_birth/month", "dcddob_month")]
    [IJE_Name("DOB_MO")]
    public string dcddob_month;

KeyValuePair.Create(, ),
    [Layout(210, 2)]
    [MMRIA_Path("death_certificate/demographics/date_of_birth/day", "dcddob_day")]
    [IJE_Name("DOB_DY")]
    public string dcddob_day;

KeyValuePair.Create(, ),
    [Layout(212, 2)]
    [MMRIA_Path("death_certificate/demographics/country_of_birth", "dcd_co_birth_83")]
    [IJE_Name("BPLACE_CNT")]
    public string dcd_co_birth_83;

KeyValuePair.Create(, ),
    [Layout(214, 2)]
    [MMRIA_Path("death_certificate/demographics/state_of_birth", "dcd_so_birth")]
    [IJE_Name("BPLACE_ST")]
    public string dcd_so_birth;

KeyValuePair.Create(, ),
    [Layout(224, 2)]
    [MMRIA_Path("death_certificate/place_of_last_residence/state", "dcpolr_state")]
    [IJE_Name("STATEC")]
    public string dcpolr_state;

KeyValuePair.Create(, ),
    [Layout(226, 2)]
    [MMRIA_Path("death_certificate/place_of_last_residence/country_of_last_residence", "dcpolr_col_resid")]
    [IJE_Name("COUNTRYC")]
    public string dcpolr_col_resid;

KeyValuePair.Create(, ),
    [Layout(229, 1)]
    [MMRIA_Path("death_certificate/demographics/marital_status", "dcd_m_statu")]
    [IJE_Name("MARITAL")]
    public string dcd_m_statu;

KeyValuePair.Create(, ),
    [Layout(231, 1)]
    [MMRIA_Path("/death_certificate /death_information /death_outside_of_hospital", "dcdi_doo_hospi")]
    [MMRIA_Path("death_certificate/death_information/death_occured_in_hospital", "dcdi_doi_hospi")]
    [IJE_Name("DPLACE")]
    public string dcdi_doi_hospi;

KeyValuePair.Create(, ),
    [Layout(236, 2)]
    [MMRIA_Path("home_record/date_of_death/month", "hrdod_month")]
    [IJE_Name("DOD_MO")]
    public string hrdod_month;

KeyValuePair.Create(, ),
    [Layout(238, 2)]
    [MMRIA_Path("home_record/date_of_death/day", "hrdod_day")]
    [IJE_Name("DOD_DY")]
    public string hrdod_day;

KeyValuePair.Create(, ),
    [Layout(240, 4)]
    [MMRIA_Path("death_certificate/certificate_identification/time_of_death", "dcci_to_death")]
    [IJE_Name("TOD")]
    public string dcci_to_death;

KeyValuePair.Create(, ),
    [Layout(244, 1)]
    [MMRIA_Path("death_certificate/demographics/education_level", "dcd_e_level")]
    [IJE_Name("DEDUC")]
    public string dcd_e_level;

KeyValuePair.Create(, ),
    [Layout(246, 1)]
    [MMRIA_Path("/death_certificate/demographics/is_of_hispanic_origin", "dcd_ioh_origi")]
    [IJE_Name("DETHNIC1")]
    public string dcd_ioh_origi;

KeyValuePair.Create(, ),
    [Layout(247, 1)]
    [MMRIA_Path("/death_certificate/demographics/is_of_hispanic_origin", "dcd_ioh_origi")]
    [IJE_Name("DETHNIC2")]
    public string DETHNIC2;

KeyValuePair.Create(, ),
    [Layout(248, 1)]
    [MMRIA_Path("/death_certificate/demographics/is_of_hispanic_origin", "dcd_ioh_origi")]
    [IJE_Name("DETHNIC3")]
    public string DETHNIC3;

KeyValuePair.Create(, ),
    [Layout(249, 1)]
    [MMRIA_Path("/death_certificate/demographics/is_of_hispanic_origin", "dcd_ioh_origi")]
    [IJE_Name("DETHNIC4")]
    public string DETHNIC4;

KeyValuePair.Create(, ),
    [Layout(250, 20)]
    [MMRIA_Path("Map to new MMRIA field for Other Hispanic, Specify. Add MMRIA path when available", "dcd_ioh_origi_othsp")]
    [IJE_Name("DETHNIC5")]
    public string dcd_ioh_origi_othsp;

KeyValuePair.Create(, ),
    [Layout(270, 1)]
    [MMRIA_Path("death_certificate/race/race ", "dcr_race")]
    [IJE_Name("RACE1")]
    public string RACE1;

KeyValuePair.Create(, ),
    [Layout(271, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE2")]
    public string RACE2;

KeyValuePair.Create(, ),
    [Layout(272, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE3")]
    public string RACE3;

KeyValuePair.Create(, ),
    [Layout(273, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE4")]
    public string RACE4;

KeyValuePair.Create(, ),
    [Layout(274, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE5")]
    public string RACE5;

KeyValuePair.Create(, ),
    [Layout(275, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE6")]
    public string RACE6;

KeyValuePair.Create(, ),
    [Layout(276, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE7")]
    public string RACE7;

KeyValuePair.Create(, ),
    [Layout(277, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE8")]
    public string RACE8;

KeyValuePair.Create(, ),
    [Layout(278, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE9")]
    public string RACE9;

KeyValuePair.Create(, ),
    [Layout(279, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE10")]
    public string RACE10;

KeyValuePair.Create(, ),
    [Layout(280, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE11")]
    public string RACE11;

KeyValuePair.Create(, ),
    [Layout(281, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE12")]
    public string RACE12;

KeyValuePair.Create(, ),
    [Layout(282, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE13")]
    public string RACE13;

KeyValuePair.Create(, ),
    [Layout(283, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE14")]
    public string RACE14;

KeyValuePair.Create(, ),
    [Layout(284, 1)]
    [MMRIA_Path("death_certificate/race/race", "dcr_race")]
    [IJE_Name("RACE15")]
    public string RACE15;

KeyValuePair.Create(, ),
    [Layout(285, 30)]
    [MMRIA_Path("/death_certificate/race/principle_tribe", "dcr_p_tribe")]
    [IJE_Name("RACE16")]
    public string dcr_p_tribe;

KeyValuePair.Create(, ),
    [Layout(315, 30)]
    [MMRIA_Path("/death_certificate/race/principle_tribe", "dcr_p_tribe")]
    [IJE_Name("RACE17")]
    public string dcr_p_tribe_17;

KeyValuePair.Create(, ),
    [Layout(345, 30)]
    [MMRIA_Path("/death_certificate/race/other_asian", "dcr_o_asian")]
    [IJE_Name("RACE18")]
    public string dcr_o_asian;
KeyValuePair.Create(, ),

    [Layout(375, 30)]
    [MMRIA_Path("/death_certificate/race/other_asian", "dcr_o_asian")]
    [IJE_Name("RACE19")]
    public string dcr_o_asian_19;


KeyValuePair.Create(, ),
    [Layout(405, 30)]
    [MMRIA_Path("/death_certificate/race/other_pacific_islander", "dcr_op_islan")]
    [IJE_Name("RACE20")]
    public string dcr_op_islan;

KeyValuePair.Create(, ),
    [Layout(435, 30)]
    [MMRIA_Path("/death_certificate/race/other_pacific_islander", "dcr_op_islan")]
    [IJE_Name("RACE21")]
    public string dcr_op_islan_21;


KeyValuePair.Create(, ),
    [Layout(465, 30)]
    [MMRIA_Path("/death_certificate/race/other_race", "dcr_o_race")]
    [IJE_Name("RACE22")]
    public string dcr_o_race;

KeyValuePair.Create(, ),
    [Layout(495, 30)]
    [MMRIA_Path("/death_certificate/race/other_race", "dcr_o_race")]
    [IJE_Name("RACE23")]
    public string dcr_o_race_23;


KeyValuePair.Create(, ),
    [Layout(574, 40)]
    [MMRIA_Path("/death_certificate/demographics/primary_occupation", "dcd_p_occup")]
    [IJE_Name("OCCUP")]
    public string dcd_p_occup;


KeyValuePair.Create(, ),
    [Layout(617, 40)]
    [MMRIA_Path("/death_certificate/demographics/occupation_business_industry", "dcd_ob_indus")]
    [IJE_Name("INDUST")]
    public string dcd_ob_indus;


KeyValuePair.Create(, ),
    [Layout(700, 1)]
    [MMRIA_Path("death_certificate/death_information/manner_of_death", "dcdi_mo_death")]
    [IJE_Name("MANNER")]
    public string dcdi_mo_death;

KeyValuePair.Create(, ),
    [Layout(704, 5)]
    [MMRIA_Path("Map to new MMRIA read-only field for  Underlying Cause. Add MMRIA path when available", "dcdi_man_uc")]
    [IJE_Name("MAN_UC")]
    public string dcdi_man_uc;

KeyValuePair.Create(, ),
    [Layout(709, 5)]
    [MMRIA_Path("Map to new MMRIA read-only field for ACME Underlying Cause. Add MMRIA path when available", "dcdi_acme_uc")]
    [IJE_Name("ACME_UC")]
    public string dcdi_acme_uc;

KeyValuePair.Create(, ),
    [Layout(714, 160)]
    [MMRIA_Path("Map to new MMRIA read-only field for Entity - axis Codes. Add MMRIA path when available", "dcdi_eac")]
    [IJE_Name("EAC")]
    public string dcdi_eac;

KeyValuePair.Create(, ),
    [Layout(875, 100)]
    [MMRIA_Path("Map to new MMRIA read-only field for Record - axis Codes Add MMRIA path when available", "dcdi_rac")]
    [IJE_Name("RAC")]
    public string dcdi_rac;

KeyValuePair.Create(, ),
    [Layout(975, 1)]
    [MMRIA_Path("death_certificate/death_information/was_autopsy_performed", "dcdi_wa_perfo")]
    [IJE_Name("AUTOP")]
    public string dcdi_wa_perfo;

KeyValuePair.Create(, ),
    [Layout(976, 1)]
    [MMRIA_Path("/death_certificate/death_information/was_autopsy_used_for_death_coding", "dcdi_waufd_codin")]
    [IJE_Name("AUTOPF")]
    public string dcdi_waufd_codin;

KeyValuePair.Create(, ),
    [Layout(977, 1)]
    [MMRIA_Path("death_certificate/death_information/did_tobacco_contribute_to_death", "dcdi_dtct_death")]
    [IJE_Name("TOBAC")]
    public string dcdi_dtct_death;

KeyValuePair.Create(, ),
    [Layout(978, 1)]
    [MMRIA_Path("death_certificate/death_information/pregnancy_status", "dcdi_p_statu")]
    [IJE_Name("PREG")]
    public string dcdi_p_statu;

KeyValuePair.Create(, ),
    [Layout(980, 2)]
    [MMRIA_Path("death_certificate/injury_associated_information/date_of_injury/month", "dciaidoi_month")]
    [IJE_Name("DOI_MO")]
    public string dciaidoi_month;

KeyValuePair.Create(, ),
    [Layout(982, 2)]
    [MMRIA_Path("death_certificate/injury_associated_information/date_of_injury/day", "dciaidoi_day")]
    [IJE_Name("DOI_DY")]
    public string dciaidoi_day;

KeyValuePair.Create(, ),
    [Layout(984, 4)]
    [MMRIA_Path("death_certificate/injury_associated_information/date_of_injury/year", "dciaidoi_year")]
    [IJE_Name("DOI_YR")]
    public string dciaidoi_year;

KeyValuePair.Create(, ),
    [Layout(988, 4)]
    [MMRIA_Path("death_certificate/injury_associated_information/time_of_injury", "dciai_to_injur")]
    [IJE_Name("TOI_HR")]
    public string dciai_to_injur;

KeyValuePair.Create(, ),
    [Layout(992, 1)]
    [MMRIA_Path("death_certificate/injury_associated_information/was_injury_at_work", "dciai_wia_work")]
    [IJE_Name("WORKINJ")]
    public string dciai_wia_work;

KeyValuePair.Create(, ),
    [Layout(1080, 1)]
    [MMRIA_Path("death_certificate/demographics/ever_in_us_armed_forces", "dcd_eiua_force")]
    [IJE_Name("ARMEDF")]
    public string dcd_eiua_force;

KeyValuePair.Create(, ),
    [Layout(1081, 30)]
    [MMRIA_Path("death_certificate/address_of_death/place_of_death", "dcaod_po_death")]
    [IJE_Name("DINSTI")]
    public string dcaod_po_death;

KeyValuePair.Create(, ),
    [Layout(1161, 10)]
    [MMRIA_Path("death_certificate/address_of_death/street", "dcaod_stree")]
    [IJE_Name("STNUM_D")]
    public string dcaod_stree_0;

KeyValuePair.Create(, ),
    [Layout(1171, 10)]
    [MMRIA_Path("death_certificate/address_of_death/street", "dcaod_stree")]
    [IJE_Name("PREDIR_D")]
    public string dcaod_stree_1;

KeyValuePair.Create(, ),
    [Layout(1181, 50)]
    [MMRIA_Path("death_certificate/address_of_death/street", "dcaod_stree")]
    [IJE_Name("STNAME_D")]
    public string dcaod_stree_2;

KeyValuePair.Create(, ),
    [Layout(1231, 10)]
    [MMRIA_Path("death_certificate/address_of_death/street", "dcaod_stree")]
    [IJE_Name("STDESIG_D")]
    public string dcaod_stree_3;

KeyValuePair.Create(, ),
    [Layout(1241, 10)]
    [MMRIA_Path("death_certificate/address_of_death/street", "dcaod_stree")]
    [IJE_Name("POSTDIR_D")]
    public string dcaod_stree_4;

KeyValuePair.Create(, ),
    [Layout(1251, 28)]
    [MMRIA_Path("death_certificate/address_of_death/city", "dcaod_city")]
    [IJE_Name("CITYTEXT_D")]
    public string dcaod_city;

KeyValuePair.Create(, ),
    [Layout(1279, 28)]
    [MMRIA_Path("death_certificate/address_of_death/state", "dcaod_state")]
    [IJE_Name("STATETEXT_D")]
    public string dcaod_state;

KeyValuePair.Create(, ),
    [Layout(1307, 9)]
    [MMRIA_Path("death_certificate/address_of_death/zip_code", "dcaod_z_code")]
    [IJE_Name("ZIP9_D")]
    public string dcaod_z_code;

KeyValuePair.Create(, ),
    [Layout(1316, 28)]
    [MMRIA_Path("death_certificate/address_of_death/county", "dcaod_count")]
    [IJE_Name("COUNTYTEXT_D")]
    public string dcaod_count;

KeyValuePair.Create(, ),
    [Layout(1484, 10)]
    [MMRIA_Path("death_certificate/place_of_last_residence/street", "dcpolr_stree")]
    [IJE_Name("STNUM_R")]
    public string dcpolr_stree_0;

KeyValuePair.Create(, ),
    [Layout(1494, 10)]
    [MMRIA_Path("death_certificate/place_of_last_residence/street", "dcpolr_stree")]
    [IJE_Name("PREDIR_R")]
    public string dcpolr_stree_1;

KeyValuePair.Create(, ),
    [Layout(1504, 28)]
    [MMRIA_Path("death_certificate/place_of_last_residence/street", "dcpolr_stree")]
    [IJE_Name("STNAME_R")]
    public string dcpolr_stree_2;

KeyValuePair.Create(, ),
    [Layout(1532, 10)]
    [MMRIA_Path("death_certificate/place_of_last_residence/street", "dcpolr_stree")]
    [IJE_Name("STDESIG_R")]
    public string dcpolr_stree_3;

KeyValuePair.Create(, ),
    [Layout(1542, 10)]
    [MMRIA_Path("death_certificate/place_of_last_residence/street", "dcpolr_stree")]
    [IJE_Name("POSTDIR_R")]
    public string dcpolr_stree_4;

KeyValuePair.Create(, ),
    [Layout(1552, 7)]
    [MMRIA_Path("death_certificate/place_of_last_residence/apartment", "dcpolr_apart")]
    [IJE_Name("UNITNUM_R")]
    public string dcpolr_apart;

KeyValuePair.Create(, ),
    [Layout(1559, 28)]
    [MMRIA_Path("death_certificate/place_of_last_residence/city", "dcpolr_city")]
    [IJE_Name("CITYTEXT_R")]
    public string dcpolr_city;

KeyValuePair.Create(, ),
    [Layout(1587, 9)]
    [MMRIA_Path("death_certificate/place_of_last_residence/zip_code", "dcpolr_z_code")]
    [IJE_Name("ZIP9_R")]
    public string dcpolr_z_code;

KeyValuePair.Create(, ),
    [Layout(1596, 28)]
    [MMRIA_Path("death_certificate/place_of_last_residence/county", "dcpolr_count")]
    [IJE_Name("COUNTYTEXT_R")]
    public string dcpolr_count;

KeyValuePair.Create(, ),
    [Layout(1807, 50)]
    [MMRIA_Path("home_record/middle_name", "hr_m_name")]
    [IJE_Name("DMIDDLE")]
    public string hr_m_name;

KeyValuePair.Create(, ),
    [Layout(2108, 50)]
    [MMRIA_Path("death_certificate/injury_associated_information/place_of_injury", "dciai_po_injur")]
    [IJE_Name("POILITRL")]
    public string dciai_po_injur;

KeyValuePair.Create(, ),
    [Layout(2408, 30)]
    [MMRIA_Path("death_certificate/injury_associated_information/transportation_related_injury", "dciai_tr_injur ")]
    [MMRIA_Path("death_certificate/injury_associated_information transport_related_other_specify", " dciai_tro_speci")]
    [IJE_Name("TRANSPRT")]
    public string dciai_tro_speci;

KeyValuePair.Create(, ),
    [Layout(2438, 28)]
    [MMRIA_Path("death_certificate/address_of_injury/county", "dcaoi_count")]
    [IJE_Name("COUNTYTEXT_I")]
    public string dcaoi_count;

KeyValuePair.Create(, ),
    [Layout(2469, 28)]
    [MMRIA_Path("death_certificate/address_of_injury/city", "dcaoi_city")]
    [IJE_Name("CITYTEXT_I")]
    public string dcaoi_city;

KeyValuePair.Create(, ),
    [Layout(2541, 120)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_cod1a")]
    [IJE_Name("COD1A")]
    public string dcdi_cod1a;

KeyValuePair.Create(, ),
    [Layout(2661, 20)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_interval1a")]
    [IJE_Name("INTERVAL1A")]
    public string dcdi_interval1a;

KeyValuePair.Create(, ),
    [Layout(2681, 120)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_cod1b")]
    [IJE_Name("COD1B")]
    public string dcdi_cod1b;

KeyValuePair.Create(, ),
    [Layout(2801, 20)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_interval1b")]
    [IJE_Name("INTERVAL1B")]
    public string dcdi_interval1b;

KeyValuePair.Create(, ),
    [Layout(2821, 120)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_cod1c")]
    [IJE_Name("COD1C")]
    public string dcdi_cod1c;

KeyValuePair.Create(, ),
    [Layout(2941, 20)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_interval1c")]
    [IJE_Name("INTERVAL1C")]
    public string dcdi_interval1c;

KeyValuePair.Create(, ),
    [Layout(2961, 120)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_cod1d")]
    [IJE_Name("COD1D")]
    public string dcdi_cod1d;

KeyValuePair.Create(, ),
    [Layout(3081, 20)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_interval1d")]
    [IJE_Name("INTERVAL1D")]
    public string dcdi_interval1d;

KeyValuePair.Create(, ),
    [Layout(3101, 240)]
    [MMRIA_Path("New MMRIA fields; add paths when available", "dcdi_othercondition")]
    [IJE_Name("OTHERCONDITION")]
    public string dcdi_othercondition;

KeyValuePair.Create(, ),
    [Layout(3396, 28)]
    [MMRIA_Path("death_certificate/demographics/city_of_birth", "dcd_co_birth")]
    [IJE_Name("DBPLACECITY")]
    public string dcd_co_birth;

KeyValuePair.Create(, ),
    [Layout(4269, 28)]
    [MMRIA_Path("death_certificate/address_of_injury/state", "dcaoi_state")]
    [IJE_Name("STINJURY")]
    public string dcaoi_state;

KeyValuePair.Create(, ),
    [Layout(4992, 1)]
    [MMRIA_Path("TBD", "hr_vro_status")]
    [IJE_Name("VRO_STATUS")]
    public string hr_vro_status;

KeyValuePair.Create(, ),
    [Layout(4993, 1)]
    [MMRIA_Path("TBD", "CDC_DET_BC")]
    [IJE_Name("BC_DET_MATCH")]
    public string CDC_DET_BC;

KeyValuePair.Create(, ),
    [Layout(4994, 1)]
    [MMRIA_Path("TBD", "CDC_DET_FDC")]
    [IJE_Name("FDC_DET_MATCH")]
    public string CDC_DET_FDC;

KeyValuePair.Create(, ),
    [Layout(4995, 1)]
    [MMRIA_Path("TBD", "CDC_PROB_BC")]
    [IJE_Name("BC_PROB_MATCH")]
    public string CDC_PROB_BC;

KeyValuePair.Create(, ),
    [Layout(4996, 1)]
    [MMRIA_Path("TBD", "CDC_PROB_FDC")]
    [IJE_Name("FDC_PROB_MATCH")]
    public string CDC_PROB_FDC;

KeyValuePair.Create(, ),
    [Layout(4997, 1)]
    [MMRIA_Path("TBD", "CDC_ICD")]
    [IJE_Name("ICD10_MATCH")]
    public string CDC_ICD;

KeyValuePair.Create(, ),
    [Layout(4998, 1)]
    [MMRIA_Path("TBD", "CDC_CHECKBOX")]
    [IJE_Name("PREGCB_MATCH")]
    public string CDC_CHECKBOX;

KeyValuePair.Create(, ),
    [Layout(4999, 1)]
    [MMRIA_Path("TBD", "CDC_LITERALCOD")]
    [IJE_Name("LITERALCOD_MATCH")]
    public string CDC_LITERALCOD;

    
    });




}