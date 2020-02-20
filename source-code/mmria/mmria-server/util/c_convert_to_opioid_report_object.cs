using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.server.util
{
	public partial class c_convert_to_opioid_report_object
	{

		Dictionary<string, mmria.server.model.opioid_report_value_struct> indicators;

		string source_json;

		private System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> List_Look_Up;



		private enum deaths_by_age_enum
		{
			blank,
			age_less_than_20,
			age_20_to_24,
			age_25_to_29,
			age_30_to_34,
			age_35_to_44,
			age_45_and_above
		}

		private enum pregnant_at_time_of_death_enum
		{
			blank,
			pregnant_at_the_time_of_death,
			pregnant_within_42_days_of_death,
			pregnant_within_43_to_365_days_of_death
		}

		private enum ethnicity_enum
		{
			hispanic,
			non_hispanic_black,
			non_hispanic_white,
			american_indian_alaska_native,
			native_hawaiian,
			guamanian_or_chamorro,
			samoan,
			other_pacific_islander,
			asian_indian,
			filipino,
			korean,
			other_asian,
			chinese,
			japanese,
			vietnamese,
			other,
			not_specified
		}

		string temp = 

		@"
		'id': doc._id,
		'hr_date_of_death_year': doc.home_record.date_of_death.year,
		'dc_date_of_death': doc.death_certificate.certificate_identification.date_of_death,
		'date_of_review': doc.committee_review.date_of_review,
		'was_this_death_preventable': doc.committee_review.was_this_death_preventable,
		'pregnancy_relatedness': doc.committee_review.pregnancy_relatedness,
		'bc_is_of_hispanic_origin': doc.birth_fetal_death_certificate_parent.demographic_of_mother.is_of_hispanic_origin,
		'dc_is_of_hispanic_origin': doc.death_certificate.demographics.is_of_hispanic_origin,
		'age': doc.death_certificate.demographics.age,
		'pmss': doc.committee_review.pmss_mm,
		'pmss_mm_secondary': doc.committee_review.pmss_mm_secondary,
		'did_obesity_contribute_to_the_death': doc.committee_review.did_obesity_contribute_to_the_death,
		'did_mental_health_conditions_contribute_to_the_death': doc.committee_review.did_mental_health_conditions_contribute_to_the_death,
		'did_substance_use_disorder_contribute_to_the_death': doc.committee_review.did_substance_use_disorder_contribute_to_the_death,
		'was_this_death_a_sucide': doc.committee_review.was_this_death_a_sucide,
		'was_this_death_a_homicide': doc.committee_review.homicide_relatedness.was_this_death_a_homicide,
		'dc_race': doc.death_certificate.race.race,
		'bc_race': doc.birth_fetal_death_certificate_parent.race.race_of_mother

";

		static HashSet<string> aggregator_set = new HashSet<string>()
		{
			"_id",
			"home_record/date_of_death/year",
			"home_record/date_of_death/month",
			"home_record/date_of_death/day",
			"committee_review/date_of_review",
			"committee_review/was_this_death_preventable",
			"committee_review/pregnancy_relatedness",
			"birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin",
			"death_certificate/demographics/is_of_hispanic_origin",
			"death_certificate/demographics/age",
			"committee_review/pmss_mm",
			"committee_review/pmss_mm_secondary",
			"committee_review/did_obesity_contribute_to_the_death",
			"committee_review/did_mental_health_conditions_contribute_to_the_death",
			"committee_review/did_substance_use_disorder_contribute_to_the_death",
			"committee_review/was_this_death_a_sucide",
			"committee_review/homicide_relatedness/was_this_death_a_homicide",
			"death_certificate/race/race",
			"birth_fetal_death_certificate_parent/race/race_of_mother"
		};

		public c_convert_to_opioid_report_object (string p_source_json)
		{

			source_json = p_source_json;
		}



		private Dictionary<string, mmria.server.model.opioid_report_value_struct> get_zero_indicators(mmria.server.model.opioid_report_value_struct p_header)
		{

			mmria.server.model.opioid_report_value_struct get_new_struct(string p_indicator_field_id)
			{
				var result = new mmria.server.model.opioid_report_value_struct();
				var keys = p_indicator_field_id.Split(" ");

				if(keys.Length > 1)
				{
					result.indicator_id = keys[0];
					result.field_id = keys[1];
				}
				result.value = 0;

				result.year_of_death = p_header.year_of_death;
				result.month_of_death = p_header.month_of_death;
				result.day_of_death = p_header.day_of_death;

				result.case_review_year = p_header.case_review_year;
				result.case_review_month = p_header.case_review_month;
				result.case_review_day = p_header.case_review_day;

				result.pregnancy_related = p_header.pregnancy_related;
				result.host_state = p_header.host_state;

				result.jurisdiction_id = p_header.jurisdiction_id;

				return result;
			}

			var result = new Dictionary<string, mmria.server.model.opioid_report_value_struct>(StringComparer.OrdinalIgnoreCase); 

			result.Add("mPregRelated MPregRel1", get_new_struct("mPregRelated MPregRel1"));
			result.Add("mPregRelated MPregRel2", get_new_struct("mPregRelated MPregRel2"));
			result.Add("mPregRelated MPregRel3", get_new_struct("mPregRelated MPregRel3"));
			result.Add("mPregRelated MPregRel4", get_new_struct("mPregRelated MPregRel4"));
			result.Add("mPregRelated MPregRel5", get_new_struct("mPregRelated MPregRel5"));
			result.Add("mDeathsbyRaceEth MRaceEth3", get_new_struct("mDeathsbyRaceEth MRaceEth3"));
			result.Add("mDeathsbyRaceEth MRaceEth4", get_new_struct("mDeathsbyRaceEth MRaceEth4"));
			result.Add("mDeathsbyRaceEth MRaceEth5", get_new_struct("mDeathsbyRaceEth MRaceEth5"));
			result.Add("mDeathsbyRaceEth MRaceEth6", get_new_struct("mDeathsbyRaceEth MRaceEth6"));
			result.Add("mDeathsbyRaceEth MRaceEth7", get_new_struct("mDeathsbyRaceEth MRaceEth7"));
			result.Add("mDeathsbyRaceEth MRaceEth8", get_new_struct("mDeathsbyRaceEth MRaceEth8"));
			result.Add("mDeathsbyRaceEth MRaceEth9", get_new_struct("mDeathsbyRaceEth MRaceEth9"));
			result.Add("mDeathsbyRaceEth MRaceEth10", get_new_struct("mDeathsbyRaceEth MRaceEth10"));
			result.Add("mDeathsbyRaceEth MRaceEth11", get_new_struct("mDeathsbyRaceEth MRaceEth11"));
			result.Add("mDeathsbyRaceEth MRaceEth12", get_new_struct("mDeathsbyRaceEth MRaceEth12"));
			result.Add("mDeathsbyRaceEth MRaceEth13", get_new_struct("mDeathsbyRaceEth MRaceEth13"));
			result.Add("mDeathsbyRaceEth MRaceEth14", get_new_struct("mDeathsbyRaceEth MRaceEth14"));
			result.Add("mDeathsbyRaceEth MRaceEth15", get_new_struct("mDeathsbyRaceEth MRaceEth15"));
			result.Add("mDeathsbyRaceEth MRaceEth16", get_new_struct("mDeathsbyRaceEth MRaceEth16"));
			result.Add("mDeathsbyRaceEth MRaceEth17", get_new_struct("mDeathsbyRaceEth MRaceEth17"));
			result.Add("mDeathsbyRaceEth MRaceEth18", get_new_struct("mDeathsbyRaceEth MRaceEth18"));
			result.Add("mDeathsbyRaceEth MRaceEth1", get_new_struct("mDeathsbyRaceEth MRaceEth1"));
			result.Add("mDeathsbyRaceEth MRaceEth2", get_new_struct("mDeathsbyRaceEth MRaceEth2"));
			result.Add("mDeathsbyRaceEth MRaceEth20", get_new_struct("mDeathsbyRaceEth MRaceEth20"));
			result.Add("mDeathsbyRaceEth MRaceEth19", get_new_struct("mDeathsbyRaceEth MRaceEth19"));
			result.Add("mTimingofDeath MTimeD1", get_new_struct("mTimingofDeath MTimeD1"));
			result.Add("mTimingofDeath MTimeD2", get_new_struct("mTimingofDeath MTimeD2"));
			result.Add("mTimingofDeath MTimeD3", get_new_struct("mTimingofDeath MTimeD3"));
			result.Add("mTimingofDeath MTimeD4", get_new_struct("mTimingofDeath MTimeD4"));
			result.Add("mAgeatDeath MAgeD1", get_new_struct("mAgeatDeath MAgeD1"));
			result.Add("mAgeatDeath MAgeD2", get_new_struct("mAgeatDeath MAgeD2"));
			result.Add("mAgeatDeath MAgeD3", get_new_struct("mAgeatDeath MAgeD3"));
			result.Add("mAgeatDeath MAgeD4", get_new_struct("mAgeatDeath MAgeD4"));
			result.Add("mAgeatDeath MAgeD5", get_new_struct("mAgeatDeath MAgeD5"));
			result.Add("mAgeatDeath MAgeD6", get_new_struct("mAgeatDeath MAgeD6"));
			result.Add("mDeathCause MCauseD1", get_new_struct("mDeathCause MCauseD1"));
			result.Add("mDeathCause MCauseD2", get_new_struct("mDeathCause MCauseD2"));
			result.Add("mDeathCause MCauseD3", get_new_struct("mDeathCause MCauseD3"));
			result.Add("mDeathCause MCauseD4", get_new_struct("mDeathCause MCauseD4"));
			result.Add("mDeathCause MCauseD5", get_new_struct("mDeathCause MCauseD5"));
			result.Add("mDeathCause MCauseD6", get_new_struct("mDeathCause MCauseD6"));
			result.Add("mDeathCause MCauseD7", get_new_struct("mDeathCause MCauseD7"));
			result.Add("mDeathCause MCauseD8", get_new_struct("mDeathCause MCauseD8"));
			result.Add("mDeathCause MCauseD9", get_new_struct("mDeathCause MCauseD9"));
			result.Add("mDeathCause MCauseD10", get_new_struct("mDeathCause MCauseD10"));
			result.Add("mDeathCause MCauseD11", get_new_struct("mDeathCause MCauseD11"));
			result.Add("mDeathCause MCauseD12", get_new_struct("mDeathCause MCauseD12"));
			result.Add("mDeathCause MCauseD13", get_new_struct("mDeathCause MCauseD13"));
			result.Add("mDeathCause MCauseD14", get_new_struct("mDeathCause MCauseD14"));
			result.Add("mDeathCause MCauseD15", get_new_struct("mDeathCause MCauseD15"));
			result.Add("mSubstAutop MSubAuto1", get_new_struct("mSubstAutop MSubAuto1"));
			result.Add("mSubstAutop MSubAuto2", get_new_struct("mSubstAutop MSubAuto2"));
			result.Add("mSubstAutop MSubAuto3", get_new_struct("mSubstAutop MSubAuto3"));
			result.Add("mSubstAutop MSubAuto4", get_new_struct("mSubstAutop MSubAuto4"));
			result.Add("mSubstAutop MSubAuto5", get_new_struct("mSubstAutop MSubAuto5"));
			result.Add("mSubstAutop MSubAuto6", get_new_struct("mSubstAutop MSubAuto6"));
			result.Add("mSubstAutop MSubAuto7", get_new_struct("mSubstAutop MSubAuto7"));
			result.Add("mSubstAutop MSubAuto8", get_new_struct("mSubstAutop MSubAuto8"));
			result.Add("mDeathSubAbuseEvi MEviSub1", get_new_struct("mDeathSubAbuseEvi MEviSub1"));
			result.Add("mDeathSubAbuseEvi MEviSub2", get_new_struct("mDeathSubAbuseEvi MEviSub2"));
			result.Add("mDeathSubAbuseEvi MEviSub3", get_new_struct("mDeathSubAbuseEvi MEviSub3"));
			result.Add("mHxofSubAbu MHxSub1", get_new_struct("mHxofSubAbu MHxSub1"));
			result.Add("mHxofSubAbu MHxSub2", get_new_struct("mHxofSubAbu MHxSub2"));
			result.Add("mHxofSubAbu MHxSub3", get_new_struct("mHxofSubAbu MHxSub3"));
			result.Add("mHxofSubAbu MHxSub4", get_new_struct("mHxofSubAbu MHxSub4"));
			result.Add("mLivingArrange MLivD1", get_new_struct("mLivingArrange MLivD1"));
			result.Add("mLivingArrange MLivD2", get_new_struct("mLivingArrange MLivD2"));
			result.Add("mLivingArrange MLivD3", get_new_struct("mLivingArrange MLivD3"));
			result.Add("mLivingArrange MLivD4", get_new_struct("mLivingArrange MLivD4"));
			result.Add("mLivingArrange MLivD5", get_new_struct("mLivingArrange MLivD5"));
			result.Add("mLivingArrange MLivD6", get_new_struct("mLivingArrange MLivD6"));
			result.Add("mLivingArrange MLivD7", get_new_struct("mLivingArrange MLivD7"));
			result.Add("mHomeless MHomeless1", get_new_struct("mHomeless MHomeless1"));
			result.Add("mHomeless MHomeless2", get_new_struct("mHomeless MHomeless2"));
			result.Add("mHomeless MHomeless3", get_new_struct("mHomeless MHomeless3"));
			result.Add("mHomeless MHomeless4", get_new_struct("mHomeless MHomeless4"));
			result.Add("mHomeless MHomeless5", get_new_struct("mHomeless MHomeless5"));
			result.Add("mIncarHx MHxIncar1", get_new_struct("mIncarHx MHxIncar1"));
			result.Add("mIncarHx MHxIncar2", get_new_struct("mIncarHx MHxIncar2"));
			result.Add("mIncarHx MHxIncar3", get_new_struct("mIncarHx MHxIncar3"));
			result.Add("mIncarHx MHxIncar4", get_new_struct("mIncarHx MHxIncar4"));
			result.Add("mIncarHx MHxIncar5", get_new_struct("mIncarHx MHxIncar5"));
			result.Add("mIncarHx MHxIncar6", get_new_struct("mIncarHx MHxIncar6"));
			result.Add("mIncarHx MHxIncar7", get_new_struct("mIncarHx MHxIncar7"));
			result.Add("mHxofEmoStress MEmoStress1", get_new_struct("mHxofEmoStress MEmoStress1"));
			result.Add("mHxofEmoStress MEmoStress2", get_new_struct("mHxofEmoStress MEmoStress2"));
			result.Add("mHxofEmoStress MEmoStress3", get_new_struct("mHxofEmoStress MEmoStress3"));
			result.Add("mHxofEmoStress MEmoStress4", get_new_struct("mHxofEmoStress MEmoStress4"));
			result.Add("mHxofEmoStress MEmoStress5", get_new_struct("mHxofEmoStress MEmoStress5"));
			result.Add("mHxofEmoStress MEmoStress6", get_new_struct("mHxofEmoStress MEmoStress6"));
			result.Add("mHxofEmoStress MEmoStress7", get_new_struct("mHxofEmoStress MEmoStress7"));
			result.Add("mHxofEmoStress MEmoStress8", get_new_struct("mHxofEmoStress MEmoStress8"));
			result.Add("mHxofEmoStress MEmoStress9", get_new_struct("mHxofEmoStress MEmoStress9"));
			result.Add("mHxofEmoStress MEmoStress10", get_new_struct("mHxofEmoStress MEmoStress10"));
			result.Add("mHxofEmoStress MEmoStress11", get_new_struct("mHxofEmoStress MEmoStress11"));
			result.Add("mHxofEmoStress MEmoStress12", get_new_struct("mHxofEmoStress MEmoStress12"));
			result.Add("mMHTxTiming MMHTx1", get_new_struct("mMHTxTiming MMHTx1"));
			result.Add("mMHTxTiming MMHTx2", get_new_struct("mMHTxTiming MMHTx2"));
			result.Add("mMHTxTiming MMHTx3", get_new_struct("mMHTxTiming MMHTx3"));
			result.Add("mMHTxTiming MMHTx4", get_new_struct("mMHTxTiming MMHTx4"));

			result.Add("mEducation MEduc1", get_new_struct("mEducation MEduc1"));
			result.Add("mEducation MEduc2", get_new_struct("mEducation MEduc2"));
			result.Add("mEducation MEduc3", get_new_struct("mEducation MEduc3"));
			result.Add("mEducation MEduc4", get_new_struct("mEducation MEduc4"));
			result.Add("mEducation MEduc5", get_new_struct("mEducation MEduc5"));

			return result;

		}

		public string execute ()
		{
			string result = null;


			
			string metadata_url = Program.config_couchdb_url + $"/metadata/version_specification-{Program.metadata_release_version_name}/metadata";
			cURL metadata_curl = new cURL("GET", null, metadata_url, null, Program.config_timer_user_name, Program.config_timer_value);
			mmria.common.metadata.app metadata = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.metadata.app>(metadata_curl.execute());


			List_Look_Up = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

			foreach(var child in metadata.children)
			{
				Get_List_Look_Up(List_Look_Up, metadata.lookup, child, "/" + child.name);
			}



			mmria.server.model.c_opioid_report_object report_object;

			System.Dynamic.ExpandoObject source_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (source_json);

			try
			{
				var filter_check_string = get_value(source_object, "committee_review/means_of_fatal_injury");
				if
				(
					filter_check_string == null ||
					filter_check_string.ToString().ToLower() != "3") //"poisoning/overdose"
				{
					return result;
				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}

			//dynamic source_object = Newtonsoft.Json.Linq.JObject.Parse(source_json);


			

			report_object = new mmria.server.model.c_opioid_report_object ();
			report_object._id = get_value (source_object, "_id");


			var opioid_report_value_header = new mmria.server.model.opioid_report_value_struct();

			/*
			if (report_object._id == "02279162-6be3-49e4-930f-42eed7cd4706")
			{
				System.Console.Write("break");
			}*/

			object val = null;

			try
			{
				val = get_value(source_object, "home_record/date_of_death/year");
				if(val != null && val.ToString() != "")
				{
					report_object.year_of_death = System.Convert.ToInt32(val);
					opioid_report_value_header.year_of_death = report_object.year_of_death;
				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}

			try
			{
				val = get_value(source_object, "home_record/date_of_death/month");
				if(val != null && val.ToString() != "")
				{
					opioid_report_value_header.month_of_death = System.Convert.ToInt32(val);

				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "home_record/date_of_death/day");
				if(val != null && val.ToString() != "")
				{
					opioid_report_value_header.day_of_death = System.Convert.ToInt32(val);

				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "committee_review/date_of_review");
				if(val != null && val.ToString() != "")
				{
					report_object.year_of_case_review = System.Convert.ToDateTime(val).Year;
					report_object.month_of_case_review = System.Convert.ToDateTime(val).Month;
					report_object.day_of_case_review = System.Convert.ToDateTime(val).Day;

					opioid_report_value_header.case_review_year = report_object.year_of_case_review ;
					opioid_report_value_header.case_review_month = report_object.month_of_case_review;
					opioid_report_value_header.case_review_day = report_object.day_of_case_review;
					
					
				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "host_state");
				if(val != null && val.ToString() != "")
				{
					opioid_report_value_header.host_state = val.ToString();
				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}


			try
			{
				val = get_value(source_object, "home_record/jurisdiction_id");
				if(val != null && val.ToString() != "")
				{
					report_object.jurisdiction_id = val.ToString();
					opioid_report_value_header.jurisdiction_id = report_object.jurisdiction_id;
				}
			}
			catch(Exception ex)
			{
				//System.Console.WriteLine (ex);
			}



			

			mmria.server.model.opioid_report_value_struct work_item = initialize_opioid_report_value_struct(opioid_report_value_header);
			

			this.popluate_total_number_of_cases_by_pregnancy_relatedness (ref work_item, ref report_object, source_object);
			
			opioid_report_value_header.pregnancy_related = work_item.pregnancy_related;

			this.indicators = get_zero_indicators(opioid_report_value_header);
			this.indicators[$"{work_item.indicator_id} {work_item.field_id}"] = work_item;


			work_item = initialize_opioid_report_value_struct(opioid_report_value_header);
			
			this.popluate_total_number_of_pregnancy_related_deaths_by_ethnicity(ref work_item, source_object, opioid_report_value_header.pregnancy_related == 1);
			this.indicators[$"{work_item.indicator_id} {work_item.field_id}"] = work_item;


			//this.popluate_total_number_of_pregnancy_associated_deaths_by_ethnicity (ref report_object, source_object);
			
			work_item = initialize_opioid_report_value_struct(opioid_report_value_header);
			
			this.popluate_pregnancy_deaths_by_age(ref work_item, ref report_object, source_object);
			this.indicators[$"{work_item.indicator_id} {work_item.field_id}"] = work_item;

			this.popluate_death_cause(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mDeathSubAbuseEvi(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);

			this.popluate_mEducation(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mHomeless(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mHxofEmoStress(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mHxofSubAbu(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mIncarHx(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mLivingArrange(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
			this.popluate_mMHTxTiming(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);

            this.popluate_mTimingofDeath(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);
		
			this.popluate_mSubstAutop(ref report_object.data, ref opioid_report_value_header, ref report_object, source_object);

			foreach(var indicator_item in this.indicators)
			{
				report_object.data.Add(indicator_item.Value);
			}
/*
			//this.popluate_distribution_of_underlying_cause_of_pregnancy_related_death_pmss_mm(ref report_object, source_object);
			this.popluate_list(ref report_object.distribution_of_underlying_cause_of_pregnancy_related_death_pmss_mm, ref report_object, source_object, "committee_review/pmss_mm", true);



			//this.popluate_pregnancy_related_determined_to_be_preventable(ref report_object, source_object);
			//this.popluate_pregnancy_associated_determined_to_be_preventable(ref report_object, source_object);
			this.popluate_list(ref report_object.total_pregnancy_related_determined_to_be_preventable, ref report_object, source_object, "committee_review/was_this_death_preventable", true);
			this.popluate_list(ref report_object.total_pregnancy_associated_determined_to_be_preventable, ref report_object, source_object, "committee_review/was_this_death_preventable", false);


			//this.popluate_pregnancy_related_obesity_contributed_to_the_death(ref report_object, source_object);
			//this.popluate_pregnancy_associated_obesity_contributed_to_the_death(ref report_object, source_object);
			this.popluate_list(ref report_object.total_pregnancy_related_obesity_contributed_to_the_death, ref report_object, source_object, "committee_review/did_obesity_contribute_to_the_death", true);
			this.popluate_list(ref report_object.total_pregnancy_associated_obesity_contributed_to_the_death, ref report_object, source_object, "committee_review/did_obesity_contribute_to_the_death", false);


			//this.popluate_pregnancy_related_mental_health_conditions_contributed_to_death(ref report_object, source_object);
			//this.popluate_pregnancy_associated_mental_health_conditions_contributed_to_death(ref report_object, source_object);
			this.popluate_list(ref report_object.total_pregnancy_related_mental_health_conditions_contributed_to_death, ref report_object, source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death", true);
			this.popluate_list(ref report_object.total_pregnancy_associated_mental_health_conditions_contributed_to_death, ref report_object, source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death", false);



			//this.popluate_pregnancy_related_substance_use_disorder_contributed_to_death(ref report_object, source_object);
			//this.popluate_pregnancy_associated_substance_use_disorder_contributed_to_death(ref report_object, source_object);
			this.popluate_list(ref report_object.total_pregnancy_related_substance_use_disorder_contributed_to_death, ref report_object, source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death", true);
			this.popluate_list(ref report_object.total_pregnancy_associated_substance_use_disorder_contributed_to_death, ref report_object, source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death", false);


			//this.popluate_pregnancy_related_is_suicide(ref report_object, source_object);
			//this.popluate_pregnancy_associated_is_suicide(ref report_object, source_object);
			this.popluate_list(ref report_object.total_pregnancy_related_is_suicide, ref report_object, source_object, "committee_review/was_this_death_a_sucide", true);
			this.popluate_list(ref report_object.total_pregnancy_associated_is_suicide, ref report_object, source_object, "committee_review/was_this_death_a_sucide", false);

			//this.popluate_pregnancy_related_is_homocide(ref report_object, source_object);
			//this.popluate_pregnancy_associated_is_homocide(ref report_object, source_object);
			this.popluate_list(ref report_object.total_pregnancy_related_is_homocide, ref report_object, source_object, "committee_review/was_this_death_a_homicide", true);
			this.popluate_list(ref report_object.total_pregnancy_associated_is_homocide, ref report_object, source_object, "committee_review/was_this_death_a_homicide", false);
*/

			Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
			//settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			result = Newtonsoft.Json.JsonConvert.SerializeObject(report_object, settings);

			return result;
		}

		public mmria.server.model.opioid_report_value_struct initialize_opioid_report_value_struct(mmria.server.model.opioid_report_value_struct p_header)
		{
			var result = new mmria.server.model.opioid_report_value_struct();

			result.year_of_death = p_header.year_of_death;
			result.month_of_death = p_header.month_of_death;
			result.day_of_death = p_header.day_of_death;

			result.case_review_year = p_header.case_review_year;
			result.case_review_month = p_header.case_review_month;
			result.case_review_day = p_header.case_review_day;

			result.pregnancy_related = p_header.pregnancy_related;
			result.host_state = p_header.host_state;

			result.jurisdiction_id = p_header.jurisdiction_id;

			return result;
		}
		public dynamic get_value(System.Dynamic.ExpandoObject p_object, string p_path, string p_data_type = "string")
		{
			dynamic result = null;

			try
			{
				string[] path = p_path.Split('/');

				System.Text.RegularExpressions.Regex number_regex = new System.Text.RegularExpressions.Regex(@"^\d+$");

				//IDictionary<string, object> index = p_object;
				dynamic index = p_object;

				/*
				if (path[1] == "abnormal_conditions_of_newborn")
				{
					System.Console.WriteLine("break");
				}*/


				for (int i = 0; i < path.Length; i++)
				{
					
					if(i == 0)
					{

						if (i == path.Length - 1 && index is IDictionary<string, object>)
						{
							
							IDictionary<string, object> dictionary_object = index as IDictionary<string, object>;

							if(dictionary_object == null)
							{
								result = null;
								return result;
							}

							object val = null;

							if(dictionary_object.ContainsKey(path[i]))
							{
								val = dictionary_object[path[i]]; 
							}

							if(val != null)
							{
								if(val.GetType() == typeof(System.DateTime))
								{
									System.DateTime? temp_date_time = val as System.DateTime?;
									result = temp_date_time.Value;	
								}
								else if(val.GetType() == typeof(string))
								{
									result = val.ToString();	
								}

								else if(val.GetType() == typeof(System.Collections.Generic.List<string>))
								{
									
									result = val as System.Collections.Generic.List<string>;	
								}
								else if(val.GetType() == typeof(System.Collections.Generic.List<object>))
								{

									result = val as System.Collections.Generic.List<object>;	
								}
								else
								{
									result = val;	
								}
							}
							else
							{
								result = null;	
							}
						}
						else
						{
							index = ((IDictionary<string, object>)p_object)[path[i]];
						}
					}
					else if (i == path.Length - 1)
					{
						if (index is IDictionary<string, object>)
						{

							IDictionary<string, object> dictionary_object = index as IDictionary<string, object>;

							if(dictionary_object == null)
							{
								result = null;
								return result;
							}

							object val = null;

							if(dictionary_object.ContainsKey(path[i]))
							{
								val = dictionary_object[path[i]]; 
							}


							if(val != null)
							{
								if(val.GetType() == typeof(System.DateTime))
								{
									System.DateTime? temp_date_time = val as System.DateTime?;
									result = temp_date_time.Value;	
								}
								else if(val.GetType() == typeof(string))
								{
									result = val.ToString();	
								}

								else if(val.GetType() == typeof(System.Collections.Generic.List<string>))
								{

									result = val as System.Collections.Generic.List<string>;	
								}
								else if(val.GetType() == typeof(System.Collections.Generic.List<object>))
								{

									result = val as System.Collections.Generic.List<object>;	
								}
								else
								{
									result = val;	
								}

							}
							else
							{
								result = null;	
							}
						}
						else
						{
							//System.Console.WriteLine("break");
						}
					}
					else if(index is IDictionary<string, object>)
					{
						if(index != null && ((IDictionary<string, object>)index).ContainsKey(path[i]))
						{
							index = ((IDictionary<string, object>)index)[path[i]];
						}
					
					}
					else if (index != null && index[path[i]].GetType() == typeof(IList<object>))
					{
						index = index[path[i]] as IList<object>;
					}
					else if (index != null && index[path[i]].GetType() == typeof(IDictionary<string, object>) && !((IDictionary<string, object>)index).ContainsKey(path[i]))
					{
						//System.Console.WriteLine("Index not found. This should not happen. {0}", p_path);
					}
					else if (index != null && index[path[i]].GetType() == typeof(IDictionary<string, object>))
					{
						index = index[path[i]] as IDictionary<string, object>;
					}
					else
					{
						//System.Console.WriteLine("This should not happen. {0}", p_path);
					}
				}
			}
			catch (Exception ex)
			{
				System.Console.WriteLine("c_convert_to_report_object.get_value bad mapping {0}\n {1}", p_path, ex);
			}

			return result;

		}



		private bool is_non_hispanic (string p_ethnicity, System.Dynamic.ExpandoObject p_source_object)
		{
			bool result = false;

			HashSet<string> bc_ethinicity = new HashSet<string> (StringComparer.InvariantCultureIgnoreCase);
			HashSet<string> dc_ethinicity = new HashSet<string> (StringComparer.InvariantCultureIgnoreCase);

			bc_ethinicity.Add(p_ethnicity);
			dc_ethinicity.Add(p_ethnicity);

			object val = get_value (p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin");
			if (val != null)
			{
				if 
				(
					//"No, not Spanish/ Hispanic/ Latino".Equals(val.ToString(), StringComparison.InvariantCultureIgnoreCase) ||
					//"No, not Spanish/Hispanic/Latino".Equals(val.ToString(), StringComparison.InvariantCultureIgnoreCase)
					"0".Equals(val.ToString(), StringComparison.InvariantCultureIgnoreCase) 
				)
				{
					val = get_value (p_source_object, "birth_fetal_death_certificate_parent/race/race_of_mother");
					if (val != null)
					{
						
						HashSet<string> ethnicity_set = new HashSet<string> (StringComparer.InvariantCultureIgnoreCase);
						var val_list = val as IList<object>;

						if(val_list != null)
						foreach(string item in val_list) ethnicity_set.Add(item);
							
						if (ethnicity_set.Intersect (bc_ethinicity).Count() > 0)
						{
							result = true;
						}
					}
				}
				else 
				{
					val = get_value (p_source_object, "death_certificate/demographics/is_of_hispanic_origin");
					
					if
					(
						val != null && 
						(
							//"No, not Spanish/ Hispanic/ Latino".Equals(val.ToString(), StringComparison.InvariantCultureIgnoreCase) ||
							//"No, not Spanish/Hispanic/Latino".Equals(val.ToString(), StringComparison.InvariantCultureIgnoreCase) 
							"0".Equals(val.ToString(), StringComparison.InvariantCultureIgnoreCase)
						)
					)
					{
						val = get_value (p_source_object, "death_certificate/race/race");
						if (val != null)
						{
							HashSet<string> ethnicity_set = new HashSet<string> (StringComparer.InvariantCultureIgnoreCase);
							var val_list = val as IList<object>;
						
							if(val_list != null)
							foreach(string item in val_list) ethnicity_set.Add(item);
							if (ethnicity_set.Intersect (bc_ethinicity).Count() > 0)
							{
								result = true;
							}
						}
					}
				}
			}

			return result;

		}


			

		private pregnant_at_time_of_death_enum get_pregnant_at_time_of_death_classifier (System.Dynamic.ExpandoObject p_source_object)
		{

			pregnant_at_time_of_death_enum result = pregnant_at_time_of_death_enum.blank;

			
/*
			pregnant_at_the_time_of_death,
birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 0; 
OR death_certificate/pregnancy_status = pregnant at time of death

			pregnant_within_42_days_of_death,
birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 1-42;
 OR death_certificate/pregnancy_status = Pregnant within 42 days of death

			pregnant_within_43_to_365_days_of_death

birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 43-365; 
OR death_certificate/pregnancy_status = Pregnant 43 to 365 days of death

			blank,
			pregnant_at_the_time_of_death,
			pregnant_within_42_days_of_death,
			pregnant_within_43_to_365_days_of_death
*/

			object length = get_value (p_source_object, "birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother");
			int length_test = -1;

			if (length != null) int.TryParse (length.ToString (), out length_test);

			string status = get_value (p_source_object, "death_certificate/pregnancy_status");

			if (status == null) status = "";

			if 
			(
				(length_test == 0) || 
				status.Equals ("pregnant at time of death", StringComparison.InvariantCultureIgnoreCase)
			)
			{
				result = pregnant_at_time_of_death_enum.pregnant_at_the_time_of_death;
			}
			else if
			(
				(length_test >= 1 && length_test <= 42) ||
				status.Equals ("pregnant within 42 days of death", StringComparison.InvariantCultureIgnoreCase)
			)
			{
				result = pregnant_at_time_of_death_enum.pregnant_within_42_days_of_death;
			}
			else if
			(
				(length_test >= 43 && length_test <= 365) ||
				status.Equals ("Pregnant 43 to 365 days of death", StringComparison.InvariantCultureIgnoreCase)
			)
			{
				result = pregnant_at_time_of_death_enum.pregnant_within_43_to_365_days_of_death;
			}
			

			return result;
		}

		private deaths_by_age_enum get_age_classifier (System.Dynamic.ExpandoObject p_source_object)
		{

			deaths_by_age_enum result = deaths_by_age_enum.blank;;
			

			object val = get_value (p_source_object, "death_certificate/demographics/age");
			int value_test = 0;
			if (val != null && int.TryParse (val.ToString (), out value_test))
			{
				if(value_test < 20) result = deaths_by_age_enum.age_less_than_20;
				else if(value_test < 20) result = deaths_by_age_enum.age_less_than_20;
				else if(value_test >= 20 && value_test <= 24) result = deaths_by_age_enum.age_20_to_24;
				else if(value_test >= 25 && value_test <= 29)  result = deaths_by_age_enum.age_25_to_29;
				else if(value_test >= 30 && value_test <= 34)  result = deaths_by_age_enum.age_30_to_34;
				else if(value_test >= 35 && value_test <= 44)  result = deaths_by_age_enum.age_35_to_44;
				else if(value_test >= 45)  result = deaths_by_age_enum.age_45_and_above;
			}

			return result;
		}


		private HashSet<ethnicity_enum> get_ethnicity_classifier (System.Dynamic.ExpandoObject p_source_object)
		{
			HashSet<ethnicity_enum> result = new HashSet<ethnicity_enum> ();

			string val = null;


//Hispanic
			
			HashSet<string> bc_hispanic_origin = new HashSet<string> (StringComparer.InvariantCultureIgnoreCase);
			HashSet<string> dc_hispanic_origin = new HashSet<string> (StringComparer.InvariantCultureIgnoreCase);

//birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin 
			// Yes, Mexican, Mexican American, Chicano 
			// Yes, Puerto Rican 
			// Yes, Cuban 
			// Yes, Other Spanish/Hispanic/Latino 
			//Yes, Origin Unknown

/*
9999 (blank)
0 No, Not Spanish/Hispanic/Latino
1 Yes, Mexican, Mexican American, Chicano
2 Yes, Puerto Rican
3 Yes, Cuban
4 Yes, Other Spanish/Hispanic/Latino
5 Yes, Origin Unknown
8888 Not Specified


			bc_hispanic_origin.Add ("Yes, Mexican, Mexican American, Chicano");
			bc_hispanic_origin.Add ("Yes, Puerto Rican");
			bc_hispanic_origin.Add ("Yes, Cuban");
			bc_hispanic_origin.Add ("Yes, Other Spanish/Hispanic/Latino");
			bc_hispanic_origin.Add ("Yes, Origin Unknown");
 */
			bc_hispanic_origin.Add ("1");
			bc_hispanic_origin.Add ("2");
			bc_hispanic_origin.Add ("3");
			bc_hispanic_origin.Add ("4");
			bc_hispanic_origin.Add ("5");



//IF NO BC present:
//death_certificate/demographics/is_of_hispanic_origin
			//Yes, Mexican, Mexican American, Chicano
			//Yes, Puerto Rican 
			//Yes, Cuban
			//Yes, Other Spanish/Hispanic/Latino 
			//Yes, Origin Unknown

			dc_hispanic_origin.Add ("1");
			dc_hispanic_origin.Add ("2");
			dc_hispanic_origin.Add ("3");
			dc_hispanic_origin.Add ("4");
			dc_hispanic_origin.Add ("5");


			val = get_value (p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin");
			if (val != null)
			{
				if (bc_hispanic_origin.Contains (val))
				{
					result.Add (ethnicity_enum.hispanic);
				}
				else 
				{
					val = get_value (p_source_object, "death_certificate/demographics/is_of_hispanic_origin");
					if (dc_hispanic_origin.Contains (val))
					{
						result.Add (ethnicity_enum.hispanic);
					}
				}
			}


//Non-Hispanic Black
//birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = 
//No, not Spanish/ Hispanic/ Latino; AND 
//birth_fetal_death_certificate_parent/race_of_mother = Black
//IF NO BC PRESENT:
//death_certificate/demographics/is_of_hispanic_origin = 
//No, not Spanish/ Hispanic/ Latino; AND
// death_certificate/Race/race = Black
			//if (is_non_hispanic("Black", p_source_object))
			if (is_non_hispanic("1", p_source_object))
			{
				result.Add (ethnicity_enum.non_hispanic_black);
			}



/*

Non-Hispanic White

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; 
AND birth_fetal_death_certificate_parent/race_of_mother = White

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; 
AND death_certificate/Race/race = White
*/

			//if (is_non_hispanic("White", p_source_object))
			if (is_non_hispanic("0", p_source_object))
			{
				result.Add (ethnicity_enum.non_hispanic_white);
			}


/*
American Indian / Alaska Native

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND
 birth_fetal_death_certificate_parent/race_of_mother = American Indian / AK Native

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND
 death_certificate/Race/race = American Indian / AK Native
*/
			//if (is_non_hispanic("American Indian/Alaska Native", p_source_object))
			if (is_non_hispanic("2", p_source_object))
			{
				result.Add (ethnicity_enum.american_indian_alaska_native);
			}
/*
Native Hawaiian

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Native Hawaiian

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Native Hawaiian
*/
			//if (is_non_hispanic("Native Hawaiian", p_source_object))
			if (is_non_hispanic("3", p_source_object))
			{
				result.Add (ethnicity_enum.native_hawaiian);
			}
/*
Guamanian or Chamorro

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND
 birth_fetal_death_certificate_parent/race_of_mother = Guamanian or Chamorro

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND
 death_certificate/Race/race = Guamanian or Chamorro
*/
			//if (is_non_hispanic("Guamanian or Chamorro", p_source_object))
			if (is_non_hispanic("4", p_source_object))
			{
				result.Add (ethnicity_enum.guamanian_or_chamorro);
			}
/*
Samoan

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND
 birth_fetal_death_certificate_parent/race_of_mother = Samoan

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Samoan
*/
			//if (is_non_hispanic("Samoan", p_source_object))
			if (is_non_hispanic("5", p_source_object))
			{
				result.Add (ethnicity_enum.samoan);
			}
/*

Other Pacific Islander

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Other Pacific Islander
IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Other Pacific Islander
*/
			//if (is_non_hispanic("Other Pacific Islander", p_source_object))
			if (is_non_hispanic("6", p_source_object))
			{
				result.Add (ethnicity_enum.other_pacific_islander);
			}
/*
Asian Indian

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Asian Indian

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND
 death_certificate/Race/race = Asian Indian
*/
			//if (is_non_hispanic("Asian Indian", p_source_object))
			if (is_non_hispanic("7", p_source_object))
			{
				result.Add (ethnicity_enum.asian_indian);
			}
/*
Filipino

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Filipino

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Filipino
*/
			//if (is_non_hispanic("Filipino", p_source_object))
			if (is_non_hispanic("9", p_source_object))
			{
				result.Add (ethnicity_enum.filipino);
			}
/*
Korean

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Korean

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Korean
*/
			//if (is_non_hispanic("Korean", p_source_object))
			if (is_non_hispanic("11", p_source_object))
			{
				result.Add (ethnicity_enum.korean);
			}
/*
Other Asian

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Other Asian

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Other Asian
*/
			//if (is_non_hispanic("Other Asian", p_source_object))
			if (is_non_hispanic("13", p_source_object))
			{
				result.Add (ethnicity_enum.other_asian);
			}
/*
Chinese

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Chinese
IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Chinese
*/
			//if (is_non_hispanic("Chinese", p_source_object))
			if (is_non_hispanic("8", p_source_object))
			{
				result.Add (ethnicity_enum.chinese);
			}
/*
Japanese


birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Japanese

IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Japanese
*/
			//if (is_non_hispanic("Japanese", p_source_object))
			if (is_non_hispanic("10", p_source_object))
			{
				result.Add (ethnicity_enum.japanese);
			}
/*
Vietnamese

birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Vietnamese
IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Vietnamese
*/
			//if (is_non_hispanic("Vietnamese", p_source_object))
			if (is_non_hispanic("12", p_source_object))
			{
				result.Add (ethnicity_enum.vietnamese);
			}
/*
Other


birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
birth_fetal_death_certificate_parent/race_of_mother = Other
IF NO BC PRESENT:
death_certificate/demographics/is_of_hispanic_origin = No, not Spanish/ Hispanic/ Latino; AND 
death_certificate/Race/race = Other


			if 
			(
				is_non_hispanic("Other", p_source_object) ||
				is_non_hispanic("Other Race", p_source_object) 
			)
*/
			if 
			(
				is_non_hispanic("13", p_source_object) ||
				is_non_hispanic("14", p_source_object) 
			)

			{
				result.Add (ethnicity_enum.other);
			}
			return result;

			
		}


		private void popluate_mTimingofDeath(ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{


			var length_between_child_birth_and_death_of_mother_dynamic = get_value(p_source_object, "birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother");
			int length_between_child_birth_and_death_of_mother =  -1;
			if(length_between_child_birth_and_death_of_mother_dynamic is string)
			{
				string length_between_child_birth_and_death_of_mother_string = length_between_child_birth_and_death_of_mother_dynamic as string;
				if(!int.TryParse(length_between_child_birth_and_death_of_mother_string, out length_between_child_birth_and_death_of_mother))
				{
					length_between_child_birth_and_death_of_mother = -1;
				}
			}
			else if(length_between_child_birth_and_death_of_mother_dynamic is Int64)
			{
				length_between_child_birth_and_death_of_mother = (int) length_between_child_birth_and_death_of_mother_dynamic;
			}

			
			if(length_between_child_birth_and_death_of_mother < -1)
			{
				length_between_child_birth_and_death_of_mother = -1;
			}

			string val_1 = get_value(p_source_object, "death_certificate/death_information/pregnancy_status");

			int test_int;

//mTimingofDeath	Number of Deaths by Timing of Death in Relation to Pregnancy	MTimeD1	Pregnant at the Time of Death	1	
//(birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 0) OR
//  (death_certificate/death_information/pregnancy_status = 1)
			try
			{	
				if(length_between_child_birth_and_death_of_mother == 0 || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mTimingofDeath";
					curr.field_id = "MTimeD1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mTimingofDeath	Number of Deaths by Timing of Death in Relation to Pregnancy	MTimeD2	Pregnant Within 42 Days of Death	2	
//(birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 0) OR  
//(death_certificate/death_information/pregnancy_status = 2)
			try
			{	
				if((length_between_child_birth_and_death_of_mother >= 1 && length_between_child_birth_and_death_of_mother <= 42) || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 2))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mTimingofDeath";
					curr.field_id = "MTimeD2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mTimingofDeath	Number of Deaths by Timing of Death in Relation to Pregnancy	MTimeD3	Pregnant Within 43 to 365 Days of Death	3	
// (birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 0) OR 
// (death_certificate/death_information/pregnancy_status = 3)
			try
			{	
				if((length_between_child_birth_and_death_of_mother >= 43 && length_between_child_birth_and_death_of_mother <= 365) || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 3))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mTimingofDeath";
					curr.field_id = "MTimeD3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mTimingofDeath	Number of Deaths by Timing of Death in Relation to Pregnancy	MTimeD4	(blank)	4	
// (birth_fetal_death_certificate_parent/length_between_child_birth_and_death_of_mother = 9999) OR
//  (death_certificate/death_information/pregnancy_status = 9999)

			try
			{	
				if(
					length_between_child_birth_and_death_of_mother == -1 &&
					(
						val_1 == null || 
						! int.TryParse(val_1, out test_int) ||
						test_int == 9999)
					)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mTimingofDeath";
					curr.field_id = "MTimeD4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


		return;
/*

1
committee_review/pregnancy_relatedness = Pregnancy Related; 
AND
birth_fetal_death_certificate_parent/
	length_between_child_birth_and_death_of_mother = 0;
 OR death_certificate/pregnancy_status = pregnant at time of death



2
committee_review/pregnancy_relatedness = Pregnancy Related; 
AND
birth_fetal_death_certificate_parent/
	length_between_child_birth_and_death_of_mother = 1-42;
 OR death_certificate/pregnancy_status = Pregnant within 42 days of death

3
committee_review/pregnancy_relatedness = Pregnancy Related; 
AND
birth_fetal_death_certificate_parent/
	length_between_child_birth_and_death_of_mother = 43-365;
 OR death_certificate/pregnancy_status = Pregnant 43 to 365 days of death


length_between_child_birth_and_death_of_mother <- number field
length_between_child_birth_and_death_of_mother = 0
length_between_child_birth_and_death_of_mother = 1-42
length_between_child_birth_and_death_of_mother = 43-365


pregnancy_status <- list field
9999 (blank)
0 Not pregnant within last year
1 Pregnant at the time of death
2 Pregnant within 42 days of death
3 Pregnant 43 to 365 days of death
88 Unknown if pregnant in last year
4 Not pregnant, but pregnant withing past year (time unknown)
8888 Not Specififed







			string pregnancy_status_string = get_value(p_source_object, "death_certificate/death_information/pregnancy_status");
			int pregnancy_status = -1;
			if(!int.TryParse(pregnancy_status_string, out pregnancy_status))
			{
				pregnancy_status = -1;
			}


			if
			(
				length_between_child_birth_and_death_of_mother == 0 
			)
			{
				if(p_report_object.mPregRelated.pregnancy_related == 1)
				{
					p_report_object.mTimingofDeath.pregnant_at_the_time_of_death = 1;
				}
				else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death = 1;
				}
			}
			else if
			(
				length_between_child_birth_and_death_of_mother == -1 &&
				pregnancy_status == 1

			)
			{
				if(p_report_object.mPregRelated.pregnancy_related == 1)
				{
					p_report_object.mTimingofDeath.pregnant_at_the_time_of_death = 1;
				}
				else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death = 1;
				}
			}

			else if
			(
				(
					length_between_child_birth_and_death_of_mother >= 1 &&
					length_between_child_birth_and_death_of_mother <= 42 
				)
			)
			{
				if(p_report_object.mPregRelated.pregnancy_related == 1)
				{
					p_report_object.mTimingofDeath.pregnant_within_42_days_of_death = 1;
				}
				else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death = 1;
				}
			}
			else if
			(
				length_between_child_birth_and_death_of_mother == -1 &&
				pregnancy_status == 2

			)
			{
				if(p_report_object.mPregRelated.pregnancy_related == 1)
				{
					p_report_object.mTimingofDeath.pregnant_within_42_days_of_death = 1;
				}
				else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death = 1;
				}
			}
			else if
			(
				(
					length_between_child_birth_and_death_of_mother >= 43 &&
					length_between_child_birth_and_death_of_mother <= 365
				)
			)
			{
				if(p_report_object.mPregRelated.pregnancy_related == 1)
				{
					p_report_object.mTimingofDeath.pregnant_within_43_to_365_days_of_death = 1;
				}
				else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death = 1;
				}
			}
			else if
			(
				length_between_child_birth_and_death_of_mother == -1 &&
				pregnancy_status == 3

			)
			{
				if(p_report_object.mPregRelated.pregnancy_related == 1)
				{
					p_report_object.mTimingofDeath.pregnant_within_43_to_365_days_of_death = 1;
				}
				else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death = 1;
				}
			}
			else if(p_report_object.mPregRelated.pregnancy_related == 1)
			{
				p_report_object.mTimingofDeath.blank = 1;
			}
			else if(p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
			{
				p_report_object.total_number_pregnancy_associated_at_time_of_death.blank = 1;
			}
*/	

/*
			pregnant_at_time_of_death_enum time_of_death_enum = get_pregnant_at_time_of_death_classifier (p_source_object);
			switch (time_of_death_enum) 
			{
				case pregnant_at_time_of_death_enum.pregnant_at_the_time_of_death:
				if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1) 
				{
					p_report_object.total_number_pregnancy_related_at_time_of_death.pregnant_at_the_time_of_death = 1;
				} 
				else if(p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_at_the_time_of_death = 1;
				}
	

				break;
			case pregnant_at_time_of_death_enum.pregnant_within_42_days_of_death:
				if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1) 
				{
					p_report_object.total_number_pregnancy_related_at_time_of_death.pregnant_within_42_days_of_death = 1;
				} 
				else if(p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_within_42_days_of_death = 1;
				}
	
				break;
			case pregnant_at_time_of_death_enum.pregnant_within_43_to_365_days_of_death:
				if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1) 
				{
					p_report_object.total_number_pregnancy_related_at_time_of_death.pregnant_within_43_to_365_days_of_death = 1;
				} 
				else if(p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_pregnancy_associated_at_time_of_death.pregnant_within_43_to_365_days_of_death = 1;
				}
	
				break;
				case pregnant_at_time_of_death_enum.blank:
				default:
				if (p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_related == 1) 
				{
					p_report_object.total_number_pregnancy_related_at_time_of_death.blank = 1;
				} 
				else if(p_report_object.total_number_of_cases_by_pregnancy_relatedness.pregnancy_associated_but_not_related == 1)
				{
					p_report_object.total_number_of_pregnancy_associated_deaths_by_age.blank = 1;
				}
	
				break;
			}
*/
				/*			
			age_less_than_20,
			age_20_to_24,
			age_25_to_29,
			age_30_to_34,
			age_35_to_44,
			age_45_and_above
				blank,
*/

		}


private void popluate_pregnancy_deaths_by_age (ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
{

/*
mAgeatDeath	MAgeD1	<20
mAgeatDeath	MAgeD2	20-24
mAgeatDeath	MAgeD3	25-29
mAgeatDeath	MAgeD4	30-34
mAgeatDeath	MAgeD5	35-44
mAgeatDeath	MAgeD6	45+

*/

	p_opioid_report_value.indicator_id = "mAgeatDeath";
	p_opioid_report_value.value = 1;


	deaths_by_age_enum age_enum = get_age_classifier (p_source_object);

	switch (age_enum) 
	{
		case deaths_by_age_enum.age_less_than_20:
			p_opioid_report_value.field_id = "MAgeD1";
			break;
		case deaths_by_age_enum.age_20_to_24:
			p_opioid_report_value.field_id = "MAgeD2";
			break;
		case deaths_by_age_enum.age_25_to_29:
			p_opioid_report_value.field_id = "MAgeD3";
			break;
		case deaths_by_age_enum.age_30_to_34:
			p_opioid_report_value.field_id = "MAgeD4";	
			break;
		case deaths_by_age_enum.age_35_to_44:
			p_opioid_report_value.field_id = "MAgeD5";
			break;
		case deaths_by_age_enum.age_45_and_above:
			p_opioid_report_value.field_id = "MAgeD6";
			break;
		case deaths_by_age_enum.blank:
		default:
			p_opioid_report_value.field_id = "MAgeD7";
			break;
	}
/*
	switch (age_enum) 
	{
		case deaths_by_age_enum.age_less_than_20:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.age_less_than_20 = 1;
				p_opioid_report_value.field_id = "";
			} 
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.age_less_than_20 = 1;
				p_opioid_report_value.field_id = "";
			}
			break;
		case deaths_by_age_enum.age_20_to_24:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.age_20_to_24 = 1;
				p_opioid_report_value.field_id = "";
			} 
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.age_20_to_24 = 1;
				p_opioid_report_value.field_id = "";
			}
	
			break;
		case deaths_by_age_enum.age_25_to_29:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.age_25_to_29 = 1;
				p_opioid_report_value.field_id = "";
			}
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.age_25_to_29 = 1;
			}
	
			break;
		case deaths_by_age_enum.age_30_to_34:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.age_30_to_34 = 1;
				p_opioid_report_value.field_id = "";
			} 
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.age_30_to_34 = 1;
			}
	
			break;
		case deaths_by_age_enum.age_35_to_44:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.age_35_to_44 = 1;
			} 
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.age_35_to_44 = 1;
			}
	
			break;
		case deaths_by_age_enum.age_45_and_above:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.age_45_and_above = 1;
			}
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.age_45_and_above = 1;
			}
			break;
		case deaths_by_age_enum.blank:
		default:
			if (p_report_object.mPregRelated.pregnancy_related == 1) 
			{
				p_report_object.mAgeatDeath.blank = 1;
			}
			else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1) 
			{
				p_report_object.total_number_of_pregnancy_associated_deaths_by_age.blank = 1;
			}
	
			break;
	}
*/
	/*			
age_less_than_20,
age_20_to_24,
age_25_to_29,
age_30_to_34,
age_35_to_44,
age_45_and_above
	blank,
*/

	}


		private void popluate_total_number_of_pregnancy_related_deaths_by_ethnicity (ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, System.Dynamic.ExpandoObject p_source_object, bool p_is_pregnancy_related)
		{
/*
mDeathsbyRaceEth	MRaceEth3	Hispanic
mDeathsbyRaceEth	MRaceEth4	Non-Hispanic Black
mDeathsbyRaceEth	MRaceEth5	Non-Hispanic White
mDeathsbyRaceEth	MRaceEth6	American Indian / Alaska Native
mDeathsbyRaceEth	MRaceEth7	Native Hawaiian
mDeathsbyRaceEth	MRaceEth8	Guamanian or Chamorro
mDeathsbyRaceEth	MRaceEth9	Samoan
mDeathsbyRaceEth	MRaceEth10	Other Pacific Islander
mDeathsbyRaceEth	MRaceEth11	Asian Indian
mDeathsbyRaceEth	MRaceEth12	Filipino
mDeathsbyRaceEth	MRaceEth13	Korean
mDeathsbyRaceEth	MRaceEth14	Other Asian
mDeathsbyRaceEth	MRaceEth15	Chinese
mDeathsbyRaceEth	MRaceEth16	Japanese
mDeathsbyRaceEth	MRaceEth17	Vietnamese
mDeathsbyRaceEth	MRaceEth18	Other Race
mDeathsbyRaceEth	MRaceEth1	White
mDeathsbyRaceEth	MRaceEth2	Black
mDeathsbyRaceEth	MRaceEth20	(Blank)
mDeathsbyRaceEth	MRaceEth19	Race Not Specified
*/
			p_opioid_report_value.indicator_id = "mDeathsbyRaceEth";
			p_opioid_report_value.value = 1;

			//if (p_is_pregnancy_related)
			//{
				HashSet<ethnicity_enum> ethnicity_set = get_ethnicity_classifier (p_source_object);

				
				if (ethnicity_set.Count() == 0)
				{
					//p_report_object.mDeathsbyRaceEth.blank = 1;
					p_opioid_report_value.field_id = "MRaceEth20";
					return;
				}

				
				bool is_blank = true;
				
				if (ethnicity_set.Contains(ethnicity_enum.hispanic))
				{
					//p_report_object.mDeathsbyRaceEth.hispanic  = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth3";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.non_hispanic_black))
				{
					//p_report_object.mDeathsbyRaceEth.non_hispanic_black  = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth4";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.non_hispanic_white))
				{
					//p_report_object.mDeathsbyRaceEth.non_hispanic_white = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth5";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.american_indian_alaska_native))
				{
					//p_report_object.mDeathsbyRaceEth.american_indian_alaska_native = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth6";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.native_hawaiian))
				{
					//p_report_object.mDeathsbyRaceEth.native_hawaiian = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth7";
				}

			
				if (ethnicity_set.Contains (ethnicity_enum.guamanian_or_chamorro))
				{
					//p_report_object.mDeathsbyRaceEth.guamanian_or_chamorro = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth8";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.samoan))
				{
					//p_report_object.mDeathsbyRaceEth.samoan = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth9";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.other_pacific_islander))
				{
					//p_report_object.mDeathsbyRaceEth.other_pacific_islander = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth10";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.asian_indian))
				{
					//p_report_object.mDeathsbyRaceEth.asian_indian = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth11";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.filipino))
				{
					//p_report_object.mDeathsbyRaceEth.filipino = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth12";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.korean))
				{
					//p_report_object.mDeathsbyRaceEth .korean = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth13";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.other_asian))
				{
					//p_report_object.mDeathsbyRaceEth.other_asian = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth14";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.chinese))
				{
					//p_report_object.mDeathsbyRaceEth.chinese = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth15";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.japanese))
				{
					//p_report_object.mDeathsbyRaceEth.japanese = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth16";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.vietnamese))
				{
					//p_report_object.mDeathsbyRaceEth.vietnamese = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth17";
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.other))
				{
					//p_report_object.mDeathsbyRaceEth.other = 1;
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth18";
				}

				if (ethnicity_set.Contains (ethnicity_enum.not_specified))
				{
					is_blank = false;
					p_opioid_report_value.field_id = "MRaceEth19";
				}

				if (is_blank)
				{
					//p_report_object.mDeathsbyRaceEth.blank = 1;
					p_opioid_report_value.field_id = "MRaceEth20";
					return;
				}
				
				//System.Console.WriteLine ("break");
			//}
		}

/*
		private void popluate_total_number_of_pregnancy_associated_deaths_by_ethnicity (ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{
			if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
			{
				HashSet<ethnicity_enum> ethnicity_set = get_ethnicity_classifier (p_source_object);

				bool is_blank = true;
				
				if (ethnicity_set.Count() == 0)
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.blank = 1;
					return;
				}

				if (ethnicity_set.Contains(ethnicity_enum.hispanic))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.hispanic  = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.non_hispanic_black))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_black  = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.non_hispanic_white))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.non_hispanic_white = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.american_indian_alaska_native))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.american_indian_alaska_native = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.native_hawaiian))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.native_hawaiian = 1;
					is_blank = false;
				}

			
				if (ethnicity_set.Contains (ethnicity_enum.guamanian_or_chamorro))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.guamanian_or_chamorro = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.samoan))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.samoan = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.other_pacific_islander))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.other_pacific_islander = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.asian_indian))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.asian_indian = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.filipino))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.filipino = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.korean))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity .korean = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.other_asian))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.other_asian = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.chinese))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.chinese = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.japanese))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.japanese = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.vietnamese))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.vietnamese = 1;
					is_blank = false;
				}
			
				if (ethnicity_set.Contains (ethnicity_enum.other))
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.other = 1;
					is_blank = false;
				}

				
				if(is_blank)
				{
					p_report_object.total_number_of_pregnancy_associated_by_ethnicity.blank = 1;
				}
				
				//System.Console.WriteLine ("break");
			}
		}
*/

		private void popluate_total_number_of_cases_by_pregnancy_relatedness (ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{
/*
MPregRel1	Pregnancy Related
MPregRel2	Pregnancy Associated, but NOT Related
MPregRel3	Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness
MPregRel4	Not Pregnancy-Related or -Associated (i.e. False Positive)
MPregRel5	(Blank)
*/

			p_opioid_report_value.indicator_id = "mPregRelated";
			p_opioid_report_value.value = 1;
			p_opioid_report_value.pregnancy_related = 0;


			try
			{	
				
				var list = List_Look_Up["/committee_review/pregnancy_relatedness"];

				string val = get_value(p_source_object, "committee_review/pregnancy_relatedness");
				if(val != null)
				{
					switch(val)
					{
						case "Pregnancy-Related":
						case "Pregnancy Related":
						case "1":
							//p_report_object.mPregRelated.pregnancy_related = 1;
							p_opioid_report_value.field_id = "MPregRel1";
							p_opioid_report_value.pregnancy_related = 1;

						break;
						case "Pregnancy-Associated but NOT Related":
						case "Pregnancy-Associated, but NOT -Related":
						case "0":
							//p_report_object.mPregRelated.pregnancy_associated_but_not_related = 1;
							p_opioid_report_value.field_id = "MPregRel2";
							p_opioid_report_value.pregnancy_related = 0;
						break;
						case "Not Pregnancy Related or Associated (i.e. False Positive)":
						case "Not Pregnancy-Related or -Associated (i.e. False Positive)":
						case "99":
							//p_report_object.mPregRelated.not_pregnancy_related_or_associated = 1;
							p_opioid_report_value.field_id = "MPregRel4";
							p_opioid_report_value.pregnancy_related = 99;
						break;
						case "Pregnancy-Associated but Unable to Determine Pregnancy-Relatedness":
						case "Unable to Determine if Pregnancy Related or Associated":
						case "2":
							//p_report_object.mPregRelated.unable_to_determine = 1;
							p_opioid_report_value.field_id = "MPregRel3";
							p_opioid_report_value.pregnancy_related = 2;
						break;
						default:
							//p_report_object.mPregRelated.blank = 1;
							p_opioid_report_value.field_id = "MPregRel5";
							p_opioid_report_value.pregnancy_related = 9999;
						break;
					}

				}
				else
				{
					//p_report_object.mPregRelated.blank = 1;
					p_opioid_report_value.field_id = "MPregRel5";
					p_opioid_report_value.pregnancy_related = 9999;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		}

		private void Get_List_Look_Up
		(
			System.Collections.Generic.Dictionary<string, System.Collections.Generic.Dictionary<string, string>> p_result,
			mmria.common.metadata.node[] p_lookup,
			mmria.common.metadata.node p_metadata,
			string p_path
		)
		{
				switch(p_metadata.type.ToLower())
				{
					case "form":
					case "group":
					case "grid":
						foreach(mmria.common.metadata.node node in p_metadata.children)
						{
							Get_List_Look_Up(p_result, p_lookup, node, p_path + "/" + node.name.ToLower());
						}
						break;
					case "list":

						if
						(
							p_metadata.control_style!= null &&
							p_metadata.control_style.ToLower() == "editable"
						)
						{
							break;
						}

						p_result.Add(p_path, new System.Collections.Generic.Dictionary<string, string>(StringComparer.OrdinalIgnoreCase));

						var value_node_list = p_metadata.values;
						if
						(
							!string.IsNullOrWhiteSpace(p_metadata.path_reference)
						)
						{
							var name = p_metadata.path_reference.Replace("lookup/", "");
							foreach(var item in p_lookup)
							{
								if(item.name.ToLower() == name.ToLower())
								{
									value_node_list = item.values;
									break;
								}
							}
						}

						foreach(var value in value_node_list)
						{
							p_result[p_path].Add(value.value, value.display);
						}

						//p_result[file_name].Add(p_path, field_name);

						break;
					default:
						break;
				}
		}

/*
		private void popluate_list (ref System.Collections.Generic.Dictionary<string, int> p_result, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object, string p_mmria_path, bool p_is_pregnance_related)
        {
            var list = List_Look_Up["/" + p_mmria_path];

            //p_result = new System.Collections.Generic.Dictionary<string, int> (StringComparer.OrdinalIgnoreCase);

            foreach(var kvp in list)
            {
                p_result.Add(kvp.Key, 0);
            }

			if(p_is_pregnance_related)
			{
				if (p_report_object.mPregRelated.pregnancy_related == 1)
				{
					try
					{	
						string val = get_value(p_source_object, p_mmria_path);
						if(val != null && p_result.ContainsKey(val))
						{
							p_result[val] = 1;
						}
						else
						{
							p_result["9999"] = 1;
						}
					}
					catch(Exception ex)
					{
						System.Console.WriteLine (ex);
					}
				}
			}
            else if (p_report_object.mPregRelated.pregnancy_associated_but_not_related == 1)
			{
            	try
                {	
                    string val = get_value(p_source_object, p_mmria_path);
                    if(val != null && p_result.ContainsKey(val))
                    {
                        p_result[val] = 1;
                    }
                    else
                    {
                       p_result["9999"] = 1;
                    }
                }
                catch(Exception ex)
                {
                    System.Console.WriteLine (ex);
                }
            }
        }
*/

		private void popluate_mDeathSubAbuseEvi (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;


			//mDeathSubAbuseEvi	Deaths with Evidence of Substance Use in Prenatal Records	MEviSub1	Yes	1	prenatal/evidence_of_substance_use=Yes	prenatal/evidence_of_substance_use = 1

			try
			{	

				string val = get_value(p_source_object, "prenatal/evidence_of_substance_use");
				if(val != null && int.TryParse(val, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathSubAbuseEvi";
					curr.field_id = "MEviSub1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			//mDeathSubAbuseEvi	Deaths with Evidence of Substance Use in Prenatal Records	MEviSub2	No	2	prenatal/evidence_of_substance_use=No	prenatal/evidence_of_substance_use = 0

			try
			{	

				string val = get_value(p_source_object, "prenatal/evidence_of_substance_use");
				if(val != null && int.TryParse(val, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathSubAbuseEvi";
					curr.field_id = "MEviSub2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


			try
			{	

				string val = get_value(p_source_object, "prenatal/evidence_of_substance_use");
				if(val == null || (val != null && int.TryParse(val, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathSubAbuseEvi";
					curr.field_id = "MEviSub3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

		}

		private void popluate_death_cause (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

				int test_int;


//mDeathCause	MCauseD1	Mental Health Conditions - Yes	1	committee_review/did_mental_health_conditions_contribute_to_the_death = yes	committee_review/did_mental_health_conditions_contribute_to_the_death = 1

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



//mDeathCause	MCauseD2	Mental Health Conditions - No	2	committee_review/did_mental_health_conditions_contribute_to_the_death = No	committee_review/did_mental_health_conditions_contribute_to_the_death = 0

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



//mDeathCause	MCauseD3	Mental Health Conditions - Possibly	3	committee_review/did_mental_health_conditions_contribute_to_the_death = Probably	committee_review/did_mental_health_conditions_contribute_to_the_death = 2

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



//mDeathCause	MCauseD4	Mental Health Conditions - Unknown	4	committee_review/did_mental_health_conditions_contribute_to_the_death = Unknown	committee_review/did_mental_health_conditions_contribute_to_the_death = 7777

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 7777)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



//mDeathCause	MCauseD5	Mental Health Conditions - Blank	5	committee_review/did_mental_health_conditions_contribute_to_the_death = Blank	committee_review/did_mental_health_conditions_contribute_to_the_death = 9999

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_mental_health_conditions_contribute_to_the_death");
				if(val == null || (val != null && int.TryParse(val, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD5";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


//mDeathCause	MCauseD6	Substance Use Disorder - Yes	6	committee_review/did_substance_use_disorder_contribute_to_the_death = Yes	committee_review/did_substance_use_disorder_contribute_to_the_death = 1

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD6";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mDeathCause	MCauseD7	Substance Use Disorder - No	7	committee_review/did_substance_use_disorder_contribute_to_the_death = No	committee_review/did_substance_use_disorder_contribute_to_the_death = 0

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD7";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


//mDeathCause	MCauseD8	Mental Health Conditions-Possibly - Possibly	8	committee_review/did_substance_use_disorder_contribute_to_the_death = Probably	committee_review/did_substance_use_disorder_contribute_to_the_death = 2

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD8";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mDeathCause	MCauseD9	Mental Health Conditions - Unknown	9	committee_review/did_substance_use_disorder_contribute_to_the_death  = Unknown	committee_review/did_substance_use_disorder_contribute_to_the_death  = 7777

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death");
				if(val != null && int.TryParse(val, out test_int) && test_int == 7777)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD9";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


//mDeathCause	MCauseD10	Mental Health Conditions - Blank	10	committee_review/did_substance_use_disorder_contribute_to_the_death  = Blank	committee_review/did_substance_use_disorder_contribute_to_the_death  = 9999

			try
			{	

				string val = get_value(p_source_object, "committee_review/did_substance_use_disorder_contribute_to_the_death");
				if(val == null || (val != null && int.TryParse(val, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD10";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}



//mDeathCause	MCauseD11	Suicide - Yes	11	committee_review/was_this_death_a_sucide = Yes	committee_review/was_this_death_a_sucde = 1

			try
			{	

				string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
				if(val != null && int.TryParse(val, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD11";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


//mDeathCause	MCauseD12	Suicide - No	12	committee_review/was_this_death_a_sucide = No	committee_review/was_this_death_a_sucide = 0

			try
			{	

				string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
				if(val != null && int.TryParse(val, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD12";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


//mDeathCause	MCauseD13	Suicide - Possibly	13	committee_review/was_this_death_a_sucide = Probably	committee_review/was_this_death_a_sucide = 2

			try
			{	

				string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
				if(val != null && int.TryParse(val, out test_int) && test_int == 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD13";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


//mDeathCause	MCauseD14	Suicide - Unknown	14	committee_review/was_this_death_a_sucide  = Unknown	committee_review/was_this_death_a_sucide  = 7777

			try
			{	

				string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
				if(val != null && int.TryParse(val, out test_int) && test_int == 7777)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD14";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mDeathCause	MCauseD15	Suicide - Blank	15	committee_review/was_this_death_a_sucide  = Blank	committee_review/was_this_death_a_sucide  = 9999


			try
			{	

				string val = get_value(p_source_object, "committee_review/was_this_death_a_sucide");
				if(val == null || (val != null && int.TryParse(val, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mDeathCause";
					curr.field_id = "MCauseD15";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


		}


		private void popluate_mEducation (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

/*
birth_fetal_death_certificate_parent/demographic_of_mother/education_level = '8th Grade or Less' or '9th-12th Grade; No Diploma' or 'High School Grad or GED Completed'
OR
death_certificate/demographics/education_level = '8th Grade or Less' or '9th-12th Grade; No Diploma' or 'High School Grad or GED Completed'
*/



//mEducation	Education	MEduc1	Completed High School or less	1	birth_fetal_death_certificate_parent/demographic_of_mother/education_level = '8th Grade or Less' or '9th-12th Grade; No Diploma' or 'High School Grad or GED Completed' OR death_certificate/demographics/education_level = '8th Grade or Less' or '9th-12th Grade; No Diploma' or 'High School Grad or GED Completed'	birth_fetal_death_certificate_parent/demographic_of_mother/education_level in (0, 1, 2)  OR death_certificate/demographics/education_level in (0, 1, 2)
			try
			{	
				string val_1 = get_value(p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/education_level");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >=0 && test_int <= 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mEducation";
					curr.field_id = "MEduc1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				else 
				{
					string val_2 = get_value(p_source_object, "death_certificate/demographics/education_level");
					if(val_2 != null && int.TryParse(val_2, out test_int) && test_int >=0 && test_int <= 2)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mEducation";
						curr.field_id = "MEduc1";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mEducation	Education	MEduc2	Completed Some College	2	birth_fetal_death_certificate_parent/demographic_of_mother/education_level = 'Some College; No Degree' OR death_certificate/demographics/education_level =  'Some College; No Degree'	birth_fetal_death_certificate_parent/demographic_of_mother/education_level = 3 OR death_certificate/demographics/education_level =  3
			try
			{	
				string val_1 = get_value(p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/education_level");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >=3 && test_int <= 3)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mEducation";
					curr.field_id = "MEduc2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				else 
				{
					string val_2 = get_value(p_source_object, "death_certificate/demographics/education_level");
					if(val_2 != null && int.TryParse(val_2, out test_int) && test_int >=3 && test_int <= 3)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mEducation";
						curr.field_id = "MEduc2";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mEducation	Education	MEduc3	College Graduate	3	birth_fetal_death_certificate_parent/demographic_of_mother/education_level = 'Associate Degree' or 'Bachelor's Degree'  OR death_certificate/demographics/education_level = 'Associate Degree' or 'Bachelor's Degree'	birth_fetal_death_certificate_parent/demographic_of_mother/education_level in (4, 5) OR death_certificate/demographics/education_level in (4, 5)
			try
			{	
				string val_1 = get_value(p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/education_level");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >=4 && test_int <= 5)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mEducation";
					curr.field_id = "MEduc3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				else 
				{
					string val_2 = get_value(p_source_object, "death_certificate/demographics/education_level");
					if(val_2 != null && int.TryParse(val_2, out test_int) && test_int >=4 && test_int <= 5)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mEducation";
						curr.field_id = "MEduc3";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mEducation	Education	MEduc4	Completed Advanced Degree	4	birth_fetal_death_certificate_parent/demographic_of_mother/education_level = 'Master's Degree' or 'Doctorate or Professional Degree' OR death_certificate/demographics/education_level = 'Master's Degree' or 'Doctorate or Professional Degree'	birth_fetal_death_certificate_parent/demographic_of_mother/education_level in (6, 7) OR death_certificate/demographics/education_levelin (6, 7)
			try
			{	
				string val_1 = get_value(p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/education_level");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >=6 && test_int <= 7)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mEducation";
					curr.field_id = "MEduc4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				else 
				{
					string val_2 = get_value(p_source_object, "death_certificate/demographics/education_level");
					if(val_2 != null && int.TryParse(val_2, out test_int) && test_int >=6 && test_int <= 7)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mEducation";
						curr.field_id = "MEduc4";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


			try
			{	
				string val_1 = get_value(p_source_object, "birth_fetal_death_certificate_parent/demographic_of_mother/education_level");
				
				if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int >=6 && test_int <= 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mEducation";
					curr.field_id = "MEduc5";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				else 
				{
					string val_2 = get_value(p_source_object, "death_certificate/demographics/education_level");
					if(val_2 == null || (val_2 != null && int.TryParse(val_2, out test_int) && test_int >=6 && test_int <= 9999))
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mEducation";
						curr.field_id = "MEduc5";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		}
		private void popluate_mHomeless (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

/*
social_and_environmental_profile/socio_economic_characteristics/homelessness
*/


//mHomeless	Homelessness - Housing Arrangement at time of Death	MHomeless1	Never	1	social_and_environmental_profile/socio_economic_characteristics/homelessness = Never	social_and_environmental_profile/socio_economic_characteristics/homelessness = 0

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/homelessness");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHomeless";
					curr.field_id = "MHomeless1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHomeless	Homelessness - Housing Arrangement at time of Death	MHomeless2	Yes, in last 12 monhts	2	social_and_environmental_profile/socio_economic_characteristics/homelessness =Yes, in last 12 months	social_and_environmental_profile/socio_economic_characteristics/homelessness = 1

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/homelessness");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHomeless";
					curr.field_id = "MHomeless2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHomeless	Homelessness - Housing Arrangement at time of Death	MHomeless3	Yes, but more than 12 months ago	3	social_and_environmental_profile/socio_economic_characteristics/homelessness = Yes, but more than 12 months ago	social_and_environmental_profile/socio_economic_characteristics/homelessness =  2

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/homelessness");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHomeless";
					curr.field_id = "MHomeless3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHomeless	Homelessness - Housing Arrangement at time of Death	MHomeless4	Unknown/Not Specified	4	social_and_environmental_profile/socio_economic_characteristics/homelessness = Unknown or Not Specified	social_and_environmental_profile/socio_economic_characteristics/homelessness in (7777, 8888)

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/homelessness");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && (test_int == 7777 || test_int == 8888))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHomeless";
					curr.field_id = "MHomeless4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/homelessness");
				
				if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHomeless";
					curr.field_id = "MHomeless5";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}


		}

		private void popluate_mHxofEmoStress (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

/*
social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress
*/

List<object> val_list = get_value(p_source_object, "social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress");

List<string> val_string_list = new List<string>();

foreach(var item in val_list)
{
	val_string_list.Add(item.ToString());
}


//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress1	History of domestic violence	1	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=History of domestic violence	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=0
			try
			{	
				
				
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress1";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress2	History of psychiatric hospitalizations or treatment	2	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=History of psychiatric hospitalizations or treatment	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=1
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 2)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress2";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress3	Child Protective Services involvement	3	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=Child Protective Services involvement	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=2
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 3)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress3";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress4	History of substance use	4	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=History of substance use	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=3
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 4)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress4";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress5	Unemployment	5	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=Unemployment	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=4
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 5)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress5";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress6	History of substance use treatment	6	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=History of substance use treatment	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=5
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 6)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress6";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress7	Pregnancy Unwanted	7	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=Pregnancy Unwanted	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=6
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 7)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress7";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress8	Recent Trauma	8	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=Recent Trauma	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=7
			try
			{	
				foreach(string val_1 in val_string_list)
				{
				
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 8)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress8";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress9	History of childhood trauma	9	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=History of childhood trauma	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=8
			try
			{	
				foreach(string val_1 in val_string_list)
				{
				
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress9";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress10	Prior suicice attempts	10	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=Prior suicide attempts	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=9
			try
			{	
				foreach(string val_1 in val_string_list)
				{
				
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 10)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress10";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mHxofEmoStress	History of Social or Emotional Stress	MEmoStress11	Other	11	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=Other	social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress=10
			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 11)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress11";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				foreach(string val_1 in val_string_list)
				{
					if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999))
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mHxofEmoStress";
						curr.field_id = "MEmoStress12";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

		}

		private void popluate_mHxofSubAbu (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

//social_and_environmental_profile/documented_substance_use

//mHxofSubAbu	History of Documented Substance Use	MHxSub1	Yes	1	social_and_environmental_profile/documented_substance_use=Yes	social_and_environmental_profile/documented_substance_use = 1
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/documented_substance_use");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHxofSubAbu";
					curr.field_id = "MHxSub1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		

//mHxofSubAbu	History of Documented Substance Use	MHxSub2	No	2	social_and_environmental_profile/documented_substance_use=No	social_and_environmental_profile/documented_substance_use = 0
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/documented_substance_use");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHxofSubAbu";
					curr.field_id = "MHxSub2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		

//mHxofSubAbu	History of Documented Substance Use	MHxSub3	Not Specified	3	social_and_environmental_profile/documented_substance_use=Not Specified	social_and_environmental_profile/documented_substance_use = 8888

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/documented_substance_use");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 8888)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHxofSubAbu";
					curr.field_id = "MHxSub3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/documented_substance_use");
				
				if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mHxofSubAbu";
					curr.field_id = "MHxSub4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		}

		private void popluate_mIncarHx (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

//social_and_environmental_profile/previous_or_current_incarcerations

//mIncarHx	Incarceration History	MHxIncar1	Never Incarcerated	1	social_and_environmental_profile/previous_or_current_incarcerations=Never	social_and_environmental_profile/previous_or_current_incarcerations=0
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mIncarHx	Incarceration History	MHxIncar2	Was Incarcerated	2	social_and_environmental_profile/previous_or_current_incarcerations=Before pregnancy or During Pregnancy or After Pregnancy	social_and_environmental_profile/previous_or_current_incarcerations in (1, 2, 3)
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >= 1 && test_int <= 3)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mIncarHx	Incarceration History	MHxIncar3	Incarcerated Before Current Pregnancy	3	social_and_environmental_profile/previous_or_current_incarcerations=Before pregnancy	social_and_environmental_profile/previous_or_current_incarcerations=1
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mIncarHx	Incarceration History	MHxIncar4	Incarcerated During Current Pregnancy	4	social_and_environmental_profile/previous_or_current_incarcerations=During Pregnancy	social_and_environmental_profile/previous_or_current_incarcerations=2
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mIncarHx	Incarceration History	MHxIncar5	Incarcerated After Current Pregnancy	5	social_and_environmental_profile/previous_or_current_incarcerations=After Pregnancy	social_and_environmental_profile/previous_or_current_incarcerations=3
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 3)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar5";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar7";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mIncarHx	Incarceration History	MHxIncar6	Incarcerated 2 or more timepoints	6	social_and_environmental_profile/previous_or_current_incarcerations=After Pregnancy and During Pregnancy  OR social_and_environmental_profile/previous_or_current_incarcerations=After Pregnancy and Before Pregnancy  OR social_and_environmental_profile/previous_or_current_incarcerations=Before Pregnancy and During Pregnancy  OR social_and_environmental_profile/previous_or_current_incarcerations=Before Pregnancy and During Pregnancy and After Pregnancy	(social_and_environmental_profile/previous_or_current_incarcerations = 3 and social_and_environmental_profile/previous_or_current_incarcerations = 2)  OR (social_and_environmental_profile/previous_or_current_incarcerations = 3 and social_and_environmental_profile/previous_or_current_incarcerations = 1) OR (social_and_environmental_profile/previous_or_current_incarcerations = 2 and social_and_environmental_profile/previous_or_current_incarcerations = 1)  OR (social_and_environmental_profile/previous_or_current_incarcerations in (1, 2, 3))
/*
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/previous_or_current_incarcerations");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mIncarHx";
					curr.field_id = "MHxIncar6";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
			*/
		}

		private void popluate_mLivingArrange (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

//social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements

//mLivingArrange	Living Arrangements at time of death	MLivD1	Own	1	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=Own	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=0
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 0)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mLivingArrange	Living Arrangements at time of death	MLivD2	Rent	2	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=Rent	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=1
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 1)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mLivingArrange	Living Arrangements at time of death	MLivD3	Public Housing	3	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=Public Housing	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=2
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 2)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mLivingArrange	Living Arrangements at time of death	MLivD4	Live with relative	4	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=Live with relative	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=3
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 3)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mLivingArrange	Living Arrangements at time of death	MLivD5	Homeless	5	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=Homeless	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=4
			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && test_int == 4)
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD5";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
//mLivingArrange	Living Arrangements at time of death	MLivD6	Other or Unknown or Not specified	6	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements=Other or Unknown or Not specified	social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements in (5, 7777, 8888)

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 != null && int.TryParse(val_1, out test_int) && (test_int == 5 || test_int == 7777 || test_int == 8888))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD6";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				string val_1 = get_value(p_source_object, "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements");
				
				if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999 ))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mLivingArrange";
					curr.field_id = "MLivD7";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		}

		private void popluate_mMHTxTiming (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

			int test_int;

//mMHTxTiming	Number of Deaths by Mental Health Treatment Timing	MMHTx1	Prior to Most Recent Pregnancy	1	mental_health_profile/mental_health_conditions_prior_to_the_most_recent_pregnancy = Yes	mental_health_profile/mental_health_conditions_prior_to_the_most_recent_pregnancy in (0, 1, 2, 3, 4)
			try
			{	
				List<object> val_list = get_value(p_source_object, "mental_health_profile/mental_health_conditions_prior_to_the_most_recent_pregnancy");

				List<string> val_string_list = new List<string>();

				foreach(var item in val_list)
				{
					val_string_list.Add(item.ToString());
				}

				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >= 0 && test_int <= 4)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mMHTxTiming";
						curr.field_id = "MMHTx1";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mMHTxTiming	Number of Deaths by Mental Health Treatment Timing	MMHTx2	Was During Most Recent Pregnancy	2	mental_health_profile/mental_health_conditions_during_the_most_recent_pregnancy = Yes	mental_health_profile/mental_health_conditions_during_the_most_recent_pregnancy in (0, 1, 2, 3, 4)
			try
			{	
				List<object> val_list = get_value(p_source_object, "mental_health_profile/mental_health_conditions_during_the_most_recent_pregnancy");

				List<string> val_string_list = new List<string>();

				foreach(var item in val_list)
				{
					val_string_list.Add(item.ToString());
				}

				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >= 0 && test_int <= 4)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mMHTxTiming";
						curr.field_id = "MMHTx2";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mMHTxTiming	Number of Deaths by Mental Health Treatment Timing	MMHTx3	Mental Health Treatment After Most Recent Pregnancy	3	mental_health_profile/mental_health_conditions_after_the_most_recent_pregnancy = yes	mental_health_profile/mental_health_conditions_after_the_most_recent_pregnancy in (0, 1, 2, 3, 4)

			try
			{	
				List<object> val_list = get_value(p_source_object, "mental_health_profile/mental_health_conditions_after_the_most_recent_pregnancy");

				List<string> val_string_list = new List<string>();

				foreach(var item in val_list)
				{
					val_string_list.Add(item.ToString());
				}
				foreach(string val_1 in val_string_list)
				{
					if(val_1 != null && int.TryParse(val_1, out test_int) && test_int >= 0 && test_int <= 4)
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mMHTxTiming";
						curr.field_id = "MMHTx3";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				List<object> val_list = get_value(p_source_object, "mental_health_profile/mental_health_conditions_after_the_most_recent_pregnancy");

				List<string> val_string_list = new List<string>();

				foreach(var item in val_list)
				{
					val_string_list.Add(item.ToString());
				}
				foreach(string val_1 in val_string_list)
				{
					if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999 ))
					{
						var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
						curr.indicator_id = "mMHTxTiming";
						curr.field_id = "MMHTx4";
						curr.value = 1;
						this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
						break;
					}
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

		}

		private void popluate_mSubstAutop (ref List<mmria.server.model.opioid_report_value_struct> p_opioid_report_value_list, ref mmria.server.model.opioid_report_value_struct p_opioid_report_value, ref mmria.server.model.c_opioid_report_object p_report_object, System.Dynamic.ExpandoObject p_source_object)
		{

//autopsy_report/toxicology/substance

//mSubstAutop	MSubAuto1	Alcohol	1	autopsy_report/toxicology/substance= Substance that are mapped to ‘Alcohol‘ category in the substance categorization table below	autopsy_report/toxicology/substance = 'Alcohol'
//mSubstAutop	MSubAuto2	Amphetamine	2	autopsy_report/toxicology/substance= Substance that are mapped to ‘Amphetamine‘ category in the substance categorization table below	autopsy_report/toxicology/substance in ('Amphetamines, 'Methamphetamine')
//mSubstAutop	MSubAuto3	Benzodiazepine	3	autopsy_report/toxicology/substance= Substance that are mapped to ‘Benzodiazepine‘ category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Alprazolam (Xanax)', 'Aminoclonazepam', 'Chlordiazepoxide (Librium)', 'Clonazepam (Klonopin or Rivotril)', 'Diazepam (Valium)', 'Lorazepam (Ativan)', 'Temazepam (Restoril)', 'Zolpidem (Ambien)')
//mSubstAutop	MSubAuto4	Buprenorphine/Methadone	4	autopsy_report/toxicology/substance= Substance that are mapped to ‘Buprenorphine/Methadone‘ category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Buprenorphine', 'Methadone Hydrochloride')
//mSubstAutop	MSubAuto5	Cocaine	5	autopsy_report/toxicology/substance= Substance that are mapped to ‘Cocaine‘category in the substance categorization table below	autopsy_report/toxicology/substance = 'Cocaine'
//mSubstAutop	MSubAuto6	Opioid (excl Buprenorphine/Methadone)	6	autopsy_report/toxicology/substance= Substance that are mapped to ‘Opioid (excl Buprenorphine/Methadone)‘  category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Fentanyl', 'Heroin', 'Hydromorphone (Dilaudid)', 'Morphine Sulfate', 'Oxycodone Hydrochloride', 'Oxymorphone Hydrochloride (Opana)')
//mSubstAutop	MSubAuto7	Substance with Other Chemical Classification	7	autopsy_report/toxicology/substance= Substance that are mapped to ‘Substance with Other Chemical Classification‘  category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Acetaminophen', 'Acetazolamide (Diamox)', 'Aripiprazole (Abilify)', 'Carbamazepine (Neurontin)', 'Citalopram (Celexa)', 'Doxepin (Silenor, Zonalon, Prudoxin), 'Duloxetine (Cymbalta)', 'Felbamate (Felbatol)', 'Fluoxetine/Olanzapine (Symbyax)', 'Lurasidone (Latuda)', 'Meprobamate (Equanil)', 'Midazolam (Versed)', 'Pregabalin (Lyrica)', 'Quetiapine (Seroquel)', 'Sertraline (Zoloft)', 'Trazadone (Oleptro)')



var is_Alcohol = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);
var is_Amphetamine = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);
var is_Benzodiazepine = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);
var is_Buprenorphine_Methadone = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);
var is_Cocaine = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);
var is_Opioid = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);
var is_Other_Substance = new System.Collections.Generic.HashSet<string>(StringComparer.Ordinal);

is_Alcohol.Add("Alcohol");
is_Amphetamine.Add("Amphetamines");
is_Amphetamine.Add("Methamphetamine");

is_Benzodiazepine.Add("Alprazolam (Xanax)");
is_Benzodiazepine.Add("Aminoclonazepam");
is_Benzodiazepine.Add("Chlordiazepoxide (Librium)");
is_Benzodiazepine.Add("Clonazepam (Klonopin or Rivotril)");
is_Benzodiazepine.Add("Diazepam (Valium)");
is_Benzodiazepine.Add("Lorazepam (Ativan)");
is_Benzodiazepine.Add("Temazepam (Restoril)");
is_Benzodiazepine.Add("Zolpidem (Ambien)");


is_Buprenorphine_Methadone.Add("Buprenorphine");
is_Buprenorphine_Methadone.Add("MethadoneMethadone Hydrochloride");

is_Cocaine.Add("Cocaine");

is_Opioid.Add("Fentanyl");
is_Opioid.Add("Heroin");
is_Opioid.Add("Hydromorphone (Dilaudid)");
is_Opioid.Add("Morphine Sulfate");
is_Opioid.Add("Oxycodone Hydrochloride");
is_Opioid.Add("Oxymorphone Hydrochloride (Opana)");

 is_Other_Substance.Add("Acetaminophen");
 is_Other_Substance.Add("Acetazolamide (Diamox)");
 is_Other_Substance.Add("Aripiprazole (Abilify)");
 is_Other_Substance.Add("Carbamazepine (Neurontin)");
 is_Other_Substance.Add("Citalopram (Celexa)");
 is_Other_Substance.Add("Doxepin (Silenor, Zonalon, Prudoxin)");
 is_Other_Substance.Add("Duloxetine (Cymbalta)");
 is_Other_Substance.Add("Felbamate (Felbatol)");
 is_Other_Substance.Add("Fluoxetine/Olanzapine (Symbyax)");
 is_Other_Substance.Add("Lurasidone (Latuda)");
 is_Other_Substance.Add("Meprobamate (Equanil)");
 is_Other_Substance.Add("Midazolam (Versed)");
 is_Other_Substance.Add("Pregabalin (Lyrica)");
 is_Other_Substance.Add("Quetiapine (Seroquel)");
 is_Other_Substance.Add("Sertraline (Zoloft)");
 is_Other_Substance.Add("Trazadone (Oleptro)");













//mSubstAutop	MSubAuto1	Alcohol	1	autopsy_report/toxicology/substance= Substance that are mapped to ‘Alcohol‘ category in the substance categorization table below	autopsy_report/toxicology/substance = 'Alcohol'

			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Alcohol.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto1";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mSubstAutop	MSubAuto2	Amphetamine	2	autopsy_report/toxicology/substance= Substance that are mapped to ‘Amphetamine‘ category in the substance categorization table below	autopsy_report/toxicology/substance in ('Amphetamines, 'Methamphetamine')

			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Amphetamine.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto2";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mSubstAutop	MSubAuto3	Benzodiazepine	3	autopsy_report/toxicology/substance= Substance that are mapped to ‘Benzodiazepine‘ category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Alprazolam (Xanax)', 'Aminoclonazepam', 'Chlordiazepoxide (Librium)', 'Clonazepam (Klonopin or Rivotril)', 'Diazepam (Valium)', 'Lorazepam (Ativan)', 'Temazepam (Restoril)', 'Zolpidem (Ambien)')

			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Benzodiazepine.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto3";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mSubstAutop	MSubAuto4	Buprenorphine/Methadone	4	autopsy_report/toxicology/substance= Substance that are mapped to ‘Buprenorphine/Methadone‘ category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Buprenorphine', 'Methadone Hydrochloride')

			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Buprenorphine_Methadone.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto4";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mSubstAutop	MSubAuto5	Cocaine	5	autopsy_report/toxicology/substance= Substance that are mapped to ‘Cocaine‘category in the substance categorization table below	autopsy_report/toxicology/substance = 'Cocaine'

			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Cocaine.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto5";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mSubstAutop	MSubAuto6	Opioid (excl Buprenorphine/Methadone)	6	autopsy_report/toxicology/substance= Substance that are mapped to ‘Opioid (excl Buprenorphine/Methadone)‘  category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Fentanyl', 'Heroin', 'Hydromorphone (Dilaudid)', 'Morphine Sulfate', 'Oxycodone Hydrochloride', 'Oxymorphone Hydrochloride (Opana)')

			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Opioid.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto6";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

//mSubstAutop	MSubAuto7	Substance with Other Chemical Classification	7	autopsy_report/toxicology/substance= Substance that are mapped to ‘Substance with Other Chemical Classification‘  category  in the substance categorization table below	autopsy_report/toxicology/substance in ('Acetaminophen', 'Acetazolamide (Diamox)', 'Aripiprazole (Abilify)', 'Carbamazepine (Neurontin)', 'Citalopram (Celexa)', 'Doxepin (Silenor, Zonalon, Prudoxin), 'Duloxetine (Cymbalta)', 'Felbamate (Felbatol)', 'Fluoxetine/Olanzapine (Symbyax)', 'Lurasidone (Latuda)', 'Meprobamate (Equanil)', 'Midazolam (Versed)', 'Pregabalin (Lyrica)', 'Quetiapine (Seroquel)', 'Sertraline (Zoloft)', 'Trazadone (Oleptro)')



			try
			{	
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(is_Other_Substance.Contains(val_1))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto7";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}

			try
			{	
				int test_int;
				
				string val_1 = get_value(p_source_object, "autopsy_report/toxicology/substance");
				
				if(val_1 == null || (val_1 != null && int.TryParse(val_1, out test_int) && test_int == 9999 ))
				{
					var  curr = initialize_opioid_report_value_struct(p_opioid_report_value);
					curr.indicator_id = "mSubstAutop";
					curr.field_id = "MSubAuto8";
					curr.value = 1;
					this.indicators[$"{curr.indicator_id} {curr.field_id}"] = curr;
				}
				
			}
			catch(Exception ex)
			{
				System.Console.WriteLine (ex);
			}
		}

	}
}

