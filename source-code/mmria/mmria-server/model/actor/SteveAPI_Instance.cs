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
            
            foreach(var mail_box in GetMailboxListResult.mailboxes)
            {

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
                        var download_message_curl = new cURL("GET", null, download_message_url, null, null, null);        
                        download_message_curl.AddHeader("Authorization","Bearer " + auth_reponse.token); 
                        response = download_message_curl.execute();
                        System.Console.WriteLine(response);
                    }
                }
            }



            System.Console.WriteLine("here");

            Context.Stop(this.Self);
        });
    }

    string ToRequestString(DateTime value)
    {
        var year = value.Year.ToString();
        var month = value.Month.ToString().PadRight(2,'0');
        var day = value.Day.ToString().PadRight(2,'0');

        return $"{year}-{month}-{day}";
    }
}


