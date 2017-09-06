using System;
using Topshelf;

namespace mmria.server
{
    public class mmria_server_service : ServiceControl
    {
        public mmria_server_service ()
        {
        }


        public bool Start (HostControl hostControl)
        {

            Program.Main (new string [] { });
            return true;
        }

        public bool Stop (HostControl hostControl)
        {


            return true;
        }

        public bool Pause (HostControl hostControl)
        {
            //_log.Info("SampleService Paused");

            return true;
        }

        public bool Continue (HostControl hostControl)
        {
            //_log.Info("SampleService Continued");

            return true;
        }



    }
}
