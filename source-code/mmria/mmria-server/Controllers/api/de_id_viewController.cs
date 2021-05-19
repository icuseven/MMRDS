using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using mmria.common;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server
{
    [Authorize(Roles  = "committee_member")]
    [Route("api/[controller]")]
	public class de_id_viewController: ControllerBase
	{
 
        delegate bool is_valid_predicate(mmria.common.model.couchdb.case_view_item item);

        List<is_valid_predicate> all_predicate_list = new List<is_valid_predicate>();
        List<is_valid_predicate> any_predicate_list = new List<is_valid_predicate>();
        delegate is_valid_predicate create_predicate_delegate
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        );
        
        is_valid_predicate create_predicate_by_date_created
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;
            
            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.date_created.ToString(), search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_date_last_updated
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.date_last_updated.ToString(), search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_last_name
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key != null)
            {
               

                is_valid_predicate f = (mmria.common.model.couchdb.case_view_item item) => 
                {
                    bool result = false;
                    if(is_matching_search_text(item.value.last_name, search_key))
                    {
                        result = true;
                    }

                    return result;
                };

                if(field_selection == "all")
                    any_predicate_list.Add(f);



                if(field_selection == "by_last_name")
                    all_predicate_list.Add(f);
            }

            
            return (mmria.common.model.couchdb.case_view_item item) => true;

        }
        is_valid_predicate create_predicate_by_first_name
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;


            if(search_key != null )
            {
                is_valid_predicate f = (mmria.common.model.couchdb.case_view_item item) => 
                    {
                        bool result = false;
                        if(is_matching_search_text(item.value.first_name, search_key))
                        {
                            result = true;
                        }

                        return result;
                    };
                if (field_selection == "all")
                {
                    any_predicate_list.Add(f);
                }

                if(field_selection == "by_first_name")
                {
                    all_predicate_list.Add(f);
                }

                return f;
            }

            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_middle_name
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.middle_name, search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_year_of_death
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) => 
            {
                bool result = false;
                if(is_matching_search_text(item.value.date_of_death_year.ToString(), search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_month_of_death
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) => 
            {
                bool result = false;
                if(is_matching_search_text(item.value.date_of_death_month.ToString(), search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_committee_review_date
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) => 
            {
                bool result = false;
                if(is_matching_search_text(item.value.review_date_actual.ToString(), search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_created_by
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.created_by, search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_last_updated_by
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.last_updated_by, search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_state_of_death
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.state_of_death, search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_date_last_checked_out
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_last_checked_out_by
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) =>
            {
                bool result = false;
                if(is_matching_search_text(item.value.last_checked_out_by, search_key))
                {
                    result = true;
                }

                return result;
            };
        }
        is_valid_predicate create_predicate_by_case_status
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {

            if(case_status != "all")
            {
                is_valid_predicate f = (mmria.common.model.couchdb.case_view_item item) =>
                {
                    bool result = false;
                    if(item.value.case_status.HasValue ? item.value.case_status.Value.ToString() == case_status : string.IsNullOrWhiteSpace(case_status))
                    {
                        result = true;
                    }

                    return result;
                };

                all_predicate_list.Add(f);

                
                return f;
            }
                

            return (mmria.common.model.couchdb.case_view_item item) => false;
        }
        is_valid_predicate create_predicate_by_agency_case_id
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {

            if(search_key != null)
            {

                is_valid_predicate f = (mmria.common.model.couchdb.case_view_item item) =>
                {
                    bool result = false;
                    if(is_matching_search_text(item.value.agency_case_id, search_key))
                    {
                        result = true;
                    }

                    return result;
                };

                if (field_selection == "all")
                    any_predicate_list.Add(f);

                if (field_selection == "by_agency_case_id")
                    all_predicate_list.Add(f);

            }

            return (mmria.common.model.couchdb.case_view_item item) => true;
        }
        is_valid_predicate create_predicate_by_pregnancy_relatedness
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {

            if(pregnancy_relatedness != "all")
            {
                is_valid_predicate f = (mmria.common.model.couchdb.case_view_item item) =>
                {
                    bool result = false;
                    if(item.value.pregnancy_relatedness.HasValue ? item.value.pregnancy_relatedness.Value.ToString() == pregnancy_relatedness : string.IsNullOrWhiteSpace(pregnancy_relatedness))
                    {
                        result = true;
                    }

                    return result;
                };

                all_predicate_list.Add(f);

                return f;
            }

            return (mmria.common.model.couchdb.case_view_item item) => false;
        }
        is_valid_predicate create_predicate_by_host_state
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key == null && field_selection == "all")
                return (mmria.common.model.couchdb.case_view_item item) => true;

            return (mmria.common.model.couchdb.case_view_item item) => false;
        }

        is_valid_predicate create_predicate_by_record_id
        (
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            if(search_key != null)
            {
                is_valid_predicate f = (mmria.common.model.couchdb.case_view_item item) =>
                {
                    bool result = false;
                    if(is_matching_search_text(item.value.record_id, search_key))
                    {
                        result = true;
                    }

                    return result;
                };

                if(field_selection == "all")
                        any_predicate_list.Add(f);

                if(field_selection == "by_record_id")
                    all_predicate_list.Add(f);

                
                return f;
            }

            return (mmria.common.model.couchdb.case_view_item item) => false;
        }

        is_valid_predicate create_predicate_by_jurisdiction(HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> ctx)
        {
            is_valid_predicate f = (mmria.common.model.couchdb.case_view_item cvi) => {
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

            all_predicate_list.Add(f);

            return f;
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

        is_valid_predicate is_valid_record_id;

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

            string sort_view = sort.ToLower ();

            if (! sort_list.Contains(sort_view))
            {
                sort_view = "by_date_created";
            }

			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append ($"{Program.config_couchdb_url}/{Program.db_prefix}de_id/_design/sortable/_view/{sort_view}?");


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
                    request_builder.Append ($"&limit={30000}");

                    if (descending) 
                    {
                        request_builder.Append ("&descending=true");
                    }
                }

                string request_string = request_builder.ToString();
                var case_view_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
                string responseFromServer = await case_view_curl.executeAsync();

                create_predicates
                (
                    jurisdiction_hashset,
                    search_key?.ToLower ().Trim (new char [] { '"' }),
                    case_status,
                    field_selection,
                    pregnancy_relatedness
                );

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);
                mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                result.offset = case_view_response.offset;
                result.total_rows = case_view_response.total_rows;
                
                var data = case_view_response.rows
                    .Where
                    (
                        cvi => 
                            all_predicate_list.All( f => f(cvi)) &&
                            (
                                any_predicate_list.Count == 0 ||
                                any_predicate_list.Any( f => f(cvi)) 
                            )
                        
                    );

                


                result.total_rows = data.Count();
                result.rows =  data.Skip (skip).Take (take).ToList ();
            
    
                return result;
                
            
                
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


        void create_predicates
        (
            HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> ctx,
            string search_key,
            string case_status,
            string field_selection,
            string pregnancy_relatedness
        )
        {
            is_valid_jurisdition = create_predicate_by_jurisdiction(ctx);
            is_valid_date_created = create_predicate_by_date_created(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_date_last_updated = create_predicate_by_date_last_updated(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_last_name = create_predicate_by_last_name(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_first_name = create_predicate_by_first_name(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_middle_name = create_predicate_by_middle_name(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_year_of_death = create_predicate_by_year_of_death(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_month_of_death = create_predicate_by_month_of_death(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_committee_review_date = create_predicate_by_committee_review_date(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_created_by = create_predicate_by_created_by(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_last_updated_by = create_predicate_by_last_updated_by(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_state_of_death = create_predicate_by_state_of_death(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_date_last_checked_out = create_predicate_by_date_last_checked_out(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_last_checked_out_by = create_predicate_by_last_checked_out_by(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_case_status = create_predicate_by_case_status(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_agency_case_id = create_predicate_by_agency_case_id(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_pregnancy_relatedness = create_predicate_by_pregnancy_relatedness(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_host_state = create_predicate_by_host_state(search_key, case_status, field_selection, pregnancy_relatedness);
            is_valid_record_id = create_predicate_by_record_id(search_key, case_status, field_selection, pregnancy_relatedness);
        }
    }
}

