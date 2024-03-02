
using System;
using System.Collections.Generic;

namespace mmria.case_version.v1;

public sealed partial class mmria_case
{


    public string? get_string(string path)
    {
        string? result = path.ToLower() switch
        {
            "_id" => this._id,
            "_rev"=> this._rev,
            "addquarter" => this.addquarter,
            "cmpquarter" => this.cmpquarter,
            "version" => this.version,
            "created_by" => this.created_by,
            "last_updated_by" => this.last_updated_by,
            "host_state" => this.host_state,
            
            "home_record/first_name" => home_record.first_name,
            "home_record/middle_name" => home_record.middle_name,
            "home_record/last_name" => home_record.last_name,
            "home_record/state_of_death_record" => home_record.state_of_death_record,
            "home_record/record_id" => home_record.record_id,
            "home_record/agency_case_id" => home_record.agency_case_id,
            "home_record/specify_other_multiple_sources" => home_record.specify_other_multiple_sources,


            _ => null
        };
        


        return result;
    }

    public double? get_double(string path)
    {
        double? result = path.ToLower() switch
        {
            "home_record/date_of_death/month" => this.home_record.date_of_death.month,
            "home_record/date_of_death/day"=> this.home_record.date_of_death.day,
            "home_record/date_of_death/year" => this.home_record.date_of_death.year,
            
            _ => null
        };
        
        return result;
    }

    public List<double>? get_list_of_double(string path)
    {
        List<double>? result = path.ToLower() switch
        {
            "home_record.how_was_this_death_identified" => this.home_record.how_was_this_death_identified,

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
            "date_created" => this.date_created,
            "date_last_updated"=> this.date_last_updated,
            "date_last_checked_out" => this.date_last_checked_out,
            _ => null
        };
        
        return result;
    }

    public object? get_form(string path)
    {
        object? result = path.ToLower() switch
        {
            "home_record" => this.home_record,
            "death_certificate"=> this.death_certificate,
            "birth_fetal_death_certificate_parent" => this.birth_fetal_death_certificate_parent,
            "birth_certificate_infant_fetal_section" => this.birth_certificate_infant_fetal_section,
            "autopsy_report" => this.autopsy_report,
            "case_narrative"  => this.case_narrative,
            "committee_review" => this.committee_review,
            "cvs" => this.cvs,
            "data_migration_history" => this.data_migration_history,
            "er_visit_and_hospital_medical_records" => this.er_visit_and_hospital_medical_records,
            "mental_health_profile" => this.mental_health_profile,
            "informant_interviews" => this.informant_interviews,
            "medical_transport" => this.medical_transport,
            "other_medical_office_visits" => this.other_medical_office_visits,
            "prenatal" => this.prenatal,
            "social_and_environmental_profile" => this.social_and_environmental_profile,


            _ => null
        };
        
        return result;
    }

}