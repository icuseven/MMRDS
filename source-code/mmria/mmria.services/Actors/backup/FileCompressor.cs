using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text;
using Akka.Actor;

namespace mmria.services.backup;

public class FileCompressor : ReceiveActor
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

    protected override void PreStart() => Console.WriteLine("FileCompressor started");
    protected override void PostStop() => Console.WriteLine("FileCompressor stopped");

    private Dictionary<string, (string, mmria.common.ije.BatchItem)> batch_item_set = new (StringComparer.OrdinalIgnoreCase);

    private mmria.common.ije.Batch batch;
    public FileCompressor()
    {
        Receive<mmria.services.backup.BackupSupervisor.PerformBackupMessage>(message =>
        {

            Process_Message(message);
        });
    }

    void Process_Message(mmria.services.backup.BackupSupervisor.PerformBackupMessage message)
    {


        Console.WriteLine("Beginning File Compressor.");

        try
        {
            mmria.common.couchdb.ConfigurationSet db_config_set = mmria.services.vitalsimport.Program.DbConfigSet;
            mmria.server.utils.cFolderCompressor folder_compressor = new mmria.server.utils.cFolderCompressor();
            string encryption_key = null;


            string root_folder = db_config_set.name_value["backup_storage_root_folder"];

            var suffix = "-ready-for-compression.txt";
            foreach(var directory_path in System.IO.Directory.GetDirectories(root_folder))
            {

                var directory = new System.IO.DirectoryInfo(directory_path);
                var target_folder = directory.FullName;
                var date_string = directory.Name;

                foreach(var f in directory.GetFiles())
                {
                    if (f.Name.EndsWith(suffix))
                    {
                        try
                        {
                            var prefix = f.Name.Replace(suffix, "");
                            var zip_file_name = $"{date_string}-{prefix}.zip";
                            var db_folder = System.IO.Path.Combine(target_folder, prefix);

                            if(System.IO.Directory.Exists(db_folder))
                            {
                                folder_compressor.Compress
                                (
                                    System.IO.Path.Combine(target_folder, zip_file_name),
                                    encryption_key,
                                    db_folder
                                );

                                System.IO.Directory.Delete(db_folder, true);
                            }

                            f.Delete();
                        }
                        catch(Exception ex)
                        {
                            Console.WriteLine($"File Compressor \n{ex}");
                        }
                    }
                }


            }

        }
        catch(Exception ex)
        {
            Console.WriteLine($"File Compressor\n{ex}");
        }

        this.Sender.Tell(new mmria.services.backup.BackupSupervisor.BackupFinishedMessage()
        {
            type = "compress",
            DateEnded = DateTime.Now

        });

        Console.WriteLine("FileCompressor fin.");

        Context.Stop(this.Self);
    }

}
   

