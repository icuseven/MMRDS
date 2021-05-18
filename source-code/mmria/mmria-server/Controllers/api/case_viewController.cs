using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using mmria.common.functional;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace mmria.server
{
    [Authorize(Roles  = "abstractor, data_analyst")]
    [Route("api/[controller]")]
	public class case_viewController: ControllerBase 
	{   
        delegate bool is_valid_predicate(mmria.common.model.couchdb.case_view_item item);
        delegate is_valid_predicate create_predicate_delegate
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        );
        
        is_valid_predicate create_predicate_by_date_created
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_date_last_updated
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_last_name
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_first_name
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_middle_name
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_year_of_death
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_month_of_death
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_committee_review_date
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_created_by
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_last_updated_by
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_state_of_death
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_date_last_checked_out
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_last_checked_out_by
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_case_status
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_agency_case_id
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_pregnancy_relatedness
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_host_state
        (
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }


        is_valid_predicate create_predicate_by_jurisdiction(HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> ctx)
        {
            return (mmria.common.model.couchdb.case_view_item cvi) => {
                bool result = false;
                if(cvi.value.jurisdiction_id == null)
                {
                    cvi.value.jurisdiction_id = "/";
                }

                foreach(var jurisdiction_item in ctx)
                {
                    var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);


                    if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadCase)
                    {
                        result = true;
                        break;
                    }
                }
                return result;
            };
        }
        
        is_valid_predicate is_valid_date_created;
        
        is_valid_predicate is_valid_date_last_updated;
        is_valid_predicate is_valid_last_name;
        is_valid_predicate is_valid_first_name;
        is_valid_predicate is_valid_middle_name;
        is_valid_predicate is_valid_year_of_death;
        is_valid_predicate is_valid_month_of_death;
        is_valid_predicate is_valid_committee_review_date;
        is_valid_predicate is_valid_created_by;
        is_valid_predicate is_valid_last_updated_by;
        is_valid_predicate is_valid_state_of_death;
        is_valid_predicate is_valid_date_last_checked_out;
        is_valid_predicate is_valid_last_checked_out_by;
        is_valid_predicate is_valid_case_status;
        is_valid_predicate is_valid_agency_case_id;
        is_valid_predicate is_valid_pregnancy_relatedness;
        is_valid_predicate is_valid_host_state;

        is_valid_predicate is_valid_jurisdition;

        HashSet<string> sort_list = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "by_date_created",
            "by_date_last_updated",
            "by_last_name",
            "by_first_name",
            "by_middle_name",
            "by_year_of_death",
            "by_month_of_death",
            "by_committee_review_date",
            "by_created_by",
            "by_last_updated_by",
            "by_state_of_death",
            "by_date_last_checked_out",
            "by_last_checked_out_by",
            "by_case_status",
            "by_agency_case_id",
            "by_pregnancy_relatedness",
            "by_host_state"
        };


        [HttpGet]
        public async Task<mmria.common.model.couchdb.case_view_response> Get
        (
            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false,
            string case_status = "all",
            string field_selection = "all",
            string pregnancy_relatedness ="all"
        ) 
		{

            var jurisdiction_hashset = mmria.server.util.authorization.get_current_jurisdiction_id_set_for(User);


            if(jurisdiction_hashset.Contains(("/", mmria.server.util.ResourceRightEnum.ReadCase)))
            {
                return await GetRoot
                (
                    skip,
                    take,
                    sort,
                    search_key,
                    descending,
                    case_status,
                    field_selection,
                    pregnancy_relatedness,
                    jurisdiction_hashset
                );
            }
            else
            {
                return await GetSub
                (
                    skip,
                    take,
                    sort,
                    search_key,
                    descending,
                    case_status,
                    field_selection,
                    pregnancy_relatedness,
                    jurisdiction_hashset
                );
            }

			//return null;
		}


        async Task<mmria.common.model.couchdb.case_view_response> GetRoot
        (
            int skip,
            int take,
            string sort,
            string search_key,
            bool descending,
            string case_status,
            string field_selection,
            string pregnancy_relatedness,
            HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> jurisdiction_hashset
        )
        {
            string sort_view = sort.ToLower ();

            if (! sort_list.Contains(sort_view))
            {
                sort_view = "by_date_created";
            }

			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append ($"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/{sort_view}?");


                if (string.IsNullOrWhiteSpace (search_key))
                {
                    if (skip > -1) 
                    {
                        request_builder.Append ($"skip={skip}");
                    } 
                    else 
                    {

                        request_builder.Append ("skip=0");
                    }

                    if (take > -1) 
                    {
                        request_builder.Append ($"&limit={take}");
                    }

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                } 
                else 
                {
                    request_builder.Append ("skip=0");

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                }

                string request_string = request_builder.ToString();
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_view_curl.executeAsync();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                if (string.IsNullOrWhiteSpace (search_key)) 
                {
                    mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                    result.offset = case_view_response.offset;
                    result.total_rows = case_view_response.total_rows;
                    

                    foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                    {
                        bool is_jurisdiction_ok = false;
                        bool add_item = false;

                        if(cvi.value.jurisdiction_id == null)
                        {
                            cvi.value.jurisdiction_id = "/";
                        }

                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);


                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadCase)
                            {
                                is_jurisdiction_ok = true;
                                break;
                            }
                        }



                        //if(field_selection == "all" || field_selection =="")
                        if (cvi.value.case_status != null && cvi.value.case_status.HasValue) 
                        {
                            switch(case_status.ToLower())
                            {
                                
                                case "9999":
                                case "1":
                                case "2":
                                case "3":
                                case "4":
                                case "5":
                                case "6":
                                    if(cvi.value.case_status.Value.ToString () == case_status)
                                    {
                                        add_item = true;
                                    }
                                    break;
                                case "all":
                                default:
                                     add_item = true;
                                     break;
                            }                                               
                        }

                        if (cvi.value.pregnancy_relatedness != null && cvi.value.pregnancy_relatedness.HasValue) 
                        {
                            switch(pregnancy_relatedness.ToLower())
                            {
                                
                                case "9999":
                                case "0":
                                case "1":
                                case "2":
                                case "99":
                                    if(cvi.value.pregnancy_relatedness.Value.ToString () == pregnancy_relatedness)
                                    {
                                        add_item = true;
                                    }
                                    break;
                                case "all":
                                default:
                                     add_item = true;
                                     break;
                            }                                               
                        }

                        if(add_item && is_jurisdiction_ok) result.rows.Add (cvi);
                    }
                    
                    if(skip == 0 && result.rows.Count < take)
                    {
                        result.total_rows = result.rows.Count;
                    }

                    return result;
                } 
                else 
                {
                    string key_compare = search_key.ToLower ().Trim (new char [] { '"' });

                    mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                    result.offset = case_view_response.offset;
                    result.total_rows = case_view_response.total_rows;

                    foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                    {
                        bool add_item = false;

                        if(is_matching_search_text(cvi.value.first_name, key_compare))
                        {
                            add_item = true;
                        }


                        if(is_matching_search_text(cvi.value.middle_name, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.last_name, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.record_id, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.agency_case_id, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.date_created.ToString(), key_compare))
                        {
                            add_item = true;
                        }


                        if(is_matching_search_text(cvi.value.created_by, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.date_last_updated.ToString(), key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.last_updated_by, key_compare))
                        {
                            add_item = true;
                        }


                        var record_id_regex = new System.Text.RegularExpressions.Regex(@"([a-zA-Z]+-)?\d\d\d\d-\d\d\d\d");
                        if(record_id_regex.Matches(key_compare).Count == 0)
                        {
                            if(cvi.value.date_of_death_month != null && cvi.value.date_of_death_month.HasValue && is_matching_search_text(cvi.value.date_of_death_month.Value.ToString (), key_compare))
                            {
                                add_item = true;
                            }

                            if(cvi.value.date_of_death_year != null && cvi.value.date_of_death_year.HasValue && is_matching_search_text(cvi.value.date_of_death_year.Value.ToString (), key_compare))
                            {
                                add_item = true;
                            }

                            if (cvi.value.date_of_committee_review != null && cvi.value.date_of_committee_review.HasValue && is_matching_search_text(cvi.value.date_of_committee_review.Value.ToString (), key_compare))
                            {
                                add_item = true;
                            }
                        }


                        if (add_item && cvi.value.case_status != null && cvi.value.case_status.HasValue) 
                        {
                            switch(case_status.ToLower())
                            {
                                
                                case "9999":
                                case "1":
                                case "2":
                                case "3":
                                case "4":
                                case "5":
                                case "6":
                                    if(cvi.value.case_status.Value.ToString () == case_status)
                                    {
                                        add_item = true;
                                    }
                                    else
                                    {
                                        add_item = false;
                                    }
                                    break;
                                case "all":
                                default:
                                     add_item = true;
                                     break;
                            }                                               
                        }

                        if (add_item && cvi.value.pregnancy_relatedness != null && cvi.value.pregnancy_relatedness.HasValue) 
                        {
                            switch(pregnancy_relatedness.ToLower())
                            {
                                
                                case "9999":
                                case "0":
                                case "1":
                                case "2":
                                case "99":
                                    if(cvi.value.pregnancy_relatedness.Value.ToString () == pregnancy_relatedness)
                                    {
                                        add_item = true;
                                    }
                                    else
                                    {
                                        add_item = false;
                                    }
                                    break;
                                case "all":
                                default:
                                     add_item = true;
                                     break;
                            }                                               
                        }

                        bool is_jurisdiction_ok = false;
                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);

                            if(cvi.value.jurisdiction_id == null)
                            {
                                cvi.value.jurisdiction_id = "/";
                            }


                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadCase)
                            {
                                is_jurisdiction_ok = true;
                                break;
                            }
                        }

                        if(add_item && is_jurisdiction_ok)
                        {
                             result.rows.Add (cvi);
                        }
                        
                      }


                    result.total_rows = result.rows.Count;
                    result.rows =  result.rows.Skip (skip).Take (take).ToList ();

                    return result;
                }
            
                
            }
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			}


            return null;
        }

        bool is_matching_search_text(string p_val1, string p_val2)
        {
            var result = false;

            if 
            (
                !string.IsNullOrWhiteSpace(p_val1) && 
                p_val1.Length > 2 &&
                (
                    p_val2.IndexOf (p_val1, StringComparison.OrdinalIgnoreCase) > -1 ||
                    p_val1.IndexOf (p_val2, StringComparison.OrdinalIgnoreCase) > -1
                )
            )
            {
                result = true;
            }

            return result;
        }

        async Task<mmria.common.model.couchdb.case_view_response> GetSub
        (
            int skip,
            int take,
            string sort,
            string search_key,
            bool descending,
            string case_status,
            string field_selection,
            string pregnancy_relatedness,
            HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> jurisdiction_hashset
        )
        {
            string sort_view = sort.ToLower ();
            if (! sort_list.Contains(sort_view))
            {
                sort_view = "by_date_created";
            }



			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/{Program.db_prefix}mmrds/_design/sortable/_view/{sort_view}?");


                if (string.IsNullOrWhiteSpace (search_key))
                {
                    
                    if (skip > -1) 
                    {
                        request_builder.Append ($"skip={skip}");
                    } 
                    else 
                    {

                        request_builder.Append ("skip=0");
                    }


                    if (take > -1) 
                    {
                        request_builder.Append ($"&limit={take}");
                    }
                    /**/

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                } 
                else 
                {
                    //request_builder.Append ("skip=0");

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                }

                string request_string = request_builder.ToString();
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_view_curl.executeAsync();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                var temp = new List<mmria.common.model.couchdb.case_view_item>();

                if (string.IsNullOrWhiteSpace (search_key)) 
                {
                    mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                    result.offset = case_view_response.offset;
                    result.total_rows = case_view_response.total_rows;

                    int no_add = 0;
                    foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                    {
                        bool is_jurisdiction_ok = false;
                        bool add_item = false;

                        

                        if(cvi.value.jurisdiction_id == null)
                        {
                            cvi.value.jurisdiction_id = "/";
                        }

                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);


                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadCase)
                            {
                                is_jurisdiction_ok = true;
                                break;
                            }
                        }

                        if (cvi.value.case_status != null && cvi.value.case_status.HasValue) 
                        {
                            switch(case_status.ToLower())
                            {
                                
                                case "9999":
                                case "1":
                                case "2":
                                case "3":
                                case "4":
                                case "5":
                                case "6":
                                    if(cvi.value.case_status.Value.ToString () == case_status)
                                    {
                                        add_item = true;
                                    }
                                    break;
                                case "all":
                                default:
                                     add_item = true;
                                     break;
                            }                                               
                        }

                        if (cvi.value.pregnancy_relatedness != null && cvi.value.pregnancy_relatedness.HasValue) 
                        {
                            switch(pregnancy_relatedness.ToLower())
                            {
                                
                                case "9999":
                                case "0":
                                case "1":
                                case "2":
                                case "99":
                                    if(cvi.value.pregnancy_relatedness.Value.ToString () == pregnancy_relatedness)
                                    {
                                        add_item = true;
                                    }
                                    break;
                                case "all":
                                default:
                                     add_item = true;
                                     break;
                            }                                               
                        }

                        if(is_jurisdiction_ok && add_item)
                        {
                           temp.Add (cvi); 
                        }
                        else
                        {
                            no_add++;
                        }
                    }
                    
                    result.total_rows = temp.Count;
                    result.rows = temp.Skip(skip).Take(take).ToList();



                    return result;
                } 
                else 
                {
                    string key_compare = search_key.ToLower ().Trim (new char [] { '"' });

                    mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                    result.offset = case_view_response.offset;
                    result.total_rows = case_view_response.total_rows;

                    foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                    {
                        bool add_item = false;
                        
                        if(is_matching_search_text(cvi.value.first_name, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.middle_name, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.last_name, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.record_id, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.agency_case_id, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.created_by, key_compare))
                        {
                            add_item = true;
                        }

                        if(is_matching_search_text(cvi.value.last_updated_by, key_compare))
                        {
                            add_item = true;
                        }


                        var record_id_regex = new System.Text.RegularExpressions.Regex(@"([a-zA-Z]+-)?\d\d\d\d-\d\d\d\d");
                        if(record_id_regex.Matches(key_compare).Count == 0)
                        {
                            if(cvi.value.date_of_death_month != null && cvi.value.date_of_death_month.HasValue && is_matching_search_text(cvi.value.date_of_death_month.Value.ToString (), key_compare))
                            {
                                add_item = true;
                            }

                            if(cvi.value.date_of_death_year != null && cvi.value.date_of_death_year.HasValue && is_matching_search_text(cvi.value.date_of_death_year.Value.ToString (), key_compare))
                            {
                                add_item = true;
                            }

                            if (cvi.value.date_of_committee_review != null && cvi.value.date_of_committee_review.HasValue && is_matching_search_text(cvi.value.date_of_committee_review.Value.ToString (), key_compare))
                            {
                                add_item = true;
                            }
                        }
                        if (add_item && cvi.value.case_status != null && cvi.value.case_status.HasValue) 
                        {
                            switch(case_status.ToLower())
                            {
                                
                                case "9999":
                                case "1":
                                case "2":
                                case "3":
                                case "4":
                                case "5":
                                case "6":
                                    if(cvi.value.case_status.Value.ToString () == case_status)
                                    {
                                        add_item = true;
                                    }
                                    break;
                                case "all":
                                default:
                                     //add_item = true;
                                     break;
                            }                                               
                        }


                        if (add_item && cvi.value.pregnancy_relatedness != null && cvi.value.pregnancy_relatedness.HasValue) 
                        {
                            switch(pregnancy_relatedness.ToLower())
                            {
                                
                                case "9999":
                                case "0":
                                case "1":
                                case "2":
                                case "99":
                                    if(cvi.value.pregnancy_relatedness.Value.ToString () == pregnancy_relatedness)
                                    {
                                        add_item = true;
                                    }
                                    break;
                                case "all":
                                default:
                                     //add_item = true;
                                     break;
                            }                                               
                        }

                        bool is_jurisdiction_ok = false;
                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);

                            if(cvi.value.jurisdiction_id == null)
                            {
                                cvi.value.jurisdiction_id = "/";
                            }


                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadCase)
                            {
                                is_jurisdiction_ok = true;
                                break;
                            }
                        }

                        if(add_item && is_jurisdiction_ok) temp.Add (cvi);
                        
                      }


                    result.total_rows = temp.Count;
                    result.rows = temp.Skip(skip).Take(take).ToList();

                    return result;
                }
            }
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

            return null;
        }



        [HttpGet("record-id-list")]
        public async Task<HashSet<string>> GetExistingRecordIds()
        {
            var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase);


            try
            {
                string request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=250000";

                var case_view_curl = new mmria.server.cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_view_curl.executeAsync();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                foreach (mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                {
                    result.Add(cvi.value.record_id);

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return result;
        }

        void create_predicates
        (
            HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> ctx,
            string search_key,
            string case_status,
            string field_selection,
            string by_pregnancy_relatedness
        )
        {
            //is_validcreate_predicate_by_date_created(search_key, case_status, field_selection, by_pregnancy_relatedness) => (mmria.common.model.couchdb.case_view_item) return true;

            is_valid_date_created = create_predicate_by_date_created(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_date_last_updated = create_predicate_by_date_last_updated(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_last_name = create_predicate_by_last_name(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_first_name = create_predicate_by_first_name(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_middle_name = create_predicate_by_middle_name(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_year_of_death = create_predicate_by_year_of_death(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_month_of_death = create_predicate_by_month_of_death(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_committee_review_date = create_predicate_by_committee_review_date(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_created_by = create_predicate_by_created_by(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_last_updated_by = create_predicate_by_last_updated_by(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_state_of_death = create_predicate_by_state_of_death(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_date_last_checked_out = create_predicate_by_date_last_checked_out(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_last_checked_out_by = create_predicate_by_last_checked_out_by(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_case_status = create_predicate_by_case_status(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_agency_case_id = create_predicate_by_agency_case_id(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_pregnancy_relatedness = create_predicate_by_pregnancy_relatedness(search_key, case_status, field_selection, by_pregnancy_relatedness);
            is_valid_host_state = create_predicate_by_host_state(search_key, case_status, field_selection, by_pregnancy_relatedness);

            is_valid_jurisdition = create_predicate_by_jurisdiction(ctx);
        }
	} 
}

