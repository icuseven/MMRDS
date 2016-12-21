using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.QueryParsers;
using Lucene.Net.Search;
using Lucene.Net.Store;
using Version = Lucene.Net.Util.Version;
namespace mmria.server
{
	public static class LuceneSearch
	{
		static Lucene.Net.Store.Directory directory = 
			FSDirectory.Open(new DirectoryInfo(get_working_directory() + "/lucene-index"));
		static Lucene.Net.Analysis.Analyzer analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);

		public static List<mmria.server.model.home_record> Search(string propertyName, string propertyValue)
		{
			IndexReader indexReader = IndexReader.Open(directory, true);
			Searcher searcher = new IndexSearcher(indexReader);

			var queryParser = new QueryParser(Lucene.Net.Util.Version.LUCENE_30, propertyName, analyzer);
			var query = queryParser.Parse(propertyValue);

			TopDocs resultDocs = searcher.Search(query, indexReader.MaxDoc);

			var topDocs = resultDocs.ScoreDocs;
			List<mmria.server.model.home_record> home_record = new List<mmria.server.model.home_record>();
			foreach (var hit in topDocs)
			{
				var documentFromSerach = searcher.Doc(hit.Doc);
				home_record.Add(new mmria.server.model.home_record
					{
						id = documentFromSerach.Get("id"),
						record_id = documentFromSerach.Get("record_id"),
						first_name = documentFromSerach.Get("first_name"),
						middle_name = documentFromSerach.Get("middle_name"),
						last_name = documentFromSerach.Get("last_name"),
						date_of_death = documentFromSerach.Get("date_of_death"),
						state_of_death = documentFromSerach.Get("state_of_death"),
						agency_case_id = documentFromSerach.Get("agency_case_id"),
						is_valid_maternal_mortality_record = bool.Parse(documentFromSerach.Get("is_valid_maternal_mortality_record")),
						date_created = DateTime.Parse(documentFromSerach.Get("date_created")),
						created_by = documentFromSerach.Get("created_by"),
						date_last_updated = DateTime.Parse(documentFromSerach.Get("date_last_updated")),
						last_updated_by = documentFromSerach.Get("last_updated_by"),
						state_of_last_known_residence = documentFromSerach.Get("state_of_last_known_residence"),
						death_certificate = documentFromSerach.Get("death_certificate"),
						autopsy_report = documentFromSerach.Get("autopsy_report"),
						birth_certificate_parent_section = documentFromSerach.Get("birth_certificate_parent_section"),
						birth_certificate_infant_or_fetal_death_section = documentFromSerach.Get("birth_certificate_infant_or_fetal_death_section"),
						prenatal_care_record = documentFromSerach.Get("prenatal_care_record"),
						other_medical_visits = documentFromSerach.Get("other_medical_visits"),
						er_visits_and_hospitalizations = documentFromSerach.Get("er_visits_and_hospitalizations"),
						social_and_psychological_profile = documentFromSerach.Get("social_and_psychological_profile"),
						informant_interviews = documentFromSerach.Get("informant_interviews"),
						committe_review_worksheet = documentFromSerach.Get("committe_review_worksheet")


					});
			}

			return home_record;
		}

		private static string get_working_directory()
		{
			string result = null;

			if (bool.Parse (System.Configuration.ConfigurationManager.AppSettings ["is_container_based"]))
			{
				result = System.Environment.GetEnvironmentVariable ("file_root_folder");
			}
			else
			{
				result = System.Configuration.ConfigurationManager.AppSettings["file_root_folder"];
			}

			return result;
		}
	}
}

