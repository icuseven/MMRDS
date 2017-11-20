using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;



namespace mmria.server
{
    [Route("api/[controller]")]
    public class couchController : Controller
    {
        // GET api/values
        [HttpGet("{db}")]
        [HttpGet("{db?}/{id?}/{rev?}")]
        //public async System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> Get()
        public async System.Threading.Tasks.Task<IActionResult> Get(string id = null, string rev = null)
        
        {
            return await Proxy(this.Request);
        }

        // GET api/values/5
        
        [HttpHead("{db?}/{id?}/{rev?}/{p3?}")]
        public async System.Threading.Tasks.Task<IActionResult> Head(string id, string rev = null)
        {
            return await Proxy(this.Request);
        }
        
        
        // POST api/values
        [HttpPost("{db?}/{id?}/{p2?}/{p3?}")]
        public async System.Threading.Tasks.Task<IActionResult> Post()
        {
            return await Proxy(this.Request);
        }

        // PUT api/values/5
        [HttpPut("{db?}/{id}/{doc}")]
        public async System.Threading.Tasks.Task<IActionResult> Put(string id, string doc)
        {
            return await Proxy(this.Request);
        }

        // DELETE api/values/5
        [HttpDelete("{db?}/{id}/{rev}")]
        public async System.Threading.Tasks.Task<IActionResult> Delete(string id, string rev)
        {
            return await Proxy(this.Request);
        }

        //https://stackoverflow.com/questions/13260951/how-to-proxy-a-rest-api-with-net-4
        //public async System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> Proxy(Microsoft.AspNetCore.Http.HttpRequest Request)
        public async System.Threading.Tasks.Task<IActionResult> Proxy(Microsoft.AspNetCore.Http.HttpRequest Request)
        
        {
            System.Net.Http.HttpResponseMessage result = null;

            // Grab the path from /api/*
            var path = Request.Path.ToString().Replace("/api/couch", "");
            var target = new UriBuilder("http", "localhost", 5984);
            var method = Request.Method;

            var client = new System.Net.Http.HttpClient();
            client.BaseAddress = target.Uri;

            // Needs to get filled with response.
            string content;
            System.IO.StreamReader reader;
            string jsonInput;
            System.Net.Http.HttpRequestMessage request_message;

            System.Console.WriteLine($"\nmethod:{method} Path: {Request.Path.ToString()} new_path:{path}");
            //System.Net.Http.HttpResponseMessage response;
            switch (method)
            {
                case "POST":
                    reader = new System.IO.StreamReader(Request.Body);
                    jsonInput = reader.ReadToEnd();

                    // Totally lost here.
                    result = await client.PostAsync(path, new System.Net.Http.StringContent(jsonInput, System.Text.Encoding.UTF8, "application/json"));

                    break;

                case "PUT":
                    reader = new System.IO.StreamReader(Request.Body);
                    jsonInput = reader.ReadToEnd();

                    // Totally lost here.
                    result = await client.PutAsync(path, new System.Net.Http.StringContent(jsonInput, System.Text.Encoding.UTF8, "application/json"));

                    break;
                case "DELETE":
                    result = await client.DeleteAsync(path);
                    break;
                case "GET":
                    // need to capture client data
                    //result = await client.GetAsync(path);
                    request_message = new System.Net.Http.HttpRequestMessage
                    (
                        System.Net.Http.HttpMethod.Get, 
                        path
                    );
                    result = await client.SendAsync(request_message);
                    break;
                case "HEAD":
                    request_message = new System.Net.Http.HttpRequestMessage
                    (
                        System.Net.Http.HttpMethod.Head, 
                        path
                    );
                    result = await client.SendAsync(request_message);
                    break;
                default:
                    System.Console.WriteLine($"\nmethod:{method} Path: {Request.Path.ToString()} new_path:{path} - missing manual.");
                    result = await client.GetAsync(path);
                    break;
            }

            content = await result.Content.ReadAsStringAsync();

            
            return Content(content, "application/json");
            //return Json(content);
        }
    }


    
}
