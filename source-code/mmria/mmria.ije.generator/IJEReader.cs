using mmria.services.vitalsimport;
public class IJEReader
{
    string path = "";

    public IJEReader(string p_path)
    {
        path = p_path;
    }


    public execute()
    {

    }
    private void Process_Message(mmria.common.ije.NewIJESet_Message message)
    {

    }
    
    private void Process_Message(RecordUpload_Message message)
    {
        Console.WriteLine("Message Process kicked off");
        try
        {
            if (message?.filenames != null && message.filenames.Any())
            {
                var now = DateTime.Now.ToString("MMddyy_Hmmss");

                foreach (var name in message.filenames)
                {
                    string filename = Path.Combine(message.location, name);

                    using (var fs = new FileStream(filename, FileMode.Open, FileAccess.Read, FileShare.Delete))
                    {
                        if (filename.ToLower().Contains(".fet"))
                        {
                            var totalRecordLength = FET_File_Record.Record_Length + 2; //Taken From Spreadsheet provided + 2 to account for /r/n

                            ExtractFileAndConvert<FET_File_Record>(fs, totalRecordLength, "FET Extract Results", filename, now);
                        }
                        else if (filename.ToLower().Contains(".mor"))
                        {
                            var totalRecordLength = MOR_File_Record.Record_Length + 2; //Taken From Spreadsheet provided + 2 to account for /r/n

                            ExtractFileAndConvert<MOR_File_Record>(fs, totalRecordLength, "MOR Extract Results", filename, now);
                        }
                        else if (filename.ToLower().Contains(".nat"))
                        {
                            var totalRecordLength = NAT_File_Record.Record_Length + 2; //Taken From Spreadsheet provided + 2 to account for /r/n

                            ExtractFileAndConvert<NAT_File_Record>(fs, totalRecordLength, "NAT Extract Results", filename, now);
                        }
                        else
                        {
                            Console.WriteLine($"File {name}: This file type has no processor associated with it. Will be deleted.");

                        }

                        Console.WriteLine($"File {name}: Processed");
                        File.Delete(filename);
                        Console.WriteLine($"File {name}: Deleted");
                    }
                }
            }
            else
            {
                Console.WriteLine($"Message Contained no files to process");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An exception has occured: {JsonConvert.SerializeObject(ex)}");
            throw;
        }
    }
}