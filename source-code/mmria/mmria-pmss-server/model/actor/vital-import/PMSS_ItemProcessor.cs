using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Akka.Actor;
using System.Globalization;

using mmria.pmss.server.Controllers;

namespace mmria.pmss.services.vitalsimport;

/*
 Other

Excel_Field_Name	Metadata_Path
batch_name	app/tracking/admin_info/batch_name
fileno_dc	app/tracking/admin_info/fileno_dc
fileno_bc	app/tracking/admin_info/fileno_bc
fileno_fdc	app/tracking/admin_info/fileno_fdc
year_birthorfetaldeath	app/tracking/admin_info/year_birthorfetaldeath
pregcb_match	app/vro_case_determnation/cdc_case_matching_results/pregcb_match
literalcod_match	app/vro_case_determnation/cdc_case_matching_results/literalcod_match
icd10_match	app/vro_case_determnation/cdc_case_matching_results/icd10_match
bc_det_match	app/vro_case_determnation/cdc_case_matching_results/bc_det_match
fdc_det_match	app/vro_case_determnation/cdc_case_matching_results/fdc_det_match
bc_prob_match	app/vro_case_determnation/cdc_case_matching_results/bc_prob_match
fdc_prob_match	app/vro_case_determnation/cdc_case_matching_results/fdc_prob_match
vro_resolution_status	app/vro_case_determnation/vro_update/vro_resolution_status
vro_resolution_remarks	app/vro_case_determnation/vro_update/vro_resolution_remarks
Year	app/tracking/admin_info/track_year
CaseNo	app/tracking/admin_info/pmssno
PMSS_State_Code	app/tracking/admin_info/jurisdiction
Jurisdiction	NOT MAPPED
Jurisdiction_Name	NOT MAPPED
Status	app/tracking/admin_info/status
AmssNo	app/tracking/q1/amssno
AmssRel	app/tracking/q1/amssrel
Dc	app/tracking/death_certificate_number
Dod	app/tracking/date_of_death/dod
SourcNot	app/tracking/sourcnot
DcFile	app/tracking/dcfile
LbFile	app/tracking/lbfile
PregStat	app/tracking/q7/pregstat
PcbTime	app/tracking/q7/pcbtime
StatDth	app/tracking/statdth
StatRes	app/tracking/q9/statres
ResZip	app/tracking/q9/reszip
ZipSrce	app/tracking/q9/zipsrce
County	app/tracking/q9/county
CntySrce	app/tracking/q9/cntysrce
MAge	app/demographic/mage
Dob	app/tracking/date_of_death/dob
AgeDif	app/tracking/date_of_death/agedif
Race	app/demographic/q12/race
Race_Oth	app/demographic/q12/group/race_oth
Race_Source	app/demographic/q12/group/race_source
Race_OMB	app/demographic/q12/group/race_omb
Race_White	app/demographic/q12/group/race_white
Race_Black	app/demographic/q12/group/race_black
Race_AmIndAlkNat	app/demographic/q12/group/race_amindalknat
Race_AsianIndian	app/demographic/q12/group/race_asianindian
Race_Chinese	app/demographic/q12/group/race_chinese
Race_Filipino	app/demographic/q12/group/race_filipino
Race_Japanese	app/demographic/q12/group/race_japanese
Race_Korean	app/demographic/q12/group/race_korean
Race_Vietnamese	app/demographic/q12/group/race_vietnamese
Race_OtherAsian	app/demographic/q12/group/race_otherasian
Race_NativeHawaiian	app/demographic/q12/group/race_nativehawaiian
Race_GuamCham	app/demographic/q12/group/race_guamcham
Race_Samoan	app/demographic/q12/group/race_samoan
Race_OtherPacific	app/demographic/q12/group/race_otherpacific
Race_Other	app/demographic/q12/group/race_other
Race_NotSpecified	app/demographic/q12/group/race_notspecified
HispOrg	app/demographic/q12/ethnicity/hisporg
Hisp_Oth	app/demographic/q12/ethnicity/hisp_oth
MatBplc	app/demographic/q12/matbplc
MatBplc_US	app/demographic/q12/matbplc_us
MatBplc_Else	app/demographic/q12/matbplc_else
MarStat	app/demographic/marstat
EducaTn	app/demographic/q14/educatn
PlaceDth	app/demographic/placedth
Pnc	app/demographic/pnc
Autopsy3	app/demographic/autopsy3
Height	app/demographic/height
WtPrePrg	app/demographic/wtpreprg
PrevLb	app/demographic/prevlb
PrvOthPg	app/demographic/prvothpg
PymtSrc	app/demographic/pymtsrc
Wic	app/demographic/wic
OutIndx	app/outcome/outindx
MultGest	app/outcome/multgest
TermProc	app/outcome/q25/termproc
TermPro1	app/outcome/q25/termpro1
TermPro2	app/outcome/q25/termpro2
GestWk	app/outcome/gestwk
DTerm	app/outcome/dterm_grp/dterm
DayDif	app/outcome/dterm_grp/daydif
CdcCod	app/cause_of_death/q28/cdccod
Cod	app/cause_of_death/q28/cod
AssoC1	app/cause_of_death/q29/assoc1
Acon1	app/cause_of_death/q29/acon1
AssoC2	app/cause_of_death/q30/assoc2
Acon2	app/cause_of_death/q30/acon2
AssoC3	app/cause_of_death/q31/assoc3
Acon3	app/cause_of_death/q31/acon3
Injury	app/cause_of_death/injury
Drug_1	app/cause_of_death/q33/drug_1
Drug_2	app/cause_of_death/q33/drug_2
Drug_3	app/cause_of_death/q33/drug_3
Class	app/cause_of_death/class
Coder	app/cause_of_death/coder
ClsMo	app/cause_of_death/clsmo
ClsYr	app/cause_of_death/clsyr
Tribe	app/demographic/q12/group/tribe
Occup	app/demographic/q14/occup
Indust	app/demographic/q14/indust
Bmi	app/demographic/bmi
Ethnic_Mexican	app/demographic/q12/ethnicity/ethnic1_mex
Ethnic_PR	app/demographic/q12/ethnicity/ethnic2_pr
Ethnic_Cuban	app/demographic/q12/ethnicity/ethnic3_cub
Ethnic_Other	app/demographic/q12/ethnicity/ethnic4_other
Drug_IV	app/cause_of_death/q33/drug_iv
Dod_MO	app/tracking/date_of_death/month
Dod_DY	app/tracking/date_of_death/day
Dod_YR	app/tracking/date_of_death/year
Dod_TM	app/tracking/date_of_death/time_of_death
Dob_MO	app/tracking/date_of_birth/month
Dob_DY	app/tracking/date_of_birth /day
Dob_YR	app/tracking/date_of_birth /year
DTerm_MO	app/outcome/dterm_grp/dterm/dterm_mo
DTerm_DY	app/outcome/dterm_grp/dterm/dterm_dy
DTerm_YR	app/outcome/dterm_grp/dterm/dterm_yr
DTerm_TM	app/outcome/dterm_grp/dterm/dterm_tm
Review_1_By	app/preparer_remarks/preparer_grp/review_1_by
Review_1_On	app/preparer_remarks/preparer_grp/review_1_on
Review_1_Remarks	app/preparer_remarks/preparer_grp/review_1_remarks
Remarks	app/preparer_remarks/remarks_grp/remarks
Update_Remarks	app/preparer_remarks/remarks_grp/update_remarks
Pdf_Link	app/preparer_remarks/pdf_grp/pdf_link
Pdf_Steve_Link	app/preparer_remarks/pdf_grp/pdf_steve_link
Review_2_By	app/committee_review/reviewer_grp/review_2_by
Review_2_On	app/committee_review/reviewer_grp/review_2_on
Review_2_Remarks	app/committee_review/reviewer_grp/review_2_remarks
dc_info_complete	app/committee_review/rev_assessment_grp/dc_info_complete
dc_info_remarks	app/committee_review/rev_assessment_grp/dc_info_remarks
mmria_used	app/committee_review/rev_assessment_grp/mmria_used
mmria_used_remarks	app/committee_review/rev_assessment_grp/mmria_used_remarks
agreement_status	app/committee_review/agreement_grp/agreement_status
agreement_remarks	app/committee_review/agreement_grp/agreement_remarks
transprt_dc	app/ije_dc/death_info/transprt_dc
manner_dc	app/ije_dc/cause_details/manner_dc
cod1a_dc	app/ije_dc/cause_details/cod1a_dc
interval1a_dc	app/ije_dc/cause_details/interval1a_dc
cod1b_dc	app/ije_dc/cause_details/cod1b_dc
interval1b_dc	app/ije_dc/cause_details/interval1b_dc
cod1c_dc	app/ije_dc/cause_details/cod1c_dc
interval1c_dc	app/ije_dc/cause_details/interval1c_dc
cod1d_dc	app/ije_dc/cause_details/cod1d_dc
interval1d_dc	app/ije_dc/cause_details/interval1d_dc
othercondition_dc	app/ije_dc/cause_details/othercondition_dc
man_uc_dc	app/ije_dc/cause_details/man_uc_dc
acme_uc_dc	app/ije_dc/cause_details/acme_uc_dc
eac_dc	app/ije_dc/cause_details/eac_dc
rac_dc	app/ije_dc/cause_details/rac_dc
howinj_dc	app/ije_dc/injury_details/howinj_dc


*/

/*

All 

Excel_Field_Name	Metadata_Path
batch_name	app/tracking/admin_info/batch_name
fileno_dc	app/tracking/admin_info/fileno_dc
fileno_bc	app/tracking/admin_info/fileno_bc
fileno_fdc	app/tracking/admin_info/fileno_fdc
year_birthorfetaldeath	app/tracking/admin_info/year_birthorfetaldeath
pregcb_match	app/vro_case_determnation/cdc_case_matching_results/pregcb_match
literalcod_match	app/vro_case_determnation/cdc_case_matching_results/literalcod_match
icd10_match	app/vro_case_determnation/cdc_case_matching_results/icd10_match
bc_det_match	app/vro_case_determnation/cdc_case_matching_results/bc_det_match
fdc_det_match	app/vro_case_determnation/cdc_case_matching_results/fdc_det_match
bc_prob_match	app/vro_case_determnation/cdc_case_matching_results/bc_prob_match
fdc_prob_match	app/vro_case_determnation/cdc_case_matching_results/fdc_prob_match
vro_resolution_status	app/vro_case_determnation/vro_update/vro_resolution_status
vro_resolution_remarks	app/vro_case_determnation/vro_update/vro_resolution_remarks
Year	app/tracking/admin_info/track_year
CaseNo	app/tracking/admin_info/pmssno
PMSS_State_Code	app/tracking/admin_info/jurisdiction
Jurisdiction	NOT MAPPED
Jurisdiction_Name	NOT MAPPED
Status	app/tracking/admin_info/status
AmssNo	app/tracking/q1/amssno
AmssRel	app/tracking/q1/amssrel
Dc	app/tracking/death_certificate_number
Dod	app/tracking/date_of_death/dod
SourcNot	app/tracking/sourcnot
DcFile	app/tracking/dcfile
LbFile	app/tracking/lbfile
PregStat	app/tracking/q7/pregstat
PcbTime	app/tracking/q7/pcbtime
StatDth	app/tracking/statdth
StatRes	app/tracking/q9/statres
ResZip	app/tracking/q9/reszip
ZipSrce	app/tracking/q9/zipsrce
County	app/tracking/q9/county
CntySrce	app/tracking/q9/cntysrce
MAge	app/demographic/mage
Dob	app/tracking/date_of_death/dob
AgeDif	app/tracking/date_of_death/agedif
Race	app/demographic/q12/race
Race_Oth	app/demographic/q12/group/race_oth
Race_Source	app/demographic/q12/group/race_source
Race_OMB	app/demographic/q12/group/race_omb
Race_White	app/demographic/q12/group/race_white
Race_Black	app/demographic/q12/group/race_black
Race_AmIndAlkNat	app/demographic/q12/group/race_amindalknat
Race_AsianIndian	app/demographic/q12/group/race_asianindian
Race_Chinese	app/demographic/q12/group/race_chinese
Race_Filipino	app/demographic/q12/group/race_filipino
Race_Japanese	app/demographic/q12/group/race_japanese
Race_Korean	app/demographic/q12/group/race_korean
Race_Vietnamese	app/demographic/q12/group/race_vietnamese
Race_OtherAsian	app/demographic/q12/group/race_otherasian
Race_NativeHawaiian	app/demographic/q12/group/race_nativehawaiian
Race_GuamCham	app/demographic/q12/group/race_guamcham
Race_Samoan	app/demographic/q12/group/race_samoan
Race_OtherPacific	app/demographic/q12/group/race_otherpacific
Race_Other	app/demographic/q12/group/race_other
Race_NotSpecified	app/demographic/q12/group/race_notspecified
HispOrg	app/demographic/q12/ethnicity/hisporg
Hisp_Oth	app/demographic/q12/ethnicity/hisp_oth
MatBplc	app/demographic/q12/matbplc
MatBplc_US	app/demographic/q12/matbplc_us
MatBplc_Else	app/demographic/q12/matbplc_else
MarStat	app/demographic/marstat
EducaTn	app/demographic/q14/educatn
PlaceDth	app/demographic/placedth
Pnc	app/demographic/pnc
Autopsy3	app/demographic/autopsy3
Height	app/demographic/height
WtPrePrg	app/demographic/wtpreprg
PrevLb	app/demographic/prevlb
PrvOthPg	app/demographic/prvothpg
PymtSrc	app/demographic/pymtsrc
Wic	app/demographic/wic
OutIndx	app/outcome/outindx
MultGest	app/outcome/multgest
TermProc	app/outcome/q25/termproc
TermPro1	app/outcome/q25/termpro1
TermPro2	app/outcome/q25/termpro2
GestWk	app/outcome/gestwk
DTerm	app/outcome/dterm_grp/dterm
DayDif	app/outcome/dterm_grp/daydif
CdcCod	app/cause_of_death/q28/cdccod
Cod	app/cause_of_death/q28/cod
AssoC1	app/cause_of_death/q29/assoc1
Acon1	app/cause_of_death/q29/acon1
AssoC2	app/cause_of_death/q30/assoc2
Acon2	app/cause_of_death/q30/acon2
AssoC3	app/cause_of_death/q31/assoc3
Acon3	app/cause_of_death/q31/acon3
Injury	app/cause_of_death/injury
Drug_1	app/cause_of_death/q33/drug_1
Drug_2	app/cause_of_death/q33/drug_2
Drug_3	app/cause_of_death/q33/drug_3
Class	app/cause_of_death/class
Coder	app/cause_of_death/coder
ClsMo	app/cause_of_death/clsmo
ClsYr	app/cause_of_death/clsyr
Tribe	app/demographic/q12/group/tribe
Occup	app/demographic/q14/occup
Indust	app/demographic/q14/indust
Bmi	app/demographic/bmi
Ethnic_Mexican	app/demographic/q12/ethnicity/ethnic1_mex
Ethnic_PR	app/demographic/q12/ethnicity/ethnic2_pr
Ethnic_Cuban	app/demographic/q12/ethnicity/ethnic3_cub
Ethnic_Other	app/demographic/q12/ethnicity/ethnic4_other
Drug_IV	app/cause_of_death/q33/drug_iv
Dod_MO	app/tracking/date_of_death/month
Dod_DY	app/tracking/date_of_death/day
Dod_YR	app/tracking/date_of_death/year
Dod_TM	app/tracking/date_of_death/time_of_death
Dob_MO	app/tracking/date_of_birth/month
Dob_DY	app/tracking/date_of_birth /day
Dob_YR	app/tracking/date_of_birth /year
DTerm_MO	app/outcome/dterm_grp/dterm/dterm_mo
DTerm_DY	app/outcome/dterm_grp/dterm/dterm_dy
DTerm_YR	app/outcome/dterm_grp/dterm/dterm_yr
DTerm_TM	app/outcome/dterm_grp/dterm/dterm_tm
Review_1_By	app/preparer_remarks/preparer_grp/review_1_by
Review_1_On	app/preparer_remarks/preparer_grp/review_1_on
Review_1_Remarks	app/preparer_remarks/preparer_grp/review_1_remarks
Remarks	app/preparer_remarks/remarks_grp/remarks
Update_Remarks	app/preparer_remarks/remarks_grp/update_remarks
Pdf_Link	app/preparer_remarks/pdf_grp/pdf_link
Pdf_Steve_Link	app/preparer_remarks/pdf_grp/pdf_steve_link
Review_2_By	app/committee_review/reviewer_grp/review_2_by
Review_2_On	app/committee_review/reviewer_grp/review_2_on
Review_2_Remarks	app/committee_review/reviewer_grp/review_2_remarks
dc_info_complete	app/committee_review/rev_assessment_grp/dc_info_complete
dc_info_remarks	app/committee_review/rev_assessment_grp/dc_info_remarks
mmria_used	app/committee_review/rev_assessment_grp/mmria_used
mmria_used_remarks	app/committee_review/rev_assessment_grp/mmria_used_remarks
agreement_status	app/committee_review/agreement_grp/agreement_status
agreement_remarks	app/committee_review/agreement_grp/agreement_remarks
fileno_dc	app/ije_dc/file_info/fileno_dc
auxno_dc	app/ije_dc/file_info/auxno_dc
replace_dc	app/ije_dc/file_info/replace_dc
void_dc	app/ije_dc/file_info/void_dc
dod_mo_dc	app/ije_dc/death_info/dod_mo_dc
dod_dy_dc	app/ije_dc/death_info/dod_dy_dc
dod_yr_dc	app/ije_dc/death_info/dod_yr_dc
tod_dc	app/ije_dc/death_info/tod_dc
dplace_dc	app/ije_dc/death_info/dplace_dc
citytext_d_dc	app/ije_dc/death_info/citytext_d_dc
countytext_d_dc	app/ije_dc/death_info/countytext_d_dc
statetext_d_dc	app/ije_dc/death_info/statetext_d_dc
zip9_d_dc	app/ije_dc/death_info/zip9_d_dc
preg_dc	app/ije_dc/death_info/preg_dc
inact_dc	app/ije_dc/death_info/inact_dc
autop_dc	app/ije_dc/death_info/autop_dc
autopf_dc	app/ije_dc/death_info/autopf_dc
transprt_dc	app/ije_dc/death_info/transprt_dc
tobac_dc	app/ije_dc/death_info/tobac_dc
manner_dc	app/ije_dc/cause_details/manner_dc
cod1a_dc	app/ije_dc/cause_details/cod1a_dc
interval1a_dc	app/ije_dc/cause_details/interval1a_dc
cod1b_dc	app/ije_dc/cause_details/cod1b_dc
interval1b_dc	app/ije_dc/cause_details/interval1b_dc
cod1c_dc	app/ije_dc/cause_details/cod1c_dc
interval1c_dc	app/ije_dc/cause_details/interval1c_dc
cod1d_dc	app/ije_dc/cause_details/cod1d_dc
interval1d_dc	app/ije_dc/cause_details/interval1d_dc
othercondition_dc	app/ije_dc/cause_details/othercondition_dc
man_uc_dc	app/ije_dc/cause_details/man_uc_dc
acme_uc_dc	app/ije_dc/cause_details/acme_uc_dc
eac_dc	app/ije_dc/cause_details/eac_dc
rac_dc	app/ije_dc/cause_details/rac_dc
doi_mo_dc	app/ije_dc/injury_details/doi_mo_dc
doi_dy_dc	app/ije_dc/injury_details/doi_dy_dc
doi_yr_dc	app/ije_dc/injury_details/doi_yr_dc
toi_hr_dc	app/ije_dc/injury_details/toi_hr_dc
howinj_dc	app/ije_dc/injury_details/howinj_dc
workinj_dc	app/ije_dc/injury_details/workinj_dc
bplace_cnt_dc	app/ije_dc/birthplace_mother/bplace_cnt_dc
bplace_st_dc	app/ije_dc/birthplace_mother/bplace_st_dc
cityc_dc	app/ije_dc/birthplace_mother/cityc_dc
citytext_r_dc	app/ije_dc/residence_mother/citytext_r_dc
countyc_dc	app/ije_dc/residence_mother/countyc_dc
countrytext_r_dc	app/ije_dc/residence_mother/countrytext_r_dc
statec_dc	app/ije_dc/residence_mother/statec_dc
statetext_r_dc	app/ije_dc/residence_mother/statetext_r_dc
zip9_r_dc	app/ije_dc/residence_mother/zip9_r_dc
dob_mo_dc	app/ije_dc/demog_details/dob_mo_dc
dob_dy_dc	app/ije_dc/demog_details/dob_dy_dc
dob_yr_dc	app/ije_dc/demog_details/dob_yr_dc
agetype_dc	app/ije_dc/demog_details/agetype_dc
age_dc	app/ije_dc/demog_details/age_dc
sex_dc	app/ije_dc/demog_details/sex_dc
marital_dc	app/ije_dc/demog_details/marital_dc
deduc_dc	app/ije_dc/demog_details/deduc_dc
indust_dc	app/ije_dc/demog_details/indust_dc
occup_dc	app/ije_dc/demog_details/occup_dc
armedf_dc	app/ije_dc/demog_details/armedf_dc
dethnic1_dc	app/ije_dc/demog_details/dethnic1_dc
dethnic2_dc	app/ije_dc/demog_details/dethnic2_dc
dethnic3_dc	app/ije_dc/demog_details/dethnic3_dc
dethnic4_dc	app/ije_dc/demog_details/dethnic4_dc
dethnic5_dc	app/ije_dc/demog_details/dethnic5_dc
race1_dc	app/ije_dc/demog_details/race1_dc
race2_dc	app/ije_dc/demog_details/race2_dc
race3_dc	app/ije_dc/demog_details/race3_dc
race4_dc	app/ije_dc/demog_details/race4_dc
race5_dc	app/ije_dc/demog_details/race5_dc
race6_dc	app/ije_dc/demog_details/race6_dc
race7_dc	app/ije_dc/demog_details/race7_dc
race8_dc	app/ije_dc/demog_details/race8_dc
race9_dc	app/ije_dc/demog_details/race9_dc
race10_dc	app/ije_dc/demog_details/race10_dc
race11_dc	app/ije_dc/demog_details/race11_dc
race12_dc	app/ije_dc/demog_details/race12_dc
race13_dc	app/ije_dc/demog_details/race13_dc
race14_dc	app/ije_dc/demog_details/race14_dc
race15_dc	app/ije_dc/demog_details/race15_dc
race16_dc	app/ije_dc/demog_details/race16_dc
race17_dc	app/ije_dc/demog_details/race17_dc
race18_dc	app/ije_dc/demog_details/race18_dc
race19_dc	app/ije_dc/demog_details/race19_dc
race20_dc	app/ije_dc/demog_details/race20_dc
race21_dc	app/ije_dc/demog_details/race21_dc
race22_dc	app/ije_dc/demog_details/race22_dc
race23_dc	app/ije_dc/demog_details/race23_dc
bstate_bc	app/ije_bc/file_info/bstate_bc
fileno_bc	app/ije_bc/file_info/fileno_bc
auxno_bc	app/ije_bc/file_info/auxno_bc
void_bc	app/ije_bc/file_info/void_bc
replace_bc	app/ije_bc/file_info/replace_bc
dwgt_bc	app/ije_bc/delivery_info/dwgt_bc
pwgt_bc	app/ije_bc/delivery_info/pwgt_bc
hft_bc	app/ije_bc/delivery_info/hft_bc
hin_bc	app/ije_bc/delivery_info/hin_bc
idob_mo_bc	app/ije_bc/delivery_info/idob_mo_bc
idob_dy_bc	app/ije_bc/delivery_info/idob_dy_bc
idob_yr_bc	app/ije_bc/delivery_info/idob_yr_bc
tb_bc	app/ije_bc/delivery_info/tb_bc
isex_bc	app/ije_bc/delivery_info/isex_bc
bwg_bc	app/ije_bc/delivery_info/bwg_bc
owgest_bc	app/ije_bc/delivery_info/owgest_bc
apgar5_bc	app/ije_bc/delivery_info/apgar5_bc
apgar10_bc	app/ije_bc/delivery_info/apgar10_bc
plur_bc	app/ije_bc/delivery_info/plur_bc
sord_bc	app/ije_bc/delivery_info/sord_bc
hosp_bc	app/ije_bc/delivery_info/hosp_bc
birth_co_bc	app/ije_bc/delivery_info/birth_co_bc
bplace_bc	app/ije_bc/delivery_info/bplace_bc
attend_bc	app/ije_bc/delivery_info/attend_bc
tran_bc	app/ije_bc/delivery_info/tran_bc
itran_bc	app/ije_bc/delivery_info/itran_bc
bfed_bc	app/ije_bc/delivery_info/bfed_bc
wic_bc	app/ije_bc/delivery_info/wic_bc
pay_bc	app/ije_bc/delivery_info/pay_bc
pres_bc	app/ije_bc/delivery_info/pres_bc
rout_bc	app/ije_bc/delivery_info/rout_bc
iliv_bc	app/ije_bc/delivery_info/iliv_bc
gon_bc	app/ije_bc/delivery_info/gon_bc
syph_bc	app/ije_bc/delivery_info/syph_bc
hsv_bc	app/ije_bc/delivery_info/hsv_bc
cham_bc	app/ije_bc/delivery_info/cham_bc
hepb_bc	app/ije_bc/delivery_info/hepb_bc
hepc_bc	app/ije_bc/delivery_info/hepc_bc
cerv_bc	app/ije_bc/delivery_info/cerv_bc
toc_bc	app/ije_bc/delivery_info/toc_bc
ecvs_bc	app/ije_bc/delivery_info/ecvs_bc
ecvf_bc	app/ije_bc/delivery_info/ecvf_bc
prom_bc	app/ije_bc/delivery_info/prom_bc
pric_bc	app/ije_bc/delivery_info/pric_bc
prol_bc	app/ije_bc/delivery_info/prol_bc
indl_bc	app/ije_bc/delivery_info/indl_bc
augl_bc	app/ije_bc/delivery_info/augl_bc
nvpr_bc	app/ije_bc/delivery_info/nvpr_bc
ster_bc	app/ije_bc/delivery_info/ster_bc
antb_bc	app/ije_bc/delivery_info/antb_bc
chor_bc	app/ije_bc/delivery_info/chor_bc
mecs_bc	app/ije_bc/delivery_info/mecs_bc
fint_bc	app/ije_bc/delivery_info/fint_bc
esan_bc	app/ije_bc/delivery_info/esan_bc
tlab_bc	app/ije_bc/delivery_info/tlab_bc
mtr_bc	app/ije_bc/delivery_info/mtr_bc
plac_bc	app/ije_bc/delivery_info/plac_bc
rut_bc	app/ije_bc/delivery_info/rut_bc
uhys_bc	app/ije_bc/delivery_info/uhys_bc
aint_bc	app/ije_bc/delivery_info/aint_bc
uopr_bc	app/ije_bc/delivery_info/uopr_bc
aven1_bc	app/ije_bc/delivery_info/aven1_bc
aven6_bc	app/ije_bc/delivery_info/aven6_bc
nicu_bc	app/ije_bc/delivery_info/nicu_bc
surf_bc	app/ije_bc/delivery_info/surf_bc
anti_bc	app/ije_bc/delivery_info/anti_bc
seiz_bc	app/ije_bc/delivery_info/seiz_bc
binj_bc	app/ije_bc/delivery_info/binj_bc
anen_bc	app/ije_bc/delivery_info/anen_bc
minsb_bc	app/ije_bc/delivery_info/minsb_bc
cchd_bc	app/ije_bc/delivery_info/cchd_bc
cdh_bc	app/ije_bc/delivery_info/cdh_bc
omph_bc	app/ije_bc/delivery_info/omph_bc
gast_bc	app/ije_bc/delivery_info/gast_bc
limb_bc	app/ije_bc/delivery_info/limb_bc
cl_bc	app/ije_bc/delivery_info/cl_bc
cp_bc	app/ije_bc/delivery_info/cp_bc
dowt_bc	app/ije_bc/delivery_info/dowt_bc
cdit_bc	app/ije_bc/delivery_info/cdit_bc
hypo_bc	app/ije_bc/delivery_info/hypo_bc
dlmp_mo_bc	app/ije_bc/previous_info/dlmp_mo_bc
dlmp_dy_bc	app/ije_bc/previous_info/dlmp_dy_bc
dlmp_yr_bc	app/ije_bc/previous_info/dlmp_yr_bc
dofp_mo_bc	app/ije_bc/previous_info/dofp_mo_bc
dofp_dy_bc	app/ije_bc/previous_info/dofp_dy_bc
dofp_yr_bc	app/ije_bc/previous_info/dofp_yr_bc
dolp_mo_bc	app/ije_bc/previous_info/dolp_mo_bc
dolp_dy_bc	app/ije_bc/previous_info/dolp_dy_bc
dolp_yr_bc	app/ije_bc/previous_info/dolp_yr_bc
nprev_bc	app/ije_bc/previous_info/nprev_bc
plbl_bc	app/ije_bc/previous_info/plbl_bc
plbd_bc	app/ije_bc/previous_info/plbd_bc
popo_bc	app/ije_bc/previous_info/popo_bc
mllb_bc	app/ije_bc/previous_info/mllb_bc
yllb_bc	app/ije_bc/previous_info/yllb_bc
mopo_bc	app/ije_bc/previous_info/mopo_bc
yopo_bc	app/ije_bc/previous_info/yopo_bc
cigpn_bc	app/ije_bc/previous_info/cigpn_bc
cigfn_bc	app/ije_bc/previous_info/cigfn_bc
cigsn_bc	app/ije_bc/previous_info/cigsn_bc
cigln_bc	app/ije_bc/previous_info/cigln_bc
pdiab_bc	app/ije_bc/previous_info/pdiab_bc
gdiab_bc	app/ije_bc/previous_info/gdiab_bc
phype_bc	app/ije_bc/previous_info/phype_bc
ghype_bc	app/ije_bc/previous_info/ghype_bc
ppb_bc	app/ije_bc/previous_info/ppb_bc
ppo_bc	app/ije_bc/previous_info/ppo_bc
inft_bc	app/ije_bc/previous_info/inft_bc
pces_bc	app/ije_bc/previous_info/pces_bc
npces_bc	app/ije_bc/previous_info/npces_bc
ehype_bc	app/ije_bc/previous_info/ehype_bc
inft_drg_bc	app/ije_bc/previous_info/inft_drg_bc
inft_art_bc	app/ije_bc/previous_info/inft_art_bc
citytext_bc	app/ije_bc/residence_mother/citytext_bc
countytxt_bc	app/ije_bc/residence_mother/countytxt_bc
statetxt_bc	app/ije_bc/residence_mother/statetxt_bc
zipcode_bc	app/ije_bc/residence_mother/zipcode_bc
mbplace_st_ter_tx_bc	app/ije_bc/demog_details/mbplace_st_ter_tx_bc
mbplace_cntry_tx_bc	app/ije_bc/demog_details/mbplace_cntry_tx_bc
mager_bc	app/ije_bc/demog_details/mager_bc
mdob_mo_bc	app/ije_bc/demog_details/mdob_mo_bc
mdob_dy_bc	app/ije_bc/demog_details/mdob_dy_bc
mdob_yr_bc	app/ije_bc/demog_details/mdob_yr_bc
marn_bc	app/ije_bc/demog_details/marn_bc
ackn_bc	app/ije_bc/demog_details/ackn_bc
meduc_bc	app/ije_bc/demog_details/meduc_bc
mom_in_t_bc	app/ije_bc/demog_details/mom_in_t_bc
mom_oc_t_bc	app/ije_bc/demog_details/mom_oc_t_bc
methnic1_bc	app/ije_bc/demog_details/methnic1_bc
methnic2_bc	app/ije_bc/demog_details/methnic2_bc
methnic3_bc	app/ije_bc/demog_details/methnic3_bc
methnic4_bc	app/ije_bc/demog_details/methnic4_bc
methnic5_bc	app/ije_bc/demog_details/methnic5_bc
mrace1_bc	app/ije_bc/demog_details/mrace1_bc
mrace2_bc	app/ije_bc/demog_details/mrace2_bc
mrace3_bc	app/ije_bc/demog_details/mrace3_bc
mrace4_bc	app/ije_bc/demog_details/mrace4_bc
mrace5_bc	app/ije_bc/demog_details/mrace5_bc
mrace6_bc	app/ije_bc/demog_details/mrace6_bc
mrace7_bc	app/ije_bc/demog_details/mrace7_bc
mrace8_bc	app/ije_bc/demog_details/mrace8_bc
mrace9_bc	app/ije_bc/demog_details/mrace9_bc
mrace10_bc	app/ije_bc/demog_details/mrace10_bc
mrace11_bc	app/ije_bc/demog_details/mrace11_bc
mrace12_bc	app/ije_bc/demog_details/mrace12_bc
mrace13_bc	app/ije_bc/demog_details/mrace13_bc
mrace14_bc	app/ije_bc/demog_details/mrace14_bc
mrace15_bc	app/ije_bc/demog_details/mrace15_bc
mrace16_bc	app/ije_bc/demog_details/mrace16_bc
mrace17_bc	app/ije_bc/demog_details/mrace17_bc
mrace18_bc	app/ije_bc/demog_details/mrace18_bc
mrace19_bc	app/ije_bc/demog_details/mrace19_bc
mrace20_bc	app/ije_bc/demog_details/mrace20_bc
mrace21_bc	app/ije_bc/demog_details/mrace21_bc
mrace22_bc	app/ije_bc/demog_details/mrace22_bc
mrace23_bc	app/ije_bc/demog_details/mrace23_bc
fager_bc	app/ije_bc/demog_details/fager_bc
dad_in_t_ bc	app/ije_bc/demog_details/dad_in_t_bc
dad_oc_t_bc	app/ije_bc/demog_details/dad_oc_t_bc
fbplacd_st_ter_c_bc	app/ije_bc/demog_details/fbplacd_st_ter_c_bc
fbplace_cnt_c_bc	app/ije_bc/demog_details/fbplace_cnt_c_bc
dstate_fdc	app/ije_fetaldc/file_info/dstate_fdc
fileno_fdc	app/ije_fetaldc/file_info/fileno_fdc
auxno_fdc	app/ije_fetaldc/file_info/auxno_fdc
void_fdc	app/ije_fetaldc/file_info/void_fdc
replace_fdc	app/ije_fetaldc/file_info/replace_fdc
fdod_mo_fdc	app/ije_fetaldc/delivery_info/fdod_mo_fdc
fdod_dy_fdc	app/ije_fetaldc/delivery_info/fdod_dy_fdc
fdod_yr_fdc	app/ije_fetaldc/delivery_info/fdod_yr_fdc
td_fdc	app/ije_fetaldc/delivery_info/td_fdc
dwgt_fdc	app/ije_fetaldc/delivery_info/dwgt_fdc
pwgt_fdc	app/ije_fetaldc/delivery_info/pwgt_fdc
hft_fdc	app/ije_fetaldc/delivery_info/hft_fdc
hin_fdc	app/ije_fetaldc/delivery_info/hin_fdc
fsex_fdc	app/ije_fetaldc/delivery_info/fsex_fdc
fwg_fdc	app/ije_fetaldc/delivery_info/fwg_fdc
owgest_fdc	app/ije_fetaldc/delivery_info/owgest_fdc
plur_fdc	app/ije_fetaldc/delivery_info/plur_fdc
sord_fdc	app/ije_fetaldc/delivery_info/sord_fdc
hosp_d_fdc	app/ije_fetaldc/delivery_info/hosp_d_fdc
cnty_d_fdc	app/ije_fetaldc/delivery_info/cnty_d_fdc
city_d_fdc	app/ije_fetaldc/delivery_info/city_d_fdc
attend_fdc	app/ije_fetaldc/delivery_info/attend_fdc
tran_fdc	app/ije_fetaldc/delivery_info/tran_fdc
wic_fdc	app/ije_fetaldc/delivery_info/wic_fdc
pres_fdc	app/ije_fetaldc/delivery_info/pres_fdc
rout_fdc	app/ije_fetaldc/delivery_info/rout_fdc
gon_fdc	app/ije_fetaldc/delivery_info/gon_fdc
syph_fdc	app/ije_fetaldc/delivery_info/syph_fdc
hsv_fdc	app/ije_fetaldc/delivery_info/hsv_fdc
cham_fdc	app/ije_fetaldc/delivery_info/cham_fdc
lm_fdc	app/ije_fetaldc/delivery_info/lm_fdc
gbs_fdc	app/ije_fetaldc/delivery_info/gbs_fdc
cmv_fdc	app/ije_fetaldc/delivery_info/cmv_fdc
b19_fdc	app/ije_fetaldc/delivery_info/b19_fdc
toxo_fdc	app/ije_fetaldc/delivery_info/toxo_fdc
hsv1_fdc	app/ije_fetaldc/delivery_info/hsv1_fdc
hiv_fdc	app/ije_fetaldc/delivery_info/hiv_fdc
tlab_fdc	app/ije_fetaldc/delivery_info/tlab_fdc
otheri_fdc	app/ije_fetaldc/delivery_info/otheri_fdc
mtr_fdc	app/ije_fetaldc/delivery_info/mtr_fdc
plac_fdc	app/ije_fetaldc/delivery_info/plac_fdc
rut_fdc	app/ije_fetaldc/delivery_info/rut_fdc
uhys_fdc	app/ije_fetaldc/delivery_info/uhys_fdc
aint_fdc	app/ije_fetaldc/delivery_info/aint_fdc
uopr_fdc	app/ije_fetaldc/delivery_info/uopr_fdc
anen_fdc	app/ije_fetaldc/delivery_info/anen_fdc
mnsb_fdc	app/ije_fetaldc/delivery_info/mnsb_fdc
cchd_fdc	app/ije_fetaldc/delivery_info/cchd_fdc
cdh_fdc	app/ije_fetaldc/delivery_info/cdh_fdc
omph_fdc	app/ije_fetaldc/delivery_info/omph_fdc
gast_fdc	app/ije_fetaldc/delivery_info/gast_fdc
limb_fdc	app/ije_fetaldc/delivery_info/limb_fdc
cl_fdc	app/ije_fetaldc/delivery_info/cl_fdc
caf_fdc	app/ije_fetaldc/delivery_info/caf_fdc
dowt_fdc	app/ije_fetaldc/delivery_info/dowt_fdc
cdit_fdc	app/ije_fetaldc/delivery_info/cdit_fdc
hypo_fdc	app/ije_fetaldc/delivery_info/hypo_fdc
cod18a1_fdc	app/ije_fetaldc/condition_cause/cod18a1_fdc
cod18a2_fdc	app/ije_fetaldc/condition_cause/cod18a2_fdc
cod18a3_fdc	app/ije_fetaldc/condition_cause/cod18a3_fdc
cod18a4_fdc	app/ije_fetaldc/condition_cause/cod18a4_fdc
cod18a5_fdc	app/ije_fetaldc/condition_cause/cod18a5_fdc
cod18a6_fdc	app/ije_fetaldc/condition_cause/cod18a6_fdc
cod18a7_fdc	app/ije_fetaldc/condition_cause/cod18a7_fdc
cod18a8_fdc	app/ije_fetaldc/condition_cause/cod18a8_fdc
cod18a9_fdc	app/ije_fetaldc/condition_cause/cod18a9_fdc
cod18a10_fdc	app/ije_fetaldc/condition_cause/cod18a10_fdc
cod18a11_fdc	app/ije_fetaldc/condition_cause/cod18a11_fdc
cod18a12_fdc	app/ije_fetaldc/condition_cause/cod18a12_fdc
cod18a13_fdc	app/ije_fetaldc/condition_cause/cod18a13_fdc
cod18a14_fdc	app/ije_fetaldc/condition_cause/cod18a14_fdc
cod18b1_fdc	app/ije_fetaldc/condition_cause/cod18b1_fdc
cod18b2_fdc	app/ije_fetaldc/condition_cause/cod18b2_fdc
cod18b3_fdc	app/ije_fetaldc/condition_cause/cod18b3_fdc
cod18b4_fdc	app/ije_fetaldc/condition_cause/cod18b4_fdc
cod18b5_fdc	app/ije_fetaldc/condition_cause/cod18b5_fdc
cod18b6_fdc	app/ije_fetaldc/condition_cause/cod18b6_fdc
cod18b7_fdc	app/ije_fetaldc/condition_cause/cod18b7_fdc
cod18b8_fdc	app/ije_fetaldc/condition_cause/cod18b8_fdc
cod18b9_fdc	app/ije_fetaldc/condition_cause/cod18b9_fdc
cod18b10_fdc	app/ije_fetaldc/condition_cause/cod18b10_fdc
cod18b11_fdc	app/ije_fetaldc/condition_cause/cod18b11_fdc
cod18b12_fdc	app/ije_fetaldc/condition_cause/cod18b12_fdc
cod18b13_fdc	app/ije_fetaldc/condition_cause/cod18b13_fdc
cod18b14_fdc	app/ije_fetaldc/condition_cause/cod18b14_fdc
icod_fdc	app/ije_fetaldc/condition_cause/icod_fdc
ocod1_fdc	app/ije_fetaldc/condition_cause/ocod1_fdc
ocod1_fdc	app/ije_fetaldc/condition_cause/ocod2_fdc
ocod3_fdc	app/ije_fetaldc/condition_cause/ocod3_fdc
ocod4_fdc	app/ije_fetaldc/condition_cause/ocod4_fdc
ocod5_fdc	app/ije_fetaldc/condition_cause/ocod5_fdc
ocod6_fdc	app/ije_fetaldc/condition_cause/ocod6_fdc
ocod7_fdc	app/ije_fetaldc/condition_cause/ocod7_fdc
dlmp_mo_fdc	app/ije_fetaldc/previous_info/dlmp_mo_fdc
dlmp_dy_fdc	app/ije_fetaldc/previous_info/dlmp_dy_fdc
dlmp_yr_fdc	app/ije_fetaldc/previous_info/dlmp_yr_fdc
dofp_mo_fdc	app/ije_fetaldc/previous_info/dofp_mo_fdc
dofp_dy_fdc	app/ije_fetaldc/previous_info/dofp_dy_fdc
dofp_yr_fdc	app/ije_fetaldc/previous_info/dofp_yr_fdc
dolp_mo_fdc	app/ije_fetaldc/previous_info/dolp_mo_fdc
dolp_dy_fdc	app/ije_fetaldc/previous_info/dolp_dy_fdc
dolp_yr_fdc	app/ije_fetaldc/previous_info/dolp_yr_fdc
nprev_fdc	app/ije_fetaldc/previous_info/nprev_fdc
plbl_fdc	app/ije_fetaldc/previous_info/plbl_fdc
plbd_fdc	app/ije_fetaldc/previous_info/plbd_fdc
popo_fdc	app/ije_fetaldc/previous_info/popo_fdc
mllb_fdc	app/ije_fetaldc/previous_info/mllb_fdc
yllb_fdc	app/ije_fetaldc/previous_info/yllb_fdc
mopo_fdc	app/ije_fetaldc/previous_info/mopo_fdc
yopo_fdc	app/ije_fetaldc/previous_info/yopo_fdc
cigpn_fdc	app/ije_fetaldc/previous_info/cigpn_fdc
cigfn_fdc	app/ije_fetaldc/previous_info/cigfn_fdc
cigsn_fdc	app/ije_fetaldc/previous_info/cigsn_fdc
cigln_fdc	app/ije_fetaldc/previous_info/cigln_fdc
pdiab_fdc	app/ije_fetaldc/previous_info/pdiab_fdc
gdiab_fdc	app/ije_fetaldc/previous_info/gdiab_fdc
phype_fdc	app/ije_fetaldc/previous_info/phype_fdc
ghype_fdc	app/ije_fetaldc/previous_info/ghype_fdc
ppb_fdc	app/ije_fetaldc/previous_info/ppb_fdc
ppo_fdc	app/ije_fetaldc/previous_info/ppo_fdc
inft_fdc	app/ije_fetaldc/previous_info/inft_fdc
pces_fdc	app/ije_fetaldc/previous_info/pces_fdc
npces_fdc	app/ije_fetaldc/previous_info/npces_fdc
ehype_fdc	app/ije_fetaldc/previous_info/ehype_fdc
inft_drg_fdc	app/ije_fetaldc/previous_info/inft_drg_fdc
inft_art_fdc	app/ije_fetaldc/previous_info/inft_art_fdc
citytxt_fdc	app/ije_fetaldc/residence_mother/citytxt_fdc
countytxt_fdc	app/ije_fetaldc/residence_mother/countytxt_fdc
statetxt_fdc	app/ije_fetaldc/residence_mother/statetxt_fdc
zipcode_fdc	app/ije_fetaldc/residence_mother/zipcode_fdc
mbplace_st_ter_txt_fdc	app/ije_fetaldc/demog_details/mbplace_st_ter_txt_fdc
mbplace_cntry_txt_fdc	app/ije_fetaldc/demog_details/mbplace_cntry_txt_fdc
mager_fdc	app/ije_fetaldc/demog_details/mager_fdc
mdob_mo_fdc	app/ije_fetaldc/demog_details/mdob_mo_fdc
mdob_dy_fdc	app/ije_fetaldc/demog_details/mdob_dy_fdc
mdob_yr_fdc	app/ije_fetaldc/demog_details/mdob_yr_fdc
marn_fdc	app/ije_fetaldc/demog_details/marn_fdc
meduc_fdc	app/ije_fetaldc/demog_details/meduc_fdc
mom_in_t_fdc	app/ije_fetaldc/demog_details/mom_in_t_fdc
mom_oc_t_fdc	app/ije_fetaldc/demog_details/mom_oc_t_fdc
methnic1_fdc	app/ije_fdc/demog_details/methnic1_fdc
methnic2_fdc	app/ije_fdc/demog_details/methnic2_fdc
methnic3_fdc	app/ije_fdc/demog_details/methnic3_fdc
methnic4_fdc	app/ije_fdc/demog_details/methnic4_fdc
methnic5_fdc	app/ije_fdc/demog_details/methnic5_fdc
mrace1_fdc	app/ije_fdc/demog_details/mrace1_fdc
mrace2_fdc	app/ije_fdc/demog_details/mrace2_fdc
mrace3_fdc	app/ije_fdc/demog_details/mrace3_fdc
mrace4_fdc	app/ije_fdc/demog_details/mrace4_fdc
mrace5_fdc	app/ije_fdc/demog_details/mrace5_fdc
mrace6_fdc	app/ije_fdc/demog_details/mrace6_fdc
mrace7_fdc	app/ije_fdc/demog_details/mrace7_fdc
mrace8_fdc	app/ije_fdc/demog_details/mrace8_fdc
mrace9_fdc	app/ije_fdc/demog_details/mrace9_fdc
mrace10_fdc	app/ije_fdc/demog_details/mrace10_fdc
mrace11_fdc	app/ije_fdc/demog_details/mrace11_fdc
mrace12_fdc	app/ije_fdc/demog_details/mrace12_fdc
mrace13_fdc	app/ije_fdc/demog_details/mrace13_fdc
mrace14_fdc	app/ije_fdc/demog_details/mrace14_fdc
mrace15_fdc	app/ije_fdc/demog_details/mrace15_fdc
mrace16_fdc	app/ije_fdc/demog_details/mrace16_fdc
mrace17_fdc	app/ije_fdc/demog_details/mrace17_fdc
mrace18_fdc	app/ije_fdc/demog_details/mrace18_fdc
mrace19_fdc	app/ije_fdc/demog_details/mrace19_fdc
mrace20_fdc	app/ije_fdc/demog_details/mrace20_fdc
mrace21_fdc	app/ije_fdc/demog_details/mrace21_fdc
mrace22_fdc	app/ije_fdc/demog_details/mrace22_fdc
mrace23_fdc	app/ije_fdc/demog_details/mrace23_fdc
fager_fdc	app/ije_fdc/demog_details/fager_fdc
dad_in_t_fdc	app/ije_fdc/demog_details/dad_in_t_fdc
dad_oc_t_fdc	app/ije_fdc/demog_details/dad_oc_t_fdc
fbplacd_st_ter_c_fdc	app/ije_fdc/demog_details/fbplacd_st_ter_c_fdc
fbplace_cnt_c_fdc	app/ije_fdc/demog_details/fbplace_cnt_c_fdc

*/


public class SAMS_App
{
    public SAMS_App() {}
    public string environment { get; set; }

    public string jurisdiction_abbreviation {get;set; }
    public string activity_name { get; set; }
    public string client_id { get; set; }
    public string client_secret { get; set; }
    public string callback_url { get; set; }

    public string couchdb_url { get; set; }
    public string db_url { get; set; }
    public string user_name { get; set; }
    public string password { get; set; }
}







public class CsvSAMS_AppMapping : TinyCsvParser.Mapping.CsvMapping<SAMS_App>
{
    public CsvSAMS_AppMapping()
        : base()
    {
        MapProperty(0, x => x.environment);
        MapProperty(1, x => x.jurisdiction_abbreviation);
        MapProperty(2, x => x.activity_name);
        MapProperty(3, x => x.client_id);
        MapProperty(4, x => x.client_secret);
        MapProperty(5, x => x.callback_url);
        MapProperty(6, x => x.couchdb_url);
        MapProperty(7, x => x.db_url);
        MapProperty(8, x => x.user_name);
        MapProperty(9, x => x.password);
    }
}


public sealed class PMSS_ItemProcessor : ReceiveActor
{

    Dictionary<string, mmria.common.metadata.value_node[]> lookup;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    private string config_timer_user_name = null;
    private string config_timer_value = null;

    private string config_couchdb_url = null;
    private string db_prefix = "";

    
    static HashSet<string> ExistingRecordIds = null;

    mmria.common.couchdb.DBConfigurationDetail item_db_info;

    string geocode_api_key =  "";

    private System.Dynamic.ExpandoObject case_expando_object = null;

    private Dictionary<string, string> StateDisplayToValue;

    private string location_of_residence_latitude = null;
    private string location_of_residence_longitude = null;
    private string facility_of_delivery_location_latitude = null;
    private string facility_of_delivery_location_longitude = null;

    private string death_certificate_place_of_last_residence_latitude = null;
    private string death_certificate_place_of_last_residence_longitude = null;
    private string death_certificate_address_of_death_latitude = null;
    private string death_certificate_address_of_death_longitude = null;

    
    mmria.common.couchdb.OverridableConfiguration configuration;

    mmria.common.couchdb.DBConfigurationDetail db_config;
    string host_name;
    public PMSS_ItemProcessor
    (
        mmria.common.couchdb.OverridableConfiguration _configuration,
        string _host_name
    )
    {
        configuration = _configuration;
        host_name = _host_name;

        db_config = configuration.GetDBConfig(host_name);

        Receive<mmria.common.ije.StartBatchItemMessage>(message =>
        {    
            Console.WriteLine("Message Recieved");
            //Console.WriteLine(JsonConvert.SerializeObject(message));
            Sender.Tell("Message Recieved");
            Process_Message(message);
        });
    }

    private void Process_Message(mmria.common.ije.StartBatchItemMessage message)
    {

        var mor = new mmria_pmss_client.Models.IJE.MOR_Specification();
        var fet = new mmria_pmss_client.Models.IJE.FET_Specification();
        var nat = new mmria_pmss_client.Models.IJE.NAT_Specification();

        string metadata_url = $"{db_config.url}/metadata/version_specification-{configuration.GetString("metadata_version", host_name)}/metadata";
        var metadata_curl = new mmria.getset.cURL("GET", null, metadata_url, null, config_timer_user_name, config_timer_value);
        mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());

        lookup = get_look_up(metadata);

        var rows = message.mor.Split("\n");

        foreach(var row in rows)
        {
            var data  = row.SplitCsv();

        }


    }
/*

    private void ExtractFileAndConvert<T>(FileStream fs, int recordLength, string extractResultsMessageText, string filename, string now) where T : class
    {
        var lengthOfFile = fs.Length;
        var totalRecordLength = recordLength;
        var totalCompleteRecords = lengthOfFile / totalRecordLength;
        var records = new List<T>();

        for (int i = 0; i < totalCompleteRecords; i++)
        {
            var segment = new MemoryStream();

            //Set the postition of the file to the next record in the case of an incomplete read
            fs.Position = i * totalRecordLength;

            //Work only with the file segment where the stream is at.
            fs.CopyTo(segment);

            var record = (T)Activator.CreateInstance(typeof(T));

            //Put the file segment into the reader
            var flr = new FixedLengthReader(segment);

            //Read teh segment into an object
            flr.read(record);

            //Add the object to our list 
            records.Add(record);
        }


        //Debugging only on ECPaaS, can probably remove
        Console.WriteLine(extractResultsMessageText);
        //Debugging only on ECPaaS, can probably remove
        Console.WriteLine(JsonConvert.SerializeObject(records));

        //For each Record create a CSV for it
        for (int i = 0; i < records.Count; i++)
        {
            string desitanationFileName = Path.Combine(Environment.GetEnvironmentVariable("CSV_DESTINATION"), $"{Path.GetFileName(filename)}_{now}_{i+1}_of_{records.Count}.csv");
            File.WriteAllText(desitanationFileName, CsvConverter.ToCSV(records[i]));
        }
    }    
*/
    private void omb_mrace_recode(migrate.C_Get_Set_Value gs, System.Dynamic.ExpandoObject new_case, string[] race)
    {
        string race_recode = null;
        race_recode = calculate_omb_recode(race);
        gs.set_value("birth_fetal_death_certificate_parent/race/omb_race_recode", race_recode, new_case);
    }

    private void omb_frace_recode(migrate.C_Get_Set_Value gs, System.Dynamic.ExpandoObject new_case, string[] race)
    {
        string race_recode = null;
        race_recode = calculate_omb_recode(race);
        gs.set_value("birth_fetal_death_certificate_parent/demographic_of_father/race/omb_race_recode", race_recode, new_case);
    }

    private string TryPaseToIntOr_DefaultBlank(string value, string defaultString = "99")
    {
        string result = defaultString;

        if(int.TryParse(value, out int value_result))
        {
            result = value_result.ToString();
        }

        return result;
    }

    private string TryPaseToInt_00_To30(string value)
    {
        string result = "";

        if
        (
            int.TryParse(value, out int value_result) &&
            value_result >= 00 && 
            value_result <= 30
        )
        {
            result = value_result.ToString();
        }

        return result;
    }

    private void death_distance(migrate.C_Get_Set_Value gs, System.Dynamic.ExpandoObject new_case)
    {
        if (!string.IsNullOrWhiteSpace(death_certificate_place_of_last_residence_latitude)
            && !string.IsNullOrWhiteSpace(death_certificate_place_of_last_residence_longitude)
            && !string.IsNullOrWhiteSpace(death_certificate_address_of_death_latitude)
            && !string.IsNullOrWhiteSpace(death_certificate_address_of_death_longitude))
        {
            double? dist = null;
            float.TryParse(death_certificate_place_of_last_residence_latitude, out float res_lat);
            float.TryParse(death_certificate_place_of_last_residence_longitude, out float res_lon);
            float.TryParse(death_certificate_address_of_death_latitude, out float hos_lat);
            float.TryParse(death_certificate_address_of_death_longitude, out float hos_lon);
            if (res_lat >= -90 && res_lat <= 90 && res_lon >= -180 && res_lon <= 180 && hos_lat >= -90 && hos_lat <= 90 && hos_lon >= -180 && hos_lon <= 180)
            {
                dist = calc_distance(res_lat, res_lon, hos_lat, hos_lon);
                gs.set_value("death_certificate/address_of_death/estimated_death_distance_from_residence", dist?.ToString(), new_case);
            }
        }
    }

    private void birth_distance(migrate.C_Get_Set_Value gs, System.Dynamic.ExpandoObject new_case)
    {
        if (!string.IsNullOrWhiteSpace(location_of_residence_latitude)
            && !string.IsNullOrWhiteSpace(location_of_residence_longitude)
            && !string.IsNullOrWhiteSpace(facility_of_delivery_location_latitude)
            && !string.IsNullOrWhiteSpace(facility_of_delivery_location_longitude))
        {

            double? dist = null;
            float.TryParse(location_of_residence_latitude, out float res_lat);
            float.TryParse(location_of_residence_longitude, out float res_lon);
            float.TryParse(facility_of_delivery_location_latitude, out float hos_lat);
            float.TryParse(facility_of_delivery_location_longitude, out float hos_lon);
            if (res_lat >= -90 && res_lat <= 90 && res_lon >= -180 && res_lon <= 180 && hos_lat >= -90 && hos_lat <= 90 && hos_lon >= -180 && hos_lon <= 180)
            {
                dist = calc_distance(res_lat, res_lon, hos_lat, hos_lon);
                gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/estimated_distance_from_residence", dist?.ToString(), new_case);
            }
        }
    }

    private double calc_distance(float lat1, float lon1, float lat2, float lon2)
    {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.Sin(radlat1) * Math.Sin(radlat2) + Math.Cos(radlat1) * Math.Cos(radlat2) * Math.Cos(radtheta);
        dist = Math.Acos(dist);
        dist = dist * 180 / Math.PI;
        dist = Math.Round(dist * 60 * 1.1515 * 100) / 100;
        return dist;
    }

    private void omb_race_recode_dc(migrate.C_Get_Set_Value gs, System.Dynamic.ExpandoObject new_case, string[] race)
    {
        string race_recode = null;
        race_recode = calculate_omb_recode(race);
        gs.set_value("death_certificate/race/omb_race_recode", race_recode, new_case);
    }

    private string calculate_omb_recode(string[] p_value_list)
    {
        string result = "9999";
        var asian_list = new Dictionary<int, string>(){ 
                {7,"Asian Indian"},
                {8,"Chinese"},
                {9,"Filipino"},
                {10,"Japanese"},
                {11,"Korean"},
                {12,"Vietnamese"},
                {13,"Other Asian"}
            };
        var islander_list = new Dictionary<int, string>(){
                {3,"Native Hawaiian"},
                {4,"Guamanian or Chamorro"},
                {5,"Samoan"},
                {6,"Other Pacific Islander"}
            };
        if (p_value_list.Length == 0)
        {
            System.Console.WriteLine("here");
        }
        else if (p_value_list.Length == 1)
        {
            if (get_intersection(p_value_list, asian_list)?.Length > 0) 
            {
                result = "4"; //"Asian";
            } 
            else if (get_intersection(p_value_list, islander_list)?.Length > 0) 
            {
                result = "3"; //"Pacific Islander";
            } 
            else
            {
                result = p_value_list[0];
            }
        }
        else
        {
            if (p_value_list.Contains("8888"))
            {
                result = "8888"; //Race Not Specified";
            }
            else
            {
                var asian_intersection_count = get_intersection(p_value_list, asian_list)?.Length;
                var is_asian = 0;
                var islander_intersection_count = get_intersection(p_value_list, islander_list)?.Length;
                var is_islander = 0;
                if (asian_intersection_count > 0)
                    is_asian = 1;
                if (islander_intersection_count > 0)
                    is_islander = 1;
                var number_not_in_asian_or_islander_categories = p_value_list.Length - asian_intersection_count - islander_intersection_count;
                var total_unique_items = number_not_in_asian_or_islander_categories + is_asian + is_islander;
                switch (total_unique_items)
                {
                    case 1:
                        if (is_asian == 1)
                        {
                            result = "4"; //"Asian";
                        }
                        else if (is_islander == 1)
                        {
                            result = "3"; //"Pacific Islander";
                        }
                        else
                        {
                            Console.WriteLine("This should never happen bug");
                        }
                        break;
                    case 2:
                        result = "5";//"Bi-Racial";
                        break;
                    default:
                        result = "6"; //"Multi-Racial";
                        break;
                }
            }
        }
        return result;
    }

    public string[] get_intersection(string[] p_list_1, Dictionary<int,string> p_list_2)
    {
        List<string> result = new();

        foreach(var item_string in p_list_1)
        {
            if(int.TryParse(item_string, out var item))
            {
                if(p_list_2.ContainsKey(item))
                {
                    result.Add(item_string);
                }
            }
        }

        //var a = p_list_1;
        //var b = p_list_2;
        //a.sort();
        //b.sort();
        //var ai = 0, bi = 0;
        //var result = [];
        //while (ai < a.length && bi < b.length)
        //{
        //    if (a[ai] < b[bi])
        //    {
        //        ai++;
        //    }
        //    else if (a[ai] > b[bi])
        //    {
        //        bi++;
        //    }
        //    else
        //    {
        //        result.push(a[ai]);
        //        ai++;
        //        bi++;
        //    }
        //}
        return result.ToArray();
    }

    private void birth_2_death(migrate.C_Get_Set_Value gs, System.Dynamic.ExpandoObject new_case
        , string date_of_delivery_year, string date_of_delivery_month, string date_of_delivery_day
        , string date_of_death_year, string date_of_death_month, string date_of_death_day)
    {
            double? length_between_child_birth_and_death_of_mother = null;
            int.TryParse(date_of_delivery_year, out int start_year);
            int.TryParse(date_of_delivery_month, out int start_month);
            int.TryParse(date_of_delivery_day, out int start_day);
            int.TryParse(date_of_death_year, out int end_year);
            int.TryParse(date_of_death_month, out int end_month);
            int.TryParse(date_of_death_day, out int end_day);

            if (DateTime.TryParse($"{start_year}/{start_month}/{start_day}", out DateTime startDateTest) == true 
                && DateTime.TryParse($"{end_year}/{end_month}/{end_day}", out DateTime endDateTest) == true) 
            {
                var time_span = endDateTest - startDateTest;

                //var days = $global.calc_days(start_date, end_date);
                var days = time_span.Days;
                length_between_child_birth_and_death_of_mother = (double) days;
            }

            gs.set_value("birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother", length_between_child_birth_and_death_of_mother?.ToString(), new_case);
    }

    private void Set_facility_of_delivery_location_Gecocode(migrate.C_Get_Set_Value gs, GeocodeTuple geocode_data, System.Dynamic.ExpandoObject new_case)
    {
        string urban_status = null;
        string state_county_fips = null;

        string feature_matching_geography_type = "Unmatchable";
        string latitude = "";
        string longitude = "";
        string naaccr_gis_coordinate_quality_code = "";
        string naaccr_gis_coordinate_quality_type = "";
        string naaccr_census_tract_certainty_code = "";
        string naaccr_census_tract_certainty_type = "";
        string census_state_fips = "";
        string census_county_fips = "";
        string census_tract_fips = "";
        string census_cbsa_fips = "";
        string census_cbsa_micro = "";
        string census_met_div_fips = "";
        urban_status = "";
        state_county_fips = "";

        var outputGeocode_data = geocode_data.OutputGeocode;
        var censusValues_data = geocode_data.Census_Value;
        
        if
        (
            outputGeocode_data != null && 
            outputGeocode_data.FeatureMatchingResultType != null &&
            !outputGeocode_data.FeatureMatchingResultType.Equals("Unmatchable", StringComparison.OrdinalIgnoreCase)
        )
        {
            latitude = outputGeocode_data.Latitude;
            longitude = outputGeocode_data.Longitude;
            feature_matching_geography_type = outputGeocode_data.FeatureMatchingGeographyType;
            naaccr_gis_coordinate_quality_code = outputGeocode_data.NAACCRGISCoordinateQualityCode;
            naaccr_gis_coordinate_quality_type = outputGeocode_data.NAACCRGISCoordinateQualityType;
            naaccr_census_tract_certainty_code = censusValues_data?.NAACCRCensusTractCertaintyCode;
            naaccr_census_tract_certainty_type = censusValues_data?.NAACCRCensusTractCertaintyType;
            census_state_fips = censusValues_data?.CensusStateFips;
            census_county_fips = censusValues_data?.CensusCountyFips;
            census_tract_fips = censusValues_data?.CensusTract;
            census_cbsa_fips = censusValues_data?.CensusCbsaFips;
            census_cbsa_micro = censusValues_data?.CensusCbsaMicro;
            census_met_div_fips = censusValues_data?.CensusMetDivFips;
            // calculate urban_status
            if (censusValues_data != null)
            {
                if
                        (
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                            censusValues_data?.CensusCbsaFips == ""
                        )
                {
                    urban_status = "Rural";
                }
                else if
                (
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                    int.Parse(censusValues_data?.CensusCbsaFips) > 0
                )
                {
                    if (!string.IsNullOrEmpty(censusValues_data?.CensusMetDivFips))
                    {
                        urban_status = "Metropolitan Division";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 0)
                    {
                        urban_status = "Metropolitan";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 1)
                    {
                        urban_status = "Micropolitan";
                    }
                }
                else
                {
                    urban_status = "Undetermined";
                } 
            }

            // calculate state_county_fips
            if (!String.IsNullOrEmpty(censusValues_data?.CensusStateFips) && !String.IsNullOrEmpty(censusValues_data?.CensusCountyFips))
            {
                state_county_fips = censusValues_data?.CensusStateFips + censusValues_data?.CensusCountyFips;
            }

            facility_of_delivery_location_latitude = latitude;
            facility_of_delivery_location_longitude = longitude;
        }

        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/feature_matching_geography_type", feature_matching_geography_type, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/latitude", latitude, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/longitude", longitude, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/census_state_fips", census_state_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/census_county_fips", census_county_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/census_tract_fips", census_tract_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/census_cbsa_fips", census_cbsa_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/census_cbsa_micro", census_cbsa_micro, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/census_met_div_fips", census_met_div_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/urban_status", urban_status, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/facility_of_delivery_location/state_county_fips", state_county_fips, new_case);
        
    }

    private void Set_location_of_residence_Gecocode(migrate.C_Get_Set_Value gs, GeocodeTuple geocode_data, System.Dynamic.ExpandoObject new_case)
    {
        
        string urban_status = null;
        string state_county_fips = null;

        string feature_matching_geography_type = "Unmatchable";
        string latitude = "";
        string longitude = "";
        string naaccr_gis_coordinate_quality_code = "";
        string naaccr_gis_coordinate_quality_type = "";
        string naaccr_census_tract_certainty_code = "";
        string naaccr_census_tract_certainty_type = "";
        string census_state_fips = "";
        string census_county_fips = "";
        string census_tract_fips = "";
        string census_cbsa_fips = "";
        string census_cbsa_micro = "";
        string census_met_div_fips = "";


        var outputGeocode_data = geocode_data.OutputGeocode;
        var censusValues_data = geocode_data.Census_Value;

        if 
        (
            outputGeocode_data != null && 
            outputGeocode_data.FeatureMatchingResultType != null &&
            !outputGeocode_data.FeatureMatchingResultType.Equals("Unmatchable", StringComparison.OrdinalIgnoreCase)
        )
        {
            latitude = outputGeocode_data.Latitude;
            longitude = outputGeocode_data.Longitude;
            feature_matching_geography_type = outputGeocode_data.FeatureMatchingGeographyType;
            naaccr_gis_coordinate_quality_code = outputGeocode_data.NAACCRGISCoordinateQualityCode;
            naaccr_gis_coordinate_quality_type = outputGeocode_data.NAACCRGISCoordinateQualityType;
            naaccr_census_tract_certainty_code = censusValues_data?.NAACCRCensusTractCertaintyCode;
            naaccr_census_tract_certainty_type = censusValues_data?.NAACCRCensusTractCertaintyType;
            census_state_fips = censusValues_data?.CensusStateFips;
            census_county_fips = censusValues_data?.CensusCountyFips;
            census_tract_fips = censusValues_data?.CensusTract;
            census_cbsa_fips = censusValues_data?.CensusCbsaFips;
            census_cbsa_micro = censusValues_data?.CensusCbsaMicro;
            census_met_div_fips = censusValues_data?.CensusMetDivFips;

            // calculate urban_status
            if (censusValues_data != null)
            {
                if
                        (
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                            censusValues_data?.CensusCbsaFips == ""
                        )
                {
                    urban_status = "Rural";
                }
                else if
                (
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                    int.Parse(censusValues_data?.CensusCbsaFips) > 0
                )
                {
                    if (!string.IsNullOrEmpty(censusValues_data?.CensusMetDivFips))
                    {
                        urban_status = "Metropolitan Division";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 0)
                    {
                        urban_status = "Metropolitan";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 1)
                    {
                        urban_status = "Micropolitan";
                    }
                }
                else
                {
                    urban_status = "Undetermined";
                } 
            }

            // calculate state_county_fips
            if (!String.IsNullOrEmpty(censusValues_data?.CensusStateFips) && !String.IsNullOrEmpty(censusValues_data?.CensusCountyFips))
            {
                state_county_fips = censusValues_data?.CensusStateFips + censusValues_data?.CensusCountyFips;
            }

            location_of_residence_latitude = latitude;
            location_of_residence_longitude = longitude;
        }
        else
        {

            urban_status = "";
            state_county_fips = "";


        }


        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/feature_matching_geography_type", feature_matching_geography_type, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/latitude", latitude, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/longitude", longitude, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/census_state_fips", census_state_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/census_county_fips", census_county_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/census_tract_fips", census_tract_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/census_cbsa_fips", census_cbsa_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/census_cbsa_micro", census_cbsa_micro, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/census_met_div_fips", census_met_div_fips, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/urban_status", urban_status, new_case);
        gs.set_value("birth_fetal_death_certificate_parent/location_of_residence/state_county_fips", state_county_fips, new_case);

    }

    private void Set_place_of_last_residence_Gecocode(migrate.C_Get_Set_Value gs, GeocodeTuple geocode_data, System.Dynamic.ExpandoObject new_case)
    {

        string urban_status = null;
        string state_county_fips = null;

        string feature_matching_geography_type = "Unmatchable";
        string latitude = "";
        string longitude = "";
        string naaccr_gis_coordinate_quality_code = "";
        string naaccr_gis_coordinate_quality_type = "";
        string naaccr_census_tract_certainty_code = "";
        string naaccr_census_tract_certainty_type = "";
        string census_state_fips = "";
        string census_county_fips = "";
        string census_tract_fips = "";
        string census_cbsa_fips = "";
        string census_cbsa_micro = "";
        string census_met_div_fips = "";
        urban_status = "";
        state_county_fips = "";

        var outputGeocode_data = geocode_data.OutputGeocode;
        var censusValues_data = geocode_data.Census_Value;
        
        if
        (
            outputGeocode_data != null && 
            outputGeocode_data.FeatureMatchingResultType != null &&
            !outputGeocode_data.FeatureMatchingResultType.Equals("Unmatchable", StringComparison.OrdinalIgnoreCase)
        )
        {

            latitude = outputGeocode_data.Latitude;
            longitude = outputGeocode_data.Longitude;
            feature_matching_geography_type = outputGeocode_data.FeatureMatchingGeographyType;
            naaccr_gis_coordinate_quality_code = outputGeocode_data.NAACCRGISCoordinateQualityCode;
            naaccr_gis_coordinate_quality_type = outputGeocode_data.NAACCRGISCoordinateQualityType;
            naaccr_census_tract_certainty_code = censusValues_data?.NAACCRCensusTractCertaintyCode;
            naaccr_census_tract_certainty_type = censusValues_data?.NAACCRCensusTractCertaintyType;
            census_state_fips = censusValues_data?.CensusStateFips;
            census_county_fips = censusValues_data?.CensusCountyFips;
            census_tract_fips = censusValues_data?.CensusTract;
            census_cbsa_fips = censusValues_data?.CensusCbsaFips;
            census_cbsa_micro = censusValues_data?.CensusCbsaMicro;
            census_met_div_fips = censusValues_data?.CensusMetDivFips;

            // calculate urban_status

            if (censusValues_data != null)
            {
                if
                        (
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                            censusValues_data?.CensusCbsaFips == ""
                        )
                {
                    urban_status = "Rural";
                }
                else if
                (
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                    int.Parse(censusValues_data?.CensusCbsaFips) > 0
                )
                {
                    if (!string.IsNullOrEmpty(censusValues_data?.CensusMetDivFips))
                    {
                        urban_status = "Metropolitan Division";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 0)
                    {
                        urban_status = "Metropolitan";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 1)
                    {
                        urban_status = "Micropolitan";
                    }
                }
                else
                {
                    urban_status = "Undetermined";
                } 
            }

            // calculate state_county_fips
            if (!String.IsNullOrEmpty(censusValues_data?.CensusStateFips) && !String.IsNullOrEmpty(censusValues_data?.CensusCountyFips))
            {
                state_county_fips = censusValues_data?.CensusStateFips + censusValues_data?.CensusCountyFips;
            }


            death_certificate_place_of_last_residence_latitude = latitude;
            death_certificate_place_of_last_residence_longitude = longitude;
        }

        gs.set_value("death_certificate/place_of_last_residence/feature_matching_geography_type", feature_matching_geography_type, new_case);
        gs.set_value("death_certificate/place_of_last_residence/latitude", latitude, new_case);
        gs.set_value("death_certificate/place_of_last_residence/longitude", longitude, new_case);
        gs.set_value("death_certificate/place_of_last_residence/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
        gs.set_value("death_certificate/place_of_last_residence/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
        gs.set_value("death_certificate/place_of_last_residence/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
        gs.set_value("death_certificate/place_of_last_residence/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
        gs.set_value("death_certificate/place_of_last_residence/census_state_fips", census_state_fips, new_case);
        gs.set_value("death_certificate/place_of_last_residence/census_county_fips", census_county_fips, new_case);
        gs.set_value("death_certificate/place_of_last_residence/census_tract_fips", census_tract_fips, new_case);
        gs.set_value("death_certificate/place_of_last_residence/census_cbsa_fips", census_cbsa_fips, new_case);
        gs.set_value("death_certificate/place_of_last_residence/census_cbsa_micro", census_cbsa_micro, new_case);
        gs.set_value("death_certificate/place_of_last_residence/census_met_div_fips", census_met_div_fips, new_case);
        gs.set_value("death_certificate/place_of_last_residence/urban_status", urban_status, new_case);
        gs.set_value("death_certificate/place_of_last_residence/state_county_fips", state_county_fips, new_case);

        
    }

    private void Set_address_of_death_Gecocode(migrate.C_Get_Set_Value gs, GeocodeTuple geocode_data, System.Dynamic.ExpandoObject new_case)
    {
        
        string urban_status = null;
        string state_county_fips = null;

        string feature_matching_geography_type = "Unmatchable";
        string latitude = "";
        string longitude = "";
        string naaccr_gis_coordinate_quality_code = "";
        string naaccr_gis_coordinate_quality_type = "";
        string naaccr_census_tract_certainty_code = "";
        string naaccr_census_tract_certainty_type = "";
        string census_state_fips = "";
        string census_county_fips = "";
        string census_tract_fips = "";
        string census_cbsa_fips = "";
        string census_cbsa_micro = "";
        string census_met_div_fips = "";

        var outputGeocode_data = geocode_data.OutputGeocode;
        var censusValues_data = geocode_data.Census_Value;
        

        if 
        (
            outputGeocode_data != null && 
            outputGeocode_data.FeatureMatchingResultType != null &&
            !outputGeocode_data.FeatureMatchingResultType.Equals("Unmatchable", StringComparison.OrdinalIgnoreCase)
        )
        {
            latitude = outputGeocode_data.Latitude;
            longitude = outputGeocode_data.Longitude;
            feature_matching_geography_type = outputGeocode_data.FeatureMatchingGeographyType;
            naaccr_gis_coordinate_quality_code = outputGeocode_data.NAACCRGISCoordinateQualityCode;
            naaccr_gis_coordinate_quality_type = outputGeocode_data.NAACCRGISCoordinateQualityType;
            naaccr_census_tract_certainty_code = censusValues_data?.NAACCRCensusTractCertaintyCode;
            naaccr_census_tract_certainty_type = censusValues_data?.NAACCRCensusTractCertaintyType;
            census_state_fips = censusValues_data?.CensusStateFips;
            census_county_fips = censusValues_data?.CensusCountyFips;
            census_tract_fips = censusValues_data?.CensusTract;
            census_cbsa_fips = censusValues_data?.CensusCbsaFips;
            census_cbsa_micro = censusValues_data?.CensusCbsaMicro;
            census_met_div_fips = censusValues_data?.CensusMetDivFips;

            // calculate urban_status
            if (censusValues_data != null)
            {
                if
                        (
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                            int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                            censusValues_data?.CensusCbsaFips == ""
                        )
                {
                    urban_status = "Rural";
                }
                else if
                (
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) > 0 &&
                    int.Parse(censusValues_data?.NAACCRCensusTractCertaintyCode) < 7 &&
                    int.Parse(censusValues_data?.CensusCbsaFips) > 0
                )
                {
                    if (!string.IsNullOrEmpty(censusValues_data?.CensusMetDivFips))
                    {
                        urban_status = "Metropolitan Division";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 0)
                    {
                        urban_status = "Metropolitan";
                    }
                    else if (int.Parse(censusValues_data?.CensusCbsaMicro) == 1)
                    {
                        urban_status = "Micropolitan";
                    }
                }
                else
                {
                    urban_status = "Undetermined";
                } 
            }

            // calculate state_county_fips
            if (!String.IsNullOrEmpty(censusValues_data?.CensusStateFips) && !String.IsNullOrEmpty(censusValues_data?.CensusCountyFips))
            {
                state_county_fips = censusValues_data?.CensusStateFips + censusValues_data?.CensusCountyFips;
            }

            death_certificate_address_of_death_latitude = latitude;
            death_certificate_address_of_death_longitude = longitude;
        }
        else
        {

            urban_status = "";
            state_county_fips = "";

        }

        gs.set_value("death_certificate/address_of_death/feature_matching_geography_type", feature_matching_geography_type, new_case);
        gs.set_value("death_certificate/address_of_death/latitude", latitude, new_case);
        gs.set_value("death_certificate/address_of_death/longitude", longitude, new_case);
        gs.set_value("death_certificate/address_of_death/naaccr_gis_coordinate_quality_code", naaccr_gis_coordinate_quality_code, new_case);
        gs.set_value("death_certificate/address_of_death/naaccr_gis_coordinate_quality_type", naaccr_gis_coordinate_quality_type, new_case);
        gs.set_value("death_certificate/address_of_death/naaccr_census_tract_certainty_code", naaccr_census_tract_certainty_code, new_case);
        gs.set_value("death_certificate/address_of_death/naaccr_census_tract_certainty_type", naaccr_census_tract_certainty_type, new_case);
        gs.set_value("death_certificate/address_of_death/census_state_fips", census_state_fips, new_case);
        gs.set_value("death_certificate/address_of_death/census_county_fips", census_county_fips, new_case);
        gs.set_value("death_certificate/address_of_death/census_tract_fips", census_tract_fips, new_case);
        gs.set_value("death_certificate/address_of_death/census_cbsa_fips", census_cbsa_fips, new_case);
        gs.set_value("death_certificate/address_of_death/census_cbsa_micro", census_cbsa_micro, new_case);
        gs.set_value("death_certificate/address_of_death/census_met_div_fips", census_met_div_fips, new_case);
        gs.set_value("death_certificate/address_of_death/urban_status", urban_status, new_case);
        gs.set_value("death_certificate/address_of_death/state_county_fips", state_county_fips, new_case);

    }

    public sealed class GeocodeTuple
    {
        public GeocodeTuple(){}

        public mmria.common.texas_am.OutputGeocode OutputGeocode {get;set;}
        public mmria.common.texas_am.CensusValue Census_Value {get;set;}

    }



    struct Result_Struct
    {
        public System.Dynamic.ExpandoObject[] docs;
    }

    struct Selector_Struc
    {
        //public System.Dynamic.ExpandoObject selector;
        public System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> selector;
        public string[] fields;

        public int limit;
    }

    private async Task<Result_Struct> get_matching_cases_for(string p_selector, string p_find_value)
    {

        Result_Struct result = new Result_Struct();

        try
        {

            var selector_struc = new Selector_Struc();
            selector_struc.selector = new System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);
            selector_struc.limit = 10000;
            selector_struc.selector.Add(p_selector, new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase));
            selector_struc.selector[p_selector].Add("$eq", p_find_value);

            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            string selector_struc_string = Newtonsoft.Json.JsonConvert.SerializeObject(selector_struc, settings);

            System.Console.WriteLine(selector_struc_string);

            /*
                            string find_url = $"{db_server_url}/{db_name}/_find";

                            var case_curl = new mmria.getset.cURL("POST", null, find_url, selector_struc_string, config_timer_user_name, config_timer_value);
                            string responseFromServer = await case_curl.executeAsync();

                            result = Newtonsoft.Json.JsonConvert.DeserializeObject<Result_Struct>(responseFromServer);
            */
            System.Console.WriteLine($"case_response.docs.length {result.docs.Length}");
        }
        catch (Exception ex)
        {

        }

        return result;
    }

    private Dictionary<string, mmria.common.metadata.value_node[]> get_look_up(mmria.common.metadata.app p_metadata)
    {
        var result = new Dictionary<string, mmria.common.metadata.value_node[]>(StringComparer.OrdinalIgnoreCase);

        foreach (var node in p_metadata.lookup)
        {
            result.Add("lookup/" + node.name, node.values);
        }
        return result;
    }


    private  mmria.common.metadata.value_node[] get_metadata_value_node(string search_path, mmria.common.metadata.app p_metadata, string path = "")
    {
        mmria.common.metadata.value_node[] result = null;

        foreach (var node in p_metadata.children)
        {
            result = get_metadata_value_node(search_path, node, node.name);
            if(result != null) break;
        }
        return result;
    }

    private mmria.common.metadata.value_node[] get_metadata_value_node(string search_path, mmria.common.metadata.node p_metadata, string path = "")
    {
        mmria.common.metadata.value_node[] result = null;
        string key = $"{path}/{p_metadata.name}";
        if(search_path.Equals(path, StringComparison.OrdinalIgnoreCase))
        {
            if(! string.IsNullOrWhiteSpace(p_metadata.path_reference))
            {
                //result = lookup[p_metadata.path_reference];
            }
            else
            {
                result = p_metadata.values;
            }
        }
        else if(p_metadata.children!= null)
        {
            foreach (var node in p_metadata.children)
            {
                result = get_metadata_value_node(search_path, node, $"{path}/{node.name}");
                if(result != null) break;
            }
        }
        return result;
    }

    private mmria.common.ije.BatchItem Convert
    (
            string LineItem,
            DateTime ImportDate,
            string ImportFileName,
            string ReportingState
    )
    {

        var x = mor_get_header(LineItem);
        var result = new mmria.common.ije.BatchItem()
        {
            Status = mmria.common.ije.BatchItem.StatusEnum.InProcess,
            CDCUniqueID = x["SSN"],
            ImportDate = ImportDate,
            ImportFileName = ImportFileName,
            ReportingState = ReportingState,

            StateOfDeathRecord = x["DSTATE"],
            DateOfDeath = $"{x["DOD_YR"]}-{x["DOD_MO"]}-{x["DOD_DY"]}",
            DateOfBirth = $"{x["DOB_YR"]}-{x["DOB_MO"]}-{x["DOB_DY"]}",
            LastName = x["LNAME"],
            FirstName = x["GNAME"]//,
            //MMRIARecordID = x[""],
            //StatusDetail = x[""]
        };

        return result;
    }

    private Dictionary<string, string> mor_get_header(string row)
    {
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        /*
DState 5 2
DOD_YR 1 4, 
DOD_MO 237 2, 
DOD_DY 239 2
DOB_YR 205 4, 
DOB_MO 209 2, 
DOD_DY 239 2
LNAME 78 50
GNAME 27 50
*/
        //result.Add("DState",row.Substring(5-1, 2).Trim());
        //result.Add("DOD_YR",row.Substring(1-1, 4).Trim());
        //result.Add("DOD_MO",row.Substring(237-1, 2).Trim());
        //result.Add("DOD_DY",row.Substring(239-1, 2).Trim());
        //result.Add("DOB_YR",row.Substring(205-1, 4).Trim());
        //result.Add("DOB_MO",row.Substring(209-1, 2).Trim());
        //result.Add("DOB_DY",row.Substring(211-1, 2).Trim());
        //result.Add("LNAME",row.Substring(78-1, 50).Trim());
        //result.Add("GNAME",row.Substring(27-1, 50).Trim());
        //result.Add("SSN",row.Substring(191-1, 9).Trim());

        result.Add("DOD_YR", DOD_YR_Rule(row.Substring(0, 4).Trim()));
        result.Add("DSTATE", row.Substring(4, 2).Trim());
        result.Add("FILENO", row.Substring(6, 6).Trim());
        result.Add("AUXNO", row.Substring(13, 12).Trim());
        result.Add("GNAME", row.Substring(26, 50).Trim());
        result.Add("LNAME", row.Substring(77, 50).Trim());
        result.Add("SSN", row.Substring(190, 9).Trim());
        result.Add("AGETYPE", row.Substring(199, 1).Trim());
        result.Add("AGE", AGE_Rule(row.Substring(200, 3).Trim()));
        result.Add("DOB_YR", row.Substring(204, 4).Trim());
        result.Add("DOB_MO", DOB_MO_Rule(row.Substring(208, 2).Trim()));
        result.Add("DOB_DY", DOB_DY_Rule(row.Substring(210, 2).Trim()));
        result.Add("BPLACE_CNT", row.Substring(212, 2).Trim());
        result.Add("BPLACE_ST", BPLACE_ST_Rule(row.Substring(214, 2).Trim()));
        result.Add("CITYC", row.Substring(216, 5).Trim());
        result.Add("COUNTYC", row.Substring(221, 3).Trim());
        result.Add("STATEC", STATEC_Rule(row.Substring(224, 2).Trim()));
        result.Add("COUNTRYC", COUNTRYC_Rule(row.Substring(226, 2).Trim()));
        result.Add("MARITAL", MARITAL_Rule(row.Substring(229, 1).Trim()));
        result.Add("DPLACE", row.Substring(231, 1).Trim());
        result.Add("COD", row.Substring(232, 3).Trim());
        result.Add("DOD_MO", DOD_MO_Rule(row.Substring(236, 2).Trim()));
        result.Add("DOD_DY", DOD_DY_Rule(row.Substring(238, 2).Trim()));
        result.Add("TOD", TOD_Rule(row.Substring(240, 4).Trim()));
        result.Add("DEDUC", DEDUC_Rule(row.Substring(244, 1).Trim()));

        result.Add("DETHNIC1", row.Substring(246, 1).Trim());
        result.Add("DETHNIC2", row.Substring(247, 1).Trim());
        result.Add("DETHNIC3", row.Substring(248, 1).Trim());
        result.Add("DETHNIC4", row.Substring(249, 1).Trim());
        result.Add("DETHNIC5", row.Substring(250, 20).Trim());

        result.Add("RACE1", row.Substring(270, 1).Trim());
        result.Add("RACE2", row.Substring(271, 1).Trim());
        result.Add("RACE3", row.Substring(272, 1).Trim());
        result.Add("RACE4", row.Substring(273, 1).Trim());
        result.Add("RACE5", row.Substring(274, 1).Trim());
        result.Add("RACE6", row.Substring(275, 1).Trim());
        result.Add("RACE7", row.Substring(276, 1).Trim());
        result.Add("RACE8", row.Substring(277, 1).Trim());
        result.Add("RACE9", row.Substring(278, 1).Trim());
        result.Add("RACE10", row.Substring(279, 1).Trim());
        result.Add("RACE11", row.Substring(280, 1).Trim());
        result.Add("RACE12", row.Substring(281, 1).Trim());
        result.Add("RACE13", row.Substring(282, 1).Trim());
        result.Add("RACE14", row.Substring(283, 1).Trim());
        result.Add("RACE15", row.Substring(284, 1).Trim());
        result.Add("RACE16", row.Substring(285, 30).Trim());
        result.Add("RACE17", row.Substring(315, 30).Trim());
        result.Add("RACE18", row.Substring(345, 30).Trim());
        result.Add("RACE19", row.Substring(375, 30).Trim());
        result.Add("RACE20", row.Substring(405, 30).Trim());
        result.Add("RACE21", row.Substring(435, 30).Trim());
        result.Add("RACE22", row.Substring(465, 30).Trim());
        result.Add("RACE23", row.Substring(495, 30).Trim());

        result.Add("OCCUP", row.Substring(574, 40).Trim());
        result.Add("INDUST", row.Substring(617, 40).Trim());
        result.Add("MANNER", MANNER_Rule(row.Substring(700, 1).Trim()));
        result.Add("MAN_UC", row.Substring(704, 5).Trim());
        result.Add("ACME_UC", row.Substring(709, 5).Trim());
        result.Add("EAC", row.Substring(714, 160).Trim());
        result.Add("TRX_FLG", row.Substring(874, 1).Trim());
        result.Add("RAC", row.Substring(875, 100).Trim());
        result.Add("AUTOP", AUTOP_Rule(row.Substring(975, 1).Trim()));
        result.Add("AUTOPF", AUTOPF_Rule(row.Substring(976, 1).Trim()));
        result.Add("TOBAC", TOBAC_Rule(row.Substring(977, 1).Trim()));
        result.Add("PREG", PREG_Rule(row.Substring(978, 1).Trim()));
        result.Add("DOI_MO", DOI_MO_Rule(row.Substring(980, 2).Trim()));
        result.Add("DOI_DY", DOI_DY_Rule(row.Substring(982, 2).Trim()));
        result.Add("DOI_YR", DOI_YR_Rule(row.Substring(984, 4).Trim()));
        result.Add("TOI_HR", TOI_HR_Rule(row.Substring(988, 4).Trim()));
        result.Add("WORKINJ", WORKINJ_Rule(row.Substring(992, 1).Trim()));
        result.Add("BLANK", row.Substring(1024, 56).Trim());
        result.Add("ARMEDF", ARMEDF_Rule(row.Substring(1080, 1).Trim()));
        result.Add("DINSTI", row.Substring(1081, 30).Trim());
        result.Add("STNUM_D", row.Substring(1161, 10).Trim());
        result.Add("PREDIR_D", row.Substring(1171, 10).Trim());
        result.Add("STNAME_D", row.Substring(1181, 50).Trim());
        result.Add("STDESIG_D", row.Substring(1231, 10).Trim());
        result.Add("POSTDIR_D", row.Substring(1241, 10).Trim());
        result.Add("CITYTEXT_D", row.Substring(1251, 28).Trim());
        result.Add("STATETEXT_D", row.Substring(1279, 28).Trim());
        result.Add("ZIP9_D", ZIP9_D_Rule(row.Substring(1307, 9).Trim()));
        result.Add("COUNTYTEXT_D", row.Substring(1316, 28).Trim());
        result.Add("CITYCODE_D", row.Substring(1344, 5).Trim());
        result.Add("STNUM_R", row.Substring(1484, 10).Trim());
        result.Add("PREDIR_R", row.Substring(1494, 10).Trim());
        result.Add("STNAME_R", row.Substring(1504, 28).Trim());
        result.Add("STDESIG_R", row.Substring(1532, 10).Trim());
        result.Add("POSTDIR_R", row.Substring(1542, 10).Trim());
        result.Add("UNITNUM_R", row.Substring(1552, 7).Trim());
        result.Add("CITYTEXT_R", row.Substring(1559, 28).Trim());
        result.Add("ZIP9_R", row.Substring(1587, 9).Trim());
        result.Add("COUNTYTEXT_R", row.Substring(1596, 28).Trim());
        result.Add("COUNTRYTEXT_R", row.Substring(1652, 28).Trim());
        result.Add("DMIDDLE", row.Substring(1807, 50).Trim());
        result.Add("POILITRL", row.Substring(2108, 50).Trim());
        result.Add("TRANSPRT", row.Substring(2408, 30).Trim());
        result.Add("COUNTYTEXT_I", row.Substring(2438, 28).Trim());
        result.Add("CITYTEXT_I", row.Substring(2469, 28).Trim());
        result.Add("COD1A", row.Substring(2541, 120).Trim());
        result.Add("INTERVAL1A", row.Substring(2661, 20).Trim());
        result.Add("COD1B", row.Substring(2681, 120).Trim());
        result.Add("INTERVAL1B", row.Substring(2801, 20).Trim());
        result.Add("COD1C", row.Substring(2821, 120).Trim());
        result.Add("INTERVAL1C", row.Substring(2941, 20).Trim());
        result.Add("COD1D", row.Substring(2961, 120).Trim());
        result.Add("INTERVAL1D", row.Substring(3081, 20).Trim());
        result.Add("OTHERCONDITION", row.Substring(3101, 240).Trim());
        result.Add("DBPLACECITY", row.Substring(3396, 28).Trim());
        result.Add("STINJURY", row.Substring(4269, 28).Trim());
        result.Add("VRO_STATUS", VRO_STATUS_Rule(row.Substring(4992, 1).Trim()));
        result.Add("BC_DET_MATCH", row.Substring(4993, 1).Trim());
        result.Add("FDC_DET_MATCH", row.Substring(4994, 1).Trim());
        result.Add("BC_PROB_MATCH", row.Substring(4995, 1).Trim());
        result.Add("FDC_PROB_MATCH", row.Substring(4996, 1).Trim());
        result.Add("ICD10_MATCH", row.Substring(4997, 1).Trim());
        result.Add("PREGCB_MATCH", row.Substring(4998, 1).Trim());
        result.Add("LITERALCOD_MATCH", row.Substring(4999, 1).Trim());


        return result;

        /*
        2 home_record/state of death - DState
3 home_record/date_of_death - DOD_YR, DOD_MO, DOD_DY
4 death_certificate/date_of_birth - DOB_YR, DOB_MO, DOD_DY
5 home_record/last_name - LNAME  
6 home_record/first_name - GNAME*/
    }

    private List<Dictionary<string, string>> nat_get_header(List<string> rows)
    {
        var listResults = new List<Dictionary<string, string>>();

        foreach (var row in rows)
        {
            var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);



            result.Add("IDOB_YR", row.Substring(0, 4).Trim());

            result.Add("BSTATE", row.Substring(4, 2).Trim());

            result.Add("FILENO", row.Substring(6, 6).Trim());
            result.Add("AUXNO", row.Substring(13, 12).Trim());
            result.Add("TB", TB_NAT_Rule(row.Substring(25, 4).Trim()));


            result.Add("IDOB_MO", row.Substring(30, 2).Trim());
            result.Add("IDOB_DY", row.Substring(32, 2).Trim());

            result.Add("BPLACE", (row.Substring(37, 1).Trim()));

            result.Add("FNPI", row.Substring(38, 12).Trim());
            result.Add("MDOB_YR", MDOB_YR_Rule(row.Substring(54, 4).Trim()));
            result.Add("MDOB_MO", MDOB_MO_Rule(row.Substring(58, 2).Trim()));
            result.Add("MDOB_DY", MDOB_DY_Rule(row.Substring(60, 2).Trim()));

            result.Add("BPLACEC_ST_TER", BPLACEC_ST_TER_NAT_Rule(row.Substring(63, 2).Trim()));
            result.Add("BPLACEC_CNT", (row.Substring(65, 2).Trim()));

            result.Add("STATEC", NAT_STATEC_Rule(row.Substring(75, 2).Trim()));
            result.Add("FDOB_YR", FDOB_YR_Rule(row.Substring(80, 4).Trim()));
            result.Add("FDOB_MO", FDOB_MO_Rule(row.Substring(84, 2).Trim()));
            result.Add("MARN", MARN_Rule(row.Substring(90, 1).Trim()));
            result.Add("ACKN", ACKN_Rule(row.Substring(91, 1).Trim()));
            result.Add("MEDUC", MEDUC_Rule(row.Substring(92, 1).Trim()));

            result.Add("METHNIC1", row.Substring(94, 1).Trim());
            result.Add("METHNIC2", row.Substring(95, 1).Trim());
            result.Add("METHNIC3", row.Substring(96, 1).Trim());
            result.Add("METHNIC4", row.Substring(97, 1).Trim());

            result.Add("METHNIC5", row.Substring(98, 20).Trim());

            result.Add("MRACE1", (row.Substring(118, 1).Trim()));
            result.Add("MRACE2", (row.Substring(119, 1).Trim()));
            result.Add("MRACE3", (row.Substring(120, 1).Trim()));
            result.Add("MRACE4", (row.Substring(121, 1).Trim()));
            result.Add("MRACE5", (row.Substring(122, 1).Trim()));
            result.Add("MRACE6", (row.Substring(123, 1).Trim()));
            result.Add("MRACE7", (row.Substring(124, 1).Trim()));
            result.Add("MRACE8", (row.Substring(125, 1).Trim()));
            result.Add("MRACE9", (row.Substring(126, 1).Trim()));
            result.Add("MRACE10", (row.Substring(127, 1).Trim()));
            result.Add("MRACE11", (row.Substring(128, 1).Trim()));
            result.Add("MRACE12", (row.Substring(129, 1).Trim()));
            result.Add("MRACE13", (row.Substring(130, 1).Trim()));
            result.Add("MRACE14", (row.Substring(131, 1).Trim()));
            result.Add("MRACE15", (row.Substring(132, 1).Trim()));
            result.Add("MRACE16", (row.Substring(133, 30).Trim()));
            result.Add("MRACE17", (row.Substring(163, 30).Trim()));
            result.Add("MRACE18", (row.Substring(193, 30).Trim()));
            result.Add("MRACE19", (row.Substring(223, 30).Trim()));
            result.Add("MRACE20", (row.Substring(253, 30).Trim()));
            result.Add("MRACE21", (row.Substring(283, 30).Trim()));
            result.Add("MRACE22", (row.Substring(313, 30).Trim()));
            result.Add("MRACE23", (row.Substring(343, 30).Trim()));

            result.Add("FEDUC", row.Substring(421, 1).Trim());

            result.Add("FETHNIC1", (row.Substring(423, 1).Trim()));
            result.Add("FETHNIC2", (row.Substring(424, 1).Trim()));
            result.Add("FETHNIC3", (row.Substring(425, 1).Trim()));
            result.Add("FETHNIC4", (row.Substring(426, 1).Trim()));
            result.Add("FETHNIC5", row.Substring(427, 20).Trim());

            result.Add("FRACE1", (row.Substring(447, 1).Trim()));
            result.Add("FRACE2", (row.Substring(448, 1).Trim()));
            result.Add("FRACE3", (row.Substring(449, 1).Trim()));
            result.Add("FRACE4", (row.Substring(450, 1).Trim()));
            result.Add("FRACE5", (row.Substring(451, 1).Trim()));
            result.Add("FRACE6", (row.Substring(452, 1).Trim()));
            result.Add("FRACE7", (row.Substring(453, 1).Trim()));
            result.Add("FRACE8", (row.Substring(454, 1).Trim()));
            result.Add("FRACE9", (row.Substring(455, 1).Trim()));
            result.Add("FRACE10", (row.Substring(456, 1).Trim()));
            result.Add("FRACE11", (row.Substring(457, 1).Trim()));
            result.Add("FRACE12", (row.Substring(458, 1).Trim()));
            result.Add("FRACE13", (row.Substring(459, 1).Trim()));
            result.Add("FRACE14", (row.Substring(460, 1).Trim()));
            result.Add("FRACE15", (row.Substring(461, 1).Trim()));
            result.Add("FRACE16", (row.Substring(462, 30).Trim()));
            result.Add("FRACE17", (row.Substring(492, 30).Trim()));
            result.Add("FRACE18", (row.Substring(522, 30).Trim()));
            result.Add("FRACE19", (row.Substring(552, 30).Trim()));
            result.Add("FRACE20", (row.Substring(582, 30).Trim()));
            result.Add("FRACE21", (row.Substring(612, 30).Trim()));
            result.Add("FRACE22", (row.Substring(642, 30).Trim()));
            result.Add("FRACE23", (row.Substring(672, 30).Trim()));

            result.Add("ATTEND", ATTEND_Rule(row.Substring(750, 1).Trim()));
            result.Add("TRAN", TRAN_Rule(row.Substring(751, 1).Trim()));

            result.Add("DOFP_MO", DOFP_MO_NAT_Rule(row.Substring(752, 2).Trim()));
            result.Add("DOFP_DY", DOFP_DY_NAT_Rule(row.Substring(754, 2).Trim()));
            result.Add("DOFP_YR", DOFP_YR_NAT_Rule(row.Substring(756, 4).Trim()));
            result.Add("DOLP_MO", DOLP_MO_NAT_Rule(row.Substring(760, 2).Trim()));
            result.Add("DOLP_DY", DOLP_DY_NAT_Rule(row.Substring(762, 2).Trim()));
            result.Add("DOLP_YR", DOLP_YR_NAT_Rule(row.Substring(764, 4).Trim()));

            result.Add("NPREV", NPREV_Rule(row.Substring(768, 2).Trim()));
            result.Add("HFT", HFT_Rule(row.Substring(771, 1).Trim()));
            result.Add("HIN", HIN_Rule(row.Substring(772, 2).Trim()));
            result.Add("PWGT", PWGT_Rule(row.Substring(775, 3).Trim()));
            result.Add("DWGT", DWGT_Rule(row.Substring(779, 3).Trim()));
            result.Add("WIC", WIC_Rule(row.Substring(783, 1).Trim()));
            result.Add("PLBL", PLBL_Rule(row.Substring(784, 2).Trim()));
            result.Add("PLBD", PLBD_Rule(row.Substring(786, 2).Trim()));
            result.Add("POPO", POPO_Rule(row.Substring(788, 2).Trim()));
            result.Add("MLLB", MLLB_Rule(row.Substring(790, 2).Trim()));
            result.Add("YLLB", YLLB_Rule(row.Substring(792, 4).Trim()));
            result.Add("MOPO", MOPO_Rule(row.Substring(796, 2).Trim()));
            result.Add("YOPO", YOPO_Rule(row.Substring(798, 4).Trim()));

            result.Add("CIGPN", (row.Substring(802, 2).Trim()));
            result.Add("CIGFN", (row.Substring(804, 2).Trim()));
            result.Add("CIGSN", (row.Substring(806, 2).Trim()));
            result.Add("CIGLN", (row.Substring(808, 2).Trim()));

            result.Add("PAY", PAY_Rule(row.Substring(810, 1).Trim()));
            result.Add("DLMP_YR", DLMP_YR_Rule(row.Substring(811, 4).Trim()));
            result.Add("DLMP_MO", DLMP_MO_Rule(row.Substring(815, 2).Trim()));
            result.Add("DLMP_DY", DLMP_DY_Rule(row.Substring(817, 2).Trim()));

            result.Add("PDIAB", PDIAB_NAT_Rule(row.Substring(819, 1).Trim()));
            result.Add("GDIAB", GDIAB_NAT_Rule(row.Substring(820, 1).Trim()));
            result.Add("PHYPE", PHYPE_NAT_Rule(row.Substring(821, 1).Trim()));
            result.Add("GHYPE", GHYPE_NAT_Rule(row.Substring(822, 1).Trim()));
            result.Add("PPB", PPB_NAT_Rule(row.Substring(823, 1).Trim()));
            result.Add("PPO", PPO_NAT_Rule(row.Substring(824, 1).Trim()));
            result.Add("INFT", INFT_NAT_Rule(row.Substring(826, 1).Trim()));
            result.Add("PCES", PCES_NAT_Rule(row.Substring(827, 1).Trim()));

            result.Add("NPCES", NPCES_Rule(row.Substring(828, 2).Trim()));

            result.Add("GON", GON_NAT_Rule(row.Substring(831, 1).Trim()));
            result.Add("SYPH", SYPH_NAT_Rule(row.Substring(832, 1).Trim()));
            result.Add("HSV", HSV_NAT_Rule(row.Substring(833, 1).Trim()));
            result.Add("CHAM", CHAM_NAT_Rule(row.Substring(834, 1).Trim()));
            result.Add("HEPB", HEPB_NAT_Rule(row.Substring(835, 1).Trim()));
            result.Add("HEPC", HEPC_NAT_Rule(row.Substring(836, 1).Trim()));
            result.Add("CERV", CERV_NAT_Rule(row.Substring(837, 1).Trim()));
            result.Add("TOC", TOC_NAT_Rule(row.Substring(838, 1).Trim()));
            result.Add("ECVS", ECVS_NAT_Rule(row.Substring(839, 1).Trim()));
            result.Add("ECVF", ECVF_NAT_Rule(row.Substring(840, 1).Trim()));
            result.Add("PROM", PROM_NAT_Rule(row.Substring(841, 1).Trim()));
            result.Add("PRIC", PRIC_NAT_Rule(row.Substring(842, 1).Trim()));
            result.Add("PROL", PROL_NAT_Rule(row.Substring(843, 1).Trim()));
            result.Add("INDL", INDL_NAT_Rule(row.Substring(844, 1).Trim()));
            result.Add("AUGL", AUGL_NAT_Rule(row.Substring(845, 1).Trim()));
            result.Add("NVPR", NVPR_NAT_Rule(row.Substring(846, 1).Trim()));
            result.Add("STER", STER_NAT_Rule(row.Substring(847, 1).Trim()));
            result.Add("ANTB", ANTB_NAT_Rule(row.Substring(848, 1).Trim()));
            result.Add("CHOR", CHOR_NAT_Rule(row.Substring(849, 1).Trim()));
            result.Add("MECS", MECS_NAT_Rule(row.Substring(850, 1).Trim()));
            result.Add("FINT", FINT_NAT_Rule(row.Substring(851, 1).Trim()));
            result.Add("ESAN", ESAN_NAT_Rule(row.Substring(852, 1).Trim()));

            result.Add("ATTF", ATTF_Rule(row.Substring(853, 1).Trim()));
            result.Add("ATTV", ATTV_Rule(row.Substring(854, 1).Trim()));
            result.Add("PRES", PRES_Rule(row.Substring(855, 1).Trim()));
            result.Add("ROUT", ROUT_Rule(row.Substring(856, 1).Trim()));

            result.Add("MTR", MTR_NAT_Rule(row.Substring(858, 1).Trim()));
            result.Add("PLAC", PLAC_NAT_Rule(row.Substring(859, 1).Trim()));
            result.Add("RUT", RUT_NAT_Rule(row.Substring(860, 1).Trim()));
            result.Add("UHYS", UHYS_NAT_Rule(row.Substring(861, 1).Trim()));
            result.Add("AINT", AINT_NAT_Rule(row.Substring(862, 1).Trim()));
            result.Add("UOPR", UOPR_NAT_Rule(row.Substring(863, 1).Trim()));
            result.Add("BWG", (row.Substring(864, 4).Trim()));

            result.Add("OWGEST", OWGEST_Rule(row.Substring(869, 2).Trim()));
            result.Add("APGAR5", APGAR5_Rule(row.Substring(872, 2).Trim()));
            result.Add("APGAR10", APGAR10_Rule(row.Substring(874, 2).Trim()));

            result.Add("PLUR", (row.Substring(876, 2).Trim()));

            result.Add("SORD", SORD_Rule(row.Substring(878, 2).Trim()));



            result.Add("ITRAN", ITRAN_Rule(row.Substring(908, 1).Trim()));
            result.Add("ILIV", ILIV_Rule(row.Substring(909, 1).Trim()));
            result.Add("BFED", BFED_Rule(row.Substring(910, 1).Trim()));

            result.Add("MAGER", (row.Substring(919, 2).Trim()));
            result.Add("FAGER", (row.Substring(921, 2).Trim()));
            result.Add("EHYPE", EHYPE_NAT_Rule(row.Substring(923, 1).Trim()));
            result.Add("INFT_DRG", INFT_DRG_NAT_Rule(row.Substring(924, 1).Trim()));
            result.Add("INFT_ART", INFT_ART_NAT_Rule(row.Substring(925, 1).Trim()));

            result.Add("BIRTH_CO", row.Substring(1157, 25).Trim());
            result.Add("BRTHCITY", row.Substring(1182, 50).Trim());
            result.Add("HOSP", row.Substring(1232, 50).Trim());
            result.Add("MOMFNAME", row.Substring(1282, 50).Trim());
            result.Add("MOMMIDDL", row.Substring(1332, 50).Trim());
            result.Add("MOMLNAME", row.Substring(1382, 50).Trim());
            result.Add("MOMMAIDN", row.Substring(1539, 50).Trim());
            result.Add("STNUM", row.Substring(1596, 10).Trim());
            result.Add("PREDIR", row.Substring(1606, 10).Trim());
            result.Add("STNAME", row.Substring(1616, 28).Trim());
            result.Add("STDESIG", row.Substring(1644, 10).Trim());
            result.Add("POSTDIR", row.Substring(1654, 10).Trim());
            result.Add("UNUM", row.Substring(1664, 7).Trim());
            result.Add("ZIPCODE", row.Substring(1721, 9).Trim());
            result.Add("COUNTYTXT", row.Substring(1730, 28).Trim());
            result.Add("CITYTEXT", row.Substring(1758, 28).Trim());
            result.Add("MOM_OC_T", row.Substring(2021, 25).Trim());
            result.Add("DAD_OC_T", row.Substring(2049, 25).Trim());
            result.Add("MOM_IN_T", row.Substring(2077, 25).Trim());
            result.Add("DAD_IN_T", row.Substring(2105, 25).Trim());

            result.Add("FBPLACD_ST_TER_C", FBPLACD_ST_TER_C_NAT_Rule(row.Substring(2133, 2).Trim()));
            result.Add("FBPLACE_CNT_C", FBPLACE_CNT_C_NAT_Rule(row.Substring(2135, 2).Trim()));

            result.Add("HOSPFROM", row.Substring(2283, 50).Trim());
            result.Add("HOSPTO", row.Substring(2333, 50).Trim());
            result.Add("ATTEND_OTH_TXT", row.Substring(2383, 20).Trim());
            result.Add("ATTEND_NPI", row.Substring(2826, 12).Trim());
            result.Add("INF_MED_REC_NUM", row.Substring(2921, 15).Trim());
            result.Add("MOM_MED_REC_NUM", row.Substring(2936, 15).Trim());



            result.Add("COD18a1", row.Substring(587-1, 1).Trim());
            result.Add("COD18a2", row.Substring(588-1, 1).Trim());
            result.Add("COD18a3", row.Substring(589-1, 1).Trim());
            result.Add("COD18a4", row.Substring(590-1, 1).Trim());
            result.Add("COD18a5", row.Substring(591-1, 1).Trim());
            result.Add("COD18a6", row.Substring(592-1, 1).Trim());
            result.Add("COD18a7", row.Substring(593-1, 1).Trim());
            result.Add("COD18a8", row.Substring(594-1, 60).Trim());
            result.Add("COD18a9", row.Substring(654-1, 60).Trim());
            result.Add("COD18a10", row.Substring(714-1, 60).Trim());
            result.Add("COD18a11", row.Substring(774-1, 60).Trim());
            result.Add("COD18a12", row.Substring(834-1, 60).Trim());
            result.Add("COD18a13", row.Substring(894-1, 60).Trim());
            result.Add("COD18a14", row.Substring(954-1, 60).Trim());
            result.Add("COD18b1", row.Substring(1014-1, 1).Trim());
            result.Add("COD18b2", row.Substring(1015-1, 1).Trim());
            result.Add("COD18b3", row.Substring(1016-1, 1).Trim());
            result.Add("COD18b4", row.Substring(1017-1, 1).Trim());
            result.Add("COD18b5", row.Substring(1018-1, 1).Trim());
            result.Add("COD18b6", row.Substring(1019-1, 1).Trim());
            result.Add("COD18b7", row.Substring(1020-1, 1).Trim());
            result.Add("COD18b8", row.Substring(1021-1, 240).Trim());
            result.Add("COD18b9", row.Substring(1261-1, 240).Trim());
            result.Add("COD18b10", row.Substring(1501-1, 240).Trim());
            result.Add("COD18b11", row.Substring(1741-1, 240).Trim());
            result.Add("COD18b12", row.Substring(1981-1, 240).Trim());
            result.Add("COD18b13", row.Substring(2221-1, 240).Trim());
            result.Add("COD18b14", row.Substring(2461-1, 240).Trim());
            result.Add("ICOD", row.Substring(2701-1, 5).Trim());
            result.Add("OCOD1", row.Substring(2706-1, 5).Trim());
            result.Add("OCOD2", row.Substring(2711-1, 5).Trim());
            result.Add("OCOD3", row.Substring(2716-1, 5).Trim());
            result.Add("OCOD4", row.Substring(2721-1, 5).Trim());
            result.Add("OCOD5", row.Substring(2726-1, 5).Trim());
            result.Add("OCOD6", row.Substring(2731-1, 5).Trim());
            result.Add("OCOD7", row.Substring(2736-1, 5).Trim());

            result.Add("AVEN1", AVEN1_NAT_Rule(row.Substring(889, 1).Trim()));
            result.Add("AVEN6", AVEN6_NAT_Rule(row.Substring(890, 1).Trim()));
            result.Add("NICU", NICU_NAT_Rule(row.Substring(891, 1).Trim()));
            result.Add("SURF", SURF_NAT_Rule(row.Substring(892, 1).Trim()));
            result.Add("ANTI", ANTI_NAT_Rule(row.Substring(893, 1).Trim()));
            result.Add("SEIZ", SEIZ_NAT_Rule(row.Substring(894, 1).Trim()));
            result.Add("BINJ", BINJ_NAT_Rule(row.Substring(895, 1).Trim()));
            result.Add("ANEN", ANEN_NAT_Rule(row.Substring(896, 1).Trim()));
            result.Add("MNSB", MNSB_NAT_Rule(row.Substring(897, 1).Trim()));
            result.Add("CCHD", CCHD_NAT_Rule(row.Substring(898, 1).Trim()));
            result.Add("CDH", CDH_NAT_Rule(row.Substring(899, 1).Trim()));
            result.Add("OMPH", OMPH_NAT_Rule(row.Substring(900, 1).Trim()));
            result.Add("GAST", GAST_NAT_Rule(row.Substring(901, 1).Trim()));
            result.Add("LIMB", LIMB_NAT_Rule(row.Substring(902, 1).Trim()));
            result.Add("CL", CL_NAT_Rule(row.Substring(903, 1).Trim()));
            result.Add("CP", CP_NAT_Rule(row.Substring(904, 1).Trim()));
            result.Add("DOWT", DOWT_NAT_Rule(row.Substring(905, 1).Trim()));
            result.Add("CDIT", CDIT_NAT_Rule(row.Substring(906, 1).Trim()));
            result.Add("HYPO", HYPO_NAT_Rule(row.Substring(907, 1).Trim()));
            result.Add("TLAB", TLAB_NAT_Rule(row.Substring(857, 1).Trim()));
            result.Add("RECORD_TYPE", (row.Substring(3999, 1).Trim()));
            result.Add("ISEX", ISEX_NAT_Rule(row.Substring(29, 1).Trim()));
            listResults.Add(result);
        }

        return listResults;
    }

    

    private List<Dictionary<string, string>> fet_get_header(List<string> rows)
    {
        var listResults = new List<Dictionary<string, string>>();

        foreach (var row in rows)
        {
            var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            result.Add("FDOD_YR", row.Substring(0, 4).Trim());
            result.Add("FILENO", row.Substring(6, 6).Trim());
            result.Add("AUXNO", row.Substring(13, 12).Trim());
            result.Add("TD", TD_FET_Rule(row.Substring(25, 4).Trim()));
            result.Add("FDOD_MO", row.Substring(30, 2).Trim());
            result.Add("FDOD_DY", row.Substring(32, 2).Trim());
            result.Add("FNPI", row.Substring(38, 12).Trim());
            result.Add("MDOB_YR", MDOB_YR_FET_Rule(row.Substring(54, 4).Trim()));
            result.Add("MDOB_MO", MDOB_MO_FET_Rule(row.Substring(58, 2).Trim()));
            result.Add("MDOB_DY", MDOB_DY_FET_Rule(row.Substring(60, 2).Trim()));
            result.Add("STATEC", (row.Substring(75, 2).Trim()));
            result.Add("FDOB_YR", FDOB_YR_FET_Rule(row.Substring(80, 4).Trim()));
            result.Add("FDOB_MO", FDOB_MO_FET_Rule(row.Substring(84, 2).Trim()));
            result.Add("MARN", MARN_FET_Rule(row.Substring(90, 1).Trim()));
            result.Add("MEDUC", MEDUC_FET_Rule(row.Substring(92, 1).Trim()));
            result.Add("METHNIC5", row.Substring(98, 20).Trim());
            result.Add("ATTEND", ATTEND_FET_Rule(row.Substring(421, 1).Trim()));
            result.Add("TRAN", TRAN_FET_Rule(row.Substring(422, 1).Trim()));
            result.Add("NPREV", NPREV_FET_Rule(row.Substring(439, 2).Trim()));
            result.Add("HFT", HFT_FET_Rule(row.Substring(442, 1).Trim()));
            result.Add("HIN", HIN_FET_Rule(row.Substring(443, 2).Trim()));
            result.Add("PWGT", PWGT_FET_Rule(row.Substring(446, 3).Trim()));
            result.Add("DWGT", DWGT_FET_Rule(row.Substring(450, 3).Trim()));
            result.Add("WIC", WIC_FET_Rule(row.Substring(454, 1).Trim()));
            result.Add("PLBL", PLBL_FET_Rule(row.Substring(455, 2).Trim()));
            result.Add("PLBD", PLBD_FET_Rule(row.Substring(457, 2).Trim()));
            result.Add("POPO", POPO_FET_Rule(row.Substring(459, 2).Trim()));
            result.Add("MLLB", MLLB_FET_Rule(row.Substring(461, 2).Trim()));
            result.Add("YLLB", YLLB_FET_Rule(row.Substring(463, 4).Trim()));
            result.Add("MOPO", MOPO_FET_Rule(row.Substring(467, 2).Trim()));
            result.Add("YOPO", YOPO_FET_Rule(row.Substring(469, 4).Trim()));
            result.Add("DLMP_YR", DLMP_YR_FET_Rule(row.Substring(481, 4).Trim()));
            result.Add("DLMP_MO", DLMP_MO_FET_Rule(row.Substring(485, 2).Trim()));
            result.Add("DLMP_DY", DLMP_DY_FET_Rule(row.Substring(487, 2).Trim()));
            result.Add("NPCES", NPCES_FET_Rule(row.Substring(498, 2).Trim()));
            result.Add("ATTF", ATTF_FET_Rule(row.Substring(511, 1).Trim()));
            result.Add("ATTV", ATTV_FET_Rule(row.Substring(512, 1).Trim()));
            result.Add("PRES", PRES_FET_Rule(row.Substring(513, 1).Trim()));
            result.Add("ROUT", ROUT_FET_Rule(row.Substring(514, 1).Trim()));
            result.Add("OWGEST", OWGEST_FET_Rule(row.Substring(528, 2).Trim()));
            result.Add("SORD", SORD_FET_Rule(row.Substring(537, 2).Trim()));
            result.Add("HOSP_D", row.Substring(2904, 50).Trim());
            result.Add("ADDRESS_D", row.Substring(3051, 50).Trim());
            result.Add("ZIPCODE_D", row.Substring(3101, 9).Trim());
            result.Add("CNTY_D", row.Substring(3110, 28).Trim());
            result.Add("CITY_D", row.Substring(3138, 28).Trim());
            result.Add("MOMFNAME", row.Substring(3256, 50).Trim());
            result.Add("MOMMNAME", row.Substring(3306, 50).Trim());
            result.Add("MOMLNAME", row.Substring(3356, 50).Trim());
            result.Add("MOMMAIDN", row.Substring(3516, 50).Trim());
            result.Add("STNUM", row.Substring(3576, 10).Trim());
            result.Add("PREDIR", row.Substring(3586, 10).Trim());
            result.Add("STNAME", row.Substring(3596, 50).Trim());
            result.Add("STDESIG", row.Substring(3646, 10).Trim());
            result.Add("POSTDIR", row.Substring(3656, 10).Trim());
            result.Add("APTNUMB", row.Substring(3666, 7).Trim());
            result.Add("ZIPCODE", row.Substring(3723, 9).Trim());
            result.Add("COUNTYTXT", row.Substring(3732, 28).Trim());
            result.Add("CITYTXT", row.Substring(3760, 28).Trim());
            result.Add("MOM_OC_T", row.Substring(4060, 25).Trim());
            result.Add("DAD_OC_T", row.Substring(4088, 25).Trim());
            result.Add("MOM_IN_T", row.Substring(4116, 25).Trim());
            result.Add("DAD_IN_T", row.Substring(4144, 25).Trim());
            result.Add("FEDUC", FEDUC_FET_Rule(row.Substring(4288, 1).Trim()));
            result.Add("FETHNIC5", row.Substring(4294, 20).Trim());
            result.Add("HOSPFROM", row.Substring(4763, 50).Trim());
            result.Add("ATTEND_NPI", row.Substring(4863, 12).Trim());
            result.Add("ATTEND_OTH_TXT", row.Substring(4875, 20).Trim());
            
            result.Add("COD18a1", row.Substring(587-1, 1).Trim());
            result.Add("COD18a2", row.Substring(588-1, 1).Trim());
            result.Add("COD18a3", row.Substring(589-1, 1).Trim());
            result.Add("COD18a4", row.Substring(590-1, 1).Trim());
            result.Add("COD18a5", row.Substring(591-1, 1).Trim());
            result.Add("COD18a6", row.Substring(592-1, 1).Trim());
            result.Add("COD18a7", row.Substring(593-1, 1).Trim());
            result.Add("COD18a8", row.Substring(594-1, 60).Trim());
            result.Add("COD18a9", row.Substring(654-1, 60).Trim());
            result.Add("COD18a10", row.Substring(714-1, 60).Trim());
            result.Add("COD18a11", row.Substring(774-1, 60).Trim());
            result.Add("COD18a12", row.Substring(834-1, 60).Trim());
            result.Add("COD18a13", row.Substring(894-1, 60).Trim());
            result.Add("COD18a14", row.Substring(954-1, 60).Trim());
            result.Add("COD18b1", row.Substring(1014-1, 1).Trim());
            result.Add("COD18b2", row.Substring(1015-1, 1).Trim());
            result.Add("COD18b3", row.Substring(1016-1, 1).Trim());
            result.Add("COD18b4", row.Substring(1017-1, 1).Trim());
            result.Add("COD18b5", row.Substring(1018-1, 1).Trim());
            result.Add("COD18b6", row.Substring(1019-1, 1).Trim());
            result.Add("COD18b7", row.Substring(1020-1, 1).Trim());
            result.Add("COD18b8", row.Substring(1021-1, 240).Trim());
            result.Add("COD18b9", row.Substring(1261-1, 240).Trim());
            result.Add("COD18b10", row.Substring(1501-1, 240).Trim());
            result.Add("COD18b11", row.Substring(1741-1, 240).Trim());
            result.Add("COD18b12", row.Substring(1981-1, 240).Trim());
            result.Add("COD18b13", row.Substring(2221-1, 240).Trim());
            result.Add("COD18b14", row.Substring(2461-1, 240).Trim());
            result.Add("ICOD", row.Substring(2701-1, 5).Trim());
            result.Add("OCOD1", row.Substring(2706-1, 5).Trim());
            result.Add("OCOD2", row.Substring(2711-1, 5).Trim());
            result.Add("OCOD3", row.Substring(2716-1, 5).Trim());
            result.Add("OCOD4", row.Substring(2721-1, 5).Trim());
            result.Add("OCOD5", row.Substring(2726-1, 5).Trim());
            result.Add("OCOD6", row.Substring(2731-1, 5).Trim());
            result.Add("OCOD7", row.Substring(2736-1, 5).Trim());

            result.Add("DSTATE", (row.Substring(4, 2).Trim()));
            result.Add("FSEX", FSEX_FET_Rule(row.Substring(29, 1).Trim()));
            result.Add("DPLACE", (row.Substring(37, 1).Trim()));
            result.Add("BPLACEC_ST_TER", BPLACEC_ST_TER_FET_Rule(row.Substring(63, 2).Trim()));
            result.Add("BPLACEC_CNT", BPLACEC_CNT_FET_Rule(row.Substring(65, 2).Trim()));

            result.Add("METHNIC1", (row.Substring(94, 1).Trim()));
            result.Add("METHNIC2", (row.Substring(95, 1).Trim()));
            result.Add("METHNIC3", (row.Substring(96, 1).Trim()));
            result.Add("METHNIC4", (row.Substring(97, 1).Trim()));

            result.Add("MRACE1", (row.Substring(118, 1).Trim()));
            result.Add("MRACE2", (row.Substring(119, 1).Trim()));
            result.Add("MRACE3", (row.Substring(120, 1).Trim()));
            result.Add("MRACE4", (row.Substring(121, 1).Trim()));
            result.Add("MRACE5", (row.Substring(122, 1).Trim()));
            result.Add("MRACE6", (row.Substring(123, 1).Trim()));
            result.Add("MRACE7", (row.Substring(124, 1).Trim()));
            result.Add("MRACE8", (row.Substring(125, 1).Trim()));
            result.Add("MRACE9", (row.Substring(126, 1).Trim()));
            result.Add("MRACE10", (row.Substring(127, 1).Trim()));
            result.Add("MRACE11", (row.Substring(128, 1).Trim()));
            result.Add("MRACE12", (row.Substring(129, 1).Trim()));
            result.Add("MRACE13", (row.Substring(130, 1).Trim()));
            result.Add("MRACE14", (row.Substring(131, 1).Trim()));
            result.Add("MRACE15", (row.Substring(132, 1).Trim()));
            result.Add("MRACE16", (row.Substring(133, 30).Trim()));
            result.Add("MRACE17", (row.Substring(163, 30).Trim()));
            result.Add("MRACE18", (row.Substring(193, 30).Trim()));
            result.Add("MRACE19", (row.Substring(223, 30).Trim()));
            result.Add("MRACE20", (row.Substring(253, 30).Trim()));
            result.Add("MRACE21", (row.Substring(283, 30).Trim()));
            result.Add("MRACE22", (row.Substring(313, 30).Trim()));
            result.Add("MRACE23", (row.Substring(343, 30).Trim()));

            result.Add("DOFP_MO", DOFP_MO_FET_Rule(row.Substring(423, 2).Trim()));
            result.Add("DOFP_DY", DOFP_DY_FET_Rule(row.Substring(425, 2).Trim()));
            result.Add("DOFP_YR", DOFP_YR_FET_Rule(row.Substring(427, 4).Trim()));
            result.Add("DOLP_MO", DOLP_MO_FET_Rule(row.Substring(431, 2).Trim()));
            result.Add("DOLP_DY", DOLP_DY_FET_Rule(row.Substring(433, 2).Trim()));
            result.Add("DOLP_YR", DOLP_YR_FET_Rule(row.Substring(435, 4).Trim()));

            result.Add("CIGPN", (row.Substring(473, 2).Trim()));
            result.Add("CIGFN", (row.Substring(475, 2).Trim()));
            result.Add("CIGSN", (row.Substring(477, 2).Trim()));
            result.Add("CIGLN", (row.Substring(479, 2).Trim()));
            result.Add("PDIAB", PDIAB_FET_Rule(row.Substring(489, 1).Trim()));
            result.Add("GDIAB", GDIAB_FET_Rule(row.Substring(490, 1).Trim()));
            result.Add("PHYPE", PHYPE_FET_Rule(row.Substring(491, 1).Trim()));
            result.Add("GHYPE", GHYPE_FET_Rule(row.Substring(492, 1).Trim()));
            result.Add("PPB", PPB_FET_Rule(row.Substring(493, 1).Trim()));
            result.Add("PPO", PPO_FET_Rule(row.Substring(494, 1).Trim()));
            result.Add("INFT", INFT_FET_Rule(row.Substring(496, 1).Trim()));
            result.Add("PCES", PCES_FET_Rule(row.Substring(497, 1).Trim()));
            result.Add("GON", GON_FET_Rule(row.Substring(501, 1).Trim()));
            result.Add("SYPH", SYPH_FET_Rule(row.Substring(502, 1).Trim()));
            result.Add("HSV", HSV_FET_Rule(row.Substring(503, 1).Trim()));
            result.Add("CHAM", CHAM_FET_Rule(row.Substring(504, 1).Trim()));
            result.Add("LM", LM_FET_Rule(row.Substring(505, 1).Trim()));
            result.Add("GBS", GBS_FET_Rule(row.Substring(506, 1).Trim()));
            result.Add("CMV", CMV_FET_Rule(row.Substring(507, 1).Trim()));
            result.Add("B19", B19_FET_Rule(row.Substring(508, 1).Trim()));
            result.Add("TOXO", TOXO_FET_Rule(row.Substring(509, 1).Trim()));
            result.Add("OTHERI", OTHERI_FET_Rule(row.Substring(510, 1).Trim()));
            result.Add("TLAB", TLAB_FET_Rule(row.Substring(515, 1).Trim()));
            result.Add("MTR", MTR_FET_Rule(row.Substring(517, 1).Trim()));
            result.Add("PLAC", PLAC_FET_Rule(row.Substring(518, 1).Trim()));
            result.Add("RUT", RUT_FET_Rule(row.Substring(519, 1).Trim()));
            result.Add("UHYS", UHYS_FET_Rule(row.Substring(520, 1).Trim()));
            result.Add("AINT", AINT_FET_Rule(row.Substring(521, 1).Trim()));
            result.Add("UOPR", UOPR_FET_Rule(row.Substring(522, 1).Trim()));
            result.Add("FWG", (row.Substring(523, 4).Trim()));
            result.Add("PLUR", (row.Substring(535, 2).Trim()));
            result.Add("ANEN", ANEN_FET_Rule(row.Substring(548, 1).Trim()));
            result.Add("MNSB", MNSB_FET_Rule(row.Substring(549, 1).Trim()));
            result.Add("CCHD", CCHD_FET_Rule(row.Substring(550, 1).Trim()));
            result.Add("CDH", CDH_FET_Rule(row.Substring(551, 1).Trim()));
            result.Add("OMPH", OMPH_FET_Rule(row.Substring(552, 1).Trim()));
            result.Add("GAST", GAST_FET_Rule(row.Substring(553, 1).Trim()));
            result.Add("LIMB", LIMB_FET_Rule(row.Substring(554, 1).Trim()));
            result.Add("CL", CL_FET_Rule(row.Substring(555, 1).Trim()));
            result.Add("CP", CP_FET_Rule(row.Substring(556, 1).Trim()));
            result.Add("DOWT", DOWT_FET_Rule(row.Substring(557, 1).Trim()));
            result.Add("CDIT", CDIT_FET_Rule(row.Substring(558, 1).Trim()));
            result.Add("HYPO", HYPO_FET_Rule(row.Substring(559, 1).Trim()));
            result.Add("MAGER", (row.Substring(568, 2).Trim()));
            result.Add("FAGER", (row.Substring(570, 2).Trim()));
            result.Add("EHYPE", EHYPE_FET_Rule(row.Substring(572, 1).Trim()));
            result.Add("INFT_DRG", INFT_DRG_FET_Rule(row.Substring(573, 1).Trim()));
            result.Add("INFT_ART", INFT_ART_FET_Rule(row.Substring(574, 1).Trim()));
            result.Add("HSV1", HSV1_FET_Rule(row.Substring(2740, 1).Trim()));
            result.Add("HIV", HIV_FET_Rule(row.Substring(2741, 1).Trim()));
            result.Add("FBPLACD_ST_TER_C", FBPLACD_ST_TER_C_FET_Rule(row.Substring(4172, 2).Trim()));
            result.Add("FBPLACE_CNT_C", FBPLACE_CNT_C_FET_Rule(row.Substring(4174, 2).Trim()));

            result.Add("FETHNIC1", (row.Substring(4290, 1).Trim()));
            result.Add("FETHNIC2", (row.Substring(4291, 1).Trim()));
            result.Add("FETHNIC3", (row.Substring(4292, 1).Trim()));
            result.Add("FETHNIC4", (row.Substring(4293, 1).Trim()));

            result.Add("FRACE1", (row.Substring(4314, 1).Trim()));
            result.Add("FRACE2", (row.Substring(4315, 1).Trim()));
            result.Add("FRACE3", (row.Substring(4316, 1).Trim()));
            result.Add("FRACE4", (row.Substring(4317, 1).Trim()));
            result.Add("FRACE5", (row.Substring(4318, 1).Trim()));
            result.Add("FRACE6", (row.Substring(4319, 1).Trim()));
            result.Add("FRACE7", (row.Substring(4320, 1).Trim()));
            result.Add("FRACE8", (row.Substring(4321, 1).Trim()));
            result.Add("FRACE9", (row.Substring(4322, 1).Trim()));
            result.Add("FRACE10",(row.Substring(4323, 1).Trim()));
            result.Add("FRACE11",(row.Substring(4324, 1).Trim()));
            result.Add("FRACE12",(row.Substring(4325, 1).Trim()));
            result.Add("FRACE13",(row.Substring(4326, 1).Trim()));
            result.Add("FRACE14",(row.Substring(4327, 1).Trim()));
            result.Add("FRACE15",(row.Substring(4328, 1).Trim()));
            result.Add("FRACE16",(row.Substring(4329, 30).Trim()));
            result.Add("FRACE17",(row.Substring(4359, 30).Trim()));
            result.Add("FRACE18",(row.Substring(4389, 30).Trim()));
            result.Add("FRACE19",(row.Substring(4419, 30).Trim()));
            result.Add("FRACE20",(row.Substring(4449, 30).Trim()));
            result.Add("FRACE21",(row.Substring(4479, 30).Trim()));
            result.Add("FRACE22",(row.Substring(4509, 30).Trim()));
            result.Add("FRACE23",(row.Substring(4539, 30).Trim()));

            result.Add("RECORD_TYPE", (row.Substring(5999, 1).Trim()));



            listResults.Add(result);
        }

        return listResults;
    }

    private string TB_NAT_Rule(string value)
    {
        string parsedValue = "";

        if (!string.IsNullOrWhiteSpace(value))
        {
            if (value == "9999")
                parsedValue = "";
            else
            {
                parsedValue = ConvertHHmm_To_MMRIATime(value);
            }
        }

        return parsedValue;
    }

    private string TD_FET_Rule(string value)
    {
        string parsedValue = "";

        if(!string.IsNullOrWhiteSpace(value))
        {
            if (value == "9999")
                parsedValue = "";
            else
            {
                parsedValue = parseHHmm_To_MMRIATime(value);
            }
        }

        return parsedValue;
    }

    private static string ConvertHHmm_To_MMRIATime(string value)
    {
        string result = value;
        try
        {
            /*
                42 => 00:42:00
                1945 => 19:45:00
                1530 => 15:30:00
                815 => 08:15:00


                42 => 00:42
                1945 => 19:45
                1530 => 15:30
                815 => 08:15
            */
            //Ensure three digit times parse with 4 digits, e.g. 744 becomes 0744 and will be parsed to 7:44 AM
            switch (value.Length)
            {
                case 0:
                    break;
                case 1:
                    result = $"00:0{value}:00";
                    break;
                case 2:
                    result = $"00:{value}:00";
                    break;
                case 3:
                    result = $"0{value[0]}:{value[1..^0]}:00";
                    break;
                case 4:
                    result = $"{value[0..2]}:{value[2..^0]}:00";
                    break;


                default:
                    //result = $"{value.Substring(0,2)}:{value.Substring(2,2)}";
                    System.Console.Write($"ConvertHHmm_To_MMRIATime unable to convert {value}");
                    break;
            }
        }
        catch (Exception ex)
        {
            //Error parsing, eat it and put exact text in as to not lose data on import
            //result = value;
        }

        return result;
    }

    

    private static string parseHHmm_To_MMRIATime(string value)
    {
        string parsedValue;
        try
        {
            //Ensure three digit times parse with 4 digits, e.g. 744 becomes 0744 and will be parsed to 7:44 AM
            if (value.Length == 3)
                value = $"0{value}";

            parsedValue = DateTime.ParseExact(value, "HHmm", CultureInfo.CurrentCulture).ToString("h:mm tt");
        }
        catch (Exception ex)
        {
            //Error parsing, eat it and put exact text in as to not lose data on import
            parsedValue = value;
        }

        return parsedValue;
    }

    private string STATEC_FET_Rule(string value)
    {
        //"Map XX --> 9999 (blank)
        //Map ZZ --> 9999(blank)
        //Map all other values to MMRIA field state listing"

        if (string.IsNullOrWhiteSpace(value) || value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    #region Rules Section

    //CALCULATE MOTHERS AGE AT DELIVERY ON BC
    /*
    path=birth_fetal_death_certificate_parent/demographic_of_mother/age
    event=onfocus
    */
    private string age_delivery(string dob_YR, string dob_MO, string dob_day, string dodeliv_YR, string dodeliv_MO, string dodeliv_day)
    {
        string years = "";
        int.TryParse(dob_YR, out int start_year);
        int.TryParse(dob_MO, out int start_month);
        int.TryParse(dob_day, out int start_day);
        int.TryParse(dodeliv_YR, out int end_year);
        int.TryParse(dodeliv_MO, out int end_month);
        int.TryParse(dodeliv_day, out int end_day);
        //int.TryParse(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year, out int end_year);
        //int.TryParse(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month, out int end_month);
        //int.TryParse(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day, out int end_day);

        if
        (
            DateTime.TryParse($"{start_year}/{start_month}/{start_day}", out DateTime birthDateCheck) == true &&
            DateTime.TryParse($"{end_year}/{end_month}/{end_day}", out DateTime endDateCheck) == true
        )
        {
            var start_date = new DateTime(start_year, start_month, start_day).AddMonths(-1);
            var end_date = new DateTime(end_year, end_month, end_day).AddMonths(-1);
            years = calc_years(start_date, end_date);
        }

        return years;
    }
    //CALCULATE FATHERS AGE AT DELIVERY ON BC
    /*
    path=birth_fetal_death_certificate_parent/demographic_of_father/age
    event=onfocus
    */
//    function fathers_age_delivery(p_control)
//    {
//        var years = null;
//        var start_year = parseInt(this.date_of_birth.year);
//        var start_month = parseInt(this.date_of_birth.month);
//        var start_day = 1;
//        var end_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
//        var end_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
//        var end_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
//        if
//        (
//            $global.isValidDate(start_year, start_month, start_day) == true &&
//            $global.isValidDate(end_year, end_month, end_day) == true
//        )
//{
//            var start_date = new Date(start_year, start_month - 1, start_day);
//            var end_date = new Date(end_year, end_month - 1, end_day);
//            var years = $global.calc_years(start_date, end_date);
//            this.age = years;
//            p_control.value = this.age;
//        }
//    }

    private string calc_years(DateTime p_start_date, DateTime p_end_date)
    {
        var years = "";

        var age = p_end_date.Year - p_start_date.Year;
        if (p_end_date.DayOfYear < p_start_date.DayOfYear)
            age = age - 1;

        years = age.ToString();

        return years;
    }

    #region MOR Rules

    private string DPLACE_Rule(string value)
    {
        /*"1 --> dcdi_doi_hospi = 0 and dcdi_doo_hospi = 9999 (blank)
            2 --> dcdi_doi_hospi = 1 and dcdi_doo_hospi = 9999 (blank)
            3 --> dcdi_doi_hospi = 2 and dcdi_doo_hospi = 9999 (blank)
            4 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 2
            5 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 0
            6 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 1 
            7 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 3
            9 --> dcdi_doi_hosp = 7777 (unknown) and dcdi_doo_hospi = 7777 (unknown) "
                */
        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "9999";
                break;
            case "5":
                value = "9999";
                break;
            case "6":
                value = "9999";
                break;
            case "7":
                value = "9999";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string DPLACE_Outside_of_hospital_Rule(string value)
    {
        /*"1 --> dcdi_doi_hospi = 0 and dcdi_doo_hospi = 9999 (blank)
            2 --> dcdi_doi_hospi = 1 and dcdi_doo_hospi = 9999 (blank)
            3 --> dcdi_doi_hospi = 2 and dcdi_doo_hospi = 9999 (blank)
            4 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 2
            5 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 0
            6 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 1 
            7 --> dcdi_doi_hospi = 9999 (blank) and dcdi_doo_hospi = 3
            9 --> dcdi_doi_hosp = 7777 (unknown) and dcdi_doo_hospi = 7777 (unknown) "
                */
        switch (value?.ToUpper())
        {
            case "1":
                value = "9999";
                break;
            case "2":
                value = "9999";
                break;
            case "3":
                value = "9999";
                break;
            case "4":
                value = "2";
                break;
            case "5":
                value = "0";
                break;
            case "6":
                value = "1";
                break;
            case "7":
                value = "3";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string STINJURY_Rule(string value)
    {
        var result = value;

        if (StateDisplayToValue.ContainsKey(value))
        {
            result = StateDisplayToValue[value];
        }

        return result;
    }

    private string STATETEXT_D_Rule(string value)
    {
        var result = value;

        if (StateDisplayToValue.ContainsKey(value))
        {
            result = StateDisplayToValue[value];
        }

        return result;
    }

    private string PLACE_OF_LAST_RESIDENCE_street_Rule(string stnum_r, string predir_r, string stname_r, string stdesig_r, string postdir_r)
    {
        //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
        string determinedValue = $"{stnum_r} {predir_r} {stname_r} {stdesig_r} {postdir_r}";

        return determinedValue;
    }

    private string ADDRESS_OF_DEATH_street_Rule(string stnum_d, string predir_d, string stname_d, string stdesig_d, string postdir_d)
    {
        //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
        string determinedValue = $"{stnum_d} {predir_d} {stname_d} {stdesig_d} {postdir_d}";

        return determinedValue;
    }

    private string RACE_other_race_Rule(string race22, string race23)
    {
        //"Combine RACE22 and RACE23 into one field (dcr_o_race), separated by pipe delimiter. 
        //1.Transfer string verbatim from RACE22 to MMRIA field.
        //2.Transfer string verbatim from RACE23 and add to same MMRIA field.
        //3.If both RACE22 and RACE23 are empty, leave MMRIA field empty(blank)."
        string determinedValue = string.Empty;

        if (!string.IsNullOrWhiteSpace(race22) && !string.IsNullOrWhiteSpace(race23))
            determinedValue = $"{race22}|{race23}";
        else if (!string.IsNullOrWhiteSpace(race22))
            determinedValue = race22;
        else if (!string.IsNullOrWhiteSpace(race23))
            determinedValue = race23;

        return determinedValue;
    }

    private string RACE_other_pacific_islander_Rule(string race20, string race21)
    {
        //"Combine RACE20 and RACE21 into one field (dcr_op_islan), separated by pipe delimiter. 
        //1.Transfer string verbatim from RACE20 to MMRIA field.
        //2.Transfer string verbatim from RACE21 and add to same MMRIA field.
        //3.If both RACE20 and RACE21 are empty, leave MMRIA field empty(blank)."
        string determinedValue = string.Empty;

        if (!string.IsNullOrWhiteSpace(race20) && !string.IsNullOrWhiteSpace(race21))
            determinedValue = $"{race20}|{race21}";
        else if (!string.IsNullOrWhiteSpace(race20))
            determinedValue = race20;
        else if (!string.IsNullOrWhiteSpace(race21))
            determinedValue = race21;

        return determinedValue;
    }

    private string RACE_other_asian_Rule(string race18, string race19)
    {
        //"Combine RACE18 and RACE19 into one field (dcr_o_asian), separated by pipe delimiter.
        //1.Transfer string verbatim from RACE18 to MMRIA field.
        //2.Transfer string verbatim from RACE19 and add to same MMRIA field.
        //3.If both RACE18 and RACE19 are empty, leave MMRIA field empty(blank)."
        //Defaulting to blank
        string determinedValue = string.Empty;

        if (!string.IsNullOrWhiteSpace(race18) && !string.IsNullOrWhiteSpace(race19))
            determinedValue = $"{race18}|{race19}";
        else if (!string.IsNullOrWhiteSpace(race18))
            determinedValue = race18;
        else if (!string.IsNullOrWhiteSpace(race19))
            determinedValue = race19;

        return determinedValue;

    }

    private string RACE_Principal_Tribe_Rule(string race16, string race17)
    {
        //"Combine RACE16 and RACE17 into one field (dcr_p_tribe), separated by pipe delimiter. 
        //1.Transfer string verbatim from RACE16 to MMRIA field.
        //2.Transfer string verbatim from RACE17 and add to same MMRIA field.
        //3.If both RACE16 and RACE17 are empty, leave MMRIA field empty(blank)."
        //Defaulting to blank
        string determinedValue = string.Empty;

        if (!string.IsNullOrWhiteSpace(race16) && !string.IsNullOrWhiteSpace(race17))
            determinedValue = $"{race16}|{race17}";
        else if (!string.IsNullOrWhiteSpace(race16))
            determinedValue = race16;
        else if (!string.IsNullOrWhiteSpace(race17))
            determinedValue = race17;

        return determinedValue;
    }

    private string[] RACE_Rule(string race1, string race2, string race3,
        string race4, string race5, string race6,
        string race7, string race8, string race9,
        string race10, string race11, string race12,
        string race13, string race14, string race15)
    {
        //"Use values from RACE1 through RACE15 to populate MMRIA multi-select field (dcr_race).
        //If every one of RACE1 through RACE15 is equal to ""N"", then dcr_race = 8888(Race Not Specified)"
        //"Use values from RACE1 through RACE15 to populate MMRIA multi-select field (dcr_race).
        //RACE1 = Y-- > dcr_race = 0
        //RACE2 = Y-- > dcr_race = 1
        //RACE3 = Y-- > dcr_race = 2
        //RACE4 = Y-- > dcr_race = 7
        //RACE5 = Y-- > dcr_race = 8
        //RACE6 = Y-- > dcr_race = 9
        //RACE7 = Y-- > dcr_race = 10
        //RACE8 = Y-- > dcr_race = 11
        //RACE9 = Y-- > dcr_race = 12
        //RACE10 = Y-- > dcr_race = 13
        //RACE11 = Y-- > dcr_race = 3
        //RACE12 = Y-- > dcr_race = 4
        //RACE13 = Y-- > dcr_race = 5
        //RACE14 = Y-- > dcr_race = 6
        //RACE15 = Y-- > dcr_race = 14

        //Defaulting to blank
        List<string> determinedValues = new List<string>();

        if (race1 == "N" && race2 == "N" && race3 == "N" && race4 == "N"
            && race5 == "N" && race6 == "N" && race7 == "N" && race8 == "N"
            && race9 == "N" && race10 == "N" && race11 == "N" && race12 == "N"
            && race13 == "N" && race14 == "N" && race15 == "N")
            determinedValues.Add("8888");
        else
        {
            if (race1 == "Y")
                determinedValues.Add("0");

            if (race2 == "Y")
                determinedValues.Add("1");

            if (race3 == "Y")
                determinedValues.Add("2");

            if (race4 == "Y")
                determinedValues.Add("7");

            if (race5 == "Y")
                determinedValues.Add("8");

            if (race6 == "Y")
                determinedValues.Add("9");

            if (race7 == "Y")
                determinedValues.Add("10");

            if (race8 == "Y")
                determinedValues.Add("11");

            if (race9 == "Y")
                determinedValues.Add("12");

            if (race10 == "Y")
                determinedValues.Add("13");

            if (race11 == "Y")
                determinedValues.Add("3");

            if (race12 == "Y")
                determinedValues.Add("4");

            if (race13 == "Y")
                determinedValues.Add("5");

            if (race14 == "Y")
                determinedValues.Add("6");

            if (race15 == "Y")
                determinedValues.Add("14");
        }

        return determinedValues.ToArray();
    }

    private string DETHNIC_Rule(string value1, string value2, string value3, string value4)
    {
        //"Use values of DETHNIC1, DETHNIC2, DETHNIC3, DETHNIC4 to fill out MMRIA field dcd_ioh_origi.
        //If DETHNIC1 = N and DETHNIC2 = N and DETHNIC3 = N and DETHNIC 4 = N-- > dcd_ioh_origi = 0 No, Not Spanish/ Hispanic / Latino
        //If DETHNIC1 = U and DETHNIC2 = U and DETHNIC3 = U and DETHNIC4 = U-- > dcd_ioh_origi = 7777 Unknown
        //If DETHNIC1 = (empty)and DETHNIC2 = (empty)and DETHNIC3 = (empty)and DETHNIC4 = (empty)-- > dcd_ioh_origi = 9999(blank)"
        //H-- > dcd_ioh_origi = 1 Yes, Mexican, Mexican American, Chicano
        //H-- > dcd_ioh_origi = 2 Yes, Puerto Rican
        //H-- > dcd_ioh_origi = 3 Yes, Cuban
        //H-- > dcd_ioh_origi = 4 Yes, Other Spanish/ Hispanic / Latino

        //Defaulting to blank
        string determinedValue = "9999";

        if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N")
            determinedValue = "0";
        else if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U")
            determinedValue = "7777";
        else if (value1 == "H")
            determinedValue = "1";
        else if (value2 == "H")
            determinedValue = "2";
        else if (value3 == "H")
            determinedValue = "3";
        else if (value4 == "H")
            determinedValue = "4";

        return determinedValue;
    }

    private string MANNER_Rule(string value)
    {
        //"Map character to MMRIA code values as follows:
        //Blank fields -> 9999(blank)
        //N-> 0 Natural
        //A-> 2 Accident
        //S-> 3 Suicide
        //H-> 1 Homicide
        //P-> 5 Pending Investigation
        //C-> 6 Could Not Be Determined

        //Map empty rows-- > 9999(blank)"

        switch (value?.ToUpper())
        {
            case "N":
                value = "0";
                break;
            case "A":
                value = "2";
                break;
            case "S":
                value = "3";
                break;
            case "H":
                value = "1";
                break;
            case "P":
                value = "5";
                break;
            case "C":
                value = "6";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string AUTOP_Rule(string value)
    {
        //"Map character to MMRIA code values as follows:
        //Blank fields -> 9999(blank)
        //Y-> 1 = Yes
        //N-> 0 = No
        //U->  7777 = Unknown
        //"

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string AUTOPF_Rule(string value)
    {
        //"Map character to MMRIA code values as follows:
        //Blank fields -> 9999(blank)
        //Y-> 1 = Yes
        //N-> 0 = No
        //U->  7777 = Unknown
        //"

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string TOBAC_Rule(string value)
    {
        //"Map character to MMRIA code values as follows: 
        //Blank fields -> 9999(blank)
        //Y-> 1 = Yes
        //N-> 0 = No
        //P-> 2 = Probably
        //U-> 7777 = Unknown
        //C-> 7777 = Unknown"

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "P":
                value = "2";
                break;
            case "U":
            case "C":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string PREG_Rule(string value)
    {
        //"Map number to MMRIA number codes as follows:
        //Empty columns -> 9999 = (blank)
        //1-- > 0 Not pregnant within last year
        //2-- > 1 Pregnant at the time of death
        //3-- > 2 Pregnant within 42 days of death
        //4-- > 3 Pregnant within 43 to 365 days of death
        //8-- > 5 Not Applicable
        //9-- > 88 Unknown if pregnant in last year "

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "8":
                value = "5";
                break;
            case "9":
                value = "88";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string DOI_MO_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; Map 99 and blank -> 9999(blank)
        if (value == "99" || string.IsNullOrWhiteSpace(value))
            value = "9999";

        return value;
    }

    private string DOI_DY_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; Map 99 and blank -> 9999(blank)
        if (value == "99" || string.IsNullOrWhiteSpace(value))
            value = "9999";

        return value;
    }

    private string DOI_YR_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; Map 9999 and blank ->9999(blank)
        if (string.IsNullOrWhiteSpace(value))
            value = "9999";

        return value;
    }

    private string TOI_HR_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; Values of 9999 and blank should be mapped as blank; need to map these values to MMRIA time format
        string parsedValue = "";

        if (!string.IsNullOrWhiteSpace(value))
        {
            if (value == "9999")
                parsedValue = "";
            else
            {
                parsedValue = ConvertHHmm_To_MMRIATime(value);
            }
        }

        return parsedValue;
    }

    private string WORKINJ_Rule(string value)
    {
        //"Map character to MMRIA code values as follows:
        //Blank fields -> 9999(blank)
        //Y-> 1 = Yes
        //N-> 0 = No
        //U->  7777 = Unknown
        //"

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ARMEDF_Rule(string value)
    {
        //"Map character to MMRIA code values as follows:
        //Blank fields -> 9999(blank)
        //Y-> 1 = Yes
        //N-> 0 = No
        //U->  7777 = Unknown
        //"

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ZIP9_D_Rule(string value)
    {
        //Transfer string verbatim to MMRIA field; map values of 99999 to blank
        if (value == "99999")
            value = string.Empty;

        return value;
    }

    private string TRANSPRT_Rule(string value)
    {
        //"1. Map character to MMRIA code values as follows: 
        //Blank fields -> 9999(blank)
        //DR-> 0 = Driver / Operator
        //PA-> 1 = Passenger
        //PE-> 2 = Pedestrian
        //Map any other text -> 3 = Other
        //2.Map full text to MMRIA Specify Other field"

        switch (value?.ToUpper())
        {
            case "DR":
                value = "0";
                break;
            case "PA":
                value = "1";
                break;
            case "PE":
                value = "2";
                break;
            case "":
                value = "9999";
                break;
            default:
                value = "3";
                break;
        }

        return value;
    }

    private string TRANSPRT_other_specify_Rule(string value)
    {
        //"1. Map character to MMRIA code values as follows: 
        //Blank fields -> 9999(blank)
        //DR-> 0 = Driver / Operator
        //PA-> 1 = Passenger
        //PE-> 2 = Pedestrian
        //Map any other text -> 3 = Other
        //2.Map full text to MMRIA Specify Other field"

        switch (value?.ToUpper())
        {
            case "DR":
                value = "";
                break;
            case "PA":
                value = "";
                break;
            case "PE":
                value = "";
                break;
            case "":
                value = "";
                break;
            default:
                //I know this looks weird, just coded it to show that the above values resolve this field to empty
                // but other text is passed through
                value = value;
                break;
        }

        return value;
    }


    private string VRO_STATUS_Rule(string value)
    {
        //3-> 3 = N / A(identified via linkage or literal cause of death field)        9999-> 9999(blank)
        if (value == "9999")
            value = string.Empty;

        return value;
    }

    private string DEDUC_Rule(string value)
    {
        //Map number to MMRIA number codes as follows:
        //Empty columns -> 9999 = (blank)
        //1-> 0 = 8th Grade or Less
        //2-> 1 = 9th - 12th grade; No Diploma
        //3-> 2 = High School Graduate or GED Completed
        //4-> 3 = Some college credit, but no degree
        //5-> 4 = Associate Degree
        //6-> 5 = Bachelor's Degree
        //7-> 6 = Master's Degree
        //8-> 7 = Doctorate Degree or Professional Degree
        //9-> 7777 = Unknown

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "6":
                value = "5";
                break;
            case "7":
                value = "6";
                break;
            case "8":
                value = "7";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;

    }

    private string TOD_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field, format as MMRIA time.; if TOD = 9999 then this field should be left blank
        string parsedValue = "";

        if (!string.IsNullOrWhiteSpace(value))
        {
            if (value == "9999")
                parsedValue = "";
            else
            {
                parsedValue = ConvertHHmm_To_MMRIATime(value);

            }
        }

        return parsedValue;
    }

    private string DOD_DY_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; if DOD_DY = 99 then this field should be mapped to 9999(blank)
        if (value == "99")
            value = "9999";

        return value;
    }

    private string DOD_MO_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; if DOD_MO = 99 then this field should be mapped to 9999(blank)
        if (value == "99")
            value = "9999";

        return value;
    }

    private string MARITAL_Rule(string value)
    {
        //Map character to MMRIA number codes as follows:
        //Blank-> 9999 = (blank)
        //M-> 0 = Married
        //A-> 1 = Married, but Separated
        //W-> 2 = Widowed
        //D-> 3 = Divorced
        //S-> 4 = Never Married
        //U->  7777 = Unknown

        switch (value?.ToUpper())
        {
            case "M":
                value = "0";
                break;
            case "A":
                value = "1";
                break;
            case "W":
                value = "2";
                break;
            case "D":
                value = "3";
                break;
            case "S":
                value = "4";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string COUNTRYC_Rule(string value)
    {
        //Map to MMRIA field Country listing 
        //Map XX to 9999(blank)
        //Map ZZ to 9999(blank)
        if (string.IsNullOrWhiteSpace(value) || value == "XX" || value == "ZZ")
            value = "9999";

        return value;

    }

    private string STATEC_Rule(string value)
    {
        // Map to MMRIA field state listing.
        //Map XX to 9999(blank)
        if (string.IsNullOrWhiteSpace(value) || value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    private string BPLACE_ST_Rule(string value)
    {
        // Map to MMRIA field state listing.
        //Map XX to 9999(blank)
        if (string.IsNullOrWhiteSpace(value) || value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    private string DOB_DY_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; IF value='99', this field should be mapped to 9999 (blank)
        if (value == "99")
            value = "9999";

        return value;
    }

    private string DOB_MO_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; IF value='99', this field should be mapped to 9999 (blank)
        if (value == "99")
            value = "9999";

        return value;
    }

    private string AGE_Rule(string value)
    {
        //Transfer number verbatim to MMRIA field; IF AGE = 999 this field should be left blank
        if (value == "999")
            value = string.Empty;

        return value;
    }

    private string DOD_YR_Rule(string value)
    {
        //Transfer string verbatim to MMRIA field; empty fields should map to 9999(blank)
        if (string.IsNullOrWhiteSpace(value))
            value = "9999";

        return value;
    }

    #endregion

    #region NAT Rules
    private object NAT_maternal_morbidity_Rule(string value1, string value2, string value3, string value4, string value5, string value6)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        MTR = Y --> bfdcp_m_morbi = 0 Maternal transfusion

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N")
        //    determinedValues.Add("6");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

        }

        return determinedValues.ToArray();
    }

    private object NAT_characteristics_of_labor_and_delivery_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7, string value8, string value9)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

INDL = Y --> bfdcp_cola_deliv = 0 Induction of labor

If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //     && value9 == "N")
        //    determinedValues.Add("9");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
                && value9 == "U")
            determinedValues.Add("777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

            if (int.TryParse(value9, out result))
                determinedValues.Add(value9);
        }

        return determinedValues.ToArray();
    }

    private object NAT_onset_of_labor_Rule(string value1, string value2, string value3)
    {
        /*Use values from 3 IJE fields [PROM, PRIC, PROL] to populate MMRIA multi-select field (bfdcp_oo_labor). 

PROM = Y --> bfdcp_oo_labor = 0 Premature Rupture of Membranes (Prolonged)

If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "N", then bfdcp_oo_labor = 3 None of the above

If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "U" then bfdcp_oo_labor = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N")
        //    determinedValues.Add("3");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

        }

        return determinedValues.ToArray();
    }

    private object NAT_obstetric_procedures_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values from 4 IJE fields [CERV, TOC, ECVS, ECVF] to populate MMRIA multi-select field (bfdcp_o_proce). 

CERV = Y --> bfdcp_o_proce = 0 Cervical Cerclage

If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "N", then bfdcp_o_proce = 4 None of the above

If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "U" then bfdcp_o_proce = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N")
        //    determinedValues.Add("4");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

        }

        return determinedValues.ToArray();
    }

    private object NAT_infections_present_or_treated_during_pregnancy_Rule(string value1, string value2, string value3, string value4, string value5, string value6)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

GON = Y --> bfdcp_ipotd_pregn = 2 Gonorrhea

If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N")
        //    determinedValues.Add("10");
        //else
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

        }

        return determinedValues.ToArray();
    }

    private object NAT_risk_factors_in_this_pregnancy_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7, string value8, string value9, string value10, string value11)
    {
        //    /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        //   EHYPE = Y --> bfdcprf_rfit_pregn = 4 Eclampsia Hypertension

/*
                                field_set["PDIAB"],
                                field_set["GDIAB"],
                                field_set["PHYPE"],
                                field_set["GHYPE"],
                                field_set["PPB"],
                                field_set["PPO"],
                                field_set["INFT"],
                                field_set["PCES"],
                                field_set["EHYPE"],
                                field_set["INFT_DRG"],
                                field_set["INFT_ART"]
*/


        //   If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        //   If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        //   *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */

        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //    && value9 == "N")
        //    determinedValues.Add("11");
        //else 
        if 
        (
            value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
            && value9 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

            if (int.TryParse(value9, out result))
                determinedValues.Add(value9);

            if (int.TryParse(value10, out result))
                determinedValues.Add(value10);


            if (int.TryParse(value11, out result))
                determinedValues.Add(value11);
        }

        return determinedValues.ToArray();
    }

    private object NAT_congenital_Rule(string value1, string value2, string value3, string value4, string value5
        , string value6, string value7, string value8, string value9
        , string value10, string value11, string value12)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/

        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //     && value9 == "N" && value10 == "N" && value11 == "N" && value12 == "N")
        //    determinedValues.Add("17");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
                && value9 == "U" && value10 == "U" && value11 == "U" && value12 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

            if (int.TryParse(value9, out result))
                determinedValues.Add(value9);

            if (int.TryParse(value10, out result))
                determinedValues.Add(value10);

            if (int.TryParse(value11, out result))
                determinedValues.Add(value11);

            if (int.TryParse(value12, out result))
                determinedValues.Add(value12);
        }

        return determinedValues.ToArray();
    }

    private object NAT_abnormal_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N")
        //    determinedValues.Add("8");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);
        }

        return determinedValues.ToArray();
    }

    private string LOCATION_OF_RESIDENCE_street_Rule(string stnum_r, string predir_r, string stname_r, string stdesig_r, string postdir_r)
    {
        //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
        string determinedValue = $"{stnum_r} {predir_r} {stname_r} {stdesig_r} {postdir_r}";

        return determinedValue;
    }

    private string DATE_OF_DELIVERY_Rule(string year, string month, string day)
    {
        //2.Merge 3 fields(IDOB_MO, IDOB_DY, IDOB_YR) map resulting date to MMRIA field -date_of _delivery(bcifsri_do_deliv)."
        string determinedValue = $"{year}-{month}-{day}";

        return determinedValue;
    }

    private string IDOB_YR_Merge_Rule(string value)
    {
        /*1. Transfer number verbatim to MMRIA field - date_of_delivery/year (bfdcpfodddod_year)
        2. Merge 3 fields (IDOB_MO, IDOB_DY, IDOB_YR) map resulting date to MMRIA field - date_of _delivery (bcifsri_do_deliv).*/
        return value;
    }

    private string MDOB_YR_Rule(string value)
    {
        /*If value is not 9999, transfer number verbatim to MMRIA field.

        If value = 9999, map to 9999 (blank).*/

        if (value == "9999")
            value = "9999";

        return value;
    }

    private string MDOB_MO_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string MDOB_DY_Rule(string value)
    {
        /*If value is in 01-31, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string FDOB_YR_Rule(string value)
    {
        /*If value is not 9999, transfer number verbatim to MMRIA field.

        If value = 9999, map to 9999 (blank).*/

        if (value == "9999")
            value = "9999";

        return value;
    }

    private string FDOB_MO_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string NAT_STATEC_Rule(string value)
    {
        //"Map XX --> 9999 (blank)
        //Map ZZ --> 9999(blank)
        //Map all other values to MMRIA field state listing"

        if (string.IsNullOrWhiteSpace(value) || value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    private string MARN_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */


        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ACKN_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        X -> 2=Not Applicable
        */


        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            case "X":
                value = "2";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string MEDUC_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = 8th Grade or Less
        2  -> 1 = 9th-12th Grade; No Diploma
        3  -> 2 = High School Grad or GED Completed 
        4  -> 3 = Some college, but no degree
        5  -> 4 = Associate Degree
        6  -> 5 = Bachelor's Degree
        7  -> 6 = Master's Degree
        8  -> 7 = Doctorate or Professional Degree
        9  -> 7777 = Unknown*/


        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "6":
                value = "5";
                break;
            case "7":
                value = "6";
                break;
            case "8":
                value = "7";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string FEDUC_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = 8th Grade or Less
        2  -> 1 = 9th-12th Grade; No Diploma
        3  -> 2 = High School Grad or GED Completed 
        4  -> 3 = Some college, but no degree
        5  -> 4 = Associate Degree
        6  -> 5 = Bachelor's Degree
        7  -> 6 = Master's Degree
        8  -> 7 = Doctorate or Professional Degree
        9  -> 7777 = Unknown*/


        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "6":
                value = "5";
                break;
            case "7":
                value = "6";
                break;
            case "8":
                value = "7";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ATTEND_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = MD
        2 -> 1 = DO
        3 -> 2 = CNM/CM
        4 -> 3 = Other Midwife
        5 -> 4 = Other 
        9 -> 7777 = Unknown*/


        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string TRAN_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */


        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string NPREV_Rule(string value)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field. 

        If value = 99, map to 9999 (blank)*/

        if (value == "99")
            value = "";

        return value;
    }

    private string HFT_Rule(string value)
    {
        /*If value is in 1-8, transfer number verbatim to MMRIA field. 

        If value = 9, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "9")
            value = "";

        return value;
    }

    private string HIN_Rule(string value)
    {
        /*If value is in 00-11, transfer number verbatim to MMRIA field. 

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99")
            value = "";

        return value;
    }

    private string PWGT_Rule(string value)
    {
        /*If value is in 050-400, transfer number verbatim to MMRIA field.

        If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "999" || value == "9999")
            value = "";

        return value;
    }

    private string DWGT_Rule(string value)
    {
        /*If value is in 050-450, transfer number verbatim to MMRIA field.  

        If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "999" || value == "9999")
            value = "";

        return value;
    }

    private string WIC_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string PLBL_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.  

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99")
            value = "";

        return value;
    }

    private string PLBD_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.  

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99")
            value = "";

        return value;
    }

    private string POPO_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99" || value == "9999")
            value = "";

        return value;
    }

    private string MLLB_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 88 or 99, map to 9999 (blank).*/

        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string YLLB_Rule(string value)
    {
        /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.

        If value = 8888 or 9999, map to 9999 (blank).*/

        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string MOPO_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 88 or 99, map to 9999 (blank).*/

        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string YOPO_Rule(string value)
    {
        /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.  

        If value = 8888 or 9999, map to 9999 (blank).*/

        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string PAY_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 1 = Medicaid
        2 -> 0 = Private Insurance
        3 -> 2 = Self-pay                                       
        4 -> 4=Indian Health Service                     
        5 -> 5=CHAMPUS/TRICARE                               
        6 -> 6 = Other Government (Fed, State, Local)
        8 -> 3 = Other                                          
        9 -> 7777=Unknown*/
        switch (value?.ToUpper())
        {
            case "1":
                value = "1";
                break;
            case "2":
                value = "0";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "4";
                break;
            case "5":
                value = "5";
                break;
            case "6":
                value = "6";
                break;
            case "8":
                value = "3";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string DLMP_YR_Rule(string value)
    {
        /*If value is not 9999, transfer number verbatim to MMRIA field.

        If value = 9999, map to 9999 (blank).*/

        if (value == "9999")
            value = "9999";

        return value;
    }

    private string DLMP_MO_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string DLMP_DY_Rule(string value)
    {
        /*If value is in 01-31, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string NPCES_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.  

        If value = 99, leave the value empty/blank.*/

        if (value == "99")
            value = "";

        return value;
    }

    private string ATTF_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ATTV_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  -> 7777 = Unknown
        */

        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string PRES_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = Cephalic
        2 -> 1 = Breech
        3 -> 4 = Other
        9 -> 7777 = Unknown*/


        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "4";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ROUT_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = Vaginal/Spontaneous
        2 -> 1 = Vaginal/Forceps
        3  -> 2 = Vaginal/Vacuum
        4  -> 3 = Cesarean
        9  -> 7777 = Unknown*/


        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "9":
                value = "7";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string OWGEST_Rule(string value)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field.

        If value = 99, leave the value empty/blank. */

        if (value == "99")
            value = "";

        return value;
    }

    private string APGAR5_Rule(string value)
    {
        /*If value is in 00-10, transfer number verbatim to MMRIA field.  

        If value = 99, leave the value empty/blank. */

        if (value == "99")
            value = "";

        return value;
    }

    private string APGAR10_Rule(string value)
    {
        /*If value is in 00-10, transfer number verbatim to MMRIA field.  

        If value = 88 or 99, leave the value empty/blank. */

        if (value == "88" || value == "99")
            value = "";

        return value;
    }

    private string SORD_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.  

        If value = 99, leave the MMRIA value empty/blank.*/

        if (value == "99")
            value = "";

        return value;
    }

    private string ITRAN_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 Yes
        N  -> 0 No
        U  -> 7777 = Unknown
        */


        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ILIV_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 = Yes
        N  -> 0 = No
        U  -> 2 = Infant transferred, status unknown
        */


        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "2";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string BFED_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 Yes
        N  -> 0 No
        U  -> 7777 = Unknown
        */


        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ISEX_NAT_Rule(string value)
    {
        /*M = Male -> 0:Male
        F = Female -> 1:Female
        N = 2:Not Yet Determined

        Map empty rows to 9999 (blank)
        */

        switch (value?.ToUpper())
        {
            case "M":
                value = "0";
                break;
            case "F":
                value = "1";
                break;
            case "N":
                value = "2";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }
    private string BPLACE_place_NAT_Rule(string value)
    {
        /*1 = Hospital -> bfdcpfodd_to_place = 0 Hospital & bfdcpfodd_whd_plann = 9999 (blank)

        2 = Freestanding Birth Center -> bfdcpfodd_to_place = 1 Free Standing Birth Center & bfdcpfodd_whd_plann = 9999 (blank)

        3 = Home (Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 1 Yes

        4 = Home (Not Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 0 No

        5 = Home (Unknown if Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 7777 Unknown

        6 = Clinic/Doctor's Office -> bfdcpfodd_to_place = 3 Clinic/Doctor's office & bfdcpfodd_whd_plann = 9999 (blank)

        7 = Other -> bfdcpfodd_to_place = 4 Other & bfdcpfodd_whd_plann = 9999 (blank)

        9 = Unknown --> bfdcpfodd_to_place = 7777 Unknown & bfdcpfodd_whd_plann = 9999 (blank)*/
        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "2";
                break;
            case "5":
                value = "2";
                break;
            case "6":
                value = "3";
                break;
            case "7":
                value = "4";
                break;
            default:
                value = "7777";
                break;
        }
        return value;
    }
    private string BPLACE_plann_NAT_Rule(string value)
    {
        /*1 = Hospital -> bfdcpfodd_to_place = 0 Hospital & bfdcpfodd_whd_plann = 9999 (blank)

        2 = Freestanding Birth Center -> bfdcpfodd_to_place = 1 Free Standing Birth Center & bfdcpfodd_whd_plann = 9999 (blank)

        3 = Home (Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 1 Yes

        4 = Home (Not Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 0 No

        5 = Home (Unknown if Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 7777 Unknown

        6 = Clinic/Doctor's Office -> bfdcpfodd_to_place = 3 Clinic/Doctor's office & bfdcpfodd_whd_plann = 9999 (blank)

        7 = Other -> bfdcpfodd_to_place = 4 Other & bfdcpfodd_whd_plann = 9999 (blank)

        9 = Unknown --> bfdcpfodd_to_place = 7777 Unknown & bfdcpfodd_whd_plann = 9999 (blank)*/
        switch (value?.ToUpper())
        {
            case "1":
                value = "9999";
                break;
            case "2":
                value = "9999";
                break;
            case "3":
                value = "1";
                break;
            case "4":
                value = "0";
                break;
            case "5":
                value = "7777";
                break;
            case "6":
                value = "9999";
                break;
            case "7":
                value = "9999";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }
    private string BPLACEC_ST_TER_NAT_Rule(string value)
    {
        /*Map XX --> 9999 (blank)
        Map ZZ --> 9999 (blank)

        Map all other values to MMRIA field state listing*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    private string NAT_METHNIC_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values of METHNIC1, METHNIC2, METHNIC3, METHNIC4 to populate MMRIA field bfdcpdom_ioh_origi.

        H --> bfdcpdom_ioh_origi = 1 Yes, Mexican, Mexican American, Chicano
        H --> bfdcpdom_ioh_origi = 2 Yes, Puerto Rican
        H --> bfdcpdom_ioh_origi = 3 Yes, Cuban
        H --> bfdcpdom_ioh_origi = 4 Yes, Other Spanish/Hispanic/Latino

        If METHNIC1 = N and METHNIC2 = N and METHNIC3 = N and METHNIC 4 = N --> bfdcpdom_ioh_origi = 0 No, Not Spanish/Hispanic/Latino

        If METHNIC1 = U and METHNIC2 = U and METHNIC3 = U and METHNIC4 = U --> bfdcpdom_ioh_origi = 7777 Unknown

        If METHNIC1 = (empty) and METHNIC2 = (empty) and METHNIC3 = (empty) and METHNIC4 = (empty) --> bfdcpdom_ioh_origi = 9999 (blank)*/

        string determinedValue;

        if (value1?.ToUpper() == "H")
        {
            determinedValue = "1";
        }
        else if (value2?.ToUpper() == "H")
        {
            determinedValue = "2";
        }
        else if (value3?.ToUpper() == "H")
        {
            determinedValue = "3";
        }
        else if (value4?.ToUpper() == "H")
        {
            determinedValue = "4";
        }
        else if (value1?.ToUpper() == "N" && value2?.ToUpper() == "N" && value3?.ToUpper() == "N" && value4?.ToUpper() == "N")
        {
            determinedValue = "0";
        }
        else if (value1?.ToUpper() == "U" && value2?.ToUpper() == "U" && value3?.ToUpper() == "U" && value4?.ToUpper() == "U")
        {
            determinedValue = "7777";
        }
        else
        {
            determinedValue = "9999";
        }

        return determinedValue;
    }

    private string[] MRACE_NAT_Rule(string value1, string value2, string value3, string value4, string value5,
        string value6, string value7, string value8, string value9, string value10,
        string value11, string value12, string value13, string value14, string value15)
    {
        /*Use values from MRACE1 through MRACE15 to populate MMRIA multi-select field (bfdcpr_ro_mothe).

        MRACE1 = Y --> bfdcpr_ro_mothe = 0 White
        MRACE2 = Y --> bfdcpr_ro_mothe = 1 Black or African American
        MRACE3 = Y --> bfdcpr_ro_mothe = 2 American Indian or Alaska Native
        MRACE4 = Y --> bfdcpr_ro_mothe = 7 Asian Indian
        MRACE5 = Y --> bfdcpr_ro_mothe = 8 Chinese
        MRACE6 = Y --> bfdcpr_ro_mothe = 9 Filipino
        MRACE7 = Y --> bfdcpr_ro_mothe = 10 Japanese
        MRACE8 = Y --> bfdcpr_ro_mothe = 11 Korean
        MRACE9 = Y --> bfdcpr_ro_mothe = 12 Vietnamese
        MRACE10 = Y --> bfdcpr_ro_mothe = 13 Other Asian
        MRACE11 = Y --> bfdcpr_ro_mothe = 3 Native Hawaiian
        MRACE12 = Y --> bfdcpr_ro_mothe = 4 Guamanian or Chamorro
        MRACE13 = Y --> bfdcpr_ro_mothe = 5 Samoan
        MRACE14 = Y --> bfdcpr_ro_mothe = 6 Other Pacific Islander
        MRACE15 = Y --> bfdcpr_ro_mothe = 14 Other Race

        If every one of MRACE1 through MRACE15 is equal to "N", then bfdcpr_ro_mothe = 8888 (Race Not Specified)*/
        //Defaulting to blank
        List<string> determinedValues = new List<string>();

        if (value1?.ToUpper() == "Y")
        {
            determinedValues.Add("0");
        }
        if (value2?.ToUpper() == "Y")
        {
            determinedValues.Add("1");
        }
        if (value3?.ToUpper() == "Y")
        {
            determinedValues.Add("2");
        }
        if (value4?.ToUpper() == "Y")
        {
            determinedValues.Add("7");
        }
        if (value5?.ToUpper() == "Y")
        {
            determinedValues.Add("8");
        }
        if (value6?.ToUpper() == "Y")
        {
            determinedValues.Add("9");
        }
        if (value7?.ToUpper() == "Y")
        {
            determinedValues.Add("10");
        }
        if (value8?.ToUpper() == "Y")
        {
            determinedValues.Add("11");
        }
        if (value9?.ToUpper() == "Y")
        {
            determinedValues.Add("12");
        }
        if (value10?.ToUpper() == "Y")
        {
            determinedValues.Add("13");
        }
        if (value11?.ToUpper() == "Y")
        {
            determinedValues.Add("3");
        }
        if (value12?.ToUpper() == "Y")
        {
            determinedValues.Add("4");
        }
        if (value13?.ToUpper() == "Y")
        {
            determinedValues.Add("5");
        }
        if (value14?.ToUpper() == "Y")
        {
            determinedValues.Add("6");
        }
        if (value15?.ToUpper() == "Y")
        {
            determinedValues.Add("14");
        }
        if(determinedValues.Count == 0)
        {
            determinedValues.Add("8888");
        }

        return determinedValues.ToArray();
    }

    private string MRACE16_17_NAT_Rule(string value16, string value17)
    {
        /*Combine MRACE16 and MRACE17 into one field (bfdcpr_p_tribe), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE16 to MMRIA field.
        2. Transfer string verbatim from MRACE17 and add to same MMRIA field.
        3. If both MRACE16 and MRACE17 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value16) || string.IsNullOrWhiteSpace(value17)))
        {
            value = $"{value16}|{value17}";
        }
        else if (!string.IsNullOrWhiteSpace(value16))
        {
            value = $"{value16}";
        }
        else
        {
            value = $"{value17}";
        }

        return value;
    }

    private string MRACE18_19_NAT_Rule(string value18, string value19)
    {
        /*Combine MRACE18 and MRACE19 into one field (bfdcpr_o_asian), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE18 to MMRIA field.
        2. Transfer string verbatim from MRACE19 and add to same MMRIA field.
        3. If both MRACE18 and MRACE19 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value18) || string.IsNullOrWhiteSpace(value19)))
        {
            value = $"{value18}|{value19}";
        }
        else if (!string.IsNullOrWhiteSpace(value18))
        {
            value = $"{value18}";
        }
        else
        {
            value = $"{value19}";
        }

        return value;
    }

    private string MRACE20_21_NAT_Rule(string value20, string value21)
    {
        /*Combine MRACE20 and MRACE21 into one field (bfdcpr_op_islan), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE20 to MMRIA field.
        2. Transfer string verbatim from MRACE21 and add to same MMRIA field.
        3. If both MRACE20 and MRACE21 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value20) || string.IsNullOrWhiteSpace(value21)))
        {
            value = $"{value20}|{value21}";
        }
        else if (!string.IsNullOrWhiteSpace(value20))
        {
            value = $"{value20}";
        }
        else
        {
            value = $"{value21}";
        }

        return value;
    }

    private string MRACE22_23_NAT_Rule(string value22, string value23)
    {
        /*Combine MRACE22 and MRACE23 into one field (bfdcpr_o_race), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE22 to MMRIA field.
        2. Transfer string verbatim from MRACE23 and add to same MMRIA field.
        3. If both MRACE22 and MRACE23 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value22) || string.IsNullOrWhiteSpace(value23)))
        {
            value = $"{value22}|{value23}";
        }
        else if (!string.IsNullOrWhiteSpace(value22))
        {
            value = $"{value22}";
        }
        else
        {
            value = $"{value23}";
        }

        return value;
    }

    private string FETHNIC_NAT_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values of FETHNIC1, FETHNIC2, FETHNIC3, FETHNIC4 to populate MMRIA field bfdcpdof_ifoh_origi.

            H --> bfdcpdof_ifoh_origi = 1 Yes, Mexican, Mexican American, Chicano
        H --> bfdcpdof_ifoh_origi = 2 Yes, Puerto Rican
        H --> bfdcpdof_ifoh_origi = 3 Yes, Cuban
        H --> bfdcpdof_ifoh_origi = 4, Yes, Other Spanish/Hispanic/Latino

            If FETHNIC1 = N and FETHNIC2 = N and FETHNIC3 = N and FETHNIC 4 = N --> bfdcpdof_ifoh_origi = 0 No, Not Spanish/Hispanic/Latino

            If FETHNIC1 = U and FETHNIC2 = U and FETHNIC3 = U and FETHNIC4 = U --> bfdcpdof_ifoh_origi = 7777 Unknown

            If FETHNIC1 = (empty) and FETHNIC2 = (empty) and FETHNIC3 = (empty) and FETHNIC4 = (empty) --> bfdcpdof_ifoh_origi = 9999 (blank)*/

        string determinedValue;

        if (value1?.ToUpper() == "H")
        {
            determinedValue = "1";
        }
        else if (value2?.ToUpper() == "H")
        {
            determinedValue = "2";
        }
        else if (value3?.ToUpper() == "H")
        {
            determinedValue = "3";
        }
        else if (value4?.ToUpper() == "H")
        {
            determinedValue = "4";
        }
        else if (value1?.ToUpper() == "N" && value2?.ToUpper() == "N" && value3?.ToUpper() == "N" && value4?.ToUpper() == "N")
        {
            determinedValue = "0";
        }
        else if (value1?.ToUpper() == "U" && value2?.ToUpper() == "U" && value3?.ToUpper() == "U" && value4?.ToUpper() == "U")
        {
            determinedValue = "7777";
        }
        else
        {
            determinedValue = "9999";
        }

        return determinedValue;
    }


    private string[] FRACE_NAT_Rule(string value1, string value2, string value3, string value4, string value5,
        string value6, string value7, string value8, string value9, string value10,
        string value11, string value12, string value13, string value14, string value15)
    {
        /*Use values from FRACE1 through FRACE15 to populate MMRIA multi-select field (bfdcpdofr_ro_fathe).

        FRACE1 = Y --> bfdcpdofr_ro_fathe = 0 White
        FRACE2 = Y --> bfdcpdofr_ro_fathe = 1 Black or African American
        FRACE3 = Y --> bfdcpdofr_ro_fathe = 2 American Indian or Alaska Native
        FRACE4 = Y --> bfdcpdofr_ro_fathe = 7 Asian Indian
        FRACE5 = Y --> bfdcpdofr_ro_fathe = 8 Chinese
        FRACE6 = Y --> bfdcpdofr_ro_fathe = 9 Filipino
        FRACE7 = Y --> bfdcpdofr_ro_fathe = 10 Japanese
        FRACE8 = Y --> bfdcpdofr_ro_fathe = 11 Korean
        FRACE9 = Y --> bfdcpdofr_ro_fathe = 12 Vietnamese
        FRACE10 = Y --> bfdcpdofr_ro_fathe = 13 Other Asian
        FRACE11 = Y --> bfdcpdofr_ro_fathe = 3 Native Hawaiian
        FRACE12 = Y --> bfdcpdofr_ro_fathe = 4 Guamanian or Chamorro
        FRACE13 = Y --> bfdcpdofr_ro_fathe = 5 Samoan
        FRACE14 = Y --> bfdcpdofr_ro_fathe = 6 Other Pacific Islander
        FRACE15 = Y --> bfdcpdofr_ro_fathe = 14 Other Race

        If every one of FRACE1 through FRACE15 is equal to "N", then bfdcpdofr_ro_fathe = 8888 (Race Not Specified)*/
        List<string> determinedValues = new List<string>();


        if (value1?.ToUpper() == "Y")
        {
            determinedValues.Add("0");
        }
        if (value2?.ToUpper() == "Y")
        {
            determinedValues.Add("1");
        }
        if (value3?.ToUpper() == "Y")
        {
            determinedValues.Add("2");
        }
        if (value4?.ToUpper() == "Y")
        {
            determinedValues.Add("7");
        }
        if (value5?.ToUpper() == "Y")
        {
            determinedValues.Add("8");
        }
        if (value6?.ToUpper() == "Y")
        {
            determinedValues.Add("9");
        }
        if (value7?.ToUpper() == "Y")
        {
            determinedValues.Add("10");
        }
        if (value8?.ToUpper() == "Y")
        {
            determinedValues.Add("11");
        }
        if (value9?.ToUpper() == "Y")
        {
            determinedValues.Add("12");
        }
        if (value10?.ToUpper() == "Y")
        {
            determinedValues.Add("13");
        }
        if (value11?.ToUpper() == "Y")
        {
            determinedValues.Add("3");
        }
        if (value12?.ToUpper() == "Y")
        {
            determinedValues.Add("4");
        }
        if (value13?.ToUpper() == "Y")
        {
            determinedValues.Add("5");
        }
        if (value14?.ToUpper() == "Y")
        {
            determinedValues.Add("6");
        }
        if (value15?.ToUpper() == "Y")
        {
            determinedValues.Add("14");
        }

        if(determinedValues.Count == 0)
        {
            determinedValues.Add("8888");
        }

        return determinedValues.ToArray();
    }

    private string FRACE16_17_NAT_Rule(string value16, string value17)
    {
        /*Combine FRACE16 and FRACE17 into one field (bfdcpdofr_p_tribe), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE16 to MMRIA field.
        2. Transfer string verbatim from FRACE17 and add to same MMRIA field.
        3. If both FRACE16 and FRACE17 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value16) || string.IsNullOrWhiteSpace(value17)))
        {
            value = $"{value16}|{value17}";
        }
        else if (!string.IsNullOrWhiteSpace(value16))
        {
            value = $"{value16}";
        }
        else
        {
            value = $"{value17}";
        }

        return value;
    }

    private string FRACE18_19_NAT_Rule(string value18, string value19)
    {
        /*Combine FRACE18 and FRACE19 into one field (bfdcpdofr_o_asian), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE18 to MMRIA field.
        2. Transfer string verbatim from FRACE19 and add to same MMRIA field.
        3. If both FRACE18 and FRACE19 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value18) || string.IsNullOrWhiteSpace(value19)))
        {
            value = $"{value18}|{value19}";
        }
        else if (!string.IsNullOrWhiteSpace(value18))
        {
            value = $"{value18}";
        }
        else
        {
            value = $"{value19}";
        }

        return value;
    }

    private string FRACE20_21_NAT_Rule(string value20, string value21)
    {
        /*Combine FRACE20 and FRACE21 into one field (bfdcpdofr_op_islan), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE20 to MMRIA field.
        2. Transfer string verbatim from FRACE21 and add to same MMRIA field.
        3. If both FRACE20 and FRACE21 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value20) || string.IsNullOrWhiteSpace(value21)))
        {
            value = $"{value20}|{value21}";
        }
        else if (!string.IsNullOrWhiteSpace(value20))
        {
            value = $"{value20}";
        }
        else
        {
            value = $"{value21}";
        }

        return value;
    }

    private string FRACE22_23_NAT_Rule(string value22, string value23)
    {
        /*Combine FRACE22 and FRACE23 into one field (bfdcpdofr_o_race), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE22 to MMRIA field.
        2. Transfer string verbatim from FRACE23 and add to same MMRIA field.
        3. If both FRACE22 and FRACE23 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value22) || string.IsNullOrWhiteSpace(value23)))
        {
            value = $"{value22}|{value23}";
        }
        else if (!string.IsNullOrWhiteSpace(value22))
        {
            value = $"{value22}";
        }
        else
        {
            value = $"{value23}";
        }

        return value;
    }

    private string DOFP_MO_NAT_Rule(string value)
    {
        /*
        If DOFP_MO is in 01-12, transfer number verbatim to MMRIA field (bfdcppcdo1pv_month).

        If DOFP_MO = 99 --> bfdcppcdo1pv_month = 9999 (blank).

        If DOFP_MO = 88 and DOFP_DY = 88 and DOFP_YR = 8888, then do the following:
        1. bfdcppcdo1pv_month = 9999 (blank) 
        2. bfdcppcdo1pv_day = 9999 (blank)
        3. bfdcppcdo1pv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string DOFP_DY_NAT_Rule(string value)
    {
        /*If DOFP_DY is in 01-31, transfer number verbatim to MMRIA field (bfdcppcdo1pv_day).

        If DOFP_DY = 99 --> bfdcppcdo1pv_day = 9999 (blank).

        If DOFP_MO = 88 and DOFP_DY = 88 and DOFP_YR = 8888, then do the following:
        1. bfdcppcdo1pv_month = 9999 (blank) 
        2. bfdcppcdo1pv_day = 9999 (blank)
        3. bfdcppcdo1pv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string DOFP_YR_NAT_Rule(string value)
    {
        /*If DOFP_YR is not equal to 8888 or 9999, transfer number verbatim to MMRIA field (bfdcppcdo1pv_year).

        If DOFP_YR = 9999 --> bfdcppcdo1pv_year = 9999 (blank).

        If DOFP_MO = 88 and DOFP_DY = 88 and DOFP_YR = 8888, then do the following:
        1. bfdcppcdo1pv_month = 9999 (blank) 
        2. bfdcppcdo1pv_day = 9999 (blank)
        3. bfdcppcdo1pv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string DOLP_MO_NAT_Rule(string value)
    {
        /*If DOLP_MO is in 01-12, transfer number verbatim to MMRIA field (bfdcppcdolpv_month).

        If DOLP_MO = 99 --> bfdcppcdolpv_month = 9999 (blank).

        If DOLP_MO = 88 and DOLP_DY = 88 and DOLP_YR = 8888, then do the following:
        1. bfdcppcdolpv_month = 9999 (blank)
        2. bfdcppcdolpv_day = 9999 (blank)
        3. bfdcppcdolpv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string DOLP_DY_NAT_Rule(string value)
    {
        /*If DOLP_DY is in 01-31, transfer number verbatim to MMRIA field (bfdcppcdolpv_day).

        If DOLP_DY = 99 --> bfdcppcdolpv_day = 9999 (blank).

        If DOLP_MO = 88 and DOLP_DY = 88 and DOLP_YR = 8888, then do the following:
        1. bfdcppcdolpv_month = 9999 (blank)
        2. bfdcppcdolpv_day = 9999 (blank)
        3. bfdcppcdolpv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.*/
        if (value == "88" || value == "99")
            value = "9999";
        return value;
    }

    private string DOLP_YR_NAT_Rule(string value)
    {
        /*If DOLP_YR is not equal to 8888 or 9999, transfer number verbatim to MMRIA field (bfdcppcdolpv_year).

        If DOLP_YR = 9999 --> bfdcppcdolpv_year = 9999 (blank).

        If DOLP_MO = 88 and DOLP_DY = 88 and DOLP_YR = 8888, then do the following:
        1. bfdcppcdolpv_month = 9999 (blank)
        2. bfdcppcdolpv_day = 9999 (blank)
        3. bfdcppcdolpv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string CIGPN_NAT_Rule(string value)
    {
        /*If CIGPN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_p3_month. 
        2. bfdcpcs_p3m_type = 0 Cigarette(s). 

        If CIGPN = 99, then do:
        1. bfdcpcs_p3_month = (blank).
        2. bfdcpcs_p3m_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "";

        return value;
    }

    private string CIGPN_Type_NAT_Rule(string value)
    {
        /*If CIGPN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_p3_month. 
        2. bfdcpcs_p3m_type = 0 Cigarette(s). 

        If CIGPN = 99, then do:
        1. bfdcpcs_p3_month = 9999 (blank).
        2. bfdcpcs_p3m_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string CIGFN_NAT_Rule(string value)
    {
        /*If CIGFN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_1st. 
        2. bfdcpcs_t1_type = 0 Cigarette(s). 

        If CIGFN = 99, then do:
        1. bfdcpcs_t_1st = 9999 (blank).
        2. bfdcpcs_t1_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "";

        return value;
    }

    private string CIGFN_Type_NAT_Rule(string value)
    {
        /*If CIGFN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_1st. 
        2. bfdcpcs_t1_type = 0 Cigarette(s). 

        If CIGFN = 99, then do:
        1. bfdcpcs_t_1st = 9999 (blank).
        2. bfdcpcs_t1_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string CIGSN_NAT_Rule(string value)
    {
        /*If CIGSN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_2nd. 
        2. bfdcpcs_t2_type = 0 Cigarette(s). 

        If CIGSN = 99, then do:
        1. bfdcpcs_t_2nd = 9999 (blank).
        2. bfdcpcs_t2_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "";

        return value;
    }

    private string CIGSN_Type_NAT_Rule(string value)
    {
        /*If CIGSN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_2nd. 
        2. bfdcpcs_t2_type = 0 Cigarette(s). 

        If CIGSN = 99, then do:
        1. bfdcpcs_t_2nd = 9999 (blank).
        2. bfdcpcs_t2_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string CIGLN_NAT_Rule(string value)
    {
        /*If CIGLN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_3rd. 
        2. bfdcpcs_t3_type = 0 Cigarette(s). 

        If CIGLN = 99, then do:
        1. bfdcpcs_t_3rd = 9999 (blank).
        2. bfdcpcs_t3_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "";

        return value;
    }

    private string CIGLN_Type_NAT_Rule(string value)
    {
        /*If CIGLN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_3rd. 
        2. bfdcpcs_t3_type = 0 Cigarette(s). 

        If CIGLN = 99, then do:
        1. bfdcpcs_t_3rd = 9999 (blank).
        2. bfdcpcs_t3_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string CIG_none_or_not_specified_NAT_Rule(string value1, string value2, string value3, string value4)
    {
        /*
        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        string determinedValue = "9999";

        if 
        (
            value1 == "99" && 
            value2 == "99" && 
            value3 == "99" && 
            value4 == "99"
        )
        {
            determinedValue = "7777";
        }
        else if 
        (
            (
                value1 == "00" && 
                value2 == "00" && 
                value3 == "00" && 
                value4 == "00"
            ) || 
            (
                value1 == "0" && 
                value2 == "0" && 
                value3 == "0" && 
                value4 == "0"
            )
        )
        {
            determinedValue = "0";
        }
        return determinedValue;
    }

    private string PDIAB_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PDIAB = Y --> bfdcprf_rfit_pregn = 0 Prepregnancy Diabetes

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */

        if (value == "Y")
            value = "0";

        return value;
    }
    private string GDIAB_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        GDIAB = Y --> bfdcprf_rfit_pregn = 1 Gestational Diabetes

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */

        if (value == "Y")
            value = "1";

        return value;
    }
    private string PHYPE_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PHYPE = Y --> bfdcprf_rfit_pregn = 2 Prepregnacy Hypertension

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. 
        */
        if (value == "Y")
            value = "2";

        return value;
    }
    private string GHYPE_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        GHYPE = Y --> bfdcprf_rfit_pregn = 3 Gestational Hypertension

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "3";

        return value;
    }
    private string PPB_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PPB = Y --> bfdcprf_rfit_pregn = 5 Previous Preterm Birth

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "5";

        return value;
    }
    private string PPO_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PPO = Y --> bfdcprf_rfit_pregn = 6 Other Previous Poor Outcome

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "6";

        return value;
    }
    private string INFT_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        INFT = Y --> bfdcprf_rfit_pregn = 7 Pregnancy Resulted from Infertility Treatment

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "7";

        return value;
    }
    private string PCES_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PCES = Y --> bfdcprf_rfit_pregn = 10 Mother had a Previous Cesarean Delivery

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "10";

        return value;
    }
    private string GON_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

        GON = Y --> bfdcp_ipotd_pregn = 2 Gonorrhea

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }
    private string SYPH_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

        SYPH = Y --> bfdcp_ipotd_pregn = 3 Syphilis

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }
    private string HSV_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

        HSV = Y --> bfdcp_ipotd_pregn = 11 Herpes Simplex [HSV]

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "11";

        return value;
    }
    private string CHAM_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

        CHAM = Y --> bfdcp_ipotd_pregn = 6 Chlamydia

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "6";

        return value;
    }
    private string HEPB_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

        HEPB = Y --> bfdcp_ipotd_pregn = 0 Hepatitis B (live birth only)

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }
    private string HEPC_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] to populate MMRIA multi-select field bfdcp_ipotd_pregn). 

        HEPC = Y --> bfdcp_ipotd_pregn = 1 Hepatitis C (live birth only)

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 6 IJE fields [GON, SYPH, HSV, CHAM, HEPB, HEPC] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }
    private string CERV_NAT_Rule(string value)
    {
        /*Use values from 4 IJE fields [CERV, TOC, ECVS, ECVF] to populate MMRIA multi-select field (bfdcp_o_proce). 

        CERV = Y --> bfdcp_o_proce = 0 Cervical Cerclage

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "N", then bfdcp_o_proce = 4 None of the above

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "U" then bfdcp_o_proce = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }
    private string TOC_NAT_Rule(string value)
    {
        /*Use values from 4 IJE fields [CERV, TOC, ECVS, ECVF] to populate MMRIA multi-select field (bfdcp_o_proce). 

        TOC = Y --> bfdcp_o_proce = 1 Tocolysis

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "N", then bfdcp_o_proce = 4 None of the above

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "U" then bfdcp_o_proce = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }

    private string ECVS_NAT_Rule(string value)
    {
        /*Use values from 4 IJE fields [CERV, TOC, ECVS, ECVF] to populate MMRIA multi-select field (bfdcp_o_proce). 

        ECVS = Y --> bfdcp_o_proce = 2 External Cephalic Version: Successful

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "N", then bfdcp_o_proce = 4 None of the above

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "U" then bfdcp_o_proce = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }

    private string ECVF_NAT_Rule(string value)
    {
        /*Use values from 4 IJE fields [CERV, TOC, ECVS, ECVF] to populate MMRIA multi-select field (bfdcp_o_proce). 

        ECVS = Y --> bfdcp_o_proce = 3 External Cephalic Version: Failed

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "N", then bfdcp_o_proce = 4 None of the above

        If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "U" then bfdcp_o_proce = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }

    private string PROM_NAT_Rule(string value)
    {
        /*Use values from 3 IJE fields [PROM, PRIC, PROL] to populate MMRIA multi-select field (bfdcp_oo_labor). 

        PROM = Y --> bfdcp_oo_labor = 0 Premature Rupture of Membranes (Prolonged)

        If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "N", then bfdcp_oo_labor = 3 None of the above

        If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "U" then bfdcp_oo_labor = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }

    private string PRIC_NAT_Rule(string value)
    {
        /*Use values from 3 IJE fields [PROM, PRIC, PROL] to populate MMRIA multi-select field (bfdcp_oo_labor). 

        PRIC = Y --> bfdcp_oo_labor = 2 Precipitous labor (< 3 hours)

        If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "N", then bfdcp_oo_labor = 3 None of the above

        If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "U" then bfdcp_oo_labor = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }

    private string PROL_NAT_Rule(string value)
    {
        /*Use values from 3 IJE fields [PROM, PRIC, PROL] to populate MMRIA multi-select field (bfdcp_oo_labor). 

        PROL = Y --> bfdcp_oo_labor = 1 Prolonged labor (> 20 hours)

        If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "N", then bfdcp_oo_labor = 3 None of the above

        If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "U" then bfdcp_oo_labor = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }

    private string INDL_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        INDL = Y --> bfdcp_cola_deliv = 0 Induction of labor

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }

    private string AUGL_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        AUGL = Y --> bfdcp_cola_deliv = 4 Augmentation of labor

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "4";

        return value;
    }

    private string NVPR_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        NVPR = Y --> bfdcp_cola_deliv = 8 Non-vertex presentation

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "8";

        return value;
    }

    private string STER_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        STER = Y --> bfdcp_cola_deliv = 1 Steroids (glucocorticoids) for fetal lung maturation received by mother prior to delivery

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }

    private string ANTB_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        ANTB = Y --> bfdcp_cola_deliv = 5 Antibiotics received by the mother during labor

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "5";

        return value;
    }

    private string CHOR_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        CHOR = Y --> bfdcp_cola_deliv = 2 Clinical chorioamnionitis diagnosed during labor or maternal temperature >= 38 degrees C (100.4 degrees F)

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }

    private string MECS_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        MECS = Y --> bfdcp_cola_deliv = 6 Moderate to heavy meconium staining of the amniotic fluid

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "6";

        return value;
    }

    private string FINT_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        FINT = Y --> bfdcp_cola_deliv = 7 Fetal intolerance of labor such that one or more of the following actions was taken: in-utero resuscitative measures, further fetal assessment, or operative delivery 

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "7";

        return value;
    }

    private string ESAN_NAT_Rule(string value)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

        ESAN = Y --> bfdcp_cola_deliv = 3 Epidural or spinal anesthesia during labor

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

        If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }

    private string TLAB_NAT_Rule(string value)
    {
        /*Y = Yes -> 1 Yes
        N = No -> 0 No
        U = Unknown -> 7777 Unknown
        X = Not Applicable -> 2 Not Applicable

        Map empty rows to 9999 (blank)
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            case "X":
                value = "2";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string MTR_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        MTR = Y --> bfdcp_m_morbi = 0 Maternal transfusion

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }

    private string PLAC_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        PLAC = Y --> bfdcp_m_morbi = 3 Third or fourth degree perineal laceration

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }

    private string RUT_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        RUT = Y --> bfdcp_m_morbi = 5 Ruptured uterus

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        if (value == "Y")
            value = "5";

        return value;
    }

    private string UHYS_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        UHYS = Y --> bfdcp_m_morbi = 1 Unplanned hysterectomy

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }

    private string AINT_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        AINT = Y --> bfdcp_m_morbi = 4 Admission to intensive care unit

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        if (value == "Y")
            value = "4";

        return value;
    }

    private string UOPR_NAT_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        UOPR = Y --> bfdcp_m_morbi = 2 Unplanned operating room procedure following delivery

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }

    private string BWG_NAT_Rule(string value)
    {
        /*If BWG is in 0000-9998, do the following:
        1. Transfer number verbatim to bcifsbadbw_go_pound.
        2. Set value for bcifsbadbw_uo_measu to 0 Grams.

        If BWG = 9999, do the following:
        1. Leave bcifsbadbw_go_pound empty/blank.
        2. Leave bcifsbadbw_uo_measu as 9999 (blank).

        */
        if (value == "9999")
            value = "";

        return value;
    }

    private string BWG_measu_NAT_Rule(string value)
    {
        /*If BWG is in 0000-9998, do the following:
        1. Transfer number verbatim to bcifsbadbw_go_pound.
        2. Set value for bcifsbadbw_uo_measu to 0 Grams.

        If BWG = 9999, do the following:
        1. Leave bcifsbadbw_go_pound empty/blank.
        2. Leave bcifsbadbw_uo_measu as 9999 (blank).

        */
        if (value == "9999")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string PLUR_Custom_NAT_Rule(string value)
    {
        /*If PLUR = 01, then do the following:
        1. Set bfdcppc_plura = 1 Singleton
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 0 No

        If PLUR = 02, then do the following:
        1. Set bfdcppc_plura = 2 Twins
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 03, then do the following:
        1. Set bfdcppc_plura = 3 Triplets
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR is in 04-12, then do the following:
        1. Set bfdcppc_plura = 4 More than 3
        2. Transfer PLUR verbatim to bfdcppc_sigt_3
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 99, then do the following:
        1. Set bfdcppc_plura = 9999 (blank)
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 9999 (blank)*/

        switch (value)
        {
            case "01":
            case "1":
                value = "1";
                break;
            case "02":
            case "2":
                value = "2";
                break;
            case "03":
            case "3":
                value = "3";
                break;
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "11":
            case "12":
                value = "4";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }
    private string PLUR_sigt_NAT_Rule(string value)
    {
        /*If PLUR = 01, then do the following:
        1. Set bfdcppc_plura = 1 Singleton
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 0 No

        If PLUR = 02, then do the following:
        1. Set bfdcppc_plura = 2 Twins
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 03, then do the following:
        1. Set bfdcppc_plura = 3 Triplets
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR is in 04-12, then do the following:
        1. Set bfdcppc_plura = 4 More than 3
        2. Transfer PLUR verbatim to bfdcppc_sigt_3
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 99, then do the following:
        1. Set bfdcppc_plura = 9999 (blank)
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 9999 (blank)*/

        switch (value)
        {
            case "01":
            case "1":
                value = "";
                break;
            case "02":
            case "2":
                value = "";
                break;
            case "03":
            case "3":
                value = "";
                break;
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "11":
            case "12":
                value = value;
                break;
            default:
                value = "";
                break;
        }

        return value;
    }
    private string PLUR_gesta_NAT_Rule(string value)
    {
        /*If PLUR = 01, then do the following:
        1. Set bfdcppc_plura = 1 Singleton
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 0 No

        If PLUR = 02, then do the following:
        1. Set bfdcppc_plura = 2 Twins
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 03, then do the following:
        1. Set bfdcppc_plura = 3 Triplets
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR is in 04-12, then do the following:
        1. Set bfdcppc_plura = 4 More than 3
        2. Transfer PLUR verbatim to bfdcppc_sigt_3
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 99, then do the following:
        1. Set bfdcppc_plura = 9999 (blank)
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 9999 (blank)*/

        switch (value)
        {
            case "01":
            case "1":
                value = "0";
                break;
            case "02":
            case "2":
                value = "1";
                break;
            case "03":
            case "3":
                value = "1";
                break;
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "11":
            case "12":
                value = "1";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string AVEN1_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        AVEN1 = Y --> bcifs_aco_newbo = 0 Assisted ventilation required immediately following delivery

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }

    private string AVEN6_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        AVEN6 = Y --> bcifs_aco_newbo = 3 Assisted ventilation required for more than 6 hours

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }

    private string NICU_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        NICU = Y --> bcifs_aco_newbo = 4 NICU admission

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "4";

        return value;
    }

    private string SURF_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        SURF = Y --> bcifs_aco_newbo = 1 Newborn given surfactant replacement therapy

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }

    private string ANTI_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        ANTI = Y --> bcifs_aco_newbo = 5 Antibiotics received by the newborn for suspected neonatal sepsis

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "5";

        return value;
    }

    private string SEIZ_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        SEIZ = Y --> bcifs_aco_newbo = 2 Seizure or serious neurologic dysfunction

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }

    private string BINJ_NAT_Rule(string value)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        BINJ = Y --> bcifs_aco_newbo = 6 Significant birth injury (skeletal fracture(s), peripheral nerve injury and or soft tissue or solid organ hemorrhage which requires intervention)

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        if (value == "Y")
            value = "6";

        return value;
    }

    private string ANEN_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        ANEN = Y --> bcifs_c_anoma = 0 Anencephaly

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }

    private string MNSB_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        MNSB = Y --> bcifs_c_anoma = 9 Meningomyelocele or Spina bifida

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "9";

        return value;
    }

    private string CCHD_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CCHD = Y --> bcifs_c_anoma = 1 Cyanotic congenital heart disease

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }

    private string CDH_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CDH = Y --> bcifs_c_anoma = 10 Congenital diaphragmatic hernia

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "10";

        return value;
    }

    private string OMPH_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        OMPH = Y --> bcifs_c_anoma = 2 Omphalocele

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }

    private string GAST_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        GAST = Y --> bcifs_c_anoma = 11 Gastroschisis

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "11";

        return value;
    }

    private string LIMB_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        LIMB = Y --> bcifs_c_anoma = 3 Limb reduction defect (excluding congenital amputation and dwarfing syndromes)

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }

    private string CL_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CL = Y --> bcifs_c_anoma = 4 Cleft Lip with or without Cleft Palate

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "4";

        return value;
    }

    private string CP_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CP = Y --> bcifs_c_anoma = 12 Cleft palate alone

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "12";

        return value;
    }

    private string DOWT_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        If DOWT = C --> bcifs_c_anoma = 6 Karyotype confirmed - Downs Syndrome
        If DOWT = P --> bcifs_c_anoma = 7 Karyotype pending - Downs Syndrome

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "C")
            value = "6";
        else if (value == "P")
            value = "7";

        return value;
    }

    private string CDIT_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        If CDIT = C --> bcifs_c_anoma = 14 Karyotype confirmed - Suspected chromosomal disorder
        If CDIT = P --> bcifs_c_anoma = 15 Karyotype pending - Suspected chromosomal disorder

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "C")
            value = "14";
        else if (value == "P")
            value = "15";

        return value;
    }

    private string HYPO_NAT_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        HYPO = Y --> bcifs_c_anoma = 8 Hypospadias

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "8";

        return value;
    }

    private string MAGER_NAT_Rule(string value, string dob_YR, string dob_MO, string dob_day, string dodeliv_YR, string dodeliv_MO, string dodeliv_day)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field.

        If value = 99, leave the MMRIA value empty/blank*/
        if (value == "99")
            value = age_delivery(dob_YR, dob_MO, dob_day, dodeliv_YR, dodeliv_MO, dodeliv_day);

        return value;
    }

    private string FAGER_NAT_Rule(string value, string dob_YR, string dob_MO, string dodeliv_YR, string dodeliv_MO, string dodeliv_day)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field.

        If value = 99, leave the MMRIA value empty/blank*/
        if (value == "99")
            value = age_delivery(dob_YR, dob_MO, "1", dodeliv_YR, dodeliv_MO, dodeliv_day);

        return value;
    }

    private string EHYPE_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        EHYPE = Y --> bfdcprf_rfit_pregn = 4 Eclampsia Hypertension

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "4";

        return value;
    }

    private string INFT_DRG_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        INFT_DRG = Y --> bfdcprf_rfit_pregn = 8 Fertility Enhancing Drugs, Artificial Insemination or Intrauterine Insemination

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "8";

        return value;
    }

    private string INFT_ART_NAT_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        INFT_ART = Y --> bfdcprf_rfit_pregn = 9 Assisted Reproductive Technology (e.g. in vitro fertilization (IVF), gamete intrafallopian transfer (GIFT))

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "9";

        return value;
    }


    private string FBPLACD_ST_TER_C_NAT_Rule(string value)
    {
        /*Map XX --> 9999 (blank)
        Map ZZ --> 9999 (blank)

        Map all other values to MMRIA field state listing*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    private string FBPLACE_CNT_C_NAT_Rule(string value)
    {
        /*Map to MMRIA field country listing

        Map XX --> 9999 (blank)
        Map ZZ --> 9999 (blank)*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }

    #endregion

    #region FET Rules

    private object FET_maternal_morbidity_Rule(string value1, string value2, string value3, string value4, string value5, string value6)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        MTR = Y --> bfdcp_m_morbi = 0 Maternal transfusion

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N")
        //    determinedValues.Add("6");
        //else
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

        }

        return determinedValues.ToArray();
    }

    private object FET_characteristics_of_labor_and_delivery_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7, string value8, string value9)
    {
        /*Use values from 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] to populate MMRIA multi-select field (bfdcp_cola_deliv). 

INDL = Y --> bfdcp_cola_deliv = 0 Induction of labor

If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "N", then bfdcp_cola_deliv = 9 None of the above

If every one of the 9 IJE fields [INDL, AUGL, NVPR, STER, ANTB, CHOR, MECS, FINT, ESAN] is equal to "U" then bfdcp_cola_deliv = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //     && value9 == "N")
        //    determinedValues.Add("9");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
                && value9 == "U")
            determinedValues.Add("777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

            if (int.TryParse(value9, out result))
                determinedValues.Add(value9);
        }

        return determinedValues.ToArray();
    }

    private object FET_onset_of_labor_Rule(string value1, string value2, string value3)
    {
        /*Use values from 3 IJE fields [PROM, PRIC, PROL] to populate MMRIA multi-select field (bfdcp_oo_labor). 

PROM = Y --> bfdcp_oo_labor = 0 Premature Rupture of Membranes (Prolonged)

If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "N", then bfdcp_oo_labor = 3 None of the above

If every one of the 3 IJE fields [PROM, PRIC, PROL] is equal to "U" then bfdcp_oo_labor = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N")
        //    determinedValues.Add("3");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

        }

        return determinedValues.ToArray();
    }

    private object FET_obstetric_procedures_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values from 4 IJE fields [CERV, TOC, ECVS, ECVF] to populate MMRIA multi-select field (bfdcp_o_proce). 

CERV = Y --> bfdcp_o_proce = 0 Cervical Cerclage

If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "N", then bfdcp_o_proce = 4 None of the above

If every one of the 4 IJE fields [CERV, TOC, ECVS, ECVF] is equal to "U" then bfdcp_o_proce = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N")
        //    determinedValues.Add("4");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

        }

        return determinedValues.ToArray();
    }


    private object FET_infections_present_or_treated_during_pregnancy_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7, string value8, string value9, string value10, string value11, string value12)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        GON = Y --> bfdcp_ipotd_pregn = 2 Gonorrhea

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //     && value9 == "N" && value10 == "N" && value11 == "N" && value12 == "N")
        //    determinedValues.Add("17");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
                && value9 == "U" && value10 == "U" && value11 == "U" && value12 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

            if (int.TryParse(value9, out result))
                determinedValues.Add(value9);

            if (int.TryParse(value10, out result))
                determinedValues.Add(value10);

            if (int.TryParse(value11, out result))
                determinedValues.Add(value11);

            if (int.TryParse(value12, out result))
                determinedValues.Add(value12);
        }

        return determinedValues.ToArray();
    }

    private object FET_risk_factors_in_this_pregnancy_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7, string value8, string value9)
    {
        //    /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        //   EHYPE = Y --> bfdcprf_rfit_pregn = 4 Eclampsia Hypertension

        //   If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        //   If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        //   *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */

        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //    && value9 == "N")
        //    determinedValues.Add("11");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
            && value9 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

        }

        return determinedValues.ToArray();
    }

    private object FET_congenital_Rule(string value1, string value2, string value3, string value4, string value5
        , string value6, string value7, string value8, string value9
        , string value10, string value11, string value12)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/

        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N" && value8 == "N"
        //     && value9 == "N" && value10 == "N" && value11 == "N" && value12 == "N")
        //    determinedValues.Add("17");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U" && value8 == "U"
                && value9 == "U" && value10 == "U" && value11 == "U" && value12 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);

            if (int.TryParse(value8, out result))
                determinedValues.Add(value8);

            if (int.TryParse(value9, out result))
                determinedValues.Add(value9);

            if (int.TryParse(value10, out result))
                determinedValues.Add(value10);

            if (int.TryParse(value11, out result))
                determinedValues.Add(value11);

            if (int.TryParse(value12, out result))
                determinedValues.Add(value12);
        }

        return determinedValues.ToArray();
    }

    private object FET_abnormal_Rule(string value1, string value2, string value3, string value4, string value5, string value6, string value7)
    {
        /*Use values from 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] to populate MMRIA multi-select field (bcifs_aco_newbo). 

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "N", then bcifs_aco_newbo = 8 None of the above

        If every one of the 7 IJE fields [AVEN1, AVEN6, NICU, SURF, ANTI, SEIZ, BINJ] is equal to "U" then bcifs_aco_newbo = 7777 Unknown*/
        List<string> determinedValues = new List<string>();

        //if (value1 == "N" && value2 == "N" && value3 == "N" && value4 == "N"
        //    && value5 == "N" && value6 == "N" && value7 == "N")
        //    determinedValues.Add("8");
        //else 
        if (value1 == "U" && value2 == "U" && value3 == "U" && value4 == "U"
            && value5 == "U" && value6 == "U" && value7 == "U")
            determinedValues.Add("7777");
        else
        {
            if (int.TryParse(value1, out int result))
                determinedValues.Add(value1);

            if (int.TryParse(value2, out result))
                determinedValues.Add(value2);

            if (int.TryParse(value3, out result))
                determinedValues.Add(value3);

            if (int.TryParse(value4, out result))
                determinedValues.Add(value4);

            if (int.TryParse(value5, out result))
                determinedValues.Add(value5);

            if (int.TryParse(value6, out result))
                determinedValues.Add(value6);

            if (int.TryParse(value7, out result))
                determinedValues.Add(value7);
        }

        return determinedValues.ToArray();
    }

    private string FET_LOCATION_OF_RESIDENCE_street_Rule(string stnum_r, string predir_r, string stname_r, string stdesig_r, string postdir_r)
    {
        //Map to MMRIA field via Merge with other place of death street fields(STNUM_D, PREDIR_D, STNAME_D, STDESIG_D, POSTDIR_D) 1 of 5
        string determinedValue = $"{stnum_r} {predir_r} {stname_r} {stdesig_r} {postdir_r}";

        return determinedValue;
    }

    private string FET_DATE_OF_DELIVERY_Rule(string year, string month, string day)
    {
        //2.Merge 3 fields(IDOB_MO, IDOB_DY, IDOB_YR) map resulting date to MMRIA field -date_of _delivery(bcifsri_do_deliv)."
        string determinedValue = $"{year}-{month}-{day}";

        return determinedValue;
    }


    private string MDOB_YR_FET_Rule(string value)
    {
        /*If value is not 9999, transfer number verbatim to MMRIA field.

        If value = 9999, map to 9999 (blank).*/
        if (value == "9999")
            value = "9999";

        return value;
    }

    private string MDOB_MO_FET_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.  

        If value = 99, map to 9999 (blank). */

        if (value == "99")
            value = "9999";

        return value;
    }

    private string MDOB_DY_FET_Rule(string value)
    {
        /*If value is in 01-31, transfer number verbatim to MMRIA field.  
            * If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string FDOB_YR_FET_Rule(string value)
    {
        /*If value is not 9999, transfer number verbatim to MMRIA field.

        If value = 9999, map to 9999 (blank).*/

        if (value == "9999")
            value = "9999";

        return value;
    }

    private string FDOB_MO_FET_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string MARN_FET_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string MEDUC_FET_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = 8th Grade or Less
        2  -> 1 = 9th-12th Grade; No Diploma
        3  -> 2 = High School Grad or GED Completed 
        4  -> 3 = Some college, but no degree
        5  -> 4 = Associate Degree
        6  -> 5 = Bachelor's Degree
        7  -> 6 = Master's Degree
        8  -> 7 = Doctorate or Professional Degree
        9  -> 7777 = Unknown*/

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "6":
                value = "5";
                break;
            case "7":
                value = "6";
                break;
            case "8":
                value = "7";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string ATTEND_FET_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = MD
        2 -> 1 = DO
        3 -> 2 = CNM/CM
        4 -> 3 = Other Midwife
        5 -> 4 = Other 
        9 -> 7777 = Unknown*/

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string TRAN_FET_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string NPREV_FET_Rule(string value)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field. 

        If value = 99, map to 9999 (blank)*/

        if (value == "99")
            value = "";

        return value;
    }

    private string HFT_FET_Rule(string value)
    {
        /*If value is in 1-8, transfer number verbatim to MMRIA field. 

        If value = 9, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "9")
            value = "";

        return value;
    }

    private string HIN_FET_Rule(string value)
    {
        /*If value is in 00-11, transfer number verbatim to MMRIA field. 

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99")
            value = "";

        return value;
    }

    private string PWGT_FET_Rule(string value)
    {
        /*If value is in 050-400, transfer number verbatim to MMRIA field.

        If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "999" || value == "9999")
            value = "";

        return value;
    }

    private string DWGT_FET_Rule(string value)
    {
        /*If value is in 050-450, transfer number verbatim to MMRIA field.  

        If value = 999, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "999" || value == "9999")
            value = "";

        return value;
    }

    private string WIC_FET_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string PLBL_FET_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.  

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99")
            value = "";

        return value;
    }

    private string PLBD_FET_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.  

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99")
            value = "";

        return value;
    }

    private string POPO_FET_Rule(string value)
    {
        /*If value is in 00-30, transfer number verbatim to MMRIA field.

        If value = 99, map to MMRIA value for missing [looks like this is just leaving the value empty/blank]*/

        if (value == "99" || value == "9999")
            value = "";

        return value;
    }

    private string MLLB_FET_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 88 or 99, map to 9999 (blank).*/

        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string YLLB_FET_Rule(string value)
    {
        /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.

        If value = 8888 or 9999, map to 9999 (blank).*/

        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string MOPO_FET_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 88 or 99, map to 9999 (blank).*/

        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string YOPO_FET_Rule(string value)
    {
        /*If value is not 8888 or 9999, transfer number verbatim to MMRIA field.  

        If value = 8888 or 9999, map to 9999 (blank).*/

        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string DLMP_YR_FET_Rule(string value)
    {
        /*If value is not 9999, transfer number verbatim to MMRIA field.

        If value = 9999, map to 9999 (blank).*/

        if (value == "9999")
            value = "9999";

        return value;
    }

    private string DLMP_MO_FET_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/
        if (value == "99")
            value = "9999";

        return value;
    }

    private string DLMP_DY_FET_Rule(string value)
    {
        /*If value is in 01-31, transfer number verbatim to MMRIA field.

        If value = 99, map to 9999 (blank).*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string NPCES_FET_Rule(string value)
    {
        /*Transfer number verbatim to MMRIA field.  Map 99 to 9999 (blank)*/

        if (value == "99")
            value = "9999";

        return value;
    }

    private string ATTF_FET_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  ->  7777 = Unknown
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string ATTV_FET_Rule(string value)
    {
        /*Map character to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        Y  -> 1 =Yes
        N  -> 0 = No
        U  -> 7777 = Unknown
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string PRES_FET_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = Cephalic
        2 -> 1 = Breech
        3 -> 4 = Other
        9 -> 7777 = Unknown*/

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "4";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ROUT_FET_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = Vaginal/Spontaneous
        2 -> 1 = Vaginal/Forceps
        3  -> 2 = Vaginal/Vacuum
        4  -> 3 = Cesarean
        9  -> 7777 = Unknown*/

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string OWGEST_FET_Rule(string value)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field.

        If value = 99, leave the value empty/blank. */

        if (value == "99")
            value = "";

        return value;
    }

    private string SORD_FET_Rule(string value)
    {
        /*If value is in 01-12, transfer number verbatim to MMRIA field.  

        If value = 99, leave the MMRIA value empty/blank.*/

        if (value == "99")
            value = "";

        return value;
    }


    private string FEDUC_FET_Rule(string value)
    {
        /*Map number to MMRIA code values as follows:
        Blank fields -> 9999 (blank)
        1 -> 0 = 8th Grade or Less
        2  -> 1 = 9th-12th Grade; No Diploma
        3  -> 2 = High School Grad or GED Completed 
        4  -> 3 = Some college, but no degree
        5  -> 4 = Associate Degree
        6  -> 5 = Bachelor's Degree
        7  -> 6 = Master's Degree
        8  -> 7 = Doctorate or Professional Degree
        9  -> 7777 = Unknown*/

        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "3";
                break;
            case "5":
                value = "4";
                break;
            case "6":
                value = "5";
                break;
            case "7":
                value = "6";
                break;
            case "8":
                value = "7";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string FSEX_FET_Rule(string value)
    {
        /*M = Male -> 0 Male
        F = Female -> 1 Female
        U = Unknown -> 7777 Unknown

        Map empty rows to 9999 (blank)
        */
        switch (value?.ToUpper())
        {
            case "M":
                value = "0";
                break;
            case "F":
                value = "1";
                break;
            case "U":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }
    private string DPLACE_Custom_FET_Rule(string value)
    {
        /*1 = Hospital -> bfdcpfodd_to_place = 0 Hospital & bfdcpfodd_whd_plann = 9999 (blank)

        2 = Freestanding Birth Center -> bfdcpfodd_to_place = 1 Free Standing Birth Center & bfdcpfodd_whd_plann = 9999 (blank)

        3 = Home (Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 1 Yes

        4 = Home (Not Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 0 No

        5 = Home (Unknown if Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 7777 Unknown

        6 = Clinic/Doctor's Office -> bfdcpfodd_to_place = 3 Clinic/Doctor's office & bfdcpfodd_whd_plann = 9999 (blank)

        7 = Other -> bfdcpfodd_to_place = 4 Other & bfdcpfodd_whd_plann = 9999 (blank)

        9 = Unknown --> bfdcpfodd_to_place = 7777 Unknown & bfdcpfodd_whd_plann = 9999 (blank)*/
        switch (value?.ToUpper())
        {
            case "1":
                value = "0";
                break;
            case "2":
                value = "1";
                break;
            case "3":
                value = "2";
                break;
            case "4":
                value = "2";
                break;
            case "5":
                value = "2";
                break;
            case "6":
                value = "3";
                break;
            case "7":
                value = "4";
                break;
            case "9":
                value = "7777";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }
    private string DPLACE_plann_Rule(string value)
    {
        /*1 = Hospital -> bfdcpfodd_to_place = 0 Hospital & bfdcpfodd_whd_plann = 9999 (blank)

            2 = Freestanding Birth Center -> bfdcpfodd_to_place = 1 Free Standing Birth Center & bfdcpfodd_whd_plann = 9999 (blank)

            3 = Home (Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 1 Yes

            4 = Home (Not Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 0 No

            5 = Home (Unknown if Intended) -> bfdcpfodd_to_place = 2 Home Birth & bfdcpfodd_whd_plann = 7777 Unknown

            6 = Clinic/Doctor's Office -> bfdcpfodd_to_place = 3 Clinic/Doctor's office & bfdcpfodd_whd_plann = 9999 (blank)

            7 = Other -> bfdcpfodd_to_place = 4 Other & bfdcpfodd_whd_plann = 9999 (blank)

            9 = Unknown --> bfdcpfodd_to_place = 7777 Unknown & bfdcpfodd_whd_plann = 9999 (blank)*/
        switch (value?.ToUpper())
        {
            case "1":
                value = "9999";
                break;
            case "2":
                value = "9999";
                break;
            case "3":
                value = "1";
                break;
            case "4":
                value = "0";
                break;
            case "5":
                value = "7777";
                break;
            case "6":
                value = "9999";
                break;
            case "7":
                value = "9999";
                break;
            case "9":
                value = "9999";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }

    private string BPLACEC_ST_TER_FET_Rule(string value)
    {
        /*Map XX --> 9999 (blank)
        Map ZZ --> 9999 (blank)

        Map all other values to MMRIA field state listing*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }
    private string BPLACEC_CNT_FET_Rule(string value)
    {
        /*Map to MMRIA field country listing 

        Map XX --> 9999 (blank)
        Map ZZ --> 9999 (blank)*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }
    
    private string METHNIC_FET_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values of METHNIC1, METHNIC2, METHNIC3, METHNIC4 to populate MMRIA field bfdcpdom_ioh_origi.

        H --> bfdcpdom_ioh_origi = 1 Yes, Mexican, Mexican American, Chicano
        H --> bfdcpdom_ioh_origi = 2 Yes, Puerto Rican
        H --> bfdcpdom_ioh_origi = 3 Yes, Cuban
        H --> bfdcpdom_ioh_origi = 4 Yes, Other Spanish/Hispanic/Latino


        If METHNIC1 = N and METHNIC2 = N and METHNIC3 = N and METHNIC 4 = N --> bfdcpdom_ioh_origi = 0 No, Not Spanish/Hispanic/Latino

        If METHNIC1 = U and METHNIC2 = U and METHNIC3 = U and METHNIC4 = U --> bfdcpdom_ioh_origi = 7777 Unknown

        If METHNIC1 = (empty) and METHNIC2 = (empty) and METHNIC3 = (empty) and METHNIC4 = (empty) --> bfdcpdom_ioh_origi = 9999 (blank)*/
        string determinedValue;

        if (value1?.ToUpper() == "H")
        {
            determinedValue = "1";
        }
        else if (value2?.ToUpper() == "H")
        {
            determinedValue = "2";
        }
        else if (value3?.ToUpper() == "H")
        {
            determinedValue = "3";
        }
        else if (value4?.ToUpper() == "H")
        {
            determinedValue = "4";
        }
        else if (value1?.ToUpper() == "N" && value2?.ToUpper() == "N" && value3?.ToUpper() == "N" && value4?.ToUpper() == "N")
        {
            determinedValue = "0";
        }
        else if (value1?.ToUpper() == "U" && value2?.ToUpper() == "U" && value3?.ToUpper() == "U" && value4?.ToUpper() == "U")
        {
            determinedValue = "7777";
        }
        else
        {
            determinedValue = "9999";
        }

        return determinedValue;
    }

    private string[] MRACE_FET_Rule(string value1, string value2, string value3, string value4, string value5,
        string value6, string value7, string value8, string value9, string value10,
        string value11, string value12, string value13, string value14, string value15)
    {
        /*Use values from MRACE1 through MRACE15 to populate MMRIA multi-select field (bfdcpr_ro_mothe).

        MRACE1 = Y --> bfdcpr_ro_mothe = 0 White
        MRACE2 = Y --> bfdcpr_ro_mothe = 1 Black or African American
        MRACE3 = Y --> bfdcpr_ro_mothe = 2 American Indian or Alaska Native
        MRACE4 = Y --> bfdcpr_ro_mothe = 7 Asian Indian
        MRACE5 = Y --> bfdcpr_ro_mothe = 8 Chinese
        MRACE6 = Y --> bfdcpr_ro_mothe = 9 Filipino
        MRACE7 = Y --> bfdcpr_ro_mothe = 10 Japanese
        MRACE8 = Y --> bfdcpr_ro_mothe = 11 Korean
        MRACE9 = Y --> bfdcpr_ro_mothe = 12 Vietnamese
        MRACE10 = Y --> bfdcpr_ro_mothe = 13 Other Asian
        MRACE11 = Y --> bfdcpr_ro_mothe = 3 Native Hawaiian
        MRACE12 = Y --> bfdcpr_ro_mothe = 4 Guamanian or Chamorro
        MRACE13 = Y --> bfdcpr_ro_mothe = 5 Samoan
        MRACE14 = Y --> bfdcpr_ro_mothe = 6 Other Pacific Islander
        MRACE15 = Y --> bfdcpr_ro_mothe = 14 Other Race

        If every one of MRACE1 through MRACE15 is equal to "N", then bfdcpr_ro_mothe = 8888 (Race Not Specified)*/

        List<string> determinedValues = new List<string>();

        if (value1?.ToUpper() == "Y")
        {
            determinedValues.Add("0");
        }
        if (value2?.ToUpper() == "Y")
        {
            determinedValues.Add("1");
        }
        if (value3?.ToUpper() == "Y")
        {
            determinedValues.Add("2");
        }
        if (value4?.ToUpper() == "Y")
        {
            determinedValues.Add("7");
        }
        if (value5?.ToUpper() == "Y")
        {
            determinedValues.Add("8");
        }
        if (value6?.ToUpper() == "Y")
        {
            determinedValues.Add("9");
        }
        if (value7?.ToUpper() == "Y")
        {
            determinedValues.Add("10");
        }
        if (value8?.ToUpper() == "Y")
        {
            determinedValues.Add("11");
        }
        if (value9?.ToUpper() == "Y")
        {
            determinedValues.Add("12");
        }
        if (value10?.ToUpper() == "Y")
        {
            determinedValues.Add("13");
        }
        if (value11?.ToUpper() == "Y")
        {
            determinedValues.Add("3");
        }
        if (value12?.ToUpper() == "Y")
        {
            determinedValues.Add("4");
        }
        if (value13?.ToUpper() == "Y")
        {
            determinedValues.Add("5");
        }
        if (value14?.ToUpper() == "Y")
        {
            determinedValues.Add("6");
        }
        if (value15?.ToUpper() == "Y")
        {
            determinedValues.Add("14");
        }
        if (determinedValues.Count == 0)
        {
            determinedValues.Add("8888");
        }
        return determinedValues.ToArray();
    }

    private string MRACE16_17_FET_Rule(string value16, string value17)
    {
        /*Combine MRACE16 and MRACE17 into one field (bfdcpr_p_tribe), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE16 to MMRIA field.
        2. Transfer string verbatim from MRACE17 and add to same MMRIA field.
        3. If both MRACE16 and MRACE17 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value16) || string.IsNullOrWhiteSpace(value17)))
        {
            value = $"{value16}|{value17}";
        }
        else if (!string.IsNullOrWhiteSpace(value16))
        {
            value = $"{value16}";
        }
        else
        {
            value = $"{value17}";
        }

        return value;
    }
    
    private string MRACE18_19_FET_Rule(string value18, string value19)
    {
        /*Combine MRACE18 and MRACE19 into one field (bfdcpr_o_asian), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE18 to MMRIA field.
        2. Transfer string verbatim from MRACE19 and add to same MMRIA field.
        3. If both MRACE18 and MRACE19 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value18) || string.IsNullOrWhiteSpace(value19)))
        {
            value = $"{value18}|{value19}";
        }
        else if (!string.IsNullOrWhiteSpace(value18))
        {
            value = $"{value18}";
        }
        else
        {
            value = $"{value19}";
        }

        return value;
        return value;
    }
    
    private string MRACE20_21_FET_Rule(string value20, string value21)
    {
        /*Combine MRACE20 and MRACE21 into one field (bfdcpr_op_islan), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE20 to MMRIA field.
        2. Transfer string verbatim from MRACE21 and add to same MMRIA field.
        3. If both MRACE20 and MRACE21 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value20) || string.IsNullOrWhiteSpace(value21)))
        {
            value = $"{value20}|{value21}";
        }
        else if (!string.IsNullOrWhiteSpace(value20))
        {
            value = $"{value20}";
        }
        else
        {
            value = $"{value21}";
        }

        return value;
    }
    
    private string MRACE22_23_FET_Rule(string value22, string value23)
    {
        /*Combine MRACE22 and MRACE23 into one field (bfdcpr_o_race), separated by pipe delimiter. 

        1. Transfer string verbatim from MRACE22 to MMRIA field.
        2. Transfer string verbatim from MRACE23 and add to same MMRIA field.
        3. If both MRACE22 and MRACE23 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value22) || string.IsNullOrWhiteSpace(value23)))
        {
            value = $"{value22}|{value23}";
        }
        else if (!string.IsNullOrWhiteSpace(value22))
        {
            value = $"{value22}";
        }
        else
        {
            value = $"{value23}";
        }

        return value;
    }
    
    private string DOFP_MO_FET_Rule(string value)
    {
        /*
        If DOFP_MO is in 01-12, transfer number verbatim to MMRIA field (bfdcppcdo1pv_month).

        If DOFP_MO = 99 --> bfdcppcdo1pv_month = 9999 (blank).

        If DOFP_MO = 88 and DOFP_DY = 88 and DOFP_YR = 8888, then do the following:
        1. bfdcppcdo1pv_month = 9999 (blank) 
        2. bfdcppcdo1pv_day = 9999 (blank)
        3. bfdcppcdo1pv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value; 
    }

    private string DOFP_DY_FET_Rule(string value)
    {
        /*If DOFP_DY is in 01-31, transfer number verbatim to MMRIA field (bfdcppcdo1pv_day).

        If DOFP_DY = 99 --> bfdcppcdo1pv_day = 9999 (blank).

        If DOFP_MO = 88 and DOFP_DY = 88 and DOFP_YR = 8888, then do the following:
        1. bfdcppcdo1pv_month = 9999 (blank) 
        2. bfdcppcdo1pv_day = 9999 (blank)
        3. bfdcppcdo1pv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string DOFP_YR_FET_Rule(string value)
    {
        /*If DOFP_YR is not equal to 8888 or 9999, transfer number verbatim to MMRIA field (bfdcppcdo1pv_year).

        If DOFP_YR = 9999 --> bfdcppcdo1pv_year = 9999 (blank).

        If DOFP_MO = 88 and DOFP_DY = 88 and DOFP_YR = 8888, then do the following:
        1. bfdcppcdo1pv_month = 9999 (blank) 
        2. bfdcppcdo1pv_day = 9999 (blank)
        3. bfdcppcdo1pv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string DOLP_MO_FET_Rule(string value)
    {
        /*If DOLP_MO is in 01-12, transfer number verbatim to MMRIA field (bfdcppcdolpv_month).

        If DOLP_MO = 99 --> bfdcppcdolpv_month = 9999 (blank).

        If DOLP_MO = 88 and DOLP_DY = 88 and DOLP_YR = 8888, then do the following:
        1. bfdcppcdolpv_month = 9999 (blank)
        2. bfdcppcdolpv_day = 9999 (blank)
        3. bfdcppcdolpv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value; 
    }

    private string DOLP_DY_FET_Rule(string value)
    {
        /*If DOLP_DY is in 01-31, transfer number verbatim to MMRIA field (bfdcppcdolpv_day).

        If DOLP_DY = 99 --> bfdcppcdolpv_day = 9999 (blank).

        If DOLP_MO = 88 and DOLP_DY = 88 and DOLP_YR = 8888, then do the following:
        1. bfdcppcdolpv_month = 9999 (blank)
        2. bfdcppcdolpv_day = 9999 (blank)
        3. bfdcppcdolpv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.*/
        if (value == "88" || value == "99")
            value = "9999";

        return value;
    }

    private string DOLP_YR_FET_Rule(string value)
    {
        /*If DOLP_YR is not equal to 8888 or 9999, transfer number verbatim to MMRIA field (bfdcppcdolpv_year).

        If DOLP_YR = 9999 --> bfdcppcdolpv_year = 9999 (blank).

        If DOLP_MO = 88 and DOLP_DY = 88 and DOLP_YR = 8888, then do the following:
        1. bfdcppcdolpv_month = 9999 (blank)
        2. bfdcppcdolpv_day = 9999 (blank)
        3. bfdcppcdolpv_year = 9999 (blank)
        4. bfdcppc_to1pc_visit = 0 No Prenatal Care.

        No other values are populated for bfdcppc_to1pc_visit from IJE fields.*/
        if (value == "8888" || value == "9999")
            value = "9999";

        return value;
    }

    private string CIGPN_Custom_FET_Rule(string value)
    {
        /*If CIGPN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_p3_month. 
        2. bfdcpcs_p3m_type = 0 Cigarette(s). 

        If CIGPN = 99, then do:
        1. bfdcpcs_p3_month =  (blank).
        2. bfdcpcs_p3m_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "";

        return value;
    }
    
    private string CIGPN_Type_FET_Rule(string value)
    {
        /*If CIGPN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_p3_month. 
        2. bfdcpcs_p3m_type = 0 Cigarette(s). 

        If CIGPN = 99, then do:
        1. bfdcpcs_p3_month = 9999 (blank).
        2. bfdcpcs_p3m_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/

        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string CIGFN_Custom_FET_Rule(string value)
    {
        /*If CIGFN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_1st. 
        2. bfdcpcs_t1_type = 0 Cigarette(s). 

        If CIGFN = 99, then do:
        1. bfdcpcs_t_1st = 9999 (blank).
        2. bfdcpcs_t1_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "";

        return value;
    }
    private string CIGFN_Type_FET_Rule(string value)
    {
        /*If CIGFN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_1st. 
        2. bfdcpcs_t1_type = 0 Cigarette(s). 

        If CIGFN = 99, then do:
        1. bfdcpcs_t_1st = 9999 (blank).
        2. bfdcpcs_t1_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string CIGSN_Type_FET_Rule(string value)
    {
        /*If CIGSN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_2nd. 
        2. bfdcpcs_t2_type = 0 Cigarette(s). 

        If CIGSN = 99, then do:
        1. bfdcpcs_t_2nd = 9999 (blank).
        2. bfdcpcs_t2_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }
    private string CIGSN_Custom_FET_Rule(string value)
    {
        /*If CIGSN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_2nd. 
        2. bfdcpcs_t2_type = 0 Cigarette(s). 

        If CIGSN = 99, then do:
        1. bfdcpcs_t_2nd = 9999 (blank).
        2. bfdcpcs_t2_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "";

        return value;
    }

    private string CIGLN_Type_FET_Rule(string value)
    {
        /*If CIGLN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_3rd. 
        2. bfdcpcs_t3_type = 0 Cigarette(s). 

        If CIGLN = 99, then do:
        1. bfdcpcs_t_3rd = 9999 (blank).
        2. bfdcpcs_t3_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "9999";
        else
            value = "0";

        return value;
    }
    private string CIGLN_Custom_FET_Rule(string value)
    {
        /*If CIGLN value in 00-98, then do:
        1. Transfer number verbatim to MMRIA field bfdcpcs_t_3rd. 
        2. bfdcpcs_t3_type = 0 Cigarette(s). 

        If CIGLN = 99, then do:
        1. bfdcpcs_t_3rd = 9999 (blank).
        2. bfdcpcs_t3_type = 9999 (blank) 

        Also look across 4 IJE fields (CIGPN, CIGFN, CIGSN, CIGLN) to fill out MMRIA field bfdcpcs_non_speci:
        1. If CIGPN = 99 and CIGFN = 99 and CIGSN = 99 and CIGLN = 99, then bfdcpcs_non_speci = 7777 Unknown.
        2. If CIGPN = 00 and CIGFN = 00 and CIGSN = 00 and CIGLN = 00 then bfdcpcs_non_speci = 0 None.
        3. Otherwise leave bfdcpcs_non_speci as 9999 (blank).*/
        if (value == "99")
            value = "";

        return value;
    }

    private string PDIAB_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PDIAB = Y --> bfdcprf_rfit_pregn = 0 Prepregnancy Diabetes

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. 
        */
        if (value == "Y")
            value = "0";

        return value;
    }
    private string GDIAB_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        GDIAB = Y --> bfdcprf_rfit_pregn = 1 Gestational Diabetes

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "1";

        return value;
    }
    private string PHYPE_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PHYPE = Y --> bfdcprf_rfit_pregn = 2 Prepregnacy Hypertension

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. 
        */
        if (value == "Y")
            value = "2";

        return value;
    }
    private string GHYPE_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        GHYPE = Y --> bfdcprf_rfit_pregn = 3 Gestational Hypertension

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "3";

        return value;
    }
    private string PPB_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PPB = Y --> bfdcprf_rfit_pregn = 5 Previous Preterm Birth

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "5";

        return value;
    }
    private string PPO_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PPO = Y --> bfdcprf_rfit_pregn = 6 Other Previous Poor Outcome

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "6";

        return value;
    }
    private string INFT_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        INFT = Y --> bfdcprf_rfit_pregn = 7 Pregnancy Resulted from Infertility Treatment

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "7";

        return value;
    }
    private string PCES_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        PCES = Y --> bfdcprf_rfit_pregn = 10 Mother had a Previous Cesarean Delivery

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. 
        */
        if (value == "Y")
            value = "10";

        return value;
    }
    private string GON_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        GON = Y --> bfdcp_ipotd_pregn = 2 Gonorrhea

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }
    private string SYPH_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        SYPH = Y --> bfdcp_ipotd_pregn = 3 Syphilis

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }
    private string HSV_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        HSV = Y --> bfdcp_ipotd_pregn = 11 Herpes Simplex [HSV]

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "11";

        return value;
    }
    private string CHAM_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        CHAM = Y --> bfdcp_ipotd_pregn = 6 Chlamydia

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "6";

        return value;
    }
    private string LM_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        LM = Y --> bfdcp_ipotd_pregn = 4 Listeria

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "4";

        return value;
    }
    private string GBS_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        GBS = Y --> bfdcp_ipotd_pregn = 8 Group B Streptococcus (fetal death(s) only)

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "8";

        return value;
    }
    private string CMV_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        CMV = Y --> bfdcp_ipotd_pregn = 5 Cytomegalovirus

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "5";

        return value;
    }
    private string B19_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        B19 = Y --> bfdcp_ipotd_pregn = 7 Parvovirus

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "7";

        return value;
    }
    private string TOXO_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        TOXO = Y --> bfdcp_ipotd_pregn = 9 Toxoplasmosis (fetal death(s) only)

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "9";

        return value;
    }
    private string OTHERI_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        OTHERI = Y --> bfdcp_ipotd_pregn = 14 Other

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "14";

        return value;
    }
    private string TLAB_FET_Rule(string value)
    {
        /*Y = Yes -> 1 Yes
        N = No -> 0 No
        U = Unknown -> 7777 Unknown
        X = Not Applicable -> 2 Not Applicable

        Map empty rows to 9999 (blank)
        */
        switch (value?.ToUpper())
        {
            case "Y":
                value = "1";
                break;
            case "N":
                value = "0";
                break;
            case "U":
                value = "7777";
                break;
            case "X":
                value = "2";
                break;
            default:
                value = "9999";
                break;
        }
        return value;
    }
    private string MTR_FET_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        MTR = Y --> bfdcp_m_morbi = 0 Maternal transfusion

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is empty then bfdcp_m_morbi = 9999 (blank)*/
        if (value == "Y")
            value = "0";

        return value;
    }
    private string PLAC_FET_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        PLAC = Y --> bfdcp_m_morbi = 3 Third or fourth degree perineal laceration

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is empty then bfdcp_m_morbi = 9999 (blank)*/
        if (value == "Y")
            value = "3";

        return value;
    }
    private string RUT_FET_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        RUT = Y --> bfdcp_m_morbi = 5 Ruptured uterus

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is empty then bfdcp_m_morbi = 9999 (blank)*/
        if (value == "Y")
            value = "5";

        return value;
    }
    private string UHYS_FET_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        UHYS = Y --> bfdcp_m_morbi = 1 Unplanned hysterectomy

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is empty then bfdcp_m_morbi = 9999 (blank)*/
        if (value == "Y")
            value = "1";

        return value;
    }
    private string AINT_FET_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        AINT = Y --> bfdcp_m_morbi = 4 Admission to intensive care unit

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is empty then bfdcp_m_morbi = 9999 (blank)*/
        if (value == "Y")
            value = "4";

        return value;
    }
    private string UOPR_FET_Rule(string value)
    {
        /*Use values from 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] to populate MMRIA multi-select field (bfdcp_m_morbi). 

        UOPR = Y --> bfdcp_m_morbi = 2 Unplanned operating room procedure following delivery

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "N", then bfdcp_m_morbi = 6 None of the above

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is equal to "U" then bfdcp_m_morbi = 7777 Unknown

        If every one of the 6 IJE fields [MTR, PLAC, RUT, UHYS, AINT, UOPR] is empty then bfdcp_m_morbi = 9999 (blank)*/
        if (value == "Y")
            value = "2";

        return value;
    }
    private string FWG_pound_FET_Rule(string value)
    {
        /*If BWG is in 0000-9998, do the following:
        1. Transfer number verbatim to bcifsbadbw_go_pound.
        2. Set value for bcifsbadbw_uo_measu to 0 Grams.

        If BWG = 9999, do the following:
        1. Leave bcifsbadbw_go_pound empty/blank.
        2. Leave bcifsbadbw_uo_measu as 9999 (blank).

        If BWG > 9999, do the following:
        1. Leave bcifsbadbw_go_pound empty/blank.
        2. Leave bcifsbadbw_uo_measu as 9999 (blank).

        */
        int.TryParse(value, out int numberParsed);

        if (numberParsed >= 9999)
            value = "";

        return value;
    }
    private string FWG_measure_FET_Rule(string value)
    {
        /*If BWG is in 0000-9998, do the following:
        1. Transfer number verbatim to bcifsbadbw_go_pound.
        2. Set value for bcifsbadbw_uo_measu to 0 Grams.

        If BWG = 9999, do the following:
        1. Leave bcifsbadbw_go_pound empty/blank.
        2. Leave bcifsbadbw_uo_measu as 9999 (blank).

        If BWG > 9999, do the following:
        1. Leave bcifsbadbw_go_pound empty/blank.
        2. Leave bcifsbadbw_uo_measu as 9999 (blank).

        */
        int.TryParse(value, out int numberParsed);

        if (numberParsed >= 9999)
            value = "9999";
        else
            value = "0";

        return value;
    }

    private string PLUR_Custom_FET_Rule(string value)
    {
        /*If PLUR = 01, then do the following:
        1. Set bfdcppc_plura = 1 Singleton
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 0 No

        If PLUR = 02, then do the following:
        1. Set bfdcppc_plura = 2 Twins
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 03, then do the following:
        1. Set bfdcppc_plura = 3 Triplets
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR is in 04-12, then do the following:
        1. Set bfdcppc_plura = 4 More than 3
        2. Transfer PLUR verbatim to bfdcppc_sigt_3
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 99, then do the following:
        1. Set bfdcppc_plura = 9999 (blank)
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 9999 (blank)*/

        switch (value)
        {
            case "01":
            case "1":
                value = "1";
                break;
            case "02":
            case "2":
                value = "2";
                break;
            case "03":
            case "3":
                value = "3";
                break;
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "11":
            case "12":
                value = "4";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }
    private string PLUR_sigt_FET_Rule(string value)
    {
        /*If PLUR = 01, then do the following:
        1. Set bfdcppc_plura = 1 Singleton
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 0 No

        If PLUR = 02, then do the following:
        1. Set bfdcppc_plura = 2 Twins
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 03, then do the following:
        1. Set bfdcppc_plura = 3 Triplets
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR is in 04-12, then do the following:
        1. Set bfdcppc_plura = 4 More than 3
        2. Transfer PLUR verbatim to bfdcppc_sigt_3
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 99, then do the following:
        1. Set bfdcppc_plura = 9999 (blank)
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 9999 (blank)*/

        switch (value)
        {
            case "01":
            case "1":
                value = "";
                break;
            case "02":
            case "2":
                value = "";
                break;
            case "03":
            case "3":
                value = "";
                break;
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "11":
            case "12":
                value = value;
                break;
            default:
                value = "";
                break;
        }

        return value;
    }
    private string PLUR_gesta_FET_Rule(string value)
    {
        /*If PLUR = 01, then do the following:
        1. Set bfdcppc_plura = 1 Singleton
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 0 No

        If PLUR = 02, then do the following:
        1. Set bfdcppc_plura = 2 Twins
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 03, then do the following:
        1. Set bfdcppc_plura = 3 Triplets
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR is in 04-12, then do the following:
        1. Set bfdcppc_plura = 4 More than 3
        2. Transfer PLUR verbatim to bfdcppc_sigt_3
        3. Set bcifs_im_gesta = 1 Yes

        If PLUR = 99, then do the following:
        1. Set bfdcppc_plura = 9999 (blank)
        2. Leave bfdcppc_sigt_3 empty/blank
        3. Set bcifs_im_gesta = 9999 (blank)*/

        switch (value)
        {
            case "01":
            case "1":
                value = "0";
                break;
            case "02":
            case "2":
                value = "1";
                break;
            case "03":
            case "3":
                value = "1";
                break;
            case "04":
            case "05":
            case "06":
            case "07":
            case "08":
            case "09":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
            case "11":
            case "12":
                value = "1";
                break;
            default:
                value = "9999";
                break;
        }

        return value;
    }

    private string ANEN_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        ANEN = Y --> bcifs_c_anoma = 0 Anencephaly

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "0";

        return value;
    }
    private string MNSB_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        MNSB = Y --> bcifs_c_anoma = 9 Meningomyelocele or Spina bifida

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "9";

        return value;
    }
    private string CCHD_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CCHD = Y --> bcifs_c_anoma = 1 Cyanotic congenital heart disease

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "1";

        return value;
    }
    private string CDH_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CDH = Y --> bcifs_c_anoma = 10 Congenital diaphragmatic hernia

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "10";

        return value;
    }
    private string OMPH_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        OMPH = Y --> bcifs_c_anoma = 2 Omphalocele

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "2";

        return value;
    }
    private string GAST_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        GAST = Y --> bcifs_c_anoma = 11 Gastroschisis

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "11";

        return value;
    }
    private string LIMB_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        LIMB = Y --> bcifs_c_anoma = 3 Limb reduction defect (excluding congenital amputation and dwarfing syndromes)

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "3";

        return value;
    }
    private string CL_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CL = Y --> bcifs_c_anoma = 4 Cleft Lip with or without Cleft Palate

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "4";

        return value;
    }
    private string CP_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        CP = Y --> bcifs_c_anoma = 12 Cleft palate alone

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "12";

        return value;
    }
    private string DOWT_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        If DOWT = C --> bcifs_c_anoma = 6 Karyotype confirmed - Downs Syndrome
        If DOWT = P --> bcifs_c_anoma = 7 Karyotype pending - Downs Syndrome

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if(value == "C")
            value = "6";
        else if (value == "P")
            value = "7";

        return value;
    }
    private string CDIT_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        If CDIT = C --> bcifs_c_anoma = 14 Karyotype confirmed - Suspected chromosomal disorder
        If CDIT = P --> bcifs_c_anoma = 15 Karyotype pending - Suspected chromosomal disorder

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "C")
            value = "14";
        else if (value == "P")
            value = "15";

        return value;
    }
    private string HYPO_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] to populate MMRIA multi-select field (bcifs_c_anoma). 

        HYPO = Y --> bcifs_c_anoma = 8 Hypospadias

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "N", then bcifs_c_anoma = 17 None of the above

        If every one of the 12 IJE fields [ANEN, MNSB, CCHD, CDH, OMPH, GAST, LIMB, CL, CP, DOWT, CDIT, HYPO] is equal to "U" then bcifs_c_anoma = 7777 Unknown*/
        if (value == "Y")
            value = "8";

        return value;
    }
    private string MAGER_FET_Rule(string value, string dob_YR, string dob_MO, string dob_day, string dodeliv_YR, string dodeliv_MO, string dodeliv_day)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field.

        If value = 99, leave the MMRIA value empty/blank*/
        if (value == "99")
            value = age_delivery(dob_YR, dob_MO, dob_day, dodeliv_YR, dodeliv_MO, dodeliv_day);

        return value;
    }
    private string FAGER_FET_Rule(string value, string dob_YR, string dob_MO, string dodeliv_YR, string dodeliv_MO, string dodeliv_day)
    {
        /*If value is in 00-98, transfer number verbatim to MMRIA field.

        If value = 99, leave the MMRIA value empty/blank*/
        if (value == "99")
            value = age_delivery(dob_YR, dob_MO, "1", dodeliv_YR, dodeliv_MO, dodeliv_day);

        return value;
    }
    private string EHYPE_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        EHYPE = Y --> bfdcprf_rfit_pregn = 4 Eclampsia Hypertension

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "4";

        return value;
    }
    private string INFT_DRG_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        INFT_DRG = Y --> bfdcprf_rfit_pregn = 8 Fertility Enhancing Drugs, Artificial Insemination or Intrauterine Insemination

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "8";

        return value;
    }
    private string INFT_ART_FET_Rule(string value)
    {
        /*Use values from 11 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, INFT_DRG, INFT_ART, PPO] to populate MMRIA multi-select field (bfdcprf_rfit_pregn). Note that these 11 IJE fields are not listed sequentially in order in this spreadsheet/IJE ordering.

        INFT_ART = Y --> bfdcprf_rfit_pregn = 9 Assisted Reproductive Technology (e.g. in vitro fertilization (IVF), gamete intrafallopian transfer (GIFT))

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "N", then bfdcprf_rfit_pregn = 11 None of the above

        If every one of the following 9 IJE fields (PDIAB, GDIAB, PHYPE, GHYPE, PPB, INFT, PCES, EHYPE, PPO) is equal to "U" then bfdcprf_rfit_pregn = 7777 Unknown

        *Note that when looking across the multiple fields to fill in "11 None of the above" and "7777 Unknown", you are looking across only 9 fields (not all 11) because INFT_DRG and INFR_ART are part of a skip pattern. */
        if (value == "Y")
            value = "9";

        return value;
    }
    private string HSV1_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        HSV1 = Y --> bfdcp_ipotd_pregn = 12 Genital Herpes (fetal death only)

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "12";

        return value;
    }
    private string HIV_FET_Rule(string value)
    {
        /*Use values from 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] to populate MMRIA multi-select field bfdcp_ipotd_pregn). Note that these fields are not ordered sequentially in this spreadsheet.

        HIV = Y --> bfdcp_ipotd_pregn = 13 HIV (fetal death only)

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "N", then bfdcp_ipotd_pregn = 10 None of the above

        If every one of the 12 IJE fields [GON, SYPH, CHAM, LM, GBS, CMV, B19, TOXO, HSV, HSV1, HIV, OTHERI] is equal to "U" then bfdcp_ipotd_pregn = 7777 Unknown*/
        if (value == "Y")
            value = "13";

        return value;
    }
    private string FBPLACD_ST_TER_C_FET_Rule(string value)
    {
        /*Map XX --> 9999 (blank)
        Map ZZ --> 9999 (blank)

        Map all other values to MMRIA field state listing*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }
    private string FBPLACE_CNT_C_FET_Rule(string value)
    {
        /*Map to MMRIA field country listing 

        XX --> 9999 (blank)
        ZZ --> 9999 (blank)*/
        if (value == "XX" || value == "ZZ")
            value = "9999";

        return value;
    }
    private string FETHNIC_FET_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values of FETHNIC1, FETHNIC2, FETHNIC3, FETHNIC4 to populate MMRIA field bfdcpdof_ifoh_origi.

            H --> bfdcpdof_ifoh_origi = 1 Yes, Mexican, Mexican American, Chicano
        H --> bfdcpdof_ifoh_origi = 2 Yes, Puerto Rican
        H --> bfdcpdof_ifoh_origi = 3 Yes, Cuban
        H --> bfdcpdof_ifoh_origi = 4, Yes, Other Spanish/Hispanic/Latino

            If FETHNIC1 = N and FETHNIC2 = N and FETHNIC3 = N and FETHNIC 4 = N --> bfdcpdof_ifoh_origi = 0 No, Not Spanish/Hispanic/Latino

            If FETHNIC1 = U and FETHNIC2 = U and FETHNIC3 = U and FETHNIC4 = U --> bfdcpdof_ifoh_origi = 7777 Unknown

            If FETHNIC1 = (empty) and FETHNIC2 = (empty) and FETHNIC3 = (empty) and FETHNIC4 = (empty) --> bfdcpdof_ifoh_origi = 9999 (blank)*/

        string determinedValue;

        if (value1?.ToUpper() == "H")
        {
            determinedValue = "1";
        }
        else if (value2?.ToUpper() == "H")
        {
            determinedValue = "2";
        }
        else if (value3?.ToUpper() == "H")
        {
            determinedValue = "3";
        }
        else if (value4?.ToUpper() == "H")
        {
            determinedValue = "4";
        }
        else if (value1?.ToUpper() == "N" && value2?.ToUpper() == "N" && value3?.ToUpper() == "N" && value4?.ToUpper() == "N")
        {
            determinedValue = "0";
        }
        else if (value1?.ToUpper() == "U" && value2?.ToUpper() == "U" && value3?.ToUpper() == "U" && value4?.ToUpper() == "U")
        {
            determinedValue = "7777";
        }
        else
        {
            determinedValue = "9999";
        }

        return determinedValue;
    }


    private string[] FRACE_FET_Rule(string value1, string value2, string value3, string value4, string value5,
        string value6, string value7, string value8, string value9, string value10,
        string value11, string value12, string value13, string value14, string value15)
    {
        /*Use values from FRACE1 through FRACE15 to populate MMRIA multi-select field (bfdcpdofr_ro_fathe).

        FRACE1 = Y --> bfdcpdofr_ro_fathe = 0 White
        FRACE2 = Y --> bfdcpdofr_ro_fathe = 1 Black or African American
        FRACE3 = Y --> bfdcpdofr_ro_fathe = 2 American Indian or Alaska Native
        FRACE4 = Y --> bfdcpdofr_ro_fathe = 7 Asian Indian
        FRACE5 = Y --> bfdcpdofr_ro_fathe = 8 Chinese
        FRACE6 = Y --> bfdcpdofr_ro_fathe = 9 Filipino
        FRACE7 = Y --> bfdcpdofr_ro_fathe = 10 Japanese
        FRACE8 = Y --> bfdcpdofr_ro_fathe = 11 Korean
        FRACE9 = Y --> bfdcpdofr_ro_fathe = 12 Vietnamese
        FRACE10 = Y --> bfdcpdofr_ro_fathe = 13 Other Asian
        FRACE11 = Y --> bfdcpdofr_ro_fathe = 3 Native Hawaiian
        FRACE12 = Y --> bfdcpdofr_ro_fathe = 4 Guamanian or Chamorro
        FRACE13 = Y --> bfdcpdofr_ro_fathe = 5 Samoan
        FRACE14 = Y --> bfdcpdofr_ro_fathe = 6 Other Pacific Islander
        FRACE15 = Y --> bfdcpdofr_ro_fathe = 14 Other Race

        If every one of FRACE1 through FRACE15 is equal to "N", then bfdcpdofr_ro_fathe = 8888 (Race Not Specified)*/
        List<string> determinedValues = new List<string>();


        if (value1?.ToUpper() == "Y")
        {
            determinedValues.Add("0");
        }
        if (value2?.ToUpper() == "Y")
        {
            determinedValues.Add("1");
        }
        if (value3?.ToUpper() == "Y")
        {
            determinedValues.Add("2");
        }
        if (value4?.ToUpper() == "Y")
        {
            determinedValues.Add("7");
        }
        if (value5?.ToUpper() == "Y")
        {
            determinedValues.Add("8");
        }
        if (value6?.ToUpper() == "Y")
        {
            determinedValues.Add("9");
        }
        if (value7?.ToUpper() == "Y")
        {
            determinedValues.Add("10");
        }
        if (value8?.ToUpper() == "Y")
        {
            determinedValues.Add("11");
        }
        if (value9?.ToUpper() == "Y")
        {
            determinedValues.Add("12");
        }
        if (value10?.ToUpper() == "Y")
        {
            determinedValues.Add("13");
        }
        if (value11?.ToUpper() == "Y")
        {
            determinedValues.Add("3");
        }
        if (value12?.ToUpper() == "Y")
        {
            determinedValues.Add("4");
        }
        if (value13?.ToUpper() == "Y")
        {
            determinedValues.Add("5");
        }
        if (value14?.ToUpper() == "Y")
        {
            determinedValues.Add("6");
        }
        if (value15?.ToUpper() == "Y")
        {
            determinedValues.Add("14");
        }
        if(determinedValues.Count == 0)
        {
            determinedValues.Add("8888");
        }
        return determinedValues.ToArray();
    }

    private string FRACE16_17_FET_Rule(string value16, string value17)
    {
        /*Combine FRACE16 and FRACE17 into one field (bfdcpdofr_p_tribe), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE16 to MMRIA field.
        2. Transfer string verbatim from FRACE17 and add to same MMRIA field.
        3. If both FRACE16 and FRACE17 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value16) || string.IsNullOrWhiteSpace(value17)))
        {
            value = $"{value16}|{value17}";
        }
        else if (!string.IsNullOrWhiteSpace(value16))
        {
            value = $"{value16}";
        }
        else
        {
            value = $"{value17}";
        }

        return value;
    }

    private string FRACE18_19_FET_Rule(string value18, string value19)
    {
        /*Combine FRACE18 and FRACE19 into one field (bfdcpdofr_o_asian), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE18 to MMRIA field.
        2. Transfer string verbatim from FRACE19 and add to same MMRIA field.
        3. If both FRACE18 and FRACE19 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value18) || string.IsNullOrWhiteSpace(value19)))
        {
            value = $"{value18}|{value19}";
        }
        else if (!string.IsNullOrWhiteSpace(value18))
        {
            value = $"{value18}";
        }
        else
        {
            value = $"{value19}";
        }

        return value;
    }

    private string FRACE20_21_FET_Rule(string value20, string value21)
    {
        /*Combine FRACE20 and FRACE21 into one field (bfdcpdofr_op_islan), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE20 to MMRIA field.
        2. Transfer string verbatim from FRACE21 and add to same MMRIA field.
        3. If both FRACE20 and FRACE21 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value20) || string.IsNullOrWhiteSpace(value21)))
        {
            value = $"{value20}|{value21}";
        }
        else if (!string.IsNullOrWhiteSpace(value20))
        {
            value = $"{value20}";
        }
        else
        {
            value = $"{value21}";
        }

        return value;
    }

    private string FRACE22_23_FET_Rule(string value22, string value23)
    {
        /*Combine FRACE22 and FRACE23 into one field (bfdcpdofr_o_race), separated by pipe delimiter. 

        1. Transfer string verbatim from FRACE22 to MMRIA field.
        2. Transfer string verbatim from FRACE23 and add to same MMRIA field.
        3. If both FRACE22 and FRACE23 are empty, leave MMRIA field empty (blank).*/
        string value = string.Empty;

        if (!(string.IsNullOrWhiteSpace(value22) || string.IsNullOrWhiteSpace(value23)))
        {
            value = $"{value22}|{value23}";
        }
        else if (!string.IsNullOrWhiteSpace(value22))
        {
            value = $"{value22}";
        }
        else
        {
            value = $"{value23}";
        }

        return value;
    }

    private string FET_METHNIC_Rule(string value1, string value2, string value3, string value4)
    {
        /*Use values of METHNIC1, METHNIC2, METHNIC3, METHNIC4 to populate MMRIA field bfdcpdom_ioh_origi.

        H --> bfdcpdom_ioh_origi = 1 Yes, Mexican, Mexican American, Chicano
        H --> bfdcpdom_ioh_origi = 2 Yes, Puerto Rican
        H --> bfdcpdom_ioh_origi = 3 Yes, Cuban
        H --> bfdcpdom_ioh_origi = 4 Yes, Other Spanish/Hispanic/Latino

        If METHNIC1 = N and METHNIC2 = N and METHNIC3 = N and METHNIC 4 = N --> bfdcpdom_ioh_origi = 0 No, Not Spanish/Hispanic/Latino

        If METHNIC1 = U and METHNIC2 = U and METHNIC3 = U and METHNIC4 = U --> bfdcpdom_ioh_origi = 7777 Unknown

        If METHNIC1 = (empty) and METHNIC2 = (empty) and METHNIC3 = (empty) and METHNIC4 = (empty) --> bfdcpdom_ioh_origi = 9999 (blank)*/

        string determinedValue;

        if (value1?.ToUpper() == "H")
        {
            determinedValue = "1";
        }
        else if (value2?.ToUpper() == "H")
        {
            determinedValue = "2";
        }
        else if (value3?.ToUpper() == "H")
        {
            determinedValue = "3";
        }
        else if (value4?.ToUpper() == "H")
        {
            determinedValue = "4";
        }
        else if (value1?.ToUpper() == "N" && value2?.ToUpper() == "N" && value3?.ToUpper() == "N" && value4?.ToUpper() == "N")
        {
            determinedValue = "0";
        }
        else if (value1?.ToUpper() == "U" && value2?.ToUpper() == "U" && value3?.ToUpper() == "U" && value4?.ToUpper() == "U")
        {
            determinedValue = "7777";
        }
        else
        {
            determinedValue = "9999";
        }

        return determinedValue;
    }

    #endregion

    #endregion

    private mmria.common.model.couchdb.case_view_response GetCaseView
    (

        mmria.common.couchdb.DBConfigurationDetail db_info,
        string search_key
    )
    {
        string request_string  = $"{db_info.url}/{db_info.prefix}mmrds/_design/sortable/_view/by_last_name?skip=0&limit=100000&startkey=\"{search_key.ToLower()}\"&endkey=\"{search_key.ToUpper()}\"";

        try
        {

            var case_view_curl = new mmria.getset.cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
            case_view_curl.SetTimeout(300 * 1000);
            string responseFromServer = case_view_curl.execute();

            mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);


            string key_compare = search_key.ToLower().Trim(new char[] { '"' });

            mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
            result.offset = case_view_response.offset;
            result.total_rows = case_view_response.total_rows;

            foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
            {
                bool add_item = false;

                if (is_matching_search_text(cvi.value.last_name, key_compare))
                {
                    add_item = true;
                }

                if (add_item)
                {
                    result.rows.Add(cvi);
                }

            }


            result.total_rows = result.rows.Count;
            result.rows = result.rows.Skip(0).Take(100000).ToList();

            return result;

        }
        catch (Exception ex)
        {
            Console.WriteLine($"BatchItemProcessor GetCaseView\nurl: {request_string}\n\nerror:\n{ex}");

        }


        return null;
    }

    public System.Dynamic.ExpandoObject GetCaseById(mmria.common.couchdb.DBConfigurationDetail db_info, string case_id)
    {
        try
        {
            string request_string = $"{db_info.url}/{db_info.prefix}mmrds/_all_docs?include_docs=true";

            if (!string.IsNullOrWhiteSpace(case_id))
            {
                request_string = $"{db_info.url}/{db_info.prefix}mmrds/{case_id}";
                var case_curl = new mmria.getset.cURL("GET", null, request_string, null, db_info.user_name, db_info.user_value);
                string responseFromServer = case_curl.execute();

                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject>(responseFromServer);

                return result;

            }

        }
        catch (Exception ex)
        {
            
            Console.WriteLine($"BatchItemProcessor.GetCaseById 11078\n{ex}");
        }

        return null;
    }

    private bool is_matching_search_text(string p_val1, string p_val2)
    {
        var result = false;

        if
        (
            !string.IsNullOrWhiteSpace(p_val1) &&
            //p_val1.Length > 3 &&
            (
                p_val2.IndexOf(p_val1, StringComparison.OrdinalIgnoreCase) > -1 ||
                p_val1.IndexOf(p_val2, StringComparison.OrdinalIgnoreCase) > -1
            )
        )
        {
            result = true;
        }

        return result;
    }

    //CALCULATE GESTATIONAL AGE AT BIRTH ON BC (LMP)
    /*
    path=birth_fetal_death_certificate_parent/prenatal_care/calculated_gestation
CALCULATE_GESTATIONAL_AGE_AT_BIRTH_ON_BC
        int event_year = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year);
        int event_month = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month);
        int event_day = parseInt(g_data.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day);
        int lmp_year = parseInt(g_data.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.year);
        int lmp_month = parseInt(g_data.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.month);
        int lmp_day = parseInt(g_data.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.day);
    event=onfocus
    */
    (string weeks, string days) CALCULATE_GESTATIONAL_AGE_AT_BIRTH_ON_BC
    (
        migrate.C_Get_Set_Value.get_value_result p_event_year_get_result,
        migrate.C_Get_Set_Value.get_value_result  p_event_month_get_result,
        migrate.C_Get_Set_Value.get_value_result  p_event_day_get_result,
        migrate.C_Get_Set_Value.get_value_result  p_lmp_year_get_result,
        migrate.C_Get_Set_Value.get_value_result  p_lmp_month_get_result,
        migrate.C_Get_Set_Value.get_value_result  p_lmp_day_get_result
    ) 
    {
        var result = ("","");


        bool is_valid_date(int year, int month, int day)
        {

            if
            (
                year < 1920 ||
                month == -1 ||
                day == -1 ||
                year > 3000 ||
                month > 12 ||
                day > 31
            )
            {
                return false;
            }




            var months31 = new HashSet<int>()
            {
                    1,
                    3,
                    5,
                    7,
                    8,
                    10,
                    12
            };
            // months with 31 days
            var months30 = new HashSet<int>()
            {
                    4,
                    6,
                    9,
                    11
            };
            // months with 30 days
            var months28 = new HashSet<int>(){2};
            // the only month with 28 days (29 if year isLeap)
            var isLeap = year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
            var valid = 
                months31.Contains(month) && day <= 31 || 
                months30.Contains(month)  && day <= 30 || 
                months28.Contains(month) && day <= 28 || 
                months28.Contains(month) && day <= 29 && isLeap;
            return valid;
        }
        int convert_from_dynamic_to_int(dynamic p_value)
        {
            int result = -1;
            if(p_value != null)
            {
                int.TryParse(p_value.ToString(), out result);
            }
            return result;
        }
        int calc_days(DateTime p_start_date, DateTime p_end_date) 
        {
            int days = (int) (p_end_date - p_start_date).TotalDays;
            return days;
        }

        (int weeks, int days) calc_ga_lmp(DateTime p_start_date, DateTime p_end_date) 
        {
            var weeks = calc_days(p_start_date, p_end_date) / 7;
            var days = calc_days(p_start_date, p_end_date) % 7;
            return (weeks, days);
        }

        object p_event_year_dynamic;
        object p_event_month_dynamic;
        object p_event_day_dynamic;
        object p_lmp_year_dynamic;
        object p_lmp_month_dynamic;
        object p_lmp_day_dynamic;


        if
        (
            p_event_year_get_result.is_error ||
            p_event_month_get_result.is_error ||
            p_event_day_get_result.is_error ||
            p_lmp_year_get_result.is_error ||
            p_lmp_month_get_result.is_error ||
            p_lmp_day_get_result.is_error
        )
        {
            return result;
        }
        else
        {
            p_event_year_dynamic = p_event_year_get_result.result;
            p_event_month_dynamic = p_event_month_get_result.result;
            p_event_day_dynamic = p_event_day_get_result.result;
            p_lmp_year_dynamic = p_lmp_year_get_result.result;
            p_lmp_month_dynamic = p_lmp_month_get_result.result;
            p_lmp_day_dynamic = p_lmp_day_get_result.result;
        }


        int event_year = convert_from_dynamic_to_int(p_event_year_dynamic);
        int event_month = convert_from_dynamic_to_int(p_event_month_dynamic);
        int event_day = convert_from_dynamic_to_int(p_event_day_dynamic);
        int lmp_year = convert_from_dynamic_to_int(p_lmp_year_dynamic);
        int lmp_month = convert_from_dynamic_to_int(p_lmp_month_dynamic);
        int lmp_day = convert_from_dynamic_to_int(p_lmp_day_dynamic);
        
        if 
        (
            is_valid_date(event_year, event_month, event_day) && 
            is_valid_date(lmp_year, lmp_month, lmp_day)
        ) 
        {
            try
            {
                var lmp_date = new DateTime(lmp_year, lmp_month, lmp_day);
                var event_date = new DateTime(event_year, event_month, event_day);

                var int_result = calc_ga_lmp(lmp_date, event_date);
                if(int_result.weeks > -1 && int_result.days > -1)
                {
                    result = (int_result.weeks.ToString(), int_result.days.ToString());
                }
            }
            catch(Exception)
            {

            }

        }

        return result;
    }

    mmria.common.niosh.NioshResult get_niosh_codes(string p_occupation, string p_industry)
    {
        var result = new mmria.common.niosh.NioshResult();
        var builder = new StringBuilder();
        builder.Append("https://wwwn.cdc.gov/nioccs/IOCode.ashx?n=3");
        var has_occupation = false;
        var has_industry = false;

        if(!string.IsNullOrWhiteSpace(p_occupation))
        {
            has_occupation = true;
            builder.Append($"&o={p_occupation}");
        }

        if(!string.IsNullOrWhiteSpace(p_industry))
        {
            has_industry = true;
            builder.Append($"&i={p_industry}");
        }

        


        if(has_occupation || has_industry)
        {
            var niosh_url = builder.ToString();

            var niosh_curl = new mmria.getset.cURL("GET", null, niosh_url, null);

            try
            {
                string responseFromServer = niosh_curl.execute();

                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.niosh.NioshResult>(responseFromServer);
            }
            catch
            {
                result.is_error = true;
            }
            
        }
        //{"Industry": [{"Code": "611110","Title": "Elementary and Secondary Schools","Probability": "9.999934E-001"},{"Code": "611310","Title": "Colleges, Universities, and Professional Schools","Probability": "2.598214E-006"},{"Code": "009990","Title": "Insufficient information","Probability": "2.312557E-006"}],"Occupation": [{"Code": "00-9900","Title": "Insufficient Information","Probability": "9.999897E-001"},{"Code": "11-9032","Title": "Education Administrators, Elementary and Secondary School","Probability": "6.550550E-006"},{"Code": "53-3022","Title": "Bus Drivers, School or Special Client","Probability": "4.932875E-007"}],"Scheme": "NAICS 2012 and SOC 2010"}
        return result;

    }


    string get_year_and_quarter(object p_value)
    {
        var result = string.Empty;
        
        if(p_value != null && !string.IsNullOrWhiteSpace(p_value.ToString()))
        try
        {
    
            if(p_value is DateTime)
            {
                var date_time = (DateTime) p_value;
                result = $"Q{System.Math.Floor(((date_time.Month -1) / 3D) + 1D)}-{date_time.Year}";
            }
            else
            {
                var date_string = p_value.ToString();
                if(date_string.IndexOf("-") > -1)
                {
                    var int_array = date_string.Split("-");
                    if(int_array.Length == 3)
                    {
                        DateTime date_time = new DateTime(int.Parse(int_array[0]), int.Parse(int_array[1]), int.Parse(int_array[2]));
                        result = $"Q{System.Math.Floor(((date_time.Month -1) / 3D) + 1D)}-{date_time.Year}";
                    }
                    else
                    {
                        DateTime date_time = DateTime.ParseExact
                        (
                            date_string,
                            "yyyy-MM-dd", //"MM/dd/yyyy", 
                            System.Globalization.CultureInfo.InvariantCulture
                        );
                        result = $"Q{System.Math.Floor(((date_time.Month -1) / 3D) + 1D)}-{date_time.Year}";
                    }
                }
                else if(date_string.IndexOf("/") > -1)
                {
                    DateTime date_time = DateTime.ParseExact
                    (
                        date_string,
                        "MM/dd/yyyy", 
                        System.Globalization.CultureInfo.InvariantCulture
                    );
                    result = $"Q{System.Math.Floor(((date_time.Month -1) / 3D) + 1D)}-{date_time.Year}";
                }
                else
                {
                    DateTime date_time = DateTime.ParseExact
                    (
                        date_string,
                        "yyyy-MM-dd", //"MM/dd/yyyy", 
                        System.Globalization.CultureInfo.InvariantCulture
                    );
                    result = $"Q{System.Math.Floor(((date_time.Month -1) / 3D) + 1D)}-{date_time.Year}";
                }
            }
        
        }
        catch
        {
            // do nothing
        }

        return result;
    }





	public (string, mmria.common.cvs.tract_county_result) GetCVSData
    (
        string c_geoid,
		string t_geoid,
		string year,
        mmria.common.couchdb.ConfigurationSet ConfigDB
    ) 
    { 

        mmria.common.cvs.tract_county_result result = null;
        var response_string = string.Empty;

        var base_url = ConfigDB.name_value["cvs_api_url"];

        try
        {
            
            var get_all_data_body = new mmria.common.cvs.get_all_data_post_body()
            {
                id = ConfigDB.name_value["cvs_api_id"],
                secret = ConfigDB.name_value["cvs_api_key"],
                payload = new()
                {
                    
                    c_geoid = c_geoid,
                    t_geoid = t_geoid,
                    year = year
                }
            };

            var body_text =  System.Text.Json.JsonSerializer.Serialize(get_all_data_body);
            var get_all_data_curl = new mmria.getset.cURL("POST", null, base_url, body_text);

            response_string = get_all_data_curl.execute();
            System.Console.WriteLine(response_string);

            result = System.Text.Json.JsonSerializer.Deserialize<mmria.common.cvs.tract_county_result>(response_string);
        
        }
        catch(System.Net.WebException ex)
        {
            System.Console.WriteLine($"cvsAPIController  POST\n{ex}");
            
            /*return Problem(
                type: "/docs/errors/forbidden",
                title: "CVS API Error",
                detail: ex.Message,
                statusCode: (int) ex.Status,
                instance: HttpContext.Request.Path
            );*/

            return ($"Status: {ex.Status} {ex.Message} {response_string}", null);
        }

        return ("success", result);
    }


    public List<int> CVS_Get_Valid_Years(mmria.common.couchdb.ConfigurationSet ConfigDB) 
    { 
        var result = new List<int>()
		{
			2010,
			2011,
			2012,
			2013,
			2014,
			2015,
			2016,
			2017,
			2018,
			2019,
			2020
		};

        var base_url = ConfigDB.name_value["cvs_api_url"];

        try
        {


			var get_year_body = new mmria.common.cvs.get_year_post_body()
			{
				id = ConfigDB.name_value["cvs_api_id"],
				secret = ConfigDB.name_value["cvs_api_key"],
				payload = new()
			};

			var body_text =  System.Text.Json.JsonSerializer.Serialize(get_year_body);
			var get_year_curl = new mmria.getset.cURL("POST", null, base_url, body_text);
			string get_year_response = get_year_curl.execute();
			result = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>> (get_year_response);

			System.Console.WriteLine(get_year_response);

    
        }
        catch(System.Net.WebException ex)
        {
            System.Console.WriteLine($"cvsAPIController Get Year POST\n{ex}");
            
            /*return Problem(
                type: "/docs/errors/forbidden",
                title: "CVS API Error",
                detail: ex.Message,
                statusCode: (int) ex.Status,
                instance: HttpContext.Request.Path
            );*/
        }


        return result;
    }	

    	bool is_result_quality_in_need_of_checking(mmria.common.cvs.tract_county_result val)
	{

		var over_all_result = false;
		var tract_result = false;
		var county_result = false;

		const float tract_total = 11F;
		const float county_total = 26F;

		float tract_zero_count = 0F;
		float county_zero_count = 0F;

		const float _30_percent_correct = .3F;

		if
		(
			val.tract.pctMOVE == 0  && //cvs_pctmove_tract
			val.tract.pctNOIns_Fem == 0 && //cvs_pctnoins_fem_tract		
			val.county.pctNoVehicle == 0 && //cvs_pctnovehicle_county
			val.tract.pctNoVehicle == 0 && //cvs_pctnovehicle_tract
			val.tract.pctOWNER_OCC == 0 //cvs_pctowner_occ_tract
		)
		{
			over_all_result = true;
		}


		if(val.tract.pctNOIns_Fem == 0) tract_zero_count += 1;
		if(val.tract.MEDHHINC == 0) tract_zero_count += 1;
		if(val.tract.pctNoVehicle == 0) tract_zero_count += 1;
		if(val.tract.pctMOVE == 0) tract_zero_count += 1;
		if(val.tract.pctSPHH == 0) tract_zero_count += 1;
		if(val.tract.pctOVERCROWDHH == 0) tract_zero_count += 1;
		if(val.tract.pctOWNER_OCC == 0) tract_zero_count += 1;
		if(val.tract.pct_less_well == 0) tract_zero_count += 1;
		if(val.tract.NDI_raw == 0) tract_zero_count += 1;
		if(val.tract.pctPOV == 0) tract_zero_count += 1;
		if(val.tract.ICE_INCOME_all == 0) tract_zero_count += 1;



		if(val.county.MDrate == 0) county_zero_count += 1;
		if(val.county.pctNOIns_Fem == 0) county_zero_count += 1;
		if(val.county.pctNoVehicle == 0) county_zero_count += 1;
		if(val.county.pctMOVE == 0) county_zero_count += 1;
		if(val.county.pctSPHH == 0) county_zero_count += 1;
		if(val.county.pctOVERCROWDHH == 0) county_zero_count += 1;
		if(val.county.pctOWNER_OCC == 0) county_zero_count += 1;
		if(val.county.pct_less_well == 0) county_zero_count += 1;
		if(val.county.NDI_raw == 0) county_zero_count += 1;
		if(val.county.pctPOV == 0) county_zero_count += 1;
		if(val.county.ICE_INCOME_all == 0) county_zero_count += 1;
		if(val.county.MEDHHINC == 0) county_zero_count += 1;
		if(val.county.pctOBESE == 0) county_zero_count += 1;
		if(val.county.FI == 0) county_zero_count += 1;
		if(val.county.CNMrate == 0) county_zero_count += 1;
		if(val.county.OBGYNrate == 0) county_zero_count += 1;
		if(val.county.rtTEENBIRTH == 0) county_zero_count += 1;
		if(val.county.rtSTD == 0) county_zero_count += 1;
		if(val.county.rtMHPRACT == 0) county_zero_count += 1;
		if(val.county.rtDRUGODMORTALITY == 0) county_zero_count += 1;
		if(val.county.rtOPIOIDPRESCRIPT == 0) county_zero_count += 1;
		if(val.county.SocCap == 0) county_zero_count += 1;
		if(val.county.rtSocASSOC == 0) county_zero_count += 1;
		if(val.county.pctHOUSE_DISTRESS == 0) county_zero_count += 1;
		if(val.county.rtVIOLENTCR_ICPSR == 0) county_zero_count += 1;
		if(val.county.isolation == 0) county_zero_count += 1;


		if(tract_zero_count / tract_total < _30_percent_correct) tract_result = true;

		if(county_zero_count / county_total < _30_percent_correct) county_result = true;


		return over_all_result || tract_result || county_result;
	}

}

