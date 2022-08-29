using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text;
using Akka.Actor;

namespace mmria.services.backup;

public class BackupColdProcessor : ReceiveActor
{
    string _id;
    private int my_count = -1;
    const int mor_max_length = 5001;
    const int nat_max_length = 4001;
    const int fet_max_length = 6001;

    DateTime? start_date = null;

    HashSet<string> g_cdc_identifier_set = new();

    IConfiguration configuration;
    ILogger logger;

    mmria.common.couchdb.DBConfigurationDetail item_db_info;

    protected override void PreStart() => Console.WriteLine("Process_Message started");
    protected override void PostStop() => Console.WriteLine("Process_Message stopped");

    private Dictionary<string, (string, mmria.common.ije.BatchItem)> batch_item_set = new (StringComparer.OrdinalIgnoreCase);

    private mmria.common.ije.Batch batch;
    public BackupColdProcessor()
    {
        Receive<mmria.services.backup.BackupSupervisor.PerformBackupMessage>(message =>
        {

            Process_Message(message);
        });
    }

    void Process_Message(mmria.services.backup.BackupSupervisor.PerformBackupMessage message)
    {


        Console.WriteLine("Beginning Backup.");

        DateTime Timer_Start = DateTime.Now;
        DateTime Timer_End = DateTime.Now;
        TimeSpan Timer_Duration = default;

        try
        {
            mmria.common.couchdb.ConfigurationSet db_config_set = mmria.services.vitalsimport.Program.DbConfigSet;

            string root_folder = db_config_set.name_value["backup_storage_root_folder"];

            var db_list = new List<string>()
            {
                "configuration",
                "audit",
                "mmrds",
                "_users",
                "metadata",
                "jurisdiction",
                "session"
            };
            

            var date_string = DateTime.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss-ddd");
            var target_folder = System.IO.Path.Combine(root_folder, date_string);
            

            System.IO.Directory.CreateDirectory(target_folder);

            var b = new Backup();

            List<(string, int)> document_counts = new List<(string, int)>();


            var db_folder = System.IO.Path.Combine(target_folder, "vital_import");
            System.IO.Directory.CreateDirectory($"{db_folder}/_design");
            

            var vital_import_backup_result_message = b.Execute
            (
                new[]
                {
                    "backup",
                    "user_name:" + mmria.services.vitalsimport.Program.timer_user_name,
                    "password:" + mmria.services.vitalsimport.Program.timer_value,
                    $"database_url: {mmria.services.vitalsimport.Program.couchdb_url}/vital_import",
                    $"backup_file_path:{db_folder}"
                }
            );

            string detail = "";

            if(vital_import_backup_result_message.Detail!= null)
            {
                detail = vital_import_backup_result_message.Detail.Replace("\n", " ");
            }

            document_counts.Add(($"vital import BackupStatus: {vital_import_backup_result_message.Status} SuccessCount: {vital_import_backup_result_message.SuccessCount} ErrorCount: {vital_import_backup_result_message.ErrorCount}  Detail: {detail}", vital_import_backup_result_message.Doc_ID_Count));


            var db_folder_finished = System.IO.Path.Combine(target_folder, $"vital_import-ready-for-compression.txt");
            System.IO.File.WriteAllText (db_folder_finished, "");

            /*

            mmria.server.utils.cFolderCompressor folder_compressor = new mmria.server.utils.cFolderCompressor();
            string encryption_key = null;

            var zip_file_name = $"{date_string}-vital-import.zip";

            folder_compressor.Compress
            (
                System.IO.Path.Combine(target_folder, zip_file_name),
                encryption_key,
                db_folder
            );

            System.IO.Directory.Delete(db_folder, true);
            */

            foreach(var kvp in db_config_set.detail_list)
            {
                var prefix = kvp.Key.ToLower();
                var data_connection = kvp.Value;

                if(kvp.Key.Equals("vital_import", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var prefix_folder = System.IO.Path.Combine(target_folder, prefix);
                System.IO.Directory.CreateDirectory(prefix_folder);


                foreach(var db in db_list)
                {   
                    try
                    {

                        db_folder = System.IO.Path.Combine(prefix_folder, db);
                        System.IO.Directory.CreateDirectory($"{db_folder}/_design");

                        var Backup_Result_Message = b.Execute
                        (
                            new[]
                            {
                                "backup",
                                "user_name:" + data_connection.user_name,
                                "password:" + data_connection.user_value,
                                $"database_url:{data_connection.url}/{db}",
                                $"backup_file_path:{db_folder}"
                            }
                        );

                        
                        

                        if(Backup_Result_Message.Detail!= null)
                        {
                            detail = Backup_Result_Message.Detail.Replace("\n", " ");
                        }
                        else
                        {
                            detail = "";
                        }

                        document_counts.Add(($"{prefix} {db} BackupStatus: {Backup_Result_Message.Status} SuccessCount: {Backup_Result_Message.SuccessCount} ErrorCount: {Backup_Result_Message.ErrorCount}  Detail: {detail}", Backup_Result_Message.Doc_ID_Count));

                    }
                    catch(Exception)
                    {

                    }
                
                }

                db_folder_finished = System.IO.Path.Combine(target_folder, $"{prefix}-ready-for-compression.txt");
                System.IO.File.WriteAllText (db_folder_finished, "");

                /*

                zip_file_name = $"{date_string}-{prefix}.zip";

                folder_compressor.Compress
                (
                    System.IO.Path.Combine(target_folder, zip_file_name),
                    encryption_key,
                    prefix_folder
                );

                System.IO.Directory.Delete(prefix_folder, true);
                */
            }

            document_counts.Sort(Comparer<(string,int)>.Create((i1, i2) => i1.Item2.CompareTo(i2.Item2)));
            List<string> document_text = new List<string>();
            foreach(var i in document_counts)
            {
                document_text.Add(i.Item1);
            }
            var count_file_path = System.IO.Path.Combine(target_folder, "db_record_count.txt");
            System.IO.File.WriteAllText(count_file_path, string.Join('\n',document_text));


            count_file_path = System.IO.Path.Combine(root_folder, $"{date_string}-db_record_count.txt");
            System.IO.File.WriteAllText(count_file_path, string.Join('\n',document_text));

        }
        catch(Exception ex)
        {
            Console.WriteLine($"Cold backup\n{ex}");
        }

        this.Sender.Tell(new mmria.services.backup.BackupSupervisor.BackupFinishedMessage()
        {
            type = "cold",
            DateEnded = DateTime.Now

        });

        Console.WriteLine("cold backup fin.");

        Context.Stop(this.Self);
    }

}
   

