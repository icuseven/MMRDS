using System.Collections.Generic;
using System.Threading.Tasks;
using Akka.Actor;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RabbitMQ.Client;
using mmria.services.vitalsimport.Actors.VitalsImport;
using mmria.services.vitalsimport.Messages;
using System;
using System.IO;
using System.Net.Http;

namespace mmria.services.vitalsimport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VitalNotificationController : ControllerBase
    {
        private ActorSystem _actorSystem;

        public VitalNotificationController(ActorSystem actorSystem)
        {
            _actorSystem = actorSystem;
        }

        [HttpGet]
        public List<mmria.common.ije.Batch> Get()
        {
            var  result = new List<mmria.common.ije.Batch>();

            foreach(var kvp in mmria.services.vitalsimport.Program.BatchSet)
            {
                result.Add(kvp.Value);
            }

            return result;
        }


        [HttpDelete]
        public bool Delete()
        {
            var  result = true;

            mmria.services.vitalsimport.Program.BatchSet.Clear();
            return result;
        }

    }
}