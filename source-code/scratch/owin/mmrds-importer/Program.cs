using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Linq;

//using System.Threading.Tasks;
//using System.Data;
//using System.Linq;

using mmria.console.data;

namespace mmria.console
{
	interface icommand
	{
		string summary_help();
		string detailed_help(string method);
	}

	class MainClass
	{

		//import user_name:user1 password:password database_file_path:mapping-file-set/Maternal_Mortality.mdb url:http://localhost:12345
		//import user_name:user1 password:password database_file_path:mapping-file-set/Maternal_Mortality.mdb url:http://test.mmria.org
		//export user_name:user1 password:password url:http://localhost:12345
		//export-core user_name:user1 password:password url:http://localhost:12345

		//export user_name:user1 password:password url:http://test.mmria.org
		//export-core user_name:user1 password:password url:http://test.mmria.org
		//import user_name:user1 password:password database_file_path:c:\temp\Maternal_Mortality.mdb url:http://test.mmria.org
		//import user_name:user1 password:password database_file_path:c:\temp\Maternal_Mortality.mdb url:http://localhost:12345
		//import user_name:user1 password:password database_file_path:c:\temp\Import_TestCases_13Jun2017\Import_TestCases_13Jun2017.mdb url:http://test.mmria.org
		//import user_name:user1 password:password database_file_path:c:\temp\Mock_Review_Demo_Cases_May2017.mdb url:http://test.mmria.org

		//backup user_name:user1 password:password database_url:http://demo.mmria.org/metadata backup_file_path:c:\temp\bk-meta.bk

		public static void Main(string[] args)
		{
			if (args.Length > 0)
			{
				switch (args[0])
				{
					case "import":
						var import_run = new mmria.console.import.mmrds_importer();
						import_run.Execute(args);
						break;

					case "export":
						var exporter = new mmria.console.export.mmrds_exporter();
						exporter.Execute(args);
						break;
					case "export-core":
						var core_exporter = new mmria.console.export.core_element_exporter();
						core_exporter.Execute(args);
						break;
					case "backup":
						var db_backup = new mmria.console.db.Backup();
						db_backup.Execute (args);
					break;
					case "restore":
						var db_retore = new mmria.console.db.Restore ();
						db_retore.Execute (args);
					break;

					default:
						return;
				}
			}
			else
			{
				System.Console.WriteLine("use:");
				System.Console.WriteLine("\timport");
				System.Console.WriteLine("\texport");
				System.Console.WriteLine("\texport-coere");
				System.Console.WriteLine("\tbackup");
				System.Console.WriteLine ("\trestore");
				return;
			}
		}
	}
}
