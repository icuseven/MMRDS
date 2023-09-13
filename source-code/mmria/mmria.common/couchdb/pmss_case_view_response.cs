using System;

namespace mmria.common.model.couchdb;

public sealed class pmss_case_view_sortable_item
{
    public pmss_case_view_sortable_item () { }

    public int? date_of_death_year{ get; set; }
    public int? date_of_death_month{ get; set; }

    public DateTime? date_created { get; set; }
    public string created_by{ get; set; }
    public DateTime? date_last_updated{ get; set; }
    public string last_updated_by{ get; set; }

    public DateTime? date_last_checked_out{ get; set; }
    public string last_checked_out_by{ get; set; }

    public string case_folder {get; set;}

    public DateTime? case_locked_date { get; set; }

    public string host_state{ get; set; }
  
    public string jurisdiction{ get; set; }
    public int? track_year{ get; set; }
    public string pmssno{ get; set; }
    public string med_coder_check{ get; set; }
    public string med_dir_check{ get; set; }
    public string death_certificate_number{ get; set; }
    public string status{ get; set; }
    public DateTime? dod{ get; set; }
    public string month_of_death{ get; set; }
    public string day_of_death{ get; set; }
    public string year_of_death{ get; set; }
    public DateTime? dob{ get; set; }
    public string month_of_birth{ get; set; }
    public string day_of_birth{ get; set; }
    public string year_of_birth{ get; set; }
    public string agreement_status{ get; set; }
    public string version{ get; set; }

    public string residence_zip {get;set;}

    /*

app/tracking/admin_info/pmssno           PMSS#
app/tracking/death_certificate_number       Death certificate number
app/tracking/date_of_death/dod           Date of Death (calculated)
app/demographic/date_of_birth/dob       Date of Birth (calculated)
app/tracking/q9/reszip               Zip code of residence
app/demographic/mage               Maternal age at Death
app/ije_dc/cause_details/manner_dc       Manner
app/ije_dc/cause_details/cod1a_dc       Cause of Death Part I Line A
app/ije_dc/cause_details/cod1b_dc       Cause of Death Part I Line B
app/ije_dc/cause_details/cod1c_dc       Cause of Death Part I Line C
app/ije_dc/cause_details/cod1d_dc       Cause of Death Part I Line D
app/ije_dc/cause_details/othercondition_dc Cause of Death Part II    

 
9
CURRENT Picklists on Line-Listing Summary Page
-----------------------------------------------------------------------------------
app/tracking/admin_info/jurisdiction          Jurisdiction    
app/tracking/admin_info/track_year          Year of Death
app/tracking/admin_info/status         Status    
app/cause_of_death/class           Classification

*/

}


public sealed class pmss_case_view_item
{
    public pmss_case_view_item(){}

    public string id { get; set; } //": "16e458537602f5ef2a710089dffd9453",
    public string key { get; set; } //": "16e458537602f5ef2a710089dffd9453",
    public pmss_case_view_sortable_item value {  get; set; }

}

public sealed class pmss_case_view_response
{
    public pmss_case_view_response () 
    {
        this.rows = new System.Collections.Generic.List<pmss_case_view_item> ();
    }

    public pmss_case_view_response 
    (
        int p_offset,
        System.Collections.Generic.List<pmss_case_view_item> p_rows,
        int p_total_rows 
    ) 
    {
        this.offset = p_offset;
        this.rows = p_rows;
        this.total_rows = p_total_rows;
    }


    public int offset { get; set; } //": 0,
    public System.Collections.Generic.List<pmss_case_view_item> rows { get; set; }
    public int total_rows { get; set; } 
}


