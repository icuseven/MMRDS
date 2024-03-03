
using System;
using System.Collections.Generic;
using System.Linq;

namespace mmria.case_version.v1;

public sealed partial class mmria_case
{


    public string? get_string(string path)
    {
        string? result = path.ToLower() switch
        {
         "version" => this.version,
         "created_by" => this.created_by,
         "last_updated_by" => this.last_updated_by,
         "last_checked_out_by" => this.last_checked_out_by,
         "host_state" => this.host_state,
         "addquarter" => this.addquarter,
         "cmpquarter" => this.cmpquarter,
         "home_record/first_name" => this.home_record.first_name,
         "home_record/middle_name" => this.home_record.middle_name,
         "home_record/last_name" => this.home_record.last_name,
         "home_record/state_of_death_record" => this.home_record.state_of_death_record,
         "home_record/record_id" => this.home_record.record_id,
         "home_record/agency_case_id" => this.home_record.agency_case_id,
         "home_record/specify_other_multiple_sources" => this.home_record.specify_other_multiple_sources,
         "home_record/primary_abstractor" => this.home_record.primary_abstractor,
         "home_record/overall_assessment_of_timing_of_death/hr_prg_outcome_othsp" => this.home_record.overall_assessment_of_timing_of_death.hr_prg_outcome_othsp,
         "home_record/automated_vitals_group/vro_status" => this.home_record.automated_vitals_group.vro_status,
         "death_certificate/certificate_identification/local_file_number" => this.death_certificate.certificate_identification.local_file_number,
         "death_certificate/certificate_identification/state_file_number" => this.death_certificate.certificate_identification.state_file_number,
         "death_certificate/certificate_identification/dmaiden" => this.death_certificate.certificate_identification.dmaiden,
         "death_certificate/place_of_last_residence/street" => this.death_certificate.place_of_last_residence.street,
         "death_certificate/place_of_last_residence/apartment" => this.death_certificate.place_of_last_residence.apartment,
         "death_certificate/place_of_last_residence/city" => this.death_certificate.place_of_last_residence.city,
         "death_certificate/place_of_last_residence/state" => this.death_certificate.place_of_last_residence.state,
         "death_certificate/place_of_last_residence/country_of_last_residence" => this.death_certificate.place_of_last_residence.country_of_last_residence,
         "death_certificate/place_of_last_residence/zip_code" => this.death_certificate.place_of_last_residence.zip_code,
         "death_certificate/place_of_last_residence/county" => this.death_certificate.place_of_last_residence.county,
         "death_certificate/place_of_last_residence/feature_matching_geography_type" => this.death_certificate.place_of_last_residence.feature_matching_geography_type,
         "death_certificate/place_of_last_residence/latitude" => this.death_certificate.place_of_last_residence.latitude,
         "death_certificate/place_of_last_residence/longitude" => this.death_certificate.place_of_last_residence.longitude,
         "death_certificate/place_of_last_residence/naaccr_census_tract_certainty_code" => this.death_certificate.place_of_last_residence.naaccr_census_tract_certainty_code,
         "death_certificate/place_of_last_residence/naaccr_census_tract_certainty_type" => this.death_certificate.place_of_last_residence.naaccr_census_tract_certainty_type,
         "death_certificate/place_of_last_residence/urban_status" => this.death_certificate.place_of_last_residence.urban_status,
         "death_certificate/demographics/city_of_birth" => this.death_certificate.demographics.city_of_birth,
         "death_certificate/demographics/state_of_birth" => this.death_certificate.demographics.state_of_birth,
         "death_certificate/demographics/country_of_birth" => this.death_certificate.demographics.country_of_birth,
         "death_certificate/demographics/primary_occupation" => this.death_certificate.demographics.primary_occupation,
         "death_certificate/demographics/occupation_business_industry" => this.death_certificate.demographics.occupation_business_industry,
         "death_certificate/demographics/is_of_hispanic_origin_other_specify" => this.death_certificate.demographics.is_of_hispanic_origin_other_specify,
         "death_certificate/citizen_of_what_country" => this.death_certificate.citizen_of_what_country,
         "death_certificate/race/other_race" => this.death_certificate.race.other_race,
         "death_certificate/race/other_asian" => this.death_certificate.race.other_asian,
         "death_certificate/race/other_pacific_islander" => this.death_certificate.race.other_pacific_islander,
         "death_certificate/race/principle_tribe" => this.death_certificate.race.principle_tribe,
         "death_certificate/injury_associated_information/place_of_injury" => this.death_certificate.injury_associated_information.place_of_injury,
         "death_certificate/injury_associated_information/transport_related_other_specify" => this.death_certificate.injury_associated_information.transport_related_other_specify,
         "death_certificate/address_of_injury/street" => this.death_certificate.address_of_injury.street,
         "death_certificate/address_of_injury/apartment" => this.death_certificate.address_of_injury.apartment,
         "death_certificate/address_of_injury/city" => this.death_certificate.address_of_injury.city,
         "death_certificate/address_of_injury/state" => this.death_certificate.address_of_injury.state,
         "death_certificate/address_of_injury/zip_code" => this.death_certificate.address_of_injury.zip_code,
         "death_certificate/address_of_injury/county" => this.death_certificate.address_of_injury.county,
         "death_certificate/address_of_injury/feature_matching_geography_type" => this.death_certificate.address_of_injury.feature_matching_geography_type,
         "death_certificate/address_of_injury/naaccr_census_tract_certainty_code" => this.death_certificate.address_of_injury.naaccr_census_tract_certainty_code,
         "death_certificate/address_of_injury/naaccr_census_tract_certainty_type" => this.death_certificate.address_of_injury.naaccr_census_tract_certainty_type,
         "death_certificate/address_of_injury/urban_status" => this.death_certificate.address_of_injury.urban_status,
         "death_certificate/death_information/other_death_outside_of_hospital" => this.death_certificate.death_information.other_death_outside_of_hospital,
         "death_certificate/address_of_death/place_of_death" => this.death_certificate.address_of_death.place_of_death,
         "death_certificate/address_of_death/street" => this.death_certificate.address_of_death.street,
         "death_certificate/address_of_death/apartment" => this.death_certificate.address_of_death.apartment,
         "death_certificate/address_of_death/city" => this.death_certificate.address_of_death.city,
         "death_certificate/address_of_death/state" => this.death_certificate.address_of_death.state,
         "death_certificate/address_of_death/zip_code" => this.death_certificate.address_of_death.zip_code,
         "death_certificate/address_of_death/county" => this.death_certificate.address_of_death.county,
         "death_certificate/address_of_death/feature_matching_geography_type" => this.death_certificate.address_of_death.feature_matching_geography_type,
         "death_certificate/address_of_death/naaccr_census_tract_certainty_code" => this.death_certificate.address_of_death.naaccr_census_tract_certainty_code,
         "death_certificate/address_of_death/naaccr_census_tract_certainty_type" => this.death_certificate.address_of_death.naaccr_census_tract_certainty_type,
         "death_certificate/address_of_death/urban_status" => this.death_certificate.address_of_death.urban_status,
         "death_certificate/vitals_import_group/cod1a" => this.death_certificate.vitals_import_group.cod1a,
         "death_certificate/vitals_import_group/interval1a" => this.death_certificate.vitals_import_group.interval1a,
         "death_certificate/vitals_import_group/cod1b" => this.death_certificate.vitals_import_group.cod1b,
         "death_certificate/vitals_import_group/interval1b" => this.death_certificate.vitals_import_group.interval1b,
         "death_certificate/vitals_import_group/cod1c" => this.death_certificate.vitals_import_group.cod1c,
         "death_certificate/vitals_import_group/interval1c" => this.death_certificate.vitals_import_group.interval1c,
         "death_certificate/vitals_import_group/cod1d" => this.death_certificate.vitals_import_group.cod1d,
         "death_certificate/vitals_import_group/interfval1d" => this.death_certificate.vitals_import_group.interfval1d,
         "death_certificate/vitals_import_group/othercondition" => this.death_certificate.vitals_import_group.othercondition,
         "death_certificate/vitals_import_group/man_uc" => this.death_certificate.vitals_import_group.man_uc,
         "death_certificate/vitals_import_group/acme_uc" => this.death_certificate.vitals_import_group.acme_uc,
         "death_certificate/vitals_import_group/eac" => this.death_certificate.vitals_import_group.eac,
         "death_certificate/vitals_import_group/rac" => this.death_certificate.vitals_import_group.rac,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/other_maternal_level_of_care" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.other_maternal_level_of_care,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_npi_number" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.facility_npi_number,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/facility_name" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.facility_name,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/other_attendant_type" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.other_attendant_type,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_npi" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.attendant_npi,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/transferred_from_where" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.transferred_from_where,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/street" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.street,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/apartment" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.apartment,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/city" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.city,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/state" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.state,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/zip_code" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.zip_code,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/county" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.county,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/feature_matching_geography_type" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.feature_matching_geography_type,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/naaccr_census_tract_certainty_code" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.naaccr_census_tract_certainty_code,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/naaccr_census_tract_certainty_type" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.naaccr_census_tract_certainty_type,
         "birth_fetal_death_certificate_parent/facility_of_delivery_location/urban_status" => this.birth_fetal_death_certificate_parent.facility_of_delivery_location.urban_status,
         "birth_fetal_death_certificate_parent/demographic_of_father/city_of_birth" => this.birth_fetal_death_certificate_parent.demographic_of_father.city_of_birth,
         "birth_fetal_death_certificate_parent/demographic_of_father/state_of_birth" => this.birth_fetal_death_certificate_parent.demographic_of_father.state_of_birth,
         "birth_fetal_death_certificate_parent/demographic_of_father/father_country_of_birth" => this.birth_fetal_death_certificate_parent.demographic_of_father.father_country_of_birth,
         "birth_fetal_death_certificate_parent/demographic_of_father/primary_occupation" => this.birth_fetal_death_certificate_parent.demographic_of_father.primary_occupation,
         "birth_fetal_death_certificate_parent/demographic_of_father/occupation_business_industry" => this.birth_fetal_death_certificate_parent.demographic_of_father.occupation_business_industry,
         "birth_fetal_death_certificate_parent/demographic_of_father/is_father_of_hispanic_origin_other_specify" => this.birth_fetal_death_certificate_parent.demographic_of_father.is_father_of_hispanic_origin_other_specify,
         "birth_fetal_death_certificate_parent/demographic_of_father/race/other_race" => this.birth_fetal_death_certificate_parent.demographic_of_father.race.other_race,
         "birth_fetal_death_certificate_parent/demographic_of_father/race/other_asian" => this.birth_fetal_death_certificate_parent.demographic_of_father.race.other_asian,
         "birth_fetal_death_certificate_parent/demographic_of_father/race/other_pacific_islander" => this.birth_fetal_death_certificate_parent.demographic_of_father.race.other_pacific_islander,
         "birth_fetal_death_certificate_parent/demographic_of_father/race/principle_tribe" => this.birth_fetal_death_certificate_parent.demographic_of_father.race.principle_tribe,
         "birth_fetal_death_certificate_parent/demographic_of_father/race/omb_race_recode" => this.birth_fetal_death_certificate_parent.demographic_of_father.race.omb_race_recode,
         "birth_fetal_death_certificate_parent/record_identification/first_name" => this.birth_fetal_death_certificate_parent.record_identification.first_name,
         "birth_fetal_death_certificate_parent/record_identification/middle_name" => this.birth_fetal_death_certificate_parent.record_identification.middle_name,
         "birth_fetal_death_certificate_parent/record_identification/last_name" => this.birth_fetal_death_certificate_parent.record_identification.last_name,
         "birth_fetal_death_certificate_parent/record_identification/maiden_name" => this.birth_fetal_death_certificate_parent.record_identification.maiden_name,
         "birth_fetal_death_certificate_parent/record_identification/medical_record_number" => this.birth_fetal_death_certificate_parent.record_identification.medical_record_number,
         "birth_fetal_death_certificate_parent/demographic_of_mother/city_of_birth" => this.birth_fetal_death_certificate_parent.demographic_of_mother.city_of_birth,
         "birth_fetal_death_certificate_parent/demographic_of_mother/state_of_birth" => this.birth_fetal_death_certificate_parent.demographic_of_mother.state_of_birth,
         "birth_fetal_death_certificate_parent/demographic_of_mother/country_of_birth" => this.birth_fetal_death_certificate_parent.demographic_of_mother.country_of_birth,
         "birth_fetal_death_certificate_parent/demographic_of_mother/primary_occupation" => this.birth_fetal_death_certificate_parent.demographic_of_mother.primary_occupation,
         "birth_fetal_death_certificate_parent/demographic_of_mother/occupation_business_industry" => this.birth_fetal_death_certificate_parent.demographic_of_mother.occupation_business_industry,
         "birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin_other_specify" => this.birth_fetal_death_certificate_parent.demographic_of_mother.is_of_hispanic_origin_other_specify,
         "birth_fetal_death_certificate_parent/location_of_residence/street" => this.birth_fetal_death_certificate_parent.location_of_residence.street,
         "birth_fetal_death_certificate_parent/location_of_residence/apartment" => this.birth_fetal_death_certificate_parent.location_of_residence.apartment,
         "birth_fetal_death_certificate_parent/location_of_residence/city" => this.birth_fetal_death_certificate_parent.location_of_residence.city,
         "birth_fetal_death_certificate_parent/location_of_residence/state" => this.birth_fetal_death_certificate_parent.location_of_residence.state,
         "birth_fetal_death_certificate_parent/location_of_residence/zip_code" => this.birth_fetal_death_certificate_parent.location_of_residence.zip_code,
         "birth_fetal_death_certificate_parent/location_of_residence/county" => this.birth_fetal_death_certificate_parent.location_of_residence.county,
         "birth_fetal_death_certificate_parent/location_of_residence/feature_matching_geography_type" => this.birth_fetal_death_certificate_parent.location_of_residence.feature_matching_geography_type,
         "birth_fetal_death_certificate_parent/location_of_residence/naaccr_census_tract_certainty_code" => this.birth_fetal_death_certificate_parent.location_of_residence.naaccr_census_tract_certainty_code,
         "birth_fetal_death_certificate_parent/location_of_residence/naaccr_census_tract_certainty_type" => this.birth_fetal_death_certificate_parent.location_of_residence.naaccr_census_tract_certainty_type,
         "birth_fetal_death_certificate_parent/location_of_residence/urban_status" => this.birth_fetal_death_certificate_parent.location_of_residence.urban_status,
         "birth_fetal_death_certificate_parent/race/other_race" => this.birth_fetal_death_certificate_parent.race.other_race,
         "birth_fetal_death_certificate_parent/race/other_asian" => this.birth_fetal_death_certificate_parent.race.other_asian,
         "birth_fetal_death_certificate_parent/race/other_pacific_islander" => this.birth_fetal_death_certificate_parent.race.other_pacific_islander,
         "birth_fetal_death_certificate_parent/race/principle_tribe" => this.birth_fetal_death_certificate_parent.race.principle_tribe,
         "birth_fetal_death_certificate_parent/race/omb_race_recode" => this.birth_fetal_death_certificate_parent.race.omb_race_recode,
         "birth_fetal_death_certificate_parent/pregnancy_history/pregnancy_interval" => this.birth_fetal_death_certificate_parent.pregnancy_history.pregnancy_interval,
         "birth_fetal_death_certificate_parent/prenatal_care/specify_if_greater_than_3" => this.birth_fetal_death_certificate_parent.prenatal_care.specify_if_greater_than_3,
         "birth_fetal_death_certificate_parent/prenatal_care/specify_other_payor" => this.birth_fetal_death_certificate_parent.prenatal_care.specify_other_payor,
         "birth_fetal_death_certificate_parent/specify_other_infection" => this.birth_fetal_death_certificate_parent.specify_other_infection,
         "cvs/cvs_used_other_sp" => this.cvs.cvs_used_other_sp,
         "social_and_environmental_profile/socio_economic_characteristics/source_of_income_other_specify" => this.social_and_environmental_profile.socio_economic_characteristics.source_of_income_other_specify,
         "social_and_environmental_profile/socio_economic_characteristics/employment_status_other_specify" => this.social_and_environmental_profile.socio_economic_characteristics.employment_status_other_specify,
         "social_and_environmental_profile/socio_economic_characteristics/occupation" => this.social_and_environmental_profile.socio_economic_characteristics.occupation,
         "social_and_environmental_profile/socio_economic_characteristics/religious_preference" => this.social_and_environmental_profile.socio_economic_characteristics.religious_preference,
         "social_and_environmental_profile/socio_economic_characteristics/country_of_birth" => this.social_and_environmental_profile.socio_economic_characteristics.country_of_birth,
         "social_and_environmental_profile/gender_identity/sep_genid_source_othersp" => this.social_and_environmental_profile.gender_identity.sep_genid_source_othersp,
         "social_and_environmental_profile/health_care_access/barriers_to_health_care_access_other_specify" => this.social_and_environmental_profile.health_care_access.barriers_to_health_care_access_other_specify,
         "social_and_environmental_profile/communications/barriers_to_communications_other_specify" => this.social_and_environmental_profile.communications.barriers_to_communications_other_specify,
         "social_and_environmental_profile/social_or_emotional_stress/specify_other_evidence_stress" => this.social_and_environmental_profile.social_or_emotional_stress.specify_other_evidence_stress,
         "social_and_environmental_profile/health_care_system/specify_other_reason" => this.social_and_environmental_profile.health_care_system.specify_other_reason,
         "autopsy_report/reporter_characteristics/other_specify" => this.autopsy_report.reporter_characteristics.other_specify,
         "autopsy_report/reporter_characteristics/jurisdiction" => this.autopsy_report.reporter_characteristics.jurisdiction,
         "autopsy_report/icd_code_version" => this.autopsy_report.icd_code_version,
         "prenatal/prenatal_care_record_no" => this.prenatal.prenatal_care_record_no,
         "prenatal/primary_prenatal_care_facility/other_place_type" => this.prenatal.primary_prenatal_care_facility.other_place_type,
         "prenatal/primary_prenatal_care_facility/specify_other_provider_type" => this.prenatal.primary_prenatal_care_facility.specify_other_provider_type,
         "prenatal/primary_prenatal_care_facility/other_payment_source" => this.prenatal.primary_prenatal_care_facility.other_payment_source,
         "prenatal/location_of_primary_prenatal_care_facility/street" => this.prenatal.location_of_primary_prenatal_care_facility.street,
         "prenatal/location_of_primary_prenatal_care_facility/apartment" => this.prenatal.location_of_primary_prenatal_care_facility.apartment,
         "prenatal/location_of_primary_prenatal_care_facility/city" => this.prenatal.location_of_primary_prenatal_care_facility.city,
         "prenatal/location_of_primary_prenatal_care_facility/state" => this.prenatal.location_of_primary_prenatal_care_facility.state,
         "prenatal/location_of_primary_prenatal_care_facility/zip_code" => this.prenatal.location_of_primary_prenatal_care_facility.zip_code,
         "prenatal/location_of_primary_prenatal_care_facility/county" => this.prenatal.location_of_primary_prenatal_care_facility.county,
         "prenatal/location_of_primary_prenatal_care_facility/feature_matching_geography_type" => this.prenatal.location_of_primary_prenatal_care_facility.feature_matching_geography_type,
         "prenatal/location_of_primary_prenatal_care_facility/naaccr_census_tract_certainty_code" => this.prenatal.location_of_primary_prenatal_care_facility.naaccr_census_tract_certainty_code,
         "prenatal/location_of_primary_prenatal_care_facility/naaccr_census_tract_certainty_type" => this.prenatal.location_of_primary_prenatal_care_facility.naaccr_census_tract_certainty_type,
         "prenatal/location_of_primary_prenatal_care_facility/urban_status" => this.prenatal.location_of_primary_prenatal_care_facility.urban_status,
         "prenatal/intendedenes/pi_wp_plann_sp" => this.prenatal.intendedenes.pi_wp_plann_sp,
         "prenatal/intendedenes/was_patient_using_birth_control_other_specify" => this.prenatal.intendedenes.was_patient_using_birth_control_other_specify,
         "prenatal/infertility_treatment/specify_other_art_type" => this.prenatal.infertility_treatment.specify_other_art_type,
         "prenatal/current_pregnancy/intended_birthing_facility" => this.prenatal.current_pregnancy.intended_birthing_facility,
         "mental_health_profile/other_prior_to_pregnancy" => this.mental_health_profile.other_prior_to_pregnancy,
         "mental_health_profile/other_during_pregnancy" => this.mental_health_profile.other_during_pregnancy,
         "mental_health_profile/other_after_pregnancy" => this.mental_health_profile.other_after_pregnancy,
         "committee_review/pmss_mm" => this.committee_review.pmss_mm,
         "committee_review/pmss_mm_secondary" => this.committee_review.pmss_mm_secondary,
         "committee_review/specify_other_means_fatal_injury" => this.committee_review.specify_other_means_fatal_injury,
         "committee_review/specify_other_relationship" => this.committee_review.specify_other_relationship,

            _ => null
        };
        
        return result;
    }

    public double? get_double(string path)
    {
        double? result = path.ToLower() switch
        {
         "home_record/date_of_death/month" => this.home_record.date_of_death.month,
         "home_record/date_of_death/day" => this.home_record.date_of_death.day,
         "home_record/date_of_death/year" => this.home_record.date_of_death.year,
         "home_record/case_status/overall_case_status" => this.home_record.case_status.overall_case_status,
         "home_record/overall_assessment_of_timing_of_death/abstrator_assigned_status" => this.home_record.overall_assessment_of_timing_of_death.abstrator_assigned_status,
         "home_record/overall_assessment_of_timing_of_death/hr_prg_outcome" => this.home_record.overall_assessment_of_timing_of_death.hr_prg_outcome,
         "home_record/case_progress_report/death_certificate" => this.home_record.case_progress_report.death_certificate,
         "home_record/case_progress_report/autopsy_report" => this.home_record.case_progress_report.autopsy_report,
         "home_record/case_progress_report/birth_certificate_parent_section" => this.home_record.case_progress_report.birth_certificate_parent_section,
         "home_record/case_progress_report/birth_certificate_infant_or_fetal_death_section" => this.home_record.case_progress_report.birth_certificate_infant_or_fetal_death_section,
         "home_record/case_progress_report/community_vital_signs" => this.home_record.case_progress_report.community_vital_signs,
         "home_record/case_progress_report/social_and_psychological_profile" => this.home_record.case_progress_report.social_and_psychological_profile,
         "home_record/case_progress_report/prenatal_care_record" => this.home_record.case_progress_report.prenatal_care_record,
         "home_record/case_progress_report/er_visits_and_hospitalizations" => this.home_record.case_progress_report.er_visits_and_hospitalizations,
         "home_record/case_progress_report/other_medical_visits" => this.home_record.case_progress_report.other_medical_visits,
         "home_record/case_progress_report/medical_transport" => this.home_record.case_progress_report.medical_transport,
         "home_record/case_progress_report/mental_health_profile" => this.home_record.case_progress_report.mental_health_profile,
         "home_record/case_progress_report/informant_interviews" => this.home_record.case_progress_report.informant_interviews,
         "home_record/case_progress_report/case_narrative" => this.home_record.case_progress_report.case_narrative,
         "home_record/case_progress_report/committe_review_worksheet" => this.home_record.case_progress_report.committe_review_worksheet,
         "home_record/automated_vitals_group/bc_det_match" => this.home_record.automated_vitals_group.bc_det_match,
         "home_record/automated_vitals_group/fdc_det_match" => this.home_record.automated_vitals_group.fdc_det_match,
         "home_record/automated_vitals_group/bc_prob_match" => this.home_record.automated_vitals_group.bc_prob_match,
         "home_record/automated_vitals_group/fdc_prob_match" => this.home_record.automated_vitals_group.fdc_prob_match,
         "home_record/automated_vitals_group/icd10_match" => this.home_record.automated_vitals_group.icd10_match,
         "home_record/automated_vitals_group/pregcb_match" => this.home_record.automated_vitals_group.pregcb_match,
         "home_record/automated_vitals_group/literalcod_match" => this.home_record.automated_vitals_group.literalcod_match,
         "death_certificate/demographics/date_of_birth/month" => this.death_certificate.demographics.date_of_birth.month,
         "death_certificate/demographics/date_of_birth/day" => this.death_certificate.demographics.date_of_birth.day,
         "death_certificate/demographics/date_of_birth/year" => this.death_certificate.demographics.date_of_birth.year,
         "death_certificate/demographics/marital_status" => this.death_certificate.demographics.marital_status,
         "death_certificate/demographics/ever_in_us_armed_forces" => this.death_certificate.demographics.ever_in_us_armed_forces,
         "death_certificate/demographics/is_of_hispanic_origin" => this.death_certificate.demographics.is_of_hispanic_origin,
         "death_certificate/demographics/education_level" => this.death_certificate.demographics.education_level,
         "death_certificate/race/omb_race_recode" => this.death_certificate.race.omb_race_recode,
         "death_certificate/injury_associated_information/date_of_injury/month" => this.death_certificate.injury_associated_information.date_of_injury.month,
         "death_certificate/injury_associated_information/date_of_injury/day" => this.death_certificate.injury_associated_information.date_of_injury.day,
         "death_certificate/injury_associated_information/date_of_injury/year" => this.death_certificate.injury_associated_information.date_of_injury.year,
         "death_certificate/injury_associated_information/was_injury_at_work" => this.death_certificate.injury_associated_information.was_injury_at_work,
         "death_certificate/injury_associated_information/transportation_related_injury" => this.death_certificate.injury_associated_information.transportation_related_injury,
         "death_certificate/injury_associated_information/were_seat_belts_in_use" => this.death_certificate.injury_associated_information.were_seat_belts_in_use,
         "death_certificate/death_information/death_occured_in_hospital" => this.death_certificate.death_information.death_occured_in_hospital,
         "death_certificate/death_information/death_outside_of_hospital" => this.death_certificate.death_information.death_outside_of_hospital,
         "death_certificate/death_information/manner_of_death" => this.death_certificate.death_information.manner_of_death,
         "death_certificate/death_information/was_autopsy_performed" => this.death_certificate.death_information.was_autopsy_performed,
         "death_certificate/death_information/was_autopsy_used_for_death_coding" => this.death_certificate.death_information.was_autopsy_used_for_death_coding,
         "death_certificate/death_information/pregnancy_status" => this.death_certificate.death_information.pregnancy_status,
         "death_certificate/death_information/did_tobacco_contribute_to_death" => this.death_certificate.death_information.did_tobacco_contribute_to_death,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/month" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.month,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/day" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.day,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/date_of_delivery/year" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.date_of_delivery.year,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/type_of_place" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.type_of_place,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/was_home_delivery_planned" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.was_home_delivery_planned,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/maternal_level_of_care" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.maternal_level_of_care,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/attendant_type" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.attendant_type,
         "birth_fetal_death_certificate_parent/facility_of_delivery_demographics/was_mother_transferred" => this.birth_fetal_death_certificate_parent.facility_of_delivery_demographics.was_mother_transferred,
         "birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/month" => this.birth_fetal_death_certificate_parent.demographic_of_father.date_of_birth.month,
         "birth_fetal_death_certificate_parent/demographic_of_father/date_of_birth/year" => this.birth_fetal_death_certificate_parent.demographic_of_father.date_of_birth.year,
         "birth_fetal_death_certificate_parent/demographic_of_father/education_level" => this.birth_fetal_death_certificate_parent.demographic_of_father.education_level,
         "birth_fetal_death_certificate_parent/demographic_of_father/is_father_of_hispanic_origin" => this.birth_fetal_death_certificate_parent.demographic_of_father.is_father_of_hispanic_origin,
         "birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/month" => this.birth_fetal_death_certificate_parent.demographic_of_mother.date_of_birth.month,
         "birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/day" => this.birth_fetal_death_certificate_parent.demographic_of_mother.date_of_birth.day,
         "birth_fetal_death_certificate_parent/demographic_of_mother/date_of_birth/year" => this.birth_fetal_death_certificate_parent.demographic_of_mother.date_of_birth.year,
         "birth_fetal_death_certificate_parent/demographic_of_mother/mother_married" => this.birth_fetal_death_certificate_parent.demographic_of_mother.mother_married,
         "birth_fetal_death_certificate_parent/demographic_of_mother/If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital" => this.birth_fetal_death_certificate_parent.demographic_of_mother.If_mother_not_married_has_paternity_acknowledgement_been_signed_in_the_hospital,
         "birth_fetal_death_certificate_parent/demographic_of_mother/ever_in_us_armed_forces" => this.birth_fetal_death_certificate_parent.demographic_of_mother.ever_in_us_armed_forces,
         "birth_fetal_death_certificate_parent/demographic_of_mother/is_of_hispanic_origin" => this.birth_fetal_death_certificate_parent.demographic_of_mother.is_of_hispanic_origin,
         "birth_fetal_death_certificate_parent/demographic_of_mother/education_level" => this.birth_fetal_death_certificate_parent.demographic_of_mother.education_level,
         "birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/month" => this.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.month,
         "birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/day" => this.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.day,
         "birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_live_birth/year" => this.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_live_birth.year,
         "birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/month" => this.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.month,
         "birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/day" => this.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.day,
         "birth_fetal_death_certificate_parent/pregnancy_history/date_of_last_other_outcome/year" => this.birth_fetal_death_certificate_parent.pregnancy_history.date_of_last_other_outcome.year,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/month" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.month,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/day" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.day,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_last_normal_menses/year" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_normal_menses.year,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/month" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_1st_prenatal_visit.month,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/day" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_1st_prenatal_visit.day,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_1st_prenatal_visit/year" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_1st_prenatal_visit.year,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_last_prenatal_visit/month" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_prenatal_visit.month,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_last_prenatal_visit/day" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_prenatal_visit.day,
         "birth_fetal_death_certificate_parent/prenatal_care/date_of_last_prenatal_visit/year" => this.birth_fetal_death_certificate_parent.prenatal_care.date_of_last_prenatal_visit.year,
         "birth_fetal_death_certificate_parent/prenatal_care/plurality" => this.birth_fetal_death_certificate_parent.prenatal_care.plurality,
         "birth_fetal_death_certificate_parent/prenatal_care/was_wic_used" => this.birth_fetal_death_certificate_parent.prenatal_care.was_wic_used,
         "birth_fetal_death_certificate_parent/prenatal_care/principal_source_of_payment_for_this_delivery" => this.birth_fetal_death_certificate_parent.prenatal_care.principal_source_of_payment_for_this_delivery,
         "birth_fetal_death_certificate_parent/prenatal_care/trimester_of_1st_prenatal_care_visit" => this.birth_fetal_death_certificate_parent.prenatal_care.trimester_of_1st_prenatal_care_visit,
         "birth_fetal_death_certificate_parent/cigarette_smoking/prior_3_months_type" => this.birth_fetal_death_certificate_parent.cigarette_smoking.prior_3_months_type,
         "birth_fetal_death_certificate_parent/cigarette_smoking/trimester_1st_type" => this.birth_fetal_death_certificate_parent.cigarette_smoking.trimester_1st_type,
         "birth_fetal_death_certificate_parent/cigarette_smoking/trimester_2nd_type" => this.birth_fetal_death_certificate_parent.cigarette_smoking.trimester_2nd_type,
         "birth_fetal_death_certificate_parent/cigarette_smoking/trimester_3rd_type" => this.birth_fetal_death_certificate_parent.cigarette_smoking.trimester_3rd_type,
         "birth_fetal_death_certificate_parent/cigarette_smoking/none_or_not_specified" => this.birth_fetal_death_certificate_parent.cigarette_smoking.none_or_not_specified,
         "cvs/cvs_used" => this.cvs.cvs_used,
         "cvs/cvs_used_how" => this.cvs.cvs_used_how,
         "social_and_environmental_profile/socio_economic_characteristics/source_of_income" => this.social_and_environmental_profile.socio_economic_characteristics.source_of_income,
         "social_and_environmental_profile/socio_economic_characteristics/employment_status" => this.social_and_environmental_profile.socio_economic_characteristics.employment_status,
         "social_and_environmental_profile/socio_economic_characteristics/immigration_status" => this.social_and_environmental_profile.socio_economic_characteristics.immigration_status,
         "social_and_environmental_profile/socio_economic_characteristics/time_in_the_us_units" => this.social_and_environmental_profile.socio_economic_characteristics.time_in_the_us_units,
         "social_and_environmental_profile/socio_economic_characteristics/current_living_arrangements" => this.social_and_environmental_profile.socio_economic_characteristics.current_living_arrangements,
         "social_and_environmental_profile/gender_identity/sep_genid_is_nonfemale" => this.social_and_environmental_profile.gender_identity.sep_genid_is_nonfemale,
         "social_and_environmental_profile/health_care_system/no_prenatal_care" => this.social_and_environmental_profile.health_care_system.no_prenatal_care,
         "social_and_environmental_profile/had_military_service" => this.social_and_environmental_profile.had_military_service,
         "social_and_environmental_profile/was_there_bereavement_support" => this.social_and_environmental_profile.was_there_bereavement_support,
         "social_and_environmental_profile/documented_substance_use" => this.social_and_environmental_profile.documented_substance_use,
         "autopsy_report/was_there_an_autopsy_referral" => this.autopsy_report.was_there_an_autopsy_referral,
         "autopsy_report/type_of_autopsy_or_examination" => this.autopsy_report.type_of_autopsy_or_examination,
         "autopsy_report/is_autopsy_or_exam_report_available" => this.autopsy_report.is_autopsy_or_exam_report_available,
         "autopsy_report/was_toxicology_performed" => this.autopsy_report.was_toxicology_performed,
         "autopsy_report/is_toxicology_report_available" => this.autopsy_report.is_toxicology_report_available,
         "autopsy_report/completeness_of_autopsy_information" => this.autopsy_report.completeness_of_autopsy_information,
         "autopsy_report/reporter_characteristics/reporter_type" => this.autopsy_report.reporter_characteristics.reporter_type,
         "autopsy_report/reporter_characteristics/date_of_autopsy/month" => this.autopsy_report.reporter_characteristics.date_of_autopsy.month,
         "autopsy_report/reporter_characteristics/date_of_autopsy/day" => this.autopsy_report.reporter_characteristics.date_of_autopsy.day,
         "autopsy_report/reporter_characteristics/date_of_autopsy/year" => this.autopsy_report.reporter_characteristics.date_of_autopsy.year,
         "autopsy_report/biometrics/fetus/fetal_weight_uom" => this.autopsy_report.biometrics.fetus.fetal_weight_uom,
         "autopsy_report/biometrics/fetus/fetal_length_uom" => this.autopsy_report.biometrics.fetus.fetal_length_uom,
         "autopsy_report/was_drug_toxicology_positive" => this.autopsy_report.was_drug_toxicology_positive,
         "prenatal/number_of_pnc_sources" => this.prenatal.number_of_pnc_sources,
         "prenatal/primary_prenatal_care_facility/place_type" => this.prenatal.primary_prenatal_care_facility.place_type,
         "prenatal/primary_prenatal_care_facility/primary_provider_type" => this.prenatal.primary_prenatal_care_facility.primary_provider_type,
         "prenatal/primary_prenatal_care_facility/principal_source_of_payment" => this.prenatal.primary_prenatal_care_facility.principal_source_of_payment,
         "prenatal/primary_prenatal_care_facility/is_use_wic" => this.prenatal.primary_prenatal_care_facility.is_use_wic,
         "prenatal/had_pre_existing_conditions" => this.prenatal.had_pre_existing_conditions,
         "prenatal/were_there_documented_mental_health_conditions" => this.prenatal.were_there_documented_mental_health_conditions,
         "prenatal/evidence_of_substance_use" => this.prenatal.evidence_of_substance_use,
         "prenatal/intendedenes/date_birth_control_was_discontinued/month" => this.prenatal.intendedenes.date_birth_control_was_discontinued.month,
         "prenatal/intendedenes/date_birth_control_was_discontinued/day" => this.prenatal.intendedenes.date_birth_control_was_discontinued.day,
         "prenatal/intendedenes/date_birth_control_was_discontinued/year" => this.prenatal.intendedenes.date_birth_control_was_discontinued.year,
         "prenatal/intendedenes/was_pregnancy_planned" => this.prenatal.intendedenes.was_pregnancy_planned,
         "prenatal/intendedenes/was_patient_using_birth_control" => this.prenatal.intendedenes.was_patient_using_birth_control,
         "prenatal/infertility_treatment/was_pregnancy_result_of_infertility_treatment" => this.prenatal.infertility_treatment.was_pregnancy_result_of_infertility_treatment,
         "prenatal/infertility_treatment/fertility_enhanding_drugs" => this.prenatal.infertility_treatment.fertility_enhanding_drugs,
         "prenatal/infertility_treatment/assisted_reproductive_technology" => this.prenatal.infertility_treatment.assisted_reproductive_technology,
         "prenatal/infertility_treatment/art_type" => this.prenatal.infertility_treatment.art_type,
         "prenatal/current_pregnancy/date_of_last_normal_menses/month" => this.prenatal.current_pregnancy.date_of_last_normal_menses.month,
         "prenatal/current_pregnancy/date_of_last_normal_menses/day" => this.prenatal.current_pregnancy.date_of_last_normal_menses.day,
         "prenatal/current_pregnancy/date_of_last_normal_menses/year" => this.prenatal.current_pregnancy.date_of_last_normal_menses.year,
         "prenatal/current_pregnancy/estimated_date_of_confinement/month" => this.prenatal.current_pregnancy.estimated_date_of_confinement.month,
         "prenatal/current_pregnancy/estimated_date_of_confinement/day" => this.prenatal.current_pregnancy.estimated_date_of_confinement.day,
         "prenatal/current_pregnancy/estimated_date_of_confinement/year" => this.prenatal.current_pregnancy.estimated_date_of_confinement.year,
         "prenatal/current_pregnancy/estimated_date_of_confinement/estimate_based_on" => this.prenatal.current_pregnancy.estimated_date_of_confinement.estimate_based_on,
         "prenatal/current_pregnancy/date_of_1st_prenatal_visit/month" => this.prenatal.current_pregnancy.date_of_1st_prenatal_visit.month,
         "prenatal/current_pregnancy/date_of_1st_prenatal_visit/day" => this.prenatal.current_pregnancy.date_of_1st_prenatal_visit.day,
         "prenatal/current_pregnancy/date_of_1st_prenatal_visit/year" => this.prenatal.current_pregnancy.date_of_1st_prenatal_visit.year,
         "prenatal/current_pregnancy/date_of_1st_ultrasound/month" => this.prenatal.current_pregnancy.date_of_1st_ultrasound.month,
         "prenatal/current_pregnancy/date_of_1st_ultrasound/day" => this.prenatal.current_pregnancy.date_of_1st_ultrasound.day,
         "prenatal/current_pregnancy/date_of_1st_ultrasound/year" => this.prenatal.current_pregnancy.date_of_1st_ultrasound.year,
         "prenatal/current_pregnancy/date_of_last_prenatal_visit/month" => this.prenatal.current_pregnancy.date_of_last_prenatal_visit.month,
         "prenatal/current_pregnancy/date_of_last_prenatal_visit/day" => this.prenatal.current_pregnancy.date_of_last_prenatal_visit.day,
         "prenatal/current_pregnancy/date_of_last_prenatal_visit/year" => this.prenatal.current_pregnancy.date_of_last_prenatal_visit.year,
         "prenatal/current_pregnancy/trimester_of_first_pnc_visit" => this.prenatal.current_pregnancy.trimester_of_first_pnc_visit,
         "prenatal/current_pregnancy/was_home_delivery_planned" => this.prenatal.current_pregnancy.was_home_delivery_planned,
         "prenatal/current_pregnancy/attended_prenatal_visits_alone" => this.prenatal.current_pregnancy.attended_prenatal_visits_alone,
         "prenatal/were_there_problems_identified" => this.prenatal.were_there_problems_identified,
         "prenatal/were_there_adverse_reactions" => this.prenatal.were_there_adverse_reactions,
         "prenatal/were_there_pre_delivery_hospitalizations" => this.prenatal.were_there_pre_delivery_hospitalizations,
         "prenatal/were_medical_referrals_to_others" => this.prenatal.were_medical_referrals_to_others,
         "mental_health_profile/were_there_documented_preexisting_mental_health_conditions" => this.mental_health_profile.were_there_documented_preexisting_mental_health_conditions,
         "committee_review/pregnancy_relatedness" => this.committee_review.pregnancy_relatedness,
         "committee_review/estimate_degree_relevant_information_available" => this.committee_review.estimate_degree_relevant_information_available,
         "committee_review/does_committee_agree_with_cod_on_death_certificate" => this.committee_review.does_committee_agree_with_cod_on_death_certificate,
         "committee_review/did_obesity_contribute_to_the_death" => this.committee_review.did_obesity_contribute_to_the_death,
         "committee_review/did_discrimination_contribute_to_the_death" => this.committee_review.did_discrimination_contribute_to_the_death,
         "committee_review/did_mental_health_conditions_contribute_to_the_death" => this.committee_review.did_mental_health_conditions_contribute_to_the_death,
         "committee_review/did_substance_use_disorder_contribute_to_the_death" => this.committee_review.did_substance_use_disorder_contribute_to_the_death,
         "committee_review/was_this_death_a_sucide" => this.committee_review.was_this_death_a_sucide,
         "committee_review/was_this_death_a_homicide" => this.committee_review.was_this_death_a_homicide,
         "committee_review/means_of_fatal_injury" => this.committee_review.means_of_fatal_injury,
         "committee_review/if_homicide_relationship_of_perpetrator" => this.committee_review.if_homicide_relationship_of_perpetrator,
         "committee_review/was_this_death_preventable" => this.committee_review.was_this_death_preventable,
         "committee_review/chance_to_alter_outcome" => this.committee_review.chance_to_alter_outcome,

            _ => null
        };
        
        return result;
    }

    public List<double>? get_list_of_double(string path)
    {
        List<double>? result = path.ToLower() switch
        {
         "home_record/how_was_this_death_identified" => this.home_record.how_was_this_death_identified,
         "death_certificate/race/race" => this.death_certificate.race.race,
         "birth_fetal_death_certificate_parent/demographic_of_father/race/race_of_father" => this.birth_fetal_death_certificate_parent.demographic_of_father.race.race_of_father,
         "birth_fetal_death_certificate_parent/race/race_of_mother" => this.birth_fetal_death_certificate_parent.race.race_of_mother,
         "birth_fetal_death_certificate_parent/risk_factors/risk_factors_in_this_pregnancy" => this.birth_fetal_death_certificate_parent.risk_factors.risk_factors_in_this_pregnancy,
         "birth_fetal_death_certificate_parent/infections_present_or_treated_during_pregnancy" => this.birth_fetal_death_certificate_parent.infections_present_or_treated_during_pregnancy,
         "birth_fetal_death_certificate_parent/onset_of_labor" => this.birth_fetal_death_certificate_parent.onset_of_labor,
         "birth_fetal_death_certificate_parent/obstetric_procedures" => this.birth_fetal_death_certificate_parent.obstetric_procedures,
         "birth_fetal_death_certificate_parent/characteristics_of_labor_and_delivery" => this.birth_fetal_death_certificate_parent.characteristics_of_labor_and_delivery,
         "birth_fetal_death_certificate_parent/maternal_morbidity" => this.birth_fetal_death_certificate_parent.maternal_morbidity,
         "social_and_environmental_profile/socio_economic_characteristics/homelessness" => this.social_and_environmental_profile.socio_economic_characteristics.homelessness,
         "social_and_environmental_profile/socio_economic_characteristics/unstable_housing" => this.social_and_environmental_profile.socio_economic_characteristics.unstable_housing,
         "social_and_environmental_profile/gender_identity/sep_genid_source" => this.social_and_environmental_profile.gender_identity.sep_genid_source,
         "social_and_environmental_profile/previous_or_current_incarcerations" => this.social_and_environmental_profile.previous_or_current_incarcerations,
         "social_and_environmental_profile/was_decedent_ever_arrested" => this.social_and_environmental_profile.was_decedent_ever_arrested,
         "social_and_environmental_profile/health_care_access/barriers_to_health_care_access" => this.social_and_environmental_profile.health_care_access.barriers_to_health_care_access,
         "social_and_environmental_profile/communications/barriers_to_communications" => this.social_and_environmental_profile.communications.barriers_to_communications,
         "social_and_environmental_profile/social_or_emotional_stress/evidence_of_social_or_emotional_stress" => this.social_and_environmental_profile.social_or_emotional_stress.evidence_of_social_or_emotional_stress,
         "social_and_environmental_profile/health_care_system/reasons_for_missed_appointments" => this.social_and_environmental_profile.health_care_system.reasons_for_missed_appointments,
         "mental_health_profile/mental_health_conditions_prior_to_the_most_recent_pregnancy" => this.mental_health_profile.mental_health_conditions_prior_to_the_most_recent_pregnancy,
         "mental_health_profile/mental_health_conditions_during_the_most_recent_pregnancy" => this.mental_health_profile.mental_health_conditions_during_the_most_recent_pregnancy,
         "mental_health_profile/mental_health_conditions_after_the_most_recent_pregnancy" => this.mental_health_profile.mental_health_conditions_after_the_most_recent_pregnancy,

            _ => null
        };
        
        return result;
    }

    
    public List<string>? get_list_of_string(string path)
    {
        List<string>? result = path.ToLower() switch
        {

            _ => null
        };
        
        return result;
    }

    public DateTime? get_datetime(string path)
    {
        DateTime? result = path.ToLower() switch
        {

            _ => null
        };
        
        return result;
    }


    public DateOnly? get_date_only(string path)
    {
        DateOnly? result = path.ToLower() switch
        {

            _ => null
        };
        
        return result;
    }


        public TimeOnly? get_time_only(string path)
    {
        TimeOnly? result = path.ToLower() switch
        {

            _ => null
        };
        
        return result;
    }


}