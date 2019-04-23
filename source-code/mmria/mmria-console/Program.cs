using System;

namespace mmria.console
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length > 0)
			{
				switch (args[0].ToLower())
				{
					case "help":
                    case "h":
                    case "-h":
                    case "-help":
                        print_help();
						break;
					case "backup":
						var db_backup = new mmria.console.db.Backup();
						db_backup.Execute (args);
					break;
					case "restore":
						var db_retore = new mmria.console.db.Restore ();
						db_retore.Execute (args);
					break;
					case "import":
						var db_import = new mmria.console.import_mmria_format();
						db_import.Execute (args);
					break;
					case "export":
						var db_export = new mmria.console.export_mmria_format();
						db_export.Execute (args);
						break;
					default:
						return;
				}
			}
			else
			{
                print_help();
				return;
			}
        }

        
        public static void print_help()
        {
                System.Console.WriteLine("mmria-console.exe program usage:\n");
                System.Console.WriteLine ($"\tbackup user_name:[admin_user] password:[admin_password] database_url:[http://localhost:5984/mmrds backup_file_path:[file_path]");
                System.Console.WriteLine ($"\t\texample: mmria-console.exe backup user_name:test password:test database_url:http://localhost:5984/mmrds backup_file_path:c:/temp/bk-mmrds.bk");
                System.Console.WriteLine("\n");
                System.Console.WriteLine ($"\trestore user_name:[admin_user] password:[admin_password] database_url:http://localhost:5984/mmrds backup_file_path:c:/temp/bk-mmrds.bk");
                System.Console.WriteLine ($"\t\texample:  mmria-console.exe restore user_name:test password:test database_url:http://localhost:5984/mmrds backup_file_path:c:/temp/bk-mmrds.bk");
            
        }
    }

}
