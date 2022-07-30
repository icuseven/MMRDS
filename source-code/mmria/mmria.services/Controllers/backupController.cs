using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
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
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace mmria.services.vitalsimport.Controllers;

[Authorize]
[Route("api/[controller]/[action]")]
[ApiController]
public class backupController : Controller
{
    private ActorSystem _actorSystem;

    public backupController
    (
        ActorSystem actorSystem
    )
    {
        _actorSystem = actorSystem;

    }

    [HttpGet]
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> PerformHotBackup()
    {
        var  message = new mmria.services.backup.BackupSupervisor.PerformBackupMessage()
        {
            type = "hot",
            DateStarted = DateTime.Now
        };


        var bsr = _actorSystem.ActorSelection("user/backup-supervisor");
        bsr.Tell(message); 


        return Ok();
    }

    [HttpGet]
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> PerformColdBackup()
    {
        var  message = new mmria.services.backup.BackupSupervisor.PerformBackupMessage()
        {
            type = "cold",
            DateStarted = DateTime.Now
        };


        var bsr = _actorSystem.ActorSelection("user/backup-supervisor");
        bsr.Tell(message); 


        return Ok();
    }



    [HttpGet]
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> GetFileList()
    {
        string root_folder = Program.DbConfigSet.name_value["backup_storage_root_folder"];


        var result = new List<string>();
        var file_list = new List<string>();
        var dir_list = new List<string>();
        var file_info_List = new List<FileInfo>();
        var dir_info_List = new List<DirectoryInfo>();

/*

        var freeBytes = new DriveInfo(root_folder).AvailableFreeSpace; 
        var rootInfo = new DirectoryInfo(root_folder);

        rootInfo.
        */

        foreach(var file_path in System.IO.Directory.GetFiles(root_folder))
        {
            var fileInfo = new FileInfo(file_path);

        }

        foreach(var dir_path in System.IO.Directory.GetDirectories(root_folder))
        {
             var dirInfo = new DirectoryInfo(dir_path);
        }

        file_info_List = file_info_List.OrderByDescending( x => x.CreationTime ).ToList();
        dir_info_List = dir_info_List.OrderByDescending( x => x.CreationTime ).ToList();


        foreach(var fileInfo in file_info_List)
        {
            file_list.Add($"--- {fileInfo.Name}");
        }

        foreach(var dirInfo in dir_info_List)
        {
            dir_list.Add($"d-- {dirInfo.Name}");
        }




        result.AddRange(file_list);
        result.AddRange(dir_list);


        return Ok(result);
    }


    private string GetDriveSize()
    {
        var process = new System.Diagnostics.Process()
        {
            StartInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"df\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            }
        };
        process.Start();
        string result = process.StandardOutput.ReadToEnd();
        process.WaitForExit();
        return result;
    }


    [HttpGet("{id}")]
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<IActionResult> GetFile(string id)
    {
        string root_folder = Program.DbConfigSet.name_value["backup_storage_root_folder"];


        var file_path = System.IO.Path.Combine(root_folder, id);

        if(System.IO.File.Exists(file_path))
        {
            byte[] fileBytes = await ReadFile(file_path);

            
            //return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, id);
            return Ok(Base64EncodeBytes(fileBytes));
        }
        else
        {
            return NotFound();
        }


    }



    [HttpDelete]
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    public async Task<bool> Delete()
    {
        var  result = true;

/*
        var  batch_list = new List<mmria.common.ije.Batch>();

        string url = $"{mmria.services.vitalsimport.Program.couchdb_url}/vital_import/_all_docs?include_docs=true";
        var document_curl = new mmria.getset.cURL ("GET", null, url, null, mmria.services.vitalsimport.Program.timer_user_name, mmria.services.vitalsimport.Program.timer_value);
        try
        {
            var responseFromServer = await document_curl.executeAsync();
            var alldocs = Newtonsoft.Json.JsonConvert.DeserializeObject<mmria.common.model.couchdb.alldocs_response<mmria.common.ije.Batch>>(responseFromServer);

            foreach(var item in alldocs.rows)
            {
                batch_list.Add(item.doc);
            }
            
        }
        catch(Exception ex)
        {
            //Console.Write("auth_session_token: {0}", auth_session_token);
            Console.WriteLine(ex);
        }

        foreach(var item in batch_list)
        {
            var message = new mmria.common.ije.BatchRemoveDataMessage()
            {
                id = item.id,
                date_of_removal = DateTime.Now
            };

            var bsr = _actorSystem.ActorSelection("user/batch-supervisor");
            bsr.Tell(message);
        }

*/
        return result;
    }

        async Task<byte[]> ReadFile(string s)
    {
        byte[] data;
        int br;
        int fs_length;

        using(FileStream fs = new FileStream (s, FileMode.Open, FileAccess.Read))
        {
            fs_length = (int) fs.Length;
            data = new byte[fs.Length];
            br = await fs.ReadAsync(data, 0, data.Length);
        }
        if (br != (int) fs_length)
            throw new System.IO.IOException(s);
        return data;
    }

    public static string Base64EncodeBytes(byte[] inputBytes) 
    {
        // Each 3-byte sequence in inputBytes must be converted to a 4-byte 
        // sequence 
        long arrLength = (long)(4.0d * inputBytes.Length / 3.0d);
        if ((arrLength  % 4) != 0) 
        {
            // increment the array length to the next multiple of 4 
            //    if it is not already divisible by 4
            arrLength += 4 - (arrLength % 4);
        }

        char[] encodedCharArray = new char[arrLength];
        Convert.ToBase64CharArray(inputBytes, 0, inputBytes.Length, encodedCharArray, 0);

        return (new string(encodedCharArray));
    }

}
