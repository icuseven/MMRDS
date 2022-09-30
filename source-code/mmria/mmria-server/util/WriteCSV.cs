using System;
using System.Data;
using System.IO;
using System.Text;
using System.Collections.Generic;

namespace mmria.server.utils;

public class WriteCSV
{
    string file_name;

    public string File_Name { get { return file_name;}}
    string folder_name;

    bool is_excel = false;

    DataTable table;
    public WriteCSV(string p_file_name, string p_folder_name, string p_export_directory, bool p_is_excel)
    {
        //this.folder_name = System.IO.Path.Combine(System.Configuration.ConfigurationManager.AppSettings["export_directory"], p_folder_name);
        this.folder_name = System.IO.Path.Combine(p_export_directory, p_folder_name);
        this.file_name = p_file_name;

        this.is_excel = p_is_excel;
        /*
        var connection = new SqlConnection("Data Source=.\\SQLEXPRESS;AttachDbFilename=E:\\temp\\MyDatabaseData2.MDF;Integrated " +
                                        "Security=True;Connect Timeout=30;User Instance=True");
        var command = new SqlCommand("select * from table_1;", connection);
        var dataAdapter = new SqlDataAdapter(command);
        */
        table = new DataTable("temp_table");

        /*dataAdapter.Fill(table);
        if (table == null)
            System.Console.Write("temp_table is null");
            */
    }

    public DataTable Table { get { return this.table; } }

    public void WriteToStream()
    {
        if(is_excel)
        {
            this.WriteToExcel();
        }
        else
        {
            StreamWriter writer = new StreamWriter(folder_name + "/" + this.file_name);
            this.WriteToStream(writer, true, true);
        }
    }

    private void WriteToStream(TextWriter stream, bool header, bool quoteall)
    {
        if (header)
        {
            for (int i = 0; i < table.Columns.Count; i++)
            {
                WriteItem(stream, table.Columns[i].Caption, quoteall);
                if (i < table.Columns.Count - 1)
                    stream.Write(',');
                else
                    stream.Write('\n');
            }
        }
        foreach (DataRow row in table.Rows)
        {
            for (int i = 0; i < table.Columns.Count; i++)
            {
                WriteItem(stream, row[i], quoteall);
                if (i < table.Columns.Count - 1)
                    stream.Write(',');
                else
                    stream.Write('\n');
            }
        }
        stream.Flush();
        stream.Close();
    }

    private void WriteItem(TextWriter stream, object item, bool quoteall)
    {
        if (item == null)
            return;
        string s = item.ToString();
        if (quoteall || s.IndexOfAny("\",\x0A\x0D".ToCharArray()) > -1)
            stream.Write("\"" + s.Replace("\"", "\"\"") + "\"");
        else
            stream.Write(s);
        stream.Flush();
    }


    public void WriteToExcel()
    {
        FastExcel.Row ConvertToDetail(int p_row_number, System.Data.DataRow item)
        {


            var cells = new List<FastExcel.Cell>();

            for (int i = 0; i < table.Columns.Count; i++)
            {

                cells.Add
                (
                    new FastExcel.Cell
                    (
                        i + 1, 
                        item[table.Columns[i].ColumnName]
                    )
                );

            }
            return new FastExcel.Row(p_row_number, cells);

        }   

        var Template_xlsx = "database-scripts/Template.xlsx";
        var Output_xlsx = System.IO.Path.Combine (folder_name, file_name.Replace(".csv",".xlsx"));

        if(Output_xlsx.StartsWith("/home/net_core_user/app/workdir/mmria-export"))
        {
            Template_xlsx = "/opt/app-root/src/source-code/mmria/mmria-server/database-scripts/Template.xlsx";
        }
        

/*

        var Template_xlsx = "Template.xlsx";
        var Output_xlsx = "Output.xlsx";
*/
        if(System.IO.File.Exists(Output_xlsx))
            System.IO.File.Delete(Output_xlsx);

        using (FastExcel.FastExcel fastExcel = new FastExcel.FastExcel(new System.IO.FileInfo(Template_xlsx), new System.IO.FileInfo(Output_xlsx)))
        {
            //Create a worksheet with some rows
            var worksheet = new FastExcel.Worksheet();
            var rows = new System.Collections.Generic.List<FastExcel.Row>();

            var row_number = 1;

            fastExcel.Write(table, "sheet1");

/*
            var total = new mmria.server.utils.JurisdictionSummaryItem();



            var header = new List<FastExcel.Cell>();

            for (int i = 0; i < table.Columns.Count; i++)
            {
                header.Add
                (
                    new FastExcel.Cell
                    (
                        i + 1, 
                        table.Columns[i].Caption
                    )
                );

            }
            rows.Add(new FastExcel.Row(row_number, header));

    

            foreach (var item in table.Rows)
            {

            row_number+=1;
            var footer = new List<FastExcel.Cell>();
            footer.Add(new FastExcel.Cell(1, ""));
            footer.Add(new FastExcel.Cell(2, "Total"));
            footer.Add(new FastExcel.Cell(3, ""));
            footer.Add(new FastExcel.Cell(4, total.num_recs));
            footer.Add(new FastExcel.Cell(5, total.num_users_unq));
            footer.Add(new FastExcel.Cell(6, total.num_users_ja));
            footer.Add(new FastExcel.Cell(7, total.num_users_abs));
            footer.Add(new FastExcel.Cell(8, total.num_user_anl));
            footer.Add(new FastExcel.Cell(9, total.num_user_cm));
            rows.Add(new FastExcel.Row(row_number, footer));

            worksheet.Rows = rows;

            fastExcel.Write(table, "sheet1");


                row_number+=1;
                
                if(total.num_recs > -1)
                total.num_recs += item.num_recs;

                if(total.num_users_unq > -1)
                total.num_users_unq += item.num_users_unq;
                
                if(total.num_users_ja > -1)
                total.num_users_ja += item.num_users_ja;
                
                if(total.num_users_abs > -1)
                total.num_users_abs += item.num_users_abs;
                
                if(total.num_user_anl > -1)
                total.num_user_anl += item.num_user_anl;
                
                if(total.num_user_cm > -1)
                total.num_user_cm += item.num_user_cm;

                rows.Add(ConvertToDetail(row_number, item));

            }


        }

        byte[] fileBytes = GetFile(Output_xlsx);
        return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlJurisdictionCounts.xlsx");;

        */
        }
    }

    byte[] GetFile(string s)
    {
        byte[] data;
        int br;
        int fs_length;

        using(System.IO.FileStream fs = new System.IO.FileStream (s, System.IO.FileMode.Open, System.IO.FileAccess.Read))
        {
            fs_length = (int) fs.Length;
            data = new byte[fs.Length];
            br = fs.Read(data, 0, data.Length);
        }
        if (br != (int) fs_length)
            throw new System.IO.IOException(s);
        return data;
    }
}

