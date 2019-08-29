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
    [Authorize(Roles  = "form_designer")]
    [Route("api/[controller]")]
	public class migration_plan_viewController: ControllerBase
	{
        [HttpGet]
        public async Task<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.migration_plan>> Get
        (
            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
        ) 
		{
            string sort_view = sort.ToLower ();
            switch (sort_view)
            {
                    case "by_date_created":
                    case "by_created_by":
                    case "by_date_last_updated":
                    case "by_last_updated_by":
                    case "by_name":
                    case "by_description":
                    break;

                default:
                    sort_view = "by_date_created";
                break;
            }

			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/metadata/_design/sortable/_view/{sort_view}?");
                //http://localhost:5984/metadata/_design/sortable/_view/by_date_last_updated

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


				var migration_plan_curl = new cURL("GET", null, request_builder.ToString(), null, Program.config_timer_user_name, Program.config_timer_value);
				string response_from_server = await migration_plan_curl.executeAsync ();

                var migration_plan_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.migration_plan>>(response_from_server);

                if (string.IsNullOrWhiteSpace (search_key)) 
                {
                    return migration_plan_view_response;
                } 
                else 
                {
                    string key_compare = search_key.ToLower ().Trim (new char [] { '"' });

                    var result = new mmria.common.model.couchdb.get_sortable_view_reponse_header<mmria.common.model.couchdb.migration_plan>();
                    result.offset = migration_plan_view_response.offset;
                    result.total_rows = migration_plan_view_response.total_rows;

                    foreach(mmria.common.model.couchdb.get_sortable_view_response_item<mmria.common.model.couchdb.migration_plan> cvi in migration_plan_view_response.rows)
                    {
                        bool add_item = false;

                        if(cvi.value.name != null && cvi.value.name.Equals(key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }

                        if(cvi.value.description != null && cvi.value.description.Equals (key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }

                        if(cvi.value.date_created != null && cvi.value.date_created.HasValue)
                        {
                            if(DateTime.TryParse(key_compare, out DateTime is_date))
                            {
                                if(cvi.value.date_created.Value == is_date)
                                {
                                    add_item = true;
                                }
                            }
                        }

                        if(cvi.value.date_last_updated != null && cvi.value.date_last_updated.HasValue)
                        {
                            if(DateTime.TryParse(key_compare, out DateTime is_date))
                            {
                                if(cvi.value.date_last_updated.Value == is_date)
                                {
                                    add_item = true;
                                }
                            }
                        }

                        if(cvi.value.created_by != null && cvi.value.created_by.Equals (key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }

                        if(cvi.value.last_updated_by != null && cvi.value.last_updated_by.Equals (key_compare, StringComparison.OrdinalIgnoreCase))
                        {
                            add_item = true;
                        }


                        if(add_item) result.rows.Add (cvi);
                       
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

	} 
}

