using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace mmria.server.Controllers
{

    [Authorize(Roles = "installation_admin,cdc_admin")]
    public class jurisdictionSummaryController : Controller
    {
        IConfiguration configuration;

        mmria.common.couchdb.ConfigurationSet ConfigDB;

        public jurisdictionSummaryController(IConfiguration p_configuration, mmria.common.couchdb.ConfigurationSet p_config_db)
        {
            configuration = p_configuration;
            ConfigDB = p_config_db;
        }

        public async Task<IActionResult> Index()
        {

            var result = new mmria.server.utils.JurisdictionSummary(configuration, ConfigDB);

            return View(await result.execute());
        }
/*
        public async Task<IActionResult> GenerateReport()
        {
            System.IO.MemoryStream ms = new ();
            using (var sl = new SpreadsheetLight.SLDocument())
            {
                sl.SetCellValue("B3", "I love ASP.NET MVC");
                sl.SaveAs(ms);
            }
            // this is important. Otherwise you get an empty file
            // (because you'd be at EOF after the stream is written to, I think...).
            ms.Position = 0;

            return File(ms, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report.xlsx");
        }
        */

        public async Task<IActionResult> GenerateReport()
        {

            var Template_xlsx = "database-scripts/Template.xlsx";
            var Output_xlsx = System.IO.Path.Combine (configuration["mmria_settings:export_directory"], "Output.xlsx");
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
                for (int rowNumber = 1; rowNumber < 100000; rowNumber++)
                {
                    var cells = new List<FastExcel.Cell>();
                    for (int columnNumber = 1; columnNumber < 13; columnNumber++)
                    {
                        cells.Add(new FastExcel.Cell(columnNumber, columnNumber * System.DateTime.Now.Millisecond));
                    }
                    cells.Add(new FastExcel.Cell(13, "FileFormat" + rowNumber));
                    cells.Add(new FastExcel.Cell(14, "FileFormat Developer Guide"));

                    rows.Add(new FastExcel.Row(rowNumber, cells));
                }
                worksheet.Rows = rows;

                fastExcel.Write(worksheet, "sheet1");
            }

            byte[] fileBytes = GetFile(Output_xlsx);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report.xlsx");;
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
}