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


        // GET api/values 
        [HttpGet]
        public async Task<mmria.common.model.couchdb.case_view_response> Get
        (
            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false,
            string case_status = "all"
        ) 
		{
            /*
             * 
             * http://localhost:5984/de_id/_design/sortable/_view/conflicts
             * 
by_date_created
by_date_last_updated
by_last_name
by_first_name
by_middle_name
by_year_of_death
by_month_of_death
by_committee_review_date
by_created_by
by_last_updated_by
by_state_of_death


*/
            var jurisdiction_hashset = mmria.server.util.authorization.get_current_jurisdiction_id_set_for(User);
            
            if(jurisdiction_hashset.Contains(("/", mmria.server.util.ResourceRightEnum.ReadDeidentifiedCase)))
            {
                return await GetRoot
                (
                    skip,
                    take,
                    sort,
                    search_key,
                    descending,
                    case_status,
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
                    jurisdiction_hashset
                );
            }
        }

        private async Task<mmria.common.model.couchdb.case_view_response> GetRoot
        (
            int skip,
            int take,
            string sort,
            string search_key,
            bool descending,
            string case_status,
            HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> jurisdiction_hashset

        )
        {

            string sort_view = sort.ToLower ();
            switch (sort_view)
            {
                case "by_date_created":
                case "by_date_last_updated":
                case "by_last_name":
                case "by_first_name":
                case "by_middle_name":
                case "by_year_of_death":
                case "by_month_of_death":
                case "by_committee_review_date":
                case "by_created_by":
                case "by_last_updated_by":
                case "by_state_of_death":
                case "by_case_status":
                    break;

                default:
                    sort_view = "by_date_created";
                break;
            }



			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/{Program.db_prefix}de_id/_design/sortable/_view/{sort_view}?");


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

                var request_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
				string responseFromServer = await request_curl.executeAsync();

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
                        int add_count = 0;

                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);

                            if(cvi.value.jurisdiction_id == null)
                            {
                                cvi.value.jurisdiction_id = "/";
                            }

                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadDeidentifiedCase)
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

                        if(add_item && is_jurisdiction_ok)
                        {
                           result.rows.Add (cvi);
                           add_count += 1;
                        } 
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



                        bool is_jurisdiction_ok = false;
                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);
                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadDeidentifiedCase)
                            {
                                is_jurisdiction_ok = true;
                                break;
                            }
                        }

                        if(add_item && is_jurisdiction_ok) result.rows.Add (cvi);
                        
                      }

                    result.total_rows = result.rows.Count;
                    result.rows =  result.rows.Skip (skip).Take (take).ToList ();

                    return result;
                }


				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		} 
        private bool is_matching_search_text(string p_val1, string p_val2)
        {
            var result = false;

            if 
            (
                !string.IsNullOrWhiteSpace(p_val1) && 
                p_val1.Length > 3 &&
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


        private async Task<mmria.common.model.couchdb.case_view_response> GetSub
        (
            int skip,
            int take,
            string sort,
            string search_key,
            bool descending,
            string case_status,
            HashSet<(string jurisdiction_id, mmria.server.util.ResourceRightEnum ResourceRight)> jurisdiction_hashset

        )
        {

            string sort_view = sort.ToLower ();
            switch (sort_view)
            {
                case "by_date_created":
                case "by_date_last_updated":
                case "by_last_name":
                case "by_first_name":
                case "by_middle_name":
                case "by_year_of_death":
                case "by_month_of_death":
                case "by_committee_review_date":
                case "by_created_by":
                case "by_last_updated_by":
                case "by_state_of_death":
                case "by_case_status":
                    break;

                default:
                    sort_view = "by_date_created";
                break;
            }



			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/{Program.db_prefix}de_id/_design/sortable/_view/{sort_view}?");


                if (string.IsNullOrWhiteSpace (search_key))
                {
                    /*
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
                     */

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

                var request_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
				string responseFromServer = await request_curl.executeAsync();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                var temp = new List<mmria.common.model.couchdb.case_view_item>();

                if (string.IsNullOrWhiteSpace (search_key)) 
                {
                    mmria.common.model.couchdb.case_view_response result = new mmria.common.model.couchdb.case_view_response();
                    result.offset = case_view_response.offset;
                    result.total_rows = case_view_response.total_rows;

                    foreach(mmria.common.model.couchdb.case_view_item cvi in case_view_response.rows)
                    {
                        bool is_jurisdiction_ok = false;
                        bool add_item = false;

                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);

                            if(cvi.value.jurisdiction_id == null)
                            {
                                cvi.value.jurisdiction_id = "/";
                            }

                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadDeidentifiedCase)
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

                        if(is_jurisdiction_ok && add_item) temp.Add (cvi);
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

                        bool is_jurisdiction_ok = false;
                        foreach(var jurisdiction_item in jurisdiction_hashset)
                        {
                            var regex = new System.Text.RegularExpressions.Regex("^" + @jurisdiction_item.jurisdiction_id);
                            if(regex.IsMatch(cvi.value.jurisdiction_id) && jurisdiction_item.ResourceRight == mmria.server.util.ResourceRightEnum.ReadDeidentifiedCase)
                            {
                                is_jurisdiction_ok = true;
                                break;
                            }
                        }

                        if(add_item && is_jurisdiction_ok) temp.Add (cvi);
                        
                      }

                    //result.total_rows = result.rows.Count;
                    result.total_rows = temp.Count;
                    result.rows = temp.Skip(skip).Take(take).ToList();

                    return result;
                }


				/*
		< HTTP/1.1 200 OK
		< Set-Cookie: AuthSession=YW5uYTo0QUIzOTdFQjrC4ipN-D-53hw1sJepVzcVxnriEw;
		< Version=1; Path=/; HttpOnly
		> ...
		<
		{"ok":true}*/



			}
			catch(Exception ex)
			{
				Console.WriteLine (ex);

			} 

			return null;
		} 

	} 
}

