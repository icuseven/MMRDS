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
        { "Other", "Other"},
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

            var auth_response = System.Text.Json.JsonSerializer.Deserialize<AuthResponse>(response);

            var list_mailboxes_url = $"{base_url}/mailbox";
            var mail_box_curl = new cURL("GET", null, list_mailboxes_url, null, null, null);        
            mail_box_curl.AddHeader("Authorization","Bearer " + auth_response.token); 
            response = mail_box_curl.execute();
            System.Console.WriteLine(response);

            var GetMailboxListResult = System.Text.Json.JsonSerializer.Deserialize<GetMailboxListResult>(response);            

            var download_directory = System.IO.Path.Combine(message.download_directory,message.file_name);

            System.IO.Directory.CreateDirectory(download_directory);

            var ErrorList = new List<string>();
            var SuccessCount = 0;

            if(message.Mailbox.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                foreach(var item in steve_file_map.Where( x=> x.Key != "PRAMS"))
                {
                    var new_message = message with { Mailbox = item.Key };

                    var mailbox_directory = System.IO.Path.Combine(download_directory, item.Value);

                    System.IO.Directory.CreateDirectory(mailbox_directory);
                    OneMailBox
                    (
                        new_message,
                        GetMailboxListResult,
                        base_url,
                        auth_response.token,
                        mailbox_directory,
                        ref SuccessCount,
                        ref ErrorList
                    );

                }
            }
            else
            {
                OneMailBox
                (
                    message,
                    GetMailboxListResult,
                    base_url,
                    auth_response.token,
                    download_directory,
                    ref SuccessCount,
                    ref ErrorList
                );
            }


            System.IO.File.WriteAllText
            (
                download_directory + "/download-log.txt", 
                $"STEVE Mailbox:{message.Mailbox}\nBeginDate:{ToRequestString(message.BeginDate)} => {ToBeginDateTimeRequestString(message.BeginDate)}\nEndDate:{ToRequestString(message.EndDate)} => {ToEndDateTimeRequestString(message.EndDate)}\nsuccess:{SuccessCount} errors:{ErrorList.Count}\n{string.Join('\n', ErrorList)}"
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

    void OneMailBox
    (
        DownloadRequest message,
        GetMailboxListResult GetMailboxListResult,
        string base_url,
        string token,
        string download_directory,
        ref int SuccessCount,
        ref List<string> ErrorList
    )
    {
        
        foreach(var mail_box in GetMailboxListResult.mailboxes)
        {
            if(mail_box.routingCode != "DRH") continue;

            if(!steve_file_map.ContainsKey(message.Mailbox)) continue;
            
            if
            (
                message.Mailbox == "PRAMS" 
            )
            {
                if
                (
                    mail_box.listName.ToUpper() != "PRAMS"
                )   
                continue;
            }
            else if
            (
                mail_box.listName.ToUpper() != "JURISDICTION DATA" ||  
                mail_box.fileType != steve_file_map[message.Mailbox]
            ) continue;

            

            var mailbox_unread_url = $"{base_url}/mailbox/{mail_box.mailboxId}/all?count=1000&fromDate={ToBeginDateTimeRequestString(message.BeginDate)}&toDate={ToEndDateTimeRequestString(message.EndDate)}";
            var mailbox_unread_curl = new cURL("GET", null, mailbox_unread_url, null, null, null);        
            mailbox_unread_curl.AddHeader("Authorization","Bearer " + token); 
            var response = mailbox_unread_curl.execute();

            var UnreadMessageResult = System.Text.Json.JsonSerializer.Deserialize<MailBoxMessageResult>(response);
            if(UnreadMessageResult.messages?.Length > 0)
            {

                using (var client = new System.Net.Http.HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization","Bearer " + token);

                    foreach(var msg in UnreadMessageResult.messages)
                    {
                        var message_id = msg.messageId;
                        var download_message_url = $"{base_url}/file/{message_id}";
                        var message_path = System.IO.Path.Combine(download_directory, msg.fileName);
                        try
                        {
                            /*
                            var download_message_curl = new cURL("GET", null, download_message_url, null, null, null);        
                            download_message_curl.AddHeader("Authorization","Bearer " + auth_reponse.token); 
                            response = download_message_curl.execute();
                            */

                            //System.IO.File.WriteAllText(message_path, response);

                            using (var client_response = client.GetAsync(download_message_url).Result)
                            {
                                using (var content = client_response.Content)
                                {
                                    using (var fs = new System.IO.FileStream(message_path, System.IO.FileMode.Create, System.IO.FileAccess.Write, System.IO.FileShare.None))
                                    {
                                        client_response.Content.CopyToAsync(fs).GetAwaiter().GetResult();
                                        //await fs.FlushAsync();
                                        
                                    }
                                }
                            }

                            SuccessCount += 1;
                        }
                        catch(Exception ex)
                        {
                            ErrorList.Add($"{message_path} => {ex.Message}");
                        }
                    }
                }
            }
        }
    }

    string ToRequestString(DateTime value)
    {
        var year = value.Year.ToString();
        var month = value.Month.ToString().PadLeft(2,'0');
        var day = value.Day.ToString().PadLeft(2,'0');

        return $"{year}-{month}-{day}";
    }

    string ToBeginDateTimeRequestString(DateTime value)
    {
        var yesterday = value.AddDays(- 1);

        var year = yesterday.Year.ToString();
        var month = yesterday.Month.ToString().PadLeft(2,'0');
        var day = yesterday.Day.ToString().PadLeft(2,'0');

        return $"{year}-{month}-{day}T19:00:00Z";
    }

    string ToEndDateTimeRequestString(DateTime value)
    {

        var year = value.Year.ToString();
        var month = value.Month.ToString().PadLeft(2,'0');
        var day = value.Day.ToString().PadLeft(2,'0');

        return $"{year}-{month}-{day}T18:59:00Z";
    }



}


