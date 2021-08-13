using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
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
        public async Task<IActionResult> Index(System.Threading.CancellationToken cancellationToken, string p_id)
        {

/*
            var request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}audit/_design/sortable/_view/by_case_id?skip=0&take=250000";

            var audit_view_curl = new cURL("GET",null,request_string,null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = await audit_view_curl.executeAsync();

            cancellationToken.ThrowIfCancellationRequested();

            var view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.view_response<mmria.common.model.couchdb.AuditViewResponseItem>>(responseFromServer);
*/
            var request_string = $"{Program.config_couchdb_url}/{Program.db_prefix}audit/_all_docs?include_docs=true";
            var audit_view_curl = new cURL("GET",null,request_string,null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = await audit_view_curl.executeAsync();

            cancellationToken.ThrowIfCancellationRequested();

            var view_response = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.get_response_header<mmria.common.model.couchdb.Change_Stack>>(responseFromServer);

            List<mmria.common.model.couchdb.Change_Stack> result = new();

            foreach(var item in view_response.rows)
            {
                if(item.doc.items.Count > 0 && item.doc.case_id == p_id)
                {
                    result.Add(item.doc);
                }
            }
            //

            return View();
        }

    }
}