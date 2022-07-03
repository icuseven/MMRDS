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

    async Task Process_Message(mmria.services.backup.BackupSupervisor.PerformBackupMessage message)
    {


        Console.WriteLine("Beginning Backup.");

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
            

            var date_string = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var target_folder = System.IO.Path.Combine(root_folder, date_string);

            System.IO.Directory.CreateDirectory(target_folder);

            var b = new Backup();

            List<(string, int)> document_counts = new List<(string, int)>();


            var number_of_vital_import_docs = await b.Execute
            (
                new[]
                {
                    "backup",
                    "user_name:" + mmria.services.vitalsimport.Program.timer_user_name,
                    "password:" + mmria.services.vitalsimport.Program.timer_value,
                    $"database_url: {mmria.services.vitalsimport.Program.couchdb_url}/vital_import",
                    $"backup_file_path:{target_folder}/mmria-vital_import-db.json"
                }
            );

            document_counts.Add(($"database vital_import: {number_of_vital_import_docs}", number_of_vital_import_docs));


            foreach(var kvp in db_config_set.detail_list)
            {
                var prefix = kvp.Key.ToLower();
                var data_connection = kvp.Value;

                if(kvp.Key.Equals("vital_import", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                foreach(var db in db_list)
                {   
                    try
                    {

                        var number_of_docs = await b.Execute
                        (
                            new[]
                            {
                                "backup",
                                "user_name:" + data_connection.user_name,
                                "password:" + data_connection.user_value,
                                $"database_url:{data_connection.url}/{db}",
                                $"backup_file_path:{target_folder}/{prefix}-mmria-{db}-db.json"
                            }
                        );

                        document_counts.Add(($"database {prefix} {db} : {number_of_docs}", number_of_docs));

                    }
                    catch(Exception)
                    {

                    }
                
                }
            }

            document_counts.Sort(Comparer<(string,int)>.Create((i1, i2) => i1.Item2.CompareTo(i2.Item2)));
            List<string> document_text = new List<string>();
            foreach(var i in document_counts)
            {
                document_text.Add(i.Item1);
            }
            var count_file_path = System.IO.Path.Combine(target_folder, "db_record_count.txt");
            System.IO.File.WriteAllText (count_file_path, string.Join('\n',document_text));
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

        Console.WriteLine("fin.");

        Context.Stop(this.Self);
    }

}
   

