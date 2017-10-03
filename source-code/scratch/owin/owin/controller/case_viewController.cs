using System;
using System.Collections.Generic;
using System.Linq;

using System.Web.Http;
using System.Dynamic;
using mmria.common.model;

namespace mmria.server
{
	public class case_viewController: ApiController 
	{


        // GET api/values 
        //public IEnumerable<master_record> Get() 
        public mmria.common.model.couchdb.case_view_response Get
        (
            int skip = 0,
            int take = 25,
            string sort = "by_date_created",
            string search_key = null,
            bool descending = false
        ) 
		{
            /*
             * 
             * http://localhost:5984/mmrds/_design/sortable/_view/conflicts
             * 
by_date_created
by_date_last_updated
by_last_name
by_first_name
by_middle_name
by_year_of_death
by_month_of_death
by_committe_review_date
by_created_by
by_last_updated_by
by_state_of_death


*/

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
                case "by_committe_review_date":
                case "by_created_by":
                case "by_last_updated_by":
                case "by_state_of_death":
                    break;

                default:
                    sort_view = "by_date_created";
                break;
            }



			try
			{
                System.Text.StringBuilder request_builder = new System.Text.StringBuilder ();
                request_builder.Append (Program.config_couchdb_url);
                request_builder.Append ($"/mmrds/_design/sortable/_view/{sort_view}?");


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
				System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(request_string));

				request.PreAuthenticate = false;


				if(this.Request.Headers.Contains("Cookie") && this.Request.Headers.GetValues("Cookie").Count() > 0)
				{
					string[] cookie_set = this.Request.Headers.GetValues("Cookie").First().Split(';');
					for(int i = 0; i < cookie_set.Length; i++)
					{
						string[] auth_session_token = cookie_set[i].Split('=');
						if(auth_session_token[0].Trim() == "AuthSession")
						{
							request.Headers.Add("Cookie", "AuthSession=" + auth_session_token[1]);
							request.Headers.Add("X-CouchDB-WWW-Authenticate", auth_session_token[1]);
							break;
						}
					}
				}



				System.Net.WebResponse response = (System.Net.HttpWebResponse)request.GetResponse();
				System.IO.Stream dataStream = response.GetResponseStream ();
				System.IO.StreamReader reader = new System.IO.StreamReader (dataStream);
				string responseFromServer = reader.ReadToEnd ();

                mmria.common.model.couchdb.case_view_response case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);

                if (string.IsNullOrWhiteSpace (search_key)) 
                {
                    return case_view_response;
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
                        if (cvi.value.first_name != null && cvi.value.first_name.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            add_item = true;
                        }

                        if (cvi.value.middle_name != null && cvi.value.middle_name.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            add_item = true;
                        }

                        if(cvi.value.last_name != null && cvi.value.last_name.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1 )
                        {
                            add_item = true;
                        }

                        if(cvi.value.record_id != null && cvi.value.record_id.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            add_item = true;
                        }

                        if(cvi.value.agency_case_id != null && cvi.value.agency_case_id.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1 )
                        {
                            add_item = true;
                        }

                        if(cvi.value.created_by != null && cvi.value.created_by.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            add_item = true;
                        }

                        if(cvi.value.last_updated_by != null && cvi.value.last_updated_by.IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            add_item = true;
                        }

                        if(cvi.value.date_of_death_month != null && cvi.value.date_of_death_month.HasValue && cvi.value.date_of_death_month.Value.ToString ().IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1)
                        {
                            add_item = true;
                        }
                        if(cvi.value.date_of_death_year != null && cvi.value.date_of_death_year.HasValue  && cvi.value.date_of_death_year.Value.ToString ().IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1 )
                        {
                            add_item = true;
                        }

                        if (cvi.value.date_of_committee_review != null && cvi.value.date_of_committee_review.HasValue && cvi.value.date_of_committee_review.Value.ToString ().IndexOf (key_compare, StringComparison.OrdinalIgnoreCase) > -1) 
                        {
                            add_item = true;
                        }

                        if(add_item) result.rows.Add (cvi);
                        
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

	} 
}

