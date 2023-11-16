using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace mmria_pmss_client.Models.IJE;
public sealed class NAT_Specification
{
    public const int Size = 4000; 
    public Layout this[string i]
    {
        get { return data[i]; }
    }
    ImmutableDictionary<string, Layout> data = ImmutableDictionary.CreateRange
    (
        new KeyValuePair<string,Layout>[] 
        {
            KeyValuePair.Create("IDOB_YR", new Layout(0, 4)),
            /*
    [Layout(0, 4)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/year", "bfdcpfodddod_year")]
    [MMRIA_Path("/birth_certificate_infant_fetal_section/record_identification/date_of_delivery", "bcifsri_do_deliv")]
    [IJE_Name("IDOB_YR")]
    public string IDOB_YR;
    */

            KeyValuePair.Create("FILENO", new Layout(6, 6)),
            /*
    [Layout(6, 6)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/record_identification/state_file_number", "bcifsri_sf_numbe")]
    [IJE_Name("FILENO")]
    public string FILENO;
    */

            KeyValuePair.Create("AUXNO", new Layout(13, 12)),
            /*
    [Layout(13, 12)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/record_identification/local_file_number", "bcifsri_lf_numbe")]
    [IJE_Name("AUXNO")]
    public string AUXNO;
    */

            KeyValuePair.Create("TB", new Layout(25, 4)),
            /*
    [Layout(25, 4)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/record_identification/time_of_delivery", "bcifsri_to_deliv")]
    [IJE_Name("TB")]
    public string TB;
    */

            KeyValuePair.Create("IDOB_MO", new Layout(30, 2)),
            /*
    [Layout(30, 2)]
    [MMRIA_Path("/birth_certificate_infant_fetal_section/record_identification/date_of_delivery", "bcifsri_do_deliv")]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/month", "bfdcpfodddod_month")]
    [IJE_Name("IDOB_MO")]
    public string IDOB_MO;
    */

            KeyValuePair.Create("IDOB_DY", new Layout(32, 2)),
            /*
    [Layout(32, 2)]
    [MMRIA_Path("/birth_certificate_infant_fetal_section/record_identification/date_of_delivery", "bcifsri_do_deliv ")]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day", "bfdcpfodddod_day")]
    [IJE_Name("IDOB_DY")]
    public string IDOB_DY;
    */

            KeyValuePair.Create("FNPI", new Layout(38, 12)),
            /*
    [Layout(38, 12)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_npi_number", "bfdcpfodd_fn_numbe")]
    [IJE_Name("FNPI")]
    public string FNPI;
    */

            KeyValuePair.Create("MDOB_YR", new Layout(54, 4)),
            /*
    [Layout(54, 4)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/year", "bfdcpdomdob_year")]
    [IJE_Name("MDOB_YR")]
    public string MDOB_YR;
    */

            KeyValuePair.Create("MDOB_MO", new Layout(58, 2)),
            /*
    [Layout(58, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/month", "bfdcpdomdob_month")]
    [IJE_Name("MDOB_MO")]
    public string MDOB_MO;
    */

            KeyValuePair.Create("MDOB_DY", new Layout(60, 2)),
            /*
    [Layout(60, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day", "bfdcpdomdob_day")]
    [IJE_Name("MDOB_DY")]
    public string MDOB_DY;
    */

            KeyValuePair.Create("FDOB_YR", new Layout(80, 4)),
            /*
    [Layout(80, 4)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/year", "bfdcpdofdob_year")]
    [IJE_Name("FDOB_YR")]
    public string FDOB_YR;
    */

            KeyValuePair.Create("FDOB_MO", new Layout(84, 2)),
            /*
    [Layout(84, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/month", "bfdcpdofdob_month")]
    [IJE_Name("FDOB_MO")]
    public string FDOB_MO;
    */

            KeyValuePair.Create("MARN", new Layout(90, 1)),
            /*
    [Layout(90, 1)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/demographic_of_mother/mother_married", "bfdcpdom_m_marri")]
    [IJE_Name("MARN")]
    public string MARN;
    */

            KeyValuePair.Create("ACKN", new Layout(91, 1)),
            /*
    [Layout(91, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital", "bfdcpdom_Imnmhpabsit_hospi")]
    [IJE_Name("ACKN")]
    public string ACKN;
    */

            KeyValuePair.Create("MEDUC", new Layout(92, 1)),
            /*
    [Layout(92, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/education_level", "bfdcpdom_e_level")]
    [IJE_Name("MEDUC")]
    public string MEDUC;
    */

            KeyValuePair.Create("METHNIC5", new Layout(98, 20)),
            /*
    [Layout(98, 20)]
    [MMRIA_Path("New MMRIA Field: (for mother) Other Hispanic, specify (add MMRIA path when available)", "bfdcpdom_ioh_origi_othsp")]
    [IJE_Name("METHNIC5")]
    public string METHNIC5;
    */

            KeyValuePair.Create("FEDUC", new Layout(421, 1)),
            /*
    [Layout(421, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_father/education_level", "bfdcpdof_e_level")]
    [IJE_Name("FEDUC")]
    public string FEDUC;
    */

            KeyValuePair.Create("FETHNIC5", new Layout(427, 20)),
            /*
    [Layout(427, 20)]
    [MMRIA_Path("New MMRIA Field: (for father) Other Hispanic, specify (add MMRIA path when available)", "bfdcpdof_ifoh_origi _othsp")]
    [IJE_Name("FETHNIC5")]
    public string FETHNIC5;
    */

            KeyValuePair.Create("ATTEND", new Layout(750, 1)),
            /*
    [Layout(750, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_type", "bfdcpfodd_a_type")]
    [IJE_Name("ATTEND")]
    public string ATTEND;
    */

            KeyValuePair.Create("TRAN", new Layout(751, 1)),
            /*
    [Layout(751, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/was_mother_transferred", "bfdcpfodd_wm_trans")]
    [IJE_Name("TRAN")]
    public string TRAN;
    */

            KeyValuePair.Create("NPREV", new Layout(768, 2)),
            /*
    [Layout(768, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/prenatal_care/number_of_visits", "bfdcppc_no_visit")]
    [IJE_Name("NPREV")]
    public string NPREV;
    */

            KeyValuePair.Create("HFT", new Layout(771, 1)),
            /*
    [Layout(771, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/maternal_biometrics/height_feet", "bfdcpmb_h_feet")]
    [IJE_Name("HFT")]
    public string HFT;
    */

            KeyValuePair.Create("HIN", new Layout(772, 2)),
            /*
    [Layout(772, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/maternal_biometrics/height_inches", "bfdcpmb_h_inche")]
    [IJE_Name("HIN")]
    public string HIN;
    */

            KeyValuePair.Create("PWGT", new Layout(775, 3)),
            /*
    [Layout(775, 3)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/maternal_biometrics/pre_pregnancy_weight", "bfdcpmb_pp_weigh")]
    [IJE_Name("PWGT")]
    public string PWGT;
    */

            KeyValuePair.Create("DWGT", new Layout(779, 3)),
            /*
    [Layout(779, 3)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/maternal_biometrics/weight_at_delivery", "bfdcpmb_wa_deliv")]
    [IJE_Name("DWGT")]
    public string DWGT;
    */

            KeyValuePair.Create("WIC", new Layout(783, 1)),
            /*
    [Layout(783, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/prenatal_care/was_wic_used", "bfdcppc_ww_used")]
    [IJE_Name("WIC")]
    public string WIC;
    */

            KeyValuePair.Create("PLBL", new Layout(784, 2)),
            /*
    [Layout(784, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/pregnancy_history/now_living", "bfdcpph_n_livin")]
    [IJE_Name("PLBL")]
    public string PLBL;
    */

            KeyValuePair.Create("PLBD", new Layout(786, 2)),
            /*
    [Layout(786, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/pregnancy_history/now_dead", "bfdcpph_n_dead")]
    [IJE_Name("PLBD")]
    public string PLBD;
    */

            KeyValuePair.Create("POPO", new Layout(788, 2)),
            /*
    [Layout(788, 2)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/pregnancy_history/other_outcomes", "bfdcpph_o_outco")]
    [IJE_Name("POPO")]
    public string POPO;
    */

            KeyValuePair.Create("MLLB", new Layout(790, 2)),
            /*
    [Layout(790, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/month", "bfdcpphdollb_month")]
    [IJE_Name("MLLB")]
    public string MLLB;
    */

            KeyValuePair.Create("YLLB", new Layout(792, 4)),
            /*
    [Layout(792, 4)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/year", "bfdcpphdollb_year")]
    [IJE_Name("YLLB")]
    public string YLLB;
    */

            KeyValuePair.Create("MOPO", new Layout(796, 2)),
            /*
    [Layout(796, 2)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/month", "bfdcpphdoloo_month")]
    [IJE_Name("MOPO")]
    public string MOPO;
    */

            KeyValuePair.Create("YOPO", new Layout(798, 4)),
            /*
    [Layout(798, 4)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/year", "bfdcpphdoloo_year")]
    [IJE_Name("YOPO")]
    public string YOPO;
    */

            KeyValuePair.Create("PAY", new Layout(810, 1)),
            /*
    [Layout(810, 1)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/prenatal_care/principal_source_of_payment_for_this_delivery ", "bfdcppc_psopft_deliv")]
    [IJE_Name("PAY")]
    public string PAY;
    */

            KeyValuePair.Create("DLMP_YR", new Layout(811, 4)),
            /*
    [Layout(811, 4)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/year", "bfdcppcdolnm_year")]
    [IJE_Name("DLMP_YR")]
    public string DLMP_YR;
    */

            KeyValuePair.Create("DLMP_MO", new Layout(815, 2)),
            /*
    [Layout(815, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/month", "bfdcppcdolnm_month")]
    [IJE_Name("DLMP_MO")]
    public string DLMP_MO;
    */

            KeyValuePair.Create("DLMP_DY", new Layout(817, 2)),
            /*
    [Layout(817, 2)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day", "bfdcppcdolnm_day")]
    [IJE_Name("DLMP_DY")]
    public string DLMP_DY;
    */

            KeyValuePair.Create("NPCES", new Layout(828, 2)),
            /*
    [Layout(828, 2)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/risk_factors/number_of_c_sections", "bfdcprf_noc_secti")]
    [IJE_Name("NPCES")]
    public string NPCES;
    */

            KeyValuePair.Create("ATTF", new Layout(853, 1)),
            /*
    [Layout(853, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/method_of_delivery/was_delivery_with_forceps_attempted_but_unsuccessful", "bcifsmod_wdwfab_unsuc")]
    [IJE_Name("ATTF")]
    public string ATTF;
    */

            KeyValuePair.Create("ATTV", new Layout(854, 1)),
            /*
    [Layout(854, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/method_of_delivery/was_delivery_with_vacuum_extration_attempted_but_unsuccessful", "bcifsmod_wdwveab_unsuc")]
    [IJE_Name("ATTV")]
    public string ATTV;
    */

            KeyValuePair.Create("PRES", new Layout(855, 1)),
            /*
    [Layout(855, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/method_of_delivery/fetal_delivery", "bcifsmod_f_deliv")]
    [IJE_Name("PRES")]
    public string PRES;
    */

            KeyValuePair.Create("ROUT", new Layout(856, 1)),
            /*
    [Layout(856, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/method_of_delivery/final_route_and_method_of_delivery", "bcifsmod_framo_deliv")]
    [IJE_Name("ROUT")]
    public string ROUT;
    */

            KeyValuePair.Create("OWGEST", new Layout(869, 2)),
            /*
    [Layout(869, 2)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/prenatal_care/obsteric_estimate_of_gestation", "bfdcppc_oeo_gesta")]
    [IJE_Name("OWGEST")]
    public string OWGEST;
    */

            KeyValuePair.Create("APGAR5", new Layout(872, 2)),
            /*
    [Layout(872, 2)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/biometrics_and_demographics/apgar_scores/minute_5", "bcifsbadas_m_5")]
    [IJE_Name("APGAR5")]
    public string APGAR5;
    */

            KeyValuePair.Create("APGAR10", new Layout(874, 2)),
            /*
    [Layout(874, 2)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/biometrics_and_demographics/apgar_scores/minute_10", "bcifsbadas_m_10")]
    [IJE_Name("APGAR10")]
    public string APGAR10;
    */

            KeyValuePair.Create("SORD", new Layout(878, 2)),
            /*
    [Layout(878, 2)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/birth_order", "bcifs_b_order")]
    [IJE_Name("SORD")]
    public string SORD;
    */

            KeyValuePair.Create("ITRAN", new Layout(908, 1)),
            /*
    [Layout(908, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/biometrics_and_demographics/was_infant_transferred_within_24_hours", "bcifsbad_witw2_hours")]
    [IJE_Name("ITRAN")]
    public string ITRAN;
    */

            KeyValuePair.Create("ILIV", new Layout(909, 1)),
            /*
    [Layout(909, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/biometrics_and_demographics/is_infant_living_at_time_of_report", "bcifsbad_iilato_repor")]
    [IJE_Name("ILIV")]
    public string ILIV;
    */

            KeyValuePair.Create("BFED", new Layout(910, 1)),
            /*
    [Layout(910, 1)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/biometrics_and_demographics/is_infant_being_breastfed_at_discharge", "bcifsbad_iibba_disch")]
    [IJE_Name("BFED")]
    public string BFED;
    */

            KeyValuePair.Create("BIRTH_CO", new Layout(1157, 25)),
            /*
    [Layout(1157, 25)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_location/county", "bfdcpfodl_count")]
    [IJE_Name("BIRTH_CO")]
    public string BIRTH_CO;
    */

            KeyValuePair.Create("BRTHCITY", new Layout(1182, 50)),
            /*
    [Layout(1182, 50)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_location/city", "bfdcpfodl_city")]
    [IJE_Name("BRTHCITY")]
    public string BRTHCITY;
    */

            KeyValuePair.Create("HOSP", new Layout(1232, 50)),
            /*
    [Layout(1232, 50)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name", "bfdcpfodd_f_name")]
    [IJE_Name("HOSP")]
    public string HOSP;
    */

            KeyValuePair.Create("MOMFNAME", new Layout(1282, 50)),
            /*
    [Layout(1282, 50)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/record_identification/first_name", "bfdcpri_f_name")]
    [IJE_Name("MOMFNAME")]
    public string MOMFNAME;
    */

            KeyValuePair.Create("MOMMIDDL", new Layout(1332, 50)),
            /*
    [Layout(1332, 50)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/record_identification/middle_name", "bfdcpri_m_name")]
    [IJE_Name("MOMMIDDL")]
    public string MOMMIDDL;
    */

            KeyValuePair.Create("MOMLNAME", new Layout(1382, 50)),
            /*
    [Layout(1382, 50)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/record_identification/last_name", "bfdcpri_l_name")]
    [IJE_Name("MOMLNAME")]
    public string MOMLNAME;
    */

            KeyValuePair.Create("MOMMAIDN", new Layout(1539, 50)),
            /*
    [Layout(1539, 50)]
    [MMRIA_Path("/birth_fetal_death_certificate_parent/record_identification/maiden_name", "bfdcpri_m_name_244")]
    [IJE_Name("MOMMAIDN")]
    public string MOMMAIDN;
    */

            KeyValuePair.Create("STNUM", new Layout(1596, 10)),
            /*
    [Layout(1596, 10)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/street", "bfdcplor_stree")]
    [IJE_Name("STNUM")]
    public string STNUM;
    */

            KeyValuePair.Create("PREDIR", new Layout(1606, 10)),
            /*
    [Layout(1606, 10)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/street", "bfdcplor_stree")]
    [IJE_Name("PREDIR")]
    public string PREDIR;
    */

            KeyValuePair.Create("STNAME", new Layout(1616, 28)),
            /*
    [Layout(1616, 28)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/street", "bfdcplor_stree")]
    [IJE_Name("STNAME")]
    public string STNAME;
    */

            KeyValuePair.Create("STDESIG", new Layout(1644, 10)),
            /*
    [Layout(1644, 10)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/street", "bfdcplor_stree")]
    [IJE_Name("STDESIG")]
    public string STDESIG;
    */

            KeyValuePair.Create("POSTDIR", new Layout(1654, 10)),
            /*
    [Layout(1654, 10)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/street", "bfdcplor_stree")]
    [IJE_Name("POSTDIR")]
    public string POSTDIR;
    */

            KeyValuePair.Create("UNUM", new Layout(1664, 7)),
            /*
    [Layout(1664, 7)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/apartment", "bfdcplor_apart")]
    [IJE_Name("UNUM")]
    public string UNUM;
    */

            KeyValuePair.Create("ZIPCODE", new Layout(1721, 9)),
            /*
    [Layout(1721, 9)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/zip_code", "bfdcplor_z_code")]
    [IJE_Name("ZIPCODE")]
    public string ZIPCODE;
    */

            KeyValuePair.Create("COUNTYTXT", new Layout(1730, 28)),
            /*
    [Layout(1730, 28)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/county", "bfdcplor_count")]
    [IJE_Name("COUNTYTXT")]
    public string COUNTYTXT;
    */

            KeyValuePair.Create("CITYTEXT", new Layout(1758, 28)),
            /*
    [Layout(1758, 28)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/location_of_residence/city", "bfdcplor_city")]
    [IJE_Name("CITYTEXT")]
    public string CITYTEXT;
    */

            KeyValuePair.Create("MOM_OC_T", new Layout(2021, 25)),
            /*
    [Layout(2021, 25)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation", "bfdcpdom_p_occup")]
    [IJE_Name("MOM_OC_T")]
    public string MOM_OC_T;
    */

            KeyValuePair.Create("DAD_OC_T", new Layout(2049, 25)),
            /*
    [Layout(2049, 25)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_father/primary_occupation", "bfdcpdof_p_occup")]
    [IJE_Name("DAD_OC_T")]
    public string DAD_OC_T;
    */

            KeyValuePair.Create("MOM_IN_T", new Layout(2077, 25)),
            /*
    [Layout(2077, 25)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry", "bfdcpdom_ob_indus")]
    [IJE_Name("MOM_IN_T")]
    public string MOM_IN_T;
    */

            KeyValuePair.Create("DAD_IN_T", new Layout(2105, 25)),
            /*
    [Layout(2105, 25)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/demographic_of_father/occupation_business_industry", "bfdcpdof_ob_indus")]
    [IJE_Name("DAD_IN_T")]
    public string DAD_IN_T;
    */

            KeyValuePair.Create("HOSPFROM", new Layout(2283, 50)),
            /*
    [Layout(2283, 50)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/transferred_from_where", "bfdcpfodd_tf_where")]
    [IJE_Name("HOSPFROM")]
    public string HOSPFROM;
    */

            KeyValuePair.Create("HOSPTO", new Layout(2333, 50)),
            /*
    [Layout(2333, 50)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/biometrics_and_demographics/facility_city_state", "bcifsbad_fc_state")]
    [IJE_Name("HOSPTO")]
    public string HOSPTO;
    */

            KeyValuePair.Create("ATTEND_OTH_TXT", new Layout(2383, 20)),
            /*
    [Layout(2383, 20)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/other_attendant_type", "bfdcpfodd_oa_type")]
    [IJE_Name("ATTEND_OTH_TXT")]
    public string ATTEND_OTH_TXT;
    */

            KeyValuePair.Create("ATTEND_NPI", new Layout(2826, 12)),
            /*
    [Layout(2826, 12)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_npi", "bfdcpfodd_a_npi")]
    [IJE_Name("ATTEND_NPI")]
    public string ATTEND_NPI;
    */

            KeyValuePair.Create("INF_MED_REC_NUM", new Layout(2921, 15)),
            /*
    [Layout(2921, 15)]
    [MMRIA_Path("birth_certificate_infant_fetal_section/record_identification/newborn_medical_record_number", "bcifsri_nmr_numbe")]
    [IJE_Name("INF_MED_REC_NUM")]
    public string INF_MED_REC_NUM;
    */

            KeyValuePair.Create("MOM_MED_REC_NUM", new Layout(2936, 15)),
            /*
    [Layout(2936, 15)]
    [MMRIA_Path("birth_fetal_death_certificate_parent/record_identification/medical_record_number", "bfdcpri_mr_numbe")]
    [IJE_Name("MOM_MED_REC_NUM")]
    public string MOM_MED_REC_NUM;
    */
    });




}