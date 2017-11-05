using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;



namespace web1.Controllers
{
    [Route("api/[controller]")]
    public class couchController : Controller
    {
        // GET api/values
        [HttpGet("{db?}/{id?}")]
        //public async System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> Get()
        public async System.Threading.Tasks.Task<ContentResult> Get()
        
        {
            return await Proxy(this.Request);
        }

        // GET api/values/5
        /*
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        */
        
        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        //https://stackoverflow.com/questions/13260951/how-to-proxy-a-rest-api-with-net-4
        //public async System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> Proxy(Microsoft.AspNetCore.Http.HttpRequest Request)
        public async System.Threading.Tasks.Task<ContentResult> Proxy(Microsoft.AspNetCore.Http.HttpRequest Request)
        
        {
            System.Net.Http.HttpResponseMessage result = null;

            // Grab the path from /api/*
            var path = Request.Path.ToString().Replace("/api/couch", "");
            var target = new UriBuilder("http", "db1.mmria.org", 80);
            var method = Request.Method;

            var client = new System.Net.Http.HttpClient();
            client.BaseAddress = target.Uri;

            // Needs to get filled with response.
            string content;
            System.IO.StreamReader reader;
            string jsonInput;
            
            System.Console.Write($"Path: {path}");
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
                default:
                    // need to capture client data
                    result = await client.GetAsync(path);
                    break;
            }

            content = await result.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }


    
}
