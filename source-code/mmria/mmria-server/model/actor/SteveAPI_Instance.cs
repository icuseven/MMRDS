using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Akka.Actor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using mmria.common.steve;

namespace mmria.server;

public sealed class SteveAPI_Instance : ReceiveActor
{

    public record class Status(string Name, string Description);

    Dictionary<string,string> steve_file_map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        { "Mortality","Mortality"},
        { "Fetal Death","FetalDeath"},
        { "Natality", "Natality"},
        { "PRAMS", "Natality"},

    };


    IConfiguration configuration;
    ILogger logger;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");
    public SteveAPI_Instance()
    {
        Receive<DownloadRequest>(message =>
        {
            var AuthRequestBody = new AuthRequestBody()
            {
                seaBucketKMSKey = message.seaBucketKMSKey,
                clientName = message.clientName,
                clientSecretKey = message.clientSecretKey
            };

            var base_url = message.base_url;
            var auth_url = $"{base_url}/auth";


            string jsonString = System.Text.Json.JsonSerializer.Serialize(AuthRequestBody);
            var curl = new cURL("POST", null, auth_url, jsonString, null, null);
            var response = curl.execute();

            //System.Console.WriteLine(response);

            var auth_reponse = System.Text.Json.JsonSerializer.Deserialize<AuthResponse>(response);

            var list_mailboxes_url = $"{base_url}/mailbox";
            var mail_box_curl = new cURL("GET", null, list_mailboxes_url, null, null, null);        
            mail_box_curl.AddHeader("Authorization","Bearer " + auth_reponse.token); 
            response = mail_box_curl.execute();
            //System.Console.WriteLine(response);

            var GetMailboxListResult = System.Text.Json.JsonSerializer.Deserialize<GetMailboxListResult>(response);
            

            var download_directory = System.IO.Path.Combine(message.download_directory,message.file_name);

            System.IO.Directory.CreateDirectory(download_directory);

            var ErrorList = new List<string>();
            var SuccessCount = 0;

            foreach(var mail_box in GetMailboxListResult.mailboxes)
            {
                if(mail_box.routingCode != "DRH") continue;

                if(!steve_file_map.ContainsKey(message.Mailbox)) continue;
                
                if
                (
                    steve_file_map[message.Mailbox] == "PRAMS" &&
                    mail_box.listName.ToUpper() != "PRAMS"
                )
                {
                    continue;
                }
                else
                {
                    if
                    (
                        mail_box.listName.ToUpper() != "JURISDICTION DATA" ||  
                        mail_box.fileType != steve_file_map[message.Mailbox]
                    ) continue;

                }

    /*
    •	count (number)
    •	fromDate (in YYYY-MM-DD format)
    •	toDate (in YYYY-MM-DD format)
    All three are optional. For example, the route to use for getting all (both read and unread) messages from November 1 to present would be:
    /mailbox/{mailboxId}/all?fromDate=2022-11-01

    To get only unread messages for the month of October, retrieving only 25 results maximum would be:
    /mailbox/{mailboxId}/unread?count=25&fromDate=2022-10-01&toDate=2022-10-31

    //toDate
    //fromDate


    
    */




                var mailbox_unread_url = $"{base_url}/mailbox/{mail_box.mailboxId}/all?fromDate={ToRequestString(message.BeginDate)}&toDate={ToRequestString(message.EndDate)}";
                var mailbox_unread_curl = new cURL("GET", null, mailbox_unread_url, null, null, null);        
                mailbox_unread_curl.AddHeader("Authorization","Bearer " + auth_reponse.token); 
                response = mailbox_unread_curl.execute();

                var UnreadMessageResult = System.Text.Json.JsonSerializer.Deserialize<MailBoxMessageResult>(response);
                if(UnreadMessageResult.messages?.Length > 0)
                {
                    foreach(var msg in UnreadMessageResult.messages)
                    {
                        var message_id = msg.messageId;
                        var download_message_url = $"{base_url}/file/{message_id}";
                        var message_path = System.IO.Path.Combine(download_directory, msg.messageId);
                        try
                        {
                            var download_message_curl = new cURL("GET", null, download_message_url, null, null, null);        
                            download_message_curl.AddHeader("Authorization","Bearer " + auth_reponse.token); 
                            response = download_message_curl.execute();

                            System.IO.File.WriteAllText(message_path, response);

                            SuccessCount += 1;
                            //System.Console.WriteLine(response);
                        }
                        catch(Exception ex)
                        {
                            ErrorList.Add($"{message_path} => {ex.Message}");
                        }
                    }
                }
            }


            System.IO.File.WriteAllText
            (
                download_directory + "/log.txt", 
                $"success:{SuccessCount} errors:{ErrorList.Count}\n{string.Join('\n', ErrorList)}"
            );


            var zip_file_name = message.file_name + ".zip";
            mmria.server.utils.cFolderCompressor folder_compressor = new mmria.server.utils.cFolderCompressor();
            string encryption_key = null;

            try
            {


                var target_zip_file = System.IO.Path.Combine(message.download_directory, zip_file_name);

                if(System.IO.File.Exists(target_zip_file))
                {
                    System.IO.File.Delete(target_zip_file);
                }

                if(System.IO.Directory.Exists(download_directory))
                {
                    folder_compressor.Compress
                    (
                        target_zip_file,
                        encryption_key,
                        download_directory
                    );

                    System.IO.Directory.Delete(download_directory, true);
                }

            }
            catch(Exception ex)
            {
                Console.WriteLine($"File Compressor \n{ex}");
            }
                    

            System.Console.WriteLine("here");

            Context.Stop(this.Self);
        });
    }

    string ToRequestString(DateTime value)
    {
        var year = value.Year.ToString();
        var month = value.Month.ToString().PadLeft(2,'0');
        var day = value.Day.ToString().PadLeft(2,'0');

        return $"{year}-{month}-{day}";
    }
}


