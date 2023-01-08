using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using mmria.common.model;
using System.Net.Http;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers;

[Route("api/[controller]")]
public sealed class pinned_casesController : ControllerBase
{
    [Authorize(Roles = "abstractor")]
    [HttpGet]
    public async Task<mmria.common.model.couchdb.pinned_case_set> Get()
    {
        mmria.common.model.couchdb.pinned_case_set result = await GetPinnedCaseSet();

        
        /*
        try
        {
            string request_string = $"{Program.config_couchdb_url}/jurisdiction/penned-case-set";
            var case_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = await case_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.pinned_case_set>(responseFromServer);
        }
        catch (Exception ex)
        {
        Console.WriteLine(ex);
        }*/

        return result;
    }

    [Authorize(Roles = "abstractor")]
    [HttpPost]
    public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Post
    (


    )
    {
        string document_content;
        mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response();

        try
        {
            System.IO.Stream dataStream0 = this.Request.Body;

            System.IO.StreamReader reader0 = new System.IO.StreamReader(dataStream0);

            document_content = await reader0.ReadToEndAsync();

            var pin_case_message = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.pin_case_message>(document_content);

            var pinned_case_set = await GetPinnedCaseSet();

            if(pin_case_message.is_pin)
            {
                pinned_case_set.pin_case(pin_case_message);
            }
            else
            {
                pinned_case_set.unpin_case(pin_case_message);
            }

            result = await SetPinnedCaseSet(pinned_case_set);

            if (!result.ok)
            {

            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return result;
    }

    [Authorize(Roles = "jurisdiction_admin")]
    [HttpPut]
    public async System.Threading.Tasks.Task<mmria.common.model.couchdb.document_put_response> Put
    (

    )
    {
        string document_content;
        mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response();

        try
        {
            System.IO.Stream dataStream0 = this.Request.Body;

            System.IO.StreamReader reader0 = new System.IO.StreamReader(dataStream0);

            document_content = await reader0.ReadToEndAsync();

            var pin_case_message = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.pin_case_message>(document_content);

            if(pin_case_message.user_id == "everyone")
            {

                var pinned_case_set = await GetPinnedCaseSet();

                if(pin_case_message.is_pin)
                {
                    pinned_case_set.pin_case(pin_case_message);
                }
                else
                {
                    pinned_case_set.unpin_case(pin_case_message);
                }

                result = await SetPinnedCaseSet(pinned_case_set);

                if (!result.ok)
                {

                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return result;
    }

    public static string Base64Decode(string base64EncodedData)
    {
        var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
        return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    }


    async Task<mmria.common.model.couchdb.pinned_case_set> GetPinnedCaseSet()
    {

        mmria.common.model.couchdb.pinned_case_set result = null;

        try
        {
            string request_string = $"{Program.config_couchdb_url}/jurisdiction/pinned-case-set";
            var case_curl = new cURL("GET", null, request_string, null, Program.config_timer_user_name, Program.config_timer_value);
            string responseFromServer = await case_curl.executeAsync();
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.pinned_case_set>(responseFromServer);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return result;
        
    }

    async Task<mmria.common.model.couchdb.document_put_response> SetPinnedCaseSet
    (
        mmria.common.model.couchdb.pinned_case_set value 
    )
    {
        mmria.common.model.couchdb.document_put_response result = new mmria.common.model.couchdb.document_put_response();

        var document_content = Newtonsoft.Json.JsonConvert.SerializeObject(value);

        if(value._id == "jurisdiction/pinned-case-set")
        {
            string url = $"{Program.config_couchdb_url}/metadata/substance-mapping";
            //System.Console.WriteLine ("json\n{0}", object_string);

            cURL put_document_curl = new cURL("PUT", null, url, document_content, Program.config_timer_user_name, Program.config_timer_value);

            //bool save_document = false;


            try
            {
                string responseFromServer = await put_document_curl.executeAsync();
                result = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.document_put_response>(responseFromServer);
            }
            catch (Exception ex)
            {
            Console.WriteLine(ex);
            }
        }

        return result;
        
    }

}

