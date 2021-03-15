
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
using mmria.server.model;


namespace VitalsImport_FileUpload.Controllers
{
    [Authorize(Roles = "abstractor, jurisdiction_admin")]
    [Route("vital-import-history")]
    public class vital_import_history_abstractorController : Controller
    {
        private readonly ILogger<vitalsController> _logger;

        public vital_import_history_abstractorController(ILogger<vitalsController> logger)
        {
            _logger = logger;
        }

        
        public IActionResult Index()
        {
            var model = new FileUploadModel();
            return View(model);
        }

    }
}
