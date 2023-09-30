using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using  mmria.pmss.server.extension;

namespace mmria.pmss.server.Controllers;
    
[Authorize(Roles = "installation_admin,jurisdiction_admin")]
public sealed class _usersController : Controller
{
    mmria.common.couchdb.OverridableConfiguration configuration;
    common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;

    public _usersController
    ( 
        IHttpContextAccessor httpContextAccessor,
        mmria.common.couchdb.OverridableConfiguration p_configuration
    )
    {
         configuration = p_configuration;

        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();

        db_config = configuration.GetDBConfig(host_prefix);
    }
    public IActionResult Index()
    {
        return View();
    }


    public IActionResult FormManager()
    {
        return View();
    }

    public async Task<JsonResult> GetFormAccess()
    {
        var result = new FormAccessSpecification();

        string metadata_url = db_config.Get_Prefix_DB_Url($"jurisdiction/form-access-list");
        cURL document_curl = new cURL ("GET", null, metadata_url, null, db_config.user_name, db_config.user_value);
        
        string save_response_from_server = null;
        try
        {
            save_response_from_server = await document_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<FormAccessSpecification>(save_response_from_server);
        }
        catch(Exception ex)
        {
            //result.error_description = ex.ToString();
            Console.WriteLine(ex);
        }

        return Json(result);

    }


    public async Task<JsonResult> SetFormAccess
    (
        [FromBody] FormAccessSpecification request
    )
    {

        mmria.common.model.couchdb.document_put_response result = null;

        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
        settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
        var object_string = Newtonsoft.Json.JsonConvert.SerializeObject(request, settings);

        string metadata_url = db_config.Get_Prefix_DB_Url($"jurisdiction/form-access-list");
        cURL document_curl = new cURL ("PUT", null, metadata_url, object_string,db_config.user_name, db_config.user_value);
        
        string save_response_from_server = null;
        try
        {
            save_response_from_server = await document_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(save_response_from_server);
        }
        catch(Exception ex)
        {
            result.error_description = ex.ToString();
            Console.WriteLine(ex);
        }

        return Json(result);

    }

    public sealed class FormAccess
    {
        public FormAccess(){}

        public string form_path { get; set; }
        public string abstractor { get; set; }
        public string analyst { get; set; }
        public string committee_member { get; set; }
        public string vital_records_office { get; set; }
    }

    public sealed class FormAccessSpecification
    {

        public FormAccessSpecification()
        {
            access_list = new List<FormAccess>();
        }

        public string _id { get; set;}
        public string _rev { get; set; }
        public string data_type { get; } = "form-access-specification";

        public DateTime date_created { get; set; } 
        public string created_by { get; set; } 
        public DateTime date_last_updated { get; set; } 
        public string last_updated_by { get; set; } 

        public List<FormAccess> access_list { get; set;}
    }

}
