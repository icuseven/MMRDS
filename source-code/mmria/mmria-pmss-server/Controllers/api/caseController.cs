using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Dynamic;
using mmria.common;
using Microsoft.Extensions.Configuration;
using Akka.Actor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using  mmria.pmss.server.extension;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace mmria.pmss.server;


[Route("api/[controller]")]
public sealed class caseController: ControllerBase 
{ 
    ActorSystem _actorSystem;	

    mmria.common.couchdb.OverridableConfiguration configuration;
    common.couchdb.DBConfigurationDetail db_config;
    string host_prefix = null;

    private readonly IAuthorizationService _authorizationService;
    //private readonly IDocumentRepository _documentRepository;

    public caseController
    ( 
        IHttpContextAccessor httpContextAccessor,
        mmria.common.couchdb.OverridableConfiguration p_configuration, 
        ActorSystem actorSystem, 
        IAuthorizationService authorizationService
    )
    {
         configuration = p_configuration;
        _actorSystem = actorSystem;
        _authorizationService = authorizationService;

        host_prefix = httpContextAccessor.HttpContext.Request.Host.GetPrefix();

        db_config = configuration.GetDBConfig(host_prefix);
    }
    
    [Authorize(Roles  = "abstractor, data_analyst")]
    [HttpGet]
    public async Task<System.Dynamic.ExpandoObject> Get(string case_id) 
    { 
        try
        {
            string request_string = db_config.Get_Prefix_DB_Url("mmrds/_all_docs?include_docs=true");

            if (!string.IsNullOrWhiteSpace (case_id)) 
            {
                request_string = db_config.Get_Prefix_DB_Url($"mmrds/{case_id}");
                var case_curl = new mmria.pmss.server.cURL("GET", null, request_string, null, db_config.user_name, db_config.user_value);
                string responseFromServer = await case_curl.executeAsync();

                var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

                if(mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.ReadCase, result))
                {
                    return result;
                }
                else
                {
                    return null;
                }

            } 

        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return null;
    } 





    [Authorize(Roles  = "abstractor")]
    [HttpPost]
    public async Task<mmria.common.model.couchdb.document_put_response> Post
    (
        [FromBody] mmria.common.model.couchdb.Save_Case_Request save_case_request
    ) 
    { 

        var case_post_request = save_case_request.Case_Data;

        string auth_session_token = null;

        string object_string = null;
        mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response ();


        try
        {
            var mmria_record_id = "";

            var userName = "";
            if (User.Identities.Any(u => u.IsAuthenticated))
            {
                userName = User.Identities.First(
                    u => u.IsAuthenticated && 
                    u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
            }

            var byName = (IDictionary<string,object>)case_post_request;
            var created_by = byName["created_by"] as string;
            if(string.IsNullOrWhiteSpace(created_by))
            {
                byName["created_by"] = userName;
            } 

            if(byName.ContainsKey("last_updated_by"))
            {
                byName["last_updated_by"] = userName;
            }
            else
            {
                byName.Add("last_updated_by", userName);
                
            }


            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            object_string = Newtonsoft.Json.JsonConvert.SerializeObject(case_post_request, settings);

            
            var temp_id = byName["_id"]; 
            string id_val = null;

            if(temp_id is DateTime)
            {
                id_val = string.Concat(((DateTime)temp_id).ToString("s"), "Z");
            }
            else
            {
                id_val = temp_id.ToString();

                var is_match = System.Text.RegularExpressions.Regex.IsMatch
                (
                    id_val, 
                    @"^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$"
                );

                if(! is_match)
                {
                    return result;
                }
            }

            var home_record = (IDictionary<string,object>)byName["tracking"];
            if(!home_record.ContainsKey("jurisdiction_id"))
            {
                home_record.Add("jurisdiction_id", "/");
            }

            if 
            (
                home_record.ContainsKey("pmssno")
            ) 
            {
                mmria_record_id = home_record["pmssno"].ToString();
            }

            if(!mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.WriteCase, home_record["jurisdiction_id"].ToString()))
            {
                result.error_description = $"unauthorized PUT {home_record["jurisdiction_id"]}: {byName["_id"]}";
                Console.Write($"unauthorized PUT {home_record["jurisdiction_id"]}: {byName["_id"]}");
                return result;
            }


            // begin - check if doc exists
            try 
            {
                var check_document_curl = new cURL ("GET", null, db_config.Get_Prefix_DB_Url($"mmrds/{id_val}"), null,db_config.user_name, db_config.user_value);
                string check_document_json = await check_document_curl.executeAsync ();
                var check_document_expando_object = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (check_document_json);
                IDictionary<string, object> result_dictionary = check_document_expando_object as IDictionary<string, object>;

                if
                (
                    result_dictionary != null && 
                    !mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.WriteCase, check_document_expando_object)
                )
                {
                    result.error_description = $"unauthorized PUT {result_dictionary["jurisdiction_id"]}: {result_dictionary["_id"]}";
                    Console.Write($"unauthorized PUT {result_dictionary["jurisdiction_id"]}: {result_dictionary["_id"]}");
                    return result;
                }

                


            } 
            catch (Exception ex) 
            {
                // do nothing for now document doesn't exsist.
                System.Console.WriteLine ($"err caseController.Post\n{ex}");
            }
            // end - check if doc exists




            string metadata_url = db_config.Get_Prefix_DB_Url($"mmrds/{id_val}");
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
                Console.Write("auth_session_token: {0}", auth_session_token);
                Console.WriteLine(ex);
            }

            if (!result.ok && result.error_description  == null)
            {
                result.error_description = save_response_from_server;
                Console.Write($"save failed for: {id_val}");
                Console.Write($"save_response:\n{save_response_from_server}");
            }


            var audit_data = save_case_request.Change_Stack;
            audit_data.record_id = mmria_record_id;
            audit_data.metadata_version = configuration.GetString("metadata_version", host_prefix);

            var audit_string = Newtonsoft.Json.JsonConvert.SerializeObject(audit_data, settings);

            string audit_url = db_config.Get_Prefix_DB_Url($"audit/{audit_data._id}");
            cURL audit_curl = new cURL ("PUT", null, audit_url, audit_string,db_config.user_name, db_config.user_value);

            try
            {
                string responseFromServer = await audit_curl.executeAsync();
                var audit_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
            }
            catch(Exception ex)
            {
                Console.Write("problem saving audit\n{0}", ex);

            }

            var Sync_Document_Message = new mmria.pmss.server.model.actor.Sync_Document_Message
            (
                id_val,
                    object_string
            );

            _actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.Synchronize_Case>()).Tell(Sync_Document_Message);
    
            /*
            var case_sync_actor = _actorSystem.ActorSelection("akka://mmria-actor-system/user/case_sync_actor");
            case_sync_actor.Tell(Sync_Document_Message);
            */

        }
        catch(Exception ex) 
        {
            Console.Write("auth_session_token: {0}", auth_session_token);
            Console.WriteLine (ex);
        }

        return result;

    } 

    [Authorize(Roles  = "abstractor")]
    [HttpDelete]
    public async Task<System.Dynamic.ExpandoObject> Delete(string case_id = null, string rev = null) 
    { 
        try
        {

            var mmria_record_id = "";
            var first_name = "";
            var last_name = "";

            var userName = "";
            if (User.Identities.Any(u => u.IsAuthenticated))
            {
                userName = User.Identities.First(
                    u => u.IsAuthenticated && 
                    u.HasClaim(c => c.Type == System.Security.Claims.ClaimTypes.Name)).FindFirst(System.Security.Claims.ClaimTypes.Name).Value;
            }

            string request_string = null;
            //mmria.pmss.server.utils.c_sync_document sync_document = null;

            if (!string.IsNullOrWhiteSpace (case_id) && !string.IsNullOrWhiteSpace (rev)) 
            {
                request_string = db_config.Get_Prefix_DB_Url($"mmrds/{case_id}?rev={rev}");
            }
            else 
            {
                return null;
            }

            var delete_report_curl = new cURL ("DELETE", null, request_string, null,db_config.user_name, db_config.user_value);
            var check_document_curl = new cURL ("GET", null, db_config.Get_Prefix_DB_Url($"mmrds/{case_id}"), null,db_config.user_name, db_config.user_value);

            string document_json = null;
            // check if doc exists
            try 
            {
                
                document_json = await check_document_curl.executeAsync ();
                var check_docuement_curl_result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (document_json);
                IDictionary<string, object> result_dictionary = check_docuement_curl_result as IDictionary<string, object>;
                
                if
                (
                    result_dictionary != null && 
                    !mmria.pmss.server.utils.authorization_case.is_authorized_to_handle_jurisdiction_id(User, mmria.pmss.server.utils.ResourceRightEnum.WriteCase, check_docuement_curl_result)
                )
                {
                    Console.Write($"unauthorized DELETE {result_dictionary["jurisdiction_id"]}: {result_dictionary["_id"]}");
                    return null;
                }
                
                
                if (result_dictionary.ContainsKey ("_rev")) 
                {
                    request_string = db_config.Get_Prefix_DB_Url($"mmrds/{case_id}?rev={result_dictionary ["_rev"]}");
                }

                if 
                (
                    result_dictionary.ContainsKey ("home_record") &&
                    result_dictionary["home_record"] is IDictionary<string,object> home_record
                    
                ) 
                {
                    if(home_record.ContainsKey("record_id"))
                    mmria_record_id = home_record["record_id"].ToString();

                    if(home_record.ContainsKey("first_name"))
                    first_name = home_record["first_name"].ToString();

                    if(home_record.ContainsKey("last_name"))
                    last_name = home_record["last_name"].ToString();
                }
            } 
            catch (Exception ex) 
            {
                // do nothing for now document doesn't exsist.
                System.Console.WriteLine ($"err caseController.Delete\n{ex}");
            }

            string responseFromServer = await delete_report_curl.executeAsync ();;
            var result = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Dynamic.ExpandoObject> (responseFromServer);

            var audit_data = new mmria.common.model.couchdb.Change_Stack()
            {
                _id = System.Guid.NewGuid().ToString(),
                case_id = case_id,
                case_rev = rev,

                record_id = mmria_record_id,
                is_delete = true,
                delete_rev = rev,

                user_name = userName,
                first_name = first_name,
                last_name = last_name,

                note = "deleted case",

                metadata_version = configuration.GetString("metadata_version", host_prefix),
                date_created = DateTime.UtcNow,
            };

            Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings ();
            settings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
 

            var audit_string = Newtonsoft.Json.JsonConvert.SerializeObject(audit_data, settings);

            string audit_url = db_config.Get_Prefix_DB_Url($"audit/{audit_data._id}");
            cURL audit_curl = new cURL ("PUT", null, audit_url, audit_string,db_config.user_name, db_config.user_value);

            try
            {
                string save_delete_audit_response = await audit_curl.executeAsync();
                var audit_result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(save_delete_audit_response);
            }
            catch(Exception ex)
            {
                Console.Write("problem saving audit\n{0}", ex);

            }



            if(! string.IsNullOrWhiteSpace(document_json))
            {
                var Sync_Document_Message = new mmria.pmss.server.model.actor.Sync_Document_Message
                (
                    case_id,
                    document_json,
                    "DELETE"
                );

                _actorSystem.ActorOf(Props.Create<mmria.pmss.server.model.actor.Synchronize_Case>()).Tell(Sync_Document_Message);
                /*
                var case_sync_actor = _actorSystem.ActorSelection("akka://mmria-actor-system/user/case_sync_actor");
                case_sync_actor.Tell(Sync_Document_Message);
                */

            }
            return result;

        }
        catch(Exception ex)
        {
            Console.WriteLine (ex);
        } 

        return null;
    }

/*
    public async Task<IActionResult> OnGetAsync(string documentId)
    {
        Document = _documentRepository.Find(documentId);

        if (Document == null)
        {
            return new NotFoundResult();
        }

        var authorizationResult = await _authorizationService
                .AuthorizeAsync(User, Document, "EditPolicy");

        if (authorizationResult.Succeeded)
        {
            return Page();
        }
        else if (User.Identity.IsAuthenticated)
        {
            return new ForbidResult();
        }
        else
        {
            return new ChallengeResult();
        }
    } 
*/

} 


