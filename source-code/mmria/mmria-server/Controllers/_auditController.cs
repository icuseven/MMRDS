using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Linq;
using mmria.common.functional;
using mmria.server;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    
    [Authorize(Roles = "abstractor")]
    public class _auditController : Controller
    {
        IConfiguration configuration;
        public _auditController(IConfiguration p_configuration)
        {
            configuration = p_configuration;
        }

        [Route("_audit/{p_id}")]
        public async Task<IActionResult> Index(System.Threading.CancellationToken cancellationToken, string p_id, bool showAll = false)
        {


            var case_view_request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}mmrds/_design/sortable/_view/by_date_created?skip=0&take=250000";

            var case_view_curl = new cURL("GET",null,case_view_request_string,null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = await case_view_curl.executeAsync();

            cancellationToken.ThrowIfCancellationRequested();

            var case_view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.case_view_response>(responseFromServer);


            mmria.common.model.couchdb.case_view_sortable_item case_view_item = 
                case_view_response.rows.Where(i=> i.id == p_id).FirstOrDefault().value;


            var request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}audit/_all_docs?include_docs=true";
            var audit_view_curl = new cURL("GET",null,request_string,null, Program.config_timer_user_name, Program.config_timer_value);
            responseFromServer = await audit_view_curl.executeAsync();

            cancellationToken.ThrowIfCancellationRequested();

            var view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.Change_Stack>>(responseFromServer);

            List<mmria.common.model.couchdb.Change_Stack> result = new();

            foreach(var item in view_response.rows)
            {
                item.doc.items.Sort(new Change_Stack_Item_DescendingDate());
                if(showAll)
                {
                    result.Add(item.doc);
                }
                else if(item.doc.items.Count > 0 && item.doc.case_id == p_id)
                {
                    result.Add(item.doc);
                }
            }
            
            result.Sort(new Change_Stack_DescendingDate());
            return View((case_view_item, result));
        }

        public class Change_Stack_DescendingDate : IComparer<mmria.common.model.couchdb.Change_Stack> 
        {
            public int Compare(mmria.common.model.couchdb.Change_Stack x, mmria.common.model.couchdb.Change_Stack y)
            {
                // Compare x and y in reverse order.
                return y.date_created.Value.CompareTo(x.date_created.Value);
            }
        }

        public class Change_Stack_Item_DescendingDate : IComparer<mmria.common.model.couchdb.Change_Stack_Item> 
        {
            public int Compare(mmria.common.model.couchdb.Change_Stack_Item x, mmria.common.model.couchdb.Change_Stack_Item y)
            {
                // Compare x and y in reverse order.
                return y.date_created.Value.CompareTo(x.date_created.Value);
            }
        }

    }
}