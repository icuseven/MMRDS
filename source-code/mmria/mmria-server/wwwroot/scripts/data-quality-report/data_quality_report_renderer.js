// DQR static notes to be displayed on pages 2-5
var dqr_notes_list =
[
	{
		num: '01)',
		title: 'Deaths Entered into MMRIA:',
		desc: 'All deaths entered in MMRIA, including those determined to be Pregnancy-Related, Pregnancy-Associated, but NOT-Related, Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness, Not Pregnancy-Related or -Associated (i.e. False Positive), Out of Scope, and those missing Pregnancy-Relatedness.',
	},
	{
		num: '02)',
		title: 'Deaths Missing Case Identification Method:',
		desc: 'Indicator populated using the Home Record field \'How was this Death Identified?\'[hr_hwtd_ident].',
	},
	{
		num: '03)',
		title: 'Case Status: ',
		desc: 'Indicator populated using the Home Record field \'Case Status\' [case_status].',
	},
	{
		num: '04)',
		title: 'Reviewed Deaths: ',
		desc: 'Based on a valid Committee Review Date [cr_do_revie].',
	},
	{
		num: '05)',
		title: 'Reviewed Deaths Determined to be Pregnancy-Related:',
		desc: 'Based on a valid Committee Review Date [cr_do_revie] and determined to be Pregnancy-Related [cr_p_relat = 1].',
	},
	{
		num: '06)',
		title: 'Pregnancy-Related Deaths Reviewed in Selected Quarter:',
		desc: 'Based on Committee Review Date [cr_do_revie] for deaths determined to be Pregnancy-Related [cr_p_relat = 1]. Q1 includes deaths reviewed January 1st-March 31st; Q2 includes deaths reviewed April 1st-June 30th; Q3 includes deaths reviewed July 1st-September 30th; Q4 includes deaths reviewed October 1st-December 31st.',
	},
	{
		num: '07)',
		title: 'Had a Linked BC/FDC (per Home Record Form Status) (subset of deaths counted in #06):',
		desc: 'Based on the death having a completed Birth/Fetal Death Certificate - Parent Section per Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '08)',
		title: 'Pregnancy-Related Deaths Reviewed in Previous 4 Quarters:',
		desc: 'Based on Committee Review Date [cr_do_revie] for deaths determined to be Pregnancy-Related [cr_p_relat = 1]. Q1 includes deaths reviewed January 1st-March 31st; Q2 includes deaths reviewed April 1st-June 30th; Q3 includes deaths reviewed July 1st-September 30th; Q4 includes deaths reviewed October 1st-December 31st.',
	},
	{
		num: '09)',
		title: 'Had a Linked BC/FDC (per Home Record Form Status) (subset of deaths counted in #08):',
		desc: 'Based on the death having a completed Birth/Fetal Death Certificate - Parent Section per Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '10)',
		title: 'Timing of Death: Abstractor\'s Overall Assessment of Timing of Death (from Home Record):',
		desc: 'Indicator populated using the Home Record field \'Abstractor-assigned pregnancy status based on overall review of records\' [hr_abs_dth_timing]. This field was added to MMRIA in April 2021 and will be validly missing for pregnancy-related deaths abstracted prior to this date.',
	},
	{
		num: '11)',
		title: 'Timing of Death - Date of Death (from DC):',
		desc: 'Indicator populated using the Date of Death (month, day, year) fields on the Home Record [hrdod_month, hrdod_day, hrdod_year]. If any of these fields are missing, the Date of Death from Death Record indicator is considered missing.',
	},
	{
		num: '12)',
		title: 'Timing of Death - Date of Delivery (from BC/FDC):',
		desc: 'ndicator populated using the Date of Delivery (month, day, year) fields on the Birth/Fetal Death Record [bfdcpfodddod_month, bfdcpfodddod_day, bfdcpfodddod_year]. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '13)',
		title: 'Timing of Death - Pregnancy Checkbox (from DC):',
		desc: 'Indicator populated using the Pregnancy Status field on the Death Certificate [dcdi_p_statu].',
	},
	{
		num: '14)',
		title: 'Race/Ethnicity (from BC/FDC):',
		desc: 'Indicator populated using both the mother\'s race [bfdcpr_ro_mothe] and the mother\'s ethnicity [bfdcpdom_ioh_origi] on the Birth/Fetal Death Certificate-Parent Section. If either field is missing, Race/Ethnicity: Birth/Fetal Death Record is assigned as missing. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '15)',
		title: 'Race/Ethnicity (from DC):',
		desc: 'Indicator populated using both the mother\'s race [dcr_race] and mother\'s ethnicity [dcd_ioh_origi] on the Death Certificate. If either field is missing, Race/Ethnicity: Death Record is assigned as missing.',
	},
	{
		num: '16)',
		title: 'Age at Death (from DC):',
		desc: 'Indicator populated using the Age at Death field on the Death Certificate [dcd_age].',
	},
	{
		num: '17)',
		title: 'Education (from BC/FDC):',
		desc: 'Indicator populated using the Mother’s Education field on the Birth/Fetal Death Certificate-Parent Section [bfdcpdom_e_level]. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '18)',
		title: 'Education (from DC):',
		desc: 'Indicator populated using the Education field on the Death Certificate [dcd_e_level].',
	},
	{
		num: '19)',
		title: 'Emotional Stressors (from SEP):',
		desc: 'Indicator populated using the Evidence of Social or Emotional Stress field on the Social and Environmental Profile [saepsoes_eosoe_stres].',
	},
	{
		num: '20)',
		title: 'Living Arrangements (from SEP):',
		desc: 'Indicator populated using the Living Arrangement at Time of Death field on the Social and Environmental Profile [saepsec_cl_arran].',
	},
	{
		num: '21)',
		title: 'Distance Between Residence and Place of Death (from DC):',
		desc: 'This is MMRIA-calculated field on the Death Certificate [dcaod_eddf_resid]. For this field to populate, all component fields must be filled out and the abstractor must click \'Calculate Distance\'.',
	},
	{
		num: '22)',
		title: 'Distance between Residence and Place of Delivery (from BC/FDC):',
		desc: 'This is MMRIA-calculated field on the Birth/Fetal Death Certificate-Parent Section [bfdcplor_edf_resid]. For this field to populate, all component fields must be filled out and the abstractor must click \'Calculate Distance\'. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '23)',
		title: 'Urbanicity of Place of Death (from DC):',
		desc: 'This is MMRIA-calculated field on the Death Certificate [dcaod_u_statu]. For this field to populate, all component fields must be filled out and the abstractor must click \'Validate Address and Get Coordinates\'.',
	},
	{
		num: '24)',
		title: 'Urbanicity of Place of Last Residence (from DC):',
		desc: 'This is MMRIA-calculated field on the Death Certificate [dcpolr_u_statu]. For this field to populate, all component fields must be filled out and the abstractor must click \'Validate Address and Get Coordinates\'.',
	},
	{
		num: '25)',
		title: 'Urbanicity of Place of Delivery (from BC/FDC):',
		desc: 'This is MMRIA-calculated field on the Birth/Fetal Death Certificate-Parent Section [bfdcpfodl_u_statu]. For this field to populate, all component fields must be filled out and the abstractor must click \'Validate Address and Get Coordinates\'. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '26)',
		title: 'Urbanicity of Place of Residence (from BC/FDC):',
		desc: 'This is MMRIA-calculated field on the Birth/Fetal Death Certificate-Parent Section [bfdcplor_u_statu]. For this field to populate, all component fields must be filled out and the abstractor must click \'Validate Address and Get Coordinates\'. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '27)',
		title: 'Was an Autopsy Performed? (from DC):',
		desc: 'Indicator populated using the \'Was Autopsy Performed?\' field on the Death Certificate [dcdi_wa_perfo].',
	},
	{
		num: '28)',
		title: 'What Type of Autopsy or Examination was Performed? (from Autopsy Report):',
		desc: 'Indicator populated using the \'What Type of Autopsy or Examination was Performed?\' field on the Autopsy Report [ar_autopsy_type].',
	},
	{
		num: '29)',
		title: 'Principal Source of Payment for Prenatal Care (from PCR):',
		desc: 'Indicator populated using the \'Principal Source of Payment\' field on the Prenatal Care Record [pppcf_pso_payme]. This indicator may be validly missing if there was no prenatal care. The % missing may be inflated due to counting instances where there was no prenatal care.',
	},
	{
		num: '30)',
		title: 'Principal Source of Payment for this Delivery (from BC/FDC):',
		desc: 'ndicator populated using the Principal Source of Payment for this Delivery field on the Birth/Fetal Death Certificate-Parent Section [bfdcppc_psopft_deliv]. The denominator for this indicator is limited to pregnancy-related deaths with a completed Birth/Fetal Death Certificate- Parent Section according to the Form Status on the Home Record [hrcpr_bcp_secti = 2].',
	},
	{
		num: '31)',
		title: 'Any Prenatal Care (from SEP):',
		desc: 'Indicator populated using the \'Any Prenatal Care?\' field on the Social & Environmental Profile [saephcs_np_care].',
	},
	{
		num: '32)',
		title: 'Documented Barriers to Healthcare Access (from SEP):',
		desc: 'Indicator populated using the Documented Barriers to Health Care Access field on the Social & Environmental Profile [saephca_bthc_acces].',
	},
	{
		num: '33)',
		title: 'Was There Documented Substance Use (from SEP):',
		desc: 'Indicator populated using the \'Was There Documented Substance Use?\' field on the Social & Environmental Profile [saep_ds_use].',
	},
	{
		num: '34)',
		title: 'Were There Documented Preexisting Mental Health Conditions (from MHP):',
		desc: 'Indicator populated using the \'Were There Documented Preexisting Mental Health Conditions?\' field on the Mental Health Profile [mhp_wtdpmh_condi].',
	},
	{
		num: '35)',
		title: 'Committee Determination of Primary Underlying Cause of Death (PMSS-MM):',
		desc: 'Indicator populated using the Committee Determination of Primary Underlying Cause of Death on the Committee Decisions Form [cr_p_mm].',
	},
	{
		num: '36)',
		title: 'Was this Death Preventable?:',
		desc: 'Indicator populated using the \'Was this Death Preventable\' field on the Committee Decisions Form [cr_wtd_preve]. MMRCs are encouraged to make a yes/no determination for preventability for all pregnancy-related deaths, but there may be instances where preventability is unable to be determined by the MMRC. In those situations, this field may be validly blank and \'Unable to Determine\' should be selected for Chance to Alter the Outcome field.',
	},
	{
		num: '37)',
		title: 'Chance to Alter Outcome?:',
		desc: 'Indicator populated using the Chance to Alter Outcome field on the Committee Decisions Form [cr_cta_outco].',
	},
	{
		num: '38)',
		title: 'Did Obesity Contribute to the Death?:',
		desc: 'Indicator populated using the \'Did Obesity Contribute to the Death?\' field on the Committee Decisions Form [cr_doctt_death].',
	},
	{
		num: '39)',
		title: 'Did Discrimination Contribute to the Death?:',
		desc: 'Indicator populated using the \'Did Discrimination Contribute to the Death?\' field on the Committee Decisions Form [cr_ddctt_death]. This field was added to the MMRC Committee Decisions form on May 29, 2020 and will be validly missing for pregnancy-related deaths reviewed prior to this date.',
	},
	{
		num: '40)',
		title: 'Did Mental Health Conditions Other than Substance Use Disorder Contribute to the Death?:',
		desc: 'Indicator populated using the \'Did Mental Health Conditions Other than Substance Use Disorder Contribute to the Death?\' field on the Committee Decisions Form [cr_dmhcctt_death].',
	},
	{
		num: '41)',
		title: 'Did Substance Use Disorder Contribute to the Death?:',
		desc: 'Indicator populated using the \'Did Substance Use Disorder Contribute to the Death?\' field on the Committee Decisions Form [cr_dsudctt_death].',
	},
	{
		num: '42)',
		title: 'Was this Death a Suicide?:',
		desc: 'Indicator populated using the \'Was this Death a Suicide?\' field on the Committee Decisions Form [cr_wtda_sucid].',
	},
	{
		num: '43)',
		title: 'Was this Death a Homicide?:',
		desc: 'Indicator populated using the \'Was this Death a Homicide?\' field on the Committee Decisions Form [cr_wtda_homic].',
	},
	{
		num: '44)',
		title: 'Analyst Able to Assign Yes/No Preventability:',
		desc: 'This indicator is a summary measure reflecting the best practices for determining preventability. If either cr_wtd_preve or cr_cta_outco is completed with a response that is not missing or \'unable to determine\', the analyst is able to assign preventability as yes or no.',
	},
	{
		num: '45)',
		title: 'Preventability Aligns with Chance to Alter Outcome:',
		desc: 'This indicator reflects the percent of deaths where the cr_cta_preve response aligns with the cr_cta_outco response. This is a summary measure reflecting best practices for determining preventability.',
	},
	{
		num: '46)',
		title: 'If Discrimination checkbox marked \'Yes\' or \'Probably\', did the Committee also select at least 1 of the \'Discrimination\', \'Interpersonl Racism\', or \'Structural Racism\' CFs?:',
		desc: 'Indicator populated using the \'Did Discrimination Contribute to the Death?\' field [cr_ddctt_death] and the Contributing Factor class field [crcfw_class] on the Committee Decisions Form. Limited to deaths determined to be preventable (cr_wtd_preve = 1 or cr_cta_outco = 0 or cr_cta_outco = 1).',
	},
	{
		num: '47)',
		title: 'If Mental Health Conditions checkbox marked \'Yes\' or \'Probably\', did the Committee also select \'Mental Health Conditions\' as a CF?:',
		desc: 'Indicator populated using the \'Did Mental Health Conditions Other than Substance Use Disorder Contribute to the Death?\' field [cr_dmhcctt_death] and the Contributing Factor class field [crcfw_class] on the Committee Decisions Form. Limited to deaths determined to be preventable (cr_wtd_preve = 1 or cr_cta_outco = 0 or cr_cta_outco = 1).',
	},
	{
		num: '48)',
		title: 'If Substance Use Disorder checkbox marked \'Yes\' or \'Probably\', did the Committee also select \'Substance use disorder - alcohol, illicit/prescription drugs\' as a CF?:',
		desc: 'Indicator populated using the \'Did Substance Use Disorder Contribute to the Death?\' field [cr_dsudctt_death] and the Contributing Factor class field [crcfw_class] on the Committee Decisions Form. Limited to deaths determined to be preventable (cr_wtd_preve = 1 or cr_cta_outco = 0 or cr_cta_outco = 1).',
	},
	{
		num: '49)',
		title: 'Contributing Factor, Description of Issue, and Recommendation all completed (denominator is the # of CF-recommended action rows across all reviewed preventable pregnancy-related deaths):',
		desc: 'Indicator populated using the Contributing Factor Class [crcfw_class], Description of Issue [crcfw_descr], and Recommendation of Committee [crcfw_c_recom] fields on the Committee Decisions Form. Limited to deaths determined to be preventable (cr_wtd_preve = 1 or cr_cta_outco = 0 or cr_cta_outco = 1).',
	},
];



function data_quality_report_render(p_quarters) 
{
	var result = [];
	var data_quality_report_quarters_list = render_data_quality_report_quarters(p_quarters);
	let selectedQuarter = p_quarters[0];

	result.push(`
		<div class="row">
			<div class="col">
				<div class="font-weight-bold pl-3">
					<div class="mb-4">
						<p id="quarter_msg" class="mb-3">${selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.</p>
						<label for="quarters-list" class="mb-0 font-weight-normal mr-2">Select Export Quarter</label>
						<select 
							name="quarters-list"
							id="quarters-list"
							onchange="updateQuarter(event)"
						>	
							${data_quality_report_quarters_list}
						</select>
					</div>
					<div class="mb-4">
						<input type="checkbox" id="quarter-details" name="quarter-details">
						<label for="quarter-details" class="mb-0 font-weight-normal mr-2">Check for Detail Report</label>
					</div>
				</div>
				<div class="card-footer bg-gray-13">
					<button 
						id="quarter_btn" 
						class="btn btn-primary btn-lg w-100" 
						onclick="download_data_quality_report_button_click()"
					>
						Export ${selectedQuarter}
					</button>
				</div>
			</div>
		</div>
	`);

	return result;
}

function updateQuarter(e) 
{
	console.log('updateQuarter: ', e.target.value);
	selectedQuarter = e.target.value;
	renderQuarterInfo();
}

function renderQuarterInfo() 
{
	// Update the message to show the currently selected quarter
	document.getElementById('quarter_msg').innerHTML =
		`${selectedQuarter} is the currently selected quarter that will be used to compare to the previous 4 quarters.`;

	// Update the button to show the currently selected quarter
	document.getElementById('quarter_btn').innerHTML =
		`Download ${selectedQuarter} as PDF`;
}

function render_data_quality_report_quarters() 
{
	const result = [];

	// Build the dropdown list
	g_quarters.map((value, index) => {
		result.push(`<option value='${value}' ${(index == 0) ? ' selected' : ''}>${value}</option>`)
	});

	return result.join("");
}


async function download_data_quality_report_button_click()
{


    const selected_quarter = document.getElementById('quarters-list').value;

    const dqr_detail_data = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/api/dqr-detail/${selected_quarter}`,
    });
      

    console.log('dqr_detail_data ${dqr_detail_data}');

}
// This function will call the pdf function
function download_data_quality_report_pdf(selQuar) 
{
	// Find out if need details for the quarter report is needed
	let needDetails = document.getElementById('quarter-details');
	console.log('needDetails: ', needDetails.checked);

	// TODO: Figure out where to get the jurisdiction 
	let jurisdiction = 'All Jurisdictions';
	console.log('Download the PDF: ');
	create_data_quality_report_download('Data Goes Here', selQuar, jurisdiction, dqr_notes_list);
}

