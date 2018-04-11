using System;

namespace mmria_console
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
                        System.Console.WriteLine("use:");
                        System.Console.WriteLine("\tbackup");
                        System.Console.WriteLine ("\trestore");
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
				System.Console.WriteLine("\tbackup");
				System.Console.WriteLine ("\trestore");
				return;
			}
        }
    }
}
