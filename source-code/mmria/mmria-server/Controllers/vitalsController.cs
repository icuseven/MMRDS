/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace mmria.server.Controllers
{
    //[Authorize(Policy = "EmployeeId")]
    //[Authorize(Policy = "Over21Only")]
    //[Authorize(Policy = "BuildingEntry")]
    public class vitalsController : Controller
    {
        [Authorize(Roles = "cdc_analyst")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
*/

﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using RabbitMQ.Client;
using mmria.server.model;
/*
using VitalsImport_FileUpload.Messages;
using VitalsImport_FileUpload.Models;
*/

namespace VitalsImport_FileUpload.Controllers
{
    [Authorize(Roles = "abstractor,cdc_analyst")]
    public class vitalsController : Controller
    {
        private readonly ILogger<vitalsController> _logger;

        public vitalsController(ILogger<vitalsController> logger)
        {
            _logger = logger;
        }

        
        public IActionResult Index()
        {
            var model = new FileUploadModel();
            return View(model);
        }

        [HttpGet]
        public IActionResult FileUpload()
        {
            var model = new FileUploadModel();
            return View(model);
        }
/*
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> FileIndex(FileUploadModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    List<string> fileNames = new List<string>();
                    string targetPath = Environment.GetEnvironmentVariable("FILE_DROP_PATH");

                    fileNames.Add(await FileUploadToStorage(model.FileUpload_FET, targetPath));
                    fileNames.Add(await FileUploadToStorage(model.FileUpload_NAT, targetPath));
                    fileNames.Add(await FileUploadToStorage(model.FileUpload_MOR, targetPath));

                    var message = JsonConvert.SerializeObject(new RecordUpload_Message()
                    {
                        location = targetPath,
                        filenames = fileNames?.ToArray()
                    });

#if DEBUG
                    //Short circut the Queue and send straight to message processor
                    //You need to be running the local instance of message processor with the below URL
                    var localUrl = "https://localhost:44331/api/Message/Read";
                    //var result = Program.client.PostAsync(localUrl, new StringContent(message, Encoding.UTF8, "application/json")).Result;

                    var message_curl = new mmria.server.cURL("POST", null, localUrl, message);
                    var messge_curl_result = await message_curl.executeAsync();
#else
                //Our Queue is only available on ECPaaS
                QueueMessage(message);
#endif

                }
                catch (Exception)
                {

                    throw;
                } 
            }

            return View(model);
        }

        private static async Task<string> FileUploadToStorage(IFormFile formFile, string targetPath)
        {
            string fileName = Path.GetFileName(formFile.FileName);
            string filePath = Path.Combine(targetPath, fileName);

            if (formFile.Length > 0)
            {
                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(fileStream);
                }
            }

            return fileName;
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private void QueueMessage(string message)
        {
            string rabbitMQHostName = Environment.GetEnvironmentVariable("RABBITMQ_HOSTNAME");
            Console.WriteLine($"RabbitMQ Host = {rabbitMQHostName}");

            var factory = new ConnectionFactory() { HostName = rabbitMQHostName };
            using (var connection = factory.CreateConnection())
            {
                Console.WriteLine($"Connection Created");

                using (var channel = connection.CreateModel())
                {
                    Console.WriteLine($"Model Created");

                    channel.QueueDeclare(queue: "vitals_import_queue",
                                durable: true,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

                    //string message = "Hello World!";
                    var body = Encoding.UTF8.GetBytes(message);

                    //channel.BasicPublish(exchange: "",
                    //                     routingKey: "hello",
                    //                     basicProperties: null,
                    //                     body: body);

                    var properties = channel.CreateBasicProperties();
                    properties.Persistent = true;

                    channel.BasicPublish(exchange: "",
                                         routingKey: "vitals_import_queue",
                                         basicProperties: properties,
                                         body: body);
                    Console.WriteLine(" [x] Sent {0}", message);
                }
            }
        }
        */
    }
}
