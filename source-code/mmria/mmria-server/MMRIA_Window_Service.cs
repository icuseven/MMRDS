using System;
using Microsoft.Extensions.PlatformAbstractions;
using PeterKottas.DotNetCore.WindowsService.Interfaces;
using System.Timers;

namespace mmria.server
{
    //https://github.com/PeterKottas/DotNetCore.WindowsService/tree/master/Source

    public class MMRIA_Window_Service : IMicroService
    {
        private IMicroServiceController controller;

        public MMRIA_Window_Service()
        {
            controller = null;
        }

        public MMRIA_Window_Service(IMicroServiceController controller)
        {
            this.controller = controller;
        }

        public void Start()
        {
            Console.WriteLine("I started");
        }

        public void Stop()
        {
            Console.WriteLine("I stopped");
        }

    }
}
