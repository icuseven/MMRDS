using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace owin
{
	static class CatchFiles
	{
		static string sourceFolder = System.Configuration.ConfigurationManager.AppSettings["SourceFolder"];
		static string sourceDrive = System.Configuration.ConfigurationManager.AppSettings["SourceDriveName"];
		static bool sourceFolderIsNetworkedConnection = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["SourceFolderIsNetworkConnection"]);
		static string sourceFolderUserName = System.Configuration.ConfigurationManager.AppSettings["SourceFolderUserName"];
		static string sourceFolderPassword = System.Configuration.ConfigurationManager.AppSettings["SourceFolderPassword"];


		static string targetFolder = System.Configuration.ConfigurationManager.AppSettings["TargetFolder"];
		static string targetDrive = System.Configuration.ConfigurationManager.AppSettings["TargetDriveName"];
		static string targetUserName = System.Configuration.ConfigurationManager.AppSettings["TargetFolderUserName"];
		static string targetPassword = System.Configuration.ConfigurationManager.AppSettings["TargetFolderPassword"];
		static bool targetFolderIsNetworkedConnection = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["TargetFolderIsNetworkConnection"]);

		static System.IO.DirectoryInfo sourceDirectoryInfo;
		//static System.IO.DirectoryInfo targetDirectoryInfo;

		static bool testNetworkConnectionOnly = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["TestNetworkConnectionOnly"]);
		static bool DeleteUnUsedData = bool.Parse(System.Configuration.ConfigurationManager.AppSettings["DeleteUnUsedData"]);

		public static string WatchedFolder;
		public static string ProcessedFolder;

		static FileSystemWatcher fs;

		internal static void StartWatch()
		{

			try
			{
				if (string.IsNullOrWhiteSpace(sourceFolderUserName) || string.IsNullOrWhiteSpace(sourceFolderPassword))
				{
					sourceFolderPassword = null;
					sourceFolderUserName = null;
				}


				// *** Connect Networked Folder Connections
				if (string.IsNullOrWhiteSpace(targetUserName) || string.IsNullOrWhiteSpace(targetPassword))
				{
					targetPassword = null;
					targetUserName = null;
				}

				if (sourceFolderIsNetworkedConnection)
				{
					//DriveSettings.MapNetworkDrive(sourceDrive, sourceFolder, sourceFolderUserName, sourceFolderPassword);

				}

				if (targetFolderIsNetworkedConnection)
				{
					//DriveSettings.MapNetworkDrive(targetDrive, targetFolder, targetUserName, targetPassword);
				}

			}
			catch (Exception ex)
			{
				System.Console.WriteLine("Exception Encountered: {0}", ex);

			}

			sourceDirectoryInfo = new DirectoryInfo(sourceFolder);

			WatchedFolder = sourceDirectoryInfo.FullName + "\\InputFileFolder";
			ProcessedFolder = sourceDirectoryInfo.FullName + "\\ProcessedFileFolder\\";

			// convert and move any existing files at start up
			//ImageConverter.convertDirectory(WatchedFolder, System.Configuration.ConfigurationManager.AppSettings["TargetFolder"], "tif");


			fs = new FileSystemWatcher
			{
				Path = WatchedFolder,
				NotifyFilter = NotifyFilters.FileName
			};

			fs.Created += fs_Changed;
			fs.Changed += fs_Changed;
			fs.EnableRaisingEvents = true;

		}
		static void fs_Changed(object sender, FileSystemEventArgs e)
		{
			var worker = new MyTaskWorkerDelegate(MyTaskWorker);
			worker.BeginInvoke(e.FullPath, null, null);
		}

		private delegate void MyTaskWorkerDelegate(string SourceFilePath);

		private static void MyTaskWorker(string SourceFilePath)
		{
			try
			{
				//ImageConverter.convertFile(SourceFilePath, System.Configuration.ConfigurationManager.AppSettings["TargetFolder"], "tif");
			}
			catch (Exception ex)
			{
				if (bool.Parse(System.Configuration.ConfigurationManager.AppSettings["WriteErrorsToEventLog"]))
				{
					System.Diagnostics.EventLog.WriteEntry("VendorImageHotFolder", "SourceFilePath: " + SourceFilePath + "\n" + ex.ToString(), System.Diagnostics.EventLogEntryType.Error);
				}

			}

		}

		internal static void DisconnectDrives()
		{
			// *** Disconnect Networked Folder Connections
			if (sourceFolderIsNetworkedConnection)
			{
				//DriveSettings.DisconnectNetworkDrive(sourceDrive, true);
			}

			if (targetFolderIsNetworkedConnection)
			{
				//DriveSettings.DisconnectNetworkDrive(targetDrive, true);
			}
		}

	}
}

