
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

using Microsoft.AspNetCore.Authorization;
using mmria.server.model;


namespace mmria.server.Controllers
{
    [Authorize(Roles = "cdc_admin,steve_prams")]
    public class stevePRAMSController : Controller
    {
        private readonly ILogger<stevePRAMSController> _logger;

        public stevePRAMSController(ILogger<stevePRAMSController> logger)
        {
            _logger = logger;
        }

        
        public IActionResult Index()
        {
            //var model = new FileUploadModel();
            //return View(model);

            return View();
        }
/*
        [HttpGet]
        public IActionResult FileUpload()
        {
            var model = new FileUploadModel();
            return View(model);
        }
*/
    }
}