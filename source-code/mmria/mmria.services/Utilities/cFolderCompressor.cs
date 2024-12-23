﻿using System;
using System.IO;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;

namespace mmria.server.utils;

public sealed class cFolderCompressor
{

	public cFolderCompressor() {}

	public void Compress(string outPathname, string password, string folderName) 
	{

		using(FileStream fsOut = File.Create(outPathname))
		using(ZipOutputStream zipStream = new ZipOutputStream(fsOut))
		{
			zipStream.SetLevel(3); //0-9, 9 being the highest level of compression

			zipStream.Password = password;	// optional. Null is the same as not setting. Required if using AES.

			int folderOffset = folderName.Length + (folderName.EndsWith("\\") ? 0 : 1);

			CompressFolder(folderName, zipStream, folderOffset);

			zipStream.IsStreamOwner = true;	// Makes the Close also Close the underlying stream
			zipStream.Close();
		}
	}

	private void CompressFolder(string path, ZipOutputStream zipStream, int folderOffset) 
	{
		string[] files = Directory.GetFiles(path);

		foreach (string filename in files) 
		{

			FileInfo fi = new FileInfo(filename);

			string entryName = filename.Substring(folderOffset); // Makes the name in zip based on the folder
			entryName = ZipEntry.CleanName(entryName); // Removes drive from name and fixes slash direction
			ZipEntry newEntry = new ZipEntry(entryName);
			newEntry.DateTime = fi.LastWriteTime; // Note the zip format stores 2 second granularity

			// Specifying the AESKeySize triggers AES encryption. Allowable values are 0 (off), 128 or 256.
			// A password on the ZipOutputStream is required if using AES.
			//   newEntry.AESKeySize = 256;

			// To permit the zip to be unpacked by built-in extractor in WinXP and Server2003, WinZip 8, Java, and other older code,
			// you need to do one of the following: Specify UseZip64.Off, or set the Size.
			// If the file may be bigger than 4GB, or you do not need WinXP built-in compatibility, you do not need either,
			// but the zip will be in Zip64 format which not all utilities can understand.
			//   zipStream.UseZip64 = UseZip64.Off;
			newEntry.Size = fi.Length;
			//try
			//{
				zipStream.PutNextEntry(newEntry);

				byte[ ] buffer = new byte[4096];
				using (FileStream streamReader = File.OpenRead(path: filename)) 
				{
					StreamUtils.Copy(streamReader, zipStream, buffer);
				}
				zipStream.CloseEntry();
			/*}
			catch(Exception ex)
			{
				System.Console.WriteLine(ex);
			}*/
		}
		
		string[ ] folders = Directory.GetDirectories(path);
		foreach (string folder in folders) 
		{
			CompressFolder(folder, zipStream, folderOffset);
		}
	}
}


