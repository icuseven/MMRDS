using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace mmria.pmss.server;

[Authorize(Roles  = "installation_admin")]
[Route("api/[controller]")]
public sealed class syncController: ControllerBase 
{ 
    public syncController()
    {
        
    }

    [HttpGet]
    public string Get()
    {
        string result = null;

        System.Threading.Tasks.Task.Run
        (
            new Action (() =>
            {

                try 
                {
                    
                    mmria.pmss.server.utils.c_document_sync_all sync_all = new mmria.pmss.server.utils.c_document_sync_all (
                                                                        Program.config_couchdb_url,
                                                                        Program.config_timer_user_name,
                                                                        Program.config_timer_value
                                                                    );

                    sync_all.executeAsync (); 
                }
                catch (Exception ex) 
                {
                    System.Console.WriteLine ($"syncController. error sync_all.execute\n{ex}");
                }
            })
        );
        

        return result;

    } 

} 


