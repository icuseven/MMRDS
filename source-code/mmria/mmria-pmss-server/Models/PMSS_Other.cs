using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace mmria_pmss_client.Models.IJE;
public sealed class PMSS_Other
{

    public PMSS_Other() {}
    

    public string batch_name{ get; set; }
    public string fileno_dc{ get; set; }
    public string fileno_bc{ get; set; }
    public string fileno_fdc{ get; set; }
    public string year_birthorfetaldeath{ get; set; }
    public string pregcb_match{ get; set; }
    public string literalcod_match{ get; set; }
    public string icd10_match{ get; set; }
    public string bc_det_match{ get; set; }
    public string fdc_det_match{ get; set; }
    public string bc_prob_match{ get; set; }
    public string fdc_prob_match{ get; set; }
    public string vro_resolution_status{ get; set; }
    public string vro_resolution_remarks{ get; set; }
    public string Year{ get; set; }
    public string CaseNo{ get; set; }
    public string PMSS_State_Code{ get; set; }
    
    public string Jurisdiction{ get; set; }
    public string Jurisdiction_Name{ get; set; }
    public string Status{ get; set; }
    public string AmssNo{ get; set; }
    public string AmssRel{ get; set; }
    public string Dc{ get; set; }
    public string Dod{ get; set; }
    public string SourcNot{ get; set; }
    public string DcFile{ get; set; }
    public string LbFile{ get; set; }
    public string PregStat{ get; set; }
    public string PcbTime{ get; set; }
    public string StatDth{ get; set; }
    public string StatRes{ get; set; }
    public string ResZip{ get; set; }
    public string ZipSrce{ get; set; }
    public string County{ get; set; }
    public string CntySrce{ get; set; }
    public string MAge{ get; set; }
    public string Dob{ get; set; }
    public string AgeDif{ get; set; }
    public string Race{ get; set; }
    public string Race_Oth{ get; set; }
    public string Race_Source{ get; set; }
    public string Race_OMB{ get; set; }
    public string Race_White{ get; set; }
    public string Race_Black{ get; set; }
    public string Race_AmIndAlkNat{ get; set; }
    public string Race_AsianIndian{ get; set; }
    public string Race_Chinese{ get; set; }
    public string Race_Filipino{ get; set; }
    public string Race_Japanese{ get; set; }
    public string Race_Korean{ get; set; }
    public string Race_Vietnamese{ get; set; }
    public string Race_OtherAsian{ get; set; }
    public string Race_NativeHawaiian{ get; set; }
    public string Race_GuamCham{ get; set; }
    public string Race_Samoan{ get; set; }
    public string Race_OtherPacific{ get; set; }
    public string Race_Other{ get; set; }
    public string Race_NotSpecified{ get; set; }
    public string HispOrg{ get; set; }
    public string Hisp_Oth{ get; set; }
    public string MatBplc{ get; set; }
    public string MatBplc_US{ get; set; }
    public string MatBplc_Else{ get; set; }
    public string MarStat{ get; set; }
    public string EducaTn{ get; set; }
    public string PlaceDth{ get; set; }
    public string Pnc{ get; set; }
    public string Autopsy3{ get; set; }
    public string Height{ get; set; }
    public string WtPrePrg{ get; set; }
    public string PrevLb{ get; set; }
    public string PrvOthPg{ get; set; }
    public string PymtSrc{ get; set; }
    public string Wic{ get; set; }
    public string OutIndx{ get; set; }
    public string MultGest{ get; set; }
    public string TermProc{ get; set; }
    public string TermPro1{ get; set; }
    public string TermPro2{ get; set; }
    public string GestWk{ get; set; }
    public string DTerm{ get; set; }
    public string DayDif{ get; set; }
    public string CdcCod{ get; set; }
    public string Cod{ get; set; }
    public string AssoC1{ get; set; }
    public string Acon1{ get; set; }
    public string AssoC2{ get; set; }
    public string Acon2{ get; set; }
    public string AssoC3{ get; set; }
    public string Acon3{ get; set; }
    public string Injury{ get; set; }
    public string Drug_1{ get; set; }
    public string Drug_2{ get; set; }
    public string Drug_3{ get; set; }
    public string Class{ get; set; }
    public string Coder{ get; set; }
    public string ClsMo{ get; set; }
    public string ClsYr{ get; set; }
    public string Tribe{ get; set; }
    public string Occup{ get; set; }
    public string Indust{ get; set; }
    public string Bmi{ get; set; }
    public string Ethnic_Mexican{ get; set; }
    public string Ethnic_PR{ get; set; }
    public string Ethnic_Cuban{ get; set; }
    public string Ethnic_Other{ get; set; }
    public string Drug_IV{ get; set; }
    public string Dod_MO{ get; set; }
    public string Dod_DY{ get; set; }
    public string Dod_YR{ get; set; }
    public string Dod_TM{ get; set; }
    public string Dob_MO{ get; set; }
    public string Dob_DY{ get; set; }
    public string Dob_YR{ get; set; }
    public string DTerm_MO{ get; set; }
    public string DTerm_DY{ get; set; }
    public string DTerm_YR{ get; set; }
    public string DTerm_TM{ get; set; }
    public string Review_1_By{ get; set; }
    public string Review_1_On{ get; set; }
    public string Review_1_Remarks{ get; set; }
    public string Remarks{ get; set; }
    public string Update_Remarks{ get; set; }
    public string Pdf_Link{ get; set; }
    public string Pdf_Steve_Link{ get; set; }
    public string Review_2_By{ get; set; }
    public string Review_2_On{ get; set; }
    public string Review_2_Remarks{ get; set; }
    public string dc_info_complete{ get; set; }
    public string dc_info_remarks{ get; set; }
    public string mmria_used{ get; set; }
    public string mmria_used_remarks{ get; set; }
    public string agreement_status{ get; set; }
    public string agreement_remarks{ get; set; }
    public string transprt_dc{ get; set; }
    public string manner_dc{ get; set; }
    public string cod1a_dc{ get; set; }
    public string interval1a_dc{ get; set; }
    public string cod1b_dc{ get; set; }
    public string interval1b_dc{ get; set; }
    public string cod1c_dc{ get; set; }
    public string interval1c_dc{ get; set; }
    public string cod1d_dc{ get; set; }
    public string interval1d_dc{ get; set; }
    public string othercondition_dc{ get; set; }
    public string man_uc_dc{ get; set; }
    public string acme_uc_dc{ get; set; }
    public string eac_dc{ get; set; }
    public string rac_dc{ get; set; }
    public string howinj_dc{ get; set; }









}